"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { searchCatalog, getProducts } from "@/lib/api/products";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with Active Query & Clear Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E7EB] mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#14171A]">
            {query ? (
              <span>
                Search Results for &ldquo;<strong>{query}</strong>&rdquo;
              </span>
            ) : (
              "Explore Catalog"
            )}
          </h1>
          {query && (
            <p className="text-xs text-[#6B7280] mt-1">
              Showing {searchResult.products.length} {searchResult.products.length === 1 ? "match" : "matches"} across current inventory
            </p>
          )}
        </div>

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#C2222E] bg-white border border-[#E4E7EB] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Search</span>
          </button>
        )}
      </div>

      {/* Populated Search Results */}
      {searchResult.products.length > 0 ? (
        <div>
          {/* Matching categories if any */}
          {searchResult.categories.length > 0 && (
            <div className="mb-8 p-4 bg-[#FAF9F6] border border-[#E4E7EB] rounded-xl flex items-center gap-3">
              <span className="text-xs font-semibold text-[#14171A]">Related Disciplines:</span>
              <div className="flex flex-wrap gap-2">
                {searchResult.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/c/${cat.slug}`}
                    className="text-xs bg-white border border-[#E4E7EB] hover:border-[#1F4E43] text-[#1F4E43] px-3 py-1 rounded-full font-medium transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResult.products.map((p, idx) => (
              <ProductCard key={p.id} product={p} priority={idx < 4} />
            ))}
          </div>
        </div>
      ) : (
        /* Journey 3: Empty Search Recovery UI */
        <div className="space-y-12">
          <div className="text-center py-12 px-4 rounded-2xl bg-[#FAF9F6] border border-[#E4E7EB] max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E4E7EB] flex items-center justify-center mx-auto mb-4 text-[#9CA3AF]">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-[#14171A]">
              {query
                ? `No products matched "${query}"`
                : "Search the complete Aura collection"}
            </h2>
            <p className="text-xs text-[#6B7280] mt-1.5 max-w-sm mx-auto">
              Check for typos, search broader terms, or click one of our popular inquiries below.
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
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
