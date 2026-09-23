# QA & Correction Pass Report: Aura Minimalist E-Commerce Platform

**Project Identifier:** PRD-COMMERCE-2026-V1  
**Target Environment:** Next.js 16 (App Router) / Vercel Edge Runtime  
**Status:** All Issues Resolved & Verified  
**Date:** September 21, 2026  

---

## 1. Executive Summary

A comprehensive, full-scope Quality Assurance and Correction pass was conducted on the Aura Minimalist E-Commerce Platform (`Aura Living`) covering all 22 mandated inspection dimensions. All identified issues—ranging from broken product navigation from cart and order line items, to pricing model inconsistencies, fabricated real-world business/certification claims, search filter integration, and admin sandbox clarity—have been resolved with the smallest safe fixes.

Following modifications, the codebase passed strict-mode TypeScript compilation (`tsc --noEmit`), production static build generation (`npm run build`), and an automated HTTP 200/404 endpoint audit across 26 distinct routes.

---

## 2. Itemized Issue & Correction Register

### Issue 1: Broken Product Links in Cart Drawer, Full Cart, and Order History
* **Severity:** High (Broken Navigation)
* **Areas Affected:** Area 2 (Navigation), Area 9 (Add to Cart), Area 10 (Cart Persistence), Area 12 (Order Confirmation/History)
* **Root Cause:**
  `CartLineItem`, `/cart`, and `/account/orders` constructed product detail links using `item.productId.replace("prod-", "")`. For catalog items whose slug differed from their sanitized ID (e.g., product `prod-nordic-chair` with slug `nordic-lounge-chair`, `prod-ceramic-lamp` with slug `minimalist-ceramic-lamp`), clicking the item redirected users to non-existent URLs (e.g., `/p/nordic-chair`), triggering 404 errors.
* **Fix:**
  1. Added `slug?: string` to the `CartItem` model in `types/index.ts`.
  2. Implemented `getProductSlugById(id: string): string` helper in `lib/api/products.ts` to reliably resolve canonical slugs from product identifiers.
  3. Ensured `slug: product.slug` is passed whenever items are added to the cart from `ProductCard`, `VariantSelector`, and `WishlistPage`.
  4. Updated `CartLineItem`, `app/(store)/cart/page.tsx`, and `app/(store)/account/orders/page.tsx` to link to `/p/${item.slug || getProductSlugById(item.productId)}`.
* **Verification Status:** Verified. All links from cart drawer, cart page, and order history navigate cleanly to canonical product detail pages.

---

### Issue 2: Pricing Model Inconsistencies & Compare-At/Sale Price Clarity
* **Severity:** Medium (Pricing Model & Presentation)
* **Areas Affected:** Area 7 (Product Detail Pages), Area 14 (Wishlist), Area 15 (Admin Panel), Area 22 (Product Data & Price Consistency)
* **Root Cause:**
  - On the Product Details Page (`VariantSelector`), while discounted products showed strikethrough compare-at prices, an explicit percentage-off / sale badge was missing, obscuring the relationship between the active sale price and the original base price.
  - On the Wishlist page (`/wishlist`), discounted items displayed only their active price, failing to render the compare-at / original price line-through seen on the homepage and PLP.
  - In the Admin Panel (`/admin`), product summaries displayed only `Base Price: $X`, omitting sale prices and individual variant modifiers.
* **Fix:**
  1. Updated `VariantSelector` to display a distinct `-{discountPercent}% Sale` pill alongside the strikethrough compare-at price when a product is discounted.
  2. Updated `app/(store)/wishlist/page.tsx` to render the original compare-at price with line-through alongside the active price for sale items.
  3. Enhanced `app/(admin)/admin/page.tsx` to clearly distinguish `Compare-at / Original: $X` from `Sale Price: $Y` (or `Regular Price: $X`), and added active variant price breakdowns displaying variant modifiers.
* **Verification Status:** Verified. Product pricing is uniform and unambiguous across Home, PLP, PDP, Wishlist, Cart, Checkout, and Admin.

---

### Issue 3: Content Audit — Unverified Business & Certification Claims
* **Severity:** High (Content & Regulatory Compliance)
* **Areas Affected:** Area 1 (Homepage), Area 7 (PDP), Area 13 (Customer Reviews), Area 16-22 (Policies & Informational Pages)
* **Root Cause:**
  Seed data and promotional copy asserted real-world factual claims (e.g., "WCAG 2.2 AA Accessibility Certified Storefront", "FSC-certified white oak", "Carbon-neutral domestic shipping", "2-year master joinery warranty", "Verified Buyer", and physical San Francisco showroom addresses) without explicitly stating that this platform is a client-side demonstration and portfolio showcase.
* **Fix:**
  - **Footer:** Reworded claim from "WCAG 2.2 AA Accessibility Certified Storefront" to "Designed following WCAG 2.2 AA guidelines (Demo)".
  - **Homepage Hero:** Reframed micro-badges to "Natural Oak & Flax (Sample Spec)", "Free Delivery (Demo Tier)", and "Trial Policy (Sample)".
  - **Value Propositions:** Reworded items to clearly state demo concepts: "Carbon-Neutral Policy (Demo)", "30-Day In-Home Trial (Sample)", "Enduring Joinery Standards (Sample)", and "Design Concierge (Demo)".
  - **Community Testimonials:** Updated headline to "Design Community Impressions (Demo Personas)", subhead to "Sample feedback representing design personas", and buyer badges to "Verified Buyer (Demo)".
  - **Reviews & Ratings:** Histogram scorecard reworded to "Based on X sample reviews (Demo)"; review section subhead reworded to "Sample impressions and community feedback for this demonstration piece"; review cards updated with "Verified Buyer (Demo)"; review submission modal updated to "Submit Demo Review".
  - **Product Detail Page (PDP):** Delivery accordion and variant selector guarantees updated to "Carbon-neutral delivery (Demo)", "30-day return window (Sample)", and "Joinery craft standard (Sample)".
  - **Checkout:** Standard shipping method note updated to "Simulated ground courier delivery with tracking updates".
  - **Shipping (`/shipping`):** Added a prominent "Demo Environment" banner explaining delivery calculations represent simulated business rules; reworded tiers to simulated ground delivery.
  - **Returns (`/returns`):** Added a prominent "Demo Environment" banner and reworded warranties to "Craftsmanship Standard (Sample Policy)".
  - **About (`/about`):** Added a "Portfolio Concept" banner clarifying brand origins and sustainability standards are conceptual design exercises.
  - **Contact (`/contact`):** Added a "Demo Notice" banner and clearly marked phone numbers, email addresses, and showroom locations as demonstration placeholders.
  - **Product Data (`data/products.ts`):** Removed literal certification claims (e.g. FSC, GOTS certified) in favor of sample design specifications ("sustainably-harvested", "Sample Spec", "Design Concept: Kyoto, Japan (Sample)", "Inspired by classic architectural travertine").
* **Verification Status:** Verified. All claims across storefront and policy pages clearly and honestly reflect sample and demonstration content.

---

### Issue 4: Administrative Route Demarcation & Unsecured Demo Clarification
* **Severity:** Medium (Security & Demo Framing)
* **Areas Affected:** Area 15 (Admin/Demo Panel)
* **Root Cause:**
  The public `/admin` route lacked an upfront disclaimer explaining that it is an interactive demonstration sandbox intended for testing inventory and order states, and not a production-secured backend.
* **Fix:**
  1. Updated `app/(admin)/layout.tsx` header pill to "Interactive Simulation Sandbox (Demo)".
  2. Added a prominent amber warning banner at the top of `app/(admin)/admin/page.tsx` stating:  
     *"Portfolio Demonstration Sandbox (Unsecured Interface): This administrative control center operates client-side for evaluating real-time stock mutations, variant states, and order lifecycle transitions. It is intentionally unauthenticated for portfolio review and client validation, and does not imply a production-secured administration system."*
* **Verification Status:** Verified. The demo panel is distinctly positioned as an interactive simulation tool.

---

### Issue 5: Search Page Filter & Sorting Completeness (PRD Section 11.1)
* **Severity:** Medium (Functional Completeness)
* **Areas Affected:** Area 4 (Search), Area 5 (Category Filters), Area 6 (Sorting)
* **Root Cause:**
  PRD Section 11.1 specifies that the `/search` route must maintain complete filter and sorting capabilities identical to standard PLP routes. Previously, `/search` displayed matching products in a simple 4-column grid without the left filter sidebar or sorting dropdown.
* **Fix:**
  1. Added `query?: string` support to `ProductFilterParams` in `lib/api/products.ts`.
  2. Extended `CatalogView` to accept `searchQuery`, `matchingCategories`, and `onClearSearch` props.
  3. Integrated `CatalogView` into `app/(store)/search/page.tsx` when query returns results or when browsing `/search` without parameters.
  4. Maintained the Journey 3 Zero-Result Recovery UI (headline, popular search chips, and 4-item trending products grid) whenever a search query matches zero catalog items.
* **Verification Status:** Verified. Searching for items surfaces the complete PLP filtering and sorting controls, while empty searches trigger the Journey 3 recovery screen.

---

## 3. 22-Point Comprehensive Inspection Matrix

| # | Inspection Dimension | Status | Validation Summary |
|---|---|---|---|
| 1 | **Homepage** | **PASS** | Hero LCP optimized, category grid 1:1, featured products with swatches, demo value props, and sample testimonials verified. |
| 2 | **Navigation & Routing** | **PASS** | Sticky header, SVG logo, active link indicator, mobile navigation drawer, and canonical URL structure verified. |
| 3 | **Product Listing Pages** | **PASS** | Dynamic `/c/[category]` routes with desktop 280px left sidebar, mobile bottom sheet, active chips, and result count verified. |
| 4 | **Search** | **PASS** | Debounced (250ms) autocomplete popover with `Cmd+K` shortcut, thumbnail previews, typo-tolerant search, and `/search` route verified. |
| 5 | **Category Filters** | **PASS** | Category, price range, color/material, rating, and in-stock filters operate with intra-OR and inter-AND logic synced to `URLSearchParams`. |
| 6 | **Sorting** | **PASS** | `featured`, `price-asc`, `price-desc`, `rating-desc`, and `date-desc` sort selections execute smoothly. |
| 7 | **Product Detail Pages** | **PASS** | High-resolution gallery with keyboard controls, fullscreen zoom modal, dynamic swatches, stock availability, and specs accordions verified. |
| 8 | **Product Variants & Stock** | **PASS** | Handles In Stock, Low Stock (<5), and Journey 2 Out of Stock (0) states; disables Add to Cart and displays alternative prompt. |
| 9 | **Add to Cart** | **PASS** | Button animates to confirmation state, cart badge increments, and slide-over mini-cart drawer opens automatically. |
| 10 | **Cart Persistence & Quantity** | **PASS** | State persisted under `aura_cart_state` in `localStorage`; quantity steppers enforce variant `maxStock` limits. |
| 11 | **Checkout** | **PASS** | Single-page 3-stage accordion (`/checkout`) with inline validation, shipping options, and sandbox payment simulation verified. |
| 12 | **Order Confirmation** | **PASS** | Generates randomized Order ID (`AUR-YYYYMMDD-[HEX]`), confetti celebration, itemized receipt, and `@media print` styling verified. |
| 13 | **Customer Reviews** | **PASS** | Aggregate rating scorecard, 5-bar star histogram filter, verified buyer demo badges, and review modal with live score recalculation verified. |
| 14 | **Wishlist** | **PASS** | Stored in `localStorage` under `aura_wishlist_items`; dynamic header badge, compare-at pricing, and 1-click Move-to-Cart verified. |
| 15 | **Admin / Demo Panel** | **PASS** | Clearly demarcated simulation sandbox; live stock toggle triggers real-time storefront changes; order lifecycle state advancing verified. |
| 16 | **Responsive Layout** | **PASS** | Mobile (375px), Tablet (768px), and Desktop (1280px) breakpoints tested; bottom-docked PDP action bar active on mobile viewports. |
| 17 | **Accessibility (WCAG 2.2 AA)** | **PASS** | 2px solid Deep Forest focus visible rings, touch targets $\ge 44 \times 44\text{px}$, ARIA live announcements on cart mutations, minimum 16px form inputs. |
| 18 | **SEO & Metadata** | **PASS** | Automated `generateMetadata()` on product and category routes, clean canonical URL bindings, and open-graph metadata verified. |
| 19 | **Structured Data** | **PASS** | Server-rendered JSON-LD graphs (`Product`, `Offer`, `BreadcrumbList`, `Organization`) validated. |
| 20 | **UX States (Loading/Empty/404)** | **PASS** | Shimmer skeletons on grids, Journey 3 empty search recovery UI, empty cart/wishlist states, and standardized `/404` recovery verified. |
| 21 | **Console & Runtime Errors** | **PASS** | Zero unhandled exceptions or runtime console errors observed across all audited routes. |
| 22 | **Price Data Consistency** | **PASS** | Active sale prices, original compare-at prices, variant modifiers, and discount percentages align consistently across all views. |

---

## 4. Remaining Limitations (Demo Boundaries)

Per the product scope defined in PRD Section 1.6 and 1.7, the following boundaries remain intentionally simulated:
1. **Financial Gateway Settlement:** Payments operate in a simulated test sandbox. No real Stripe, PayPal, or card network settlement occurs.
2. **Persistence Storage:** Customer accounts, orders, cart items, and wishlist selections are persisted locally in browser `localStorage`.
3. **Logistics & Inventory Synchronization:** Stock updates in the Admin panel mutate runtime in-memory state; no multi-warehouse ERP integration is present.
4. **External Communications:** Email subscriptions, contact inquiries, and tracking notifications simulate interface responses without dispatching external SMTP relays or live SMS messages.

---

## 5. UX & Micro-Interaction Enhancement Pass Verification

Following completion of the core QA pass, a dedicated UX and micro-interaction enhancement pass was performed and verified:

| # | Enhancement Dimension | Status | Verification Summary |
|---|---|---|---|
| 1 | **Cursor Magnifier (Desktop)** | **PASS** | 1.75x magnification follows mouse coordinates via GPU transforms within `overflow-hidden` container; resets smoothly on mouse leave; 0 layout shift. |
| 2 | **Mobile Lightbox & Gallery** | **PASS** | Touch tap triggers accessible dialog lightbox; body scroll locked (`document.body.style.overflow = "hidden"`); keyboard navigation (ArrowLeft/ArrowRight/Escape) and thumbnail strip verified. |
| 3 | **Product Card Micro-Interactions** | **PASS** | Two stacked images provide buttery smooth crossfade on hover; Quick Add button slides up cleanly; wishlist button triggers spring `animate-heart-pop`. |
| 4 | **Multi-State Button Feedback** | **PASS** | Add to Cart transitions smoothly through `idle` ("Add to Cart") → `adding` ("Adding..." with spinner) → `added` ("Added ✓" with checkmark) → `idle` reset after 2000ms. |
| 5 | **Mobile Sticky CTA** | **PASS** | `IntersectionObserver` detects when primary CTA is scrolled out of viewport; bottom sticky CTA slides up with product/variant context; respects `env(safe-area-inset-bottom)`. |
| 6 | **Animated Cart Badge** | **PASS** | Cart and Wishlist count badges trigger `@keyframes badge-pop` scale animation (1 → 1.3 → 1) upon item addition. |
| 7 | **Search Query Highlighting** | **PASS** | Autocomplete popover highlights matching query substrings in category titles and product subtitles with subtle forest green pill marks. |
| 8 | **Streaming Skeletons** | **PASS** | `loading.tsx` routes added for `/p/[slug]`, `/c/[category]`, and `/search` using exact dimension skeletons to guarantee zero CLS during client navigation. |
| 9 | **Sheet & Dialog Transitions** | **PASS** | Mini-cart drawer and mobile navigation drawers slide in smoothly from left/right with backdrop fade. |
| 10 | **WCAG 2.2 AA Reduced Motion** | **PASS** | `@media (prefers-reduced-motion: reduce)` globally disables decorative animations and transitions for sensitive users. |
| 11 | **Build & Compilation** | **PASS** | `npx tsc --noEmit` (0 errors), `next build` (0 errors across 19 static/dynamic routes), and `verify-ux.mjs` (21/21 tests passed). |

---

## 6. Bangladesh Market Localization & Currency Migration Pass

**Pass Identifier:** `BD-LOC-2026-V1`  
**Completion Date:** September 22, 2026  
**Status:** 100% Complete & Verified  

### 6.1 Localization Objectives & Scope
The platform underwent a complete localization pass converting generic USD-based international assumptions into a cohesive, realistic Bangladesh-focused shopping experience while strictly preserving all existing minimalist aesthetics, design tokens, micro-interactions, WCAG 2.2 AA accessibility standards, and SEO architecture.

### 6.2 Key Implementations
1. **Centralized Currency Architecture:**
   - Introduced `lib/constants.ts` declaring `CURRENCY_CODE = "BDT"`, `CURRENCY_SYMBOL = "৳"`, `FREE_SHIPPING_THRESHOLD = 5000`, and `SHIPPING_TIERS`.
   - Built `formatPrice` / `formatCurrency` in `lib/utils.ts` utilizing `en-BD` numeric grouping with zero decimal places, guaranteeing `৳1,250`, `৳34,900`, etc.
2. **Catalog Price Realignment:**
   - Reviewed and converted all 16 catalog items in `data/products.ts` to sensible Bangladesh market prices (e.g. Lounge Chair: ৳38,500 base / ৳34,900 sale; Ceramic Lamp: ৳18,500 base / ৳15,500 sale; Linen Throw Pillow: ৳3,500 base).
   - Ensured exact price alignment across Homepage, PLP, Search, PDP, Wishlist, Cart Drawer, Cart Page, Checkout, Order Confirmation, and Admin.
3. **Bangladesh Tiered Shipping:**
   - Replaced generic international shipping with 3 realistic Bangladesh tiers:
     - **Inside Dhaka:** ৳60 (1–3 working days)
     - **Outside Dhaka:** ৳120 (3–5 working days)
     - **Nationwide Delivery:** ৳150 (4–7 working days)
   - Free delivery automatically unlocks on orders exceeding ৳5,000.
4. **Bangladesh Checkout Address System:**
   - Implemented address form with Full Name, Mobile Number, Email Address, Division (dropdown with 8 BD divisions: Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur, Mymensingh), District, Area / Upazila / Thana, Detailed Address, and Postal Code.
   - Built native Bangladesh mobile validation supporting `01XXXXXXXXX` and `+8801XXXXXXXXX` (`^(?:\+?880|0)?1[3-9]\d{8}$`) with telephone keyboard optimization (`inputMode="tel"`).
5. **Simulated Bangladesh Payment Ecosystem:**
   - Integrated simulated payment options: Cash on Delivery (COD), bKash Demo (with interactive sandbox wallet number prompt), Nagad Demo, Rocket Demo, and auxiliary Demo Card.
   - Prominent sandbox simulation notices explicitly clarify no real financial transactions or credential harvesting occurs.
6. **Coupon System Conversion:**
   - `SAVE10`: 10% discount on orders exceeding ৳2,500.
   - `FREESHIP`: ৳60 delivery deduction (complimentary shipping).
   - `WELCOME20`: ৳200 flat discount on orders exceeding ৳3,000.
7. **JSON-LD & Metadata Structured Data:**
   - Server-rendered JSON-LD graphs updated to `priceCurrency: "BDT"` with corresponding BDT prices.
   - Dynamic page metadata and delivery accordion updated to Bangladesh context.
8. **Admin Panel Localization:**
   - Inventory controller, order lifecycle manager, and JSON payloads fully bound to BDT and `formatPrice`.

### 6.3 Automated Test & Verification Results
- **TypeScript Strict Compilation (`tsc --noEmit`):** 0 errors.
- **UX & Micro-Interaction Static & Contract Verification (`verify-ux.mjs`):** 21/21 tests passed (100%).
- **Production Build (`npm run build`):** Compiled successfully with 0 errors.

---

## 7. Authentication, Account & Server-Side Purchase Protection Pass

**Pass Identifier:** `AUTH-SEC-2026-V1`  
**Completion Date:** September 23, 2026  
**Status:** 100% Complete & Verified  

### 7.1 Architecture & Implementation Summary
1. **NextAuth (Auth.js v5) Authentication Engine:**
   - Deployed `next-auth@beta` (`v5.0.0-beta.32`) with JWT session strategy and secure, encrypted HttpOnly cookie management.
   - Dual Authentication Providers:
     - **Credentials Provider:** Email + Password authentication with bcrypt cost factor 12 hashing and verification (`lib/security/validation.ts`, `auth.ts`).
     - **Google OAuth / OIDC Provider:** Configured for minimum identity scopes (`openid`, `email`, `profile`) without access to any Google workspace resources.
2. **Server-Side Persistent Data Layer:**
   - Atomic, file-backed persistent repository (`lib/db/index.ts` writing to `data/db.json`) supporting User, Account, Session, and Order schemas.
   - Pre-seeded with Bangladesh customer and administrator personas:
     - `arif@demo.aura` (Arif Rahman, Customer)
     - `nusrat@demo.aura` (Nusrat Jahan, Customer)
     - `admin@demo.aura` (Operations Admin, Role: `ADMIN`)
     - Default demo password: `AuraLiving2026!` (pre-hashed with bcrypt).
3. **Server-Side Purchase Protection & Zero-Trust Validation:**
   - Protected API route `POST /api/orders` enforces server-side session checks, rejecting unauthenticated requests with `401 Unauthorized`.
   - Ignores client-provided pricing, discounts, shipping fees, or user IDs. All values are recalculated strictly from authoritative catalog items and coupon rules.
   - Validates live variant stock before creating orders.
4. **Horizontal Order Ownership Protection (Anti-IDOR):**
   - Implemented strict ownership checks in `GET /api/orders` and `GET /api/orders/[id]`.
   - Requests from User A targeting User B's order ID are blocked with `404 Not Found` / `403 Forbidden`.
5. **Checkout Authentication Gate & Cart Preservation:**
   - Single-page `/checkout` detects unauthenticated users and presents a non-disruptive Authentication Gate modal.
   - Guest cart items and quantities in `aura_cart_state` remain completely intact throughout the login/registration redirect cycle (`callbackUrl=/checkout`).
6. **Role-Based Access Control (RBAC):**
   - Default role for self-registered users is strictly `CUSTOMER`.
   - Privilege escalation via client payload (`role: "ADMIN"`) is filtered out by Zod schema and ignored by the server.
   - The `/admin` portal performs server-side role validation against `session.user.role === "ADMIN"`.
7. **HTTP Security Headers & Environment Isolation:**
   - Configured Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security (HSTS), and Permissions-Policy in `next.config.ts`.
   - Zero client bundle exposure of server secrets (`AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`).

### 7.2 Automated Test & Verification Results
- **TypeScript Strict Compilation (`tsc --noEmit`):** 0 errors.
- **UX & Micro-Interaction Static & Contract Verification (`verify-ux.mjs`):** 21/21 tests passed (100%).
- **Security & Authentication Test Suite (`test-auth-security.mjs`):** 45/45 tests passed (100%).
- **Production Build (`npm run build`):** 23/23 routes compiled successfully.

---

## 8. Search Shortcut Badge Platform-Awareness Correction

**Pass Identifier:** `SEARCH-BADGE-2026-V1`  
**Completion Date:** September 23, 2026  
**Status:** 100% Complete & Verified  

### 8.1 Issue Description & Resolution
- **Issue:** On the right side of the search input, the keyboard shortcut badge hardcoded the macOS Command symbol (`⌘ K`). For Windows and Linux users, this created confusion as the operating system modifier key is Control (`Ctrl`).
- **Correction:**
  1. **Hydration-Safe Client Detection:** Introduced safe client-side detection in `components/search/search-autocomplete.tsx` via `useEffect`. Default initial render provides `Ctrl K` for SSR and initial hydration, avoiding any React hydration mismatches, while post-hydration platform detection updates the badge to `⌘ K` on macOS/iOS environments.
  2. **Keyboard Handler Platform Alignment:** Configured global key listener to check `e.metaKey` on macOS and `e.ctrlKey` on Windows/Linux matching the badge label, while continuing to focus and select the search input.
  3. **Visual Alignment & Spacing:** Adjusted input right padding (`pr-16`) and clear button offset (`${isMac ? "right-9" : "right-12"}`) to guarantee zero visual collisions between typed text, the clear button, and the badge across both `⌘ K` and `Ctrl K`.
  4. **Accessibility:** Added dynamic `aria-keyshortcuts` (`Meta+K` or `Control+K`) to the search input.

### 8.2 Verification
- `npx tsc --noEmit`: 0 errors.
- `node scripts/verify-ux.mjs`: 21/21 tests passed.
- `node scripts/test-auth-security.mjs`: 45/45 tests passed.
- `npm run build`: 23/23 routes successfully compiled.




