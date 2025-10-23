import { env } from "@/lib/env";
import {
	createClient,
	createReactQueryClient,
} from "@embedded-blockchain-surveillance-system/api";

namespace BackendClient {
	export const client = createClient(env.VITE_SERVER_URL);
	export const $api = createReactQueryClient(client);
}

export default BackendClient;
