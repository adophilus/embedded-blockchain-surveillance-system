import { Store } from "@tanstack/store";
import type { User } from "@embedded-blockchain-surveillance-system/server/types";

namespace AuthStore {
	export type UnauthenticatedState = { status: "unauthenticated" };
	export type AuthenticatedState = {
		status: "authenticated";
		user: User.Selectable;
		token: string;
	};
	export type State = UnauthenticatedState | AuthenticatedState;

	export const store = new Store<State>({
		status: "unauthenticated",
	});

	export const login = (data: Omit<AuthenticatedState, "status">) => {
		store.setState({
			...data,
			status: "authenticated",
		});
	};

	export const logout = async () => {
		store.setState({ status: "unauthenticated" });
	};
}

export default AuthStore;
