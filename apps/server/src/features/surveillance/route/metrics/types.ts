import type { types } from "@embedded-blockchain-surveillance-system/api";

export namespace Request {
	// No request body for metrics endpoint
}

export namespace Response {
	type Endpoint = "/surveillance/metrics";
	type Method = "get";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "SURVEILLANCE_METRICS" }>;
	export type Error = Exclude<Response, Success>;
}
