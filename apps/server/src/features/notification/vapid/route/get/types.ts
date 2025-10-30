import type { types } from "@embedded-blockchain-surveillance-system/api";

export namespace Request {}

export namespace Response {
	type Endpoint = "/notification/vapid";
	type Method = "get";

	export type Response =
		types.paths[Endpoint][Method]["responses"][keyof types.paths[Endpoint][Method]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "VAPID_PUBLIC_KEY" }>;
	export type Error = Exclude<Response, Success>;
}
