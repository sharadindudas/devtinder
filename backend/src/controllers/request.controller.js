import { ConnectionRequestModel } from "../models/request.model.js";
import { UserModel } from "../models/user.model.js";
import { AsyncHandler, ErrorHandler } from "../utils/handlers.js";
import { validateReviewConnectionRequest, validateSendConnectionRequest } from "../utils/validations.js";

// Send connection request
const sendConnectionRequest = AsyncHandler(async (req, res, next) => {
    // Get data from request params
    const { status, userId: receiverId } = req.params;

    // Get logged in user's id
    const senderId = req.user._id;

    // Validation of data
    validateSendConnectionRequest(req.params);

    // Check if the receiver exists in the db or not
    const receiverExists = await UserModel.findById(receiverId);
    if (!receiverExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Check if the sender and receiver is different or not
    if (String(senderId) === String(receiverId)) {
        throw new ErrorHandler("You can't send connection request to yourself", 409);
    }

    // Check if the connection request already exists in the db or not
    const connectionRequestExists = await ConnectionRequestModel.findOne({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    });
    if (connectionRequestExists) {
        throw new ErrorHandler("Connection request already exists", 409);
    }

    // Create a new connection request
    const newConnectionRequest = await ConnectionRequestModel.create({
        senderId,
        receiverId,
        status
    });

    // Populate the new connection request
    const connectionRequestData = await newConnectionRequest.populate([
        { path: "senderId", select: "name" },
        { path: "receiverId", select: "name" }
    ]);

    // Return the response
    res.status(201).json({
        success: true,
        message: status === "interested" ? "😏 You made a move" : "😶 Hard pass",
        data: connectionRequestData
    });
});

// Review connection request
const reviewConnectionRequest = AsyncHandler(async (req, res, next) => {
    // Get data from request params
    const { status, requestId } = req.params;

    // Get logged in user's id
    const receiverId = req.user._id;

    // Validation of data
    validateReviewConnectionRequest(req.params);

    // Check if the connection request exists in the db or not
    const connectionRequestExists = await ConnectionRequestModel.findOne({
        _id: requestId,
        status: "interested",
        receiverId
    });
    if (!connectionRequestExists) {
        throw new ErrorHandler("Connection request does not exists", 404);
    }

    // Update the connection request status
    connectionRequestExists.status = status;
    await connectionRequestExists.save({ validateBeforeSave: false });

    // Populate the connection request
    const connectionRequestData = await connectionRequestExists.populate([
        { path: "senderId", select: "name" },
        { path: "receiverId", select: "name" }
    ]);

    // Return the response
    res.status(200).json({
        success: true,
        message: status === "accepted" ? "🎉 It’s a match" : "😬 Rejected. Keep swiping",
        data: connectionRequestData
    });
});

export { sendConnectionRequest, reviewConnectionRequest };
