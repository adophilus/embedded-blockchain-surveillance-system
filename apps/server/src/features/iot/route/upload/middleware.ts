import { zValidator } from "@/features/http";
import { Request } from "./types";

const middleware = [
	zValidator("param", Request.path),
	zValidator("json", Request.body),
] as const;

export default middleware;
