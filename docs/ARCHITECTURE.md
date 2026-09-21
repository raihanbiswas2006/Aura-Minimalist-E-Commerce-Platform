# Architecture Specification: Aura Minimalist E-Commerce Platform

## 1. System Overview

```
+------------------------------------------------------------------------+
|                            USER BROWSER                                |
|  - Next.js Client Components (React 19)                                |
|  - Local-First Client State (Zustand: Cart, Wishlist, Auth, Orders)    |
|  - Form Management & WCAG 2.2 AA Inline Validation                     |
+------------------------------------------------------------------------+
                                    │
                                    ▼
+------------------------------------------------------------------------+
|                     NEXT.JS APP ROUTER ENGINE                          |
|  - React Server Components (RSC: Catalog, Metadata, SEO)               |
|  - Dynamic Route Handlers & Turbopack Compilation                      |
|  - Image Optimization Pipeline (`next/image`, AVIF/WebP)               |
+------------------------------------------------------------------------+
                                    │
                                    ▼
+------------------------------------------------------------------------+
|                     MOCK SEED & SERVICE LAYER                          |
|  - Static Relational TypeScript Mock Data (`/data/*`)                  |
|  - Data Access Object (DAO) Abstraction Layer (`/lib/api/*`)           |
|  - LocalStorage Persistence Adapter (`/store/*`)                       |
+------------------------------------------------------------------------+
```

## 2. State Management Taxonomy

| State Type | Scope | Technology | Example Entities | Storage Key |
| --- | --- | --- | --- | --- |
| **Server State** | Server / Build | Next.js Server Components | Product catalogs, category definitions, SEO metadata | In-memory |
| **URL State** | Browser Address | `next/navigation` (`useSearchParams`) | Active search queries (`?q=`), applied filters (`?color=`), sort orders | URL |
| **Cart Global** | Persistent Client | Zustand (`persist` middleware) | Line items, coupon codes, shipping threshold meter | `aura_cart_state` |
| **Wishlist Global** | Persistent Client | Zustand (`persist` middleware) | Saved product IDs array, reactive badges | `aura_wishlist_items` |
| **Auth Global** | Persistent Client | Zustand (`persist` middleware) | Demo active persona (Marcus, Elena, Guest), saved addresses | `aura_auth_state` |
| **Orders Global** | Persistent Client | Zustand (`persist` middleware) | Generated order receipts, tracking numbers, status flow | `aura_order_history` |

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
│   │   ├── account/page.tsx          # Simulated Customer Portal
│   │   ├── account/orders/page.tsx   # Historical Orders & Tracking
│   │   ├── order/[id]/confirmation/  # Order Receipt View (Print-optimized)
│   │   ├── about/page.tsx            # Brand Manifesto
│   │   ├── contact/page.tsx          # Customer Care Inquiries
│   │   ├── shipping/page.tsx         # Delivery Policy & Thresholds
│   │   ├── returns/page.tsx          # 30-Day Guarantees
│   │   ├── privacy/page.tsx          # Privacy Policy
│   │   └── terms/page.tsx            # Terms of Service
│   ├── (checkout)/
│   │   ├── layout.tsx                # Secure distraction-free checkout layout
│   │   └── checkout/page.tsx         # 3-Stage Accordion Guest Checkout Flow
│   ├── (admin)/
│   │   ├── layout.tsx                # Admin Hub layout
│   │   └── admin/page.tsx            # Live inventory & order monitor
│   ├── not-found.tsx                 # Standardized 404 Recovery View
│   ├── error.tsx                     # Global Error Boundary UI
│   ├── robots.ts                     # Search Engine Robots directives
│   └── sitemap.ts                    # Dynamic XML Sitemap generator
├── components/
│   ├── ui/                           # Base Primitives (Button, Badge, Input, Sheet, Dialog, Accordion, Skeleton)
│   ├── layout/                       # Header, Footer, MobileNav, AnnouncementBar
│   ├── catalog/                      # CatalogView, CatalogFilterSidebar
│   ├── product/                      # ProductCard, Gallery, VariantSelector
│   ├── cart/                         # CartDrawer, CartLineItem, FreeShippingMeter
│   └── review/                       # ReviewSection, RatingHistogram, ReviewSubmissionModal
├── data/                             # Seed Data (Products, Categories, Reviews, Coupons, Users)
├── lib/
│   ├── api/products.ts               # Data Access Layer & Typo-Tolerant Search
│   ├── utils.ts                      # Helpers, formatters, ID generators
│   └── analytics.ts                  # Client telemetry event pipeline
├── store/                            # Zustand stores (Cart, Wishlist, Auth, Orders)
└── types/                            # TypeScript interfaces matching PRD Section 31
```
