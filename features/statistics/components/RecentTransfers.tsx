"use client";

import { useStatistics } from "../hooks/useStatistics";
import { useAccounts } from "@/features/accounts/hooks/useAccounts";
import type { Transfer } from "@/shared/types";
import { RecentTransferItem } from "./RecentTransferItem";

export function RecentTransfers() {
  const { data: stats } = useStatistics();
  const { data: accounts } = useAccounts();

  if (!stats || !stats.lastOperations) return null;

  return (
    <section className="bg-white shadow-sm mt-8 p-6 border border-slate-200 rounded-2xl">
      <h2 className="mb-6 font-semibold text-slate-800 text-2xl">
        Recent Transfers
      </h2>

      {stats.lastOperations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-slate-600 text-left border-collapse">
            <thead>
              <tr className="border-slate-200 border-b text-slate-400 text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold">From</th>
                <th className="pb-3 font-semibold">To</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.lastOperations.map((operation: Transfer) => (
                <RecentTransferItem key={operation.id} operation={operation} accounts={accounts} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-50 py-8 border border-slate-200 border-dashed rounded-xl text-slate-500 text-center">
          <p>No transfers have been made yet.</p>
          <p className="mt-1 text-sm">
            Make a transfer above to see it here (updates every 30 seconds).
          </p>
        </div>
      )}
    </section>
  );
}
