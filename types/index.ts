// Core Product Model
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string; // e.g., "Olive Green / Large"
  color: { name: string; hex: string };
  size?: string;
  priceModifier: number;
  stockQuantity: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categoryId: string;
  basePrice: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  createdAt: string;
}

// Category Taxonomy Model
export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  parentCategoryId?: string;
  itemCount?: number;
}

// Shopping Cart Entities
export interface CartItem {
  id: string; // Unique composite key: ${productId}-${variantId}
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  maxStock: number;
}

export interface CartState {
  items: CartItem[];
  couponCode?: string;
  discountAmount: number;
  subtotal: number;
  shippingTotal: number;
  estimatedTotal: number;
}

// Checkout & Order Entities
export interface Address {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: Address;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'cod';
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status: OrderStatus;
  trackingNumber?: string;
}

// Review Entity
export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
}

// Coupon Entity
export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountValue: number; // e.g., 10 for 10%, 20 for $20 flat
  minOrderAmount?: number;
  description: string;
}

// Demo Auth Entity
export interface DemoUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  savedAddresses: Address[];
}

// Analytics Event
export interface AnalyticsEvent {
  event:
    | 'view_item_list'
    | 'view_item'
    | 'select_item'
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'view_cart'
    | 'begin_checkout'
    | 'apply_coupon'
    | 'purchase';
  payload: Record<string, unknown>;
  timestamp: string;
}
