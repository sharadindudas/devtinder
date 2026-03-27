import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { LoginSchema, SignupSchema } from "../validations/auth.schema";

const authRouter = Router();
authRouter.post("/signup", validationMiddleware("body", SignupSchema), signup);
authRouter.post("/login", validationMiddleware("body", LoginSchema), login);
authRouter.post("/logout", logout);

export default authRouter;
