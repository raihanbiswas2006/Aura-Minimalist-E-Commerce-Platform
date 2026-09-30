import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { SEEDED_REVIEWS } from "@/data/reviews";
import { Product, Category, Review, ProductImage, ProductVariant } from "@/types";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export interface ProductFilterParams {
  category?: string; // slug or id
  minPrice?: number;
  maxPrice?: number;
  color?: string[];
  rating?: number; // min rating
  inStockOnly?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "rating-desc" | "date-desc";
  tag?: string;
  limit?: number;
  query?: string;
}

// In-memory runtime cache for products, categories, reviews
let runtimeProducts: Product[] = JSON.parse(JSON.stringify(PRODUCTS));
let runtimeCategories: Category[] = JSON.parse(JSON.stringify(CATEGORIES));
let runtimeReviews: Review[] = JSON.parse(JSON.stringify(SEEDED_REVIEWS));

// Listeners for real-time reactivity
type Listener = () => void;
const catalogListeners = new Set<Listener>();

function notifyListeners() {
  catalogListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("[Catalog Listener Error]:", e);
    }
  });
}

export function subscribeToCatalogUpdates(listener: Listener): () => void {
  catalogListeners.add(listener);
  return () => {
    catalogListeners.delete(listener);
  };
}

// Convert Firestore Document to TypeScript Product model
export function mapFirestoreDocToProduct(id: string, data: Record<string, any>): Product {
  const rawImages = data.images || data.imageUrls || [];
  const images: ProductImage[] = Array.isArray(rawImages) && rawImages.length > 0
    ? rawImages.map((img: any, idx: number) => {
        if (typeof img === "string") {
          return {
            id: `img-${id}-${idx}`,
            url: img,
            alt: data.title || data.name || "Product Image",
            isPrimary: idx === 0,
          };
        }
        return {
          id: img.id || `img-${id}-${idx}`,
          url: img.url || "",
          alt: img.alt || data.title || data.name || "Product Image",
          isPrimary: img.isPrimary ?? (idx === 0),
        };
      })
    : [
        {
          id: `img-${id}-0`,
          url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80",
          alt: data.title || data.name || "Product Image",
          isPrimary: true,
        },
      ];

  const rawVariants = data.variants || [];
  const basePrice = typeof data.basePrice === "number" ? data.basePrice : (typeof data.price === "number" ? data.price : 0);
  const discountPrice = typeof data.discountPrice === "number"
    ? data.discountPrice
    : (typeof data.compareAtPrice === "number" && data.price && data.price < data.compareAtPrice ? data.price : undefined);

  const variants: ProductVariant[] = Array.isArray(rawVariants) && rawVariants.length > 0
    ? rawVariants.map((v: any, idx: number) => {
        const variantName = v.name || v.title || (v.attributeValue ? `${v.attributeName || "Option"}: ${v.attributeValue}` : `Option ${idx + 1}`);
        const colorName = v.attributes?.Color || v.attributeValue || "Default";
        return {
          id: v.id || `var-${id}-${idx}`,
          sku: v.sku || `${id}-${idx}`,
          name: variantName,
          color: { name: colorName, hex: "#373A3C" },
          size: v.attributes?.Size || v.size,
          priceModifier: typeof v.price === "number" ? (v.price - basePrice) : (v.priceModifier || 0),
          stockQuantity: typeof v.stockQuantity === "number" ? v.stockQuantity : (data.stock ?? 10),
        };
      })
    : [
        {
          id: `var-${id}-std`,
          sku: `${id}-STD`,
          name: "Standard",
          color: { name: "Standard", hex: "#373A3C" },
          size: "Standard",
          priceModifier: 0,
          stockQuantity: typeof data.stockQuantity === "number" ? data.stockQuantity : (data.stock ?? 10),
        },
      ];

  return {
    id: id,
    slug: data.slug || id.replace("prod-", ""),
    title: data.title || data.name || "Aura Product",
    subtitle: data.shortDescription || data.subtitle || "",
    description: data.description || "",
    categoryId: data.categoryId || "cat-living",
    basePrice,
    discountPrice,
    rating: typeof data.rating === "number" ? data.rating : 4.8,
    reviewCount: typeof data.reviewCount === "number" ? data.reviewCount : 24,
    isFeatured: Boolean(data.isFeatured),
    isNewArrival: Boolean(data.isNewArrival || data.tags?.includes("new-arrival")),
    tags: Array.isArray(data.tags) ? data.tags : ["Minimalist", "Aura"],
    images,
    variants,
    specifications: data.specifications || {},
    createdAt: typeof data.createdAt === "string" ? data.createdAt : (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()),
  };
}

// Convert Firestore Document to TypeScript Category model
export function mapFirestoreDocToCategory(id: string, data: Record<string, any>): Category {
  return {
    id: id,
    slug: data.slug || id.replace("cat-", ""),
    title: data.title || data.name || "Category",
    description: data.description || "",
    imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    itemCount: typeof data.productCount === "number" ? data.productCount : (data.itemCount || 0),
  };
}

// Initialize Client-Side Real-Time Firestore Synchronization
let isRealtimeInitialized = false;

export function initRealtimeFirestore() {
  if (isRealtimeInitialized || typeof window === "undefined") return;
  isRealtimeInitialized = true;

  try {
    // 1. Real-time products subscription
    onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        if (!snapshot.empty) {
          const liveList = snapshot.docs.map((d) => mapFirestoreDocToProduct(d.id, d.data()));
          runtimeProducts = liveList;
          notifyListeners();
        }
      },
      (err) => console.warn("[Firestore Products Subscription Warning]:", err)
    );

    // 2. Real-time categories subscription
    onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        if (!snapshot.empty) {
          const liveCats = snapshot.docs.map((d) => mapFirestoreDocToCategory(d.id, d.data()));
          runtimeCategories = liveCats;
          notifyListeners();
        }
      },
      (err) => console.warn("[Firestore Categories Subscription Warning]:", err)
    );
  } catch (err) {
    console.warn("[Firestore Realtime Setup Failed]:", err);
  }
}

// Auto-run on client
if (typeof window !== "undefined") {
  initRealtimeFirestore();
}

// Async Fetchers for Server Components
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, "products"));
    if (!snap.empty) {
      const list = snap.docs.map((d) => mapFirestoreDocToProduct(d.id, d.data()));
      runtimeProducts = list;
      return list;
    }
  } catch (err) {
    console.warn("[Firestore fetchProducts fallback]:", err);
  }
  return runtimeProducts;
}

export async function fetchCategoriesFromFirestore(): Promise<Category[]> {
  try {
    const snap = await getDocs(collection(db, "categories"));
    if (!snap.empty) {
      const list = snap.docs.map((d) => mapFirestoreDocToCategory(d.id, d.data()));
      runtimeCategories = list;
      return list;
    }
  } catch (err) {
    console.warn("[Firestore fetchCategories fallback]:", err);
  }
  return runtimeCategories;
}

export function getRawProducts(): Product[] {
  return runtimeProducts;
}

export function updateVariantStock(productId: string, variantId: string, newStock: number): boolean {
  const prod = runtimeProducts.find((p) => p.id === productId);
  if (!prod) return false;
  const variant = prod.variants.find((v) => v.id === variantId);
  if (!variant) return false;
  variant.stockQuantity = Math.max(0, newStock);

  // Sync to Firestore in background
  try {
    const docRef = doc(db, "products", productId);
    updateDoc(docRef, {
      stockQuantity: prod.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
      variants: prod.variants,
    }).catch(() => {});
  } catch (_) {}

  notifyListeners();
  return true;
}

export function addProductReview(newReview: Omit<Review, "id" | "createdAt" | "helpfulCount">): Review {
  const review: Review = {
    ...newReview,
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString().split("T")[0],
    helpfulCount: 0,
  };
  runtimeReviews.unshift(review);

  // Recalculate product rating
  const prodReviews = runtimeReviews.filter((r) => r.productId === review.productId);
  const totalScore = prodReviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = Number((totalScore / prodReviews.length).toFixed(1));

  const prod = runtimeProducts.find((p) => p.id === review.productId);
  if (prod) {
    prod.rating = avg;
    prod.reviewCount = prodReviews.length;
  }

  notifyListeners();
  return review;
}

export function getCategories(): Category[] {
  return runtimeCategories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return runtimeCategories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getProductBySlug(slug: string): Product | undefined {
  return runtimeProducts.find((p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug);
}

export function getProductById(id: string): Product | undefined {
  return runtimeProducts.find((p) => p.id === id);
}

export function getProductSlugById(id: string): string {
  const prod = runtimeProducts.find((p) => p.id === id);
  return prod?.slug || id.replace("prod-", "");
}

export function getReviewsForProduct(productId: string): Review[] {
  return runtimeReviews.filter((r) => r.productId === productId);
}

export function getRelatedProducts(product: Product, limit: number = 4): Product[] {
  return runtimeProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
}

export function getProducts(params?: ProductFilterParams): Product[] {
  let list = [...runtimeProducts];

  if (!params) return list;

  // Search query filter
  if (params.query && params.query.trim().length > 0) {
    const searchRes = searchCatalog(params.query);
    const searchProductIds = new Set(searchRes.products.map((p) => p.id));
    list = list.filter((p) => searchProductIds.has(p.id));
  }

  // Category filter
  if (params.category && params.category !== "all") {
    const matchedCategory = runtimeCategories.find(
      (c) => c.slug.toLowerCase() === params.category!.toLowerCase() || c.id === params.category
    );
    if (matchedCategory) {
      if (matchedCategory.slug === "sale") {
        list = list.filter((p) => p.discountPrice !== undefined && p.discountPrice < p.basePrice);
      } else {
        list = list.filter((p) => p.categoryId === matchedCategory.id);
      }
    }
  }

  // Price range
  if (params.minPrice !== undefined) {
    list = list.filter((p) => {
      const price = p.discountPrice ?? p.basePrice;
      return price >= params.minPrice!;
    });
  }
  if (params.maxPrice !== undefined) {
    list = list.filter((p) => {
      const price = p.discountPrice ?? p.basePrice;
      return price <= params.maxPrice!;
    });
  }

  // Color / Material
  if (params.color && params.color.length > 0) {
    const selectedColors = params.color.map((c) => c.toLowerCase());
    list = list.filter((p) =>
      p.variants.some((v) => selectedColors.includes(v.color.name.toLowerCase()))
    );
  }

  // Rating
  if (params.rating !== undefined && params.rating > 0) {
    list = list.filter((p) => p.rating >= params.rating!);
  }

  // In stock only
  if (params.inStockOnly) {
    list = list.filter((p) => p.variants.some((v) => v.stockQuantity > 0));
  }

  // Tag
  if (params.tag) {
    const tagLower = params.tag.toLowerCase();
    list = list.filter((p) => p.tags.some((t) => t.toLowerCase() === tagLower));
  }

  // Sorting
  const sort = params.sort || "featured";
  switch (sort) {
    case "price-asc":
      list.sort((a, b) => (a.discountPrice ?? a.basePrice) - (b.discountPrice ?? b.basePrice));
      break;
    case "price-desc":
      list.sort((a, b) => (b.discountPrice ?? b.basePrice) - (a.discountPrice ?? a.basePrice));
      break;
    case "rating-desc":
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "date-desc":
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "featured":
    default:
      if (params.query && params.query.trim().length > 0) {
        const searchRes = searchCatalog(params.query);
        const idOrder = new Map(searchRes.products.map((p, idx) => [p.id, idx]));
        list.sort((a, b) => (idOrder.get(a.id) ?? 999) - (idOrder.get(b.id) ?? 999));
      } else {
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }
      break;
  }

  if (params.limit) {
    list = list.slice(0, params.limit);
  }

  return list;
}



// Typo-tolerant Levenshtein distance
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export interface SearchResult {
  products: Product[];
  categories: Category[];
  totalMatches: number;
}

export function searchCatalog(query: string): SearchResult {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { products: [], categories: [], totalMatches: 0 };
  }

  // Category matches
  const matchedCategories = runtimeCategories.filter(
    (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );

  // Product scoring algorithm
  const scored = runtimeProducts
    .map((p) => {
      const titleLower = p.title.toLowerCase();
      const descLower = p.description.toLowerCase();
      const tags = p.tags.map((t) => t.toLowerCase());

      let score = 0;
      if (titleLower === q) score += 100;
      else if (titleLower.startsWith(q)) score += 80;
      else if (titleLower.includes(q)) score += 50;

      if (tags.some((t) => t === q)) score += 40;
      else if (tags.some((t) => t.includes(q))) score += 20;

      if (descLower.includes(q)) score += 10;

      if (q.length > 4 && score === 0) {
        const words = titleLower.split(/\s+/);
        for (const w of words) {
          if (w.length > 4 && levenshteinDistance(w, q) <= 1) {
            score += 30;
            break;
          }
        }
      }

      return { product: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const matchedProducts = scored.map((s) => s.product);

  return {
    products: matchedProducts,
    categories: matchedCategories.slice(0, 2),
    totalMatches: matchedProducts.length,
  };
}
