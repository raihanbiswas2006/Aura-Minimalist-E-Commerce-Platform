import React from "react";
import { RotateCcw, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Returns & Guarantees | Aura Living",
  description: "30-day home trial guarantee, effortless return labels, and 2-year craftsmanship warranty.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1F4E43]">
          Assurance &amp; Warranty
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14171A]">
          Returns &amp; 30-Day Home Trial
        </h1>
        <p className="text-sm text-[#6B7280]">
          We want you to live with our furniture and textiles in your natural light before feeling fully committed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-[#E4E7EB] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43]">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#14171A]">
            30-Day Trial Window
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Unpack and enjoy your items for 30 days. If the dimensions or feel are not right for your sanctuary, request a return.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#E4E7EB] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#14171A]">
            2-Year Craftsmanship Warranty
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            All timber joints, structural frames, and electrical luminaire assemblies are warranted against manufacturing defects for 2 full years.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#E4E7EB] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43]">
            <Check className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#14171A]">
            Prepaid Courier Pickup
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            For large furniture items, our logistics partners schedule ground pickup directly from your doorstep with zero packaging repacking stress.
          </p>
        </div>
      </div>
    </div>
  );
}
