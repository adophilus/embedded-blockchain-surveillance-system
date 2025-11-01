import { config } from "@/features/config";
import {
	BlockchainSurveillanceSystemDeployer,
	createWallet,
} from "@embedded-blockchain-surveillance-system/core";
import { foundry, polygon } from "viem/chains";

const deploy = async () => {
	const chain = config.environment.DEVELOPMENT ? foundry : polygon;

	const wallet = await createWallet(config.blockchain.privateKey, chain);
	const deployer = new BlockchainSurveillanceSystemDeployer(wallet);

	const res = await deployer.deploySystem();
	if (res.isErr) {
		console.log(res.error);
		console.log("❌ Failed to deploy contracts");
		return;
	}

	const systemContractAddress = res.value;

	console.log(
		`✅ Contracts deployed successfully. Surveillance system contract address: ${systemContractAddress}`,
	);
};

await deploy();
