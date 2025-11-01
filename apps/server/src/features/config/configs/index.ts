import AuthConfig from "./auth";
import AiConfig from "./ai";
import DatabaseConfig from "./database";
import EnvironmentConfig from "./environment";
import ServerConfig from "./server";
import NotificationConfig from "./notification";
import WebappConfig from "./webapp";
import IpfsConfig from "./ipfs";
import BlockchainConfig from "./blockchain";

export default {
	auth: AuthConfig,
	blockchain: BlockchainConfig,
	ai: AiConfig,
	db: DatabaseConfig,
	environment: EnvironmentConfig,
	server: ServerConfig,
	notification: NotificationConfig,
	webapp: WebappConfig,
	ipfs: IpfsConfig,
};
