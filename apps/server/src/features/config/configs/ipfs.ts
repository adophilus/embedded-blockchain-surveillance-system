import { env } from "../env";

const IpfsConfig = {
	pinata: {
		apiKey: env.PINATA_API_KEY,
		apiSecret: env.PINATA_API_SECRET,
		apiSecretJwt: env.PINATA_API_SECRET_JWT,
		apiGateway: env.PINATA_API_GATEWAY,
	},
};

export default IpfsConfig;
