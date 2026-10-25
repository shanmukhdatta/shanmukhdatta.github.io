# Phase 3 implementation checklist

- [x] Backend API for request/verify OTP, admin session, logout
- [x] HTTP-only SameSite session cookie and per-request authorization
- [x] Database schema for records, OTPs, sessions, rate limits
- [x] Published/draft/hidden public content projection, built-in merge support
- [x] Private Control Center form for all approved content types
- [x] Gallery and résumé upload API using optional external storage
- [x] Research published-paper guard requiring venue and paper link
- [x] Source-backed default content; no invented achievements or publications
- [x] No new GitHub Pages workflow or deployment
- [ ] Connect live DATABASE_URL / ADMIN_EMAIL / RESEND credentials (user-controlled)
- [ ] Configure external storage credentials if media uploads are wanted
- [ ] End-to-end Next.js runtime / DB / OTP / email tests with real providers
- [ ] Run a Next.js production build after npm connectivity is available
- [ ] Publish to a serverless-compatible host when requested

**This phase is code-complete as a scaffold; production readiness is not yet verified.**
