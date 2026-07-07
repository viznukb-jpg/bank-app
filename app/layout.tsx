import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/shared/query-provider/provider";
import { Toaster } from "react-hot-toast";

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
      <body className="bg-slate-50 h-full text-slate-900">
        <QueryProvider>
          {children}
          <Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
