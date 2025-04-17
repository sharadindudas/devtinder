import mongoose from "mongoose";
import validator from "validator";
import { ErrorHandler } from "../utils/handlers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Please provide an email address"],
            lowercase: true,
            unique: [true, "User already exists"],
            trim: true,
            validate: function (value) {
                if (!validator.isEmail(value)) {
                    throw new ErrorHandler("Please provide a valid email address", 400);
                }
            }
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            trim: true,
            validate: function (value) {
                if (!validator.isStrongPassword(value, { minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })) {
                    throw new ErrorHandler(
                        "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol",
                        400
                    );
                }
            }
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female"],
                message: `{VALUE} is not a valid gender type`
            },
            required: [true, "Please provide the gender"],
            trim: true
        },
        age: {
            type: Number,
            required: [true, "Please provide the age"],
            min: [18, "You must be at least 18 years old"]
        },
        skills: {
            type: [String],
            trim: true
        },
        about: {
            type: String,
            default: "This is the default about section",
            trim: true
        },
        photoUrl: {
            type: String,
            trim: true,
            default: "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg",
            validate: function (value) {
                if (!validator.isURL(value)) {
                    throw new ErrorHandler("Please provide a valid photo url", 400);
                }
            }
        }
    },
    { timestamps: true, versionKey: false }
);

// Hash the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Validate the password
userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate jwt
userSchema.methods.generateJwt = function () {
    const token = jwt.sign(
        {
            _id: this._id
        },
        JWT_SECRET,
        {
            issuer: "devtinder",
            expiresIn: "7d"
        }
    );
    return token;
};

export const UserModel = mongoose.model("User", userSchema);
