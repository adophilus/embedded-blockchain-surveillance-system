import { defineConfig } from "@wagmi/cli";
import type { Abi } from "viem";
import CandidateRegistry from "@embedded-blockchain-surveillance-system/contracts/CandidateRegistry.sol/CandidateRegistry.json" with {
	type: "json",
};
import Election from "@embedded-blockchain-surveillance-system/contracts/Election.sol/Election.json" with {
	type: "json",
};
import Party from "@embedded-blockchain-surveillance-system/contracts/Party.sol/Party.json" with {
	type: "json",
};
import VoterRegistry from "@embedded-blockchain-surveillance-system/contracts/VoterRegistry.sol/VoterRegistry.json" with {
	type: "json",
};
import VotingSystem from "@embedded-blockchain-surveillance-system/contracts/VotingSystem.sol/VotingSystem.json" with {
	type: "json",
};
import ElectionRegistry from "@embedded-blockchain-surveillance-system/contracts/ElectionRegistry.sol/ElectionRegistry.json" with {
	type: "json",
};
import PartyRegistry from "@embedded-blockchain-surveillance-system/contracts/PartyRegistry.sol/PartyRegistry.json" with {
	type: "json",
};

export default defineConfig({
	out: "./build/types.ts",
	contracts: [
		{ name: "CandidateRegistry", abi: CandidateRegistry.abi as Abi },
		{ name: "Election", abi: Election.abi as Abi },
		{ name: "Party", abi: Party.abi as Abi },
		{ name: "VoterRegistry", abi: VoterRegistry.abi as Abi },
		{ name: "VotingSystem", abi: VotingSystem.abi as Abi },
		{ name: "ElectionRegistry", abi: ElectionRegistry.abi as Abi },
		{ name: "PartyRegistry", abi: PartyRegistry.abi as Abi },
	],
	plugins: [],
});
