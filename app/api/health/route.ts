export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

export async function GET() {
  try {
    const q = query(collection(db, "products"), limit(1));
    const snap = await getDocs(q);

    return NextResponse.json({
      status: "online",
      service: "Aura Living Central API",
      version: "1.0.0",
      architecture: "One Central Backend / API -> One Shared Firestore Database",
      database: {
        provider: "Google Cloud Firestore",
        projectId: "aura-living-6885e",
        connected: !snap.empty || snap.size >= 0,
      },
      clients: [
        { name: "Website Storefront", platform: "Next.js 16 Web" },
        { name: "Customer App", platform: "Flutter Mobile (Android/iOS)" },
        { name: "Admin App", platform: "Flutter Admin (Mobile/Desktop/Web)" },
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "degraded",
        service: "Aura Living Central API",
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
