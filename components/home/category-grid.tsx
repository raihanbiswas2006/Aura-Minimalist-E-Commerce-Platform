import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export function CategoryGrid() {
  const displayCategories = CATEGORIES.filter((c) => c.slug !== "sale").slice(0, 4);

  return (
    <section className="py-16 md:py-20 bg-white border-y border-[#E4E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-[#1F4E43] mb-1">
              Curated Taxonomy
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#14171A]">
              Explore by Discipline
            </h2>
          </div>
          <Link
            href="/c/furniture"
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-[#1F4E43] hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/c/${cat.slug}`}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-[#FAF9F6] border border-[#E4E7EB] hover:border-[#D1D5DB] transition-all duration-300 hover:shadow-lg"
            >
              {/* 1:1 Aspect Ratio Photography */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#EFECE6]">
                <Image
                  src={cat.imageUrl}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold">{cat.title}</h3>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white text-white group-hover:text-[#14171A]">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-white/80 line-clamp-1 mt-1 font-normal">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
