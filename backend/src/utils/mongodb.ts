import mongoose from "mongoose";
import { MONGODB_URL } from "../config/config";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, { dbName: "devtinder" });
        console.log("MongoDB is connected successfully");
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error while connecting to mongodb:", err.message);
        }
        process.exit(1);
    }
};
