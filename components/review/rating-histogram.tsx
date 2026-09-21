"use client";

import React from "react";
import { Star } from "lucide-react";
import { Review } from "@/types";

interface RatingHistogramProps {
  reviews: Review[];
  selectedRatingFilter?: number | null;
  onSelectRatingFilter: (star: number | null) => void;
}

export function RatingHistogram({
  reviews,
  selectedRatingFilter,
  onSelectRatingFilter,
}: RatingHistogramProps) {
  const totalReviews = reviews.length;

  // Calculate distribution
  const counts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars
  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.floor(r.rating)));
    counts[star - 1]++;
  });

  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  return (
    <div className="bg-[#FAF9F6] border border-[#E4E7EB] rounded-xl p-6 flex flex-col md:flex-row items-center gap-8">
      {/* Scorecard */}
      <div className="text-center md:text-left shrink-0 md:pr-8 md:border-r border-[#E4E7EB]">
        <div className="text-5xl font-serif font-bold text-[#14171A]">
          {averageRating}
        </div>
        <div className="flex items-center justify-center md:justify-start gap-1 text-[#F59E0B] my-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-5 h-5 ${
                s <= Math.round(Number(averageRating))
                  ? "fill-current"
                  : "text-[#D1D5DB]"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[#6B7280]">
          Based on {totalReviews} sample {totalReviews === 1 ? "review" : "reviews"} (Demo)
        </p>
      </div>

      {/* 5-Bar Distribution Histogram */}
      <div className="flex-1 w-full space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star - 1];
          const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          const isFilterActive = selectedRatingFilter === star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onSelectRatingFilter(isFilterActive ? null : star)}
              className={`w-full flex items-center gap-3 text-xs text-left group p-1 rounded-md transition-colors cursor-pointer ${
                isFilterActive ? "bg-[#1F4E43]/10" : "hover:bg-black/5"
              }`}
            >
              <span className="w-12 shrink-0 font-medium text-[#14171A] flex items-center gap-1">
                {star} <Star className="w-3 h-3 fill-current text-[#F59E0B]" />
              </span>

              {/* Progress Bar */}
              <div className="flex-1 bg-[#E5E7EB] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFilterActive ? "bg-[#1F4E43]" : "bg-[#1F4E43]/80 group-hover:bg-[#1F4E43]"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span className="w-12 text-right shrink-0 text-[#6B7280]">
                {pct}% ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
