import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { getAllMessages } from "../controllers/chat.controller.js";

const chatRouter = Router();
chatRouter.get("/:userId", userAuth, getAllMessages);

export default chatRouter;
