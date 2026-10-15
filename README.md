# shanXAI V2 — Research Portfolio & Personal Control Center

**Boda Shanmukh Datta** · research, applied AI, AI systems and open-source engineering.

Full-stack Next.js App Router redesign on branch `redesign/shanxai-portfolio-v2`. **Do not merge to `main` until the live preview, source claims, and authentication/email configuration are tested.** The legacy GitHub Pages site stays unaffected while this branch is under review.

## Features implemented in code

- **Quick and Explore modes.** Skippable intro, hero with GitHub avatar, original black/silver/amber design system, responsive about gallery, skill toolkit, scroll-driven journey landscape, chalkboard with topic drawers and erasable drawing, research lab, featured project carousel, responsive contact signal/terminal, bookend footer.
- **Project evidence.** 29 seeded case studies + 71 public repositories. Each project has its own dynamic route, architecture schematic, evidence and limits, optional figures, screenshots, verified metrics and linked research. New project slugs can be published from the CMS without redeploying the application.
- **Site conveniences.** Command palette (`Ctrl/Cmd+K`), signal cursor on fine-pointer devices, keyboard controls, low-motion fallbacks, opt-in interface sound, light/dark mode, interactive contact terminal and mobile navigation.
- **Maya.** Server-only portfolio fact retrieval from published content, optional streaming Groq API, local search fallback when disabled. Never trusts visitor-supplied "facts".
- **Secure owner Control Center.** Hidden double-click on logo or direct `/control-center/` route. One-time email login (fixed `ADMIN_EMAIL` in server env), signed httpOnly cookie, rate limits, short expiry and retry limits. Draft/publish/restore with revision conflict checks, 12-step project wizard, JSON content editors, media uploads, inbox and live draft preview. The logo shortcut alone grants **no** permissions.
- **Real contact form.** Server-side verification and throttling, Resend transactional email, stored inquiry inbox, no false "sent" state, email-app fallback when backend is not configured.

> This is a **code implementation**, not proof that third-party services are configured. The owner must provision the database, verified email sender and (optionally) AI API key, then run end-to-end testing. No credentials are included.

## Run locally

Requires Node.js 22+.

```bash
npm install
npm run test
npm run typecheck
npm run build
npm run dev
```

Open `http://localhost:3000`. Public portfolio pages work with the bundled data when backend variables are missing. CMS login, admin data persistence, media uploading, real contact delivery and live AI need external credentials.

## Complete free-tier integration guide

1. Create a **new Supabase project** (PostgreSQL + Storage). Run `db/schema.sql` in its SQL editor. Create a **public** Storage bucket named `portfolio-media` for approved non-sensitive web assets. Do not store private media there.
2. Configure **Resend** with an email/domain you are allowed to send from. Verify the sending domain and use that identity in `MAIL_FROM`.
3. Deploy this whole repository as one **Next.js** application on Vercel, with **Root Directory = repository root** and framework = Next.js. Do **not** use the old `proxy/` root directory from the legacy static portfolio. Set the environment variables described below through Vercel Settings, not through Git.
4. In Vercel environment settings provide `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `SESSION_SECRET` (generate a high-entropy random secret), `RESEND_API_KEY`, `MAIL_FROM`, and `CONTACT_TO_EMAIL`. Optionally set `GROQ_API_KEY` and `GROQ_MODEL`, and set `NEXT_PUBLIC_SITE_URL` to your **actual canonical** Vercel/custom URL. Never put a service-role key, Resend key, session secret or Groq key in `NEXT_PUBLIC_*`.
5. After deployment, visit `/control-center/` on the **same** site origin, send your OTP, publish verified text, add approved portfolio photos and project screenshots, and connect a public resume only when ready.
6. Run `docs/TESTING_HANDOFF.md` in Antigravity and review the published content, links, mobile UI, accessibility, security checks and external delivery.

**Hosting choice:** The complete CMS and dynamically published project routes require a Node.js runtime. GitHub Pages is static-only, so the previous Pages workflow is intentionally disabled on this v2 feature branch. Keep the existing live `main` website until a working Vercel preview has been signed off and the domain cutover is planned.

### Environment variable example

See `.env.example` for names. Copy it to `.env.local` for local integration testing and fill it **on your own machine**, not in a GitHub issue, chat message or commit. The application **does not** provide pretend sending, login or database persistence if you leave secrets unset. Maya falls back to read-only catalog responses.

## Database and confidentiality

- Data is sourced from `content/` (version-controlled facts) until the owner publishes new documents from the Control Center. CMS documents have private `draft` and public `published` JSON. Unpublished content is never returned by `/api/content` or Maya.
- The application is designed for **one authorized owner**. Server-side service role access is required only in API handlers. All admin routes check signed httpOnly sessions and reject foreign `Origin` values on writes.
- The SQL rate-limit function is atomic across serverless processes. Media image signatures are checked, 4 MB uploads are capped, and filenames are generated rather than trusted.
- Add an independent infrastructure security audit before production. In particular, validate session handling, sign-in edge cases, permissions, abuse controls and email deliverability on the real hosting provider.
- All projects must retain their accurate stages and caveats. Unpublished experiments are not described as publication acceptances or clinically validated tools.

## Structure

```text
app/               Next.js page routes + real server APIs
components/        Public UI, visual scenes, assistant, control center
content/           Seed portfolio data and public GitHub directory
lib/               Server security, database, published content, validation
 db/schema.sql      Supabase Postgres tables and shared throttling function
 docs/              Design spec and Antigravity test handoff
 scripts/           Content checks
 tests/             Cross-module contract tests
```

## Release status

**Code pushed to feature branch.** CI validates content, TypeScript and full-stack production build. Full real integration and browser QA must be verified by the owner before publication. The draft PR protects `main` from untested changes.
