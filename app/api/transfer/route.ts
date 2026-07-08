import { NextResponse } from "next/server";
import { transfer } from "@/shared/db/index";
import { redis } from "@/shared/lib/redis";
import type { TransferPayload } from "@/shared/types";
import { apiWrapper, AppError } from "@/shared/utils/errors";

export const POST = apiWrapper(async (request: Request) => {
  let body: TransferPayload;
  try {
    body = (await request.json()) as TransferPayload;
  } catch {
    throw new AppError("Invalid JSON body", 400);
  }
  const { from, to, amount } = body;

  const fromNum = Number(from);
  const toNum = Number(to);
  const amountNum = Number(amount);

  if (
    !Number.isFinite(fromNum) ||
    !Number.isFinite(toNum) ||
    !Number.isFinite(amountNum) ||
    amountNum <= 0
  ) {
    throw new AppError("Invalid payload", 400);
  }

  if (fromNum === toNum) {
    throw new AppError("Cannot transfer to the same account", 400);
  }

  const success = await transfer(fromNum, toNum, amountNum);

  if (!success) {
    throw new AppError(
      "Transfer failed: invalid accounts or insufficient funds",
      400,
    );
  }

  try {
    await Promise.all([
      redis.del("accounts:list"),
      redis.del(`account:${fromNum}`),
      redis.del(`account:${toNum}`),
    ]);
  } catch (error) {
    console.warn(
      "[Cache Error]: Failed to invalidate account cache after transfer",
      error,
    );
  }

  return NextResponse.json({
    success: true,
    message: "Transfer completed successfully",
  });
});
