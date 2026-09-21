import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";
import {
  getProductBySlug,
  getCategoryBySlug,
  getRelatedProducts,
  getReviewsForProduct,
} from "@/lib/api/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { ReviewSection } from "@/components/review/review-section";
import { AccordionItem } from "@/components/ui/accordion";
import { ProductCard } from "@/components/product/product-card";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Aura Living",
    };
  }

  const activePrice = product.discountPrice ?? product.basePrice;

  return {
    title: `${product.title} | Aura Living`,
    description: `${product.subtitle}. ${product.description.slice(0, 150)}... Available for $${activePrice.toFixed(
      2
    )}.`,
    alternates: {
      canonical: `https://aura-living.demo/p/${product.slug}`,
    },
    openGraph: {
      title: `${product.title} | Aura Living`,
      description: product.subtitle,
      images: [
        {
          url: product.images[0]?.url || "",
          width: 1000,
          height: 1250,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = getReviewsForProduct(product.id);
  const related = getRelatedProducts(product, 4);

  // Category info for breadcrumb
  const categorySlug = product.categoryId.replace("cat-", "");
  const category = getCategoryBySlug(categorySlug);
  const categoryTitle = category?.title || "Collection";

  // JSON-LD Structured Data per Section 27 of PRD
  const activePrice = product.discountPrice ?? product.basePrice;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aura-living.demo/#organization",
        name: "Aura Living",
        url: "https://aura-living.demo",
        logo: "https://aura-living.demo/logo.png",
      },
      {
        "@type": "Product",
        "@id": `https://aura-living.demo/p/${product.slug}/#product`,
        name: product.title,
        description: product.description,
        image: product.images.map((img) => img.url),
        sku: product.variants[0]?.sku || "AUR-001",
        brand: {
          "@type": "Brand",
          name: "Aura Living",
        },
        offers: {
          "@type": "Offer",
          url: `https://aura-living.demo/p/${product.slug}`,
          priceCurrency: "USD",
          price: activePrice.toFixed(2),
          availability:
            product.variants.some((v) => v.stockQuantity > 0)
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating.toString(),
          reviewCount: product.reviewCount.toString(),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://aura-living.demo",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryTitle,
            item: `https://aura-living.demo/c/${categorySlug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: `https://aura-living.demo/p/${product.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Server-rendered JSON-LD structured schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-[#6B7280]">
            <li>
              <Link href="/" className="hover:text-[#14171A] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            </li>
            <li>
              <Link
                href={`/c/${categorySlug}`}
                className="hover:text-[#14171A] transition-colors"
              >
                {categoryTitle}
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            </li>
            <li className="font-semibold text-[#14171A] truncate max-w-xs">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Product Details Grid (60% Gallery / 40% Info on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left 60%: Media Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Right 40%: Product Information & Purchase Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#6B7280] font-semibold mb-1">
                {product.tags.join(" • ")}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14171A] leading-tight">
                {product.title}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed font-normal">
                {product.subtitle}
              </p>

              {/* SKU & Ratings Jump Link */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#E4E7EB] text-xs text-[#6B7280]">
                <span>SKU: {product.variants[0]?.sku}</span>
                <span>•</span>
                <a
                  href="#reviews"
                  className="flex items-center gap-1.5 text-[#14171A] hover:text-[#1F4E43] font-medium"
                >
                  <div className="flex items-center text-[#F59E0B]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="underline">({product.reviewCount} reviews)</span>
                </a>
              </div>
            </div>

            {/* Variant Selector, Stock Check & Add to Cart Controls */}
            <VariantSelector product={product} />

            {/* Description Editorial */}
            <div className="pt-4 border-t border-[#E4E7EB]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#14171A] mb-2">
                Design Story & Form
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Accordion Blocks */}
            <div className="pt-2 border-t border-[#E4E7EB]">
              {/* Specifications */}
              <AccordionItem
                id="specs"
                title="Dimensions & Specifications"
                defaultOpen={true}
              >
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-[#9CA3AF] block">{k}</span>
                      <span className="text-[#14171A] font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </AccordionItem>

              {/* Materials & Care */}
              <AccordionItem id="care" title="Materials & Care Routine">
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Crafted using honest materials intended to develop a natural patina over time. Dust gently with a clean dry microfiber cloth. Avoid harsh chemical sprays or abrasive household detergents.
                </p>
              </AccordionItem>

              {/* Delivery Timelines */}
              <AccordionItem id="delivery" title="Delivery & White-Glove Service">
                <div className="text-xs text-[#4B5563] space-y-2">
                  <p>
                    • <strong>Standard Delivery:</strong> 3-5 business days. Complimentary on orders over $150.
                  </p>
                  <p>
                    • <strong>Express Courier:</strong> 1-2 business days ($25.00).
                  </p>
                  <p>
                    • <strong>Simulated Logistics:</strong> Sample ground delivery policy demonstrating threshold calculations ($150 complimentary tier).
                  </p>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Customer Review Section */}
        <ReviewSection
          productId={product.id}
          productTitle={product.title}
          initialReviews={reviews}
        />

        {/* Related Products Section */}
        {related.length > 0 && (
          <section className="pt-20 border-t border-[#E4E7EB] mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#1F4E43] mb-1">
                  Cohesive Aesthetics
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#14171A]">
                  Pairs Well In This Collection
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
