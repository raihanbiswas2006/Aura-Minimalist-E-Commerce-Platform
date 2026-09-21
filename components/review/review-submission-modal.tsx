"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Review } from "@/types";

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  onSubmitReview: (review: Omit<Review, "id" | "createdAt" | "helpfulCount">) => void;
}

export function ReviewSubmissionModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  onSubmitReview,
}: ReviewSubmissionModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!rating || rating < 1) errs.rating = "Please select a star rating.";
    if (!title.trim()) errs.title = "Please enter a review headline.";
    if (comment.trim().length < 15)
      errs.comment = "Review body must be at least 15 characters long.";
    if (!authorName.trim()) errs.authorName = "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please provide a valid email address.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmitReview({
      productId,
      authorName,
      rating,
      title,
      comment,
      isVerifiedPurchase: true,
    });

    onClose();
    // Reset form
    setTitle("");
    setComment("");
    setAuthorName("");
    setEmail("");
    setErrors({});
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Write a Review"
      description={`Share your experience with ${productTitle}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#14171A] mb-1.5">
            Overall Rating *
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-[#F59E0B] focus-visible:outline-2 focus-visible:outline-[#1F4E43] rounded cursor-pointer"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-6 h-6 transition-transform hover:scale-110 ${
                    star <= (hoverRating || rating)
                      ? "fill-current text-[#F59E0B]"
                      : "text-[#D1D5DB]"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs text-[#6B7280] ml-2">
              {rating === 5
                ? "Exceptional"
                : rating === 4
                ? "Very Good"
                : rating === 3
                ? "Average"
                : rating === 2
                ? "Below Average"
                : "Poor"}
            </span>
          </div>
          {errors.rating && <p className="text-xs text-[#C2222E] mt-1">{errors.rating}</p>}
        </div>

        {/* Title */}
        <Input
          label="Review Headline *"
          placeholder="e.g. Sculptural perfection, incredible texture"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        {/* Comment Textarea */}
        <div>
          <label htmlFor="review-body" className="block text-xs font-semibold uppercase tracking-wider text-[#14171A] mb-1.5">
            Detailed Review * (Min. 15 characters)
          </label>
          <textarea
            id="review-body"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe the materials, craftsmanship, dimensions, and how it feels in your space..."
            className={`w-full p-3 rounded-md border text-base text-[#14171A] transition-colors placeholder:text-[#9CA3AF] focus-visible:outline-2 focus-visible:outline-[#1F4E43] ${
              errors.comment ? "border-[#C2222E]" : "border-[#E4E7EB]"
            }`}
          />
          {errors.comment && <p className="text-xs text-[#C2222E] mt-1">{errors.comment}</p>}
        </div>

        {/* Author Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Your Name *"
            placeholder="e.g. Elena Rostova"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            error={errors.authorName}
          />
          <Input
            label="Your Email *"
            type="email"
            placeholder="e.g. elena@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
        </div>

        <div className="pt-3 border-t border-[#E4E7EB] flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Demo Review
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
