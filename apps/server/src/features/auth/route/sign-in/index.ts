import { Container } from "@n8n/di";
import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import middleware from "./middleware";
import type { Response } from "./types";
import { SignInUseCase } from "./use-case";
import { setCookie } from "hono/cookie";
import { COOKIE_KEY } from "@/types";
import { serializeTokens } from "../../utils/token";
import { config } from "@/features/config";

const SignInRoute = new Hono().post("/", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const payload = c.req.valid("json");

	const useCase = Container.get(SignInUseCase);
	const result = await useCase.execute(payload);

	if (result.isErr) {
		switch (result.error.code) {
			case "ERR_USER_NOT_FOUND": {
				response = result.error;
				statusCode = StatusCodes.NOT_FOUND;
				break;
			}
			case "ERR_INVALID_CREDENTIALS": {
				response = result.error;
				statusCode = StatusCodes.UNAUTHORIZED;
				break;
			}
			case "ERR_USER_NOT_REGISTERED_WITH_PASSWORD": {
				response = result.error;
				statusCode = StatusCodes.UNAUTHORIZED;
				break;
			}
			default: {
				response = result.error;
				statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
				break;
			}
		}
	} else {
		const tokens = serializeTokens(result.value.data.tokens);
		setCookie(c, COOKIE_KEY, tokens, {
			httpOnly: true,
			secure: config.environment.PRODUCTION,
			sameSite: "lax",
			maxAge: 60 * 60 * 24,
			path: "/",
		});

		response = result.value;
		statusCode = StatusCodes.OK;
	}

	return c.json(response, statusCode);
});

export default SignInRoute;
