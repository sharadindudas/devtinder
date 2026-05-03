import mongoose from "mongoose";
import { redis } from "../../config/redis";
import { ConnectionModel } from "../../models/connection.model";
import { SwipeModel } from "../../models/swipe.model";
import { UserModel } from "../../models/user.model";
import { AsyncHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import type { OffsetPaginationSchema } from "../../validations/common";

export const getFeed = AsyncHandler(async (req, res, next) => {
  const { page, limit } = res.locals.validatedData as OffsetPaginationSchema;
  const loggedInUser = res.locals.user;

  const pageNumber = page ?? 1,
    limitNumber = limit ?? 10,
    mySkills = loggedInUser.skills,
    myInterests = loggedInUser.interests;

  const SWIPES_KEY = `user:${loggedInUser._id}:swipes`;
  const CONNECTIONS_KEY = `user:${loggedInUser._id}:connections`;
  const BLOCKS_KEY = `user:${loggedInUser._id}:blocks`;

  const pipeline = redis.pipeline();
  pipeline.smembers(SWIPES_KEY);
  pipeline.smembers(CONNECTIONS_KEY);
  pipeline.smembers(BLOCKS_KEY);

  const results = (await pipeline.exec()) ?? [];

  let swipedUserIds = (results[0]?.[1] as string[]) || [];
  let connectionUserIds = (results[1]?.[1] as string[]) || [];
  let blockedUserIds = (results[2]?.[1] as string[]) || [];

  if (swipedUserIds.length === 0 && connectionUserIds.length === 0 && blockedUserIds.length === 0) {
    const [mySwipes, myConnections] = await Promise.all([
      SwipeModel.find({ userId: loggedInUser._id }).select("targetUserId"),
      ConnectionModel.find({ $or: [{ user1: loggedInUser._id }, { user2: loggedInUser._id }] }).select("user1 user2 status")
    ]);

    swipedUserIds = mySwipes.map((swipe) => swipe.targetUserId.toString());

    myConnections.forEach((connection) => {
      const otherUserId = connection.user1.toString() === loggedInUser._id.toString() ? connection.user2.toString() : connection.user1.toString();

      if (connection.status === "accepted") {
        connectionUserIds.push(otherUserId);
      } else if (connection.status === "blocked") {
        blockedUserIds.push(otherUserId);
      }
    });

    const savePipeline = redis.pipeline();
    if (swipedUserIds.length > 0) savePipeline.sadd(SWIPES_KEY, ...swipedUserIds);
    if (connectionUserIds.length > 0) savePipeline.sadd(CONNECTIONS_KEY, ...connectionUserIds);
    if (blockedUserIds.length > 0) savePipeline.sadd(BLOCKS_KEY, ...blockedUserIds);

    savePipeline.expire(SWIPES_KEY, 86400);
    savePipeline.expire(CONNECTIONS_KEY, 86400);
    savePipeline.expire(BLOCKS_KEY, 86400);

    await savePipeline.exec();
  }

  const excludedUserIds = [
    ...new Map(
      [loggedInUser._id.toString(), ...swipedUserIds, ...connectionUserIds, ...blockedUserIds].map((id) => [id, new mongoose.Types.ObjectId(id)])
    ).values()
  ];

  const feed = await UserModel.aggregate([
    { $match: { _id: { $nin: excludedUserIds } } },
    { $project: { password: 0 } },
    {
      $addFields: {
        skillScore: {
          $size: { $setIntersection: ["$skills", mySkills] }
        },
        interestScore: {
          $size: { $setIntersection: ["$interests", myInterests] }
        }
      }
    },
    {
      $sort: {
        skillScore: -1,
        interestScore: -1,
        lastSeenAt: -1
      }
    },
    { $skip: (pageNumber - 1) * limitNumber },
    { $limit: limitNumber }
  ]);

  sendResponse(res, 200, "Fetched feed successfully", {
    feed,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      hasMore: feed.length === limitNumber
    }
  });
});
