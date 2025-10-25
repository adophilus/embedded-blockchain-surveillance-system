import { Pagination } from "@/features/pagination";
import type { types } from "@embedded-blockchain-surveillance-system/api";

export namespace Request {
	export const query = Pagination.schema;
	export type Query = Pagination.Schema;
}

export namespace Response {
	type Endpoint = "/surveillance";
	type Method = "get";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "SESSIONS_LIST" }>;
	export type Error = Exclude<Response, Success>;
}
