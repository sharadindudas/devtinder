import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { getAllConnections, removeConnection } from "./connection.controller";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { RemoveConnectionSchema } from "./connection.validator";

const connectionRouter = Router();
connectionRouter.get("/", requireAuth, getAllConnections);
connectionRouter.delete("/:connectionId", requireAuth, validationMiddleware("params", RemoveConnectionSchema), removeConnection);

export default connectionRouter;

