import { NextResponse } from "next/server";
import { apiWrapper } from "@/shared/utils/errors";
import { getAccountsCached } from "@/shared/cache/accounts";

export const GET = apiWrapper(async () => {
  const accounts = await getAccountsCached();
  return NextResponse.json(accounts);
});
