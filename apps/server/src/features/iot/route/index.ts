import { Hono } from "hono";
import IotDeviceHeartbeatRoute from "./heartbeat";

const IotDeviceRouter = new Hono()
	.basePath("/stream/{deviceId}")
	.route("/heartbeat", IotDeviceHeartbeatRoute);

export default IotDeviceRouter;
