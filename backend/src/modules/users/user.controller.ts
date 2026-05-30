import { NODE_ENV } from "../../config/config";
import { UserModel } from "../../models/user.model";
import { AsyncHandler, ErrorHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";
import { ChangePasswordSchema, EditProfileSchema } from "./user.validator";

export const viewProfile = AsyncHandler(async (req, res, next) => {
  const loggedInUser = res.locals.user;

  sendResponse(res, 200, "Fetched user profile successfully", loggedInUser);
});

export const editProfile = AsyncHandler(async (req, res, next) => {
  const updateUserPayload = res.locals.body as EditProfileSchema;
  const userId = res.locals.user._id;

  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateUserPayload, { returnDocument: "after", runValidators: true });

  if (!updatedUser) throw new ErrorHandler("User not found", 404);

  sendResponse(res, 200, "Updated profile successfully", updatedUser);
});

export const changePassword = AsyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = res.locals.body as ChangePasswordSchema;

  const user = res.locals.user;

  const isValidPassword = await user.validatePassword(oldPassword);
  if (!isValidPassword) {
    throw new ErrorHandler("Invalid Credentials", 401);
  }

  user.password = newPassword;
  await user.save({ validateModifiedOnly: true });

  sendResponse(res, 200, "Updated password successfully");
});

export const deleteAccount = AsyncHandler(async (req, res, next) => {
  const user = res.locals.user;

  await UserModel.findByIdAndUpdate(user._id, { isDeleted: true, deletedAt: new Date() });

  res.clearCookie("devtinderToken", {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: NODE_ENV === "production"
  });

  sendResponse(res, 200, "Account deleted successfully");
});
