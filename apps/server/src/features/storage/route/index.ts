import { Hono } from "hono";
import GetFileRoute from "./get";

const StorageRouter = new Hono().route("/:id", GetFileRoute);

export default StorageRouter;
