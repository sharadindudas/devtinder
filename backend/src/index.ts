import http from "http";
import mongoose from "mongoose";
import app from "./app";
import { PORT, SERVER_URL } from "./config/config";
import { connectMongoDB } from "./config/mongodb";
import { logger } from "./utils/logger";

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err.message);
  process.exit(1);
});

(async () => {
  await connectMongoDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    logger.info(`Server running on ${SERVER_URL}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);

    server.close(async () => {
      logger.info("HTTP server closed");

      await mongoose.connection.close();
      logger.info("MongoDB connection closed");

      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
})();
