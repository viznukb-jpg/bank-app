import { NextResponse } from "next/server";
import { getAccounts } from "@/db/index";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const cacheKey = "accounts:list";

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    const accounts = getAccounts();

    await redis.set(cacheKey, JSON.stringify(accounts), "EX", 60);

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
