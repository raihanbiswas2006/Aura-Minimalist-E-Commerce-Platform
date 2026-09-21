import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategories } from "@/lib/api/products";
import { CatalogView } from "@/components/catalog/catalog-view";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category && slug !== "all") {
    return {
      title: "Category Not Found | Aura Living",
    };
  }

  const title = category?.title || "All Disciplines";
  const desc = category?.description || "Curated modern minimalist catalog.";

  return {
    title: `${title} | Aura Living`,
    description: desc,
    alternates: {
      canonical: `https://aura-living.demo/c/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category && slug !== "all") {
    notFound();
  }

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12">Loading collection...</div>}>
      <CatalogView
        initialCategory={slug}
        pageTitle={category?.title || "All Collections"}
        pageDescription={category?.description}
      />
    </Suspense>
  );
}
