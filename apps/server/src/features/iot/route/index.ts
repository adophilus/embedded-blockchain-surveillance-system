import { Hono } from "hono";
import IotDeviceHeartbeatRoute from "./heartbeat";
import IotDeviceUploadRoute from "./upload";

const IotDeviceRouter = new Hono()
	.basePath("/stream/{deviceId}")
	.route("/heartbeat", IotDeviceHeartbeatRoute)
	.route("/upload", IotDeviceUploadRoute);

export default IotDeviceRouter;
