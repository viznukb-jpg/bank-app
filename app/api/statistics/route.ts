import { NextResponse } from "next/server";
import { apiWrapper } from "@/shared/utils/errors";
import { getStatisticsCached } from "@/shared/cache/statistics";

export const GET = apiWrapper(async () => {
  const stats = await getStatisticsCached();
  return NextResponse.json(stats);
});
