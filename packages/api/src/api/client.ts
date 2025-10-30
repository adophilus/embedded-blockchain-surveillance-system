import type { ClientOptions } from "openapi-fetch";
import openapiFetchCreateClient from "openapi-fetch";
import { default as openapiFetchCreateReactQueryClient } from "openapi-react-query";
import type { paths } from "./types";

export const createClient = (options: ClientOptions) =>
	openapiFetchCreateClient<paths>(options);

type Client = ReturnType<typeof createClient>;
export const createReactQueryClient = (client: Client) =>
	openapiFetchCreateReactQueryClient(client);
