import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { getFeed } from "./feed.controller";
import { OffsetPaginationSchema } from "../../validations/common";

const feedRouter = Router();
feedRouter.get("/", requireAuth, validationMiddleware("query", OffsetPaginationSchema), getFeed);

export default feedRouter;
