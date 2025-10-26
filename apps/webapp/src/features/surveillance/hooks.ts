import { useSuspenseQuery } from "@tanstack/react-query";
import Backend from "../backend";

export const useListSurveillanceSessions = () =>
	useSuspenseQuery({
		queryKey: ["SURVEILLANCE", "SESSION", "LIST"],
		queryFn: async () => {
			const res = await Backend.Client.client.request("get", "/surveillance");

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});

export const useListSurveillanceEvents = (surveillanceSessionId: string) =>
	useSuspenseQuery({
		queryKey: [
			"SURVEILLANCE",
			"SESSION",
			surveillanceSessionId,
			"EVENT",
			"LIST",
		],
		queryFn: async () => {
			const res = await Backend.Client.client.request(
				"get",
				"/surveillance/{sessionId}/events",
				{
					params: {
						path: {
							sessionId: surveillanceSessionId,
						},
					},
				},
			);

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});
