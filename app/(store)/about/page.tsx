import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | Aura Living",
  description: "Our philosophy of warm minimalist modernism and enduring craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
      {/* Demo Notice Banner */}
      <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] text-xs text-[#6B7280] flex items-center gap-3">
        <span className="font-semibold text-[#1F4E43] uppercase tracking-wider text-[11px] shrink-0 bg-[#1F4E43]/10 px-2 py-0.5 rounded">
          Portfolio Concept
        </span>
        <span>
          Aura Living is an original minimalist commerce demonstration platform. Brand origin narratives, material benchmarks, and sustainability guidelines below represent conceptual design exercises.
        </span>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1F4E43]">
          Manifesto &amp; Design Philosophy
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#14171A]">
          Built for Intentional Living
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
          Aura was conceptualized around a deliberate aesthetic: modern interiors that balance architectural purity with enveloping tactile warmth.
        </p>
      </div>

      <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-[#EFECE6] border border-[#E4E7EB]">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85"
          alt="Artisan woodworker shaping solid white oak joinery in studio"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-6">
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-bold text-[#14171A]">
            01. Natural Materiality
          </h3>
          <p>
            Modeled on renewable solid hardwoods (White Oak and American Walnut), unbleached long-staple European flax, and natural volcanic stoneware clays.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-bold text-[#14171A]">
            02. Honest Proportions
          </h3>
          <p>
            Forms draw from both Scandinavian warmth and Japanese wabi-sabi principles. No artificial plastics, veneer shortcuts, or unnecessary ornamental filler.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-bold text-[#14171A]">
            03. Sustainable Concept
          </h3>
          <p>
            Designed with eco-conscious ideals: simulated recyclable packaging and virtual carbon-offset transportation models across all order simulations.
          </p>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-[#E4E7EB]">
        <Link href="/c/furniture">
          <Button size="lg">Explore Our Pieces</Button>
        </Link>
      </div>
    </div>
  );
}
