"use client";

import React from "react";
import { CATEGORIES } from "@/data/categories";
import { Star, Check, X } from "lucide-react";
import { BDT_PRICE_RANGES } from "@/lib/constants";

export interface FilterState {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  colors: string[];
  rating?: number;
  inStockOnly: boolean;
  sort: string;
}

interface CatalogFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isMobileDrawer?: boolean;
}

const PRICE_RANGES = BDT_PRICE_RANGES;

const AVAILABLE_COLORS = [
  { name: "Cream", hex: "#F3EFEA" },
  { name: "Charcoal", hex: "#373A3C" },
  { name: "Stone Grey", hex: "#BFB8AE" },
  { name: "Olive Green", hex: "#556B2F" },
  { name: "Natural Oak", hex: "#D6C2A6" },
  { name: "Natural Walnut", hex: "#5C4033" },
  { name: "Brushed Brass", hex: "#C5A059" },
  { name: "Matte Black", hex: "#1A1A1A" },
];

export function CatalogFilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  isMobileDrawer = false,
}: CatalogFilterSidebarProps) {
  const handleColorToggle = (colorName: string) => {
    const exists = filters.colors.includes(colorName);
    const updated = exists
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ colors: updated });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.colors.length > 0 ||
    filters.rating !== undefined ||
    filters.inStockOnly;

  return (
    <div className={`space-y-6 ${isMobileDrawer ? "" : "w-64 shrink-0"}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EB]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#14171A]">
          Filter By
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-[#C2222E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-[#14171A] uppercase tracking-wider">
          Category
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ category: "all" })}
            className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors cursor-pointer ${
              filters.category === "all"
                ? "bg-[#1F4E43]/10 text-[#1F4E43] font-semibold"
                : "text-[#6B7280] hover:text-[#14171A]"
            }`}
          >
            All Disciplines
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange({ category: cat.slug })}
              className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors cursor-pointer flex items-center justify-between ${
                filters.category.toLowerCase() === cat.slug.toLowerCase()
                  ? "bg-[#1F4E43]/10 text-[#1F4E43] font-semibold"
                  : "text-[#6B7280] hover:text-[#14171A]"
              }`}
            >
              <span>{cat.title}</span>
              <span className="text-[11px] opacity-70">({cat.itemCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#E4E7EB]">
        <h4 className="text-xs font-semibold text-[#14171A] uppercase tracking-wider">
          Price Range
        </h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((r, idx) => {
            const isSelected =
              filters.minPrice === r.min && filters.maxPrice === r.max;
            return (
              <label
                key={idx}
                className="flex items-center gap-2.5 text-xs text-[#14171A] cursor-pointer hover:text-[#1F4E43]"
              >
                <input
                  type="radio"
                  name="price-range"
                  checked={isSelected}
                  onChange={() =>
                    onFilterChange({ minPrice: r.min, maxPrice: r.max })
                  }
                  className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43]"
                />
                <span>{r.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Color / Material Swatches */}
      <div className="space-y-2.5 pt-4 border-t border-[#E4E7EB]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-[#14171A] uppercase tracking-wider">
            Color & Material
          </h4>
          {filters.colors.length > 0 && (
            <span className="text-[11px] text-[#1F4E43] font-semibold">
              ({filters.colors.length})
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {AVAILABLE_COLORS.map((c) => {
            const isChecked = filters.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleColorToggle(c.name)}
                className={`flex items-center gap-2 p-1.5 rounded-md border text-xs text-left transition-all cursor-pointer ${
                  isChecked
                    ? "border-[#1F4E43] bg-[#1F4E43]/5 text-[#1F4E43] font-medium"
                    : "border-[#E4E7EB] hover:border-[#D1D5DB] text-[#6B7280] bg-white"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="truncate">{c.name}</span>
                {isChecked && <Check className="w-3 h-3 text-[#1F4E43] ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#E4E7EB]">
        <h4 className="text-xs font-semibold text-[#14171A] uppercase tracking-wider">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3].map((stars) => {
            const isSelected = filters.rating === stars;
            return (
              <label
                key={stars}
                className="flex items-center gap-2 text-xs text-[#14171A] cursor-pointer hover:text-[#1F4E43]"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) =>
                    onFilterChange({ rating: e.target.checked ? stars : undefined })
                  }
                  className="w-4 h-4 text-[#1F4E43] rounded-sm border-[#E4E7EB] focus:ring-[#1F4E43]"
                />
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[#6B7280]">&amp; Up</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* In-Stock Only */}
      <div className="pt-4 border-t border-[#E4E7EB]">
        <label className="flex items-center gap-2.5 text-xs font-medium text-[#14171A] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 text-[#1F4E43] rounded-sm border-[#E4E7EB] focus:ring-[#1F4E43]"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
