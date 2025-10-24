import { Store } from "@tanstack/store";
import {
	type types,
	schema,
} from "@embedded-blockchain-surveillance-system/api";
import { z } from "zod";

namespace AuthStore {
	type Tokens =
		types.components["schemas"]["Api.Authentication.SignIn.Email.Response.Success.AuthTokens"];
	export type User =
		types.components["schemas"]["Api.Authentication.SignIn.Email.Response.Success.AuthUser"];
	export type UnauthenticatedState = { status: "unauthenticated" };
	export type AuthenticatedState = {
		status: "authenticated";
		user: User;
		tokens: Tokens;
	};
	export type State = UnauthenticatedState | AuthenticatedState;

	const STORAGE_KEY = "embedded-blockchain-surveillance-system-store";

	const authUserSchema =
		schema.schemas.Api_Authentication_SignIn_Email_Response_Success_AuthUser;
	const authTokensSchema =
		schema.schemas.Api_Authentication_SignIn_Email_Response_Success_AuthTokens;

	const stateSchema = z.discriminatedUnion("status", [
		z.object({
			status: z.literal("unauthenticated"),
		}),
		z.object({
			status: z.literal("authenticated"),
			user: authUserSchema,
			tokens: authTokensSchema,
		}),
	]);

	const localStorageData = window.localStorage.getItem(STORAGE_KEY);

	let initialStoreState: State = {
		status: "unauthenticated",
	};

	try {
		if (localStorageData) {
			const jsonLocalStorageData = JSON.parse(localStorageData);
			const parsedState = stateSchema.parse(jsonLocalStorageData);
			initialStoreState = parsedState;
		}
	} catch (err) {
		console.warn("Error while loading auth state from local storage:", err);
	}

	export const store = new Store<State>(initialStoreState);

	export const login = (data: Omit<AuthenticatedState, "status">) => {
		const authState: AuthenticatedState = {
			...data,
			status: "authenticated",
		};
		store.setState(authState);

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
	};

	export const logout = async () => {
		store.setState({ status: "unauthenticated" });

		window.localStorage.removeItem(STORAGE_KEY);
	};
}

export default AuthStore;
