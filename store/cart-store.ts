"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartState } from "@/types";
import { SEEDED_COUPONS } from "@/data/coupons";

interface CartStore extends CartState {
  isDrawerOpen: boolean;
  couponError: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  totalItemCount: () => number;
}

const FREE_SHIPPING_THRESHOLD = 150.0;
const STANDARD_SHIPPING_FEE = 15.0;

function calculateTotals(items: CartItem[], couponCode?: string): {
  subtotal: number;
  discountAmount: number;
  shippingTotal: number;
  estimatedTotal: number;
} {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let shippingTotal = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0.0 : STANDARD_SHIPPING_FEE;
  let discountAmount = 0.0;

  if (couponCode) {
    const coupon = SEEDED_COUPONS.find((c) => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      if (coupon.discountType === "shipping") {
        shippingTotal = 0.0;
      } else if (coupon.discountType === "percentage") {
        if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        }
      } else if (coupon.discountType === "fixed") {
        if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
      }
    }
  }

  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingTotal);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    shippingTotal: Number(shippingTotal.toFixed(2)),
    estimatedTotal: Number(estimatedTotal.toFixed(2)),
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: undefined,
      couponError: null,
      discountAmount: 0.0,
      subtotal: 0.0,
      shippingTotal: 0.0,
      estimatedTotal: 0.0,
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.id === newItem.id);

        let updatedItems: CartItem[];
        if (existingIndex > -1) {
          updatedItems = [...currentItems];
          const existing = updatedItems[existingIndex];
          const newQty = Math.min(existing.quantity + newItem.quantity, newItem.maxStock);
          updatedItems[existingIndex] = { ...existing, quantity: newQty };
        } else {
          const validQty = Math.min(newItem.quantity, newItem.maxStock);
          updatedItems = [...currentItems, { ...newItem, quantity: validQty }];
        }

        const totals = calculateTotals(updatedItems, get().couponCode);
        set({
          items: updatedItems,
          ...totals,
          isDrawerOpen: true, // Automatically slide drawer open on add to cart
        });
      },

      removeItem: (id) => {
        const updatedItems = get().items.filter((item) => item.id !== id);
        const totals = calculateTotals(updatedItems, get().couponCode);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const updatedItems = get().items.map((item) => {
          if (item.id === id) {
            const cappedQty = Math.min(quantity, item.maxStock);
            return { ...item, quantity: cappedQty };
          }
          return item;
        });

        const totals = calculateTotals(updatedItems, get().couponCode);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      applyCoupon: (code) => {
        const trimmed = code.trim().toUpperCase();
        const found = SEEDED_COUPONS.find((c) => c.code.toUpperCase() === trimmed);
        const subtotal = get().subtotal;

        if (!found) {
          const err = `Invalid coupon code "${trimmed}".`;
          set({ couponError: err });
          return { success: false, message: err };
        }

        if (found.minOrderAmount && subtotal < found.minOrderAmount) {
          const err = `Coupon "${trimmed}" requires a minimum order of $${found.minOrderAmount.toFixed(2)}.`;
          set({ couponError: err });
          return { success: false, message: err };
        }

        const totals = calculateTotals(get().items, trimmed);
        set({
          couponCode: trimmed,
          couponError: null,
          ...totals,
        });

        return { success: true, message: `Coupon "${trimmed}" applied successfully!` };
      },

      removeCoupon: () => {
        const totals = calculateTotals(get().items, undefined);
        set({
          couponCode: undefined,
          couponError: null,
          ...totals,
        });
      },

      clearCart: () => {
        set({
          items: [],
          couponCode: undefined,
          couponError: null,
          discountAmount: 0.0,
          subtotal: 0.0,
          shippingTotal: 0.0,
          estimatedTotal: 0.0,
        });
      },

      totalItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "aura_cart_state", // Storage key strictly specified in PRD Section 14.1
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
        subtotal: state.subtotal,
        shippingTotal: state.shippingTotal,
        estimatedTotal: state.estimatedTotal,
      }),
    }
  )
);
