import { env } from "@/lib/env";

export namespace Storage {
	export const resolve = (id: string) => {
		return `${env.VITE_SERVER_URL}/storage/${id}`;
	};
}
