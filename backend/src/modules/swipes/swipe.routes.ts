import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { swipeUser } from "./swipe.controller";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { SwipeUserSchema } from "./swiper.validator";

const swipeRouter = Router();
swipeRouter.post("/:action/:targetUserId", requireAuth, validationMiddleware("params", SwipeUserSchema), swipeUser);

export default swipeRouter;
