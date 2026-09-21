"use client";

import React from "react";
import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { CATEGORIES } from "@/data/categories";
import { DEMO_USERS } from "@/data/users";
import { useAuthStore } from "@/store/auth-store";
import { User, LogIn, LogOut, ShieldCheck, Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, isAuthenticated, switchUser, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      side="left"
      title="Aura Living"
      description="Modern Minimalist Commerce"
    >
      <div className="flex flex-col h-full space-y-6">
        {/* Navigation Categories */}
        <div>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
            Categories
          </p>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/c/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between py-2 text-base font-medium text-[#14171A] hover:text-[#1F4E43] transition-colors border-b border-[#F3F4F6]"
              >
                <span>{cat.title}</span>
                <span className="text-xs text-[#9CA3AF]">{cat.itemCount} items</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
            Quick Actions
          </p>
          <div className="space-y-1">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between py-2 text-sm font-medium text-[#14171A] hover:text-[#1F4E43]"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#6B7280]" />
                <span>Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-[#1F4E43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-between py-2 text-sm font-medium text-[#14171A] hover:text-[#1F4E43]"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#6B7280]" />
                <span>Shopping Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-[#1F4E43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-2 py-2 text-sm font-medium text-[#14171A] hover:text-[#1F4E43]"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F4E43]" />
              <span>Admin Demo Controller</span>
            </Link>
          </div>
        </div>

        {/* Demo User Session */}
        <div className="p-3 bg-[#FAF9F6] border border-[#E4E7EB] rounded-lg">
          <p className="text-xs font-semibold text-[#14171A] mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#1F4E43]" />
            <span>Demo Customer Session</span>
          </p>

          {isAuthenticated && user ? (
            <div>
              <p className="text-xs text-[#14171A] font-medium">{user.name}</p>
              <p className="text-[11px] text-[#6B7280]">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="text-xs text-[#1F4E43] hover:underline font-medium"
                >
                  Order History
                </Link>
                <span className="text-[#D1D5DB]">•</span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-xs text-[#C2222E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[11px] text-[#6B7280]">Switch to a demo profile:</p>
              <div className="flex flex-col gap-1">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => switchUser(u.email)}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white border border-[#E4E7EB] hover:border-[#1F4E43] text-left cursor-pointer"
                  >
                    <span>{u.name}</span>
                    <LogIn className="w-3 h-3 text-[#1F4E43]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Care Links */}
        <div className="pt-2 border-t border-[#F3F4F6] text-xs text-[#6B7280] space-y-1">
          <Link href="/about" onClick={onClose} className="block py-1 hover:text-[#14171A]">
            About Aura Living
          </Link>
          <Link href="/shipping" onClick={onClose} className="block py-1 hover:text-[#14171A]">
            Shipping Policy & Thresholds
          </Link>
          <Link href="/returns" onClick={onClose} className="block py-1 hover:text-[#14171A]">
            Returns & Guarantees
          </Link>
          <Link href="/contact" onClick={onClose} className="block py-1 hover:text-[#14171A]">
            Contact Customer Concierge
          </Link>
        </div>
      </div>
    </Sheet>
  );
}
