import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="h-9 bg-[#14171A] text-[#FAF9F6] text-xs flex items-center justify-center px-4 tracking-wide z-50">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
        <span>
          Enjoy complimentary domestic delivery on orders over $150 • Demo Environment
        </span>
        <span className="hidden md:inline text-white/40">|</span>
        <Link
          href="/shipping"
          className="hidden md:inline text-white/80 hover:text-white underline underline-offset-2"
        >
          Delivery Details
        </Link>
      </div>
    </div>
  );
}
