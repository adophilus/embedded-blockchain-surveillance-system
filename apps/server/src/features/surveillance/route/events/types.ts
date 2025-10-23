import {
	schema as apiSchema,
	type types,
} from "@embedded-blockchain-surveillance-system/api";
import type { z } from "zod";

export namespace Request {
	export const path = apiSchema.schemas.Api_Surveillance_ById_Path;
	export const query =
		apiSchema.schemas.Api_Surveillance_ById_Event_List_Request_Query;

	export type Path = z.infer<typeof path>;
	export type Query = z.infer<typeof query>;
}

export namespace Response {
	type Endpoint = "/surveillance/{sessionId}/events";
	type Method = "get";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "EVENTS_LIST" }>;
	export type Error = Exclude<Response, Success>;
}
