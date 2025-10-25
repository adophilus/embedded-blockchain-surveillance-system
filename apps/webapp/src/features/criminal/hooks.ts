import { useSuspenseQuery } from "@tanstack/react-query";
import Backend from "../backend";

export const useListCriminals = () =>
	useSuspenseQuery({
		queryKey: ["CRIMINAL", "LIST"],
		queryFn: async () => {
			const res = await Backend.Client.client.request("get", "/criminals", {});

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});
