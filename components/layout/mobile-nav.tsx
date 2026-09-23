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
import { useSession, signOut } from "next-auth/react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, isAuthenticated, switchUser, logout } = useAuthStore();
  const { data: session } = useSession();
  const effectiveUser = session?.user
    ? { name: session.user.name || "Member", email: session.user.email || "" }
    : user;
  const isAuthed = !!session?.user || isAuthenticated;
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

        {/* User Session Block */}
        <div className="p-3 bg-[#FAF9F6] border border-[#E4E7EB] rounded-lg">
          <p className="text-xs font-semibold text-[#14171A] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#1F4E43]" />
              <span>{isAuthed ? "Verified Customer" : "Customer Portal"}</span>
            </span>
            {isAuthed && (
              <span className="text-[10px] text-[#18804E] font-bold bg-[#18804E]/10 px-1.5 py-0.5 rounded">
                Active
              </span>
            )}
          </p>

          {isAuthed && effectiveUser ? (
            <div>
              <p className="text-xs text-[#14171A] font-medium">{effectiveUser.name}</p>
              <p className="text-[11px] text-[#6B7280] truncate">{effectiveUser.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="text-[#1F4E43] hover:underline font-medium"
                >
                  Account
                </Link>
                <span className="text-[#D1D5DB]">•</span>
                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="text-[#1F4E43] hover:underline font-medium"
                >
                  Orders
                </Link>
                <span className="text-[#D1D5DB]">•</span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    signOut({ callbackUrl: "/" });
                    onClose();
                  }}
                  className="text-[#C2222E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex-1 py-1 text-center text-xs font-semibold bg-[#1F4E43] text-white rounded hover:bg-[#183E35]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex-1 py-1 text-center text-xs font-semibold bg-white border border-[#E4E7EB] text-[#14171A] rounded hover:border-[#1F4E43]"
                >
                  Register
                </Link>
              </div>
              <p className="text-[11px] text-[#6B7280]">Switch to a demo profile:</p>
              <div className="flex flex-col gap-1">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u.email);
                      onClose();
                    }}
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
