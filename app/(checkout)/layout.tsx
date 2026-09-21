import React from "react";
import Link from "next/link";
import { ShieldCheck, HelpCircle } from "lucide-react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Distraction-free secure header per Section 15.1 */}
      <header className="bg-white border-b border-[#E4E7EB] py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-[0.18em] text-[#14171A] uppercase hover:text-[#1F4E43] transition-colors"
            >
              Aura
            </Link>
            <span className="text-[#D1D5DB]">|</span>
            <div className="flex items-center gap-1.5 text-xs text-[#18804E] font-medium bg-[#18804E]/10 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated Secure Checkout</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6B7280]">
            <Link href="/shipping" target="_blank" className="hover:text-[#14171A] flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Delivery Support</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t border-[#E4E7EB] bg-white text-center text-xs text-[#9CA3AF]">
        <p>Aura Living Demo Checkout • 256-bit Simulated Sandbox Isolation</p>
      </footer>
    </div>
  );
}
