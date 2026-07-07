import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="block font-medium text-slate-700 text-sm">
        {label}
      </label>
      <select
        className={`bg-slate-50 p-3 border border-slate-200 focus:border-blue-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full text-slate-900 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
