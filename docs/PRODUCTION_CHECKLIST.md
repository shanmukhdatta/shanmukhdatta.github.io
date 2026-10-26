# Production Readiness Checklist — Student's Blackboard Portfolio

Before publishing changes to production or sharing the portfolio publicly, verify each item against this checklist.

---

## 1. Codebase & CI Verification

- [x] **Reproducible Lockfile**: `package-lock.json` committed to repository; `npm ci` installs cleanly in <60 seconds.
- [x] **TypeScript Strict Check**: `npm run typecheck` passes with 0 errors.
- [x] **Content Verification**: `npm run test:content` verifies all starter assets, images, and résumé documents exist.
- [x] **CMS Core Tests**: `npm run test:cms` passes all 9 tests covering drafts, publications, hiding tombstones, and validation.
- [x] **Next.js Production Build**: `npm run build` succeeds using Turbopack with 0 warnings.
- [x] **GitHub Actions Workflow**: Updated `.github/workflows/phase4-ci.yml` using `npm ci`.

---

## 2. Security & Credentials Isolation

- [x] **No Secrets in Git**: Verified `.env.local` is gitignored; `.env.example` contains only generic placeholders.
- [x] **Row Level Security (RLS)**: Active on `cms_records`, `cms_login_codes`, `cms_sessions`, and `cms_rate_limits`.
- [x] **Serverless Connection Pooling**: PostgreSQL pooler uses port `6543` with `globalThis` caching to prevent connection exhaustion.
- [x] **Origin Enforcement**: Sensitive state-changing APIs enforce origin matching against `APP_ORIGIN` / `VERCEL_URL`.
- [x] **Session Security**: Session tokens are hashed with SHA-256 in the database; cookies are `HttpOnly`, `SameSite=Strict`, and `Secure` in production.
- [x] **HTTP Security Headers**: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` configured in `next.config.ts`.
- [x] **Storage Key Isolation**: Supabase `service_role` key is strictly kept on the server; client never receives write keys.

---

## 3. Database & Media Storage

- [x] **Hosted PostgreSQL**: Live Supabase instance provisioned in `ap-northeast-2`.
- [x] **All Tables Created**: `cms_records`, `cms_login_codes`, `cms_sessions`, `cms_rate_limits` verified present.
- [x] **Public Storage Bucket**: `portfolio-media` created with public read permissions.
- [x] **Structured Folders**: Uploads organized by entity (`profile/`, `gallery/`, `projects/`, `research/`, `credentials/`, `resume/`).

---

## 4. Authentication & Rate Limiting

- [x] **Allowlisted Administrator**: Only `shanmukhadattaboda069@gmail.com` receives OTP codes. Non-admin addresses get a generic response with no email sent.
- [x] **Brute-Force Protection**: 5 maximum attempts per code; IP and email rate limits enforced via atomic upserts.
- [x] **Code Expiration**: 6-digit codes expire after 10 minutes; single-use (consumed immediately upon login).

---

## 5. Visual Design Preservation

- [x] **Visual Identity**: Blackboard/notebook aesthetic preserved with white paper background, grid details, and black geometric borders.
- [x] **Hero Photograph Position**: Positioned to the right of the heading on desktop and mobile.
- [x] **Navigation & Sections**: Home, Work, Blogs, About Me intact.
- [x] **Research Integrity**: Ongoing research kept separate from published papers; published research requires verified venue and paper URL.
- [x] **Responsive Layout**: Verified in desktop and mobile viewports with no horizontal scroll overflow.

---

## 6. Pre-Launch Sanity Test in Vercel

- [ ] Vercel Preview URL opens without console errors.
- [ ] `/` displays real profile data and projects.
- [ ] `/resume/Shanmukh_Datta_Resume.pdf` opens correctly.
- [ ] `/control-center` sends real OTP to admin inbox.
- [ ] Admin signs in, saves a draft, publishes, and confirms it renders on homepage.
- [ ] Admin logs out and confirms session cookie is cleared.
