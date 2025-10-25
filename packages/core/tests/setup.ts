import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { foundry } from "viem/chains";
import { env } from "./env";
import { Wallet } from "../src/wallet";
import { privateKeyToAccount } from "viem/accounts";
import { createNonceManager, jsonRpc } from "viem/nonce";

const chain = foundry;

let deployerWallet: Wallet;

{
	const privateKey = env.PRIVATE_KEY as Hex;
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
	deployerWallet = new Wallet(privateKey, publicClient, walletClient);
}

const sleep = (ms: number): Promise<void> =>
	new Promise((res) => setTimeout(res, ms));

export {
	chain,
	deployerWallet,
	sleep,
};