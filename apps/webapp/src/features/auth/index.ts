import AuthStore from "./store";
import AuthHooks from "./hooks";
import AuthFns from "./fns";

namespace Auth {
	export const Store = AuthStore;
	export const Hooks = AuthHooks;
	export const Fns = AuthFns;
}

export default Auth;
