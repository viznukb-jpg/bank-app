import { redis } from "@/shared/lib/redis";
import type { Statistics } from "@/shared/types";

export const getStatisticsCached = async (): Promise<Statistics> => {
  const cacheKey = "statistics:report";

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as Statistics;
    }
  } catch (error) {
    console.warn("[Cache Error]: Failed to read statistics from Redis", error);
  }

  return {
    totalAccounts: 0,
    totalBalance: 0,
    totalTransfers: 0,
    totalVolume: 0,
    lastOperations: [],
  };
};
