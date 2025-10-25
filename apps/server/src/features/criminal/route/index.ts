import { Hono } from "hono";
import CreateCriminalProfileRoute from "./create";
import GetCriminalProfileByIdRoute from "./get";
import ListCriminalProfilesRoute from "./list";

const CriminalRouter = new Hono()
	.route("/", CreateCriminalProfileRoute)
	.route("/", ListCriminalProfilesRoute)
	.route("/{criminalId}", GetCriminalProfileByIdRoute);

export default CriminalRouter;
