# Student's Blackboard — The Living Notebook

A notebook/chalkboard-inspired student portfolio for **Boda Shanmukh Datta**. Its appearance follows the user's approved design, including a multilingual introduction, strong black geometric outlines, colored rectangular nav, diagonal work links, and a real cropped photo positioned **to the right of the Home introduction even on mobile**.

## What you get

- Four pages within a single responsive, interactive frontend: **Home · Work · Blogs · About Me**.
- Multilingual introduction with Enter/Replay, accessible and reduced-motion-aware controls.
- Projects/Research/Hackathons/Open Source filters and keyboard-operable paper detail dialog.
- Green experience slides; separate achievements; education, credentials and roadmap.
- Real resume PDF, cropped and full-resolution-proportion gallery photo, user-provided project information.
- Published-research archive stays empty until an actual publication is confirmed.

## Phase 3: private content management system

The code now includes a **private `/control-center`** to update project/research cards, blog entries, gallery, experience, credentials, skills, roadmap, profile and résumé links without editing code. It uses a **real Postgres database, one-admin email OTP, short-lived codes and server-side cookies** when configured. Drafts stay private, published records appear on the public site, and hidden items can be restored. The public interface follows the approved Living Notebook update.

You **must** configure the database and email sender before using the admin interface; the project intentionally includes no sample login, fake OTP or live credentials. Media uploads additionally require a configured Supabase Storage bucket. Detailed setup and security testing steps: **`docs/PHASE3_SETUP.md`**. Current tested/unverified status: **`docs/PHASE3_STATUS.md`**.

This is **source code only**; no GitHub Pages build or deployment workflow is included. GitHub Pages does not execute these server-side APIs. Deploy the full application to Vercel following **`docs/DEPLOYMENT_GUIDE.md`** and **`docs/PRODUCTION_CHECKLIST.md`**.

## Preview without installing packages

Open `preview.html` for screenshots of the production application (Home, Work, Blogs, About and Bujji). Run the app locally for interactive motion and chat. See `docs/LIVING_NOTEBOOK.md` for the new features, Groq setup, portrait replacement and current verification limits.

## Run locally

Requires Node.js 22+ and npm registry access. (See `.env.example` / `docs/PHASE3_SETUP.md` for CMS configuration.)

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. Build/check:

```bash
npm run typecheck
npm run test:content
npm run test:cms
npm run build
npm run start
```

> **Verified in GitHub Actions:** Dependencies install, nine CMS unit tests, TypeScript, production build, unauthenticated smoke tests, and isolated PostgreSQL/mock OTP CMS end-to-end tests pass. See `docs/PHASE4_TEST_REPORT.md`. Real email, real hosted DB, and media storage remain unconfigured.

## How to update your actual information

- `content/site.ts`: introduction, skills, campus experience, achievements, education, roadmap, gallery, verified credentials.
- `content/work.ts`: all projects and ongoing research with statuses and links. Do not mark a paper as published until verified.
- `content/blogs.ts`: published blog posts. Currently intentionally empty; no fictitious demo publications.
- `public/images/shanmukh-hero.webp`: cropped hero portrait with building backdrop.
- `public/images/shanmukh-gallery.webp`: resized original portrait for gallery.
- `public/resume/Shanmukh_Datta_Resume.pdf`: saved actual résumé.

See `docs/DESIGN_SPEC.md` for the approved visual rules and `docs/CONTENT_AUDIT.md` for data origins and pre-publication checks.

## Architecture

```
app/
  layout.tsx        # HTML document, metadata
  page.tsx          # App entry
  globals.css       # Approved design tokens, desktop/mobile/reduced motion
components/
  Portfolio.tsx     # Intro, nav, Home, Work, Blogs, About, footer, dialogs
content/
  site.ts           # Profile, school, experience, skills, awards, roadmap
  work.ts           # Typed categorized projects and ongoing research
  blogs.ts          # Real blog content only
public/
  images/           # Real user-supplied photo and crop
  resume/           # Real PDF
scripts/
  check-content.mjs # Content/assets sanity checker
docs/              # Design lock, audit, status
```

**Phase 3 source is implemented:** It includes `app/control-center`, server-side `app/api/admin/*`, `db/schema.sql`, `lib/cms-*`, content validation, media endpoint, and unit tests. Your public notebook uses published database content over the original résumé-backed defaults. The production build and isolated PostgreSQL/mock-email integration tests are verified in GitHub Actions; actual cloud services and production hosting are not yet configured.

## Privacy

The PDF contains contact details from the user's original résumé. Review it before publishing to the open internet. The website itself does not print a phone number. No API keys, actual OTP codes, fabricated papers, or fabricated credentials are embedded. The `.env.example` file contains placeholders, not real secrets.

## Accessibility checklist

- Navigation and filters have accessible labels and selected/pressed states.
- Project dialogs are dismissible by Escape, with initial focus and Tab containment.
- Reduced-motion users do not get animated greeting/entrance effects.
- Images have meaningful alternative text and responsive sizing.
- Links open securely in new tabs when leaving the website.
- Verify actual screen-reader behavior, high contrast, zoom and keyboard flow after installing dependencies.

## GitHub source repository

Target: `https://github.com/shanmukhdatta/shanmukhdatta.github.io`, branch `main`. Previous source is preserved in `backup/pre-blackboard-2026-10-26`. This commit **only replaces source files**; it does not include or configure GitHub Pages deployment or CI deployment workflows. Deploy separately after validating the production build.
