import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { login, logout, signup, verifyGoogle } from "./auth.controller";
import { LoginSchema, SignupSchema, VerifyGoogleSchema } from "./auth.validator";

const authRouter = Router();
authRouter.post("/signup", validationMiddleware("body", SignupSchema), signup);
authRouter.post("/login", validationMiddleware("body", LoginSchema), login);
authRouter.post("/logout", logout);
authRouter.post("/google/verify", validationMiddleware("body", VerifyGoogleSchema), verifyGoogle);

export default authRouter;
