import { ConnectionModel } from "../../models/connection.model";
import { AsyncHandler, ErrorHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import type { RemoveConnectionSchema } from "./connection.validator";

export const getAllConnections = AsyncHandler(async (req, res, next) => {
  const loggedInUser = res.locals.user;

  const allConnections = await ConnectionModel.find({
    $or: [{ user1: loggedInUser._id }, { user2: loggedInUser._id }],
    status: "accepted"
  })
    .populate("user1", "name email avatarUrl skills interests")
    .populate("user2", "name email avatarUrl skills interests");

  const allConnectionsData = allConnections.map((connection) =>
    connection.user1._id.equals(loggedInUser._id) ? connection.user2 : connection.user1
  );

  sendResponse(res, 200, "Fetched all connections successfully", allConnectionsData);
});

export const removeConnection = AsyncHandler(async (req, res, next) => {
  const { connectionId } = res.locals.validatedData as RemoveConnectionSchema;
  const loggedInUser = res.locals.user;

  const connectionExists = await ConnectionModel.findOne({
    $or: [{ user1: loggedInUser._id }, { user2: loggedInUser._id }],
    _id: connectionId,
    status: "accepted"
  });
  if (!connectionExists) {
    throw new ErrorHandler("Connection not found", 404);
  }

  await ConnectionModel.findByIdAndDelete(connectionId);

  sendResponse(res, 200, "Connection removed successfully");
});

