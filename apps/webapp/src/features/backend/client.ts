import { env } from "@/lib/env";
import {
	createClient,
	createReactQueryClient,
} from "@embedded-blockchain-surveillance-system/api";

namespace BackendClient {
	const bodySerializer = (body: any) => {
		const fd = new FormData();
		for (const name in body) {
			const val = body[name];
			if (Array.isArray(val)) {
				for (const value of val) {
					if (value instanceof File) {
						fd.append(name, value);
					} else {
						if (value !== null) {
							fd.append(name, JSON.stringify(value));
						} else {
							fd.append(name, value);
						}
					}
				}
			} else {
				fd.append(name, val);
			}
		}
		return fd;
	};

	export const client = createClient(env.VITE_SERVER_URL);
	export const $api = createReactQueryClient(client);

	export const serializers = {
		bodySerializer,
	};
}

export default BackendClient;
