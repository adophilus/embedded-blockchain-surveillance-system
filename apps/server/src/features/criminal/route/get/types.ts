import { z } from "zod";
import type { types } from "@embedded-blockchain-surveillance-system/api";

export namespace Request {
	export const path = z.object({
		criminalId: z.string(),
	});
	export type Path = z.infer<typeof path>;
}

export namespace Response {
	type Endpoint = "/criminals/{criminalId}";
	type Method = "get";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "CRIMINAL_PROFILE_DETAILS" }>;
	export type Error = Exclude<Response, Success>;
}
