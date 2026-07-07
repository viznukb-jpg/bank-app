import { NextResponse } from "next/server";
import { transfer } from "@/db/index";
import { redis } from "@/shared/lib/redis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to, amount } = body;

    // Validate request payload
    if (!from || !to || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Execute transfer (checks existence and balance inside the function)
    const success = transfer(Number(from), Number(to), Number(amount));

    if (!success) {
      return NextResponse.json(
        { error: "Transfer failed: invalid accounts or insufficient funds" },
        { status: 400 },
      );
    }

    // Invalidate Redis cache for the accounts list and individual accounts
    await redis.del("accounts:list");
    await redis.del(`account:${from}`);
    await redis.del(`account:${to}`);

    return NextResponse.json({
      success: true,
      message: "Transfer completed successfully",
    });
  } catch (error) {
    console.error("Error in transfer route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
