import { NextResponse } from "next/server";
import { redis } from "@/shared/lib/redis";
import { apiWrapper } from "@/shared/utils/errors";

export const GET = apiWrapper(async () => {
    const cacheKey = "statistics:report";

    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        return NextResponse.json(JSON.parse(cachedData));
      }
    } catch (error) {
      console.warn("[Cache Error]: Failed to read statistics from Redis, falling back to pending state", error);
    }

    // NOTE: We deliberately do NOT fallback to calculating the statistics from the DB here.
    // The statistics aggregation is a heavy task offloaded to the background worker (instrumentation.ts).
    // If the cache is empty (e.g. before the first worker tick), we return a pending state.
    return NextResponse.json({
      totalAccounts: 0,
      totalBalance: 0,
      totalTransfers: 0,
      lastOperations: [],
      message: "Report is generating...",
    });
});
