import React from "react";
import { Star, CheckCircle2, Quote } from "lucide-react";

export function CustomerTestimonials() {
  const testimonials = [
    {
      author: "Marcus Vance",
      role: "Architect, San Francisco",
      text: "The joinery on the Nordic Lounge Chair is sublime. It arrived without an ounce of excess plastic in sustainable honeycomb packaging. Truly world-class finish.",
      product: "Nordic Lounge Chair",
      rating: 5,
    },
    {
      author: "Elena Rostova",
      role: "Interior Stylist, New York",
      text: "The stoneware lamp gives off the most atmospheric, calming amber illumination. The tactile unglazed base feels like a gallery piece on my credenza.",
      product: "Minimalist Ceramic Lamp",
      rating: 5,
    },
    {
      author: "Julian K.",
      role: "Industrial Designer, Chicago",
      text: "Frictionless checkout experience. Having exact delivery dates and no surprise shipping fees before paying is exactly how modern commerce should feel.",
      product: "Merino Woven Blanket",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6] border-t border-[#E4E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase font-semibold tracking-wider text-[#1F4E43] mb-1">
            Community Voices (Demo Personas)
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#14171A]">
            Design Community Impressions
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
            Sample feedback representing design personas living with Aura concept pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-2xl bg-white border border-[#E4E7EB] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-[#1F4E43]/20 mb-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#14171A] leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F3F4F6] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-[#14171A]">{t.author}</h3>
                  <p className="text-[11px] text-[#6B7280]">{t.role}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#18804E] bg-[#18804E]/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Buyer (Demo)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
