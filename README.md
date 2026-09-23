# Aura Living — Modern Minimalist Commerce Platform

> **Project Identifier:** `PRD-COMMERCE-2026-V1`  
> **Brand Name:** Aura Living (Aura Home & Apparel)  
> **Target Environment:** Next.js 16 (App Router) / React 19 / Vercel Edge & Serverless  
> **Status:** Production-Grade Authentication & Commerce Upgrade

---

## 1. Overview

**Aura Living** is an original direct-to-consumer (D2C) e-commerce application designed with warm minimalist modernism. The platform combines disciplined typography, ample whitespace, hairline borders, and understated micro-interactions to deliver a conversion-centric shopping experience tailored for Bangladesh.

### Core Value Propositions
* **Zero Surprise Costs:** Transparent delivery calculation, threshold-based free shipping progress meter (৳5,000 threshold), and clear delivery expectations before checkout.
* **Mandatory Purchase Protection:** Guests can freely browse products, search, and manage their cart; before completing checkout, secure authentication is required. Carts are 100% preserved through login, registration, and redirects.
* **Server-Authoritative Pricing & Stock:** Prices, discounts, and shipping are recalculated server-side; client-side price tampering or spoofed user IDs are rejected.
* **Dual Authentication Methods:** Email + Password (with `bcrypt` cost factor 12) and Google OAuth (OpenID Connect: `openid`, `email`, `profile`).
* **Order Ownership Isolation:** Historical orders are strictly isolated by authenticated customer identity (User A cannot inspect User B's orders).
* **Role-Based Security:** Strict separation between `CUSTOMER` and `ADMIN` roles. Newly registered accounts always default to `CUSTOMER`.
* **Engineered Speed & A11y:** Zero Cumulative Layout Shift (CLS), rigid 4:5 image containers, and WCAG 2.2 AA compliant micro-interactions.

---

## 2. Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
* **React:** [React 19](https://react.dev/)
* **Authentication:** [Auth.js v5](https://authjs.dev/) (`next-auth@beta`) with encrypted JWT session cookies
* **Password Hashing:** [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (cost factor 12)
* **Database & Persistence:** Server-side atomic file-backed JSON repository (`lib/db/index.ts` -> `data/db.json`) supporting User, Account, Session, and Order models, pluggable with `DATABASE_URL` (PostgreSQL / LibSQL).
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode, zero implicit any)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with Warm Minimalist HSL Tokens
* **Currency & Locale:** Bangladeshi Taka (`BDT` / `৳`), localized with `en-BD` numeric grouping
* **Validation:** [Zod](https://zod.dev/) schemas for registration, login, orders, addresses, and coupons
* **Security:** Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, sliding-window rate limiting.

---

## 3. Key Feature Walkthrough

| Module | Feature | Implementation Details |
| --- | --- | --- |
| **Authentication** | Dual Sign-In / Sign-Up | Dedicated `/login` and `/register` routes with Email + Password credentials and Google OAuth. Password confirmations, email normalization, and generic error messaging. |
| **Purchase Protection** | Checkout Gate | When unauthenticated guests attempt purchase, an Authentication Gate modal is presented with options to Sign In, Create Account, or Continue with Google, forwarding `callbackUrl=/checkout` without cart loss. |
| **Cart Preservation** | Session Continuity | Shopping bag stored in persistent storage under `aura_cart_state`. Cart seamlessly survives login, registration, page refreshes, and redirects. |
| **Server Validation** | Anti-Tamper Checkout | `POST /api/orders` verifies real-time variant stock, recalculates catalog prices, checks coupon thresholds, validates shipping tiers, and assigns order ownership to `session.user.id`. |
| **Order Ownership** | Horizontal Isolation | `GET /api/orders` and `GET /api/orders/[id]` enforce strict ownership. Unauthorized attempts return `403 Forbidden` / `404 Not Found`. |
| **Admin Control** | Simulation Hub | `/admin` features live inventory adjustment triggers and order lifecycle advancement, guarded by server-side `ADMIN` role checks. |
| **Catalog & PLP** | URL-Synced Filters | Bi-directional synchronization with `URLSearchParams`. Filter by BDT price range, color swatches, rating thresholds, and stock status. |
| **PDP** | High-Fidelity Details | Vertical thumbnail gallery, cursor image magnifier (1.75x), fullscreen zoom lightbox, real-time stock matrix, and mobile sticky CTA. |
| **Promotions** | Promo Engine | Codes `SAVE10` (10% off over ৳2,500), `FREESHIP` (complimentary delivery), and `WELCOME20` (৳200 off over ৳3,000). |
| **Checkout Flow** | 3-Stage Accordion | Stage 1 (Bangladesh Delivery Address), Stage 2 (Shipping Method: Inside Dhaka ৳60, Outside Dhaka ৳120, Nationwide ৳150), Stage 3 (COD or Simulated MFS: bKash, Nagad, Rocket, Card). |

---

## 4. Quick-Start Guide

### Prerequisites
* Node.js 18.17+ or 20+ (Node v22 / v24 tested)
* npm 9+

### Installation & Local Run

```bash
# Clone the repository
git clone https://github.com/example/aura-ecommerce-platform.git
cd aura-ecommerce-platform

# Install dependencies
npm install

# Copy example environment variables
cp .env.example .env.local

# Launch local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Pre-Seeded Demonstration Personas

For immediate portfolio evaluation and automated testing, the following accounts are pre-seeded in the database:

| Name | Email | Password | Role | Notes |
| --- | --- | --- | --- | --- |
| **Arif Rahman** | `arif@demo.aura` | `AuraLiving2026!` | `CUSTOMER` | Pre-saved Dhaka address |
| **Nusrat Jahan** | `nusrat@demo.aura` | `AuraLiving2026!` | `CUSTOMER` | Pre-saved Chattogram address |
| **Operations Admin** | `admin@demo.aura` | `AuraLiving2026!` | `ADMIN` | Unlocked Admin Hub permissions |

---

## 5. Environment Variables Configuration

Copy `.env.example` to `.env.local` for local execution:

```env
# Server secret for signing Auth.js session JWT cookies (Minimum 32 characters)
AUTH_SECRET=your-random-32-byte-secret

# Base application URL
AUTH_URL=http://localhost:3000

# Google OAuth 2.0 Credentials (Optional for local email/password testing)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional PostgreSQL / LibSQL database URL (defaults to data/db.json)
DATABASE_URL=
```

> [!CAUTION]
> NEVER commit `.env.local` or real client secrets to GitHub or public repositories. Secrets must remain server-side only.

---

## 6. Google Cloud Console Setup Instructions

To enable live Google Sign-In, configure Google Cloud Console as follows:

1. **Create or Select a Google Cloud Project:**
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a project named **Aura Living**.

2. **Configure OAuth Consent Screen:**
   - Go to **APIs & Services** > **OAuth consent screen**.
   - User Type: **External**.
   - App Name: `Aura Living`.
   - User Support Email: your developer email.
   - Developer Contact Information: your email.
   - **Scopes:** Click **Add or Remove Scopes** and select:
     - `.../auth/userinfo.email` (`email`)
     - `.../auth/userinfo.profile` (`profile`)
     - `openid`
     *(Do NOT request access to Drive, Gmail, Calendar, Contacts, or any unrelated service).*

3. **Create OAuth 2.0 Client Credentials:**
   - Go to **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `Aura Living Web Storefront`.
   - **Authorized JavaScript origins:**
     - Local development: `http://localhost:3000`
     - Production: `https://<your-vercel-domain>.vercel.app`
   - **Authorized redirect URIs (Exact match required):**
     - Local development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://<your-vercel-domain>.vercel.app/api/auth/callback/google`

4. **Add Credentials to Environment Variables:**
   - Copy Client ID into `GOOGLE_CLIENT_ID` in `.env.local` and Vercel Project Settings.
   - Copy Client Secret into `GOOGLE_CLIENT_SECRET` in `.env.local` and Vercel Project Settings.

---

## 7. Verification & Automated Test Commands

Run the complete test and audit suite:

```bash
# 1. Strict TypeScript type check
npx tsc --noEmit

# 2. UX, animations, and micro-interactions contract verification
node scripts/verify-ux.mjs

# 3. Comprehensive authentication, authorization, and purchase protection security tests
node scripts/test-auth-security.mjs

# 4. Production Next.js Turbopack build
npm run build
```

---

## 8. Key Routes & Security Architecture

* `/` — Editorial Homepage (Public)
* `/c/[category]` — Category Product Listing Page (Public)
* `/p/[slug]` — High-Fidelity Product Details Page (Public)
* `/cart` — Shopping Bag with Free Shipping Meter (Public)
* `/login` — Dedicated Aura Living Customer Login
* `/register` — Dedicated Customer Registration
* `/checkout` — Distraction-Free 3-Stage Checkout (**Authentication Required Gate**)
* `/order/[id]/confirmation` — Order Receipt with Confetti & Print Support
* `/account` — Customer Security & Address Portal (**Authentication Protected**)
* `/account/orders` — Historical Orders & Tracking (**Authentication Protected & User Isolated**)
* `/admin` — Operations Demo Controller (**ADMIN Role Protected**)
* `/api/auth/[...nextauth]` — Auth.js OAuth and credentials endpoints
* `/api/auth/register` — Customer registration API (Rate limited, bcrypt hashed)
* `/api/orders` — Server-authoritative order placement & user order history
* `/api/orders/[id]` — Protected order lookup with user ownership authorization

---

## 9. Security Limitations & Production Considerations

* **Self-Service Password Reset:** Password reset links are documented in the UI and require integrating an active transactional email provider (such as Resend, Amazon SES, or SendGrid) to dispatch verification tokens.
* **Rate Limiting:** An in-memory sliding-window rate limiter is included for auth and order routes. In distributed multi-region serverless deployments, consider connecting Upstash Redis (`@upstash/ratelimit`).
* **Database Scaling:** The local file store (`data/db.json`) provides zero-dependency local testing. For high-concurrency production deployments, provision a managed PostgreSQL or LibSQL database via `DATABASE_URL`.
