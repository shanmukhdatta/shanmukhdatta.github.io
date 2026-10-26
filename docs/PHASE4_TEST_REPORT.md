# Phase 4 — Automated verification report

**Latest verified source:** `fda1b0b0c73f0bfd88fbc8129eebcb638fc0cb92` on `main`
**Latest GitHub Actions run:** https://github.com/shanmukhdatta/shanmukhdatta.github.io/actions/runs/40267121320
**Result:** All three jobs passed: production build/smoke, PostgreSQL+mock OTP integration, and real-browser verification.

## CI: production build and no-credentials smoke tests

- npm dependencies installed in the runner.
- Source-backed content and static assets checked.
- 9 CMS schema/merge unit tests passed.
- Strict TypeScript check passed.
- Next.js production build succeeded.
- Built production server served the public homepage and content endpoint.
- Protected admin endpoints rejected unauthenticated access without configured credentials.
- Originless OTP request was rejected.
- Cropped hero photograph and real résumé PDF served as expected.

## CI: isolated PostgreSQL and mocked email integration

A disposable PostgreSQL 16 service was started and `db/schema.sql` was applied. Next.js was started against that database using a generated local OTP pepper, a disposable admin address, and a CI-only mock of the Resend API. No real email, account, deployed site or production database was accessed.

Verified in the running production-mode Next.js server:

1. Unauthenticated session and admin-route protection.
2. Origin checking for sensitive requests.
3. Non-admin addresses get a generic response but no code.
4. Valid admin address triggers mock email delivery.
5. Invalid OTP rejected; correct OTP creates HTTP-only, SameSite=Strict, Secure session cookie.
6. OTP replay rejected.
7. Authenticated records listing succeeds.
8. Cross-origin authenticated mutations rejected.
9. Draft blog creation remains private.
10. Publishing makes content visible in both the public API and server-rendered homepage.
11. Stale content versions fail with HTTP 409.
12. Hiding published content removes it from public output.
13. Invalid "published research" records are rejected.
14. Uploading without configured storage fails closed.
15. Logging out invalidates the session.

## CI: real Chromium browser verification

The Next.js production server was launched without private credentials and tested with Playwright Chromium at desktop (1280 × 900) and mobile (390 × 844) widths. Checks passed for:

- Correct hero photo loading, with photo to the right of the introduction and no horizontal overflow at either tested width.
- Résumé download link and interactive green internship/experience carousel.
- Research filters and empty Published archive (no false publication claims).
- Keyboard activation and Escape-to-dismiss project detail dialog.
- About and Blogs navigation/content.
- No browser JavaScript errors, including in the reduced-motion setting.

The first browser run discovered a reduced-motion welcome hydration mismatch (React error #418). The source was corrected using an SSR-safe mount flag in the multilingual introduction, then all browser tests passed.

## Remaining gates before production readiness

- Configure a **real hosted PostgreSQL** instance, perform migrations as a privileged operator, and confirm backups and database TLS.
- Set real administrator email and strong `OTP_PEPPER` in the server's private environment.
- Verify **real Resend delivery**, sender-domain verification, OTP expiry/rate-limit behavior, and cross-browser cookie handling on an HTTPS deployment.
- If uploads are required, configure and test **Supabase Storage** against image/PDF file and access rules.
- Browser desktop/mobile layout and selected keyboard interactions pass in CI. Full WCAG accessibility audits, assistive-technology/screen-reader testing, and additional device breakpoints remain.
- Audit personal information in the résumé before public exposure.
- Establish a reproducible `package-lock.json` and switch from `npm install` to `npm ci` in CI.
- Deploy only with explicit instruction. GitHub Pages cannot run these server APIs.

**Interpretation:** Source, production build and isolated CMS integrations passed in CI. This does not mean hosted services or live administration have been validated. These are explicitly untested.
