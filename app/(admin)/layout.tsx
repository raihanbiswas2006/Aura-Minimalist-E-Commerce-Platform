import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, ArrowLeft, Lock, AlertTriangle } from "lucide-react";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Guests -> no admin access. Redirect to login with callbackUrl
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Customers -> no admin access. Return 403 screen without rendering children.
  if (session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <header className="bg-[#14171A] text-white py-4 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-widest uppercase hover:text-[#34D399] transition-colors"
            >
              Aura
            </Link>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1.5 text-xs text-[#C2222E] bg-[#C2222E]/10 px-2.5 py-1 rounded-full font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Area</span>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs text-white/80 hover:text-white flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E4E7EB] p-8 text-center shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#C2222E]/10 text-[#C2222E] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#14171A]">
              Access Denied (403)
            </h1>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              You are currently signed in as <strong>{session.user.email}</strong> with customer privileges. The Administrative Hub requires verified server-side <strong>ADMIN</strong> credentials.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/login?callbackUrl=/admin"
                className="w-full inline-flex items-center justify-center h-11 px-4 rounded-md bg-[#1F4E43] text-white text-xs font-semibold hover:bg-[#183E35] transition-colors"
              >
                Sign In with Admin Account (admin@demo.aura)
              </Link>
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center h-11 px-4 rounded-md border border-[#E4E7EB] text-[#14171A] text-xs font-semibold hover:bg-[#FAF9F6] transition-colors"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-[#6B7280] border-t border-[#E4E7EB] bg-white">
          Aura Commerce • Protected Administrative Sandbox
        </footer>
      </div>
    );
  }

  // Admin -> admin access
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <header className="bg-[#14171A] text-white py-4 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-widest uppercase hover:text-[#34D399] transition-colors"
          >
            Aura
          </Link>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Interactive Simulation Sandbox (Demo)</span>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs text-white/80 hover:text-white flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-4 text-center text-xs text-[#6B7280] border-t border-[#E4E7EB] bg-white">
        Aura Commerce • Demonstration Control Center
      </footer>
    </div>
  );
}
