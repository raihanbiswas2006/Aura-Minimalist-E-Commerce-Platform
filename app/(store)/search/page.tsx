"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { CatalogView } from "@/components/catalog/catalog-view";
import { searchCatalog, getProducts } from "@/lib/api/products";

const POPULAR_SEARCH_CHIPS = ["Chairs", "Lamps", "Ceramics", "Linen", "Oak", "Blanket"];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const searchResult = useMemo(() => {
    return searchCatalog(query);
  }, [query]);

  const trendingProducts = useMemo(() => {
    return getProducts({ sort: "featured", limit: 4 });
  }, []);

  const handleChipClick = (chip: string) => {
    router.push(`/search?q=${encodeURIComponent(chip)}`);
  };

  const handleClear = () => {
    router.push("/search");
  };

  // If a search query was entered but matched 0 products: Journey 3 Zero-Result Recovery UI
  if (query && searchResult.products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="text-center py-16 px-4 rounded-2xl bg-[#FAF9F6] border border-[#E4E7EB] max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-white border border-[#E4E7EB] flex items-center justify-center mx-auto mb-4 text-[#9CA3AF]">
            <Search className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-[#14171A]">
            No products matched &ldquo;{query}&rdquo;
          </h2>
          <p className="text-xs text-[#6B7280] mt-2 max-w-sm mx-auto leading-relaxed">
            Check for minor typos, search broader terms, or click one of our popular design categories below.
          </p>

          {/* Popular Search Chips per Journey 3 */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {POPULAR_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-[#E4E7EB] hover:border-[#1F4E43] hover:text-[#1F4E43] text-[#14171A] transition-all cursor-pointer shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Products 4-item Grid per Journey 3 */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#1F4E43]" />
            <h3 className="font-serif text-2xl font-semibold text-[#14171A]">
              Trending Across Collections
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} priority={idx < 4} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Populated results or browsing catalog without query: Render full CatalogView with filters & sorting
  return (
    <CatalogView
      searchQuery={query || undefined}
      matchingCategories={query ? searchResult.categories : undefined}
      pageTitle={query ? `Search Results for "${query}"` : "Explore Catalog"}
      pageDescription={
        query
          ? `Showing ${searchResult.products.length} matching pieces across current inventory. Filter by discipline, color, price, or rating below.`
          : "Browse all curated furniture, ambient lighting, and organic textiles."
      }
      onClearSearch={query ? handleClear : undefined}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
