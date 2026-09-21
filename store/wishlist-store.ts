"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  items: string[]; // array of product IDs
  toggleWishlist: (productId: string) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (productId: string) => {
        const current = get().items;
        const exists = current.includes(productId);
        if (exists) {
          set({ items: current.filter((id) => id !== productId) });
          return false;
        } else {
          set({ items: [...current, productId] });
          return true;
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.includes(productId);
      },

      removeFromWishlist: (productId: string) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      count: () => {
        return get().items.length;
      },
    }),
    {
      name: "aura_wishlist_items", // Storage key specified in PRD Section 19.1
      storage: createJSONStorage(() => localStorage),
    }
  )
);
