"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Package, Truck, CheckCircle2, Clock, ArrowRight, ExternalLink, ShieldCheck, Lock } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getProductSlugById } from "@/lib/api/products";
import { Order } from "@/types";

export default function AccountOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (status !== "authenticated") {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [status]);

  const getStatusBadge = (orderStatus: string) => {
    switch (orderStatus) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#18804E] bg-[#18804E]/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F4E43] bg-[#1F4E43]/10 px-2.5 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5" />
            In Transit
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] bg-[#E4E7EB] px-2.5 py-1 rounded-full">
            <Package className="w-3.5 h-3.5" />
            Pending Dispatch
          </span>
        );
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#1F4E43]/10 text-[#1F4E43] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#14171A]">
          Authentication Required
        </h1>
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Order history is strictly protected and isolated by customer identity. Sign in or register to review your receipts.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <Link href="/login?callbackUrl=/account/orders">
            <Button variant="primary" className="w-full">Sign In</Button>
          </Link>
          <Link href="/register?callbackUrl=/account/orders">
            <Button variant="outline" className="w-full">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Account Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E4E7EB] mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#14171A]">
            Order History &amp; Tracking
          </h1>
          <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1.5">
            <span>Verified Customer:</span>
            <strong className="text-[#14171A]">{session?.user?.name || "Customer"}</strong>
            <span>({session?.user?.email})</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-xs">
                Admin Simulator
              </Button>
            </Link>
          )}
          <Link href="/c/furniture">
            <Button variant="primary" size="sm" className="text-xs">
              Explore Collection
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-xs text-[#6B7280]">
          Loading verified orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E4E7EB] max-w-md mx-auto p-8 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF9F6] border border-[#E4E7EB] flex items-center justify-center mx-auto mb-4 text-[#9CA3AF]">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-serif font-semibold text-[#14171A]">
            No historical orders logged
          </h2>
          <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
            Finalize an order through our secure checkout to review tracking numbers and receipts here.
          </p>
          <div className="mt-6">
            <Link href="/c/furniture">
              <Button variant="primary">Start Shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#E4E7EB] overflow-hidden shadow-2xs"
            >
              {/* Order Header bar */}
              <div className="p-6 bg-[#FAF9F6] border-b border-[#E4E7EB] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-[#9CA3AF] block font-medium">Order Placed</span>
                    <span className="font-semibold text-[#14171A]">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block font-medium">Total Amount</span>
                    <span className="font-semibold text-[#14171A]">
                      {formatPrice(order.pricing.total)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block font-medium">Order Number</span>
                    <span className="font-mono font-bold text-[#1F4E43]">
                      {order.orderNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <Link
                    href={`/order/${order.id}/confirmation`}
                    className="text-xs text-[#1F4E43] hover:underline font-medium flex items-center gap-1"
                  >
                    <span>Receipt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 divide-y divide-[#F3F4F6]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
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
                        <h3 className="text-sm font-semibold text-[#14171A]">
                          <Link
                            href={`/p/${item.slug || getProductSlugById(item.productId)}`}
                            className="hover:text-[#1F4E43]"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-[#6B7280]">{item.variantName}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#14171A]">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tracking & Delivery Footer */}
              <div className="px-6 py-3.5 bg-white border-t border-[#E4E7EB] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280]">
                <span>
                  Tracking Number: <strong className="font-mono text-[#14171A]">{order.trackingNumber}</strong>
                </span>
                <span>
                  Delivery Address: {order.shippingAddress.streetAddress}, {order.shippingAddress.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
