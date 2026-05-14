import { redis } from "../../config/redis";
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
    .populate("user1", "name email avatar skills interests")
    .populate("user2", "name email avatar skills interests");

  const allConnectionsData = allConnections.map((connection) => {
    const matchProfile = connection.user1._id.equals(loggedInUser._id) ? connection.user2 : connection.user1;
    return {
      connectionId: connection._id,
      createdAt: connection.createdAt,
      profile: matchProfile
    };
  });

  sendResponse(res, 200, "Fetched all connections successfully", allConnectionsData);
});

export const removeConnection = AsyncHandler(async (req, res, next) => {
  const { connectionId } = res.locals.params as RemoveConnectionSchema;
  const loggedInUser = res.locals.user;

  const updatedConnection = await ConnectionModel.findOneAndUpdate(
    {
      _id: connectionId,
      $or: [{ user1: loggedInUser._id }, { user2: loggedInUser._id }],
      status: "accepted"
    },
    { $set: { status: "blocked" } },
    { new: true }
  );

  if (!updatedConnection) {
    throw new ErrorHandler("Connection not found or already removed", 404);
  }

  const user1 = updatedConnection.user1.toString();
  const user2 = updatedConnection.user2.toString();

  const pipeline = redis.pipeline();

  pipeline.srem(`user:${user1}:connections`, user2);
  pipeline.srem(`user:${user2}:connections`, user1);

  pipeline.sadd(`user:${user1}:blocks`, user2);
  pipeline.sadd(`user:${user2}:blocks`, user1);

  pipeline.expire(`user:${user1}:blocks`, 86400);
  pipeline.expire(`user:${user2}:blocks`, 86400);

  await pipeline.exec();

  sendResponse(res, 200, "Connection removed successfully");
});

