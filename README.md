# Aura Living — Modern Minimalist Commerce Platform

> **Project Identifier:** `PRD-COMMERCE-2026-V1`  
> **Brand Name:** Aura Living (Aura Home & Apparel)  
> **Target Environment:** Next.js (App Router) / Vercel Edge Runtime  
> **Status:** Production Ready

---

## 1. Overview

**Aura Living** is an original direct-to-consumer (D2C) e-commerce application designed with warm minimalist modernism. The platform combines disciplined typography, ample whitespace, hairline borders, and understated micro-interactions to deliver a conversion-centric shopping experience.

### Core Value Propositions
* **Zero Surprise Costs:** Transparent delivery calculation, threshold-based free shipping progress meter ($150 threshold), and clear tax expectations before checkout.
* **Radical Checkout Simplicity:** Frictionless guest checkout path requiring fewer than 6 total fields to place an order via a single-page 3-stage accordion flow.
* **Engineered Speed:** Zero Cumulative Layout Shift (CLS), rigid 4:5 image containers, and sub-second page transitions powered by React Server Components (RSC) and Next.js Image Optimization.
* **WCAG 2.2 AA Accessibility:** 2px solid Deep Forest focus rings, full keyboard traversability, 16px minimum form inputs (preventing iOS auto-zoom), and screen-reader announcements (`aria-live="polite"`).

---

## 2. Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode, zero implicit any)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Warm Minimalist HSL Tokens
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) with LocalStorage persistence
* **Typography:** Playfair Display (Headlines) & Inter / Geist Sans (Body)
* **Validation:** Zod client schemas & inline accessible field validation
* **Animations:** Canvas Confetti for celebratory order completions

---

## 3. Key Feature Walkthrough

| Module | Feature | Implementation Details |
| --- | --- | --- |
| **Catalog & PLP** | URL-Synced Filters | Bi-directional synchronization with `URLSearchParams`. Filter by price range, color swatches, rating thresholds, and in-stock status. |
| **Discovery** | Instant Search | Header search bar with 250ms debounced autocomplete popover (`Cmd + K` trigger), thumbnail previews, and typo tolerance. |
| **PDP** | High-Fidelity Details | Vertical thumbnail gallery, keyboard arrow navigation, fullscreen zoom lightbox, real-time stock matrix, quantity steppers, and accordion specs. |
| **Cart** | Dual Presentation | Slide-over Mini-Cart Drawer (`Sheet`) upon adding items + full-page `/cart` table view with interactive Free Shipping Meter. |
| **Promotions** | Demo Coupon Engine | Codes `SAVE10` (10% off over $50), `FREESHIP` ($0 shipping), and `WELCOME20` ($20 off over $100). |
| **Checkout** | 3-Stage Accordion | Distraction-free single-page layout: Stage 1 (Contact & Delivery), Stage 2 (Shipping Method), Stage 3 (Simulated Card or COD). |
| **Orders** | Receipt & Tracking | Unique cryptographically randomized Order ID (`AUR-YYYYMMDD-[HEX]`), print stylesheet (`@media print`), and order history tracking. |
| **Social Proof** | Reviews & Ratings | 5-bar interactive rating histogram, verified buyer tags, and accessible "Write a Review" modal with live recalculation. |
| **Engagement** | Persistent Wishlist | Stored in `localStorage` under `aura_wishlist_items` with dynamic header badge and 1-click Move-to-Cart. |
| **Admin Hub** | Simulation Controller | Route `/admin` featuring live inventory stock adjustment triggers and order lifecycle stage advancement. |

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

* `/` — Editorial Homepage (Hero, Curated Categories, Featured Collection, Value Props, Testimonials)
* `/c/[category]` — Category Product Listing Page (`/c/furniture`, `/c/lighting`, `/c/textiles`, `/c/decor`, `/c/sale`)
* `/p/[slug]` — High-Fidelity Product Details Page (`/p/nordic-lounge-chair`, `/p/minimalist-ceramic-lamp`)
* `/search` — Search Listing View with query reflection and empty search recovery UI
* `/cart` — Standalone Shopping Bag view with Free Shipping Progress Meter
* `/checkout` — Distraction-Free Single-Page 3-Stage Accordion Checkout
* `/order/[id]/confirmation` — Order Confirmation View with itemized receipt and print support
* `/wishlist` — Saved Items View with 1-click Move to Cart
* `/account` & `/account/orders` — Customer Portal with demo persona switching (Marcus Vance, Elena Rostova)
* `/admin` — Administrative Demonstration Hub with live inventory toggle and order monitor
* `/about`, `/contact`, `/shipping`, `/returns`, `/privacy`, `/terms` — Informational & Trust Pages
* `not-found` — Standardized 404 Recovery View

---

## 6. Demonstration Credentials

Checkout operates in a **Simulated Sandbox** where no real money is processed:
* **Demo Card:** `4242 4242 4242 4242`
* **Exp:** `12/28`
* **CVC:** `382`
* **Demo Personas:** Marcus Vance (`marcus@demo.aura`), Elena Rostova (`elena@demo.aura`)
* **Demo Promo Codes:** `SAVE10`, `FREESHIP`, `WELCOME20`

---

## 7. License

MIT License. Designed and built with Google Antigravity.
