import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainSurveillanceSystemDeployer } from "../../src/surveillance-system-deployer/implementation";
import { deployerWallet } from "../setup";
import { assert } from "../../src/lib/assert";
import { isAddress } from "viem";

describe("BlockchainSurveillanceSystemDeployer Integration Tests", () => {
	let deployer: BlockchainSurveillanceSystemDeployer;
	let deployedAddress: string;

	beforeAll(() => {
		deployer = new BlockchainSurveillanceSystemDeployer(deployerWallet);
	});

	it("should deploy all surveillance system contracts successfully", async () => {
		const result = await deployer.deploySystem();

		expect(result.isOk).toBe(true);

		if (result.isOk) {
			deployedAddress = result.value;
			expect(deployedAddress).toBeDefined();

			assert(isAddress(deployedAddress), "ERR_OPERATION_FAILED");
		}
	});
});
