import mongoose from "mongoose";
import { MONGODB_URL } from "../config/config";
import { logger } from "../utils/logger";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, { dbName: "devtinder" });
        logger.info("MongoDB is connected successfully");
    } catch (err) {
        if (err instanceof Error) {
            logger.error("Error while connecting to mongodb:", err.message);
        }
        process.exit(1);
    }
};
