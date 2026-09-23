import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createOrderInputSchema } from "@/lib/security/validation";
import { getRawProducts, updateVariantStock } from "@/lib/api/products";
import { SEEDED_COUPONS } from "@/data/coupons";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_TIERS } from "@/lib/constants";
import { createOrder, getOrdersByUserId } from "@/lib/db";
import { CartItem } from "@/types";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce Server-Side Authentication
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in or register to complete your purchase." },
        { status: 401 }
      );
    }

    // 2. Abuse Prevention / Rate Limiting
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit(`order_${session.user.id}_${ip}`, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Order placement rate limit reached. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    // 3. Validate Request Payload Schema
    const body = await req.json();
    const result = createOrderInputSchema.safeParse(body);
    if (!result.success) {
      const firstIssue = result.error.issues[0]?.message || "Invalid order parameters";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const { items: inputItems, shippingAddress, shippingMethod, paymentMethod, couponCode } = result.data;

    // 4. Server-Side Price & Stock Verification (NEVER trust client pricing)
    const catalogProducts = getRawProducts();
    const verifiedItems: CartItem[] = [];

    for (const inputItem of inputItems) {
      const product = catalogProducts.find((p) => p.id === inputItem.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID "${inputItem.productId}" does not exist in catalog.` },
          { status: 400 }
        );
      }

      const variant = product.variants.find((v) => v.id === inputItem.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant with ID "${inputItem.variantId}" not found for product "${product.title}".` },
          { status: 400 }
        );
      }

      // Check Real-Time Stock Availability
      if (inputItem.quantity > variant.stockQuantity) {
        return NextResponse.json(
          {
            error: `Selected quantity (${inputItem.quantity}) for "${product.title} - ${variant.name}" exceeds available stock (${variant.stockQuantity}).`,
          },
          { status: 400 }
        );
      }

      // Authoritative Server-Derived Unit Price
      const serverUnitPrice = (product.discountPrice ?? product.basePrice) + (variant.priceModifier || 0);

      verifiedItems.push({
        id: `${product.id}-${variant.id}`,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantName: variant.name,
        unitPrice: Number(serverUnitPrice.toFixed(2)),
        quantity: inputItem.quantity,
        imageUrl: product.images[0]?.url || "",
        maxStock: variant.stockQuantity,
        slug: product.slug,
      });
    }

    // 5. Authoritative Subtotal Calculation
    const subtotal = verifiedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // 6. Server-Side Coupon & Promotional Discount Verification
    let discountAmount = 0.0;
    let isFreeShippingCoupon = false;

    if (couponCode) {
      const upperCode = couponCode.trim().toUpperCase();
      const coupon = SEEDED_COUPONS.find((c) => c.code.toUpperCase() === upperCode);

      if (coupon) {
        if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === "shipping" || upperCode === "FREESHIP") {
            isFreeShippingCoupon = true;
          } else if (coupon.discountType === "percentage") {
            discountAmount = (subtotal * coupon.discountValue) / 100;
          } else if (coupon.discountType === "fixed") {
            discountAmount = Math.min(coupon.discountValue, subtotal);
          }
        }
      }
    }

    // 7. Authoritative Shipping Calculation
    const selectedTier = SHIPPING_TIERS.find((t) => t.id === shippingMethod) || SHIPPING_TIERS[0];
    const isComplimentaryQualified = subtotal >= FREE_SHIPPING_THRESHOLD || isFreeShippingCoupon;
    const shippingFee = selectedTier.isComplimentaryEligible && isComplimentaryQualified ? 0.0 : selectedTier.rate;

    // 8. Derived Final Total (Zero Trust in Client Math)
    const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    // 9. Atomically Deduct Variant Stock in Catalog
    for (const item of verifiedItems) {
      const prod = catalogProducts.find((p) => p.id === item.productId);
      const vr = prod?.variants.find((v) => v.id === item.variantId);
      if (vr) {
        updateVariantStock(item.productId, item.variantId, Math.max(0, vr.stockQuantity - item.quantity));
      }
    }

    // 10. Persist Order Linked to Authenticated User Session
    const order = createOrder({
      userId: session.user.id,
      userEmail: session.user.email || shippingAddress.email,
      items: verifiedItems,
      shippingAddress: {
        ...shippingAddress,
        city: shippingAddress.district,
        state: shippingAddress.division,
      },
      shippingMethod,
      paymentMethod,
      pricing: {
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discountAmount.toFixed(2)),
        shipping: Number(shippingFee.toFixed(2)),
        tax: 0.0,
        total: Number(finalTotal.toFixed(2)),
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("[Orders POST API Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while placing the order. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required to view order history." },
        { status: 401 }
      );
    }

    // Strictly returns orders owned by the authenticated user
    const orders = getOrdersByUserId(session.user.id);
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("[Orders GET API Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve orders." }, { status: 500 });
  }
}
