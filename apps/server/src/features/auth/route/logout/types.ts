import { types } from "@embedded-blockchain-surveillance-system/api";

export namespace Request {
	// No request body for this endpoint
}

export namespace Response {
	type Endpoint = "/auth/logout";
	type Method = "get";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "LOGOUT_SUCCESSFUL" }>;
	export type Error = Exclude<Response, Success>;
}
