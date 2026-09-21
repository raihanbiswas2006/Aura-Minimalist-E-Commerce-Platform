import React from "react";
import { Truck, Check, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Shipping & Delivery Policy | Aura Living",
  description: "Transparent delivery times, carbon-neutral shipping, and the $150 complimentary threshold.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1F4E43]">
          Logistics Transparency
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14171A]">
          Shipping Policy &amp; Delivery Matrix
        </h1>
        <p className="text-sm text-[#6B7280]">
          Zero hidden handling surcharges. We compute delivery rates upfront before you initiate checkout.
        </p>
      </div>

      {/* Threshold Highlight Box */}
      <div className="p-8 rounded-2xl bg-[#1F4E43] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs uppercase font-semibold text-[#F59E0B] tracking-wider">
            Complimentary Threshold
          </span>
          <h2 className="font-serif text-2xl font-bold">
            Free Delivery on Domestic Orders Over $150
          </h2>
          <p className="text-xs text-white/80 max-w-md">
            Reach $150.00 subtotal in your bag to automatically qualify for complimentary carbon-neutral standard delivery.
          </p>
        </div>
        <Link href="/c/furniture" className="shrink-0">
          <Button variant="secondary" className="bg-white text-[#14171A] hover:bg-[#FAF9F6]">
            Shop to Threshold
          </Button>
        </Link>
      </div>

      {/* Shipping Methods Table */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-[#E4E7EB]">
          <h3 className="font-serif text-lg font-semibold text-[#14171A]">
            Delivery Tiers &amp; Schedules
          </h3>
        </div>
        <div className="divide-y divide-[#E4E7EB] text-xs">
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-sm text-[#14171A] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1F4E43]" />
                Standard Ground Delivery
              </p>
              <p className="text-[#6B7280]">
                Carbon-neutral ground transit. Includes scheduled tracking updates.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-sm text-[#14171A]">
                FREE over $150 <span className="font-normal text-[#6B7280]">($15.00 under $150)</span>
              </span>
              <p className="text-[#9CA3AF]">3 – 5 Business Days</p>
            </div>
          </div>

          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-sm text-[#14171A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1F4E43]" />
                Express Priority Courier
              </p>
              <p className="text-[#6B7280]">
                Immediate warehouse dispatch with priority transport routes.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-sm text-[#14171A]">$25.00 Flat Rate</span>
              <p className="text-[#9CA3AF]">1 – 2 Business Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
