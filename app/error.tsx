"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-14 h-14 rounded-full bg-[#C2222E]/10 border border-[#C2222E]/20 text-[#C2222E] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#14171A]">
            Encountered An Unexpected Anomaly
          </h2>
          <p className="text-xs text-[#6B7280]">
            The requested operation could not complete smoothly. You can attempt to retry the action or return safely to the homepage.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-[#9CA3AF]">
              Digest Code: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => reset()}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Action</span>
          </Button>

          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
