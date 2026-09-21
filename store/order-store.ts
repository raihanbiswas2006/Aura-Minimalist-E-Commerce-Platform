"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Order, OrderStatus } from "@/types";
import { generateOrderId } from "@/lib/utils";

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
