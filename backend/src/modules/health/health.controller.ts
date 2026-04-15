import mongoose from "mongoose";
import { AsyncHandler } from "../../utils/handlers";
import { sendResponse } from "../../utils/response";

export const healthCheck = AsyncHandler(async (_req, res) => {
  const mongoState = mongoose.connection.readyState;

  const mongoStateMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  const mongoStatus = mongoStateMap[mongoState] ?? "unknown";
  const isHealthy = mongoState === 1;

  sendResponse(res, isHealthy ? 200 : 503, isHealthy ? "Server is healthy" : "Server is unhealthy", {
    server: "running",
    mongodb: mongoStatus,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
});
