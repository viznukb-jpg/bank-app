"use client";

import { useAccounts } from "../hooks/useAccounts";
import { WidgetContainer } from "@/shared/ui/WidgetContainer";
import { AccountItem } from "./AccountItem";

export function AccountList() {
  const { data: accounts, isLoading, isError } = useAccounts();

  if (isError) {
    return <p className="text-red-500">Failed to load accounts.</p>;
  }

  return (
    <WidgetContainer title="Accounts" className="max-h-[450px]">
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-slate-500">Loading accounts...</p>
        ) : accounts?.length ? (
          accounts.map((account) => (
            <AccountItem key={account.id} account={account} />
          ))
        ) : (
          <p className="text-slate-500 italic">No accounts found.</p>
        )}
      </div>
    </WidgetContainer>
  );
}
