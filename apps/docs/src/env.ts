import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_NODE_ENV: z.enum(["production", "staging", "development", "test"]),
	},
	server: {},
	runtimeEnv: import.meta.env,
});
