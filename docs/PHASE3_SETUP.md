# Phase 3 — Private content management system

## What exists

The approved public Student's Blackboard design is unchanged. The new private control center is at `/control-center`.

- Email OTP for **one allowlisted administrator**, 6-digit codes, ten-minute validity, maximum five code attempts, IP/email throttling, and seven-day sessions.
- Server-side, HTTP-only, SameSite=Strict session cookies and an origin check on state-changing requests.
- PostgreSQL-backed editable entries for profile, résumé link, Work (including research), Blogs, internships/experience, achievements, skills, verified credentials, gallery, and roadmap.
- Draft, published, and hidden states. Hidden entries are recoverable. Edits to source-backed starter entries replace the matching item when published, without duplicating it.
- Public page is server-rendered from published changes while retaining the original source-backed starter content. Research remains "Ongoing" unless its entry has a verified venue and paper link.
- Image and PDF upload endpoint, **only if Supabase Storage credentials are configured**. Manual publicly accessible HTTPS URLs also work.

## Requirements

- Node.js 22+
- Hosted PostgreSQL database with a secure connection string (e.g., your managed Postgres instance).
- Verified sender domain and API key with Resend for real email delivery.
- Optional public Supabase Storage bucket for gallery photos, portrait and résumé uploads.
- Secure production app origin (a custom domain or Vercel deployment). **Do not use GitHub Pages for these server routes.** GitHub Pages is static and cannot execute email-OTP/API/database functions.

## Setup

1. Run `db/schema.sql` against your Postgres database as a database owner. Use a restricted database role for the running app.
2. Copy `.env.example` to `.env.local`. Fill in **real** values privately. Never commit `.env.local` or service-role keys.
3. `DATABASE_URL`: PostgreSQL connection string with TLS enabled where supported.
4. `ADMIN_EMAIL`: your exact allowed sign-in email. OTPs will not be emailed to anyone else.
5. `OTP_PEPPER`: a cryptographically random secret (at least 32 characters) used only on the server for OTP and IP hash protection. Preserve it across deployments; rotating it invalidates outstanding codes.
6. `APP_ORIGIN`: the exact origin of the web application, e.g. `http://localhost:3000` in development, `https://your-domain.example` in production (no trailing slash or path).
7. `RESEND_API_KEY` and `OTP_FROM_EMAIL`: configured, verified sender for code delivery.
8. Optional storage: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`. The bucket must be public/readable because portfolio images and résumé URLs are public. Only upload non-sensitive photos/PDFs.
9. With an npm-capable environment: `npm install`, `npm run typecheck`, `npm run test:content`, `npm run test:cms`, `npm run build`, then `npm run dev`.
10. Open `/control-center`, request a code for the allowlisted email, verify, then edit and publish your entries. **There is no development backdoor, default password, or hardcoded OTP.**

## Edit/publish behavior

- The administrator can edit the existing résumé-backed starter items directly. Their edits remain private in Draft until published.
- New entries receive IDs derived from the entry title unless an ID is supplied before first save. The ID remains stable so the UI can match them across updates.
- Hiding a built-in item stores a database tombstone. Do not delete source-backed content manually.
- Published paper records require publication metadata; the form does not independently verify the existence of a paper. Check the venue and paper before publishing.
- The CMS handles content *data*, not the styling/code or database schema. Content is rendered as React text (no arbitrary HTML injection).
- The public portfolio falls back to bundled starter content when no DB connection is configured or the connection fails. Check logs after changing DB credentials.
- Photo replacements keep the same hero layout, with the portrait **beside the heading on mobile and desktop**.
- When changing public email, remember it is distinct from ADMIN_EMAIL, which controls sign-in.

## Security/deployment checklist

- Configure environment variables only in the deployment's secret storage; never commit credentials.
- Verify the real authorized recipient receives OTP email; invalid emails should get the same generic success response.
- Verify expired/incorrect/reused codes fail, rate limits engage, and session cookies are secure in production.
- Verify unauthenticated GET/PUT/DELETE on `/api/admin/records` and upload requests fail.
- Verify cross-site POSTs are rejected and admin pages are not indexed.
- Verify draft/hidden items are absent on the public portfolio; published items become visible after refresh.
- Verify image/PDF upload limits, content signatures, private service key isolation, and public bucket behavior.
- Review the résumé for personal telephone and email details before making it downloadable to the public.
- Configure DB maintenance to prune expired `cms_login_codes`/`cms_sessions` and old `cms_rate_limits` rows.
- Take and test regular database backups; use production TLS and a least-privilege Postgres user.

## Verified tests and remaining live-provider checks

- Passing GitHub Actions production build, content tests, nine CMS unit tests, and unauthenticated Next.js server smoke checks.
- Passing integration tests using disposable PostgreSQL 16 and locally intercepted Resend, covering OTP authorization, sessions, drafts, publishing, hiding, and logout. Read `docs/PHASE4_TEST_REPORT.md` for exact results and run link.
- Not yet tested: real Resend email delivery, deployed HTTPS/OTP, hosted PostgreSQL, Supabase Storage uploads, actual-browser accessibility and mobile tests.
- This is source/CI verification only. **Do not treat the CMS as live or production-ready until real service configuration and tests pass.**
