import { Hono } from "hono";
import ListSessionsRoute from "./list";
import GetSessionByIdRoute from "./get";
import ListEventsRoute from "./events";
import GetMetricsRoute from "./metrics";

const SurveillanceRouter = new Hono()
	.route("/", ListSessionsRoute)
	.route("/{sessionId}", GetSessionByIdRoute)
	.route("/{sessionId}/events", ListEventsRoute)
	.route("/metrics", GetMetricsRoute);

export default SurveillanceRouter;
