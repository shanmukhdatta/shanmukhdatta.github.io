# shanXAI — Antigravity continuation and acceptance brief

## Paste this entire file into Antigravity

Act as my lead full-stack engineer, interaction designer and QA engineer. Complete and validate my existing shanXAI portfolio while preserving my original concept. Work in `https://github.com/shanmukhdatta/shanmukhdatta.github.io`, branch `redesign/shanxai-portfolio-v2`. Pull the latest branch before editing. Record the exact starting and final commit. Preserve local changes if the checkout already exists. Do not merge main, change DNS or deploy production in this task.

I will supply service credentials locally. Use them only through ignored `.env.local`; never put credentials, login codes, private messages or session cookies in Git, screenshots, reports, browser bundles or chat output. Ask me only for a required missing configuration or an actual design decision; continue independent work while waiting.

## 1. Read the source of truth

Read `README.md`, `docs/PLAN_AUDIT.md`, `docs/REDESIGN_PLAN.md`, `docs/IMPLEMENTATION_MATRIX.md`, `docs/LAUNCH_RUNBOOK.md`, `.env.example`, `db/schema.sql`, `package.json`, `playwright.config.ts`, and the affected application code. The newest PLAN_AUDIT supersedes old foundation-only status paragraphs. Treat code presence, automated verification, live integration and visual acceptance as separate statuses. Eight deeper specifications referenced in the original material were not supplied: do not invent their contents.

## 2. Preserve this design direction

The goal is a distinctive, polished portfolio suitable for competitive design review. An award is an aspiration, never a guaranteed outcome. Do not replace it with a generic card-template portfolio.

- Warm black, silver typography and restrained signal amber; coherent light theme. Large silver name, portrait/neural constellation, research CTA and currently-working line.
- Skippable/replayable multilingual introduction; motion and optional sound must respect preferences. Sound stays off by default.
- **Quick:** fast evidence-first recruiter/mentor experience: projects, research, background, toolkit and contact. Hide the detailed My Mind scene.
- **Explore:** hero → personal gallery → skills orbit/proof graph → winding Journey road → cream wall/green My Mind chalkboard → Research Lab → sliding projects → traffic-signal contact/terminal → “Stop Thinking. Start Doing.”
- Journey: road-following scooter at every viewport, trees/signs/day cycle, milestone filters and source dialogs. No sideways overflow or unreadable labels.
- My Mind: meaningful topic relationships, active neighbors, usable drawers and drawing; provide touch/keyboard alternatives.
- Gallery: use the five clearly labeled demo photos and demo resume until I replace them. Keep demo labels visible. Never pass sample assets off as my real work.
- Skills: Used/Learning/Exploring states and real project proof links. Projects: visible stage, architecture, role attribution, sources and limitations. Keep 29 curated cases and public repository directory discoverable.
- Maintain separate research and product records, especially facial-skin research versus DermaLens; distinguish Soochana and RiskPulse. Never invent research metrics, awards, publication acceptance or completed project stages.
- Global command search, section rail, mobile navigation, theme, resume/writing links and Maya remain easy to reach. Controls need accessible names, visible focus and adequate touch targets.

Review the rendered result section by section. Fix spacing, hierarchy, typography, clipping, contrast, focus, motion and awkward mobile fallbacks. Preserve working features and show screenshots as evidence.

## 3. Install and run credential-free checks first

Use Node.js 22 and the committed lockfile. In a fresh checkout:

```powershell
git clone --branch redesign/shanxai-portfolio-v2 https://github.com/shanmukhdatta/shanmukhdatta.github.io.git
cd shanmukhdatta.github.io
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
```

On Linux install browser system dependencies with `npx playwright install --with-deps chromium` if needed. `check` covers lint, format, content/contracts, component/API simulations, embedded PostgreSQL, TypeScript, production build and route smoke tests. E2E starts its own production server on port 4390 with provider keys disabled. It deliberately tests safe fallback behavior; it does not validate real services. Do not disable assertions, weaken thresholds, force clicks through overlays or hide failures to get green tests.

The latest fixes address mobile backdrop stacking, command-search hydration readiness, mobile scooter coordinates and light-theme contrast. Specifically retest these. Existing E2E captures desktop/mobile screenshots and exercises all project widths. Inspect browser errors and network failures as well as test status.

## 4. Configure a disposable live integration environment

Copy `.env.example` to ignored `.env.local` and have me enter the actual values locally. Required configuration:

| Variable | Purpose |
| --- | --- |
| SUPABASE_URL | Intended test Supabase project |
| SUPABASE_SERVICE_ROLE_KEY | Server-only database/storage access |
| ADMIN_EMAIL | My exact authorized owner email |
| SESSION_SECRET | Long randomly generated private session secret |
| RESEND_API_KEY | Test email provider access |
| MAIL_FROM | Sender approved by Resend |
| CONTACT_TO_EMAIL | Authorized recipient for contact tests |
| GROQ_API_KEY | Optional live Maya inference |
| GROQ_MODEL | Available model accepted by the provider |
| NEXT_PUBLIC_SITE_URL | Local or preview canonical URL |

Apply the complete `db/schema.sql` to the intended test database. Create the `portfolio-media` bucket described in the launch runbook; do not give anonymous visitors upload permission. Read routes and schema before issuing test mutations. Use clearly named disposable test records, preserve existing records, export a private backup before modifying existing content and clean up only records created by this test. Restart the app after environment changes. For manual live testing run `npm run dev` and use localhost:3000; do not mistake the credential-disabled E2E server for the live integration instance.

## 5. Validate the real flows

| Flow | Required evidence |
| --- | --- |
| Owner login | OTP accepted by provider and received by owner; correct login; wrong owner/code, expiry, attempt cap, replay and concurrent single-use checks; logout invalidates access as implemented |
| Authorization | Anonymous admin endpoints denied; invalid/tampered sessions rejected; cross-origin mutations rejected; server secrets absent from public assets |
| Draft and publish | Save a unique draft; prove it is absent from public content/search/Maya; preview; publish; verify a fresh browser and direct new-slug refresh; clean up test record |
| Conflict/history | Two sessions save the same revision: one succeeds, one 409; inspect private history; restore to draft; export backup; anonymous access denied |
| Managers | Projects, Research, Writing, Skills/proofs, Journey, Gallery, Intro, Theme, SEO/local redirects and Maya knowledge persist and publish correctly; private editorial register never leaks |
| Media | Upload approved test image and PDF resume; verify served content, size and MIME rejection, malicious masquerades and permission boundaries; remove test uploads |
| Contact | Send one clearly labeled test message to the authorized address; verify provider acceptance, actual receipt and private inbox; test failures without falsely showing delivery |
| Maya | Live streamed response, server-selected citation links, unknown answer, public facts only, malformed input/rate limits, provider outage and local fallback |
| SEO | Canonical URL, sitemap, robots, metadata, OpenGraph image, demo/draft indexing rules, local redirects and rejection of unsafe/cyclic redirects |

Use the actual route contracts; do not assume request shapes from this brief. A simulated test is not live evidence. If a provider is unavailable, record the precise blocked check and continue the rest.

## 6. Browser and design acceptance

Review Quick and Explore in dark and light themes at 1440, 1024, 820, 390 and 360 CSS pixels. Test first visit, skip/replay, persisted preferences, reduced motion, keyboard-only navigation, Tab/Shift+Tab/Escape focus restoration, touch interactions and page refresh. Test native mobile hardware if available; otherwise label emulation honestly.

Inspect the mobile menu search and backdrop, every case-study title, road/scooter alignment after resizing, skill proofs, connected chalkboard controls, carousel arrows/swipe, gallery, research/writing pages, demo lab, resume download, contact terminal, Maya dialog and owner CMS. Check all controls actually work. Capture useful viewport and section screenshots, not only very long full-page images. Review console errors, keyboard traps, WCAG AA contrast, horizontal overflow and animation readability. Keep CI's existing budgets and record preview Lighthouse measurements separately; do not equate local timing thresholds with production Core Web Vitals.

## 7. Fix, verify and report

Fix reproducible defects on the redesign branch in small descriptive commits. Re-run the relevant checks after each fix, then run the complete gate on the final code. Push the tested commits to the same branch and inspect GitHub Actions. Never report green CI until the final commit's run actually passes. Do not commit generated browser reports, test messages, private backups or credentials.

Create `docs/ANTIGRAVITY_RESULTS.md` containing: exact commits, environment, commands and exit results, each requirement marked PASS/FAIL/BLOCKED with evidence, design screenshots, live provider results with secrets redacted, issues fixed, remaining blockers and preview readiness. If authorized separately, prepare a preview deployment; production cutover remains a separate step.

My expected result is a working, visually coherent implementation of my shanXAI idea with demo content, tested local integrations after I provide keys, and an honest final report. Continue until all reproducible code defects are addressed; do not stop at giving me another plan.
