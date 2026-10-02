export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/api/products";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export async function GET() {
  try {
    const colRef = collection(db, "categories");
    const snap = await getDocs(colRef);
    let categories = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (categories.length === 0) {
      categories = getCategories() as any;
    }

    return NextResponse.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Category title and slug are required" },
        { status: 400 }
      );
    }

    const categoryId = body.id || `cat-${Date.now()}`;
    const categoryData = {
      ...body,
      id: categoryId,
    };

    await setDoc(doc(db, "categories", categoryId), categoryData);

    return NextResponse.json(
      { success: true, message: "Category created successfully", data: categoryData },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
