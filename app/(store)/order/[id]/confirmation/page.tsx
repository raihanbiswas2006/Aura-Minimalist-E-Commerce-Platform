"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Printer, ArrowRight, Package, Truck, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useOrderStore } from "@/store/order-store";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderConfirmationProps {
  params: Promise<{ id: string }>;
}

export default function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const resolvedParams = use(params);
  const { getOrderById } = useOrderStore();
  const [order, setOrder] = useState(() => getOrderById(resolvedParams.id));

  useEffect(() => {
    // Trigger celebratory confetti once on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1F4E43", "#C5A059", "#1B9E60", "#F3EFEA"],
      });
    } catch {
      // ignore
    }

    if (!order) {
      setOrder(getOrderById(resolvedParams.id));
    }
  }, [order, getOrderById, resolvedParams.id]);

  const handlePrint = () => {
    window.print();
  };

  // Fallback if order not found in current session memory
  const orderId = order?.orderNumber || resolvedParams.id;
  const deliveryEstimate = "September 24 – September 26, 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Confirmation Success Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 rounded-full bg-[#18804E]/10 border border-[#18804E]/20 flex items-center justify-center mx-auto text-[#18804E]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase font-semibold tracking-wider text-[#1F4E43]">
          Thank you for choosing Aura
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14171A]">
          Order Confirmed
        </h1>
        <p className="text-sm text-[#6B7280] max-w-md mx-auto">
          We have registered your order. A simulated confirmation dispatch has been logged to your demo account session.
        </p>

        {/* Order Identifier Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E4E7EB] rounded-full text-xs font-mono font-bold text-[#14171A] shadow-2xs">
          <span>Order ID:</span>
          <span className="text-[#1F4E43]">{orderId}</span>
        </div>
      </div>

      {/* Itemized Receipt Card (Print-Optimized) */}
      <div className="print-receipt bg-white rounded-2xl border border-[#E4E7EB] shadow-xs overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Estimated Delivery Window */}
        <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#6B7280] tracking-wider">
                Estimated Delivery Window
              </p>
              <p className="text-sm font-bold text-[#14171A] mt-0.5">{deliveryEstimate}</p>
            </div>
          </div>

          <div className="text-xs text-[#6B7280]">
            <span>Tracking Number: </span>
            <strong className="text-[#14171A] font-mono">
              {order?.trackingNumber || "TRK-83729104"}
            </strong>
          </div>
        </div>

        {/* Address & Payment Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-[#E4E7EB]">
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Dispatch Address
            </h3>
            {order?.shippingAddress ? (
              <div className="text-[#14171A] space-y-0.5">
                <p className="font-bold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.streetAddress}</p>
                {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-[#6B7280] mt-1">{order.shippingAddress.email}</p>
                <p className="text-[#6B7280]">{order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-[#6B7280]">Demo Shipping Address (Registered)</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Payment &amp; Logistics Method
            </h3>
            <div className="text-[#14171A] space-y-1">
              <p>
                <strong>Method:</strong>{" "}
                {order?.paymentMethod === "cod" ? "Cash on Delivery (Demo)" : "Simulated Credit Card"}
              </p>
              <p>
                <strong>Logistics:</strong>{" "}
                {order?.shippingMethod === "express" ? "Express Courier (1-2 Days)" : "Standard Delivery (3-5 Days)"}
              </p>
              <p>
                <strong>Order Placed:</strong> {order ? formatDate(order.createdAt) : "Today"}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#18804E]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Simulated Transaction Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Breakdown Table */}
        <div className="pt-6 border-t border-[#E4E7EB]">
          <h3 className="font-semibold uppercase tracking-wider text-[#9CA3AF] text-xs mb-4">
            Purchased Artifacts
          </h3>

          <div className="divide-y divide-[#F3F4F6]">
            {(order?.items || []).length > 0 ? (
              order?.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 aspect-4/5 rounded bg-[#FAF9F6] border border-[#E4E7EB] overflow-hidden shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#14171A]">{item.title}</p>
                      <p className="text-xs text-[#6B7280]">{item.variantName}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#14171A]">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 flex items-center justify-between text-xs text-[#6B7280]">
                <span>Sample Curated Item</span>
                <span>$245.00</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary Breakdown */}
        <div className="pt-6 border-t border-[#E4E7EB] space-y-2 text-xs">
          <div className="flex justify-between text-[#6B7280]">
            <span>Subtotal</span>
            <span>{formatPrice(order?.pricing.subtotal || 245.0)}</span>
          </div>
          {order?.pricing.discount ? (
            <div className="flex justify-between text-[#18804E] font-medium">
              <span>Promotional Savings</span>
              <span>-{formatPrice(order.pricing.discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-[#6B7280]">
            <span>Shipping</span>
            <span>
              {order?.pricing.shipping === 0 ? "FREE" : formatPrice(order?.pricing.shipping || 0)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#14171A] pt-3 border-t border-[#E4E7EB]">
            <span>Total Paid (Simulated)</span>
            <span className="text-[#1F4E43] text-lg font-serif">
              {formatPrice(order?.pricing.total || 245.0)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions (No Print) */}
      <div className="no-print mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 text-xs font-semibold text-[#14171A] hover:text-[#1F4E43] bg-white border border-[#E4E7EB] px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Itemized Receipt</span>
        </button>

        <div className="flex items-center gap-3">
          <Link href="/account/orders">
            <Button variant="outline" size="md">
              <span>View In Orders</span>
            </Button>
          </Link>
          <Link href="/c/furniture">
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
