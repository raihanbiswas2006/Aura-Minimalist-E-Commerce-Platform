import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

export function ValueProps() {
  const items = [
    {
      icon: Truck,
      title: "Nationwide Delivery (Demo)",
      description: "Delivering across Bangladesh with complimentary shipping on orders over ৳5,000 (Demo).",
    },
    {
      icon: RotateCcw,
      title: "30-Day In-Home Trial (Sample)",
      description: "Simulated return terms: hassle-free exchanges or demo refunds.",
    },
    {
      icon: ShieldCheck,
      title: "Enduring Joinery Standards",
      description: "Sample design specifications modeled on kiln-dried solid hardwoods.",
    },
    {
      icon: Headphones,
      title: "Design Concierge (Demo)",
      description: "Simulated interior styling assistance and material guidance.",
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
