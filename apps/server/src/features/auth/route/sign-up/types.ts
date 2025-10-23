import {
	schema as apiSchema,
	type types,
} from "@embedded-blockchain-surveillance-system/api";
import type { z } from "zod";

export namespace Request {
	export const body = apiSchema.schemas.Api_Authentication_SignUp_Request_Body;

	export type Body = z.infer<typeof body>;
}

export namespace Response {
	type Endpoint = "/auth/sign-up";
	type Method = "post";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "USER_CREATED" }>;
	export type Error = Exclude<Response, Success>;
}
