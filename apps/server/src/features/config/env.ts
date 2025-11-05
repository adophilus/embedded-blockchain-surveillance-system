import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { isAddress, isHex } from "viem";

export const env = createEnv({
	clientPrefix: "",
	client: {},
	server: {
		NODE_ENV: z.enum(["production", "staging", "development", "test"]),
		SERVER_PORT: z.coerce.number().min(0).max(65535),
		SERVER_URL: z.string().url(),
		DATABASE_URL: z.string(),
		AUTH_TOKEN_SECRET: z.string().min(32),
		VAPID_PUBLIC_KEY: z.string(),
		VAPID_PRIVATE_KEY: z.string(),
		VAPID_SUBJECT: z.string(),
		AI_MODEL_PATH: z.string().min(1),
		WEBAPP_URL: z.string().url(),
		PROVIDER: z.union([z.literal("ONCHAIN"), z.literal("OFFCHAIN")]),
		PINATA_API_KEY: z.string().min(1),
		PINATA_API_SECRET: z.string().min(1),
		PINATA_API_SECRET_JWT: z.string().min(1),
		PINATA_API_GATEWAY: z.string().min(1),
		PRIVATE_KEY: z.string().refine(isHex),
		SYSTEM_CONTRACT_ADDRESS: z.string().refine(isAddress),
	},
	runtimeEnv: process.env,
});
