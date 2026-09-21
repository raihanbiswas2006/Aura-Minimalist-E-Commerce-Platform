"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { CatalogFilterSidebar, FilterState } from "./catalog-filter-sidebar";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api/products";
import { CATEGORIES } from "@/data/categories";

interface CatalogViewProps {
  initialCategory?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export function CatalogView({
  initialCategory = "all",
  pageTitle,
  pageDescription,
}: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initialize filters from URL search params
  const filters = useMemo<FilterState>(() => {
    const urlCategory = searchParams.get("category") || initialCategory;
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const colorParam = searchParams.get("color");
    const ratingParam = searchParams.get("rating");
    const inStockParam = searchParams.get("inStock");
    const sortParam = searchParams.get("sort") || "featured";

    return {
      category: urlCategory,
      minPrice: minPriceParam ? Number(minPriceParam) : undefined,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
      colors: colorParam ? colorParam.split(",").filter(Boolean) : [],
      rating: ratingParam ? Number(ratingParam) : undefined,
      inStockOnly: inStockParam === "true",
      sort: sortParam,
    };
  }, [searchParams, initialCategory]);

  // Sync filter changes with URLSearchParams
  const updateUrlParams = (newFilters: Partial<FilterState>) => {
    const merged = { ...filters, ...newFilters };
    const params = new URLSearchParams();

    if (merged.category && merged.category !== "all") {
      params.set("category", merged.category);
    }
    if (merged.minPrice !== undefined) {
      params.set("minPrice", merged.minPrice.toString());
    }
    if (merged.maxPrice !== undefined) {
      params.set("maxPrice", merged.maxPrice.toString());
    }
    if (merged.colors.length > 0) {
      params.set("color", merged.colors.join(","));
    }
    if (merged.rating !== undefined) {
      params.set("rating", merged.rating.toString());
    }
    if (merged.inStockOnly) {
      params.set("inStock", "true");
    }
    if (merged.sort && merged.sort !== "featured") {
      params.set("sort", merged.sort);
    }

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const handleResetFilters = () => {
    startTransition(() => {
      if (initialCategory && initialCategory !== "all") {
        router.push(pathname, { scroll: false });
      } else {
        router.push("/c/furniture", { scroll: false });
      }
    });
  };

  // Fetch filtered products
  const products = useMemo(() => {
    return getProducts({
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      color: filters.colors,
      rating: filters.rating,
      inStockOnly: filters.inStockOnly,
      sort: filters.sort as any,
    });
  }, [filters]);

  // Derived Title & Category metadata
  const currentCategoryObj = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === filters.category.toLowerCase()
  );
  const title = pageTitle || currentCategoryObj?.title || "Curated Collection";
  const description =
    pageDescription ||
    currentCategoryObj?.description ||
    "Explore mindful design essentials across living spaces.";

  // Active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const minStr = filters.minPrice !== undefined ? `$${filters.minPrice}` : "$0";
    const maxStr = filters.maxPrice !== undefined ? `$${filters.maxPrice}` : "+";
    activeChips.push({
      label: `Price: ${minStr} – ${maxStr}`,
      onRemove: () => updateUrlParams({ minPrice: undefined, maxPrice: undefined }),
    });
  }
  filters.colors.forEach((col) => {
    activeChips.push({
      label: `Color: ${col}`,
      onRemove: () =>
        updateUrlParams({ colors: filters.colors.filter((c) => c !== col) }),
    });
  });
  if (filters.rating !== undefined) {
    activeChips.push({
      label: `${filters.rating}+ Stars`,
      onRemove: () => updateUrlParams({ rating: undefined }),
    });
  }
  if (filters.inStockOnly) {
    activeChips.push({
      label: "In Stock Only",
      onRemove: () => updateUrlParams({ inStockOnly: false }),
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Editorial Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#14171A]">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="flex gap-10 items-start">
        {/* Desktop Left Sidebar (width: 280px per Section 10.1) */}
        <aside className="hidden lg:block w-70 shrink-0 sticky top-24">
          <CatalogFilterSidebar
            filters={filters}
            onFilterChange={updateUrlParams}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Right Product Grid Area */}
        <div className="flex-1 min-w-0">
          {/* Top Utility Bar (Result Count, Mobile Trigger, Sort Selector) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E4E7EB] mb-6">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Sheet Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[#E4E7EB] rounded-md text-xs font-semibold text-[#14171A] bg-white hover:bg-[#FAF9F6] cursor-pointer"
                aria-label="Open filter options drawer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeChips.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#1F4E43] text-white text-[10px] flex items-center justify-center font-bold">
                    {activeChips.length}
                  </span>
                )}
              </button>

              {/* Result Count */}
              <span className="text-xs text-[#6B7280]">
                Showing <strong className="text-[#14171A]">{products.length}</strong> items
              </span>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B7280] hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => updateUrlParams({ sort: e.target.value })}
                  className="h-9 pl-3 pr-8 bg-white border border-[#E4E7EB] rounded-md text-xs text-[#14171A] focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer appearance-none"
                  aria-label="Sort products by"
                >
                  <option value="featured">Featured Curation</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Customer Rating: Highest</option>
                  <option value="date-desc">Newest Arrivals</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-[#9CA3AF] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-[#9CA3AF]">Active:</span>
              {activeChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[#E4E7EB] text-[#14171A] shadow-2xs"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="p-0.5 hover:text-[#C2222E] rounded-full cursor-pointer"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#1F4E43] hover:underline font-medium ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-[#FAF9F6] border border-[#E4E7EB] p-8">
              <p className="text-base font-serif font-semibold text-[#14171A]">
                No items match your selected parameters
              </p>
              <p className="text-xs text-[#6B7280] mt-1.5 max-w-sm mx-auto">
                Try widening your price range, choosing additional colorways, or clearing active filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 4} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet with Explicit Result Count per PRD Section 10.1 & US-02 */}
      <Sheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        side="left"
        title="Refine Catalog"
        description="Filter by price, material, and ratings"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pr-1">
            <CatalogFilterSidebar
              filters={filters}
              onFilterChange={updateUrlParams}
              onResetFilters={handleResetFilters}
              isMobileDrawer={true}
            />
          </div>

          <div className="pt-4 mt-4 border-t border-[#E4E7EB] sticky bottom-0 bg-white">
            <Button
              className="w-full"
              size="lg"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              Show {products.length} Results
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
