"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Order, OrderStatus } from "@/types";
import { generateOrderId } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface OrderStore {
  orders: Order[];
  createOrder: (orderPayload: Omit<Order, "id" | "orderNumber" | "createdAt" | "status" | "trackingNumber">) => Order;
  getOrderById: (id: string) => Order | undefined;
  advanceOrderStatus: (orderId: string, nextStatus?: OrderStatus) => void;
  clearHistory: () => void;
}

const STATUS_FLOW: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (payload) => {
        const orderId = generateOrderId();
        const trackingNumber = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

        const newOrder: Order = {
          ...payload,
          id: orderId,
          orderNumber: orderId,
          createdAt: new Date().toISOString(),
          status: "pending",
          trackingNumber,
        };

        set({
          orders: [newOrder, ...get().orders],
        });

        // Write directly to Firestore /orders in background
        if (typeof window !== "undefined") {
          try {
            setDoc(doc(db, "orders", orderId), {
              id: orderId,
              orderNumber: orderId,
              userId: "guest",
              customerName: payload.shippingAddress.fullName,
              customerEmail: payload.shippingAddress.email,
              customerPhone: payload.shippingAddress.phone,
              shippingAddress: {
                fullName: payload.shippingAddress.fullName,
                streetAddress: payload.shippingAddress.streetAddress,
                apartment: payload.shippingAddress.apartment || "",
                city: payload.shippingAddress.district || "Dhaka",
                division: payload.shippingAddress.division || "Dhaka",
                district: payload.shippingAddress.district || "Dhaka",
                thana: payload.shippingAddress.area || "",
                postalCode: payload.shippingAddress.postalCode,
                country: "Bangladesh",
                phone: payload.shippingAddress.phone,
              },
              items: payload.items.map((i) => ({
                productId: i.productId,
                productTitle: i.title,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                price: i.unitPrice,
                imageUrl: i.imageUrl,
                variantId: i.variantId,
                variantAttributes: i.variantName,
              })),
              subtotal: payload.pricing.subtotal,
              discount: payload.pricing.discount,
              shippingFee: payload.pricing.shipping,
              total: payload.pricing.total,
              status: "pending",
              paymentMethod: payload.paymentMethod,
              paymentStatus: payload.paymentMethod === "cod" ? "Pending" : "Paid",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              statusHistory: [
                {
                  status: "pending",
                  timestamp: new Date().toISOString(),
                  staffIdentifier: "Website Storefront",
                  note: "Order placed via website client store.",
                },
              ],
            }).catch((err) => {
              console.warn("[Firestore Order Store Sync Warning]:", err);
            });
          } catch (_) {}
        }

        return newOrder;
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id || o.orderNumber === id);
      },

      advanceOrderStatus: (orderId, nextStatus) => {
        const currentOrders = get().orders;
        const updated = currentOrders.map((o) => {
          if (o.id === orderId || o.orderNumber === orderId) {
            let statusToSet = nextStatus;
            if (!statusToSet) {
              const curIdx = STATUS_FLOW.indexOf(o.status);
              statusToSet = curIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[curIdx + 1] : o.status;
            }
            return { ...o, status: statusToSet };
          }
          return o;
        });
        set({ orders: updated });
      },

      clearHistory: () => set({ orders: [] }),
    }),
    {
      name: "aura_order_history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
