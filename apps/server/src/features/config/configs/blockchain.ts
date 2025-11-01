import { env } from "../env";

const BlockchainConfig = {
	privateKey: env.PRIVATE_KEY,
	systemContractAddress: env.SYSTEM_CONTRACT_ADDRESS
};

export default BlockchainConfig;
