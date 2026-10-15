# Antigravity acceptance test — complete shanXAI V2

## Get the current feature branch

```powershell
git clone https://github.com/shanmukhdatta/shanmukhdatta.github.io.git
cd shanmukhdatta.github.io
git fetch origin
git switch redesign/shanxai-portfolio-v2
npm install
npm run test
npm run typecheck
npm run build
npm run dev
```

Visit `http://localhost:3000`. Before configuring external services, the public website MUST remain browsable from bundled facts; admin requests and server mail must fail **safely** (no pretend login/message-sent result).

## Paste this prompt into Antigravity

> Act as senior full-stack engineer, UX QA, accessibility and security tester. Clone and switch to `redesign/shanxai-portfolio-v2`. Review `README.md`, `docs/REDESIGN_PLAN.md`, `db/schema.sql`, `app/api/`, `components/admin/`, and the original design intent. Run `npm run test`, `npm run typecheck`, `npm run build`; fix reproducible failures in a separate commit **on the existing redesign branch** (not main). Start the local app and use real browser sessions at desktop 1440px, tablet 820px and mobile 390px. Test Quick and Explore modes, first-visit intro/skip/replay, keyboard + mobile menu, theme, signal cursor (desktop only), sound disabled by default, gallery fallback, road/scooter, interactive chalk, skill filters, research lab, project carousel/swipe, 29 case studies and complete public directory, command palette and all links. Test reduced motion. Confirm no academic-performance score fields appear anywhere in the website or metadata. Confirm private repository entries are absent. Check accessibility (WCAG AA keyboard/focus/contrast), no horizontal overflow, no console errors and basic page load/performance. For backend, create a disposable Supabase/Resend test environment if authorized and configured **locally without revealing secrets**; test OTP access control/expiry/rate limits, draft vs. published revisions, project wizard publishing a new slug, media and PDF upload MIME verification, real email receipt, inbox retrieval, and Maya provider streaming versus offline fallback. Test failure states when all keys are missing. Never assume services are configured or claim delivery without real provider acceptance. Produce actual screenshots, route-link checks, an issue list, commands/logs and evidence of each pass/fail. Do not merge to main or deploy production.

## Publishing acceptance criteria

- All original public scenes are navigable and usable on touch, pointer and keyboard; motion respects user preference.
- Actual research and project descriptions are honest: Soochana AI and RiskPulse AI are distinct, Voice Doctor AI is not falsely described as validated medical guidance, ChronoMind V2 is correctly staged, facial-skin research and DermaLens platform are cross-linked but separate.
- All 29 curated projects and the 71-repository public directory remain findable; no private repository names or score fields leak through public routes, search, metadata or Maya.
- All case study slugs load directly on refresh, including **new projects published in the CMS**.
- Admin session cannot be forged; one-time code is short-lived and owner-only. OTP emails actually arrive; rate limits resist repeated attempts. Draft edits stay private; publish updates visible pages; revision conflicts produce `409`.
- File upload rejects non-image masquerades and oversized files; published images are publicly accessible only after the owner uploads approved media.
- Contact messages actually arrive from the verified Resend sender and show in private inbox; delivery errors display failures.
- Maya never uses client-supplied facts, acknowledges unknowns, and handles disconnected Groq gracefully.
- SEO, mobile navigation, focus handling and structured content are sound; no errors on deploy preview.

## Status before local integration

Static content and automated source checks can run without any external credentials. Real Supabase, Resend, Groq, production Vercel and domain checks remain unverified until the owner connects them. The existing live website on `main` must not be modified until approved.

## Verify this completion commit

```sh
git checkout redesign/shanxai-portfolio-v2
git pull --ff-only
npm ci
npm run check
```

`check` runs the content tests, TypeScript, production build and local production HTTP smoke checks. The smoke script starts and stops its own server with provider credentials disabled. It does not send email or call AI providers.

For the live owner backend, rerun the idempotent `db/schema.sql` migration in the intended private Supabase project. New functions `save_portfolio_document` and `consume_portfolio_otp` are required by the updated routes. After configuring `.env.local` from `.env.example`, test two editor sessions saving the same revision: exactly one must succeed; the other must return 409. Verify that two concurrent attempts to consume one valid login code yield at most one authenticated session.

Visually review Quick/Explore, narrow mobile layout, Journey detail notes, intro skip/replay, Escape and Tab in overlays, project filters, carousel arrow keys, chalk drawing, contact error fallback, and Maya fallback. This environment verified production HTTP behavior; it did not certify visual browser or external-service behavior.

## Demo and full-plan audit pass

Read `docs/PLAN_AUDIT.md` before treating the project as fully complete. It lists implemented, partial, missing and externally unverified requirements.

- `/demo/` previews fictional editing, publication, revision restore, inbox and contact signal states without authenticating or writing real content.
- Gallery and resume are local labeled demo assets. Replace them before presenting the gallery as personal photography or submitting the PDF as a CV.
- `npm run test:interactions` runs component and API simulations.
- `npm run test:database` applies the actual SQL in an embedded PostgreSQL engine; no Supabase credentials are used.
- Apply the updated `db/schema.sql` to enable private revision history and backup export.
- `docs/link-audit.json` records outbound link reachability. One demo endpoint timed out; HTTP 200 alone does not validate the target application's behavior.

## Remaining-feature completion pass

New source includes Writing/Article and research detail routes; editable SEO/OpenGraph/local redirects, Intro and published Maya knowledge; skill proof/status records; semantic chalkboard edges; winding road/scooter path; visual carousel neighbors; permanent resume/writing links; long-press owner discovery; expanded wizard with mandatory review; private 76-slot editorial registry; and architecture text downloads.

`npm run lint` and `npm run format:check` are enforced. `npm run test:e2e` is run on a GitHub runner after installing Chromium. It captures desktop/mobile Explore screenshots, exercises critical public/demonstration flows, runs axe WCAG checks, and enforces responsive bounds, initial JavaScript transfer and DOM-readiness budgets. The final browser artifact is linked from the workflow run. Actual phone hardware, paper/role evidence, provider accounts and launch remain owner release checks.
