import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/shared/lib/get-query-client";
import HomePageClient from "./components/HomePageClient";
import { getAccounts } from "@/db/index";
import { redis } from "@/shared/lib/redis";

export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      return getAccounts();
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const cachedData = await redis.get("statistics:report");
      if (cachedData) return JSON.parse(cachedData);

      return {
        totalAccounts: 0,
        totalBalance: 0,
        totalTransfers: 0,
        lastOperations: [],
      };
    },
  });

  return (
    <main className="p-8 min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomePageClient />
      </HydrationBoundary>
    </main>
  );
}
