"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { getProductById } from "@/lib/api/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items: wishlistIds, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);

  // Retrieve matching products
  const products = useMemo(() => {
    return wishlistIds
      .map((id) => getProductById(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [wishlistIds]);

  const handleMoveToCart = (product: NonNullable<typeof products[0]>) => {
    const defaultVariant = product.variants[0];
    const activePrice = product.discountPrice
      ? product.discountPrice + (defaultVariant?.priceModifier || 0)
      : product.basePrice + (defaultVariant?.priceModifier || 0);

    addItemToCart({
      id: `${product.id}-${defaultVariant?.id || "def"}`,
      productId: product.id,
      variantId: defaultVariant?.id || "def",
      title: product.title,
      variantName: defaultVariant?.name || "Standard",
      unitPrice: activePrice,
      quantity: 1,
      imageUrl: product.images[0]?.url || "",
      maxStock: defaultVariant?.stockQuantity || 5,
    });

    removeFromWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E4E7EB] mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#14171A]">
            Saved Wishlist ({products.length})
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Carefully preserved considerations for your home sanctuary.
          </p>
        </div>

        {products.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs text-[#6B7280] hover:text-[#C2222E] underline cursor-pointer self-start sm:self-auto"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E4E7EB] max-w-md mx-auto p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E4E7EB] flex items-center justify-center mx-auto mb-4 text-[#9CA3AF]">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#14171A]">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
            Click the heart icon on any piece across our collections to curate your private selection.
          </p>
          <div className="mt-6">
            <Link href="/c/furniture">
              <Button variant="primary">Browse Furniture Pieces</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const activePrice = product.discountPrice ?? product.basePrice;
            const primaryImg = product.images[0]?.url || "";

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[#E4E7EB] overflow-hidden flex flex-col justify-between group shadow-2xs hover:border-[#D1D5DB] transition-all"
              >
                <div>
                  <div className="relative aspect-4/5 w-full bg-[#FAF9F6] overflow-hidden">
                    <Link href={`/p/${product.slug}`} className="block w-full h-full">
                      <Image
                        src={primaryImg}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-[#C2222E] hover:bg-white transition-all shadow-xs cursor-pointer"
                      aria-label={`Remove ${product.title} from wishlist`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold">
                      {product.tags[0] || "Aura"}
                    </p>
                    <h3 className="text-sm font-semibold text-[#14171A] truncate mt-0.5 hover:text-[#1F4E43]">
                      <Link href={`/p/${product.slug}`}>{product.title}</Link>
                    </h3>
                    <p className="text-sm font-bold text-[#14171A] mt-1.5">
                      {formatPrice(activePrice)}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold"
                    onClick={() => handleMoveToCart(product)}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
