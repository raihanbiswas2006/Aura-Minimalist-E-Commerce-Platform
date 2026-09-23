import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/security/validation";
import { getUserByEmail, createUser } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit(`register_${ip}`, 5, 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again in a few moments." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid registration data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password, phone } = result.data;

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      // Clear but secure error
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in instead." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = createUser({
      name,
      email,
      passwordHash,
      role: "CUSTOMER", // Enforce CUSTOMER role strictly
      savedAddresses: phone
        ? [
            {
              fullName: name,
              email,
              phone,
              division: "Dhaka",
              district: "Dhaka",
              area: "",
              streetAddress: "",
              postalCode: "",
              country: "Bangladesh",
            },
          ]
        : [],
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Register API Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during account creation. Please try again." },
      { status: 500 }
    );
  }
}
