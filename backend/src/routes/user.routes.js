import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { receivedConnectionRequests, allConnections, userFeed } from "../controllers/user.controller.js";

const userRouter = Router();
userRouter.get("/requests/received", userAuth, receivedConnectionRequests);
userRouter.get("/connections", userAuth, allConnections);
userRouter.get("/feed", userAuth, userFeed);

export default userRouter;
