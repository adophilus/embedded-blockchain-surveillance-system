import { z } from "zod";
import {
	type types,
	schema as apiSchema,
} from "@embedded-blockchain-surveillance-system/api";

export namespace Request {
	export const body =
		apiSchema.schemas.Api_IoT_Stream_ById_Heartbeat_Request_Body;
	export type Body = z.infer<typeof body>;

	export const path = z.object({
		deviceId: z.string(),
	});
	export type Path = z.infer<typeof path>;
}

export namespace Response {
	type Endpoint = "/iot/stream/{deviceId}/heartbeat";
	type Method = "post";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "HEARTBEAT_RECEIVED" }>;
	export type Error = Exclude<Response, Success>;
}
