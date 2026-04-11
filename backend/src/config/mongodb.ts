import mongoose from "mongoose";
import { MONGODB_URL } from "./config";
import { logger } from "../utils/logger";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: "devtinder-dev" });
    logger.info("MongoDB is connected successfully");

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err.message);
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Error connecting to MongoDB:", err.message);
    }
    process.exit(1);
  }
};
