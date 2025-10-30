import { Hono } from "hono";
import NotificationTokenRouter from "./token/route";
import NotificationVapidRouter from "./vapid/route";

const NotificationRouter = new Hono()
	.route("/token", NotificationTokenRouter)
	.route("/vapid", NotificationVapidRouter);

export default NotificationRouter;
