import { NextResponse } from "next/server";
import { redis } from "@/shared/lib/redis";
import { apiWrapper } from "@/shared/utils/errors";

export const GET = apiWrapper(async () => {
    const cacheKey = "statistics:report";

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    return NextResponse.json({
      totalAccounts: 0,
      totalBalance: 0,
      totalTransfers: 0,
      lastOperations: [],
      message: "Report is generating...",
    });
});
