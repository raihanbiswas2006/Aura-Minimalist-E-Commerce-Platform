import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

export function ValueProps() {
  const items = [
    {
      icon: Truck,
      title: "Carbon-Neutral Delivery",
      description: "100% offset transportation on all domestic orders over $150.",
    },
    {
      icon: RotateCcw,
      title: "30-Day In-Home Trial",
      description: "Live with your piece. Hassle-free exchanges or complete refunds.",
    },
    {
      icon: ShieldCheck,
      title: "Enduring Joinery Warranty",
      description: "Crafted from kiln-dried solid woods backed by a 2-year guarantee.",
    },
    {
      icon: Headphones,
      title: "Dedicated Design Concierge",
      description: "Direct interior guidance and material swatch kits on request.",
    },
  ];

  return (
    <section className="py-14 bg-[#FAF9F6] border-b border-[#E4E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E4E7EB]">
                <div className="w-10 h-10 rounded-lg bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#14171A]">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
