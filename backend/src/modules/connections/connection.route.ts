import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { getAllConnections, removeConnection } from "./connection.controller";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { DeleteConnectionSchema } from "./connection.validator";

const connectionRouter = Router();
connectionRouter.get("/", requireAuth, getAllConnections);
connectionRouter.delete("/:connectionId", requireAuth, validationMiddleware("params", DeleteConnectionSchema), removeConnection);

export default connectionRouter;

