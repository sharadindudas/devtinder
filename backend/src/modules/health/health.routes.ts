import { Router } from "express";
import { healthCheck } from "./health.controller";

const healthRouter = Router();

healthRouter.get("/", healthCheck);

export default healthRouter;
