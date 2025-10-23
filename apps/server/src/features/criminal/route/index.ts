import { Hono } from "hono";
import CreateCriminalProfileRoute from "./create";
import GetCriminalProfileByIdRoute from "./get";

const CriminalRouter = new Hono()
	.route("/", CreateCriminalProfileRoute)
	.route("/{criminalId}", GetCriminalProfileByIdRoute);

export default CriminalRouter;
