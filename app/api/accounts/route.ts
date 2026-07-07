import { NextResponse } from "next/server";
import { getAccounts } from "@/shared/db/index";
import { redis } from "@/shared/lib/redis";
import { REDIS_CACHE_TTL } from "@/shared/config/constants";
import { apiWrapper } from "@/shared/utils/errors";

export const GET = apiWrapper(async () => {
    const cacheKey = "accounts:list";

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    const accounts = getAccounts();

    await redis.set(cacheKey, JSON.stringify(accounts), "EX", REDIS_CACHE_TTL);

    return NextResponse.json(accounts);
});
