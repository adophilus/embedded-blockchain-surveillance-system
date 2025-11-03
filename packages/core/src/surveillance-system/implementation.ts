import { type Address, parseEventLogs } from "viem";
import { Result } from "true-myth";
import type { Wallet } from "../wallet";
import type {
	SurveillanceSystem,
	RegisterCriminalProfileError,
	GetCriminalProfileError,
	RegisterIoTDeviceError,
	GetIoTDeviceError,
	CreateSurveillanceSessionError,
	GetSurveillanceSessionError,
	CriminalProfileDetails,
	IoTDeviceDetails,
	SurveillanceSessionDetails,
	ListCriminalProfilesError,
	ListSurveillanceEventsError,
	RecordSurveillanceEventError,
	SurveillanceEventDetails,
	UpdateSurveillanceSessionStatusError,
} from "./interface";

import { IoTDeviceStatus, SessionStatus } from "./interface";

import {
	criminalProfileRegistryAbi,
	ioTDeviceRegistryAbi,
	surveillanceSessionRegistryAbi,
	surveillanceSystemAbi,
	ioTDeviceAbi,
} from "@embedded-blockchain-surveillance-system/contracts/types";

export class BlockchainSurveillanceSystem implements SurveillanceSystem {
	constructor(
		private readonly wallet: Wallet,
		private readonly surveillanceSystemAddress: Address,
	) { }

	private getAccountAddress(): Address {
		return this.wallet.getWalletClient().account!.address;
	}

	// Criminal Profile Management
	public async registerCriminalProfile(
		name: string,
		aliases: string[],
		offenses: string[],
		cid: string,
	): Promise<Result<string, RegisterCriminalProfileError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const criminalProfileRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "criminalProfileRegistry",
			});

			const { request } = await publicClient.simulateContract({
				address: criminalProfileRegistryAddress,
				abi: criminalProfileRegistryAbi,
				functionName: "register",
				args: [name, aliases, offenses, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			const logs = parseEventLogs({
				abi: criminalProfileRegistryAbi,
				logs: receipt.logs,
				eventName: "CriminalProfileRegistered",
			});

			const event = logs.find(
				(log) => log.eventName === "CriminalProfileRegistered",
			);

			if (!event || event.args.id === undefined) {
				return Result.err({
					type: "TransactionFailedError",
					message:
						"Could not find 'CriminalProfileRegistered' event or criminal ID argument in receipt.",
				});
			}

			return Result.ok(event.args.id);
		} catch (e: any) {
			console.error(
				`Write contract call failed for registerCriminalProfile:`,
				e,
			);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getCriminalProfile(
		criminalId: string,
	): Promise<Result<CriminalProfileDetails, GetCriminalProfileError>> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const criminalProfileRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "criminalProfileRegistry",
			});

			const data = await publicClient.readContract({
				address: criminalProfileRegistryAddress,
				abi: criminalProfileRegistryAbi,
				functionName: "findById",
				args: [criminalId],
			});

			const [id, name, aliases, offenses, cid, created_at, updated_at] = data;
			return Result.ok({
				id,
				name,
				aliases,
				offenses,
				cid,
				created_at,
				updated_at,
			});
		} catch (e: any) {
			console.error(`Read contract call failed for getCriminalProfile:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async listCriminalProfiles(): Promise<
		Result<CriminalProfileDetails[], ListCriminalProfilesError>
	> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const criminalProfileRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "criminalProfileRegistry",
			});

			const data = await publicClient.readContract({
				address: criminalProfileRegistryAddress,
				abi: criminalProfileRegistryAbi,
				functionName: "list",
			});

			const [ids, names, aliases, offenses, cids, created_ats, updated_ats] =
				data;
			const profiles: CriminalProfileDetails[] = [];
			for (let i = 0; i < ids.length; i++) {
				const criminalProfile: CriminalProfileDetails = {
					id: ids[i]!,
					name: names[i]!,
					aliases: aliases[i]!,
					offenses: offenses[i]!,
					cid: cids[i]!,
					created_at: created_ats[i]!,
					updated_at: updated_ats[i]!,
				};
				profiles.push(criminalProfile);
			}

			return Result.ok(profiles);
		} catch (e: any) {
			console.error(`Read contract call failed for listCriminalProfiles:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// IoT Device Management
	public async registerIoTDevice(
		device_code: string,
		location: string,
		status: "ACTIVE" | "INACTIVE" | "MAINTENANCE",
		ip_address: string,
		last_heartbeat: bigint,
	): Promise<Result<string, RegisterIoTDeviceError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const iotDeviceRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "iotDeviceRegistry",
			});

			const { request } = await publicClient.simulateContract({
				address: iotDeviceRegistryAddress,
				abi: ioTDeviceRegistryAbi,
				functionName: "register",
				args: [device_code, location, status, ip_address, last_heartbeat],
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			const logs = parseEventLogs({
				abi: ioTDeviceRegistryAbi,
				logs: receipt.logs,
				eventName: "DeviceRegistered",
			});

			const event = logs.find((log) => log.eventName === "DeviceRegistered");

			if (!event || event.args.id === undefined) {
				return Result.err({
					type: "TransactionFailedError",
					message:
						"Could not find 'DeviceRegistered' event or device ID argument in receipt.",
				});
			}

			return Result.ok(event.args.id);
		} catch (e: any) {
			console.error(`Write contract call failed for registerIoTDevice:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getIoTDevice(
		deviceId: string,
	): Promise<Result<IoTDeviceDetails, GetIoTDeviceError>> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const iotDeviceRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "iotDeviceRegistry",
			});

			const deviceAddress = await publicClient.readContract({
				address: iotDeviceRegistryAddress,
				abi: ioTDeviceRegistryAbi,
				functionName: "findById",
				args: [deviceId],
			});

			const [id, device_code, location, status, ip_address, last_heartbeat] =
				await publicClient.readContract({
					address: deviceAddress,
					abi: ioTDeviceAbi,
					functionName: "get",
				});

			const statusString = Object.keys(IoTDeviceStatus).find(
				(key) => IoTDeviceStatus[key] === status,
			) as "ACTIVE" | "INACTIVE" | "MAINTENANCE";

			return Result.ok({
				id,
				device_code,
				location,
				status: statusString,
				ip_address,
				last_heartbeat,
			});
		} catch (e: any) {
			console.error(`Read contract call failed for getIoTDevice:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Surveillance Session Management
	public async createSurveillanceSession(
		id: string,
		title: string,
		description: string,
		start_timestamp: bigint,
		end_timestamp: bigint,
		status: "UPCOMING" | "ACTIVE" | "COMPLETED",
	): Promise<Result<string, CreateSurveillanceSessionError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const surveillanceSessionRegistryAddress =
				await publicClient.readContract({
					address: this.surveillanceSystemAddress,
					abi: surveillanceSystemAbi,
					functionName: "surveillanceSessionRegistry",
				});

			const statusEnum = {
				UPCOMING: SessionStatus.UPCOMING,
				ACTIVE: SessionStatus.ACTIVE,
				COMPLETED: SessionStatus.COMPLETED,
			}[status];

			const { request } = await publicClient.simulateContract({
				address: surveillanceSessionRegistryAddress,
				abi: surveillanceSessionRegistryAbi,
				functionName: "create",
				args: [
					id,
					title,
					description,
					start_timestamp,
					end_timestamp,
					statusEnum,
				],
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			const logs = parseEventLogs({
				abi: surveillanceSessionRegistryAbi,
				logs: receipt.logs,
				eventName: "SessionCreated",
			});

			const event = logs.find((log) => log.eventName === "SessionCreated");

			if (!event || event.args.id === undefined) {
				return Result.err({
					type: "TransactionFailedError",
					message:
						"Could not find 'SessionCreated' event or session ID argument in receipt.",
				});
			}

			return Result.ok(event.args.id);
		} catch (e: any) {
			console.error(
				`Write contract call failed for createSurveillanceSession:`,
				e,
			);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getSurveillanceSession(
		sessionId: string,
	): Promise<Result<SurveillanceSessionDetails, GetSurveillanceSessionError>> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const surveillanceSessionRegistryAddress =
				await publicClient.readContract({
					address: this.surveillanceSystemAddress,
					abi: surveillanceSystemAbi,
					functionName: "surveillanceSessionRegistry",
				});

			const sessionAddress = await publicClient.readContract({
				address: surveillanceSessionRegistryAddress,
				abi: surveillanceSessionRegistryAbi,
				functionName: "findById",
				args: [sessionId],
			});

			const [
				id,
				title,
				description,
				start_timestamp,
				end_timestamp,
				status,
				created_at,
				updated_at,
			] = await publicClient.readContract({
				address: sessionAddress,
				abi: surveillanceSessionAbi,
				functionName: "get",
			});

			const statusString = Object.keys(SessionStatus).find(
				(key) => SessionStatus[key] === status,
			) as "UPCOMING" | "ACTIVE" | "COMPLETED";

			return Result.ok({
				id,
				title,
				description,
				start_timestamp,
				end_timestamp,
				status: statusString,
				created_at,
				updated_at,
			});
		} catch (e: any) {
			console.error(`Read contract call failed for getSurveillanceSession:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getActiveSurveillanceSession(): Promise<
		Result<SurveillanceSessionDetails, GetSurveillanceSessionError>
	> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const surveillanceSessionRegistryAddress =
				await publicClient.readContract({
					address: this.surveillanceSystemAddress,
					abi: surveillanceSystemAbi,
					functionName: "surveillanceSessionRegistry",
				});

			const sessionAddress = await publicClient.readContract({
				address: surveillanceSessionRegistryAddress,
				abi: surveillanceSessionRegistryAbi,
				functionName: "findActiveSession",
			});

			const [
				id,
				title,
				description,
				start_timestamp,
				end_timestamp,
				status,
				created_at,
				updated_at,
			] = await publicClient.readContract({
				address: sessionAddress,
				abi: surveillanceSessionAbi,
				functionName: "get",
			});

			const statusString = Object.keys(SessionStatus).find(
				(key) => SessionStatus[key] === status,
			) as "UPCOMING" | "ACTIVE" | "COMPLETED";

			return Result.ok({
				id,
				title,
				description,
				start_timestamp,
				end_timestamp,
				status: statusString,
				created_at,
				updated_at,
			});
		} catch (e: any) {
			console.error(
				`Read contract call failed for getActiveSurveillanceSession:`,
				e,
			);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async listSurveillanceSessions(): Promise<
		Result<SurveillanceSessionDetails[], ListSurveillanceSessionsError>
	> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const surveillanceSessionRegistryAddress =
				await publicClient.readContract({
					address: this.surveillanceSystemAddress,
					abi: surveillanceSystemAbi,
					functionName: "surveillanceSessionRegistry",
				});

			const sessionAddresses = await publicClient.readContract({
				address: surveillanceSessionRegistryAddress,
				abi: surveillanceSessionRegistryAbi,
				functionName: "list",
			});

			const sessions: SurveillanceSessionDetails[] = [];
			for (const sessionAddress of sessionAddresses) {
				const [
					id,
					title,
					description,
					start_timestamp,
					end_timestamp,
					status,
					created_at,
					updated_at,
				] = await publicClient.readContract({
					address: sessionAddress,
					abi: surveillanceSessionAbi,
					functionName: "get",
				});

				const statusString = Object.keys(SessionStatus).find(
					(key) => SessionStatus[key] === status,
				) as "UPCOMING" | "ACTIVE" | "COMPLETED";

				sessions.push({
					id,
					title,
					description,
					start_timestamp,
					end_timestamp,
					status: statusString,
					created_at,
					updated_at,
				});
			}

			return Result.ok(sessions);
		} catch (e: any) {
			console.error(
				`Read contract call failed for listSurveillanceSessions:`,
				e,
			);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async updateSurveillanceSessionStatus(
		sessionId: string,
		status: "UPCOMING" | "ACTIVE" | "COMPLETED",
	): Promise<Result<void, UpdateSurveillanceSessionStatusError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const surveillanceSessionRegistryAddress =
				await publicClient.readContract({
					address: this.surveillanceSystemAddress,
					abi: surveillanceSystemAbi,
					functionName: "surveillanceSessionRegistry",
				});

			const sessionAddress = await publicClient.readContract({
				address: surveillanceSessionRegistryAddress,
				abi: surveillanceSessionRegistryAbi,
				functionName: "findById",
				args: [sessionId],
			});

			const statusEnum = {
				UPCOMING: SessionStatus.UPCOMING,
				ACTIVE: SessionStatus.ACTIVE,
				COMPLETED: SessionStatus.COMPLETED,
			}[status];

			const { request } = await publicClient.simulateContract({
				address: sessionAddress,
				abi: surveillanceSessionAbi,
				functionName: "updateStatus",
				args: [statusEnum],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(
				`Write contract call failed for updateSurveillanceSessionStatus:`,
				e,
			);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async listSurveillanceEvents(
		sessionId: string,
	): Promise<Result<SurveillanceEventDetails[], ListSurveillanceEventsError>> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const surveillanceEventRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "surveillanceEventRegistry",
			});

			const events = await publicClient.readContract({
				address: surveillanceEventRegistryAddress,
				abi: surveillanceEventRegistryAbi,
				functionName: "listBySessionId",
				args: [sessionId],
			});

			return Result.ok(
				events.map((e) => ({
					...e,
					criminal_profile_ids: e.criminal_profile_ids.map((id) => String(id)),
				})),
			);
		} catch (e: any) {
			console.error(`Read contract call failed for listSurveillanceEvents:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async recordSurveillanceEvent(
		sessionId: string,
		id: string,
		criminal_profile_ids: string[],
		cid: string,
		device_code: string,
	): Promise<Result<string, RecordSurveillanceEventError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const surveillanceEventRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "surveillanceEventRegistry",
			});

			const { request } = await publicClient.simulateContract({
				address: surveillanceEventRegistryAddress,
				abi: surveillanceEventRegistryAbi,
				functionName: "recordEvent",
				args: [id, sessionId, criminal_profile_ids, cid, device_code],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(id);
		} catch (e: any) {
			console.error(
				`Write contract call failed for recordSurveillanceEvent:`,
				e,
			);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getSurveillanceEvent(
		eventId: string,
	): Promise<Result<SurveillanceEventDetails, GetSurveillanceEventError>> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const surveillanceEventRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "surveillanceEventRegistry",
			});

			const event = await publicClient.readContract({
				address: surveillanceEventRegistryAddress,
				abi: surveillanceEventRegistryAbi,
				functionName: "findById",
				args: [eventId],
			});

			return Result.ok({
				...event,
				criminal_profile_ids: event.criminal_profile_ids.map((id) =>
					String(id),
				),
			});
		} catch (e: any) {
			console.error(`Read contract call failed for getSurveillanceEvent:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}
}
