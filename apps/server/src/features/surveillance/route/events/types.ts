import type { types } from "@embedded-blockchain-surveillance-system/api";
import { z } from "zod";

export namespace Request {
	export const path = z.object({
		sessionId: z.string(),
	});

	export type Path = z.infer<typeof path>;
}

export namespace Response {
	type Endpoint = "/surveillance/{sessionId}/events";
	type Method = "get";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "EVENTS_LIST" }>;
	export type Error = Exclude<Response, Success>;
}
