# Deployment & Operations Guide: Aura Living Platform

This document describes how to deploy the **Aura Living Minimalist E-Commerce Platform** to Vercel or any modern Node.js edge runtime, configure production environment variables, and manage authentication credentials.

---

## 1. Quick Vercel Deployment

### Step 1: Connect Repository
1. Push your repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **Add New Project** and import `aura-storefront-web`.
3. Framework Preset will automatically detect **Next.js**.

### Step 2: Configure Environment Variables
Under **Project Settings > Environment Variables**, add:

| Variable Name | Required | Example / Description |
|---|---|---|
| `AUTH_SECRET` | **Yes** | 32+ character cryptographic secret. Generate with `openssl rand -hex 32` or `npx auth secret`. |
| `AUTH_URL` | **Yes** | Canonical deployment origin, e.g., `https://your-aura-domain.vercel.app` (or custom domain). |
| `GOOGLE_CLIENT_ID` | Optional | OAuth 2.0 Client ID from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | Optional | OAuth 2.0 Client Secret from Google Cloud Console. |
| `DATABASE_URL` | Optional | Custom PostgreSQL / LibSQL database connection string. Defaults to embedded file repository at `data/db.json`. |

### Step 3: Trigger Build
Click **Deploy**. Next.js will execute `next build` with Turbopack, compile all 23 static and dynamic routes, and assign your deployment URL.

---

## 2. Google OAuth 2.0 Configuration Guide

To enable **"Continue with Google"** authentication:

1. Visit the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Create or select a Google Cloud Project.
3. Configure the **OAuth Consent Screen**:
   - User Type: **External**
   - App Name: `Aura Living`
   - User Support Email: your contact email
   - Scopes requested: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid` (strictly minimal required identity scopes).
4. Create **OAuth Client ID**:
   - Application Type: **Web application**
   - Name: `Aura Living Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local development)
     - `https://your-aura-domain.vercel.app` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (local)
     - `https://your-aura-domain.vercel.app/api/auth/callback/google` (production)
5. Copy the generated **Client ID** and **Client Secret** into your `.env.local` or Vercel Environment Variables:
   ```bash
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

*Note: If Google OAuth credentials are not provided, the platform gracefully retains full email/password registration, password authentication, and pre-seeded demo personas.*

---

## 3. Pre-Seeded Demonstration Personas

For evaluator testing and client presentations, the platform includes pre-seeded accounts configured with bcrypt-hashed credentials (`AuraLiving2026!`):

| Role | Persona Name | Email | Password | Scope & Purpose |
|---|---|---|---|---|
| **CUSTOMER** | Arif Rahman | `arif@demo.aura` | `AuraLiving2026!` | Dhaka customer persona with pre-saved address and checkout capability. |
| **CUSTOMER** | Nusrat Jahan | `nusrat@demo.aura` | `AuraLiving2026!` | Chattogram customer persona. |
| **ADMIN** | Operations Admin | `admin@demo.aura` | `AuraLiving2026!` | Authorized to access `/admin` simulation hub, mutate inventory stock, and monitor orders. |

*Unauthenticated guests or customers who attempt to access `/admin` will be redirected to login or presented with an accessible 403 Access Denied screen.*

---

## 4. Local Build & Verification Commands

Before deploying or pushing updates, run the project's automated verification suite:

```bash
# 1. Run TypeScript strict type-checking
npx tsc --noEmit

# 2. Run Comprehensive Security & Auth Suite (45 automated tests)
node scripts/test-auth-security.mjs

# 3. Run UX & Micro-Interaction Contract Suite (21 automated tests)
node scripts/verify-ux.mjs

# 4. Compile optimized production build
npm run build
```

---

## 5. Security & Privacy Guarantees

* **Zero Plaintext Passwords:** All credentials are hashed using `bcrypt` (cost factor 12) before storage.
* **Server-Authoritative Pricing:** Line item pricing and discounts are derived strictly from the catalog on the server. Client-submitted prices are discarded.
* **Strict Order Ownership Isolation:** Orders and receipts are strictly bound to `session.user.id`. Access to `/account/orders` and `/order/[id]/confirmation` prevents horizontal privilege escalation.
* **Security Headers:** Strict Content Security Policy (`CSP`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security` (`HSTS`) are enforced via `next.config.ts`.
* **Demo Payment Sandbox:** Transactions are purely simulated (Cash on Delivery, bKash Demo, Nagad Demo, Rocket Demo). No real financial processing or credential harvesting occurs.
