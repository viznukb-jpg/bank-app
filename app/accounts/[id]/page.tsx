import { getAccountById } from '@/db/index';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accountId = Number(id);

  if (isNaN(accountId)) {
    notFound();
  }

  // Fetch the account directly from the Source of Truth since it's a Server Component
  const account = getAccountById(accountId);

  if (!account) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-6">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        &larr; Back to Home
      </Link>
      
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
          {account.name.charAt(0)}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{account.name}</h1>
        <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold mt-6">Current Balance</p>
        <p className="text-6xl font-extrabold text-emerald-600 mt-2">${account.balance}</p>
      </div>
    </main>
  );
}