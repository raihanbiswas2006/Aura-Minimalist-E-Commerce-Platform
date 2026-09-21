# Aura Living — Modern Minimalist Commerce Platform

> **Project Identifier:** `PRD-COMMERCE-2026-V1`  
> **Brand Name:** Aura Living (Aura Home & Apparel)  
> **Target Environment:** Next.js (App Router) / Vercel Edge Runtime  
> **Status:** Production Ready

---

## 1. Overview

**Aura Living** is an original direct-to-consumer (D2C) e-commerce application designed with warm minimalist modernism. The platform combines disciplined typography, ample whitespace, hairline borders, and understated micro-interactions to deliver a conversion-centric shopping experience.

### Core Value Propositions
* **Zero Surprise Costs:** Transparent delivery calculation, threshold-based free shipping progress meter (৳5,000 threshold), and clear delivery expectations before checkout.
* **Radical Checkout Simplicity:** Frictionless guest checkout path tailored for Bangladesh (Division, District, Upazila/Thana, Mobile Number validation) via a single-page 3-stage accordion flow.
* **Engineered Speed:** Zero Cumulative Layout Shift (CLS), rigid 4:5 image containers, and sub-second page transitions powered by React Server Components (RSC) and Next.js Image Optimization.
* **WCAG 2.2 AA Accessibility:** 2px solid Deep Forest focus rings, full keyboard traversability, 16px minimum form inputs (preventing iOS auto-zoom), and screen-reader announcements (`aria-live="polite"`).

---

## 2. Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode, zero implicit any)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Warm Minimalist HSL Tokens
* **Currency & Locale:** Bangladeshi Taka (`BDT` / `৳`), localized with `en-BD` numeric grouping
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) with LocalStorage persistence
* **Typography:** Playfair Display (Headlines) & Inter / Geist Sans (Body)
* **Validation:** Zod client schemas & inline accessible field validation
* **Animations:** Canvas Confetti for celebratory order completions

---

## 3. Key Feature Walkthrough

| Module | Feature | Implementation Details |
| --- | --- | --- |
| **Catalog & PLP** | URL-Synced Filters | Bi-directional synchronization with `URLSearchParams`. Filter by BDT price range (e.g., Under ৳5,000 to ৳25,000+), color swatches, rating thresholds, and in-stock status. |
| **Discovery** | Instant Search | Header search bar with 250ms debounced autocomplete popover (`Cmd + K` trigger), thumbnail previews, and typo tolerance. |
| **PDP** | High-Fidelity Details | Vertical thumbnail gallery, keyboard arrow navigation, fullscreen zoom lightbox, real-time stock matrix, quantity steppers, and Bangladesh delivery accordion. |
| **Cart** | Dual Presentation | Slide-over Mini-Cart Drawer (`Sheet`) upon adding items + full-page `/cart` table view with interactive Free Shipping Meter (৳5,000 threshold). |
| **Promotions** | Demo Coupon Engine | Codes `SAVE10` (10% off over ৳2,500), `FREESHIP` (complimentary delivery), and `WELCOME20` (৳200 off over ৳3,000). |
| **Checkout** | 3-Stage Accordion | Distraction-free single-page layout: Stage 1 (Bangladesh Contact & Delivery Address), Stage 2 (Shipping Method: Inside Dhaka ৳60, Outside Dhaka ৳120, Nationwide ৳150), Stage 3 (Cash on Delivery or Simulated MFS: bKash, Nagad, Rocket, Card). |
| **Orders** | Receipt & Tracking | Unique cryptographically randomized Order ID (`AUR-YYYYMMDD-[HEX]`), print stylesheet (`@media print`), and order history tracking in BDT. |
| **Social Proof** | Reviews & Ratings | 5-bar interactive rating histogram, verified buyer tags, and accessible "Write a Review" modal with live recalculation. |
| **Engagement** | Persistent Wishlist | Stored in `localStorage` under `aura_wishlist_items` with dynamic header badge and 1-click Move-to-Cart. |
| **Admin Hub** | Simulation Controller | Route `/admin` featuring live inventory stock adjustment triggers and order lifecycle stage advancement in BDT. |

---

## 4. Quick-Start Guide

### Prerequisites
* Node.js 18.17+ or 20+ (Node v22 LTS tested)
* npm 9+

### Installation & Local Run

```bash
# Clone the repository
git clone https://github.com/example/aura-ecommerce-platform.git
cd aura-ecommerce-platform

# Install dependencies
npm install

# Launch local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the storefront.

### Production Build & Type-Check

```bash
# Run strict TypeScript type check
npx tsc --noEmit

# Compile production bundle
npm run build

# Start production server locally
npm run start
```

---

## 5. Information Architecture & Key Routes

* `/` — Editorial Homepage (Hero, Curated Categories, Featured Collection in BDT, Value Props, Testimonials)
* `/c/[category]` — Category Product Listing Page (`/c/furniture`, `/c/lighting`, `/c/textiles`, `/c/decor`, `/c/sale`)
* `/p/[slug]` — High-Fidelity Product Details Page (`/p/nordic-lounge-chair`, `/p/minimalist-ceramic-lamp`)
* `/search` — Search Listing View with query reflection and empty search recovery UI
* `/cart` — Standalone Shopping Bag view with BDT Free Shipping Progress Meter
* `/checkout` — Distraction-Free Single-Page 3-Stage Accordion Checkout (Bangladesh address & MFS simulation)
* `/order/[id]/confirmation` — Order Confirmation View with itemized BDT receipt and print support
* `/wishlist` — Saved Items View with 1-click Move to Cart
* `/account` & `/account/orders` — Customer Portal with demo persona switching (Arif Rahman, Nusrat Jahan)
* `/admin` — Administrative Demonstration Hub with live inventory toggle and order monitor in BDT
* `/about`, `/contact`, `/shipping`, `/returns`, `/privacy`, `/terms` — Informational & Trust Pages
* `not-found` — Standardized 404 Recovery View

---

## 6. Demonstration Credentials & Market Localization

The platform is localized for the **Bangladesh E-Commerce Market** operating in a **Simulated Sandbox** where all currency values are in **Bangladeshi Taka (`BDT` / `৳`)** and no real money is processed:
* **Currency:** Bangladeshi Taka (৳ / BDT) with zero decimal fraction presentation (e.g. `৳1,250`, `৳34,900`)
* **Simulated Payment Options:**
  * Cash on Delivery (COD) — Primary Bangladesh payment method
  * bKash Demo Simulation (Sandbox Wallet Number prompt)
  * Nagad Demo Simulation
  * Rocket Demo Simulation
  * Demo Card (`4242 •••• •••• 4242` - simulated developer testing)
* **Demo Personas (Bangladesh):**
  * Arif Rahman (`arif@demo.aura` • `01711000001` • Dhaka Division)
  * Nusrat Jahan (`nusrat@demo.aura` • `01819000002` • Chattogram Division)
* **Demo Promo Codes:** `SAVE10` (10% off >৳2,500), `FREESHIP` (Complimentary shipping), `WELCOME20` (৳200 off >৳3,000)
* **Shipping Matrix:** Inside Dhaka (৳60), Outside Dhaka (৳120), Nationwide Delivery (৳150); Free Delivery threshold at ৳5,000

---

## 7. License

MIT License. Designed and built with Google Antigravity.
