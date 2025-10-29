import { z } from "zod";
import {
	type types,
	schema as apiSchema,
} from "@embedded-blockchain-surveillance-system/api";

export namespace Request {
	export const body =
		apiSchema.schemas.Api_Notification_Token_Register_Request_Body;
	export type Body = z.infer<typeof body>;
}

export namespace Response {
	type Endpoint = "/notification/token/register";
	type Method = "post";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "TOKEN_REGISTERED" }>;
	export type Error = Exclude<Response, Success>;
}
