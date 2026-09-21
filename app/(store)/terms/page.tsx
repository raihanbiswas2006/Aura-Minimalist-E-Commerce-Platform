import React from "react";

export const metadata = {
  title: "Terms of Service | Aura Living",
  description: "Demonstration commerce platform terms of service.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-6 text-xs text-[#4B5563] leading-relaxed">
      <h1 className="font-serif text-3xl font-bold text-[#14171A]">Terms of Service</h1>
      <p className="text-xs text-[#9CA3AF]">Effective: September 2026</p>

      <section className="space-y-2 pt-4">
        <h2 className="text-sm font-semibold text-[#14171A]">1. Demonstration Platform</h2>
        <p>
          This website is a modern portfolio showcase of &ldquo;Aura Living&rdquo;, built to validate high-conversion architecture, WCAG 2.2 AA accessibility, sub-second transitions, and responsive minimalism. No live monetary sales are enacted.
        </p>
      </section>

      <section className="space-y-2 pt-2">
        <h2 className="text-sm font-semibold text-[#14171A]">2. Intellectual Property</h2>
        <p>
          All product concept titles, copy, and layout architecture are created original for the Aura platform demonstration.
        </p>
      </section>
    </div>
  );
}
