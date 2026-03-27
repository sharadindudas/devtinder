import { Document, Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  bio: string;
  avatarUrl: string;
  githubUrl?: string;
  experienceLevel: string;
  skills: string[];
  interests: string[];
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
  validatePassword: (password: string) => Promise<boolean>;
  generateJWT: () => string;
}

const userSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      default: "This is the default bio section"
    },
    avatarUrl: {
      type: String,
      default: "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg"
    },
    githubUrl: {
      type: String
    },
    experienceLevel: {
      type: String,
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: `{VALUE} is not a valid experience level`
      },
      default: "beginner"
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    lastSeenAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.validatePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

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
