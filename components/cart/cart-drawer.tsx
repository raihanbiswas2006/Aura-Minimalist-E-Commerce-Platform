"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { CartLineItem } from "./cart-line-item";
import { FreeShippingMeter } from "./free-shipping-meter";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    subtotal,
    shippingTotal,
    discountAmount,
    estimatedTotal,
    couponCode,
    couponError,
    isDrawerOpen,
    closeDrawer,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback(res.message);
    if (res.success) {
      setInputCoupon("");
    }
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      side="right"
      title={`Shopping Bag (${totalCount})`}
      description="Review your curated items before checkout"
    >
      <div className="flex flex-col h-full">
        {/* ARIA Live region for screen readers */}
        <div className="sr-only" role="status" aria-live="polite">
          {items.length > 0
            ? `Shopping bag updated. ${totalCount} items in cart, total ${formatPrice(estimatedTotal)}.`
            : "Shopping bag is empty."}
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E4E7EB] flex items-center justify-center mb-4 text-[#9CA3AF]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif text-[#14171A]">Your bag is empty</h3>
            <p className="text-sm text-[#6B7280] mt-1.5 max-w-xs mb-6">
              Discover timeless furniture, ambient lighting, and organic textiles crafted for mindful spaces.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                closeDrawer();
                router.push("/c/furniture");
              }}
            >
              Explore Collection
            </Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Free Shipping Meter */}
            <FreeShippingMeter
              subtotal={subtotal}
              hasFreeShippingCoupon={couponCode === "FREESHIP"}
            />

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto pr-1">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} onItemClick={closeDrawer} />
              ))}
            </div>

            {/* Coupon Section */}
            <div className="pt-4 border-t border-[#E4E7EB]">
              {couponCode ? (
                <div className="flex items-center justify-between bg-[#1F4E43]/5 border border-[#1F4E43]/20 rounded-md px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#1F4E43] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon applied: <strong>{couponCode}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[#C2222E] hover:underline font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Promo code (SAVE10, FREESHIP)"
                    className="flex-1 h-9 px-3 text-xs border border-[#E4E7EB] rounded-md focus-visible:outline-2 focus-visible:outline-[#1F4E43] uppercase"
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    Apply
                  </Button>
                </form>
              )}

              {couponError && (
                <p className="text-xs text-[#C2222E] mt-1.5">{couponError}</p>
              )}
              {couponFeedback && !couponError && (
                <p className="text-xs text-[#18804E] mt-1.5">{couponFeedback}</p>
              )}
            </div>

            {/* Summary & Checkout CTA */}
            <div className="pt-4 mt-4 border-t border-[#E4E7EB] space-y-2">
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-[#18804E] font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Estimated Shipping</span>
                <span>{shippingTotal === 0 ? "FREE" : formatPrice(shippingTotal)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#14171A] pt-2 border-t border-[#E4E7EB]">
                <span>Total</span>
                <span>{formatPrice(estimatedTotal)}</span>
              </div>

              <div className="pt-3 space-y-2">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  onClick={() => {
                    closeDrawer();
                    router.push("/checkout");
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div className="text-center">
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="text-xs text-[#6B7280] hover:text-[#14171A] underline underline-offset-4"
                  >
                    View Full Shopping Bag
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
