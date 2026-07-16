import { Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { ChangePasswordSchema, ChangePasswordSchemaType, EditProfileSchema, EditProfileSchemaType } from "../validations/profile.schema";

const viewProfile = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const loggedInUser = req.user;

  loggedInUser.password = undefined!;

  res.status(200).json({
    success: true,
    message: "Fetched user profile successfully",
    data: loggedInUser
  });
});

const editProfile = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const { age, gender, about, photoUrl, skills } = await EditProfileSchema.validate(req.body as EditProfileSchemaType, {
    abortEarly: false,
    stripUnknown: true
  });

  const loggedInUser = req.user;

  loggedInUser.age = age;
  loggedInUser.gender = gender;
  loggedInUser.about = about;
  loggedInUser.photoUrl = photoUrl;
  loggedInUser.skills = skills as string[];

  await loggedInUser.save();

  loggedInUser.password = undefined!;

  res.status(200).json({
    success: true,
    message: "Updated profile successfully",
    data: loggedInUser
  });
});

const changePassword = AsyncHandler(async (req, res: Response<ApiResponse>) => {
  const { oldPassword, newPassword } = await ChangePasswordSchema.validate(req.body as ChangePasswordSchemaType, {
    abortEarly: false,
    stripUnknown: true
  });

  const loggedInUser = req.user;

  const isValidPassword = await loggedInUser.validatePassword(oldPassword);
  if (!isValidPassword) {
    throw new ErrorHandler("Invalid Credentials", 401);
  }

  loggedInUser.password = newPassword;

  await loggedInUser.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Updated password successfully"
  });
});

export { changePassword, editProfile, viewProfile };
