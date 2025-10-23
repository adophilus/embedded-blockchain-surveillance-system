import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import type { Response } from "./types";
import middleware from "./middleware";
import { Container } from "@n8n/di";
import { IotDeviceUploadUseCase } from "./use-case";

const IotDeviceUploadRoute = new Hono().post("/", ...middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const path = c.req.valid("param");
	const body = c.req.valid("json");

	const useCase = Container.get(IotDeviceUploadUseCase);
	const result = await useCase.execute({ ...path, ...body });

	if (result.isErr) {
		response = result.error;
		switch (result.error.code) {
			case "ERR_DEVICE_NOT_FOUND": {
				statusCode = StatusCodes.NOT_FOUND;
				break;
			}
			default: {
				statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
			}
		}
	} else {
		response = result.value;
		statusCode = StatusCodes.OK;
	}

	return c.json(response, statusCode);
});

export default IotDeviceUploadRoute;
