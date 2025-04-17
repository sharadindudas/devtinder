import { Router } from "express";
import { basicHealthStatus } from "../controllers/health.controller.js";

const healthRouter = Router();
healthRouter.get("/", basicHealthStatus);

export default healthRouter;
