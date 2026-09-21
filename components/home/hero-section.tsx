import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content (Left) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F4E43]/10 text-[#1F4E43] text-xs font-semibold uppercase tracking-wider">
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#14171A] leading-[1.12]">
              Living Spaces Reimagined
            </h1>

            <p className="text-base sm:text-lg text-[#6B7280] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Curated furniture, architectural lighting, and tactile linens designed with warm minimalist modernism. Crafted to endure across generations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/c/furniture" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/search?q=linen" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <span>Explore Organic Linens</span>
                </Button>
              </Link>
            </div>

            {/* Micro value badges */}
            <div className="pt-6 border-t border-[#E4E7EB] grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-lg font-serif font-bold text-[#14171A]">Natural</p>
                <p className="text-[11px] text-[#6B7280]">Oak &amp; Flax (Sample Spec)</p>
              </div>
              <div>
                <p className="text-lg font-serif font-bold text-[#14171A]">৳5,000+</p>
                <p className="text-[11px] text-[#6B7280]">Free Delivery (Demo Tier)</p>
              </div>
              <div>
                <p className="text-lg font-serif font-bold text-[#14171A]">30-Day</p>
                <p className="text-[11px] text-[#6B7280]">Trial Policy (Sample)</p>
              </div>
            </div>
          </div>

          {/* Hero Editorial Image (Right) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/5 sm:aspect-4/3 lg:aspect-4/5 w-full rounded-2xl overflow-hidden shadow-2xl border border-[#E4E7EB] bg-[#EFECE6]">
              <Image
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85"
                alt="Living Spaces Reimagined editorial showcase featuring Nordic bouclé armchair and minimal wooden side table"
                fill
                priority={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-103"
              />

              {/* Floating aesthetic chip */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E4E7EB] shadow-lg max-w-xs">
                <p className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">
                  Featured Centerpiece
                </p>
                <p className="text-sm font-semibold text-[#14171A] mt-0.5">
                  Nordic Lounge Chair
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3F4F6]">
                  <span className="text-xs font-semibold text-[#1F4E43]">৳34,900</span>
                  <Link
                    href="/p/nordic-lounge-chair"
                    className="text-xs text-[#14171A] hover:text-[#1F4E43] font-medium flex items-center gap-1"
                  >
                    <span>View Piece</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
