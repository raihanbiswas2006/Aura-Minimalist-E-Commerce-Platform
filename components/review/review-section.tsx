"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, ThumbsUp, Plus, Filter } from "lucide-react";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RatingHistogram } from "./rating-histogram";
import { ReviewSubmissionModal } from "./review-submission-modal";
import { addProductReview } from "@/lib/api/products";

interface ReviewSectionProps {
  productId: string;
  productTitle: string;
  initialReviews: Review[];
}

export function ReviewSection({
  productId,
  productTitle,
  initialReviews,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const handleAddReview = (
    newReview: Omit<Review, "id" | "createdAt" | "helpfulCount">
  ) => {
    const created = addProductReview(newReview);
    setReviews([created, ...reviews]);
  };

  const handleHelpfulVote = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  // Filter & Sort
  let filtered = [...reviews];
  if (ratingFilter !== null) {
    filtered = filtered.filter((r) => Math.floor(r.rating) === ratingFilter);
  }

  filtered.sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section id="reviews" className="pt-16 border-t border-[#E4E7EB] mt-16 scroll-mt-24">
      {/* Header & Write Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-[#14171A]">
            Customer Impressions & Reviews
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Sample impressions and community feedback for this demonstration piece.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </Button>
      </div>

      {/* Histogram & Scorecard */}
      <RatingHistogram
        reviews={reviews}
        selectedRatingFilter={ratingFilter}
        onSelectRatingFilter={(star) => setRatingFilter(star)}
      />

      {/* Controls Bar: Filter status & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-8 pb-4 border-b border-[#E4E7EB]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280]">
            Showing {filtered.length} of {reviews.length} reviews
          </span>
          {ratingFilter !== null && (
            <button
              type="button"
              onClick={() => setRatingFilter(null)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1F4E43]/10 text-[#1F4E43] hover:bg-[#1F4E43]/20 transition-colors cursor-pointer"
            >
              <span>{ratingFilter} Stars Only</span>
              <span className="text-[10px] ml-1">× Clear</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6B7280]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 px-2 bg-white border border-[#E4E7EB] rounded-md text-xs text-[#14171A] focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-[#E4E7EB]">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#6B7280]">
            <p className="text-sm">No reviews match the selected filter.</p>
            <button
              type="button"
              onClick={() => setRatingFilter(null)}
              className="mt-2 text-xs text-[#1F4E43] underline font-medium cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filtered.map((rev) => {
            const extraHelpful = helpfulVotes[rev.id] || 0;
            const totalHelpful = rev.helpfulCount + extraHelpful;

            return (
              <div key={rev.id} className="py-6 space-y-2.5">
                {/* Author, Verified Badge & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#14171A]">
                      {rev.authorName}
                    </span>
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#18804E] bg-[#18804E]/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Buyer (Demo)
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#9CA3AF]">{formatDate(rev.createdAt)}</span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? "fill-current" : "text-[#D1D5DB]"
                      }`}
                    />
                  ))}
                </div>

                {/* Headline */}
                <h4 className="text-sm font-semibold text-[#14171A]">{rev.title}</h4>

                {/* Body Commentary */}
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  {rev.comment}
                </p>

                {/* Helpfulness upvote */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleHelpfulVote(rev.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#1F4E43] transition-colors p-1 -ml-1 rounded cursor-pointer"
                    aria-label={`Mark review by ${rev.authorName} as helpful`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({totalHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Write Review Modal Dialog */}
      <ReviewSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        productTitle={productTitle}
        onSubmitReview={handleAddReview}
      />
    </section>
  );
}
