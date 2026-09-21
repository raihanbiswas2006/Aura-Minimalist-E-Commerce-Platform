import fs from "fs";
import path from "path";

console.log("Starting Aura UX & Micro-Interaction Static & Contract Verification...\n");

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// 1. globals.css verification
const globalsCss = fs.readFileSync("app/globals.css", "utf8");
assert(globalsCss.includes("@keyframes badge-pop"), "globals.css defines @keyframes badge-pop");
assert(globalsCss.includes("@keyframes heart-pop"), "globals.css defines @keyframes heart-pop");
assert(globalsCss.includes("@keyframes subtle-fade-in"), "globals.css defines @keyframes subtle-fade-in");
assert(globalsCss.includes("prefers-reduced-motion: reduce"), "globals.css enforces WCAG 2.2 AA prefers-reduced-motion reset");

// 2. Product Gallery verification
const gallery = fs.readFileSync("components/product/product-gallery.tsx", "utf8");
assert(gallery.includes("zoomOrigin"), "ProductGallery tracks cursor zoomOrigin");
assert(gallery.includes("scale(1.75)"), "ProductGallery applies smooth 1.75x cursor magnifier");
assert(gallery.includes("document.body.style.overflow = \"hidden\""), "ProductGallery locks body scroll in lightbox");
assert(gallery.includes("role=\"dialog\""), "ProductGallery lightbox is accessible dialog");

// 3. Product Card verification
const card = fs.readFileSync("components/product/product-card.tsx", "utf8");
assert(card.includes("opacity-0 group-hover:opacity-100"), "ProductCard features secondary image crossfade");
assert(card.includes("animate-heart-pop"), "ProductCard triggers heart-pop animation on wishlist toggle");
assert(card.includes("Quick Add"), "ProductCard includes Quick Add button");

// 4. Variant Selector verification
const variantSelector = fs.readFileSync("components/product/variant-selector.tsx", "utf8");
assert(variantSelector.includes('"idle" | "adding" | "added"'), "VariantSelector manages 3-state Add to Cart feedback");
assert(variantSelector.includes("IntersectionObserver"), "VariantSelector uses IntersectionObserver for mobile sticky CTA");
assert(variantSelector.includes("safe-area-inset-bottom"), "VariantSelector mobile sticky CTA respects iOS safe areas");

// 5. Header verification
const header = fs.readFileSync("components/layout/header.tsx", "utf8");
assert(header.includes("animate-badge-pop"), "Header animates badge pop on cart mutation");

// 6. Search Autocomplete verification
const search = fs.readFileSync("components/search/search-autocomplete.tsx", "utf8");
assert(search.includes("highlightMatch"), "SearchAutocomplete provides highlighted text matching");

// 7. Skeletons and Loading routes
const skeleton = fs.readFileSync("components/ui/skeleton.tsx", "utf8");
assert(skeleton.includes("ProductDetailSkeleton"), "skeleton.tsx exports ProductDetailSkeleton");
assert(skeleton.includes("CategoryGridSkeleton"), "skeleton.tsx exports CategoryGridSkeleton");
assert(fs.existsSync("app/(store)/p/[slug]/loading.tsx"), "PDP loading.tsx exists for instant streaming transitions");
assert(fs.existsSync("app/(store)/c/[category]/loading.tsx"), "Category loading.tsx exists for instant streaming transitions");
assert(fs.existsSync("app/(store)/search/loading.tsx"), "Search loading.tsx exists for instant streaming transitions");

console.log(`\nVerification Complete! Passed: ${passed}/${total}, Failed: ${total - passed}`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
