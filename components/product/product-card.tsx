"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { trackEvent } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: "default",
      sku: "DEFAULT",
      name: "Default",
      color: { name: "Default", hex: "#000000" },
      priceModifier: 0,
      stockQuantity: 10,
    }
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedBriefly, setIsAddedBriefly] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);

  const isFavorited = isInWishlist(product.id);

  // Price calculations with variant modifier
  const basePriceWithVariant = product.basePrice + (selectedVariant.priceModifier || 0);
  const activePrice = product.discountPrice
    ? product.discountPrice + (selectedVariant.priceModifier || 0)
    : basePriceWithVariant;

  const discountPercent = product.discountPrice
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : 0;

  // Determine image to display
  const primaryImg = product.images[0]?.url || "";
  const secondaryImg = product.images[1]?.url || primaryImg;
  const currentImg = isHovered && secondaryImg !== primaryImg ? secondaryImg : primaryImg;

  // Badge determination
  const hasSale = product.discountPrice !== undefined && product.discountPrice < product.basePrice;
  const isOutOfStock = selectedVariant.stockQuantity === 0;
  const isLowStock = !isOutOfStock && selectedVariant.stockQuantity < 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItemToCart({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      variantName: selectedVariant.name,
      unitPrice: activePrice,
      quantity: 1,
      imageUrl: primaryImg,
      maxStock: selectedVariant.stockQuantity,
    });

    trackEvent("add_to_cart", {
      productId: product.id,
      variantId: selectedVariant.id,
      price: activePrice,
    });

    setIsAddedBriefly(true);
    setTimeout(() => setIsAddedBriefly(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative flex flex-col h-full bg-white rounded-lg border border-[#E4E7EB] hover:border-[#D1D5DB] transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container: 4:5 vertical aspect ratio */}
      <div className="relative aspect-4/5 w-full bg-[#FAF9F6] overflow-hidden">
        <Link href={`/p/${product.slug}`} className="block w-full h-full">
          <Image
            src={currentImg}
            alt={product.images[activeImageIndex]?.alt || product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Status Badges (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {hasSale && <Badge variant="sale">-{discountPercent}%</Badge>}
          {isLowStock && <Badge variant="warning">Low Stock</Badge>}
          {isOutOfStock && <Badge variant="neutral">Out of Stock</Badge>}
          {product.isNewArrival && !hasSale && <Badge variant="default">New</Badge>}
        </div>

        {/* Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
            isFavorited
              ? "bg-[#C2222E] text-white"
              : "bg-white/90 text-[#14171A] hover:bg-white hover:scale-110"
          }`}
          aria-label={isFavorited ? `Remove ${product.title} from Wishlist` : `Add ${product.title} to Wishlist`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add Button (Desktop Hover or Bottom docked) */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isOutOfStock
                ? "bg-[#9CA3AF] text-white cursor-not-allowed"
                : isAddedBriefly
                ? "bg-[#1B9E60] text-white"
                : "bg-[#14171A] text-white hover:bg-[#1F4E43]"
            }`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : isAddedBriefly ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Micro-typography */}
          <p className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold mb-1">
            {product.tags[0] || "Aura Collection"}
          </p>

          {/* Product Title */}
          <h3 className="text-sm font-medium text-[#14171A] line-clamp-2 leading-snug group-hover:text-[#1F4E43] transition-colors">
            <Link href={`/p/${product.slug}`}>{product.title}</Link>
          </h3>

          {/* Rating Summary */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#6B7280]">
            <div className="flex items-center text-[#F59E0B]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-[#14171A]">{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Swatches */}
        <div className="pt-3 mt-3 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
          {/* Price Container */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-semibold text-[#14171A]">
                {formatPrice(activePrice)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-[#9CA3AF] line-through">
                  {formatPrice(basePriceWithVariant)}
                </span>
              )}
            </div>
          </div>

          {/* Color Swatches */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1.5" aria-label="Product color choices">
              {product.variants.slice(0, 4).map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariant(variant);
                    }}
                    title={variant.color.name}
                    aria-label={`Select color ${variant.color.name}`}
                    className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[#1F4E43] ring-offset-1 scale-110 border-transparent"
                        : "border-black/20 hover:scale-110"
                    }`}
                    style={{ backgroundColor: variant.color.hex }}
                  />
                );
              })}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-[#9CA3AF] font-medium">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
