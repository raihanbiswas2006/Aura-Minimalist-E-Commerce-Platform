import { Coupon } from "@/types";

export const SEEDED_COUPONS: Coupon[] = [
  {
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 50.0,
    description: "10% off on orders over $50.00",
  },
  {
    code: "FREESHIP",
    discountType: "shipping",
    discountValue: 15.0, // standard shipping fee deduction
    minOrderAmount: 0,
    description: "Complimentary standard delivery on all orders",
  },
  {
    code: "WELCOME20",
    discountType: "fixed",
    discountValue: 20.0,
    minOrderAmount: 100.0,
    description: "$20.00 off on orders over $100.00",
  },
];
