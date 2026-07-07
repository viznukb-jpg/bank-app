import Link from "next/link";
import type { Account } from "@/shared/types";

interface AccountItemProps {
  account: Account;
}

export function AccountItem({ account }: AccountItemProps) {
  return (
    <Link
      href={`/accounts/${account.id}`}
      className="group block flex justify-between items-center bg-slate-50 hover:shadow-sm p-4 border border-slate-100 hover:border-blue-300 rounded-xl transition-all cursor-pointer"
    >
      <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
        {account.name}
      </span>
      <span className="font-bold text-emerald-600 text-lg">
        ${account.balance}
      </span>
    </Link>
  );
}
