# shanXAI — Antigravity Verification & Acceptance Results

**Date:** 2026-10-15  
**Repository:** `https://github.com/shanmukhdatta/shanmukhdatta.github.io.git`  
**Branch:** `redesign/shanxai-portfolio-v2`  
**Starting Commit:** `8f79bce5199d896331e8495d934369bedca70788`  
**Final Commit:** `c31c289df531a89d2695b1f26789225559453c17`  
**Environment:** Windows 11, Node.js v25.9.0, npm 11.12.1, Chromium 156.0.8078.4 (Playwright v1.64.1)

---

## 1. Automated Verification Summary

| Gate | Command | Result | Evidence |
| --- | --- | --- | --- |
| Lockfile Installation | `npm ci` | **PASS** (0) | 126 packages installed cleanly, 0 vulnerabilities |
| Static Analysis & Linter | `npm run lint` | **PASS** (0) | Biome checked 62 files, 0 errors, 0 warnings |
| Formatting Check | `npm run format:check` | **PASS** (0) | Biome format check passed across all 62 source files |
| Contracts & Data Integrity | `npm run test` | **PASS** (0) | 10 contract tests passed; 29 case-study records, 71 public repos verified; no private entries or academic scores |
| Interaction & API Suite | `npm run test:interactions` | **PASS** (0) | 32/32 tests passed (Vitest): editorial constraints, API simulations, UI state transitions, draft isolation |
| Embedded Database Engine | `npm run test:database` | **PASS** (0) | PGlite PostgreSQL schema verified: atomic revision checks, draft/publish separation, transactional OTP single-use, rate-limits, unauthenticated access denied |
| Type Safety | `npm run typecheck` | **PASS** (0) | `tsc --noEmit` passed with 0 errors |
| Production Build | `npm run build` | **PASS** (0) | Next.js 15 App Router production bundle compiled successfully; 12 static/dynamic routes generated |
| Route Smoke Checks | `npm run test:smoke` | **PASS** (0) | All 29 case studies, core routes, HTTP headers, 404 handler, and unauthenticated API boundaries verified |
| Full E2E Browser Suite | `npm run test:e2e` | **PASS** (0) | 16/16 Playwright tests passed across Desktop Chrome and Pixel 7 mobile emulation |
| Responsive Viewport Audit | `scripts/capture-viewports.mjs` | **PASS** (0) | Verified at 1440, 1024, 820, 390, and 360 CSS pixels: zero horizontal overflow, controls functional |

---

## 2. Detailed Requirement Acceptance Matrix

| Requirement | Status | Evidence / Verification Details |
| --- | --- | --- |
| **Quick & Explore Modes** | **PASS** | Quick mode displays concise recruiter view (Hero, About, Toolkit, Journey timeline, Research, Work, Connect). Explore mode renders full narrative (Hero, Gallery, Toolkit graph, Winding Journey with scooter, My Mind chalkboard, Research Lab, Project carousel, Traffic signal, Terminal, Maya). |
| **Multilingual Intro** | **PASS** | Greetings cycle in Telugu, Hindi, English; skippable and replayable; honors `prefers-reduced-motion`; persists skip state in local storage. |
| **Visual Design & Palette** | **PASS** | Warm black (`#050506`), silver typography, Signal Amber accent (`#ffb224`); coherent light mode (`#f6f4ef`); WCAG AA contrast compliant on both themes. |
| **Personal Gallery & Demo Assets** | **PASS** | 5 demo photographs and sample PDF resume bundled with prominent demo labels (`DEMO ASSETS · Gallery photographs and resume are samples`); honest attribution preserved. |
| **Skills Toolkit & Proof Graph** | **PASS** | Clustered interactive chips categorized into Used / Learning / Exploring; selecting any skill reveals direct links to verified case studies in the portfolio. |
| **Journey Road & Path-Following Scooter** | **PASS** | Winding SVG path with coordinates dynamically mapped to viewport; responsive scooter movement; milestone category filters; accessible dialog detail notes with Escape-to-close. |
| **My Mind Blackboard** | **PASS** | Cream wall and green chalkboard aesthetics; semantic topic relationships derived from shared technologies; active neighbor highlighting; freehand chalk canvas; drawer notes. |
| **Research Lab** | **PASS** | Distinct records for original research (Facial Skin Research, QTagger+, Dravidian Alignment) versus engineering products (DermaLens AI, Soochana AI, RiskPulse AI); honest status caveats displayed. |
| **Featured Project Carousel** | **PASS** | Accessible carousel with previous/next controls, keyboard arrow navigation, swipe gestures, illustrative schematics clearly labeled as non-measured drawings. |
| **Case Studies & Public Repository Directory** | **PASS** | 29 detailed case studies with stage indicators, architecture descriptions, limitations, and reproducible text diagrams (`/api/projects/[slug]/diagram/`); 71 public repos indexed in `/projects/`. |
| **Maya Assistant** | **PASS** | Grounded strictly in published public catalog; server-selected source citations attached to answers; falls back to structured local facts when external LLM provider is not configured. |
| **Contact Terminal & Secure Form** | **PASS** | Interactive terminal (`help`, `whoami`, `connect datta`); form validates lengths, honeypot, and rate limits; fails closed with email fallback link without falsely claiming delivery. |
| **Owner Control Center (CMS)** | **PASS** | `/control-center/` guarded by OTP single-use transactional verification; draft/publish separation; atomic PostgreSQL compare-and-swap revision protection; private JSON backup export; unauthenticated access denied with 401. |
| **SEO & Routing** | **PASS** | Metadata generated with OpenGraph and Twitter cards; `/sitemap.xml` and `/robots.txt` dynamic; redirect middleware rejects external domains and cyclical paths. |
| **Accessibility (a11y)** | **PASS** | Automated `@axe-core/playwright` full WCAG 2.0, 2.1, and 2.2 AA audits passed with 0 violations across dark, light, desktop, and mobile viewports. |
| **Live Provider Integrations** | **BLOCKED** | Blocked on owner-supplied disposable keys in local `.env.local` (Supabase, Resend, Groq). All mock, fallback, and schema validation paths are fully tested. |

---

## 3. Defects Identified and Resolved

1. **Windows CRLF EOL Normalization:**
   - *Issue:* Git clone on Windows converted repository files to CRLF, failing Biome formatting checks.
   - *Fix:* Configured `core.autocrlf false` and `core.eol lf`, normalized line endings.
2. **Node.js 25 Global `localStorage` Compatibility:**
   - *Issue:* Node 25 defines an experimental global `localStorage` object that lacks `.clear()` unless `--localstorage-file` is specified, causing Vitest test teardown to throw `TypeError: localStorage.clear is not a function`.
   - *Fix:* In `tests/setup.ts`, wrapped storage cleanup in `typeof window !== 'undefined'` and verified `typeof window.localStorage.clear === 'function'`.
3. **WCAG 2.2 Target Size on Journey Rail (`SC 2.5.8`):**
   - *Issue:* Section rail buttons were sized at 19px × 18px with 23px offset, violating WCAG 2.2 AA minimum touch target size (24px × 24px).
   - *Fix:* Updated `app/globals.css` `.journey-rail button` dimensions to 24px × 24px, maintaining the centered 5px visual indicator while expanding the accessible touch area.
4. **Playwright Timeout Resilience:**
   - *Issue:* Comprehensive AxeBuilder audits across the entire DOM took up to 22s on Windows emulation, bumping against the 30s default timeout during server cold starts.
   - *Fix:* Updated `playwright.config.ts` timeout to 60000ms and set test-level timeout on the dual Axe audit in `tests/browser/portfolio.e2e.ts`.
5. **WCAG 2.2 Target Spacing (`SC 2.5.8`) between Journey Rail & Maya FAB:**
   - *Issue:* On 720p height viewports, the bottom rail button (`button[title="Connect"]`) came within 23px (< 24px minimum required offset) of `.maya-fab`.
   - *Fix:* In `app/globals.css`, tightened `.journey-rail` button gap to 10px and centered at `top: calc(50% - 15px);`, increasing distance from `.maya-fab` to > 40px; adjusted `.maya-nudge` bottom offset to 110px.

---

## 4. Visual Acceptance & Viewport Artifacts

Screenshots captured and stored in `test-results/viewports/`:
- **Desktop (1440×900):**
  - `desktop-1440-quick-dark-viewport.png`
  - `desktop-1440-explore-dark-viewport.png`
  - `desktop-1440-explore-light-viewport.png`
  - Sections: About (`section-about.png`), Toolkit (`section-toolkit.png`), Journey (`section-journey.png`), My Mind (`section-mind.png`), Research Lab (`section-research.png`), Component Dialogs (`component-maya-dialog.png`, `component-command-palette.png`)
- **Tablet Landscape (1024×768):**
  - `tablet-landscape-1024-quick-dark-viewport.png`
  - `tablet-landscape-1024-explore-dark-viewport.png`
  - `tablet-landscape-1024-explore-light-viewport.png`
- **Tablet Portrait (820×1180):**
  - `tablet-portrait-820-quick-dark-viewport.png`
  - `tablet-portrait-820-explore-dark-viewport.png`
  - `tablet-portrait-820-explore-light-viewport.png`
- **Mobile (390×844 - Pixel / iPhone):**
  - `mobile-390-quick-dark-viewport.png`
  - `mobile-390-explore-dark-viewport.png`
  - `mobile-390-explore-light-viewport.png`
- **Mobile Compact (360×800):**
  - `mobile-small-360-quick-dark-viewport.png`
  - `mobile-small-360-explore-dark-viewport.png`
  - `mobile-small-360-explore-light-viewport.png`

All viewports passed horizontal scroll overflow assertions (`document.documentElement.scrollWidth <= window.innerWidth + 1`).

---

## 5. Live Service Integration Runbook (Steps to Unblock)

When ready to test live service credentials:
1. Create `.env.local` inside `shanxai-antigravity/` (ignored by git):
   ```bash
   SUPABASE_URL="https://<your-project>.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
   ADMIN_EMAIL="<your-email>"
   SESSION_SECRET="<long-random-string>"
   RESEND_API_KEY="re_..."
   MAIL_FROM="shanXAI <portfolio@your-verified-domain.com>"
   CONTACT_TO_EMAIL="<your-receiving-email>"
   GROQ_API_KEY="gsk_..."
   GROQ_MODEL="openai/gpt-oss-20b"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```
2. Execute SQL schema in Supabase SQL editor: `db/schema.sql`.
3. Create public Storage bucket: `portfolio-media` (without public write permissions).
4. Run `npm run dev` and navigate to `http://localhost:3000/control-center` to verify real OTP generation, draft saving, publishing, and contact form delivery.
