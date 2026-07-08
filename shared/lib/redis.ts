import { Redis } from "ioredis";

const globalForRedis = globalThis as unknown as {
  __redis: Redis;
};

export const redis =
  globalForRedis.__redis ||
  new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: 3,
  });

redis.on("error", (err) => {
  console.error("[Redis] connection error:", err);
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.__redis = redis;
}

export default redis;
