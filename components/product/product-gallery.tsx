"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentImage = images[selectedIndex] || images[0] || {
    id: "fallback",
    url: "",
    alt: title,
    isPrimary: true,
  };

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, isLightboxOpen]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Vertical Thumbnail Strip (Desktop Left, Mobile Bottom) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 py-1 md:py-0 md:w-20">
          {images.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-20 md:w-20 md:h-24 rounded-md overflow-hidden bg-[#FAF9F6] border-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F4E43] shrink-0 ${
                  isSelected
                    ? "border-[#1F4E43] shadow-sm"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${idx + 1} of ${images.length}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="relative flex-1 aspect-4/5 md:aspect-square lg:aspect-4/5 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] overflow-hidden group">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Zoom Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-[#14171A] hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
          aria-label="Enlarge image in fullscreen lightbox"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Carousel Arrow Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
              }
              className="p-2 rounded-full bg-white/80 text-[#14171A] hover:bg-white shadow-sm pointer-events-auto transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
              }
              className="p-2 rounded-full bg-white/80 text-[#14171A] hover:bg-white shadow-sm pointer-events-auto transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dots Indicator for Mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 md:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedIndex === idx ? "w-6 bg-[#1F4E43]" : "bg-black/20"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox preview"
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close fullscreen preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
