# Deployment Guide — Student's Blackboard Portfolio

This guide covers deploying the Next.js portfolio application to **Vercel** with **Supabase PostgreSQL**, **Supabase Storage**, and **Resend Email OTP**.

> **Important**: This application requires serverless backend execution for authentication, PostgreSQL pooling, and API handling. **Do not deploy this repository to static hosts like GitHub Pages.**

---

## 1. Architecture Overview

| Component | Provider / Technology | Purpose |
|---|---|---|
| **Frontend & API Routes** | Next.js (App Router, Turbopack, React 19, TypeScript) | Server-rendered portfolio, dynamic CMS routes |
| **Hosting** | Vercel Serverless Functions | Production web hosting and edge routing |
| **Database** | Supabase PostgreSQL (Port 6543 Supavisor Pooler) | Storage for editable CMS entries, sessions, rate limits |
| **Media Storage** | Supabase Storage (`portfolio-media` bucket) | Uploads for portrait, projects, gallery, certificates, résumé |
| **Admin Authentication** | Custom 6-Digit Email OTP + Resend | Passwordless, brute-force protected admin login |

---

## 2. Step-by-Step Vercel Deployment

### Step 2.1: Push Implementation Branch to GitHub
Make sure all your latest commits are pushed to your GitHub repository:
```bash
git push -u origin implement/integration-deployment
```

### Step 2.2: Import Project in Vercel
1. Log in to [https://vercel.com](https://vercel.com) using your GitHub account.
2. In the dashboard, click **Add New…** → **Project**.
3. Select your repository: `shanmukhdatta/shanmukhdatta.github.io` (or click **Import**).
4. Configure Project Settings:
   * **Project Name**: `portfolio` (or `shanmukhdatta`)
   * **Framework Preset**: Next.js
   * **Root Directory**: `./` (default)
   * **Build Command**: `npm run build` (default)
   * **Install Command**: `npm ci` (default)

### Step 2.3: Configure Environment Variables
Expand the **Environment Variables** section before deploying. Add the following keys (set for both **Production** and **Preview** environments):

| Variable Name | Value Description | Example / Notes |
|---|---|---|
| `DATABASE_URL` | Supabase Transaction Pooler URI | `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres` |
| `APP_ORIGIN` | Your Vercel domain(s) | `https://your-project.vercel.app` (or custom domain) |
| `ADMIN_EMAIL` | Authorized administrator email | `shanmukhadattaboda069@gmail.com` |
| `OTP_PEPPER` | Cryptographic secret for OTP hashing | 64-character random hex string |
| `RESEND_API_KEY` | Resend API key | `re_...` |
| `OTP_FROM_EMAIL` | Verified sender or onboarding sender | `Portfolio OTP <onboarding@resend.dev>` |
| `SUPABASE_URL` | Supabase project URL | `https://[project-ref].supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role secret key | `eyJhbGciOi...` |
| `SUPABASE_STORAGE_BUCKET` | Public storage bucket name | `portfolio-media` |

> **Note on DATABASE_URL in Vercel UI**: In the Vercel dashboard inputs, you enter your actual unescaped password directly (e.g. `$`, `@`, etc.), as Vercel does not apply shell variable expansion.

### Step 2.4: Deploy Preview & Verify
1. Click **Deploy**.
2. Vercel will run `npm ci` and `next build` using the committed `package-lock.json`.
3. Once completed, Vercel provides a preview URL: `https://[project]-preview.vercel.app`.
4. Open the preview URL and verify:
   * Public homepage renders all starter projects, research, and experiences.
   * Hero image and résumé PDF download link work.
   * Navigate to `/control-center` and request an OTP to confirm database connectivity and Resend delivery.

### Step 2.5: Promote to Production & Custom Domain
1. When satisfied with the preview, merge the pull request to `main`.
2. In Vercel Settings → **Domains**, add your custom domain (e.g. `shanmukhdatta.com`).
3. Add the DNS records provided by Vercel:
   * For Apex domain: `A` record pointing to `76.76.21.21`
   * For Subdomain (`www`): `CNAME` pointing to `cname.vercel-dns.com`
4. Update `APP_ORIGIN` in Vercel Environment Variables to include your custom domain:
   ```text
   APP_ORIGIN=https://shanmukhdatta.com,https://portfolio.vercel.app
   ```
5. Trigger a redeploy to apply the updated origin.

---

## 3. Maintenance & Periodic Tasks

### Expired OTP and Session Cleanup
To keep database tables lean and prune old sessions/OTPs:
```bash
node scripts/db-cleanup.mjs
```
Or run `db/cleanup.sql` directly in the Supabase SQL editor.
