export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/api/products";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const qParam = searchParams.get("q") || undefined;
    const limitParam = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Fetch live from Firestore
    const colRef = collection(db, "products");
    const snap = await getDocs(colRef);
    let products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (products.length === 0) {
      products = getProducts({ category, query: qParam, limit: limitParam }) as any;
    }

    if (category && category !== "all") {
      products = products.filter((p: any) => p.categoryId === category || p.categorySlug === category);
    }
    if (qParam) {
      const q = qParam.toLowerCase();
      products = products.filter((p: any) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (limitParam) {
      products = products.slice(0, limitParam);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.basePrice) {
      return NextResponse.json(
        { success: false, error: "Product title and basePrice are required" },
        { status: 400 }
      );
    }

    const productId = body.id || `prod-${Date.now()}`;
    const productData = {
      ...body,
      id: productId,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "products", productId), productData);

    return NextResponse.json(
      { success: true, message: "Product created successfully", data: productData },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
