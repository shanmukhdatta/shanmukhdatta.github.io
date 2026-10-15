# shanXAI V2 — Honest implementation checklist

**Branch:** `redesign/shanxai-portfolio-v2`
**Source of intended features:** the two uploaded shanXAI design files, the master redesign plan, and the current repository inventory. The eight referenced deeper specifications were not supplied, so their undocumented features cannot be certified as implemented.

| Feature | Code | Verification status / limitation |
| --- | --- | --- |
| Responsive Quick + Explore views | `components/Portfolio.tsx` | Implemented; production HTTP checks pass; desktop/mobile visual QA pending |
| Intro with greetings, motto, skip and replay | `components/Portfolio.tsx` | Implemented; reduced-motion fallback; duration optimized vs original concept |
| Dark/silver + Signal Amber with light mode | `app/globals.css`, `content/site.ts` | Implemented; owner can disable accent through published site settings |
| Interactive portrait and hero constellation | `components/Portfolio.tsx` | GitHub avatar available; personal photo not yet supplied |
| About carousel with original images | `components/SceneEnhancements.tsx` | Working if owner supplies and publishes approved photos; honest placeholder otherwise |
| Skills Toolkit and project search | `components/Portfolio.tsx`, `components/ArchivePage.tsx` | Working group selection/search; advanced graph-edge visuals remain optional polish |
| Journey road, scooter, day cycle and filters | `components/Portfolio.tsx`, `components/SceneEnhancements.tsx` | Code implemented; manual browser/motion QA pending |
| My Mind chalkboard, drawers, drawing, decor | `components/Portfolio.tsx`, `components/SceneEnhancements.tsx` | Code implemented; manual tablet/touch testing pending |
| Research Lab and honest claim labels | `app/research/page.tsx`, `content/projects.ts` | Implemented; owner to verify public claims and document versions |
| Project carousel, signature schematics, swipe | `components/ProjectVisual.tsx`, `components/Portfolio.tsx` | Implemented; illustrations explicitly not measurements |
| 29 case studies + 71 public repositories | `content/projects.ts`, `content/catalog.ts` | Content scan passes; inventory reflects date of audit, not automatically synced |
| Individually addressable, CMS-published project pages | `app/projects/[slug]/page.tsx` | Server rendered; final deployment integration test required |
| Maya assistant, fallback + streamed responses | `app/api/maya/route.ts`, `components/Portfolio.tsx` | Code implemented; real Groq key and live response QA required |
| Responsive contact terminal + real contact form | `components/ContactForm.tsx`, `app/api/contact/route.ts` | Code implemented; verified sender & delivery test required |
| Owner-only OTP sign-in and sessions | `app/api/admin/*`, `lib/security.ts` | Code implemented; Supabase/Resend and auth penetration tests required |
| Private drafts + publish + restore + revision check | `app/api/admin/documents/route.ts`, `components/admin/ControlCenter.tsx` | Code implemented; apply updated SQL for atomic revision checks; live database integration remains to be exercised |
| 12-step case-study wizard, visual preview | `components/admin/ControlCenter.tsx` | Implemented with structured JSON editor |
| Media library, image and public-resume uploads | `app/api/admin/media/route.ts` | Code implemented; owner must create Storage bucket; no personal assets included |
| CMS inbox, public resume and theme settings | `app/api/admin/inbox/route.ts`, `content/site.ts` | Code implemented; integration test and private owner review required |
| Keyboard palette, route signal, optional sound | `components/Portfolio.tsx`, `components/RouteTransition.tsx`, `components/SceneEnhancements.tsx` | Code implemented; keyboard/a11y/audio QA pending |
| Search engine metadata and dynamic sitemap | `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` | Code implemented; canonical domain setting required at deployment |
| GitHub Actions tests and protected feature branch | `.github/workflows/ci.yml` | Automated checks run on PR; live Vercel check is separate |
| Production service launch | Vercel + Supabase + Resend | **Not complete** without user-owned connections, environment variables, testing, and authorized release |

## Release gates

1. CI passes on the final branch tip.
2. Verified owner configures external services and secrets privately.
3. Browser, mobile, accessibility, image and link reviews pass in Antigravity.
4. Project owners approve public facts, personally identifiable details and assets.
5. Preview deployment is verified and the existing GitHub Pages → dynamic Vercel hosting transition is planned. **Never automatically merge or change the primary domain.**

## Important claims

The presence of an API route or frontend feature demonstrates **code written**, not that a third-party service is provisioned or its integration has been exercised successfully. Missing assets remain placeholders rather than fabricated photos or screenshots. Research projects retain explicit stages and evidence limits.

## Completion pass — 15 October 2026

- Published CMS data now renders on the server for both homepage and archive.
- Schema validation rejects incomplete scenes, invalid statuses, duplicate slugs, missing related projects, and unsafe paper/gallery/screenshot URLs. Invalid stored documents fall back to the shipped data.
- Journey signs open keyboard-accessible detail notes. The project archive filters by stage and supplied year.
- Intro, command palette, Journey notes and mobile navigation trap focus and restore the opener. Featured projects support arrow keys; Maya serializes streamed requests.
- CMS saves use a PostgreSQL compare-and-swap function; OTP checks consume codes transactionally to prevent duplicate use. Apply the updated `db/schema.sql` before enabling owner login.
- A committed lockfile and `npm ci` make CI installation repeatable. Ten tests validate contracts and actual content schemas; production smoke checks exercise all 29 case studies, core routes, 404, response headers and unauthenticated boundaries.

No live Supabase/Resend/Groq credentials, personal gallery images or resume were provided. Service integrations, real browser/mobile visual review and domain cutover remain release gates. The original main branch is preserved.
