import { redis } from "@/shared/lib/redis";
import { getAccounts, getAccountById } from "@/shared/db/index";
import { REDIS_CACHE_TTL } from "@/shared/config/constants";
import type { Account } from "@/shared/types";

export async function getAccountsCached(): Promise<Account[]> {
  const cacheKey = "accounts:list";

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.warn(
      "[Cache Error]: Failed to read from Redis, falling back to DB",
      error,
    );
  }

  const accounts = getAccounts();

  try {
    await redis.set(cacheKey, JSON.stringify(accounts), "EX", REDIS_CACHE_TTL);
  } catch (error) {
    console.warn("[Cache Error]: Failed to write to Redis", error);
  }

  return accounts;
}

export async function getAccountByIdCached(
  id: number,
): Promise<Account | undefined> {
  const cacheKey = `account:${id}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.warn(
      `[Cache Error]: Failed to read account ${id} from Redis, falling back to DB`,
      error,
    );
  }

  // Fallback to Source of Truth (DB)
  const account = getAccountById(id);

  if (account) {
    try {
      await redis.set(cacheKey, JSON.stringify(account), "EX", REDIS_CACHE_TTL);
    } catch (error) {
      console.warn(
        `[Cache Error]: Failed to write account ${id} to Redis`,
        error,
      );
    }
  }

  return account;
}
