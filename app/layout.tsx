import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Mini Banking System",
  description: "A small full-stack banking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="h-full bg-slate-50 text-slate-900">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
