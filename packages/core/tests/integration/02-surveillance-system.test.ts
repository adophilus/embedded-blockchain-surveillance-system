import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainSurveillanceSystemDeployer } from "../../src/surveillance-system-deployer/implementation";
import { BlockchainSurveillanceSystem } from "../../src/surveillance-system/implementation";
import { deployerWallet } from "../setup";
import { assert } from "../../src/lib/assert";
import type { Address } from "viem";

describe("BlockchainSurveillanceSystem Integration Tests", () => {
	let deployer: BlockchainSurveillanceSystemDeployer;
	let surveillanceSystem: BlockchainSurveillanceSystem;
	let surveillanceSystemContractAddress: Address;

	beforeAll(async () => {
		// Deploy all contracts
		deployer = new BlockchainSurveillanceSystemDeployer(deployerWallet);
		const deployResult = await deployer.deploySystem();
		assert(deployResult.isOk, "ERR_OPERATION_FAILED");
		surveillanceSystemContractAddress = deployResult.value;

		// Initialize SurveillanceSystem with deployer wallet
		surveillanceSystem = new BlockchainSurveillanceSystem(
			deployerWallet,
			surveillanceSystemContractAddress,
		);
	});

	it.only("should register a criminal profile successfully", async () => {
		const result = await surveillanceSystem.registerCriminalProfile(
			"Test Criminal",
			["alias1", "alias2"],
			["offense1", "offense2"],
			"QmTestCID",
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe("1");

		const profile = await surveillanceSystem.getCriminalProfile("1");
		assert(profile.isOk, "ERR_OPERATION_FAILED");
		expect(profile.value.name).toBe("Test Criminal");
	});

	it("should register an IoT device successfully", async () => {
		const result = await surveillanceSystem.registerIoTDevice(
			"device-001",
			"Location A",
			"QmCID1",
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(1);
	});

	it("should create a surveillance session successfully", async () => {
		const result = await surveillanceSystem.createSurveillanceSession("QmCID1");
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(1);
	});
});
