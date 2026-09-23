# Testing & Quality Assurance Script: Aura Minimalist E-Commerce Platform

This document outlines the validation procedures executed to verify compliance with PRD-COMMERCE-2026-V1 and the post-QA correction audit pass.

---

## 1. Automated Verification Commands

```bash
# 1. Verify TypeScript strict type-checking
npx tsc --noEmit

# 2. Verify Next.js production compilation and static optimization
npm run build

# 3. Execute automated HTTP 200/404 endpoint audit (26 routes)
node scripts/qa-audit.mjs
```

---

## 2. Core User Journey Validation Protocols

### Protocol 1: Journey 1 — Search-Based Shopper to Order Placement
1. **Action:** Focus on the desktop header search input (or press `Cmd + K` / `Ctrl + K`). Enter `linen`.
2. **Result:** Instant autocomplete popover appears within 250ms displaying product thumbnail previews and the "Home Textiles" category match.
3. **Action:** Press `Enter` or click the search trigger to navigate to `/search?q=linen`.
4. **Result:** Renders matching catalog items with active query chip, clear (`×`) button, and full multi-dimensional PLP filters.
5. **Action:** Click on "Linen Throw Pillow" to navigate to `/p/linen-throw-pillow`.
6. **Action:** Select color swatch "Olive Green", choose quantity 2, and click "Add to Cart".
7. **Result:** Button animates to "Added to Bag", global cart counter badge increments, and the Cart Slide-Over Drawer automatically opens displaying the item, variant name, unit price, and updated free shipping progress meter.
8. **Action:** Click "Proceed to Checkout" from the drawer.
9. **Result:** Navigates to `/checkout` (distraction-free view with global header/footer hidden).
10. **Action:** Fill Stage 1 details, proceed to Stage 2, select "Standard Delivery", proceed to Stage 3, and click "Complete Demo Order".
11. **Result:** Confetti animation triggers, randomized Order ID (`AUR-YYYYMMDD-[HEX]`) is generated, items are saved to order history, and active cart is cleared.

---

### Protocol 2: Journey 2 — Out-of-Stock Variant Handling
1. **Action:** Navigate to `/p/minimalist-ceramic-lamp`.
2. **Action:** Click the variant swatch "Matte Black / Large".
3. **Result:** Inventory state is evaluated as `stockQuantity: 0`. The "Add to Cart" button immediately becomes disabled with the label "Out of Stock"; quantity stepper is disabled; status badge displays "Currently Out of Stock" with a "Notify Me When Available" button.
4. **Action:** Click an alternative variant swatch ("Stone Grey / Large").
5. **Result:** Active variant transitions to In Stock (`stockQuantity: 8`); "Add to Cart" button and quantity stepper re-enable immediately.

---

### Protocol 3: Journey 3 — Empty Search Recovery
1. **Action:** Search for nonsense keyword `xyzq987`.
2. **Result:** Routes to `/search?q=xyzq987`. Zero-result recovery screen is rendered: &ldquo;No products matched 'xyzq987'&rdquo;.
3. **Result:** Popular search chips ("Chairs", "Lamps", "Ceramics", "Linen") and a 4-item grid of "Trending Across Collections" appear.
4. **Action:** Click the "Lamps" chip.
5. **Result:** URL updates to `/search?q=Lamps` and matching lamps populate the catalog grid.

---

### Protocol 4: Free Shipping Meter Calculation (AC-02)
1. **Action:** Add an item worth ৳3,500 to the bag (subtotal: ৳3,500).
2. **Result:** Free shipping meter indicates ৳1,500 remaining; shipping fee displays ৳60 (Inside Dhaka tier).
3. **Action:** Increment item quantity or add another piece to raise subtotal above ৳5,000 (e.g., ৳7,000).
4. **Result:** Shipping fee updates to "৳0 (FREE)" and progress meter fills to 100% with confirmation &ldquo;You have qualified for Free Delivery&rdquo;.

---

### Protocol 5: Coupon Engine Evaluation
1. **Action:** Enter code `SAVE10` on an order < ৳2,500.
2. **Result:** Clear error message: &ldquo;Coupon 'SAVE10' requires a minimum order of ৳2,500&rdquo;.
3. **Action:** On an order ≥ ৳2,500, apply `SAVE10`.
4. **Result:** 10% is deducted from subtotal and coupon pill appears with single-click removal button.
5. **Action:** Test code `FREESHIP`.
6. **Result:** Deducts shipping fee to ৳0.
7. **Action:** Test code `WELCOME20` on order ≥ ৳3,000.
8. **Result:** Deducts flat ৳200 discount.

---

### Protocol 6: Cart & Order History Canonical Navigation
1. **Action:** Add any product with a multi-word slug (e.g., "Nordic Lounge Chair" or "Minimalist Ceramic Lamp") to the cart.
2. **Action:** Open the Mini-Cart Drawer or visit `/cart`.
3. **Action:** Click the item's title in the cart list.
4. **Result:** Navigates directly to the canonical product URL (`/p/nordic-lounge-chair`) instead of a 404.
5. **Action:** Complete an order, visit `/account/orders`, and click the product title in historical orders.
6. **Result:** Resolves and navigates directly to the correct product detail page without 404 error.

---

### Protocol 7: Pricing Model Consistency Verification
1. **Action:** Inspect a discounted product (e.g., "Nordic Lounge Chair") on Homepage, PLP, PDP, Wishlist, Cart, and Admin.
2. **Result:**
   - Homepage & PLP: Formatted active price `৳34,900`, strikethrough compare-at price `৳38,500`, discount badge `-9%`.
   - PDP (`/p/nordic-lounge-chair`): Active price `৳34,900`, strikethrough compare-at price `৳38,500`, and `-9% Sale` pill.
   - Wishlist (`/wishlist`): Active price `৳34,900` and strikethrough compare-at price `৳38,500`.
   - Cart & Checkout: Unit price accurately reflects `৳34,900`.
   - Admin (`/admin`): Product summary clearly displays `Compare-at / Original: ৳38,500 • Sale Price: ৳34,900` and variant-specific active pricing formatted with `formatPrice`.

---

### Protocol 8: Admin Demonstration Panel (`/admin`)
1. **Action:** Navigate to `/admin`.
2. **Result:** Prominent amber banner clearly states that the page is an interactive demonstration sandbox and an unsecured client-side simulation.
3. **Action:** In the "Inventory" tab, click "Set to 0 (OOS)" on any product variant.
4. **Action:** Open that product's PDP in a new tab.
5. **Result:** PDP immediately reflects out-of-stock state.
6. **Action:** In the "Orders" tab, advance any demo order from `pending` to `processing` to `shipped` to `delivered`.
7. **Result:** Order status advances and updates in `/account/orders`.

---

### Protocol 9: Content & Disclaimers Audit
1. **Action:** Inspect Footer, About, Shipping, Returns, and Contact pages.
2. **Result:**
   - Footer: Displays "Designed following WCAG 2.2 AA guidelines (Demo)" and Bangladesh simulated payment badges (COD, bKash, Nagad, Rocket, Cards).
   - Shipping: Displays demo environment disclaimer and Bangladesh delivery tiers (Inside Dhaka ৳60, Outside Dhaka ৳120, Nationwide ৳150).
   - Returns: Clearly frames terms as simulated customer care policies.
   - About: Displays portfolio concept banner and conceptual sustainability standards.
   - Contact: Clearly labels email, telephone (`+880 9612-000000`), and showroom address (`Gulshan Design Studio`) as demonstration placeholders.
   - Reviews: Labeled as sample reviews with "Verified Buyer (Demo)" badges.

---

### Protocol 10: UX & Micro-Interaction Enhancements Verification
1. **Product Image Magnifier (Desktop):**
   - Navigate to `/p/nordic-lounge-chair`.
   - Hover cursor across the main image.
   - Result: 1.75x magnification smoothly focal-points around the mouse position using compositor transforms; no layout shift; container boundary remains strict; smoothly resets on cursor exit.
2. **Fullscreen Gallery Lightbox:**
   - Click the image or zoom trigger button.
   - Result: Lightbox opens with backdrop fade; background page scroll is locked (`overflow: hidden`); image counter, navigation arrows, and thumbnail strip are visible; dismisses via `Escape` or `X` button.
3. **Product Card Image Crossfade:**
   - Navigate to `/c/furniture`.
   - Hover over product cards.
   - Result: Secondary image crossfades smoothly in 500ms without flicker; Quick Add button slides up cleanly; wishlist button triggers spring heart-pop animation.
4. **Multi-State Add to Cart Feedback:**
   - On `/p/nordic-lounge-chair`, click "Add to Cart".
   - Result: Button transitions instantly: `Add to Cart` → `Adding...` (with spinner) → `Added ✓` (with checkmark in `#1B9E60`) → reverts to `Add to Cart` after 2000ms.
5. **Mobile Sticky Action Bar:**
   - Open PDP at mobile viewport (375px width).
   - Scroll down past the primary Add to Cart button.
   - Result: Bottom sticky action bar slides up smoothly with product context and current variant pricing; respects iOS safe areas; hides automatically when primary CTA is back in view.
6. **Search Query Highlighting:**
   - In header search bar, enter query "lounge".
   - Result: Suggestions display matching substring enclosed in subtle green pill highlighting (`bg-[#1F4E43]/15`).
7. **Streaming Route Skeletons:**
   - Navigate between `/p/nordic-lounge-chair`, `/c/furniture`, and `/search`.
   - Result: Zero CLS instant skeleton screens render during route transitions.
8. **Automated Verification Script:**
   - Run `node scripts/verify-ux.mjs`.
   - Result: 21/21 static and contract assertions pass with zero failures.

---

### Protocol 11: Bangladesh Localization, Address Validation & Payment Simulation Verification
1. **Action:** Add any item to cart and navigate to `/checkout`.
2. **Address Fields & Validation:**
   - Verify presence of Full Name, Mobile Number, Email Address, Division (dropdown with 8 BD divisions), District, Area / Upazila / Thana, Detailed Address, and Postal Code.
   - Enter invalid phone number (e.g. `12345` or `0212345678`) and blur field.
   - Result: Accessible inline validation error: "Please enter a valid Bangladesh mobile number (e.g., 017XXXXXXXX or +88017XXXXXXXX)".
   - Enter valid number `01711000001` or `+8801819000002`. Error clears immediately.
3. **Shipping Tier Selection:**
   - In Stage 2, select "Inside Dhaka" (৳60, 1–3 working days). Subtotal + ৳60 matches order summary.
   - Select "Outside Dhaka" (৳120, 3–5 working days). Summary updates in real-time.
   - Select "Nationwide Delivery" (৳150, 4–7 working days). Summary updates in real-time.
   - If cart total is ≥ ৳5,000, shipping displays "৳0 (Complimentary)".
4. **Payment Simulation Flow:**
   - In Stage 3, verify 4 primary simulated Bangladesh payment options: Cash on Delivery (COD), bKash (Demo Simulation), Nagad (Demo Simulation), Rocket (Demo Simulation), and auxiliary Demo Card.
   - Selecting "Cash on Delivery" displays notice that total is payable upon physical handover.
   - Selecting "bKash Demo" renders sandbox wallet number prompt.
   - Complete checkout with COD or bKash Demo.
5. **Confirmation & Order Storage:**
   - Navigates to `/order/[id]/confirmation`.
   - Order total, item prices, and delivery fee are strictly in BDT (`৳`).
   - Payment method clearly identified (e.g. "Cash on Delivery (Demo)" or "bKash (Demo Simulation)").
   - Disclaimer confirms no real financial transaction took place.

---

### Protocol 12: Authentication, Security & Server-Side Purchase Protection Verification

#### Automated Security Test Suite
Run the dedicated security and authentication test suite:
```bash
node scripts/test-auth-security.mjs
```
**Assertions Covered (43 Tests):**
1. Unauthenticated product browsing & PDP resolution.
2. BDT pricing consistency across catalog sources.
3. Guest cart persistence via `localStorage` (`aura_cart_state`).
4. Cart store mutation with stock bounds.
5. Server-side `POST /api/orders` unauthenticated rejection (`401 Unauthorized`).
6. Minimalist `/login` page availability with BDT branding.
7. Minimalist `/register` page availability with BDT branding.
8. Email + Password credentials authentication handler.
9. "Continue with Google" OAuth 2.0 / OIDC handler.
10. Honest transactional email configuration notices for password resets.
11. Password hashing with `bcryptjs` at cost factor 12.
12. Registration strictly defaults user role to `CUSTOMER`.
13. Passwords stored strictly as non-reversible bcrypt hashes (`$2b$`).
14. Registration rejects password mismatch.
15. Registration enforces minimum password length (≥ 8 characters).
16. Server rejects client-submitted privilege escalation attempts (`role: "ADMIN"`).
17. Seed database initializes with hashed passwords for demo accounts.
18. Server database implements `getUserByEmail` DAO lookup.
19. Valid credentials successfully authenticate.
20. Invalid credentials fail authentication with generic non-enumerating error.
21. Zero-trust order pricing recalculation strictly derives totals from catalog, ignoring client prices.
22. Order ownership bound strictly to `session.user.id`, ignoring client-submitted user ID.
23. `GET /api/orders/[id]` validates ownership against active session ID.
24. `getOrderById` returns null / 403 when User A attempts to view User B's order.
25. `GET /api/orders` returns orders strictly isolated to authenticated user.
26. Real-time variant inventory validation rejects over-purchasing.
27. Checkout modal gate displays authentication requirement while keeping cart items intact.
28-32. HTTP security headers configured (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy).
33-36. `.env.example` documents environment variable names without exposing real credentials.
37-38. `auth.ts` sources credentials strictly from environment variables.
39-43. Pre-seeded demo personas, customer role enforcement, and server-validated admin protection.

#### Manual Authentication & Purchase Flow
1. **Guest Browsing & Cart Addition:**
   - Visit `/` and `/c/furniture` as an unauthenticated guest.
   - Add "Nordic Lounge Chair" (Natural Oak / Canvas) to bag.
   - Cart drawer opens; cart counter badge animates to `1`.
2. **Authentication Gate at Checkout:**
   - Click "Proceed to Checkout" or navigate to `/checkout`.
   - An amber authentication gate appears: *"Authentication Required to Place Order"*.
   - Clicking "Sign In to Complete Order" or "Create an Account" triggers the Authentication Gate modal.
3. **Registration / Login:**
   - Click "Sign In" to navigate to `/login?callbackUrl=/checkout`.
   - Notice demo credentials pre-filled or selectable for 1-click testing (`arif@demo.aura` / `AuraLiving2026!`).
   - Authenticate successfully.
4. **Return & Cart Preservation:**
   - System redirects immediately back to `/checkout`.
   - The "Nordic Lounge Chair" remains in the cart with all selected variants and quantities.
5. **Order Completion & Ownership:**
   - Complete checkout with demo Cash on Delivery or bKash.
   - Server recalculates prices and creates order assigned to the authenticated user ID.
   - User is redirected to `/order/[id]/confirmation`.
   - Navigate to `/account/orders`: order is listed with full item details.
6. **Unauthorized Access Protection:**
   - Sign out via `/account` or header.
   - Try to access `/account/orders`: redirected to `/login?callbackUrl=/account/orders`.
   - Attempt direct API query `GET /api/orders/[id]`: rejected with `401 Unauthorized`.
   - Sign in as a different user: querying another user's order ID returns `404` / `403`.

---

### Protocol 13: Platform-Aware Search Shortcut Badge Verification
1. **Windows/Linux Browsers (Chrome, Edge, Firefox):**
   - Inspect desktop search input badge: renders `Ctrl K`.
   - Press `Ctrl + K`: search input receives focus and selects existing text.
2. **macOS Browsers (Safari, Chrome):**
   - Inspect desktop search input badge: renders `⌘ K`.
   - Press `⌘ + K` (`Meta + K`): search input receives focus and selects existing text.
3. **Hydration Integrity:**
   - Safe initial render with client-side detection in `useEffect` guarantees zero React hydration mismatches on initial page load across all user agents.
4. **Mobile Responsiveness:**
   - On viewports < 640px and within the mobile search overlay (`isMobileModal`), the shortcut badge remains hidden, preserving clean touch ergonomics.




