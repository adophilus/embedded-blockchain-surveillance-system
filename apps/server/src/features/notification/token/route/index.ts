import { Hono } from "hono";
import RegisterNotificationTokenRoute from "./register";

const NotificationTokenRouter = new Hono().route(
	"/register",
	RegisterNotificationTokenRoute,
);

export default NotificationTokenRouter;
