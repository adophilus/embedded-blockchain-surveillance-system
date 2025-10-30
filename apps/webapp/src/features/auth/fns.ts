import Backend from "../backend";
import AuthStore from "./store";

namespace AuthFns {
	export const logout = async () => {
		await Backend.Client.client.request("post", "/auth/logout");

		AuthStore.logout();
	};
}

export default AuthFns;
