"use client";

import { useStatistics } from "../hooks/useStatistics";
import { WidgetContainer } from "@/shared/ui/WidgetContainer";
import { StatRow } from "@/shared/ui/StatRow";
import { formatCurrency } from "@/shared/utils/currency";

export function StatisticsWidget() {
  const { data: stats, isLoading, isError } = useStatistics();

  if (isError) return null;

  return (
    <WidgetContainer title="System Statistics">
      <div className="space-y-3 text-slate-600">
        {isLoading ? (
          <p className="text-slate-500">Loading statistics...</p>
        ) : stats ? (
          <>
            <StatRow
              label="Total Accounts"
              value={stats.totalAccounts}
            />
            <StatRow
              label="Total Balance"
              value={formatCurrency(stats.totalBalance)}
              variant="success"
            />
            <StatRow
              label="Total Transfers"
              value={stats.totalTransfers}
            />
            <StatRow
              label="Total Volume"
              value={formatCurrency(stats.totalVolume)}
              variant="success"
              hasBorder={false}
            />
          </>
        ) : (
          <p className="text-slate-500 italic">No statistics available.</p>
        )}
      </div>
    </WidgetContainer>
  );
}
