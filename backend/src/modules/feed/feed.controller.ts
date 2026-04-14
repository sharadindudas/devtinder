import { BlockModel } from "../../models/block.model";
import { ConnectionModel } from "../../models/connection.model";
import { SwipeModel } from "../../models/swipe.model";
import { UserModel } from "../../models/user.model";
import { AsyncHandler } from "../../utils/handlers";
import type { FeedQuerySchema } from "./feed.validator";

export const getFeed = AsyncHandler(async (req, res, next) => {
  const { page, limit } = res.locals.validatedData as FeedQuerySchema;
  const loggedInUser = res.locals.user;

  const pageNumber = page ?? 1,
    limitNumber = limit ?? 10,
    mySkills = loggedInUser.skills,
    myInterests = loggedInUser.interests;

  const [mySwipes, myConnections, myBlocks] = await Promise.all([
    SwipeModel.find({ userId: loggedInUser._id }).select("targetUserId"),
    ConnectionModel.find({ $or: [{ user1: loggedInUser._id }, { user2: loggedInUser._id }] }).select("user1 user2"),
    BlockModel.find({ $or: [{ blockerId: loggedInUser._id }, { blockedId: loggedInUser._id }] }).select("blockerId blockedId")
  ]);

  const swipedUserIds = mySwipes.map((swipe) => swipe.targetUserId);

  const connectionUserIds = myConnections.map((connection) => (connection.user1.equals(loggedInUser._id) ? connection.user2 : connection.user1));

  const blockedUserIds = myBlocks.map((block) => (block.blockerId.equals(loggedInUser._id) ? block.blockedId : block.blockerId));

  const excludedUserIds = [
    ...new Map([loggedInUser._id, ...swipedUserIds, ...connectionUserIds, ...blockedUserIds].map((id) => [id.toString(), id])).values()
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
