import { Router } from "express";
import { getAllMessages } from "../controllers/chat.controller";
import { userAuth } from "../middlewares/auth.middleware";

const chatRouter = Router();
chatRouter.get("/:userId", userAuth, getAllMessages);

export default chatRouter;
