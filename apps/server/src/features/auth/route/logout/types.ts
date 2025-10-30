import type { types } from "@embedded-blockchain-surveillance-system/api";

export namespace Request {}

export namespace Response {
	type Endpoint = "/auth/logout";
	type Method = "post";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "LOGOUT_SUCCESSFUL" }>;
	export type Error = Exclude<Response, Success>;
}
