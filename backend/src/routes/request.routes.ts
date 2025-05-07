import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { sendConnectionRequest, reviewConnectionRequest } from "../controllers/request.controller";

const requestRouter = Router();
requestRouter.post("/send/:status/:userId", userAuth, sendConnectionRequest);
requestRouter.post("/review/:status/:requestId", userAuth, reviewConnectionRequest);

export default requestRouter;
