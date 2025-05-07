import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { connectionRequestsReceived, allConnections, userFeed } from "../controllers/user.controller";

const userRouter = Router();
userRouter.get("/requests/received", userAuth, connectionRequestsReceived);
userRouter.get("/connections", userAuth, allConnections);
userRouter.get("/feed", userAuth, userFeed);

export default userRouter;
