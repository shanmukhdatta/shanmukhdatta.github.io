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
