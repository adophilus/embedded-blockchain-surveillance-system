import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "",
	client: {},
	server: {
		NODE_ENV: z.enum(["production", "staging", "development", "test"]),
		SERVER_PORT: z.coerce.number().min(0).max(65535),
		SERVER_URL: z.string().url(),
		DATABASE_URL: z.string(),
		AUTH_TOKEN_SECRET: z.string().min(32),
	},
	runtimeEnv: process.env,
});
