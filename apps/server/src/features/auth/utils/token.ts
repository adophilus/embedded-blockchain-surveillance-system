import { Container } from "@n8n/di";
import { addMinutes } from "date-fns";
import { jwtVerify, SignJWT } from "jose";
import { Result } from "true-myth";
import { config } from "@/features/config";
import { Logger } from "@/features/logger";
import { encode, decode } from "base64-url";

export const generateToken = (): string => {
	return Math.floor(10000 + Math.random() * 90000).toString();
};

const alg = "HS256";
const secret = new TextEncoder().encode(config.auth.token.secret);

export type TokenPayload = {
	user_id: string;
};

export type Tokens = {
	access_token: string;
	refresh_token: string;
};

export type Error = "ERR_INVALID_OR_EXPIRED_TOKEN";

export const generateTokens = async (id: string): Promise<Tokens> => {
	const accessTokenExpiration = addMinutes(
		new Date(),
		config.auth.token.access.expiry,
	);

	const accessToken = await new SignJWT({ user_id: id })
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setExpirationTime(accessTokenExpiration)
		.sign(secret);

	const refreshTokenExpiration = addMinutes(
		new Date(),
		config.auth.token.refresh.expiry,
	);

	const refreshToken = await new SignJWT({ user_id: id })
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setExpirationTime(refreshTokenExpiration)
		.sign(secret);

	return { access_token: accessToken, refresh_token: refreshToken };
};

export const verifyToken = async (
	token: string,
): Promise<Result<TokenPayload, Error>> => {
	const logger = Container.get(Logger);

	try {
		const { payload } = await jwtVerify<TokenPayload>(token, secret);
		return Result.ok(payload);
	} catch (err) {
		logger.error("Failed to verify token:", token, err);
		return Result.err("ERR_INVALID_OR_EXPIRED_TOKEN");
	}
};

export const serializeTokens = (tokens: Tokens) =>
	encode(`${tokens.access_token}:${tokens.refresh_token}`);

export const deserializeTokens = (
	encodedTokens: string,
): Result<Tokens, "INVALID_SERIALIZED_TOKENS"> => {
	const tokens = decode(encodedTokens);
	const splitTokens = tokens.split(":");

	if (splitTokens.length !== 2) return Result.err("INVALID_SERIALIZED_TOKENS");

	return Result.ok({
		access_token: splitTokens[0],
		refresh_token: splitTokens[1],
	});
};
