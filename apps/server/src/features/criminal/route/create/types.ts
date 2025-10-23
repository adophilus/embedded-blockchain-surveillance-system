import type { z } from "zod";
import {
	type types,
	schema as apiSchema,
} from "@embedded-blockchain-surveillance-system/api";

export namespace Request {
	export const body = apiSchema.schemas.Api_Criminal_Create_Request_Body;
	export type Body = z.infer<typeof body>;
}

export namespace Response {
	type Endpoint = "/criminals";
	type Method = "post";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<
		Response,
		{ code: "CRIMINAL_PROFILE_UPLOADED" }
	>;
	export type Error = Exclude<Response, Success>;
}
