import { NextResponse } from "next/server";
import { transfer } from "@/shared/db/index";
import { redis } from "@/shared/lib/redis";
import type { TransferPayload } from "@/shared/types";
import { apiWrapper, AppError } from "@/shared/utils/errors";

export const POST = apiWrapper(async (request: Request) => {
  const body = (await request.json()) as TransferPayload;
  const { from, to, amount } = body;

  if (!from || !to || !amount || amount <= 0) {
    throw new AppError("Invalid payload", 400);
  }

  if (from === to) {
    throw new AppError("Cannot transfer to the same account", 400);
  }

  const success = await transfer(Number(from), Number(to), Number(amount));

  if (!success) {
    throw new AppError(
      "Transfer failed: invalid accounts or insufficient funds",
      400,
    );
  }

  await redis.del("accounts:list");
  await redis.del(`account:${from}`);
  await redis.del(`account:${to}`);

  return NextResponse.json({
    success: true,
    message: "Transfer completed successfully",
  });
});
