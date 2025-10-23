import {
	schema as apiSchema,
	type types,
} from "@embedded-blockchain-surveillance-system/api";
import type { z } from "zod";

export namespace Request {
	export const query = apiSchema.schemas.Api_Pagination_Query;

	export type Query = z.infer<typeof query>;
}

export namespace Response {
	type Endpoint = "/surveillance";
	type Method = "get";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "SESSIONS_LIST" }>;
	export type Error = Exclude<Response, Success>;
}
