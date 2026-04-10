import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { changePassword, editProfile, viewProfile } from "./user.controller";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { ChangePasswordSchema, EditProfileSchema } from "./user.validator";

const userRouter = Router();
userRouter.get("/view", requireAuth, viewProfile);
userRouter.patch("/edit", requireAuth, validationMiddleware("body", EditProfileSchema), editProfile);
userRouter.put("/password", requireAuth, validationMiddleware("body", ChangePasswordSchema), changePassword);

export default userRouter;
