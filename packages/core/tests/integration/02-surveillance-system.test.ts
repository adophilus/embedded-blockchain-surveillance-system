import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainSurveillanceSystemDeployer } from "../../src/surveillance-system-deployer/implementation";
import { BlockchainSurveillanceSystem } from "../../src/surveillance-system/implementation";
import { deployerWallet } from "../setup";
import { assert } from "../../src/lib/assert";
import type { Address } from "viem";
import { getUnixTime } from "date-fns";

describe("BlockchainSurveillanceSystem Integration Tests", () => {
	let deployer: BlockchainSurveillanceSystemDeployer;
	let surveillanceSystem: BlockchainSurveillanceSystem;
	let surveillanceSystemContractAddress: Address;
	let surveillanceSessionId = "1";

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

	it("should register a criminal profile", async () => {
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

	it("should create a surveillance session", async () => {
		const startTimestamp = getUnixTime(new Date());
		const endTimestamp = startTimestamp + 3600;

		const result = await surveillanceSystem.createSurveillanceSession(
			surveillanceSessionId,
			"Test Title",
			"Test description",
			BigInt(startTimestamp),
			BigInt(endTimestamp),
			"ACTIVE",
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(surveillanceSessionId);
	});

	it("should get the active surveillance session", async () => {
		const result = await surveillanceSystem.getActiveSurveillanceSession();
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value.id).toBe(surveillanceSessionId);
		expect(result.value.title).toBe("Test Title");
		expect(result.value.description).toBe("Test description");
		expect(result.value.status).toBe("ACTIVE");
	});

	it("should list surveillance sessions", async () => {
		const result = await surveillanceSystem.listSurveillanceSessions();
		assert(result.isOk, "ERR_OPERATION_FAILED");
		assert(result.value.length === 1);
		const firstSession = result.value[0]!;
		expect(firstSession.id).toBe(surveillanceSessionId);
	});

	it("should update a surveillance session status", async () => {
		const result = await surveillanceSystem.updateSurveillanceSessionStatus(
			surveillanceSessionId,
			"COMPLETED",
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");

		const session = await surveillanceSystem.getSurveillanceSession(
			surveillanceSessionId,
		);
		assert(session.isOk, "ERR_OPERATION_FAILED");
		expect(session.value.status).toBe("COMPLETED");
	});

	it("should get a surveillance session by id", async () => {
		const result = await surveillanceSystem.getSurveillanceSession(
			surveillanceSessionId,
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value.id).toBe(surveillanceSessionId);
	});

	it("should record a surveillance event", async () => {
		const eventId = "event-1";
		const result = await surveillanceSystem.recordSurveillanceEvent(
			surveillanceSessionId,
			eventId,
			["1"],
			"QmEventCID",
			"device-001",
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(eventId);
	});

	it("should get a surveillance event by id", async () => {
		const eventId = "event-1";
		const result = await surveillanceSystem.getSurveillanceEvent(eventId);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value.id).toBe(eventId);
	});

	it("should list surveillance events by session", async () => {
		const result = await surveillanceSystem.listSurveillanceEvents();
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value.length).toBe(1);
		expect(result.value[0]?.id).toBe("event-1");
	});

	// test case deliberately being skipped for now
	it("should register an IoT device", async () => {
		const id = "device-001";
		const result = await surveillanceSystem.registerIoTDevice(
			id,
			"Location A",
			"ACTIVE",
			"192.168.1.1",
			BigInt(getUnixTime(new Date())),
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(id);
	});
});
