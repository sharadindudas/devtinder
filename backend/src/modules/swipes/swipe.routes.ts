import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { swipeUser } from "./swipe.controller";
import { SwipeUserSchema } from "./swipe.validator";

const swipeRouter = Router();
swipeRouter.post("/:action/:targetUserId", requireAuth, validationMiddleware("params", SwipeUserSchema), swipeUser);

export default swipeRouter;
