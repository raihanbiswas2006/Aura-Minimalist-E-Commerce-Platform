"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/checkout";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters.";
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (formData.phone) {
      const clean = formData.phone.replace(/[\s-]/g, "");
      if (!/^(?:\+?880|0)?1[3-9]\d{8}$/.test(clean)) {
        errs.phone = "Please enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX).";
      }
    }

    if (!formData.password || formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Automatically sign in upon successful registration
      const signInRes = await signIn("credentials", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.error) {
        // Fallback: redirect to login if auto-login had an issue
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12 md:py-16">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group mb-4 focus-visible:outline-2 focus-visible:outline-[#1F4E43] rounded"
        >
          <svg
            className="w-8 h-8 text-[#1F4E43] transition-transform group-hover:scale-105"
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
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#14171A]">
          Create Your Account
        </h1>
        <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
          Join Aura Living to unlock intentional living, seamless delivery across Bangladesh, and secure order tracking.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Cart notice if redirected from checkout */}
        {callbackUrl.includes("checkout") && (
          <div className="p-3.5 rounded-xl bg-[#1F4E43]/5 border border-[#1F4E43]/20 flex items-start gap-2.5 text-xs text-[#1F4E43]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Your shopping bag items and quantities will be automatically preserved when your account is registered.
            </p>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-3.5 rounded-xl bg-[#C2222E]/10 border border-[#C2222E]/20 flex items-start gap-2.5 text-xs text-[#C2222E]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Arif Rahman"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. arif@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />

          <Input
            label="Mobile Number (Optional)"
            type="tel"
            placeholder="e.g. 01711000000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
          />

          <div>
            <label className="block text-xs font-semibold text-[#14171A] mb-1.5">
              Password (Min. 8 characters) *
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-11 px-3 text-sm bg-white border border-[#E4E7EB] rounded-md focus-visible:outline-2 focus-visible:outline-[#1F4E43]"
              required
            />
            {errors.password && (
              <p className="mt-1 text-xs text-[#C2222E]">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#14171A] mb-1.5">
              Confirm Password *
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full h-11 px-3 text-sm bg-white border border-[#E4E7EB] rounded-md focus-visible:outline-2 focus-visible:outline-[#1F4E43]"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-[#C2222E]">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-4"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E4E7EB]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white px-3 text-[#9CA3AF] font-semibold">Or Continue With</span>
          </div>
        </div>

        {/* Google OAuth Trigger */}
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2.5 text-xs font-semibold text-[#14171A] hover:bg-[#FAF9F6] border-[#E4E7EB]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </Button>

        {/* Switch to Login */}
        <div className="pt-2 text-center text-xs text-[#6B7280]">
          Already have an Aura account?{" "}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="text-[#1F4E43] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-xs text-[#6B7280]">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
