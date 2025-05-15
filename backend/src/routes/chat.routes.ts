import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { getAllMessages } from "../controllers/chat.controller";

const chatRouter = Router();
chatRouter.get("/:userId", userAuth, getAllMessages);

export default chatRouter;
