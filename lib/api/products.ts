import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { SEEDED_REVIEWS } from "@/data/reviews";
import { Product, Category, Review } from "@/types";

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

// In-memory runtime cache for product stock mutations (used by Admin and PDP)
let runtimeProducts: Product[] = JSON.parse(JSON.stringify(PRODUCTS));
let runtimeReviews: Review[] = JSON.parse(JSON.stringify(SEEDED_REVIEWS));

export function getRawProducts(): Product[] {
  return runtimeProducts;
}

export function updateVariantStock(productId: string, variantId: string, newStock: number): boolean {
  const prod = runtimeProducts.find((p) => p.id === productId);
  if (!prod) return false;
  const variant = prod.variants.find((v) => v.id === variantId);
  if (!variant) return false;
  variant.stockQuantity = Math.max(0, newStock);
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

  return review;
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getProductBySlug(slug: string): Product | undefined {
  return runtimeProducts.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
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
    const matchedCategory = CATEGORIES.find(
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

// Simple Levenshtein distance for typo-tolerant matching
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
  const matchedCategories = CATEGORIES.filter(
    (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );

  // Product scoring algorithm
  const scored = runtimeProducts
    .map((p) => {
      const titleLower = p.title.toLowerCase();
      const descLower = p.description.toLowerCase();
      const tags = p.tags.map((t) => t.toLowerCase());

      let score = 0;
      if (titleLower === q) score += 100; // Exact title match
      else if (titleLower.startsWith(q)) score += 80;
      else if (titleLower.includes(q)) score += 50;

      if (tags.some((t) => t === q)) score += 40;
      else if (tags.some((t) => t.includes(q))) score += 20;

      if (descLower.includes(q)) score += 10;

      // Typo tolerance: words of length > 4 with Levenshtein distance <= 1
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
