import type { Transfer, Account } from "@/shared/types";

interface RecentTransferItemProps {
  operation: Transfer;
  accounts: Account[] | undefined;
}

export function RecentTransferItem({
  operation,
  accounts,
}: RecentTransferItemProps) {
  const fromName =
    accounts?.find((account) => account.id === operation.from)?.name ||
    `ID: ${operation.from}`;
  const toName =
    accounts?.find((account) => account.id === operation.to)?.name ||
    `ID: ${operation.to}`;
  const dateObj = new Date(op.timestamp);
  const formattedDate =
    dateObj.toLocaleDateString() +
    " " +
    dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-4 text-slate-500 text-sm" suppressHydrationWarning>
        {formattedDate}
      </td>
      <td className="py-4 font-medium text-slate-800">{fromName}</td>
      <td className="py-4 font-medium text-slate-800">{toName}</td>
      <td className="py-4 font-bold text-emerald-600 text-right">
        ${operation.amount}
      </td>
    </tr>
  );
}
