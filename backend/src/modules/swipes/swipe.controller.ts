import { ConnectionModel } from "../../models/connection.model";
import { SwipeModel } from "../../models/swipe.model";
import { UserModel } from "../../models/user.model";
import { AsyncHandler, ErrorHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import type { SwipeUserSchema } from "./swipe.validator";

export const swipeUser = AsyncHandler(async (req, res, next) => {
  const { action, targetUserId } = res.locals.validatedData as SwipeUserSchema;
  const loggedInUserId = res.locals.user._id;

  if (loggedInUserId.toString() === targetUserId) {
    throw new ErrorHandler("You cannot swipe on yourself", 400);
  }

  const targetUser = await UserModel.findById(targetUserId);
  if (!targetUser) {
    throw new ErrorHandler("User not found", 404);
  }

  const existingSwipe = await SwipeModel.findOne({
    userId: loggedInUserId,
    targetUserId: targetUser._id
  });
  if (existingSwipe) {
    throw new ErrorHandler("You have already swiped on this user", 409);
  }

  await SwipeModel.create({
    userId: loggedInUserId,
    targetUserId,
    action
  });

  let isMatch = false;
  if (action === "like") {
    const existingSwipe = await SwipeModel.findOne({
      userId: targetUserId,
      targetUserId: loggedInUserId,
      action: "like"
    });

    if (existingSwipe) {
      isMatch = true;

      const [user1, user2] = [loggedInUserId.toString(), targetUserId.toString()].sort();

      await ConnectionModel.create({
        user1,
        user2,
        status: "accepted"
      });
    }
  }

  sendResponse(res, 201, isMatch ? `You matched with ${targetUser.name}!` : `You ${action === "like" ? "liked" : "passed on"} ${targetUser.name}`, {
    isMatch
  });
});
