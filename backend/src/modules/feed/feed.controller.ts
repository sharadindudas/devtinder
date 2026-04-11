import { Types, type ObjectId } from "mongoose";
import { BlockModel } from "../../models/block.model";
import { ConnectionModel } from "../../models/connection.model";
import { SwipeModel } from "../../models/swipe.model";
import { AsyncHandler } from "../../utils/handlers";
import { UserModel } from "../../models/user.model";
import type { FeedQuerySchema } from "./feed.validator";

export const getFeed = AsyncHandler(async (req, res, next) => {
  const { page, limit } = res.locals.validatedData as FeedQuerySchema;
  const loggedInUser = res.locals.user;

  const pageNumber = page ?? 1;
  const limitNumber = limit ?? 10;

  const loggedInUserId = loggedInUser._id;
  const loggedInUserSkills = res.locals.user.skills;
  const loggedInUserInterests = res.locals.user.interests;

  const existingSwipes = await SwipeModel.find({ userId: loggedInUserId }).select("targetUserId -_id");
  const swipedUserIds = existingSwipes.map((swipe) => swipe.targetUserId);

  const existingConnections = await ConnectionModel.find({ users: loggedInUserId }).select("users -_id");
  const connectionIds = existingConnections
    .map((connection) => connection.users.filter((id: ObjectId) => id.toString() !== loggedInUserId.toString()))
    .flat();

  const existingBlocks = await BlockModel.find({
    $or: [{ blockerId: loggedInUserId }, { blockedId: loggedInUserId }]
  }).select("blockerId blockedId -_id");
  const blockedIds = existingBlocks.map((block) => (block.blockerId.toString() !== loggedInUserId.toString() ? block.blockerId : block.blockedId));

  const excludedUserIds = [...new Set([loggedInUserId.toString(), ...swipedUserIds, ...connectionIds, ...blockedIds].map((id) => id.toString()))];

  const excludedObjectIds = excludedUserIds.map((id) => new Types.ObjectId(id));

  const feed = await UserModel.aggregate([
    { $match: { _id: { $nin: excludedObjectIds } } },
    { $project: { password: 0 } },
    {
      $addFields: {
        skillScore: {
          $size: { $setIntersection: ["$skills", loggedInUserSkills] }
        },
        interestScore: {
          $size: { $setIntersection: ["$interests", loggedInUserInterests] }
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

  res.status(200).json({
    success: true,
    message: "Fetched feed successfully",
    data: {
      feed,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        hasMore: feed.length === limitNumber
      }
    }
  });
});
