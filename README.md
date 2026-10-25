# Student's Blackboard — Phase 2 Portfolio

An editable, notebook/chalkboard-inspired student portfolio for **Boda Shanmukh Datta**. Its appearance follows the user's approved design, including a multilingual introduction, strong black geometric outlines, colored rectangular nav, diagonal work links, and a real cropped photo positioned **to the right of the Home introduction even on mobile**.

## What you get

- Four pages within a single responsive, interactive frontend: **Home · Work · Blogs · About Me**.
- Multilingual introduction with Enter/Replay, accessible and reduced-motion-aware controls.
- Projects/Research/Hackathons/Open Source filters and keyboard-operable paper detail dialog.
- Green experience slides; separate achievements; education, credentials and roadmap.
- Real resume PDF, cropped and full-resolution-proportion gallery photo, user-provided project information.
- Published-research archive stays empty until an actual publication is confirmed.

## Preview without installing packages

Open `preview.html` in a browser for an interactive **offline design preview** (Home, Work, Blogs and About), or inspect `docs/previews/desktop-preview.png` and `docs/previews/mobile-preview.png`. This is a snapshot companion to the actual React source, not proof that the Next.js production build works.

## Run locally

Requires Node.js 20.9+ and npm access.

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. Build/check:

```bash
npm run typecheck
npm run test:content
npm run build
npm run start
```

> **Important:** The source was generated in a network-restricted workspace. The npm dependency installation and complete Next.js runtime/build could **not** be tested there. See `docs/PHASE2_STATUS.md`.

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

**Phase 3 is not yet implemented:** The private CMS/database/email OTP will be built later. The current frontend deliberately reads typed content modules to make the transition straightforward.

## Privacy

The PDF contains contact details from the user's original résumé. Review it before publishing to the open internet. The website itself does not print a phone number. No API keys, private data, fabricated papers or credentials are embedded.

## Accessibility checklist

- Navigation and filters have accessible labels and selected/pressed states.
- Project dialogs are dismissible by Escape, with initial focus and Tab containment.
- Reduced-motion users do not get animated greeting/entrance effects.
- Images have meaningful alternative text and responsive sizing.
- Links open securely in new tabs when leaving the website.
- Verify actual screen-reader behavior, high contrast, zoom and keyboard flow after installing dependencies.

## GitHub source repository

Target: `https://github.com/shanmukhdatta/shanmukhdatta.github.io`, branch `main`. Previous source is preserved in `backup/pre-blackboard-2026-10-26`. This commit **only replaces source files**; it does not include or configure GitHub Pages deployment or CI deployment workflows. Deploy separately after validating the production build.
