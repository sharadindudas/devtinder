import { ErrorHandler } from "./handlers.js";
import validator from "validator";

const validateSignup = (data) => {
    const { name, email, password, gender, age } = data;

    if (!name || !email || !password || !gender || !age) {
        throw new ErrorHandler("Please provide all the fields", 400);
    }

    if (!validator.isEmail(email)) {
        throw new ErrorHandler("Please provide a valid email address", 400);
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new ErrorHandler(
            "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
            400
        );
    }
};

const validateLogin = (data) => {
    const { email, password } = data;

    if (!validator.isEmail(email)) {
        throw new ErrorHandler("Please provide a valid email address", 400);
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new ErrorHandler(
            "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
            400
        );
    }
};

const validateEditProfile = (data) => {
    const allowedFieldsToEdit = ["gender", "age", "about", "skills", "photoUrl"];
    const isAllowed = Object.keys(data).every((field) => allowedFieldsToEdit.includes(field));
    if (!isAllowed) {
        throw new ErrorHandler("Please provide the valid fields to edit", 400);
    }

    if (data?.skills?.length > 5) {
        throw new ErrorHandler("You can add up to 5 skills only", 400);
    }
};

const validateChangePassword = (data) => {
    const { oldPassword, newPassword } = data;

    if (!validator.isStrongPassword(oldPassword, { minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new ErrorHandler(
            "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
            400
        );
    }

    if (!validator.isStrongPassword(newPassword, { minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new ErrorHandler(
            "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
            400
        );
    }
};

const validateSendConnectionRequest = (data) => {
    const { status } = data;
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
        throw new ErrorHandler("Please provide a valid status type", 400);
    }
};

const validateReviewConnectionRequest = (data) => {
    const { status } = data;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
        throw new ErrorHandler("Please provide a valid status type", 400);
    }
};

export { validateSignup, validateLogin, validateEditProfile, validateChangePassword, validateSendConnectionRequest, validateReviewConnectionRequest };
