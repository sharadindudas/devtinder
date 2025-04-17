import { AsyncHandler, ErrorHandler } from "../utils/handlers.js";
import { validateChangePassword, validateEditProfile } from "../utils/validations.js";

// View profile
const viewProfile = AsyncHandler(async (req, res, next) => {
    // Get logged in user's data
    const loggedInUser = req.user;

    // Remove sensitive data
    loggedInUser.password = undefined;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched user profile successfully",
        data: loggedInUser
    });
});

// Edit profile
const editProfile = AsyncHandler(async (req, res, next) => {
    // Get data from request body
    const bodyData = req.body;

    // Validation of data
    validateEditProfile(bodyData);

    // Get logged in user's data
    const loggedInUser = req.user;

    // Edit the user data
    Object.keys(bodyData).forEach((field) => (loggedInUser[field] = bodyData[field]));
    await loggedInUser.save();

    // Remove sensitive data
    loggedInUser.password = undefined;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Updated profile successfully",
        data: loggedInUser
    });
});

// Change password
const changePassword = AsyncHandler(async (req, res, next) => {
    // Get data from request body
    const { oldPassword, newPassword } = req.body;

    // Validation of data
    validateChangePassword(req.body);

    // Get logged in user's data
    const loggedInUser = req.user;

    // Validate the old password
    const isValidPassword = await loggedInUser.validatePassword(oldPassword);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 401);
    }

    // Update the user's password
    loggedInUser.password = newPassword;
    await loggedInUser.save();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Updated password successfully"
    });
});

export { viewProfile, editProfile, changePassword };
