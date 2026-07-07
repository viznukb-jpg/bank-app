import { Redis } from "ioredis";

// Using globalThis so the Redis instance isn't recreated during Fast Refresh
const globalForRedis = globalThis as unknown as {
  __redis: Redis;
};

export const redis =
  globalForRedis.__redis ||
  new Redis(process.env.REDIS_URL || "redis://localhost:6379");

if (process.env.NODE_ENV !== "production") {
  globalForRedis.__redis = redis;
}

export default redis;
