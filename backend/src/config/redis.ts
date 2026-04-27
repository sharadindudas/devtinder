import { Redis } from "ioredis";
import { REDIS_URL } from "./config";
import { logger } from "../utils/logger";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  }
});

redis.on("connect", () => {
  logger.info("Redis is connected successfully");
});

redis.on("error", (err) => {
  logger.error("Redis connection error:", err.message);
});

