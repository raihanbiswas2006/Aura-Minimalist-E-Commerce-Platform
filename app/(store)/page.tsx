import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { ValueProps } from "@/components/home/value-props";
import { EditorialStory } from "@/components/home/editorial-story";
import { CustomerTestimonials } from "@/components/home/customer-testimonials";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/api/products";

export const metadata = {
  title: "Aura Living | Modern Minimalist Commerce",
  description:
    "Curated home furniture, architectural lighting, and organic textiles crafted for mindful living spaces.",
};

export default function HomePage() {
  const featuredProducts = getProducts({ sort: "featured", limit: 8 });

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Curated Categories 4-Card Visual Grid */}
      <CategoryGrid />

      {/* 3. Featured Curated Collection */}
      <section className="py-16 md:py-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase font-semibold tracking-wider text-[#1F4E43] mb-1">
                Seasonal Curation
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#14171A]">
                Enduring Essentials
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5">
                Our most sought-after pieces, engineered with honest materials and refined proportions.
              </p>
            </div>
            <Link
              href="/c/furniture"
              className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#1F4E43] hover:underline flex items-center gap-1"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust & Value Propositions Strip */}
      <ValueProps />

      {/* 5. Editorial Storytelling Banner */}
      <EditorialStory />

      {/* 6. Customer Endorsement Grid */}
      <CustomerTestimonials />
    </div>
  );
}
