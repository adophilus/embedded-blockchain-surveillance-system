import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import type { Response } from "./types";
import middleware from "./middleware";
import { Container } from "@n8n/di";
import { IotDeviceHeartbeatUseCase } from "./use-case";

const IotDeviceHeartbeatRoute = new Hono().post(
	"/",
	...middleware,
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		const path = c.req.valid("param");
		const body = c.req.valid("json");

		const useCase = Container.get(IotDeviceHeartbeatUseCase);
		const result = await useCase.execute({ ...path, ...body });

		if (result.isErr) {
			response = result.error;
			statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
		} else {
			response = result.value;
			statusCode = StatusCodes.CREATED;
		}

		return c.json(response, statusCode);
	},
);

export default IotDeviceHeartbeatRoute;
