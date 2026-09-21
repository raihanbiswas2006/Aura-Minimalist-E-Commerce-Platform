import React from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E4E7EB] flex items-center justify-center mx-auto text-[#1F4E43]">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase font-semibold tracking-widest text-[#9CA3AF]">
            404 • Not Found
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14171A]">
            Page Moved or Retired
          </h1>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            The architectural piece or collection you are seeking has been repositioned within our catalog.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" className="flex items-center gap-2">
              <span>Return to Home</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/c/furniture">
            <Button variant="outline">Browse Furniture</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
