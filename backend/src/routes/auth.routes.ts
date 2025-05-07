import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller";

const authRouter = Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
