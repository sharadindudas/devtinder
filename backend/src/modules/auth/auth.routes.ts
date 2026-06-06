import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { googleRedirect, login, logout, signup } from "./auth.controller";
import { LoginSchema, SignupSchema } from "./auth.validator";

const authRouter = Router();
authRouter.post("/signup", validationMiddleware("body", SignupSchema), signup);
authRouter.post("/login", validationMiddleware("body", LoginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/google", googleRedirect);

export default authRouter;
