import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { changePassword, editProfile, viewProfile } from "../controllers/profile.controller";

const profileRouter = Router();
profileRouter.get("/view", userAuth, viewProfile);
profileRouter.patch("/edit", userAuth, editProfile);
profileRouter.put("/password", userAuth, changePassword);

export default profileRouter;
