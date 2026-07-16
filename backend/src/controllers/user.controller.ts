import { Request, Response } from "express";
import { AsyncHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { RequestModel } from "../models/request.model";
import { UserModel } from "../models/user.model";
import { PaginationSchema } from "../validations/common.schema";

const USER_SAFE_DATA = "name gender age photoUrl about skills";

const connectionRequestsReceived = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const loggedInUser = req.user;

  const allRequestsReceived = await RequestModel.find({
    receiverId: loggedInUser._id,
    status: "interested"
  })
    .select("senderId")
    .populate({ path: "senderId", select: USER_SAFE_DATA });

  res.status(200).json({
    success: true,
    message: "Fetched connection requests received successfully",
    data: allRequestsReceived
  });
});

const allConnections = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const loggedInUser = req.user;

  const allConnections = await RequestModel.find({
    $or: [
      { senderId: loggedInUser._id, status: "accepted" },
      { receiverId: loggedInUser._id, status: "accepted" }
    ]
  }).populate([
    { path: "senderId", select: USER_SAFE_DATA },
    { path: "receiverId", select: USER_SAFE_DATA }
  ]);

  const allConnectionsData = allConnections.map((connection) => {
    if (String(connection.senderId._id) === String(loggedInUser._id)) {
      return connection.receiverId;
    } else {
      return connection.senderId;
    }
  });

  res.status(200).json({
    success: true,
    message: "Fetched all connections successfully",
    data: allConnectionsData
  });
});

const userFeed = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const loggedInUser = req.user;

  const { page, limit } = await PaginationSchema.validate(req.query, { abortEarly: false, stripUnknown: true });
  const skip = (page - 1) * limit;

  const allConnectedUsers = await RequestModel.find({
    $or: [{ senderId: loggedInUser._id }, { receiverId: loggedInUser._id }]
  });

  const usersToHideFromFeed = new Set();
  allConnectedUsers.forEach((connection) => {
    usersToHideFromFeed.add(connection.senderId._id.toString());
    usersToHideFromFeed.add(connection.receiverId._id.toString());
  });
  usersToHideFromFeed.add(loggedInUser._id);

  const usersToBeShownOnFeed = await UserModel.find({
    _id: { $nin: Array.from(usersToHideFromFeed) }
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

  const totalUsers = await UserModel.countDocuments({
    _id: { $nin: Array.from(usersToHideFromFeed) }
  });

  res.status(200).json({
    success: true,
    message: "Fetched feed successfully",
    data: usersToBeShownOnFeed,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      hasMore: page * limit < totalUsers
    }
  });
});

export { connectionRequestsReceived, allConnections, userFeed };
