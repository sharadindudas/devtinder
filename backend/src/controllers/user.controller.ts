import { Request, Response } from "express";
import { AsyncHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { ConnectionRequestModel } from "../models/request.model";
import { UserModel } from "../models/user.model";
import { PaginationSchema } from "../validations/common.schema";

const USER_SAFE_DATA = "name gender age photoUrl about skills";

// Connection request received
const connectionRequestsReceived = AsyncHandler(async (req, res: Response<ApiResponse>) => {
    // Get logged in user's data
    const loggedInUser = req.user;

    // Find all the connection requests received
    const allRequestsReceived = await ConnectionRequestModel.find({
        receiverId: loggedInUser._id,
        status: "interested"
    })
        .select("senderId")
        .populate({ path: "senderId", select: USER_SAFE_DATA });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched connection requests received successfully",
        data: allRequestsReceived
    });
});

// All connections
const allConnections = AsyncHandler(async (req, res: Response<ApiResponse>) => {
    // Get logged in user's data
    const loggedInUser = req.user;

    // Find all the connected users
    const allConnections = await ConnectionRequestModel.find({
        $or: [
            { senderId: loggedInUser._id, status: "accepted" },
            { receiverId: loggedInUser._id, status: "accepted" }
        ]
    }).populate([
        { path: "senderId", select: USER_SAFE_DATA },
        { path: "receiverId", select: USER_SAFE_DATA }
    ]);

    // Send only the connected user's data
    const allConnectionsData = allConnections.map((connection) => {
        if (String(connection.senderId._id) === String(loggedInUser._id)) {
            return connection.receiverId;
        } else {
            return connection.senderId;
        }
    });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all connections successfully",
        data: allConnectionsData
    });
});

// User Feed
const userFeed = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get logged in user's data
    const loggedInUser = req.user;

    // Get Pagination data
    const { page, limit } = await PaginationSchema.validate(req.query, { abortEarly: false, stripUnknown: true });
    const skip = (page - 1) * limit;

    // Get all the users connected to logged in user
    const allConnectedUsers = await ConnectionRequestModel.find({
        $or: [{ senderId: loggedInUser._id }, { receiverId: loggedInUser._id }]
    });

    // Hide the connected users from logged in user
    const usersToHideFromFeed = new Set();
    allConnectedUsers.forEach((connection) => {
        usersToHideFromFeed.add(connection.senderId._id.toString());
        usersToHideFromFeed.add(connection.receiverId._id.toString());
    });
    usersToHideFromFeed.add(loggedInUser._id);

    // Show all the users except for the hidden users
    const usersToBeShownOnFeed = await UserModel.find({
        _id: { $nin: Array.from(usersToHideFromFeed) }
    })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

    // Count the total number of users
    const totalUsers = await UserModel.countDocuments({
        _id: { $nin: Array.from(usersToHideFromFeed) }
    });

    // Return the response
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
