# shanXAI — Research & Engineering Portfolio V2

A complete visual redesign of the portfolio of **Boda Shanmukh Datta**, preserving the cinematic journey/chalkboard/signal identity while leading with real evidence and discoverable technical work.

**Branch:** `redesign/shanxai-portfolio-v2` — protected experimental implementation. The original portfolio remains intact on `main` until review.

## Highlights

- Premium dark-silver design with restrained amber accents, optional light theme, responsive layout.
- Quick and Explore experiences, together in one data-driven site.
- Real project routes covering research, health AI, security, finance, agent infrastructure, and concepts.
- Soochana AI, RiskPulse AI, Voice Doctor AI, ChronoMind AI, facial skin research, DermaLens and many others, each labeled with actual status.
- Searchable project archive plus public GitHub repository directory, excluding private repository names.
- Short intro, road-based Journey, interactive chalkboard, Skills clusters, research cards, featured carousel, terminal/traffic signal.
- Command search (`Ctrl/Cmd + K`), local evidence-based Maya portfolio guide, responsive/mobile access.
- Static build with Next.js App Router and SEO/sitemap support; no paid API is needed for this baseline.

## Tech

Next.js App Router · React · TypeScript strict · CSS design tokens · Lucide. Static export for GitHub Pages or Vercel. Server-dependent features are explicitly deferred rather than emulated with insecure client-side code.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run check:content
npm run typecheck
npm run build
npm run dev
```

Visit `http://localhost:3000`. Next static export is emitted to `out/` on build.

## Project records

Change content in `content/projects.ts`, `content/site.ts`, and `content/catalog.ts`. Project routes are auto-generated from the catalog. Every featured project should list its stage, evidence, limitations and current next step. Changing a project record updates its overview, detail page and Maya catalog search.

## QA and pending integrations

See `docs/REDESIGN_PLAN.md` for the full scope and `docs/TESTING_HANDOFF.md` for a runnable Antigravity prompt. The current Maya is **local catalog search**, not a hosted LLM; the contact console opens the visitor's email application, not a misleading fake send endpoint. Owner-approved photos, secure admin CMS, live contact API and full mobile/browser QA remain separate tracked phases.

## Deployment

The repository has a GitHub Actions Pages workflow for static export, available after a reviewed merge and Pages source configuration to GitHub Actions. Existing legacy `proxy/` remains in the repository for continuity but is **not the source of the new Maya implementation**. Review this change before replacing the live website.
