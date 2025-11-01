import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { createNonceManager, jsonRpc } from "viem/nonce";
import { privateKeyToAccount } from "viem/accounts";
import type { Chain } from "viem/chains";
import { Wallet } from "./wallet";

export const createWallet = async (
	privateKey: Hex,
	chain: Chain,
): Promise<Wallet> => {
	const nonceManager = createNonceManager({ source: jsonRpc() });
	const account = privateKeyToAccount(privateKey, { nonceManager }) as any;
	const publicClient = createPublicClient({
		chain,
		transport: http(),
	});
	const walletClient = createWalletClient({
		chain,
		transport: http(),
		account,
	});

	return new Wallet(privateKey, publicClient, walletClient);
};
