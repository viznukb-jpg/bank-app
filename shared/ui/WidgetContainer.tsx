import { ReactNode } from "react";

interface WidgetContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function WidgetContainer({
  title,
  description,
  children,
  className = "",
}: WidgetContainerProps) {
  return (
    <section
      className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-y-auto ${className}`}
    >
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">{title}</h2>
      {description && (
        <p className="text-sm text-slate-500 mb-4 -mt-3">{description}</p>
      )}
      {children}
    </section>
  );
}
