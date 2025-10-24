import type { types } from "@embedded-blockchain-surveillance-system/api";
import { useMutation } from "@tanstack/react-query";
import Backend from "../backend";
import { toast } from "sonner";
import Auth from ".";
import { useStore } from "@tanstack/react-store";
import { router } from "@/router";
import AuthStore from "./store";

namespace AuthHooks {
	export type UseLoginMutationPayload =
		types.components["schemas"]["Api.Authentication.SignIn.Email.Request.Body"];

	export const useLoginMutation = () =>
		useMutation({
			mutationFn: async (payload: UseLoginMutationPayload) => {
				const res = await Backend.Client.client.request(
					"post",
					"/auth/sign-in",
					{
						body: payload,
					},
				);

				if (res.error) {
					throw new Error(res.error.code);
				}

				return res.data;
			},
			onError: (err) => {
				toast.error(err.message);
			},
			onSuccess: (data) => {
				console.log(data);

				Auth.Store.login(data.data);

				router.navigate({
					to: "/dashboard",
				});
			},
		});

	export const use = () => useStore(AuthStore.store, (state) => state);
	export const useAuthenticated = use as () => AuthStore.AuthenticatedState;
}

export default AuthHooks;
