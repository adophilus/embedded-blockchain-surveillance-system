import { Hono } from "hono";
import ListSessionsRoute from "./list";
import GetSessionByIdRoute from "./get";
import ListSurveillanceEventsRoute from "./events";
import GetMetricsRoute from "./metrics";

const SurveillanceRouter = new Hono()
	.route("/metrics", GetMetricsRoute)
	.route("/:sessionId", GetSessionByIdRoute)
	.route("/:sessionId/events", ListSurveillanceEventsRoute)
	.route("/", ListSessionsRoute);

export default SurveillanceRouter;
