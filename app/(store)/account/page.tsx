"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User, Package, MapPin, LogIn, LogOut, Check, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { DEMO_USERS } from "@/data/users";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user: demoUser, switchUser } = useAuthStore();

  const isLiveAuthenticated = status === "authenticated" && !!session?.user;
  const currentName = session?.user?.name || demoUser?.name || "Guest Visitor";
  const currentEmail = session?.user?.email || demoUser?.email || "No permanent account logged in";
  const currentRole = session?.user?.role || "CUSTOMER";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="pb-6 border-b border-[#E4E7EB] mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#14171A]">
          Customer Account &amp; Security Portal
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Manage your verified customer credentials, historical receipts, and delivery addresses.
        </p>
      </div>

      {/* Unauthenticated Security Alert */}
      {!isLiveAuthenticated && status !== "loading" && (
        <div className="mb-8 p-4 rounded-xl bg-[#1F4E43]/5 border border-[#1F4E43]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#1F4E43]">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 shrink-0" />
            <p>
              <strong>Browsing as Guest:</strong> Sign in with email/password or Google to sync saved addresses and access verified order tracking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login?callbackUrl=/account">
              <Button size="sm" variant="primary">Sign In</Button>
            </Link>
            <Link href="/register?callbackUrl=/account">
              <Button size="sm" variant="outline">Register</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-[#E4E7EB] p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1F4E43]/10 text-[#1F4E43] flex items-center justify-center font-serif text-xl font-bold">
                {currentName[0] || "G"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#14171A]">
                    {currentName}
                  </h2>
                  {isLiveAuthenticated && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#18804E] bg-[#18804E]/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      {currentRole}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B7280]">
                  {currentEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Demonstration Credentials Quick Switch */}
          <div className="pt-4 border-t border-[#E4E7EB] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Instant Demo Personas
            </h3>
            <div className="space-y-2">
              {DEMO_USERS.map((demo) => {
                const isSelected = currentEmail.toLowerCase() === demo.email.toLowerCase();
                return (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => {
                      switchUser(demo.email);
                      router.push(`/login?callbackUrl=/account`);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#1F4E43] bg-[#1F4E43]/5 text-[#1F4E43] ring-1 ring-[#1F4E43]"
                        : "border-[#E4E7EB] hover:border-[#D1D5DB] bg-white text-[#14171A]"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{demo.name}</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">{demo.email}</p>
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 font-bold text-[#1F4E43]">
                        <Check className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="text-[#6B7280] hover:text-[#1F4E43] flex items-center gap-1 font-medium">
                        <LogIn className="w-3.5 h-3.5" /> Switch &amp; Sign In
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {isLiveAuthenticated && (
            <div className="pt-2 border-t border-[#E4E7EB]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-[#C2222E] hover:text-[#C2222E] flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Aura</span>
              </Button>
            </div>
          )}
        </div>

        {/* Quick Portal Navigation */}
        <div className="md:col-span-5 space-y-4">
          <Link
            href="/account/orders"
            className="flex items-center justify-between p-5 bg-white rounded-xl border border-[#E4E7EB] hover:border-[#1F4E43] transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] border border-[#E4E7EB] flex items-center justify-center text-[#14171A]">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#14171A] group-hover:text-[#1F4E43] transition-colors">
                  Historical Orders
                </h3>
                <p className="text-xs text-[#6B7280]">Inspect receipts &amp; real-time tracking</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 group-hover:text-[#1F4E43] transition-all" />
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center justify-between p-5 bg-white rounded-xl border border-[#E4E7EB] hover:border-[#1F4E43] transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] border border-[#E4E7EB] flex items-center justify-center text-[#14171A]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#14171A] group-hover:text-[#1F4E43] transition-colors">
                  Curated Wishlist
                </h3>
                <p className="text-xs text-[#6B7280]">Saved items for consideration</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 group-hover:text-[#1F4E43] transition-all" />
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-between p-5 bg-white rounded-xl border border-[#1F4E43]/30 hover:border-[#1F4E43] transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1F4E43]">
                  Admin Control Panel
                </h3>
                <p className="text-xs text-[#6B7280]">Live inventory &amp; order lifecycle simulator</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1F4E43] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
