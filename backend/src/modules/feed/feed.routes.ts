import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { getFeed } from "./feed.controller";
import { FeedQuerySchema } from "./feed.validator";

const feedRouter = Router();
feedRouter.get("/", requireAuth, validationMiddleware("query", FeedQuerySchema), getFeed);

export default feedRouter;
