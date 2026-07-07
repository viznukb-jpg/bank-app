"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import type { Account } from "@/db/index";
import { WORKER_INTERVAL_MS } from "@/shared/config/constants";

export default function HomePageClient() {
  const queryClient = useQueryClient();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("Failed to fetch accounts");
      return res.json();
    },
  });

  const { data: stats } = useQuery<any>({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await fetch("/api/statistics");
      if (!res.ok) throw new Error("Failed to fetch statistics");
      return res.json();
    },
    refetchInterval: WORKER_INTERVAL_MS,
  });

  const transferMutation = useMutation({
    mutationFn: async (data: { from: number; to: number; amount: number }) => {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Transfer failed");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate cache so that TanStack Query refetches fresh data
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      setFrom("");
      setTo("");
      setAmount("");
      setErrorMsg("");
      setSuccessMsg("Transfer completed successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
      setSuccessMsg("");
    },
  });

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !amount) return;
    transferMutation.mutate({
      from: Number(from),
      to: Number(to),
      amount: Number(amount),
    });
  };

  return (
    <div className="space-y-8 mx-auto max-w-4xl">
      <header className="text-center">
        <h1 className="font-extrabold text-slate-900 dark:text-white text-4xl tracking-tight">
          Mini Banking System
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Fast, cached, and reliable.
        </p>
      </header>

      <div className="items-start gap-8 grid grid-cols-1 md:grid-cols-3">
        <section className="bg-white shadow-sm p-6 border border-slate-200 rounded-2xl">
          <h2 className="mb-4 font-semibold text-slate-800 text-2xl">
            Accounts
          </h2>
          <div className="space-y-3">
            {accounts?.map((acc) => (
              <Link
                href={`/accounts/${acc.id}`}
                key={acc.id}
                className="group block flex justify-between items-center bg-slate-50 hover:shadow-sm p-4 border border-slate-100 hover:border-blue-300 rounded-xl transition-all cursor-pointer"
              >
                <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                  {acc.name}
                </span>
                <span className="font-bold text-emerald-600 text-lg">
                  ${acc.balance}
                </span>
              </Link>
            ))}
            {!accounts?.length && (
              <p className="text-slate-500 italic">No accounts found.</p>
            )}
          </div>
        </section>

        {stats && (
          <section className="bg-white shadow-sm p-6 border border-slate-200 rounded-2xl">
            <h2 className="mb-4 font-semibold text-slate-800 text-2xl">
              System Statistics
            </h2>
            <div className="space-y-3 text-slate-600">
              <div className="flex justify-between pb-2 border-b">
                <span>Total Accounts</span>
                <span className="font-semibold text-slate-900">
                  {stats.totalAccounts}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>Total Balance</span>
                <span className="font-semibold text-emerald-600">
                  ${stats.totalBalance}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>Total Transfers</span>
                <span className="font-semibold text-slate-900">
                  {stats.totalTransfers}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Volume</span>
                <span className="font-semibold text-emerald-600">
                  ${stats.totalVolume || 0}
                </span>
              </div>
            </div>
          </section>
        )}

        <section>
          <form
            onSubmit={handleTransfer}
            className="top-8 sticky space-y-5 bg-white shadow-sm p-6 border border-slate-200 rounded-2xl"
          >
            <h2 className="font-semibold text-slate-800 text-2xl">
              Transfer Money
            </h2>
            <p className="text-slate-500 text-sm">
              Send money instantly between users.
            </p>

            {errorMsg && (
              <div className="bg-red-50 p-3 border border-red-100 rounded-lg text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 p-3 border border-green-100 rounded-lg text-green-700 text-sm">
                {successMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-medium text-slate-700 text-sm">
                From Account
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-slate-50 p-3 border border-slate-200 focus:border-blue-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all"
                required
              >
                <option value="">Select sender</option>
                {accounts?.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (${acc.balance})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-slate-700 text-sm">
                To Account
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-slate-50 p-3 border border-slate-200 focus:border-blue-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all"
                required
              >
                <option value="">Select recipient</option>
                {accounts?.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-slate-700 text-sm">
                Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                className="bg-slate-50 p-3 border border-slate-200 focus:border-blue-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all"
                placeholder="0.00"
                required
              />
            </div>

            <button
              type="submit"
              disabled={transferMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm hover:shadow py-3 rounded-xl w-full font-semibold text-white active:scale-[0.99] transition-all disabled:cursor-not-allowed"
            >
              {transferMutation.isPending ? "Processing..." : "Transfer"}
            </button>
          </form>
        </section>
      </div>

      {stats && stats.lastOperations && (
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
                  {stats.lastOperations.map((op: any) => {
                    const fromName =
                      accounts?.find((a) => a.id === op.from)?.name ||
                      `ID: ${op.from}`;
                    const toName =
                      accounts?.find((a) => a.id === op.to)?.name ||
                      `ID: ${op.to}`;
                    const dateObj = new Date(op.timestamp);
                    const formattedDate =
                      dateObj.toLocaleDateString() +
                      " " +
                      dateObj.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                    return (
                      <tr
                        key={op.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 text-sm text-slate-500" suppressHydrationWarning>
                          {formattedDate}
                        </td>
                        <td className="py-4 font-medium text-slate-800">
                          {fromName}
                        </td>
                        <td className="py-4 font-medium text-slate-800">
                          {toName}
                        </td>
                        <td className="py-4 font-bold text-emerald-600 text-right">
                          ${op.amount}
                        </td>
                      </tr>
                    );
                  })}
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
      )}
    </div>
  );
}
