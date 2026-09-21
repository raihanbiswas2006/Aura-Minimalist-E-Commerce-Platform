"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { FreeShippingMeter } from "@/components/cart/free-shipping-meter";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    shippingTotal,
    discountAmount,
    estimatedTotal,
    couponCode,
    couponError,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E4E7EB] mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#14171A]">
            Shopping Bag ({totalCount})
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Review and adjust your selected furniture, lighting, and textiles before checkout.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-[#6B7280] hover:text-[#C2222E] underline cursor-pointer self-start md:self-auto"
          >
            Clear Entire Bag
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E4E7EB] max-w-xl mx-auto p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E4E7EB] flex items-center justify-center mx-auto mb-4 text-[#9CA3AF]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#14171A]">
            Your shopping bag is currently empty
          </h2>
          <p className="text-xs text-[#6B7280] mt-2 max-w-sm mx-auto leading-relaxed">
            Begin exploring our curated Japanese and Scandinavian inspired collections for your home.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/c/furniture">
              <Button variant="primary">Explore Furniture</Button>
            </Link>
            <Link href="/c/lighting">
              <Button variant="outline">Browse Lighting</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table / List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <FreeShippingMeter
              subtotal={subtotal}
              hasFreeShippingCoupon={couponCode === "FREESHIP"}
            />

            <div className="bg-white rounded-xl border border-[#E4E7EB] overflow-hidden shadow-2xs divide-y divide-[#E4E7EB]">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-20 aspect-4/5 rounded-md overflow-hidden bg-[#FAF9F6] border border-[#E4E7EB] shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#14171A] truncate hover:text-[#1F4E43]">
                        <Link href={`/p/${item.productId.replace("prod-", "")}`}>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">{item.variantName}</p>
                      <p className="text-xs font-semibold text-[#14171A] mt-1.5 sm:hidden">
                        {formatPrice(item.unitPrice)} each
                      </p>
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-[#9CA3AF]">Unit Price</p>
                    <p className="text-sm font-semibold text-[#14171A] mt-0.5">
                      {formatPrice(item.unitPrice)}
                    </p>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8">
                    <div className="flex items-center border border-[#E4E7EB] rounded-md bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-[#6B7280] hover:text-[#14171A] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-semibold text-[#14171A]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.maxStock}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-[#6B7280] hover:text-[#14171A] disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="text-xs text-[#9CA3AF] hidden sm:block">Item Total</p>
                      <p className="text-sm font-semibold text-[#14171A]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#9CA3AF] hover:text-[#C2222E] transition-colors rounded-full hover:bg-[#FAF9F6] cursor-pointer"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-[#6B7280] pt-2">
              <Link
                href="/c/furniture"
                className="text-[#1F4E43] hover:underline font-medium flex items-center gap-1"
              >
                <span>← Continue Shopping</span>
              </Link>
              <span>Prices in USD. Taxes calculated at checkout.</span>
            </div>
          </div>

          {/* Order Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-[#E4E7EB] p-6 shadow-2xs space-y-6 sticky top-24">
            <h2 className="font-serif text-xl font-semibold text-[#14171A] pb-4 border-b border-[#E4E7EB]">
              Order Summary
            </h2>

            {/* Subtotals breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#6B7280]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#14171A]">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#18804E] font-medium">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#6B7280]">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-[#14171A]">
                  {shippingTotal === 0 ? "FREE" : formatPrice(shippingTotal)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#14171A] pt-3 border-t border-[#E4E7EB]">
                <span>Estimated Total</span>
                <span className="text-[#1F4E43]">{formatPrice(estimatedTotal)}</span>
              </div>
            </div>

            {/* Promo code form */}
            <div className="pt-4 border-t border-[#E4E7EB]">
              {couponCode ? (
                <div className="flex items-center justify-between bg-[#1F4E43]/5 border border-[#1F4E43]/20 rounded-md px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#1F4E43] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Applied: <strong>{couponCode}</strong></span>
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
                <form onSubmit={handleApply} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Promo code (SAVE10, FREESHIP)"
                      className="flex-1 h-10 px-3 text-xs border border-[#E4E7EB] rounded-md focus-visible:outline-2 focus-visible:outline-[#1F4E43] uppercase"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-[#C2222E]">{couponError}</p>
                  )}
                  {couponFeedback && !couponError && (
                    <p className="text-xs text-[#18804E]">{couponFeedback}</p>
                  )}
                </form>
              )}
            </div>

            {/* Proceed to Checkout CTA */}
            <div className="pt-2">
              <Button
                className="w-full flex items-center justify-center gap-2"
                size="lg"
                onClick={() => router.push("/checkout")}
              >
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Trust badge */}
            <div className="pt-4 border-t border-[#E4E7EB] flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
              <ShieldCheck className="w-4 h-4 text-[#1F4E43]" />
              <span>Simulated Demo Sandbox • Zero Real Funds Charged</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
