import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { changePassword, editProfile, viewProfile } from "../controllers/profile.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { ChangePasswordSchema, EditProfileSchema } from "../validations/profile.schema";

const profileRouter = Router();
profileRouter.get("/view", requireAuth, viewProfile);
profileRouter.patch("/edit", requireAuth, validationMiddleware("body", EditProfileSchema), editProfile);
profileRouter.put("/password", requireAuth, validationMiddleware("body", ChangePasswordSchema), changePassword);

export default profileRouter;
