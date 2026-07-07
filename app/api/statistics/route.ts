import { NextResponse } from "next/server";
import { redis } from "@/shared/lib/redis";

export async function GET() {
  try {
    const cacheKey = "statistics:report";

    // Fetch data exclusively from Redis
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // If data is not yet available, return an empty state
    return NextResponse.json({
      totalAccounts: 0,
      totalBalance: 0,
      totalTransfers: 0,
      lastOperations: [],
      message: "Report is generating...",
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
