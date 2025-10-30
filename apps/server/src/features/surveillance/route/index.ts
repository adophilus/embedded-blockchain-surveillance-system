import { Hono } from "hono";
import ListSessionsRoute from "./list";
import GetSessionByIdRoute from "./get";
import ListSurveillanceEventsRoute from "./events";
import GetMetricsRoute from "./metrics";
import AuthMiddleware from "@/features/auth/middleware";

const SurveillanceRouter = new Hono()
	.use(AuthMiddleware.middleware)
	.route("/metrics", GetMetricsRoute)
	.route("/:sessionId", GetSessionByIdRoute)
	.route("/:sessionId/events", ListSurveillanceEventsRoute)
	.route("/", ListSessionsRoute);

export default SurveillanceRouter;
