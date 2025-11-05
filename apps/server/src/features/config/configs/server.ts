import { env } from "../env";

const ServerConfig = {
	port: env.SERVER_PORT,
	url: env.SERVER_URL,
	provider: env.PROVIDER,
};

export default ServerConfig;
