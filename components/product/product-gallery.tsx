"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const viewportRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selectedIndex] || images[0] || {
    id: "fallback",
    url: "",
    alt: title,
    isPrimary: true,
  };

  // Keyboard navigation for gallery and lightbox
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

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  // Cursor-following magnifier calculation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  }, []);

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Vertical Thumbnail Strip (Desktop Left, Mobile Bottom) */}
      {images.length > 1 && (
        <div
          className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 py-1 md:py-0 md:w-20 select-none scrollbar-none"
          role="tablist"
          aria-label="Product thumbnails"
        >
          {images.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={img.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden bg-[#FAF9F6] border-2 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F4E43] shrink-0 ${
                  isSelected
                    ? "border-[#1F4E43] ring-1 ring-[#1F4E43] shadow-sm scale-[1.02]"
                    : "border-transparent opacity-70 hover:opacity-100 hover:scale-[1.01]"
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
      <div
        ref={viewportRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
        className="relative flex-1 aspect-4/5 md:aspect-square lg:aspect-4/5 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] overflow-hidden group cursor-crosshair select-none"
      >
        {/* Magnified Image Target */}
        <div
          className="relative w-full h-full will-change-transform"
          style={{
            transformOrigin: isZoomed ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : "center center",
            transform: isZoomed ? "scale(1.75)" : "scale(1)",
            transition: isZoomed
              ? "transform 200ms cubic-bezier(0.16, 1, 0.3, 1), transform-origin 60ms linear"
              : "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), transform-origin 300ms ease-out",
          }}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt || title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover pointer-events-none"
          />
        </div>

        {/* Zoom Lightbox Trigger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-[#14171A] hover:bg-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
          aria-label="Enlarge image in fullscreen lightbox"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Carousel Arrow Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
              }}
              className="p-2.5 rounded-full bg-white/90 text-[#14171A] hover:bg-white shadow-md pointer-events-auto transition-all duration-150 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
              }}
              className="p-2.5 rounded-full bg-white/90 text-[#14171A] hover:bg-white shadow-md pointer-events-auto transition-all duration-150 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dots Indicator for Mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 md:hidden pointer-events-none">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(idx);
                }}
                className={`pointer-events-auto h-2 rounded-full transition-all duration-300 ${
                  selectedIndex === idx ? "w-6 bg-[#1F4E43]" : "w-2 bg-black/20"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accessible Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 animate-subtle-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview lightbox"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white/80 z-10">
            <span className="text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-150 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Close fullscreen preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Lightbox Image with Arrow Controls */}
          <div
            className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                }
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative w-full h-full">
              <Image
                src={currentImage.url}
                alt={currentImage.alt || title}
                fill
                className="object-contain transition-opacity duration-200"
                sizes="100vw"
                priority
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip inside Lightbox */}
          {images.length > 1 && (
            <div
              className="flex items-center gap-2 overflow-x-auto max-w-xl py-2 px-4 bg-black/40 rounded-full z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative w-12 h-12 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedIndex === idx
                      ? "border-white scale-110 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                  aria-label={`Switch to image ${idx + 1}`}
                >
                  <Image src={img.url} alt="" fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
