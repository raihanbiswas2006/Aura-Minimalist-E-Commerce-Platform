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

  const [isAddedBriefly, setIsAddedBriefly] = useState(false);
  const [wishlistPopping, setWishlistPopping] = useState(false);

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

  // Determine images
  const primaryImg = product.images[0]?.url || "";
  const secondaryImg = product.images[1]?.url;
  const hasSecondary = Boolean(secondaryImg && secondaryImg !== primaryImg);

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
      slug: product.slug,
    });

    trackEvent("add_to_cart", {
      productId: product.id,
      variantId: selectedVariant.id,
      price: activePrice,
    });

    setIsAddedBriefly(true);
    setTimeout(() => setIsAddedBriefly(false), 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistPopping(true);
    toggleWishlist(product.id);
    setTimeout(() => setWishlistPopping(false), 400);
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-xl border border-[#E4E7EB] hover:border-[#CBD5E1] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md">
      {/* Media Container: 4:5 vertical aspect ratio with crossfade */}
      <div className="relative aspect-4/5 w-full bg-[#FAF9F6] overflow-hidden select-none">
        <Link href={`/p/${product.slug}`} className="block w-full h-full relative" tabIndex={-1}>
          {/* Primary Image */}
          <Image
            src={primaryImg}
            alt={product.images[0]?.alt || product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              hasSecondary ? "group-hover:opacity-0" : ""
            }`}
          />

          {/* Smooth Secondary Crossfade Image (if present) */}
          {hasSecondary && (
            <Image
              src={secondaryImg!}
              alt={product.images[1]?.alt || `${product.title} alternative view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-105 pointer-events-none"
            />
          )}
        </Link>

        {/* Status Badges (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {hasSale && <Badge variant="sale">-{discountPercent}%</Badge>}
          {isLowStock && <Badge variant="warning">Low Stock</Badge>}
          {isOutOfStock && <Badge variant="neutral">Out of Stock</Badge>}
          {product.isNewArrival && !hasSale && <Badge variant="default">New</Badge>}
        </div>

        {/* Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F4E43] ${
            wishlistPopping ? "animate-heart-pop" : ""
          } ${
            isFavorited
              ? "bg-[#C2222E] text-white hover:bg-[#A31B25]"
              : "bg-white/90 text-[#14171A] hover:bg-white hover:scale-110 active:scale-95"
          }`}
          aria-label={
            isFavorited ? `Remove ${product.title} from Wishlist` : `Add ${product.title} to Wishlist`
          }
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add Button (Desktop Hover or Mobile Touch Accessible) */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 ease-out">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all duration-150 active:scale-98 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F4E43] ${
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

      {/* Details Container (Stable typography to prevent CLS) */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Micro-typography */}
          <p className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold mb-1 truncate">
            {product.tags[0] || "Aura Collection"}
          </p>

          {/* Product Title */}
          <h3 className="text-sm font-medium text-[#14171A] line-clamp-2 leading-snug group-hover:text-[#1F4E43] transition-colors duration-150">
            <Link href={`/p/${product.slug}`} className="focus-visible:outline-2 focus-visible:outline-[#1F4E43] rounded">
              {product.title}
            </Link>
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
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[#1F4E43] ring-offset-1 scale-115 border-transparent"
                        : "border-black/20 hover:scale-110 active:scale-95"
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
