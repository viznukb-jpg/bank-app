import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/shared/query-provider/get-query-client";
import { getAccountsCached } from "@/shared/cache/accounts";
import { getStatisticsCached } from "@/shared/cache/statistics";
import { AccountList } from "@/features/accounts/components/AccountList";
import { StatisticsWidget } from "@/features/statistics/components/StatisticsWidget";
import { TransferForm } from "@/features/transfer/components/TransferForm";
import { RecentTransfers } from "@/features/statistics/components/RecentTransfers";
import type { Statistics } from "@/shared/types";

export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      return getAccountsCached();
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      return getStatisticsCached();
    },
  });

  return (
    <main className="p-8 min-h-screen">
      <div className="space-y-8 mx-auto max-w-4xl">
        <header className="text-center">
          <h1 className="font-extrabold text-slate-900 dark:text-white text-4xl tracking-tight">
            Mini Banking System
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Fast, cached, and reliable.
          </p>
        </header>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="items-start gap-8 grid grid-cols-1 md:grid-cols-3">
            <AccountList />
            <StatisticsWidget />
            <TransferForm />
          </div>

          <RecentTransfers />
        </HydrationBoundary>
      </div>
    </main>
  );
}
