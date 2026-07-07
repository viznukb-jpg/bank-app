import { NextResponse } from "next/server";
import { getAccounts } from "@/db/index";
import { redis } from "@/shared/lib/redis";
import { REDIS_CACHE_TTL } from "@/shared/config/constants";

export async function GET() {
  try {
    const cacheKey = "accounts:list";

    // 1. Check if cache exists in Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // 2. Cache miss — fetch from Source of Truth
    const accounts = getAccounts();

    // 3. Save to Redis with the specified TTL
    await redis.set(cacheKey, JSON.stringify(accounts), "EX", REDIS_CACHE_TTL);

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
