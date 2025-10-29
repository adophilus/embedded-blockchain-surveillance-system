import { Hono } from "hono";
import NotificationTokenRouter from "./token/route";

const NotificationRouter = new Hono().route("/token", NotificationTokenRouter);

export default NotificationRouter;
