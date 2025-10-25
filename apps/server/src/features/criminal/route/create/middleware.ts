import { zValidator } from "@/features/http";
import { Request } from "./types";

const middleware = zValidator("form", Request.body);

export default middleware;
