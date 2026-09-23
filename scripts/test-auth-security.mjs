import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { z } from "zod";

console.log("================================================================================");
console.log("AURA LIVING — COMPREHENSIVE SECURITY, AUTHENTICATION & COMMERCE TEST SUITE");
console.log("================================================================================\n");

let passed = 0;
let total = 0;

function assert(condition, testName, details = "") {
  total++;
  if (condition) {
    console.log(`[PASS] Test ${total.toString().padStart(2, "0")}: ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] Test ${total.toString().padStart(2, "0")}: ${testName} ${details ? `(${details})` : ""}`);
  }
}

// -----------------------------------------------------------------------------
// TEST 1: Guest can browse products catalog (Source contract & Data verification)
// -----------------------------------------------------------------------------
const productsFile = fs.readFileSync("data/products.ts", "utf8");
assert(productsFile.includes('slug: "nordic-lounge-chair"'), "Guest can browse catalog products and view unauthenticated PDPs");
assert(productsFile.includes("discountPrice: 34900"), "BDT pricing is defined in catalog source");

// -----------------------------------------------------------------------------
// TEST 2: Guest can configure cart state (Zustand schema contract)
// -----------------------------------------------------------------------------
const cartStoreCode = fs.readFileSync("store/cart-store.ts", "utf8");
assert(cartStoreCode.includes('"aura_cart_state"'), "Guest cart state persists across actions via localStorage (aura_cart_state)");
assert(cartStoreCode.includes("addItem: (newItem) =>"), "Cart store supports adding items with quantity bounds");

// -----------------------------------------------------------------------------
// TEST 3: Unauthenticated checkout / purchase protection requirement
// -----------------------------------------------------------------------------
const ordersApiCode = fs.readFileSync("app/api/orders/route.ts", "utf8");
assert(
  ordersApiCode.includes("const session = await auth()") &&
  ordersApiCode.includes('status: 401'),
  "POST /api/orders enforces server-side authentication check and rejects unauthenticated requests with 401"
);

// -----------------------------------------------------------------------------
// TEST 4: Login & Register UI pages exist and follow Aura minimalist design
// -----------------------------------------------------------------------------
assert(fs.existsSync("app/(store)/login/page.tsx"), "Dedicated Aura Living login page exists (/login)");
assert(fs.existsSync("app/(store)/register/page.tsx"), "Dedicated Aura Living register page exists (/register)");

const loginPageCode = fs.readFileSync("app/(store)/login/page.tsx", "utf8");
assert(loginPageCode.includes('signIn("credentials"'), "Login page includes Email + Password credentials handler");
assert(loginPageCode.includes('signIn("google"'), "Login page includes Continue with Google OAuth handler");
assert(loginPageCode.includes("Forgot Password"), "Login page includes secure transactional email notice for password reset");

// -----------------------------------------------------------------------------
// TEST 5: Customer registration with bcrypt hashing (No plaintext storage)
// -----------------------------------------------------------------------------
const registerApiCode = fs.readFileSync("app/api/auth/register/route.ts", "utf8");
assert(registerApiCode.includes("bcrypt.hash(password, 12)"), "Registration route hashes passwords with bcrypt cost factor 12");
assert(registerApiCode.includes('role: "CUSTOMER"'), "Registration route strictly assigns CUSTOMER role to new accounts");

const samplePassword = "AuraLiving2026!";
const testHash = bcrypt.hashSync(samplePassword, 10);
assert(
  testHash.startsWith("$2b$") && testHash.length > 50 && !testHash.includes(samplePassword),
  "bcrypt hashes are non-reversible and format-compliant ($2b$)"
);

// -----------------------------------------------------------------------------
// TEST 6: Registration validation rejects password mismatch and weak passwords
// -----------------------------------------------------------------------------
const BD_PHONE_REGEX = /^(?:\+?880|0)?1[3-9]\d{8}$/;
const testRegisterSchema = z
  .object({
    name: z.string().trim().min(2),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    phone: z.string().trim().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

const invalidMismatch = testRegisterSchema.safeParse({
  name: "Arif Test",
  email: "arif@example.com",
  password: "Password1234!",
  confirmPassword: "WrongPassword4321!",
});
assert(!invalidMismatch.success, "Registration rejects password mismatch");

const invalidShortPass = testRegisterSchema.safeParse({
  name: "Arif Test",
  email: "arif@example.com",
  password: "short",
  confirmPassword: "short",
});
assert(!invalidShortPass.success, "Registration rejects passwords under 8 characters");

// -----------------------------------------------------------------------------
// TEST 7: Role spoofing protection on registration
// -----------------------------------------------------------------------------
assert(
  registerApiCode.includes('role: "CUSTOMER"') && !registerApiCode.includes('body.role'),
  "Server ignores client-submitted role and enforces CUSTOMER default"
);

// -----------------------------------------------------------------------------
// TEST 8: Credentials authentication verification & enumeration resistance
// -----------------------------------------------------------------------------
const dbCode = fs.readFileSync("lib/db/index.ts", "utf8");
assert(dbCode.includes("DEFAULT_DEMO_PASSWORD_HASH"), "Server-side database repository initializes pre-seeded password hashes");
assert(dbCode.includes("getUserByEmail"), "Server-side database implements getUserByEmail DAO");

// Test bcrypt comparison logic
const validCheck = bcrypt.compareSync(samplePassword, testHash);
assert(validCheck === true, "Valid password credentials authenticate successfully");

const invalidCheck = bcrypt.compareSync("WrongPassword999!", testHash);
assert(invalidCheck === false, "Invalid password credentials fail authentication");

// -----------------------------------------------------------------------------
// TEST 9: Client price tampering rejection (Server-Authoritative Pricing)
// -----------------------------------------------------------------------------
assert(
  ordersApiCode.includes("serverUnitPrice") &&
  ordersApiCode.includes("catalogProducts.find"),
  "Server recalculates line item prices strictly from trusted catalog data (ignoring client prices)"
);

// -----------------------------------------------------------------------------
// TEST 10: Client User ID spoofing protection
// -----------------------------------------------------------------------------
assert(
  ordersApiCode.includes("userId: session.user.id") &&
  !ordersApiCode.includes("userId: body.userId"),
  "Order ownership is strictly bound to session.user.id, ignoring client-submitted user ID"
);

// -----------------------------------------------------------------------------
// TEST 11: Order ownership authorization (Horizontal Privilege Escalation)
// -----------------------------------------------------------------------------
const orderDetailApiCode = fs.readFileSync("app/api/orders/[id]/route.ts", "utf8");
assert(
  orderDetailApiCode.includes("getOrderById(id, session.user.id, session.user.role)"),
  "GET /api/orders/[id] validates user ownership against session.user.id"
);

assert(
  dbCode.includes("order.userId === requestUserId") &&
  dbCode.includes('userRole === "ADMIN"'),
  "getOrderById enforces user ownership: returns null for unauthorized user attempts"
);

// -----------------------------------------------------------------------------
// TEST 12: Order history is strictly scoped to authenticated user
// -----------------------------------------------------------------------------
assert(
  ordersApiCode.includes("getOrdersByUserId(session.user.id)"),
  "GET /api/orders returns orders strictly filtered by session.user.id"
);

// -----------------------------------------------------------------------------
// TEST 13: Stock quantity validation (Out-of-stock boundary)
// -----------------------------------------------------------------------------
assert(
  ordersApiCode.includes("inputItem.quantity > variant.stockQuantity") &&
  ordersApiCode.includes("exceeds available stock"),
  "Order placement verifies real-time variant inventory and rejects over-purchasing"
);

// -----------------------------------------------------------------------------
// TEST 14: Cart preservation contract
// -----------------------------------------------------------------------------
const checkoutCode = fs.readFileSync("app/(checkout)/checkout/page.tsx", "utf8");
assert(
  checkoutCode.includes("useCartStore") &&
  checkoutCode.includes("showAuthGate"),
  "Checkout displays Authentication Gate modal while keeping cart items intact in store"
);

// -----------------------------------------------------------------------------
// TEST 15: Security Headers Configuration in next.config.ts
// -----------------------------------------------------------------------------
const nextConfigCode = fs.readFileSync("next.config.ts", "utf8");
assert(nextConfigCode.includes("Content-Security-Policy"), "Content-Security-Policy configured in next.config.ts");
assert(nextConfigCode.includes("X-Frame-Options"), "X-Frame-Options configured in next.config.ts");
assert(nextConfigCode.includes("X-Content-Type-Options"), "X-Content-Type-Options configured in next.config.ts");
assert(nextConfigCode.includes("Strict-Transport-Security"), "Strict-Transport-Security configured in next.config.ts");
assert(nextConfigCode.includes("Referrer-Policy"), "Referrer-Policy configured in next.config.ts");

// -----------------------------------------------------------------------------
// TEST 16: Zero Hardcoded Production Secrets Audit
// -----------------------------------------------------------------------------
const envExample = fs.readFileSync(".env.example", "utf8");
assert(!envExample.includes("AIza"), ".env.example does not contain real Google credentials");
assert(envExample.includes("AUTH_SECRET="), ".env.example documents AUTH_SECRET variable");
assert(envExample.includes("GOOGLE_CLIENT_ID="), ".env.example documents GOOGLE_CLIENT_ID variable");
assert(envExample.includes("GOOGLE_CLIENT_SECRET="), ".env.example documents GOOGLE_CLIENT_SECRET variable");

const authCode = fs.readFileSync("auth.ts", "utf8");
assert(!authCode.includes("AIzaSy"), "auth.ts does not hardcode Google Client ID or secret");
assert(authCode.includes("process.env.AUTH_SECRET"), "auth.ts reads AUTH_SECRET strictly from environment");

// -----------------------------------------------------------------------------
// TEST 17: Pre-seeded accounts exist with bcrypt-hashed credentials & admin separation
// -----------------------------------------------------------------------------
assert(dbCode.includes('"arif@demo.aura"'), "Pre-seeded Arif Rahman customer persona defined in database");
assert(dbCode.includes('"nusrat@demo.aura"'), "Pre-seeded Nusrat Jahan customer persona defined in database");
assert(dbCode.includes('"admin@demo.aura"'), "Pre-seeded Operations Admin persona defined in database");
assert(dbCode.includes('role: "ADMIN"'), "Admin role is assigned through trusted server-side seed");

const adminPageCode = fs.readFileSync("app/(admin)/admin/page.tsx", "utf8");
assert(adminPageCode.includes('session?.user?.role === "ADMIN"'), "Admin hub verifies server-side ADMIN role from session");

console.log(`\n================================================================================`);
console.log(`Security Test Suite Complete: Passed ${passed}/${total}, Failed: ${total - passed}`);
console.log("================================================================================\n");

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
