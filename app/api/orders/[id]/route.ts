import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrderById } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required to access order details." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const order = getOrderById(id, session.user.id, session.user.role);

    if (!order) {
      // Either order does not exist or user does not own this order
      return NextResponse.json(
        { error: "Order not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("[Order Detail GET Error]:", error);
    return NextResponse.json({ error: "Failed to load order details." }, { status: 500 });
  }
}
