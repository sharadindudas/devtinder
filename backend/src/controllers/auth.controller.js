import { UserModel } from "../models/user.model.js";
import { AsyncHandler, ErrorHandler } from "../utils/handlers.js";
import { validateLogin, validateSignup } from "../utils/validations.js";

// Signup
const Signup = AsyncHandler(async (req, res, next) => {
    // Get data from request body
    const { name, email, password, gender, age } = req.body;

    // Validation of data
    validateSignup(req.body);

    // Check if the user already exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        throw new ErrorHandler("User already exists", 409);
    }

    // Create a new user
    const newUser = await UserModel.create({
        name,
        email,
        password,
        gender,
        age
    });

    // Remove sensitive data
    newUser.password = undefined;

    // Return the response
    res.status(201).json({
        success: true,
        message: "Registered successfully",
        data: newUser
    });
});

// Login
const Login = AsyncHandler(async (req, res, next) => {
    // Get data from request body
    const { email, password } = req.body;

    // Validation of data
    validateLogin(req.body);

    // Check if the user exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Validate the password
    const isValidPassword = await userExists.validatePassword(password);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 401);
    }

    // Generate jwt
    const token = userExists.generateJwt();

    // Remove sensitive data
    userExists.password = undefined;

    // Set the cookie and return the response
    res.cookie("devtinderToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
        .status(200)
        .json({
            success: true,
            message: "Logged in successfully",
            data: userExists
        });
});

// Logout
const Logout = AsyncHandler(async (req, res, next) => {
    // Clear the cookie and return the response
    res.clearCookie("devtinderToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
        .status(200)
        .json({
            success: true,
            message: "Logged out successfully"
        });
});

export { Signup, Login, Logout };
