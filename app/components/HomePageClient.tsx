'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import type { Account } from '@/db/index';

export default function HomePageClient() {
  const queryClient = useQueryClient();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // The initial data will be automatically provided by HydrationBoundary
  const { data: accounts } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      return res.json();
    },
  });

  const { data: stats } = useQuery<any>({
    queryKey: ['statistics'],
    queryFn: async () => {
      const res = await fetch('/api/statistics');
      if (!res.ok) throw new Error('Failed to fetch statistics');
      return res.json();
    },
    refetchInterval: 30000, // Background refetch every 30s to sync with worker
  });

  const transferMutation = useMutation({
    mutationFn: async (data: { from: number; to: number; amount: number }) => {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Transfer failed');
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate cache so that TanStack Query refetches fresh data
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      
      setFrom('');
      setTo('');
      setAmount('');
      setErrorMsg('');
      setSuccessMsg('Transfer completed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
      setSuccessMsg('');
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
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Mini Banking System</h1>
        <p className="mt-2 text-slate-500">Fast, cached, and reliable.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Accounts</h2>
            <div className="space-y-3">
              {accounts?.map((acc) => (
                <div key={acc.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <Link href={`/accounts/${acc.id}`} className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    {acc.name}
                  </Link>
                  <span className="font-bold text-emerald-600 text-lg">${acc.balance}</span>
                </div>
              ))}
              {!accounts?.length && <p className="text-slate-500 italic">No accounts found.</p>}
            </div>
          </section>

          {stats && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">System Statistics</h2>
              <div className="space-y-3 text-slate-600">
                <div className="flex justify-between border-b pb-2">
                  <span>Total Accounts</span>
                  <span className="font-semibold text-slate-900">{stats.totalAccounts}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Total Balance</span>
                  <span className="font-semibold text-emerald-600">${stats.totalBalance}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Total Transfers</span>
                  <span className="font-semibold text-slate-900">{stats.totalTransfers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Volume</span>
                  <span className="font-semibold text-emerald-600">${stats.totalVolume || 0}</span>
                </div>
              </div>
            </section>
          )}
        </div>

        <section>
          <form onSubmit={handleTransfer} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 sticky top-8">
            <h2 className="text-2xl font-semibold text-slate-800">Transfer Money</h2>
            <p className="text-sm text-slate-500">Send money instantly between users.</p>
            
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
                {successMsg}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">From Account</label>
              <select 
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">Select sender</option>
                {accounts?.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance})</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">To Account</label>
              <select 
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">Select recipient</option>
                {accounts?.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Amount ($)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="0.00"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={transferMutation.isPending}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-[0.99]"
            >
              {transferMutation.isPending ? 'Processing...' : 'Transfer'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
