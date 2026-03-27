import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { connectionRequestsReceived, allConnections, userFeed } from "../controllers/user.controller";

const userRouter = Router();
userRouter.get("/requests/received", requireAuth, connectionRequestsReceived);
userRouter.get("/connections", requireAuth, allConnections);
userRouter.get("/feed", requireAuth, userFeed);

export default userRouter;
