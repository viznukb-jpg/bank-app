"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("App boundary error:", error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center bg-slate-50 px-4 min-h-screen text-center">
      <div className="bg-red-100 mx-auto mb-6 p-4 rounded-full">
        <svg
          className="w-12 h-12 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="font-bold text-slate-900 text-3xl">
        Something went wrong
      </h2>
      <p className="mt-2 mb-8 text-slate-600 max-w-md">
        An unexpected error occurred while processing your request. Please try
        again.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="bg-slate-800 hover:bg-slate-900 px-8 w-auto text-white"
        >
          Try Again
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          className="px-8 w-auto"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
