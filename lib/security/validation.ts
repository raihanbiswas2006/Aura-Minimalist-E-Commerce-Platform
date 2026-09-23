import { z } from "zod";

export const BD_PHONE_REGEX = /^(?:\+?880|0)?1[3-9]\d{8}$/;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password exceeds maximum length"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || BD_PHONE_REGEX.test(val.replace(/[\s-]/g, "")),
        "Please provide a valid Bangladeshi mobile number (e.g. 017XXXXXXXX)"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  phone: z
    .string()
    .trim()
    .refine((val) => BD_PHONE_REGEX.test(val.replace(/[\s-]/g, "")), "Valid Bangladeshi mobile number is required"),
  division: z.string().trim().min(1, "Division is required"),
  district: z.string().trim().min(2, "District is required"),
  area: z.string().trim().min(2, "Area / Upazila is required"),
  streetAddress: z.string().trim().min(5, "Detailed street address is required"),
  apartment: z.string().trim().optional(),
  postalCode: z.string().trim().min(3, "Postal code is required"),
  country: z.string().default("Bangladesh"),
});

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const createOrderInputSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, "Order must contain at least one item"),
  shippingAddress: addressSchema,
  shippingMethod: z.enum(["inside-dhaka", "outside-dhaka", "nationwide", "standard", "express"]),
  paymentMethod: z.enum(["cod", "bkash", "nagad", "rocket", "card"]),
  couponCode: z.string().trim().optional(),
});
