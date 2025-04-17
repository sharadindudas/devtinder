import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message.controller.js";

const messageRouter = Router();
messageRouter.get("/get/:userId", userAuth, getMessages);

export default messageRouter;
