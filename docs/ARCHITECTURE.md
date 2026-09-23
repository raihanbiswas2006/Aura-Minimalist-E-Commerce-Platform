# Architecture Specification: Aura Minimalist E-Commerce Platform

## 1. System Overview & Authentication Architecture

```
+-----------------------------------------------------------------------------------+
|                                   USER BROWSER                                    |
|  - Next.js Client Components (React 19)                                           |
|  - Auth.js Session Consumer (`useSession`) with HttpOnly Secure Cookies           |
|  - Local-First Client State (Zustand: Cart, Wishlist)                             |
|  - Checkout Auth Gate & Distraction-Free Accordion (BD Localization)               |
+-----------------------------------------------------------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------------------+
|                        NEXT.JS APP ROUTER & API LAYER                             |
|  - Route Handlers: `/api/auth/[...nextauth]`, `/api/auth/register`, `/api/orders` |
|  - Server-Side Purchase Protection (Stock availability, zero-trust price recalculation)|
|  - Strict Horizontal Order Ownership Authorization                                |
|  - Security Headers (CSP, X-Frame-Options, X-Content-Type-Options, HSTS)          |
+-----------------------------------------------------------------------------------+
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
+------------------------------------+   +------------------------------------+
|       AUTH.JS PROVIDERS            |   |       PERSISTENT REPOSITORY        |
|  - Credentials (`bcrypt` cost 12)  |   |  - Server Database (`lib/db/*`)    |
|  - Google OAuth (OpenID Connect)   |   |  - Atomic JSON File (`data/db.json`)|
|  - Scopes: `openid email profile`  |   |  - Pluggable `DATABASE_URL`        |
+------------------------------------+   +------------------------------------+
```

---

## 2. State Management Taxonomy

| State Type | Scope | Technology | Example Entities | Storage Key / Provider |
| --- | --- | --- | --- | --- |
| **Server State** | Server / Build | Next.js Server Components | Product catalogs, category definitions, SEO metadata | In-memory catalog |
| **Auth Session** | Server-Authoritative | Auth.js v5 (`next-auth@beta`) | User ID, email, verified name, role (`CUSTOMER` / `ADMIN`) | HttpOnly JWT session cookie |
| **URL State** | Browser Address | `next/navigation` (`useSearchParams`) | Active search queries (`?q=`), applied filters (`?color=`), `callbackUrl` | Browser URL |
| **Cart Global** | Persistent Client | Zustand (`persist` middleware) | Line items, coupon codes, shipping threshold meter | `aura_cart_state` (LocalStorage) |
| **Wishlist Global** | Persistent Client | Zustand (`persist` middleware) | Saved product IDs array, reactive badges | `aura_wishlist_items` (LocalStorage) |
| **Orders Store** | Server-Authoritative | Server DB (`lib/db/index.ts`) & Zustand mirror | Verified orders, tracking numbers, itemized receipts | Server `data/db.json` + `aura_order_history` |

---

## 3. Directory Layout

```
aura-storefront-web/
├── app/
│   ├── (store)/
│   │   ├── layout.tsx                # Storefront Layout (AnnouncementBar, Header, Drawer, Footer)
│   │   ├── page.tsx                  # Editorial Homepage
│   │   ├── c/[category]/page.tsx     # Category PLP (URL-synced filters)
│   │   ├── p/[slug]/page.tsx         # Product Details Page (Gallery, Variants, Reviews)
│   │   ├── search/page.tsx           # Search Listing View & Empty Recovery
│   │   ├── cart/page.tsx             # Standalone Full Cart View
│   │   ├── wishlist/page.tsx         # User Wishlist View
│   │   ├── login/page.tsx            # Dedicated Customer Sign-In (Credentials + Google)
│   │   ├── register/page.tsx         # Dedicated Customer Registration
│   │   ├── account/page.tsx          # Customer Account & Security Portal
│   │   ├── account/orders/page.tsx   # Verified Order History (User-Isolated)
│   │   ├── order/[id]/confirmation/  # Order Receipt View (Print-optimized)
│   │   ├── about/page.tsx            # Brand Manifesto
│   │   ├── contact/page.tsx          # Customer Care Inquiries
│   │   ├── shipping/page.tsx         # Delivery Policy & Thresholds
│   │   ├── returns/page.tsx          # 30-Day Guarantees
│   │   ├── privacy/page.tsx          # Privacy Policy
│   │   └── terms/page.tsx            # Terms of Service
│   ├── (checkout)/
│   │   ├── layout.tsx                # Secure distraction-free checkout layout
│   │   └── checkout/page.tsx         # 3-Stage Accordion Checkout with Authentication Gate
│   ├── (admin)/
│   │   ├── layout.tsx                # Admin Hub layout
│   │   └── admin/page.tsx            # Live inventory & order monitor (ADMIN Role Guarded)
│   ├── api/
│   │   ├── auth/[...nextauth]/       # Auth.js route handlers (GET, POST)
│   │   ├── auth/register/            # Customer registration API (bcrypt hashing)
│   │   └── orders/                   # Server-authoritative order creation and lookup
│   ├── not-found.tsx                 # Standardized 404 Recovery View
│   ├── error.tsx                     # Global Error Boundary UI
│   ├── robots.ts                     # Search Engine Robots directives
│   └── sitemap.ts                    # Dynamic XML Sitemap generator
├── auth.ts                           # Auth.js NextAuth configuration
├── components/
│   ├── auth/                         # SessionProvider client wrapper
│   ├── ui/                           # Base Primitives (Button, Badge, Input, Sheet, Dialog, Accordion, Skeleton)
│   ├── layout/                       # Header, Footer, MobileNav, AnnouncementBar
│   ├── catalog/                      # CatalogView, CatalogFilterSidebar
│   ├── product/                      # ProductCard, Gallery, VariantSelector
│   ├── cart/                         # CartDrawer, CartLineItem, FreeShippingMeter
│   └── review/                       # ReviewSection, RatingHistogram, ReviewSubmissionModal
├── data/                             # Seed Data (Products, Categories, Reviews, Coupons, Users in BDT)
│   └── db.json                       # Atomic file-backed persistent database store
├── lib/
│   ├── api/products.ts               # Data Access Layer & Typo-Tolerant Search
│   ├── db/                           # Persistent Database DAO & Schema
│   ├── security/                     # Zod validation schemas & sliding-window rate limiter
│   ├── constants.ts                  # Centralized Bangladesh localization constants
│   ├── utils.ts                      # Helpers, formatPrice (৳), ID generators
│   └── analytics.ts                  # Client telemetry event pipeline
├── store/                            # Zustand stores (Cart, Wishlist, Auth, Orders)
└── types/                            # TypeScript interfaces & NextAuth augmentations
```

---

## 4. Purchase Protection & Commerce Flow

```
[Guest Visitor]
      │
      ├─► Browse Catalog & PLPs
      ├─► View PDPs & Magnifier
      ├─► Add to Shopping Bag (`aura_cart_state`)
      └─► Proceed to Checkout (`/checkout`)
            │
            ▼
      [Authentication Check]
            │
            ├─► If Authenticated: Pre-fill Saved Address & Proceed
            │
            └─► If Unauthenticated: Display Authentication Gate
                  │
                  ├─► Option A: Sign In (`/login?callbackUrl=/checkout`)
                  ├─► Option B: Register (`/register?callbackUrl=/checkout`)
                  └─► Option C: Continue with Google OAuth
                        │
                        ▼ (Cart Preserved Intact)
                  Return to `/checkout`
                        │
                        ▼
      [Submit Order]
            │
            ▼
      [Server-Authoritative Validation: POST /api/orders]
            ├─► 1. Authenticate Session (`auth()`) -> 401 if null
            ├─► 2. Rate Limit Check
            ├─► 3. Validate Payload Schema (Zod)
            ├─► 4. Re-calculate Real Prices from Catalog (Zero Client Trust)
            ├─► 5. Verify Variant Stock Availability (Reject Over-Purchasing)
            ├─► 6. Re-calculate Coupon Discounts & Shipping Rules
            ├─► 7. Atomically Deduct Stock
            ├─► 8. Assign Order to `session.user.id` (Enforce Ownership)
            └─► 9. Save Order to Database
                        │
                        ▼
      [Redirect to Order Confirmation `/order/[id]/confirmation`]
```

---

## 5. Security & Authorization Matrix

| Resource | Public | Customer | Operations Admin |
| --- | --- | --- | --- |
| Homepage & Catalog (`/`, `/c/*`, `/p/*`) | Read | Read | Read |
| Search & Autocomplete (`/search`) | Read | Read | Read |
| Shopping Bag & Wishlist (`/cart`, `/wishlist`) | Read/Write | Read/Write | Read/Write |
| Checkout Flow (`/checkout`) | Blocked (Gate) | Read/Write | Read/Write |
| Create Order (`POST /api/orders`) | Denied (401) | Allowed | Allowed |
| Order History (`GET /api/orders`) | Denied (401) | Own Orders Only | Own Orders Only |
| Order Detail (`GET /api/orders/[id]`) | Denied (401) | Own Order (403 if not owner) | All Orders |
| Administrative Hub (`/admin`) | Demo Simulation | Restricted Demo | Full Authorization |
