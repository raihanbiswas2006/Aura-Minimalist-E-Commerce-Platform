import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#E5E7EB]/80", className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 bg-white rounded-xl border border-[#E4E7EB] p-3 shadow-xs">
      <Skeleton className="aspect-4/5 w-full rounded-lg" />
      <div className="space-y-2 pt-1">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-1/5" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-subtle-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <span className="text-[#D1D5DB]">/</span>
        <Skeleton className="h-4 w-24" />
        <span className="text-[#D1D5DB]">/</span>
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery skeleton */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-16 h-20 md:w-20 md:h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="flex-1 aspect-4/5 rounded-xl" />
        </div>

        {/* Product info skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>

          <div className="space-y-2 pt-4 border-t border-[#E4E7EB]">
            <Skeleton className="h-9 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Swatches skeleton */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>

          {/* Stepper + CTA */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-28 rounded-lg" />
            <Skeleton className="h-12 flex-1 rounded-lg" />
          </div>

          {/* Accordion skeleton */}
          <div className="space-y-3 pt-6 border-t border-[#E4E7EB]">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-subtle-fade-in">
      <div className="space-y-3 mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
          <Skeleton className="h-6 w-28 pt-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-5 w-3/4" />
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 bg-[#FAF9F6] rounded-xl border border-[#E4E7EB]">
        <div className="md:col-span-4 space-y-3">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="md:col-span-8 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-[#E4E7EB] rounded-xl space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
