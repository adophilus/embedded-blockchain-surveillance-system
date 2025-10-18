import {
	type Address,
	type PublicClient,
	type WalletClient,
	type Hex,
	type Abi,
	parseEventLogs,
} from "viem";
import { Result } from "true-myth";
import type { Wallet } from "../wallet";
import type {
	VotingSystem,
	ContractAddresses,
	CandidateDetails,
	PartyDetails,
	ElectionStatus,
	ElectionDetails,
	ElectionResults,
	RegisterVoterError,
	IsVoterVerifiedError,
	RegisterCandidateError,
	UpdateCandidateError,
	GetCandidateError,
	RegisterPartyError,
	UpdatePartyError,
	GetPartyError,
	CreateElectionError,
	GetElectionError,
	StartElectionError,
	EndElectionError,
	GetElectionStatusError,
	CastVoteError,
	HasVotedError,
	GetElectionResultsError,
} from "./interface";

import {
	voterRegistryAbi,
	candidateRegistryAbi,
	partyAbi,
	votingSystemAbi,
	electionAbi,
	electionRegistryAbi,
	partyRegistryAbi,
} from "@blockchain-voting-system/contracts/types";

class BlockchainVotingSystem implements VotingSystem {
	constructor(
		private readonly wallet: Wallet,
		private readonly votingSystemAddress: Address,
	) {}

	private getAccountAddress(): Address {
		return this.wallet.getWalletClient().account!.address;
	}

	// Voter Management - still goes through VotingSystem to get VoterRegistry address
	public async registerVoter(
		voterAddress: Address,
	): Promise<Result<void, RegisterVoterError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			// Get voter registry address from voting system
			const voterRegistryAddress = await publicClient.readContract({
				address: this.votingSystemAddress,
				abi: votingSystemAbi,
				functionName: "voterRegistryAddress",
			});

			const { request } = await publicClient.simulateContract({
				address: voterRegistryAddress,
				abi: voterRegistryAbi,
				functionName: "registerVoter",
				args: [voterAddress],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for registerVoter:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async isVoterVerified(
		voterAddress: Address,
	): Promise<Result<boolean, IsVoterVerifiedError>> {
		try {
			// Get voter registry address from voting system
			const voterRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "voterRegistryAddress",
				});

			const data = await this.wallet.getPublicClient().readContract({
				address: voterRegistryAddress,
				abi: voterRegistryAbi,
				functionName: "isVoterRegistered",
				args: [voterAddress],
			});
			return Result.ok(data);
		} catch (e: any) {
			console.error(`Read contract call failed for isVoterVerified:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Note: registerVoterForElection would need to go to ElectionRegistry or Election contract directly
	// This depends on the new architecture
	public async registerVoterForElection(
		electionId: number,
		voterAddress: Address,
	): Promise<Result<void, RegisterVoterError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			// Get election registry address from voting system
			const electionRegistryAddress = await publicClient.readContract({
				address: this.votingSystemAddress,
				abi: votingSystemAbi,
				functionName: "electionRegistryAddress",
			});

			// Get election address from election registry
			const electionAddress = await publicClient.readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const { request } = await publicClient.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "registerVoterForElection",
				args: [voterAddress],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(
				`Write contract call failed for registerVoterForElection:`,
				e,
			);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Candidate Management - performs the same operations as registerCandidateForParty
	public async registerCandidate(
		partyId: number,
		name: string,
		position: string,
		cid: string,
	): Promise<Result<number, RegisterCandidateError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			// Step 1: Register candidate globally in CandidateRegistry
			const candidateRegistryAddress = await publicClient.readContract({
				address: this.votingSystemAddress,
				abi: votingSystemAbi,
				functionName: "candidateRegistryAddress",
			});

			const { request: registerCandidateRequest } = await publicClient.simulateContract({
				address: candidateRegistryAddress,
				abi: candidateRegistryAbi,
				functionName: "registerCandidate",
				args: [name, position, cid],
				account,
			});

			const registerCandidateHash = await walletClient.writeContract(registerCandidateRequest);
			const registerCandidateReceipt = await publicClient.waitForTransactionReceipt({ hash: registerCandidateHash });

			// Extract candidate ID from CandidateRegistered event in candidate registry
			const candidateLogs = parseEventLogs({
				abi: candidateRegistryAbi,
				logs: registerCandidateReceipt.logs,
				eventName: "CandidateRegistered",
			});

			const candidateRegisteredEvent = candidateLogs.find(
				(log) => log.eventName === "CandidateRegistered",
			);

			if (!candidateRegisteredEvent || candidateRegisteredEvent.args.candidateId === undefined) {
				return Result.err({
					type: "TransactionFailedError",
					message: "Could not find 'CandidateRegistered' event or candidate ID argument in receipt.",
				});
			}

			const candidateId = Number(candidateRegisteredEvent.args.candidateId);

			// Step 2: Register candidate with the specific party
			const partyRegistryAddress = await publicClient.readContract({
				address: this.votingSystemAddress,
				abi: votingSystemAbi,
				functionName: "partyRegistryAddress",
			});

			const partyAddress = await publicClient.readContract({
				address: partyRegistryAddress,
				abi: partyRegistryAbi,
				functionName: "getParty",
				args: [BigInt(partyId)],
			});

			const { request: registerCandidateToPartyRequest } = await publicClient.simulateContract({
				address: partyAddress,
				abi: partyAbi,
				functionName: "registerCandidate",
				args: [BigInt(candidateId)],
				account,
			});

			const registerToPartyHash = await walletClient.writeContract(registerCandidateToPartyRequest);
			await publicClient.waitForTransactionReceipt({ hash: registerToPartyHash });

			// Emit CandidateRegistered event locally to maintain consistency
			// In a real implementation, we might want to return a success result with the candidate ID
			return Result.ok(candidateId);
		} catch (e: any) {
			console.error(`Write contract call failed for registerCandidate:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async updateCandidate(
		partyId: number,
		candidateId: number,
		name: string,
		position: string,
		cid: string,
	): Promise<Result<void, UpdateCandidateError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			// Get candidate registry address from voting system
			const candidateRegistryAddress = await publicClient.readContract({
				address: this.votingSystemAddress,
				abi: votingSystemAbi,
				functionName: "candidateRegistryAddress",
			});

			// Call updateCandidate on the candidate registry contract
			const { request } = await publicClient.simulateContract({
				address: candidateRegistryAddress,
				abi: candidateRegistryAbi,
				functionName: "updateCandidate",
				args: [BigInt(candidateId), name, position, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for updateCandidate:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getCandidate(
		candidateId: number,
	): Promise<Result<CandidateDetails, GetCandidateError>> {
		try {
			// Get candidate registry address from voting system
			const candidateRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "candidateRegistryAddress",
				});

			const data = await this.wallet.getPublicClient().readContract({
				address: candidateRegistryAddress,
				abi: candidateRegistryAbi,
				functionName: "getCandidate",
				args: [BigInt(candidateId)],
			});
			const [id, name, position, cid] = data;
			return Result.ok({ id: Number(id), name, position, cid });
		} catch (e: any) {
			console.error(`Read contract call failed for getCandidate:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Party Management - goes to PartyRegistry directly
	public async registerParty(
		name: string,
		slogan: string,
		logoCid: string,
	): Promise<Result<number, RegisterPartyError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			// Get party registry address from voting system
			const partyRegistryAddress = await publicClient.readContract({
				address: this.votingSystemAddress,
				abi: votingSystemAbi,
				functionName: "partyRegistryAddress",
			});

			const { request } = await publicClient.simulateContract({
				address: partyRegistryAddress,
				abi: partyRegistryAbi,
				functionName: "createParty",
				args: [name, slogan, logoCid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			// --- START: Cleaner Event Decoding using Viem's parseEventLogs ---

			// 1. Decode all logs in the receipt using the Party Registry ABI
			const logs = parseEventLogs({
				abi: partyRegistryAbi,
				logs: receipt.logs,
				eventName: "PartyCreated", // Filter only for this specific event
			});

			// 2. Find the relevant event (assuming there's only one PartyCreated event)
			const partyCreatedEvent = logs.find(
				(log) => log.eventName === "PartyCreated",
			);

			// 3. Extract the partyId argument
			if (!partyCreatedEvent || !partyCreatedEvent.args.partyId) {
				return Result.err({
					type: "TransactionFailedError",
					message:
						"Could not find 'PartyCreated' event or party ID argument in receipt.",
				});
			}

			// Viem returns BigInt for uint256; convert to Number if the function return type mandates it.
			// Note: If you can update your return type to BigInt (BigInt<bigint>) it would be safer.
			const partyId = Number(partyCreatedEvent.args.partyId);

			// --- END: Cleaner Event Decoding ---

			return Result.ok(partyId);
		} catch (e: any) {
			console.error(`Write contract call failed for registerParty:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getParty(
		partyId: number,
	): Promise<Result<PartyDetails, GetPartyError>> {
		try {
			// Get party registry address from voting system
			const partyRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "partyRegistryAddress",
				});

			const partyAddress = await this.wallet.getPublicClient().readContract({
				address: partyRegistryAddress,
				abi: partyRegistryAbi,
				functionName: "getParty",
				args: [BigInt(partyId)],
			});

			// This might need to get party details from the party contract directly
			const name = await this.wallet.getPublicClient().readContract({
				address: partyAddress,
				abi: partyAbi,
				functionName: "name",
			});

			const logoCid = await this.wallet.getPublicClient().readContract({
				address: partyAddress,
				abi: partyAbi,
				functionName: "cid",
			});

			return Result.ok({ id: partyId, name, logoCid, address: partyAddress });
		} catch (e: any) {
			console.error(`Read contract call failed for getParty:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Election Management - goes to ElectionRegistry directly
	public async createElection(
		name: string,
		description: string,
		cid: string,
	): Promise<Result<number, CreateElectionError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			// Get election registry address from voting system
			const electionRegistryAddress = await publicClient.readContract({
				address: this.votingSystemAddress,
				abi: votingSystemAbi,
				functionName: "electionRegistryAddress",
			});

			// We need to listen to the ElectionCreated event to get the ID
			const { request } = await publicClient.simulateContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "createElection",
				args: [name, description, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			// --- START: Cleaner Event Decoding using Viem's parseEventLogs ---

			// 1. Decode all logs in the receipt using the Election Registry ABI
			const logs = parseEventLogs({
				abi: electionRegistryAbi,
				logs: receipt.logs,
				eventName: "ElectionCreated", // Filter only for this specific event
			});

			// 2. Find the relevant event (assuming there's only one ElectionCreated event)
			const electionCreatedEvent = logs.find(
				(log) => log.eventName === "ElectionCreated",
			);

			// 3. Extract the electionId argument
			if (!electionCreatedEvent || !electionCreatedEvent.args.electionId) {
				return Result.err({
					type: "TransactionFailedError",
					message:
						"Could not find 'ElectionCreated' event or election ID argument in receipt.",
				});
			}

			// Viem returns BigInt for uint256; convert to Number if the function return type mandates it.
			// Note: If you can update your return type to BigInt (BigInt<bigint>) it would be safer.
			const electionId = Number(electionCreatedEvent.args.electionId);

			// --- END: Cleaner Event Decoding ---

			return Result.ok(electionId);
		} catch (e: any) {
			console.error(`Write contract call failed for createElection:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getElection(
		electionId: number,
	): Promise<Result<ElectionDetails, GetElectionError>> {
		try {
			// Get election registry address from voting system
			const electionRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "electionRegistryAddress",
				});

			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			// Get election details from the election contract directly
			const name = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "name",
			});

			const description = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "description",
			});

			const startTime = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "startTime",
			});

			const endTime = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "endTime",
			});

			const electionStarted = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "electionStarted",
			});

			const electionEnded = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "electionEnded",
			});

			let status: ElectionStatus = "Pending";
			if (electionStarted && !electionEnded) {
				status = "Active";
			} else if (electionEnded) {
				status = "Ended";
			}

			return Result.ok({
				id: electionId,
				name,
				description,
				startTime: Number(startTime),
				endTime: Number(endTime),
				candidateIds: [], // This needs to be fetched from the party contracts associated with the election
				status,
			});
		} catch (e: any) {
			console.error(`Read contract call failed for getElection:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async startElection(
		electionId: number,
		startTime: number,
		endTime: number,
	): Promise<Result<void, StartElectionError>> {
		try {
			// Get election registry address from voting system
			const electionRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "electionRegistryAddress",
				});

			// Get election address from election registry
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "startElection",
				args: [BigInt(startTime), BigInt(endTime)],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for startElection:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async endElection(
		electionId: number,
	): Promise<Result<void, EndElectionError>> {
		try {
			// Get election registry address from voting system
			const electionRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "electionRegistryAddress",
				});

			// Get election address from election registry
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "endElection",
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for endElection:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getElectionStatus(
		electionId: number,
	): Promise<Result<ElectionStatus, GetElectionStatusError>> {
		try {
			// Get election registry address from voting system
			const electionRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "electionRegistryAddress",
				});

			// Get election address from election registry
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const electionStarted = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "electionStarted",
			});

			const electionEnded = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "electionEnded",
			});

			if (electionStarted && !electionEnded) {
				return Result.ok("Active");
			} else if (electionEnded) {
				return Result.ok("Ended");
			}
			return Result.ok("Pending");
		} catch (e: any) {
			console.error(`Read contract call failed for getElectionStatus:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Voting
	public async castVote(
		electionId: number,
		partyAddress: Address,
		candidateId: number,
	): Promise<Result<void, CastVoteError>> {
		try {
			// Get election registry address from voting system
			const electionRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "electionRegistryAddress",
				});

			// Get election address from election registry
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "vote",
				args: [partyAddress, BigInt(candidateId)],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for castVote:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async hasVoted(
		electionId: number,
		voterAddress: Address,
	): Promise<Result<boolean, HasVotedError>> {
		try {
			// Get election registry address from voting system
			const electionRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "electionRegistryAddress",
				});

			// Get election address from election registry
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const hasVotedResult = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "hasVoted",
				args: [voterAddress],
			});

			return Result.ok(hasVotedResult);
		} catch (e: any) {
			console.error(`Read contract call failed for hasVoted:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Results
	public async getElectionResults(
		electionId: number,
	): Promise<Result<ElectionResults, GetElectionResultsError>> {
		try {
			// Get election registry address from voting system
			const electionRegistryAddress = await this.wallet
				.getPublicClient()
				.readContract({
					address: this.votingSystemAddress,
					abi: votingSystemAbi,
					functionName: "electionRegistryAddress",
				});

			// Get election address from election registry
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const data = (await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "getElectionResults",
			})) as readonly [
				readonly `0x${string}`[],
				readonly bigint[][],
				readonly bigint[][],
			];

			if (!data) {
				return Result.err({
					type: "ContractCallFailedError",
					message: "Contract call/execution failed",
				});
			}

			const [, candidateIds, voteCounts] = data;

			const electionResults: ElectionResults = [];
			if (candidateIds && voteCounts) {
				for (let i = 0; i < candidateIds.length; i++) {
					const candidateIdRow = candidateIds[i];
					const voteCountRow = voteCounts[i];
					if (candidateIdRow && voteCountRow) {
						for (let j = 0; j < candidateIdRow.length; j++) {
							const candidateId = candidateIdRow[j];
							const voteCount = voteCountRow[j];
							if (candidateId !== undefined && voteCount !== undefined) {
								electionResults.push({
									candidateId: Number(candidateId),
									voteCount: Number(voteCount),
								});
							}
						}
					}
				}
			}

			return Result.ok(electionResults);
		} catch (e: any) {
			console.error(`Read contract call failed for getElectionResults:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async updateParty(
		partyId: number,
		name: string,
		logoCid: string,
	): Promise<Result<void, UpdatePartyError>> {
		return Result.err({ type: "UnknownError", message: "Not implemented" });
	}
}

export { BlockchainVotingSystem };
