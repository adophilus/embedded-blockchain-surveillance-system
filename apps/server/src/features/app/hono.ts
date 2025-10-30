import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { StatusCodes } from "@/features/http";
import type { Logger } from "@/features/logger";
import AuthRouter from "@/features/auth/route";
import type App from "./interface";
import IotDeviceRouter from "@/features/iot/route";
import SurveillanceRouter from "@/features/surveillance/route";
import CriminalRouter from "@/features/criminal/route";
import StorageRouter from "@/features/storage/route";
import NotificationRouter from "@/features/notification/route";
import { config } from "@/features/config";

class HonoApp implements App {
	constructor(private logger: Logger) {}

	create() {
		const ApiRouter = new Hono()
			.route("/auth", AuthRouter)
			.route("/iot", IotDeviceRouter)
			.route("/surveillance", SurveillanceRouter)
			.route("/criminals", CriminalRouter)
			.route("/storage", StorageRouter)
			.route("/notification", NotificationRouter);

		return new Hono()
			.use(compress())
			.use(cors({ origin: [config.webapp.url], credentials: true }))
			.use(honoLogger())
			.route("/", ApiRouter)
			.get("/", (c) =>
				c.json({ message: "Welcome to the API" }, StatusCodes.OK),
			)
			.notFound((c) => c.json({ error: "NOT_FOUND" }, StatusCodes.NOT_FOUND))
			.onError((err, c) => {
				this.logger.error("An unexpected error occurred:", err);
				return c.json(
					{ code: "ERR_UNEXPECTED" },
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			});
	}
}

export default HonoApp;
