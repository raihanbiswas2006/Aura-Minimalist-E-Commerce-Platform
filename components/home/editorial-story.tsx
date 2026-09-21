import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditorialStory() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#14171A] text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Story Image */}
            <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-full">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
                alt="Craftsmanship workshop showing solid oak furniture joinery"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Story Text */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
              <span className="text-xs uppercase font-semibold tracking-widest text-[#F59E0B]">
                The Aura Ethos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Crafted for Longevity: Natural Oak, Belgian Linens & Quiet Form
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                We design objects that age with grace. By pairing sustainable timber with tactile, unbleached fibers, every piece in our collection is an intentional rebuttal to disposable fast-furniture cycles.
              </p>
              <div className="pt-2">
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#14171A] flex items-center gap-2"
                  >
                    <span>Read Our Design Manifesto</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
