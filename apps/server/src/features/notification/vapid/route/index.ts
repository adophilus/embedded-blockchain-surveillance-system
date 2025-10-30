import { Hono } from "hono";
import GetVapidPublicKeyRoute from "./get";

const NotificationVapidRouter = new Hono().route(
	"/",
	GetVapidPublicKeyRoute,
);

export default NotificationVapidRouter;
