"use client";

import React from "react";
import { Truck, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface FreeShippingMeterProps {
  subtotal: number;
  hasFreeShippingCoupon?: boolean;
}

const THRESHOLD = 150.0;

export function FreeShippingMeter({ subtotal, hasFreeShippingCoupon }: FreeShippingMeterProps) {
  const isQualified = subtotal >= THRESHOLD || hasFreeShippingCoupon;
  const remaining = Math.max(0, THRESHOLD - subtotal);
  const percentage = isQualified ? 100 : Math.min(100, Math.round((subtotal / THRESHOLD) * 100));

  return (
    <div className="bg-[#FAF9F6] border border-[#E4E7EB] rounded-lg p-3.5 mb-4 select-none">
      <div className="flex items-center gap-2 mb-2 text-xs font-medium text-[#14171A]">
        {isQualified ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[#1B9E60] shrink-0" />
            <span className="text-[#18804E] font-semibold">
              You have qualified for Free Standard Delivery!
            </span>
          </>
        ) : (
          <>
            <Truck className="w-4 h-4 text-[#1F4E43] shrink-0" />
            <span>
              Add <span className="font-semibold text-[#1F4E43]">{formatPrice(remaining)}</span> more to unlock Free Delivery
            </span>
          </>
        )}
      </div>

      <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isQualified ? "bg-[#1B9E60]" : "bg-[#1F4E43]"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
