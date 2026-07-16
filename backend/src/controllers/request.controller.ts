import { Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { RequestModel } from "../models/request.model";
import { UserModel } from "../models/user.model";
import {
  ReviewConnectionRequestSchema,
  ReviewConnectionRequestSchemaType,
  SendConnectionRequestSchema,
  SendConnectionRequestSchemaType
} from "../validations/request.schema";

const sendConnectionRequest = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const senderId = req.user._id;

  const { status, userId: receiverId } = await SendConnectionRequestSchema.validate(req.params as SendConnectionRequestSchemaType, {
    abortEarly: false,
    stripUnknown: true
  });

  const receiverExists = await UserModel.findById(receiverId);
  if (!receiverExists) {
    throw new ErrorHandler("User does not exists", 404);
  }

  if (String(senderId) === String(receiverId)) {
    throw new ErrorHandler("You can't send connection request to yourself", 409);
  }

  const connectionRequestExists = await RequestModel.findOne({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  });
  if (connectionRequestExists) {
    throw new ErrorHandler("Connection request already exists", 409);
  }

  const newConnectionRequest = await RequestModel.create({
    senderId,
    receiverId,
    status
  });

  const connectionRequestData = await newConnectionRequest.populate([
    { path: "senderId", select: "name" },
    { path: "receiverId", select: "name" }
  ]);

  res.status(201).json({
    success: true,
    message: status === "interested" ? "😏 You made a move" : "😶 Hard pass",
    data: connectionRequestData
  });
});

const reviewConnectionRequest = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const receiverId = req.user._id;

  const { status, requestId } = await ReviewConnectionRequestSchema.validate(req.params as ReviewConnectionRequestSchemaType, {
    abortEarly: false,
    stripUnknown: true
  });

  const connectionRequestExists = await RequestModel.findOne({
    _id: requestId,
    receiverId,
    status: "interested"
  });
  if (!connectionRequestExists) {
    throw new ErrorHandler("Connection request does not exists", 404);
  }

  connectionRequestExists.status = status;
  await connectionRequestExists.save({ validateBeforeSave: false });

  const connectionRequestData = await connectionRequestExists.populate([
    { path: "senderId", select: "name" },
    { path: "receiverId", select: "name" }
  ]);

  res.status(200).json({
    success: true,
    message: status === "accepted" ? "🎉 It’s a match" : "😬 Rejected. Keep swiping",
    data: connectionRequestData
  });
});

export { sendConnectionRequest, reviewConnectionRequest };
