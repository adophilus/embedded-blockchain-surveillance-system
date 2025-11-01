import AuthConfig from "./auth";
import AiConfig from "./ai";
import DatabaseConfig from "./database";
import EnvironmentConfig from "./environment";
import ServerConfig from "./server";
import NotificationConfig from "./notification";
import WebappConfig from "./webapp";
import IpfsConfig from "./ipfs";

export default {
	auth: AuthConfig,
	ai: AiConfig,
	db: DatabaseConfig,
	environment: EnvironmentConfig,
	server: ServerConfig,
	notification: NotificationConfig,
	webapp: WebappConfig,
	ipfs: IpfsConfig,
};
