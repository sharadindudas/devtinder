import { Document, ObjectId, Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

export interface User extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    about: string;
    skills: string[];
    photoUrl: string;
    createdAt: Date;
    updatedAt: Date;
    validatePassword: (password: string) => Promise<boolean>;
    generateJWT: () => string;
}

const userSchema: Schema<User> = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female"],
                message: `{VALUE} is not a valid gender type`
            }
        },
        about: {
            type: String,
            default: "This is the default about section"
        },
        skills: [String],
        photoUrl: {
            type: String,
            default: "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg"
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

// Validate of password
userSchema.methods.validatePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// Generate jwt
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        JWT_SECRET,
        { issuer: "Devtinder", expiresIn: "7d" }
    );
};

export const UserModel = models.User || model<User>("User", userSchema);
