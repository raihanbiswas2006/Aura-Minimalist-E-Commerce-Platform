import { Coupon } from "@/types";

export const SEEDED_COUPONS: Coupon[] = [
  {
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 2500.0,
    description: "10% off on orders over ৳2,500",
  },
  {
    code: "FREESHIP",
    discountType: "shipping",
    discountValue: 60.0, // standard inside-Dhaka delivery fee deduction
    minOrderAmount: 0,
    description: "Complimentary standard delivery across Bangladesh",
  },
  {
    code: "WELCOME20",
    discountType: "fixed",
    discountValue: 200.0,
    minOrderAmount: 3000.0,
    description: "৳200 off on orders over ৳3,000",
  },
];
