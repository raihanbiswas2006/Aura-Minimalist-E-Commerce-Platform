"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, X } from "lucide-react";
import { searchCatalog, SearchResult } from "@/lib/api/products";
import { formatPrice } from "@/lib/utils";

interface SearchAutocompleteProps {
  onSearchSubmit?: () => void;
  className?: string;
  isMobileModal?: boolean;
}

export function SearchAutocomplete({ onSearchSubmit, className = "", isMobileModal = false }: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search by 250ms per PRD Section 11.1
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const res = searchCatalog(query);
      setResults(res);
      setIsOpen(true);
      setSelectedIndex(-1);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Global keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    onSearchSubmit?.();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !results) return;

    const totalItems = (results.categories.length || 0) + (results.products.slice(0, 4).length || 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <label htmlFor="header-search-input" className="sr-only">
          Search products and collections
        </label>
        <Search className="absolute left-3.5 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
        <input
          id="header-search-input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder="Search products, materials, collections..."
          className="w-full h-10 pl-9 pr-14 text-sm bg-white border border-[#E4E7EB] rounded-full focus-visible:outline-2 focus-visible:outline-[#1F4E43] placeholder:text-[#9CA3AF] text-[#14171A] transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults(null);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-9 p-1 text-[#9CA3AF] hover:text-[#14171A] rounded-full cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {!isMobileModal && (
          <div className="absolute right-3 hidden sm:flex items-center gap-0.5 pointer-events-none text-[10px] text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
            <span>⌘</span>
            <span>K</span>
          </div>
        )}
      </form>

      {/* Autocomplete Popover */}
      {isOpen && results && (
        <div
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-[#E4E7EB] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto"
          role="listbox"
        >
          {results.totalMatches === 0 && results.categories.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-[#14171A]">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#6B7280] mt-1">
                Try searching for &ldquo;linen&rdquo;, &ldquo;oak&rdquo;, &ldquo;lamp&rdquo;, or &ldquo;chair&rdquo;
              </p>
            </div>
          ) : (
            <div className="py-2">
              {/* Category Suggestions */}
              {results.categories.length > 0 && (
                <div className="px-3 py-1.5 border-b border-[#F3F4F6]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1 px-2">
                    Categories
                  </p>
                  <div className="space-y-0.5">
                    {results.categories.map((cat, idx) => (
                      <Link
                        key={cat.id}
                        href={`/c/${cat.slug}`}
                        onClick={() => {
                          setIsOpen(false);
                          onSearchSubmit?.();
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          selectedIndex === idx ? "bg-[#1F4E43]/10 text-[#1F4E43]" : "text-[#14171A] hover:bg-[#FAF9F6]"
                        }`}
                      >
                        <span>{cat.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Matches */}
              {results.products.length > 0 && (
                <div className="p-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5 px-2">
                    Products
                  </p>
                  <div className="space-y-1">
                    {results.products.slice(0, 4).map((prod, idx) => {
                      const itemIdx = (results.categories.length || 0) + idx;
                      const activePrice = prod.discountPrice ?? prod.basePrice;

                      return (
                        <Link
                          key={prod.id}
                          href={`/p/${prod.slug}`}
                          onClick={() => {
                            setIsOpen(false);
                            onSearchSubmit?.();
                          }}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                            selectedIndex === itemIdx ? "bg-[#1F4E43]/10" : "hover:bg-[#FAF9F6]"
                          }`}
                        >
                          <div className="relative w-11 aspect-4/5 rounded bg-[#F3F4F6] overflow-hidden shrink-0 border border-[#E4E7EB]">
                            <Image
                              src={prod.images[0]?.url || ""}
                              alt={prod.title}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#14171A] truncate">{prod.title}</p>
                            <p className="text-[11px] text-[#6B7280] truncate">{prod.subtitle}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-[#14171A]">{formatPrice(activePrice)}</span>
                            {prod.discountPrice && (
                              <span className="block text-[10px] text-[#9CA3AF] line-through">
                                {formatPrice(prod.basePrice)}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View all results footer */}
              <div className="p-2 border-t border-[#E4E7EB] bg-[#FAF9F6]">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-1.5 text-xs text-center font-medium text-[#1F4E43] hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  View all {results.totalMatches} results for &ldquo;{query}&rdquo;
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
