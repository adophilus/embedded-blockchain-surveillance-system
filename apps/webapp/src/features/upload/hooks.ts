import { useMutation } from "@tanstack/react-query";
import Backend from "../backend";
import type { types } from "@embedded-blockchain-surveillance-system/api";
import { toast } from "sonner";

export type UseUploadCriminalProfileMutationPayload =
	types.components["schemas"]["Api.Criminal.Create.Request.Body"];

export const useUploadCriminalProfileMutation = () =>
	useMutation({
		mutationFn: async (data: UseUploadCriminalProfileMutationPayload) => {
			const res = await Backend.Client.client.request("post", "/criminals", {
				body: data,
				bodySerializer: Backend.Client.serializers.bodySerializer,
			});

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
		onError: (err) => {
			toast.error(err.message);
		},
		onSuccess: (data) => {
			toast.success(data.code);
		},
	});
