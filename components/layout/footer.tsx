"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#14171A] text-[#FAF9F6] pt-16 pb-12 border-t border-black/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Essence */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#2D6A5D]"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="16" cy="16" r="3" fill="currentColor" />
              </svg>
              <span className="font-serif text-2xl font-bold tracking-[0.18em] text-white uppercase">
                Aura Living
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed">
              Curated home goods, architectural lighting, and tactile apparel designed with warm minimalist modernism. Created for quiet, deliberate living.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF] pt-2">
              <Shield className="w-4 h-4 text-[#2D6A5D]" />
              <span>Designed following WCAG 2.2 AA guidelines (Demo)</span>
            </div>
            <div className="inline-block bg-white/5 border border-white/10 rounded-md px-3 py-1 text-[11px] text-[#9CA3AF]">
              Demonstration Prototype • No Live Financial Processing
            </div>
          </div>

          {/* Col 3: Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9CA3AF]">
              <li>
                <Link href="/c/furniture" className="hover:text-white transition-colors">
                  Living Room Furniture
                </Link>
              </li>
              <li>
                <Link href="/c/lighting" className="hover:text-white transition-colors">
                  Architectural Lighting
                </Link>
              </li>
              <li>
                <Link href="/c/textiles" className="hover:text-white transition-colors">
                  Organic Linens & Wool
                </Link>
              </li>
              <li>
                <Link href="/c/decor" className="hover:text-white transition-colors">
                  Stoneware Ceramics
                </Link>
              </li>
              <li>
                <Link href="/c/sale" className="text-[#F87171] hover:text-[#EF4444] transition-colors">
                  Seasonal Reductions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9CA3AF]">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Concierge Inquiry
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#2D6A5D] hover:text-white transition-colors font-medium">
                  Admin Demo Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              The Aura Journal
            </h4>
            <p className="text-xs text-[#9CA3AF] mb-3 leading-relaxed">
              Curated architectural insights and quiet collection launches delivered monthly.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#34D399] bg-[#34D399]/10 p-2.5 rounded-md border border-[#34D399]/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for joining our circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-l-md text-xs text-white placeholder:text-[#9CA3AF] focus-visible:outline-2 focus-visible:outline-[#2D6A5D]"
                    aria-label="Email address for journal subscription"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="rounded-l-none h-10 px-3 bg-[#1F4E43] hover:bg-[#183E35]"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                {error && <p className="text-[11px] text-[#F87171]">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Terms & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div>
            <p>© 2026 Aura Living (Aura Modern Commerce Demo). Designed for high-conversion portfolio validation.</p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>

          {/* SVG Payment Trust Indicators */}
          <div className="flex items-center gap-2 text-[#9CA3AF]">
            <span className="text-[10px] uppercase font-semibold">Simulated Sandbox:</span>
            <div className="flex items-center gap-1.5 opacity-80">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white">VISA</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white">MC</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white">AMEX</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white">APPLE PAY</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white">PAYPAL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
