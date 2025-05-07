import { ConnectionRequestModel } from "../models/request.model.js";
import { UserModel } from "../models/user.model.js";
import { AsyncHandler } from "../utils/handlers.js";

const USER_SAFE_DATA = "name gender age photoUrl about skills";

// Received connection requests
const receivedConnectionRequests = AsyncHandler(async (req, res, next) => {
    // Get logged in user's data
    const loggedInUser = req.user;

    // Get all the connection requests received
    const connectionRequestsReceived = await ConnectionRequestModel.find({
        receiverId: loggedInUser._id,
        status: "interested"
    })
        .select("senderId")
        .populate({ path: "senderId", select: USER_SAFE_DATA });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched connection requests received successfully",
        data: connectionRequestsReceived
    });
});

// All Connections
const allConnections = AsyncHandler(async (req, res, next) => {
    // Get logged in user's data
    const loggedInUser = req.user;

    // Get all the connections
    const allConnections = await ConnectionRequestModel.find({
        $or: [
            { senderId: loggedInUser._id, status: "accepted" },
            { receiverId: loggedInUser._id, status: "accepted" }
        ]
    }).populate([
        { path: "senderId", select: USER_SAFE_DATA },
        { path: "receiverId", select: USER_SAFE_DATA }
    ]);

    // Get all the connections data in structured way
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

// Feed
const userFeed = AsyncHandler(async (req, res, next) => {
    // Get logged in user's data
    const loggedInUser = req.user;

    // Get pagination data
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Get all the connections made by the user
    const allConnections = await ConnectionRequestModel.find({
        $or: [{ senderId: loggedInUser._id }, { receiverId: loggedInUser._id }]
    });

    // Filter out the users to hide from the feed
    const usersToHideFromFeed = new Set();
    allConnections.forEach((connection) => {
        usersToHideFromFeed.add(connection.senderId._id.toString());
        usersToHideFromFeed.add(connection.receiverId._id.toString());
    });

    // Add the logged in user to hide from the feed
    usersToHideFromFeed.add(loggedInUser._id.toString());

    // Get all the users except for the ones to hide from feed
    const usersToBeShownOnFeed = await UserModel.find({
        _id: { $nin: Array.from(usersToHideFromFeed) }
    })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

    // Find the total users count for pagination info
    const totalUsers = await UserModel.countDocuments({
        _id: { $nin: Array.from(usersToHideFromFeed) }
    });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all connections successfully",
        data: usersToBeShownOnFeed,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            hasMore: page * limit < totalUsers
        }
    });
});

export { receivedConnectionRequests, allConnections, userFeed };
