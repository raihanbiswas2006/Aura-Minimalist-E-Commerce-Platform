"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Heart,
  ShoppingBag,
  User,
  Search as SearchIcon,
  X,
  Check,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { SearchAutocomplete } from "@/components/search/search-autocomplete";
import { MobileNav } from "./mobile-nav";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore } from "@/store/auth-store";
import { DEMO_USERS } from "@/data/users";

const NAV_LINKS = [
  { href: "/c/furniture", label: "Furniture" },
  { href: "/c/lighting", label: "Lighting" },
  { href: "/c/textiles", label: "Textiles" },
  { href: "/c/decor", label: "Decor" },
  { href: "/c/sale", label: "Sale", isSale: true },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const totalCartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const openCartDrawer = useCartStore((state) => state.openDrawer);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user, isAuthenticated, switchUser, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-[#FAF9F6]/95 backdrop-blur-md shadow-xs border-b border-[#E4E7EB]"
            : "bg-[#FAF9F6] border-b border-[#E4E7EB]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4">
            {/* Left: Mobile Menu Trigger & Desktop Logo */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#14171A] hover:text-[#1F4E43] rounded-md focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Vector SVG Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-[#1F4E43] rounded py-1"
                aria-label="Aura Living Home"
              >
                <svg
                  className="w-7 h-7 text-[#1F4E43] transition-transform group-hover:scale-105"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="16" cy="16" r="3" fill="currentColor" />
                </svg>
                <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#14171A] uppercase">
                  Aura
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 transition-colors hover:text-[#1F4E43] focus-visible:outline-2 focus-visible:outline-[#1F4E43] rounded ${
                      isActive
                        ? "text-[#1F4E43] font-semibold"
                        : link.isSale
                        ? "text-[#C2222E]"
                        : "text-[#14171A]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F4E43] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Middle: Integrated Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm">
              <SearchAutocomplete />
            </div>

            {/* Right: Action Utilities */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2 text-[#14171A] hover:text-[#1F4E43] rounded-full focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
                aria-label="Toggle search input"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Wishlist Link with Dynamic Badge */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[#14171A] hover:text-[#1F4E43] rounded-full hover:bg-black/5 transition-colors focus-visible:outline-2 focus-visible:outline-[#1F4E43]"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#1F4E43] rounded-full ring-2 ring-white animate-in zoom-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-[#14171A] hover:text-[#1F4E43] rounded-full hover:bg-black/5 transition-colors focus-visible:outline-2 focus-visible:outline-[#1F4E43] flex items-center gap-1 cursor-pointer"
                  aria-label="Customer account menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <User className="w-5 h-5" />
                  {isAuthenticated && user && (
                    <span className="hidden xl:inline text-xs font-medium text-[#14171A] max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-[#E4E7EB] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#F3F4F6]">
                      <p className="text-xs text-[#9CA3AF] uppercase font-semibold tracking-wider">
                        Demo Account Portal
                      </p>
                      {isAuthenticated && user ? (
                        <div className="mt-1">
                          <p className="text-sm font-semibold text-[#14171A]">{user.name}</p>
                          <p className="text-xs text-[#6B7280]">{user.email}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-[#6B7280] mt-1">
                          Currently browsing as <strong>Guest</strong>
                        </p>
                      )}
                    </div>

                    <div className="p-2 border-b border-[#F3F4F6]">
                      <p className="text-[11px] font-medium text-[#9CA3AF] px-2 mb-1">
                        Switch Persona:
                      </p>
                      {DEMO_USERS.map((u) => {
                        const isCurrent = user?.id === u.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              switchUser(u.email);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left transition-colors cursor-pointer ${
                              isCurrent ? "bg-[#1F4E43]/10 text-[#1F4E43] font-semibold" : "hover:bg-[#FAF9F6] text-[#14171A]"
                            }`}
                          >
                            <span>{u.name}</span>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-[#1F4E43]" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-1.5 text-xs text-[#14171A] hover:bg-[#FAF9F6]"
                      >
                        Historical Orders
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-[#1F4E43] hover:bg-[#FAF9F6] font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Demo Controller
                      </Link>

                      {isAuthenticated && (
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-1.5 px-4 py-1.5 text-xs text-[#C2222E] hover:bg-[#FAF9F6] text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out to Guest
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Bag Trigger */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="relative p-2 text-[#14171A] hover:text-[#1F4E43] rounded-full hover:bg-black/5 transition-colors focus-visible:outline-2 focus-visible:outline-[#1F4E43] cursor-pointer"
                aria-label={`Shopping bag containing ${totalCartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#1F4E43] rounded-full ring-2 ring-white animate-in zoom-in">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          {isMobileSearchOpen && (
            <div className="md:hidden py-3 px-1 border-t border-[#E4E7EB] animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <SearchAutocomplete
                  onSearchSubmit={() => setIsMobileSearchOpen(false)}
                  isMobileModal={true}
                />
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 text-[#6B7280] hover:text-[#14171A] cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
