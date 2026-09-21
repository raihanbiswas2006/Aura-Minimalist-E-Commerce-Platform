"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Eye,
  Sliders,
  Sparkles,
} from "lucide-react";
import { getRawProducts, updateVariantStock } from "@/lib/api/products";
import { useOrderStore } from "@/store/order-store";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"inventory" | "orders" | "vitals">("inventory");
  const [products, setProducts] = useState(() => getRawProducts());
  const { orders, advanceOrderStatus } = useOrderStore();
  const [selectedOrderJson, setSelectedOrderJson] = useState<any | null>(null);

  const handleStockUpdate = (productId: string, variantId: string, newStock: number) => {
    updateVariantStock(productId, variantId, newStock);
    // Refresh view
    setProducts([...getRawProducts()]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Simulation Sandbox Notice Banner */}
      <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[11px] text-amber-800">
            Portfolio Demonstration Sandbox (Unsecured Interface)
          </p>
          <p className="mt-0.5 text-amber-800/90 leading-relaxed">
            This administrative control center operates client-side for evaluating real-time stock mutations, variant states (In Stock / Low Stock / Out of Stock), and order lifecycle transitions. It is intentionally unauthenticated for portfolio review and client validation, and does not imply a production-secured administration system.
          </p>
        </div>
      </div>

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E4E7EB] mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#14171A]">
            Administrative Demonstration Hub
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Test real-time out-of-stock behavior, advance simulated order lifecycles, and audit telemetry.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E4E7EB] shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "inventory"
                ? "bg-[#1F4E43] text-white shadow-xs"
                : "text-[#6B7280] hover:text-[#14171A]"
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-[#1F4E43] text-white shadow-xs"
                : "text-[#6B7280] hover:text-[#14171A]"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vitals")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "vitals"
                ? "bg-[#1F4E43] text-white shadow-xs"
                : "text-[#6B7280] hover:text-[#14171A]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Specs &amp; Vitals</span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: INVENTORY CONTROLLER */}
      {/* ========================================================== */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] flex items-center justify-between text-xs">
            <span className="text-[#6B7280]">
              Click stock triggers below to dynamically verify how the storefront handles <strong>In Stock</strong>, <strong>Low Stock (&lt;5)</strong>, and <strong>Out of Stock (0)</strong> scenarios in real-time.
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E4E7EB] overflow-hidden shadow-2xs divide-y divide-[#E4E7EB]">
            {products.map((p) => (
              <div key={p.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[#14171A]">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Slug: <code className="text-[#1F4E43]">/p/{p.slug}</code> •{" "}
                      {p.discountPrice ? (
                        <span>
                          Compare-at / Original: <span className="line-through">{formatPrice(p.basePrice)}</span> •{" "}
                          <strong className="text-[#C2222E]">Sale Price: {formatPrice(p.discountPrice)}</strong>
                        </span>
                      ) : (
                        <span>
                          Regular Price: <strong>{formatPrice(p.basePrice)}</strong>
                        </span>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/p/${p.slug}`}
                    target="_blank"
                    className="text-xs text-[#1F4E43] hover:underline font-semibold"
                  >
                    View PDP ↗
                  </Link>
                </div>

                {/* Variant list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {p.variants.map((v) => {
                    const isZero = v.stockQuantity === 0;
                    const isLow = !isZero && v.stockQuantity < 5;
                    const effectivePrice = (p.discountPrice ?? p.basePrice) + (v.priceModifier || 0);

                    return (
                      <div
                        key={v.id}
                        className="p-3 rounded-lg border border-[#E4E7EB] bg-[#FAF9F6] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#14171A] truncate">
                            {v.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isZero
                                ? "bg-[#C2222E]/10 text-[#C2222E]"
                                : isLow
                                ? "bg-[#F59E0B]/20 text-[#B45309]"
                                : "bg-[#18804E]/10 text-[#18804E]"
                            }`}
                          >
                            {isZero ? "Out of Stock" : `${v.stockQuantity} in stock`}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#6B7280] flex items-center justify-between">
                          <span>
                            Active Price: <strong className="text-[#14171A]">{formatPrice(effectivePrice)}</strong>
                          </span>
                          {v.priceModifier !== 0 && (
                            <span className="text-[#1F4E43] font-medium">
                              Modifier: {v.priceModifier > 0 ? `+$${v.priceModifier}` : `-$${Math.abs(v.priceModifier)}`}
                            </span>
                          )}
                        </div>

                        {/* Quick Stock Setter Buttons */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleStockUpdate(p.id, v.id, 0)}
                            className="flex-1 py-1 text-[11px] rounded bg-white border border-[#C2222E]/30 text-[#C2222E] hover:bg-[#C2222E] hover:text-white transition-colors font-medium cursor-pointer"
                          >
                            Set to 0 (OOS)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockUpdate(p.id, v.id, 2)}
                            className="flex-1 py-1 text-[11px] rounded bg-white border border-[#F59E0B]/50 text-[#B45309] hover:bg-[#F59E0B] hover:text-white transition-colors font-medium cursor-pointer"
                          >
                            Set to 2 (Low)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockUpdate(p.id, v.id, 12)}
                            className="flex-1 py-1 text-[11px] rounded bg-white border border-[#18804E]/30 text-[#18804E] hover:bg-[#18804E] hover:text-white transition-colors font-medium cursor-pointer"
                          >
                            Set to 12
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: ORDER LIFECYCLE MONITOR */}
      {/* ========================================================== */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] text-xs text-[#6B7280]">
            Track orders placed in this session. You can advance statuses sequentially: <strong>Pending → Processing → Shipped → Delivered</strong>.
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-[#E4E7EB] p-8">
              <ClipboardList className="w-10 h-10 text-[#9CA3AF] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#14171A]">No demo orders recorded yet</p>
              <p className="text-xs text-[#6B7280] mt-1">
                Add an item to the shopping bag and finalize checkout to populate orders.
              </p>
              <Link href="/checkout" className="inline-block mt-4">
                <Button size="sm">Go to Checkout</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E4E7EB] overflow-hidden shadow-2xs divide-y divide-[#E4E7EB]">
              {orders.map((order) => (
                <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#1F4E43]">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs uppercase font-semibold text-[#14171A] px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E4E7EB]">
                        Status: {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280]">
                      Customer: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.email}) • Items: {order.items.length} • Total: {formatPrice(order.pricing.total)}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      Placed on {formatDate(order.createdAt)} • Tracking: {order.trackingNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrderJson(order)}
                      className="text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect JSON</span>
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={order.status === "delivered"}
                      onClick={() => advanceOrderStatus(order.id)}
                      className="text-xs flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>
                        {order.status === "pending"
                          ? "Advance to Processing"
                          : order.status === "processing"
                          ? "Advance to Shipped"
                          : order.status === "shipped"
                          ? "Advance to Delivered"
                          : "Delivered (Complete)"}
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: SYSTEM SPECS & VITALS AUDIT */}
      {/* ========================================================== */}
      {activeTab === "vitals" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-[#E4E7EB] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1F4E43]">
              Target Core Web Vitals (P0)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
                <span className="text-[#6B7280]">Largest Contentful Paint (LCP)</span>
                <span className="font-bold text-[#18804E]">≤ 2.0s</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
                <span className="text-[#6B7280]">Interaction to Next Paint (INP)</span>
                <span className="font-bold text-[#18804E]">≤ 150ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
                <span className="text-[#6B7280]">Cumulative Layout Shift (CLS)</span>
                <span className="font-bold text-[#18804E]">≤ 0.05 (Rigid 4:5)</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E4E7EB] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1F4E43]">
              Accessibility (WCAG 2.2 AA)
            </h3>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <p>• <strong>Focus Visible:</strong> 2px solid Deep Forest ring with 2px offset.</p>
              <p>• <strong>Contrast Ratio:</strong> ≥ 4.5:1 on text body and ≥ 3:1 on headings.</p>
              <p>• <strong>ARIA Live:</strong> Polite status updates on cart and coupon operations.</p>
              <p>• <strong>Touch Target:</strong> Minimum 44x44px bounding area.</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E4E7EB] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1F4E43]">
              Design System Tokens
            </h3>
            <div className="space-y-1.5 text-xs text-[#6B7280]">
              <p>• <strong>Background:</strong> HSL(40, 20%, 98%) (#FAF9F6)</p>
              <p>• <strong>Foreground:</strong> HSL(220, 15%, 10%) (#14171A)</p>
              <p>• <strong>Brand Accent:</strong> HSL(164, 45%, 22%) (#1F4E43)</p>
              <p>• <strong>Typography:</strong> Playfair Display &amp; Inter</p>
            </div>
          </div>
        </div>
      )}

      {/* Raw Order JSON Dialog */}
      <Dialog
        isOpen={selectedOrderJson !== null}
        onClose={() => setSelectedOrderJson(null)}
        title={`Payload: ${selectedOrderJson?.orderNumber}`}
        description="Structured simulation entity schema stored in localStorage"
      >
        <pre className="p-4 bg-[#14171A] text-[#34D399] rounded-lg text-[11px] font-mono overflow-x-auto max-h-96">
          {JSON.stringify(selectedOrderJson, null, 2)}
        </pre>
      </Dialog>
    </div>
  );
}
