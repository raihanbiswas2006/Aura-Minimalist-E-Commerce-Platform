"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, ArrowRight, AlertCircle, Info, Lock, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/checkout";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    authError === "OAuthCallback" ? "Failed to authenticate with Google. Please try again or use your password." : null
  );
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showGoogleNoticeModal, setShowGoogleNoticeModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!res || res.error) {
        // Generic failure message to prevent account enumeration
        setErrorMessage("Invalid email or password. Please verify your credentials and try again.");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl });
    } catch {
      setShowGoogleNoticeModal(true);
    }
  };

  const handleSelectDemoPersona = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("AuraLiving2026!");
    setErrorMessage(null);
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12 md:py-16">
      {/* Brand & Security Header */}
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
          Welcome Back
        </h1>
        <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
          Sign in to access your curated orders, saved addresses, and finalize checkout.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Callback Alert if redirected from Checkout */}
        {callbackUrl.includes("checkout") && (
          <div className="p-3.5 rounded-xl bg-[#1F4E43]/5 border border-[#1F4E43]/20 flex items-start gap-2.5 text-xs text-[#1F4E43]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>Purchase Protection Active:</strong> An authenticated account is required to finalize order placement. Your shopping bag is safely preserved.
            </p>
          </div>
        )}

        {/* Generic Auth Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#C2222E]/10 border border-[#C2222E]/20 flex items-start gap-2.5 text-xs text-[#C2222E]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="e.g. arif@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#14171A]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-[#1F4E43] hover:underline font-medium cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-3 text-sm bg-white border border-[#E4E7EB] rounded-md focus-visible:outline-2 focus-visible:outline-[#1F4E43]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In</span>
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
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2.5 text-xs font-semibold text-[#14171A] hover:bg-[#FAF9F6] border-[#E4E7EB]"
        >
          {/* Official Google Vector G */}
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

        {/* Switch to Register */}
        <div className="pt-2 text-center text-xs text-[#6B7280]">
          Don&apos;t have an Aura account?{" "}
          <Link
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="text-[#1F4E43] font-semibold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>

      {/* Developer / Demo Persona Quick-Fill Widget */}
      <div className="mt-8 p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] text-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#14171A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F4E43]" />
            <span>Pre-Seeded Demo Credentials</span>
          </span>
          <span className="text-[10px] text-[#6B7280] font-mono">Password: AuraLiving2026!</span>
        </div>
        <p className="text-[11px] text-[#6B7280]">
          Click any persona below to auto-populate credentials for instant portfolio evaluation:
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          <button
            type="button"
            onClick={() => handleSelectDemoPersona("arif@demo.aura")}
            className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E4E7EB] hover:border-[#1F4E43] text-left transition-colors cursor-pointer"
          >
            <div>
              <p className="font-semibold text-[#14171A]">Arif Rahman (Dhaka Resident)</p>
              <p className="text-[10px] text-[#6B7280]">arif@demo.aura • Customer Role</p>
            </div>
            <span className="text-[11px] text-[#1F4E43] font-medium">Quick Fill</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectDemoPersona("nusrat@demo.aura")}
            className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E4E7EB] hover:border-[#1F4E43] text-left transition-colors cursor-pointer"
          >
            <div>
              <p className="font-semibold text-[#14171A]">Nusrat Jahan (Chattogram Resident)</p>
              <p className="text-[10px] text-[#6B7280]">nusrat@demo.aura • Customer Role</p>
            </div>
            <span className="text-[11px] text-[#1F4E43] font-medium">Quick Fill</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectDemoPersona("admin@demo.aura")}
            className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E4E7EB] hover:border-[#1F4E43] text-left transition-colors cursor-pointer"
          >
            <div>
              <p className="font-semibold text-[#14171A]">Operations Admin (Staff)</p>
              <p className="text-[10px] text-[#6B7280]">admin@demo.aura • Admin Role</p>
            </div>
            <span className="text-[11px] text-[#1F4E43] font-medium">Quick Fill</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Explanation Modal per Requirement 4 */}
      <Dialog
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Password Reset Assistance"
        description="Aura Living Security Architecture Notice"
      >
        <div className="space-y-4 text-xs text-[#6B7280] leading-relaxed">
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <p className="font-semibold text-amber-800">Transactional Email Service Required</p>
            <p className="mt-1">
              Automated self-service password reset is governed by server-side verification tokens dispatched through transactional email infrastructure (e.g. Resend, Amazon SES, or SendGrid).
            </p>
          </div>
          <p>
            In this demonstration deployment, transactional mail delivery is not provisioned to prevent unsanctioned email emissions.
          </p>
          <p>
            <strong>For Pre-Seeded Demonstration Accounts:</strong><br />
            All seeded accounts use standard password: <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[#14171A]">AuraLiving2026!</code>
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForgotModal(false)}
              className="w-full"
            >
              Understood
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Google OAuth Configuration Notice Modal */}
      <Dialog
        isOpen={showGoogleNoticeModal}
        onClose={() => setShowGoogleNoticeModal(false)}
        title="Google Sign-In Configuration Notice"
        description="Google Cloud OAuth Client Setup"
      >
        <div className="space-y-4 text-xs text-[#6B7280] leading-relaxed">
          <div className="p-3.5 rounded-lg bg-[#FAF9F6] border border-[#E4E7EB] text-[#14171A]">
            <p className="font-semibold">Developer Notice</p>
            <p className="mt-1 text-[#6B7280]">
              To activate live Google Sign-In, configure <code className="font-mono text-[#1F4E43]">GOOGLE_CLIENT_ID</code> and <code className="font-mono text-[#1F4E43]">GOOGLE_CLIENT_SECRET</code> in your local <code className="font-mono">.env.local</code> or Vercel environment variables.
            </p>
          </div>
          <p>
            All Google OAuth routes, identity mapping, scopes (<code className="font-mono">openid</code>, <code className="font-mono">email</code>, <code className="font-mono">profile</code>), and session flows are fully wired. In the meantime, you can test complete customer flows using email/password.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowGoogleNoticeModal(false)}
            className="w-full"
          >
            Continue with Email &amp; Password
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-xs text-[#6B7280]">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
