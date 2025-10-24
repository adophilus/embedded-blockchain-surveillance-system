import type { types } from "@embedded-blockchain-surveillance-system/api";
import { useMutation } from "@tanstack/react-query";
import Backend from "../backend";
import { toast } from "sonner";
import { redirect } from "@tanstack/react-router";

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
      onSuccess: () => {
        redirect({
          to: "/dashboard",
        });
      },
    });
}

export default AuthHooks;
