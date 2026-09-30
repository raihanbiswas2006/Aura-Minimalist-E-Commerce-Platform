"use client";

import { useState, useEffect, useMemo } from "react";
import {
  initRealtimeFirestore,
  subscribeToCatalogUpdates,
  getProducts,
  getCategories,
  type ProductFilterParams,
} from "@/lib/api/products";
import type { Product, Category } from "@/types";

export { getProducts, getCategories, type ProductFilterParams } from "@/lib/api/products";

// React Hook for Client Components to subscribe to Live Firestore Products
export function useRealtimeProducts(params?: ProductFilterParams): Product[] {
  const [, setTick] = useState(0);

  useEffect(() => {
    initRealtimeFirestore();
    return subscribeToCatalogUpdates(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return useMemo(() => getProducts(params), [params]);
}

// React Hook for Client Components to subscribe to Live Firestore Categories
export function useRealtimeCategories(): Category[] {
  const [, setTick] = useState(0);

  useEffect(() => {
    initRealtimeFirestore();
    return subscribeToCatalogUpdates(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return useMemo(() => getCategories(), []);
}
