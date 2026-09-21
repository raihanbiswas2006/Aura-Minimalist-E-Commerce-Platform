// Centralized Bangladesh Market & Commerce Constants for Aura Living

export const CURRENCY_CODE = "BDT";
export const CURRENCY_SYMBOL = "৳";

// Free Delivery Threshold in BDT (Demo Tier)
export const FREE_SHIPPING_THRESHOLD = 5000; // ৳5,000

// Standard Delivery Fee in BDT
export const DEFAULT_STANDARD_SHIPPING_FEE = 60; // ৳60 (Inside Dhaka)

// Bangladesh Shipping Tiers
export interface ShippingTier {
  id: "inside-dhaka" | "outside-dhaka" | "nationwide";
  label: string;
  sublabel: string;
  rate: number;
  estimatedDays: string;
  isComplimentaryEligible: boolean;
}

export const SHIPPING_TIERS: ShippingTier[] = [
  {
    id: "inside-dhaka",
    label: "Inside Dhaka Delivery",
    sublabel: "Standard home delivery across Dhaka metropolitan area",
    rate: 60,
    estimatedDays: "1–3 Business Days",
    isComplimentaryEligible: true,
  },
  {
    id: "outside-dhaka",
    label: "Outside Dhaka Delivery",
    sublabel: "Sub-district and regional transit via express courier partner",
    rate: 120,
    estimatedDays: "3–5 Business Days",
    isComplimentaryEligible: false,
  },
  {
    id: "nationwide",
    label: "Nationwide & Remote Area Delivery",
    sublabel: "Specialized logistics coverage for all districts across Bangladesh",
    rate: 150,
    estimatedDays: "4–7 Business Days",
    isComplimentaryEligible: false,
  },
];

// Sensible BDT Price Filter Ranges for Catalog
export const BDT_PRICE_RANGES = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under ৳5,000", min: 0, max: 5000 },
  { label: "৳5,000 – ৳10,000", min: 5000, max: 10000 },
  { label: "৳10,000 – ৳25,000", min: 10000, max: 25000 },
  { label: "৳25,000 & Above", min: 25000, max: undefined },
];

// Bangladesh Administrative Divisions
export const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;

export type BdDivision = (typeof BD_DIVISIONS)[number];
