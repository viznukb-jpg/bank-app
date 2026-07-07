import { ReactNode } from "react";

interface StatRowProps {
  label: string;
  value: ReactNode;
  variant?: "neutral" | "success";
  hasBorder?: boolean;
}

export function StatRow({
  label,
  value,
  variant = "neutral",
  hasBorder = true,
}: StatRowProps) {
  const valueColor =
    variant === "success" ? "text-emerald-600" : "text-slate-900";

  return (
    <div className={`flex justify-between ${hasBorder ? "pb-2 border-b" : ""}`}>
      <span>{label}</span>
      <span className={`font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}
