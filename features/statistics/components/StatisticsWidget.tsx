"use client";

import { useStatistics } from "../hooks/useStatistics";
import { WidgetContainer } from "@/shared/ui/WidgetContainer";
import { StatRow } from "@/shared/ui/StatRow";

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
              value={`$${stats.totalBalance}`}
              variant="success"
            />
            <StatRow
              label="Total Transfers"
              value={stats.totalTransfers}
            />
            <StatRow
              label="Total Volume"
              value={`$${stats.totalVolume || 0}`}
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
