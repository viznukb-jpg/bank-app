import { getAccountByIdCached } from "@/shared/cache/accounts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/shared/utils/currency";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accountId = Number(id);

  if (isNaN(accountId)) {
    notFound();
  }

  const account = await getAccountByIdCached(accountId);

  if (!account) {
    notFound();
  }

  return (
    <main className="space-y-6 mx-auto p-8 max-w-2xl min-h-screen">
      <Link
        href="/"
        className="inline-block mb-8 font-medium text-blue-600 hover:underline"
      >
        &larr; Back to Home
      </Link>

      <div className="bg-white shadow-sm p-10 border border-slate-200 rounded-3xl text-center">
        <div className="flex justify-center items-center bg-blue-100 mx-auto mb-6 rounded-full w-20 h-20 font-bold text-blue-600 text-3xl">
          {account.name.charAt(0)}
        </div>
        <h1 className="mb-2 font-bold text-slate-900 text-4xl">
          {account.name}
        </h1>
        <p className="mt-6 font-semibold text-slate-500 text-sm uppercase tracking-wider">
          Current Balance
        </p>
        <p className="mt-2 font-extrabold text-emerald-600 text-6xl">
          {formatCurrency(account.balance)}
        </p>
      </div>
    </main>
  );
}
