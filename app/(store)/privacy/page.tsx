import React from "react";

export const metadata = {
  title: "Privacy Policy | Aura Living",
  description: "Our strict data minimization and customer privacy standards.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-6 text-xs text-[#4B5563] leading-relaxed">
      <h1 className="font-serif text-3xl font-bold text-[#14171A]">Privacy Policy</h1>
      <p className="text-xs text-[#9CA3AF]">Effective: September 2026</p>

      <section className="space-y-2 pt-4">
        <h2 className="text-sm font-semibold text-[#14171A]">1. Data Minimization</h2>
        <p>
          Aura Living is engineered with privacy by design. In this demonstration storefront, no real personal identifying information or live financial account credentials are transmitted or permanently stored on remote databases.
        </p>
      </section>

      <section className="space-y-2 pt-2">
        <h2 className="text-sm font-semibold text-[#14171A]">2. Client-Side Storage</h2>
        <p>
          Cart line items, active session selections, and simulated historical orders persist exclusively in your local browser storage (`localStorage`). You retain total control to purge this data at any point using the &ldquo;Clear Cart&rdquo; or browser cache clearing tools.
        </p>
      </section>

      <section className="space-y-2 pt-2">
        <h2 className="text-sm font-semibold text-[#14171A]">3. Third-Party Tracking</h2>
        <p>
          We do not deploy intrusive third-party cross-site advertising cookies or behavioral tracker beacons.
        </p>
      </section>
    </div>
  );
}
