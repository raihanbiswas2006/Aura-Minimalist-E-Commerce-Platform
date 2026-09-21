import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(price: number): string {
  if (price === undefined || price === null || isNaN(price)) {
    return "৳0";
  }
  const isNegative = price < 0;
  const absValue = Math.round(Math.abs(price));
  const formatted = new Intl.NumberFormat("en-BD").format(absValue);
  return isNegative ? `-৳${formatted}` : `৳${formatted}`;
}

export function formatPrice(price: number): string {
  return formatCurrency(price);
}

export function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `AUR-${dateStr}-${randomHex}`;
}
