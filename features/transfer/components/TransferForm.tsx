"use client";

import { useState } from "react";
import { useTransfer } from "../hooks/useTransfer";
import { useAccounts } from "@/features/accounts/hooks/useAccounts";
import { WidgetContainer } from "@/shared/ui/WidgetContainer";
import { Select } from "@/shared/ui/Select";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import toast from "react-hot-toast";
import { formatCurrency } from "@/shared/utils/currency";

export function TransferForm() {
  const { data: accounts } = useAccounts();
  const transferMutation = useTransfer();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !amount) return;

    transferMutation.mutate(
      {
        from: Number(from),
        to: Number(to),
        amount: Number(amount),
      },
      {
        onSuccess: () => {
          setFrom("");
          setTo("");
          setAmount("");
          setErrorMsg("");
          toast.success("Transfer completed successfully!");
        },
        onError: (error) => {
          setErrorMsg(error.message);
        },
      },
    );
  };

  return (
    <WidgetContainer
      title="Transfer Money"
      description="Send money instantly between users."
      className="top-8 sticky"
    >
      <form onSubmit={handleTransfer} className="space-y-5">
        {errorMsg && (
          <div className="bg-red-50 p-3 border border-red-100 rounded-lg text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <Select
          label="From Account"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        >
          <option value="">Select sender</option>
          {accounts?.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({formatCurrency(account.balance)})
            </option>
          ))}
        </Select>

        <Select
          label="To Account"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        >
          <option value="">Select recipient</option>
          {accounts
            ?.filter((account) => account.id !== Number(from))
            .map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
        </Select>

        <Input
          label="Amount ($)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          placeholder="0.00"
          required
        />

        <Button type="submit" disabled={transferMutation.isPending}>
          {transferMutation.isPending ? "Processing..." : "Transfer"}
        </Button>
      </form>
    </WidgetContainer>
  );
}
