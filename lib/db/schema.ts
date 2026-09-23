import { Address, CartItem, OrderStatus, ShippingMethod, PaymentMethod } from "@/types";

export type UserRole = "CUSTOMER" | "ADMIN";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  role: UserRole;
  image?: string | null;
  savedAddresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface DbAccount {
  id: string;
  userId: string;
  type: string;
  provider: string; // 'google' | 'credentials'
  providerAccountId: string;
  createdAt: string;
}

export interface DbSession {
  sessionToken: string;
  userId: string;
  expires: string;
}

export interface DbOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status: OrderStatus;
  trackingNumber: string;
}

export interface DatabaseState {
  users: DbUser[];
  accounts: DbAccount[];
  sessions: DbSession[];
  orders: DbOrder[];
}
