# Product Requirements Document (/goal PRD)

Project Identifier: PRD-COMMERCE-2026-V1
Project Title: Aura Minimalist E-Commerce Platform
Target Platform: Google Antigravity (Agentic Software Engineering System)
Target Environment: Next.js (App Router) / Vercel Edge Runtime
Status: Fully Implemented, Secured & Verified

## 1. Product Overview
- Production Brand Name: Aura Living (Aura Home & Apparel)
- Internal Repository / Machine Name: `aura-storefront-web`
- Architecture: High-Fidelity D2C E-Commerce System with persistent cart, session-backed authentication, server-authoritative checkout validation, and Bangladesh-market localization.
- Stack: Next.js 16 (App Router, Turbopack), TypeScript (Strict), NextAuth v5 (Auth.js), bcryptjs, Tailwind CSS, Zustand, Accessible UI Primitives, Lucide React.
- Currency & Locale: Bangladeshi Taka (BDT / ৳) with zero decimal fraction presentation and `en-BD` numeric grouping.
- Value Proposition: Transparent costs, sub-100ms URL-synchronized filtering, 3-stage checkout with Bangladesh address form, ৳5,000 free shipping threshold, authenticated order protection, role-based admin sandbox protection, designed with WCAG 2.2 accessibility guidelines in mind, and deterministic JSON-LD schema SEO.

## 2. Authentication & Authorization Architecture
- Roles: `CUSTOMER` (default for registered and OAuth users) and `ADMIN` (administrative operations persona).
- Credentials: Email + Password with bcrypt (cost factor 12) hashing.
- OAuth: Google OAuth 2.0 integration (scoped strictly to `openid`, `email`, `profile`).
- Checkout Gate: Guests can freely browse, search, and add items to cart; order placement strictly requires authenticated session. Cart state is 100% preserved during authentication.
- Account Protection: Customers can only query, inspect, and track their own orders (`/account/orders`, `/api/orders/[id]`). Horizontal privilege escalation is strictly prevented.
- Admin Protection: `/admin` is locked via server-side layout and component role guards; guests are redirected to `/login`, and customers receive a 403 Access Denied screen.
- Payment & Order Security: Server recalculates line item prices strictly from trusted catalog data (ignoring client-submitted prices), enforces real-time variant stock limits, and verifies coupons on the server.
