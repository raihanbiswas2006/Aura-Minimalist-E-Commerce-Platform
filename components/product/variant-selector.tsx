"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Zap, Shield, RotateCcw, Truck, Check, Bell } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { trackEvent } from "@/lib/analytics";

interface VariantSelectorProps {
  product: Product;
}

export function VariantSelector({ product }: VariantSelectorProps) {
  const router = useRouter();
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

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  const addItemToCart = useCartStore((state) => state.addItem);

  // Price calculations
  const basePriceWithVariant = product.basePrice + (selectedVariant.priceModifier || 0);
  const activePrice = product.discountPrice
    ? product.discountPrice + (selectedVariant.priceModifier || 0)
    : basePriceWithVariant;

  const isOutOfStock = selectedVariant.stockQuantity === 0;
  const isLowStock = !isOutOfStock && selectedVariant.stockQuantity < 5;

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= selectedVariant.stockQuantity) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItemToCart({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      variantName: selectedVariant.name,
      unitPrice: activePrice,
      quantity,
      imageUrl: product.images[0]?.url || "",
      maxStock: selectedVariant.stockQuantity,
      slug: product.slug,
    });

    trackEvent("add_to_cart", {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
      price: activePrice,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addItemToCart({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      variantName: selectedVariant.name,
      unitPrice: activePrice,
      quantity,
      imageUrl: product.images[0]?.url || "",
      maxStock: selectedVariant.stockQuantity,
      slug: product.slug,
    });

    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      {/* Pricing Module */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-semibold text-[#14171A]">
            {formatPrice(activePrice)}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-lg text-[#9CA3AF] line-through">
                {formatPrice(basePriceWithVariant)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#C2222E]/10 text-[#C2222E]">
                -{Math.round(((basePriceWithVariant - activePrice) / basePriceWithVariant) * 100)}% Sale
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-[#6B7280]">
          Taxes calculated at checkout • Complimentary delivery on orders over $150
        </p>
      </div>

      {/* Color Variant Swatches */}
      {product.variants.length > 1 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#14171A]">
              Color: <span className="font-normal text-[#6B7280]">{selectedVariant.color.name}</span>
            </span>
            {selectedVariant.priceModifier !== 0 && (
              <span className="text-[#1F4E43] font-medium">
                {selectedVariant.priceModifier > 0
                  ? `+$${selectedVariant.priceModifier}`
                  : `-$${Math.abs(selectedVariant.priceModifier)}`}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Product color choices">
            {product.variants.map((v) => {
              const isSelected = selectedVariant.id === v.id;
              const vOutOfStock = v.stockQuantity === 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${v.color.name}${vOutOfStock ? " - Out of stock" : ""}`}
                  onClick={() => {
                    setSelectedVariant(v);
                    setQuantity(1);
                  }}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#1F4E43] bg-[#1F4E43]/5 text-[#1F4E43] ring-1 ring-[#1F4E43]"
                      : "border-[#E4E7EB] hover:border-[#D1D5DB] text-[#14171A] bg-white"
                  } ${vOutOfStock ? "opacity-60" : ""}`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: v.color.hex }}
                  />
                  <span>{v.color.name}</span>
                  {vOutOfStock && (
                    <span className="text-[10px] text-[#C2222E] font-normal">(Sold out)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size or Dimension Variant (if specified) */}
      {selectedVariant.size && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#14171A]">
              Configuration / Size:
            </span>
            <span className="text-[#6B7280]">{selectedVariant.size}</span>
          </div>
          <div className="inline-block px-3 py-1.5 bg-[#FAF9F6] border border-[#E4E7EB] rounded-md text-xs font-medium text-[#14171A]">
            {selectedVariant.size}
          </div>
        </div>
      )}

      {/* Inventory Stock Status Badge */}
      <div className="pt-2">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 p-3 bg-[#FAF9F6] border border-[#E4E7EB] rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#14171A]">Currently Out of Stock</p>
              <p className="text-[11px] text-[#6B7280]">
                Select another variant or register for notification when replenishment arrives.
              </p>
            </div>
          </div>
        ) : isLowStock ? (
          <div className="flex items-center gap-2 p-2.5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg text-[#B45309]">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse shrink-0" />
            <p className="text-xs font-semibold">
              Only {selectedVariant.stockQuantity} remaining in stock — order soon
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#18804E] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#1B9E60] shrink-0" />
            <span>In Stock and ready to dispatch</span>
          </div>
        )}
      </div>

      {/* Quantity Stepper & Add to Cart Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          {/* Stepper */}
          <div className="flex items-center border border-[#E4E7EB] rounded-md bg-white">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock}
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-3 text-[#6B7280] hover:text-[#14171A] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-[#14171A]">
              {isOutOfStock ? 0 : quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= selectedVariant.stockQuantity || isOutOfStock}
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-3 text-[#6B7280] hover:text-[#14171A] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 transition-all ${
              isAdded ? "bg-[#1B9E60] hover:bg-[#18804E]" : ""
            }`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart • {formatPrice(activePrice * quantity)}</span>
              </>
            )}
          </Button>
        </div>

        {/* Secondary Buy Now or Out of Stock Notification */}
        {isOutOfStock ? (
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setIsNotified(true)}
          >
            {isNotified ? (
              <span className="text-[#18804E] font-medium">✓ You will be notified when restocked</span>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Notify Me When Available</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="w-full flex items-center justify-center gap-2 font-semibold"
            onClick={handleBuyNow}
          >
            <Zap className="w-4 h-4 text-[#1F4E43]" />
            <span>Instant Checkout</span>
          </Button>
        )}
      </div>

      {/* Trust & Craftsmanship Standards (Sample Policy Simulation) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E4E7EB] text-xs text-[#6B7280]">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#1F4E43] shrink-0" />
          <span>Carbon-neutral delivery (Demo)</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#1F4E43] shrink-0" />
          <span>30-day return window (Sample)</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1F4E43] shrink-0" />
          <span>Joinery craft standard (Sample)</span>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar per PRD Section 8.2 */}
      <div className="fixed md:hidden bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md p-3 border-t border-[#E4E7EB] shadow-lg flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-[#6B7280] font-medium">Total</p>
          <p className="text-base font-bold text-[#14171A]">
            {formatPrice(activePrice * (isOutOfStock ? 1 : quantity))}
          </p>
        </div>
        <Button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="flex-1 h-12 text-sm font-semibold"
        >
          {isOutOfStock ? "Out of Stock" : isAdded ? "Added ✓" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
