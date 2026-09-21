# Testing & Quality Assurance Script: Aura Minimalist E-Commerce Platform

This document outlines the validation procedures executed to verify compliance with PRD-COMMERCE-2026-V1.

---

## 1. Automated Verification Commands

```bash
# Verify TypeScript strict type-checking
npx tsc --noEmit

# Verify Next.js production compilation and static optimization
npm run build
```

---

## 2. Core User Journey Validation Protocols

### Protocol 1: Journey 1 — Search-Based Shopper to Order Placement
1. **Action:** Focus on the desktop header search input (or press `Cmd + K` / `Ctrl + K`). Enter `linen`.
2. **Result:** Instant autocomplete popover appears within 250ms displaying product thumbnail previews and the "Home Textiles" category match.
3. **Action:** Press `Enter` or click the search trigger to navigate to `/search?q=linen`.
4. **Result:** Renders matching catalog items with active query chip and clear (`×`) button.
5. **Action:** Click on "Linen Throw Pillow" to navigate to `/p/linen-throw-pillow`.
6. **Action:** Select color swatch "Olive Green", choose quantity 2, and click "Add to Cart".
7. **Result:** Button animates to "Added to Bag", global cart counter badge increments, and the Cart Slide-Over Drawer automatically opens displaying the item, variant name, unit price, and updated free shipping progress meter.
8. **Action:** Click "Proceed to Checkout" from the drawer.
9. **Result:** Navigates to `/checkout` (distraction-free view with global header/footer hidden).
10. **Action:** Fill Stage 1 details, proceed to Stage 2, select "Standard Delivery", proceed to Stage 3, and click "Complete Demo Order".
11. **Result:** Confetti animation triggers, randomized Order ID (`AUR-YYYYMMDD-[HEX]`) is generated, items are saved to order history, and active cart is cleared.

### Protocol 2: Journey 2 — Out-of-Stock Variant Handling
1. **Action:** Navigate to `/p/minimalist-ceramic-lamp`.
2. **Action:** Click the variant swatch "Matte Black / Large".
3. **Result:** Inventory state is evaluated as `stockQuantity: 0`. The "Add to Cart" button immediately becomes disabled with the label "Out of Stock"; quantity stepper is disabled; status badge displays "Currently Out of Stock" with a "Notify Me When Available" button.
4. **Action:** Click an alternative variant swatch ("Stone Grey / Large").
5. **Result:** Active variant transitions to In Stock (`stockQuantity: 8`); "Add to Cart" button and quantity stepper re-enable immediately.

### Protocol 3: Journey 3 — Empty Search Recovery
1. **Action:** Search for nonsense keyword `xyzq987`.
2. **Result:** Routes to `/search?q=xyzq987`. Zero-result recovery screen is rendered: &ldquo;No products matched 'xyzq987'&rdquo;.
3. **Result:** Popular search chips ("Chairs", "Lamps", "Ceramics", "Linen") and a 4-item grid of "Trending Across Collections" appear.
4. **Action:** Click the "Lamps" chip.
5. **Result:** URL updates to `/search?q=Lamps` and matching lamps populate the catalog grid.

### Protocol 4: Free Shipping Meter Calculation (AC-02)
1. **Action:** Add an item worth $65.00 to the bag (subtotal: $65.00).
2. **Result:** Free shipping meter indicates $85.00 remaining; shipping fee displays $15.00.
3. **Action:** Increment item quantity or add another piece to raise subtotal above $150.00 (e.g., $185.00).
4. **Result:** Shipping fee updates to "$0.00 (FREE)" and progress meter fills to 100% with confirmation &ldquo;You have qualified for Free Delivery&rdquo;.

### Protocol 5: Coupon Engine Evaluation
1. **Action:** Enter code `SAVE10` on an order < $50.00.
2. **Result:** Clear error message: &ldquo;Coupon 'SAVE10' requires a minimum order of $50.00&rdquo;.
3. **Action:** On an order ≥ $50.00, apply `SAVE10`.
4. **Result:** 10% is deducted from subtotal and coupon pill appears with single-click removal button.
5. **Action:** Test code `FREESHIP`.
6. **Result:** Deducts shipping fee to $0.00.

### Protocol 6: Admin Demonstration Panel (`/admin`)
1. **Action:** Navigate to `/admin`.
2. **Action:** In the "Inventory" tab, click "Set to 0 (OOS)" on any product variant.
3. **Action:** Open that product's PDP in a new tab.
4. **Result:** PDP immediately reflects out-of-stock state.
5. **Action:** In the "Orders" tab, advance any demo order from `pending` to `processing` to `shipped` to `delivered`.
6. **Result:** Order status advances and updates in `/account/orders`.
