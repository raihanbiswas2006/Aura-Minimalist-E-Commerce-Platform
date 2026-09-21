import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <header className="bg-[#14171A] text-white py-4 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-widest uppercase hover:text-[#34D399] transition-colors"
          >
            Aura
          </Link>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-1.5 text-xs text-[#34D399] bg-[#34D399]/10 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Demonstration Administration Center</span>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs text-white/80 hover:text-white flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-4 text-center text-xs text-[#6B7280] border-t border-[#E4E7EB] bg-white">
        Aura Commerce • Demonstration Control Center
      </footer>
    </div>
  );
}
