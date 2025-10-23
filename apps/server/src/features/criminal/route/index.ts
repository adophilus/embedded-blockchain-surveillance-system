import { Hono } from "hono";
import CreateCriminalProfileRoute from "./create";
import IotDeviceUploadRoute from "./upload";

const CriminalRouter = new Hono()
	.route("/", CreateCriminalProfileRoute)
	.route("/{criminalId}", IotDeviceUploadRoute);

export default CriminalRouter;
