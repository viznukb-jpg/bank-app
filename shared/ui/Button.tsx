import { ButtonHTMLAttributes } from "react";

export function Button({
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm hover:shadow py-3 rounded-xl w-full font-semibold text-white active:scale-[0.99] transition-all disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
