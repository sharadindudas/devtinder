import { UserModel } from "../models/user.model";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import type { ChangePasswordSchema, EditProfileSchema } from "../validations/profile.schema";

export const viewProfile = AsyncHandler(async (req, res, next) => {
  const loggedInUser = res.locals.user;

  loggedInUser.password = undefined!;

  res.status(200).json({
    success: true,
    message: "Fetched user profile successfully",
    data: loggedInUser
  });
});

export const editProfile = AsyncHandler(async (req, res, next) => {
  const updateUserPayload = res.locals.validatedData as EditProfileSchema;
  const userId = res.locals.user._id;

  await UserModel.findByIdAndUpdate(userId, updateUserPayload, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    message: "Updated profile successfully"
  });
});

export const changePassword = AsyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = res.locals.validatedData as ChangePasswordSchema;

  const user = res.locals.user;

  const isValidPassword = await user.validatePassword(oldPassword);
  if (!isValidPassword) {
    throw new ErrorHandler("Invalid Credentials", 401);
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Updated password successfully"
  });
});
