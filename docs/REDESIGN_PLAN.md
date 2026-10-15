# shanXAI V2 — Product & Implementation Specification

**Date:** 2026-10-15  
**Branch:** `redesign/shanxai-portfolio-v2`  
**Target:** A premium, credible research/product portfolio for Boda Shanmukh Datta.

## The core idea

One portfolio with two reading experiences:

- **Quick:** evidence-first path for recruiters and research mentors: top projects, research, background, toolkit, contact.
- **Explore:** the owner's signature story: greeting intro, huge silver name, research constellation, About gallery, Skills orbits, winding Journey road, interactive green chalkboard, Research Lab, sliding featured projects, interactive traffic-light contact scene, terminal, Maya, and the final “Stop Thinking. Start Doing.” bookend.

Design grammar: warm black + silver, a single signal-amber accent, considered editorial details, research-paper notation, rounded technical surfaces, and accessible animation. Journey uses natural green scenery; My Mind intentionally uses a cream wall and green chalkboard.

The complete source specification is the owner's two uploaded shanXAI design documents, plus this audited adaptation. The eight deeper specification files referenced by the older prompt have not been provided, so their contents must not be invented.

## Information architecture

- `/` — Quick/Explore homepage sharing a single typed content source
- `/projects/` — searchable case-study gallery and complete public GitHub directory
- `/projects/[slug]/` — reusable project detail routes; real status, method, evidence, limitations and next steps
- `/research/` — research index linking to source-backed studies
- Public site state: mode/theme persistence, route-aware links, command search, guided Maya dialog

## Preserve these signature ideas

1. Short, skippable multilingual intro with a replay action.
2. Silver-on-black hero and actual profile avatar, neural starfield treatment, measured-count metadata.
3. Approachable About with collage/personal travel gallery (real approved images to be added later).
4. Skills toolkit with clustered interactive chips.
5. Journey road and timeline filtering by education, experience, leadership and research.
6. Cream research wall and chalkboard: connected questions rather than random terms.
7. Dedicated Research Lab with caveats, reproducibility and status.
8. Feature carousel and individual shareable case-study pages.
9. Complete archive, smaller experimental work and a public repository directory.
10. Contact traffic signal, interactive terminal, email app handoff, and bookend phrase.
11. Maya guide: public-facts-only, explicit unknown responses, related-study links.
12. Command palette, right-hand section rail, dark/light, responsive and reduced-motion options.
13. Admin Control Center concept: hidden entry as design flourish; authentication and publishing must be a genuine secure server implementation, not client-side fake security.

## Project coverage

### Flagship & prominent case studies

- QTagger+ quantum malware research
- Dravidian cultural alignment
- Facial skin disease research (original research pipeline)
- DermaLens AI (separate inference-product engineering effort)
- Soochana AI (institutional financial-risk intelligence)
- RiskPulse AI (hackathon financial signals/index/stress proof of concept)
- ChronoMind AI (existing implementation plus V2 engineering roadmap)
- Voice Doctor AI / VoiceDoc (offline Android research and staged implementation)
- No Hack (hybrid security-ML architecture and staged development)
- CLARION (architecture-only Bitcoin forensic intelligence)
- BhashaGuard Edge (CPU review prototype)
- Workspace MCP, Kaggle GPU MCP, Resume Copilot
- ShanXBot, LifeSync AI, Aurbana

### Additional verified/linked portfolio work

Smart Stadium Copilot; India Space Lab; CodeGraphContext participation; AP EAPCET Predictor; CarbonWise AI; GestureVerse; other research/lab repos as audited. The public repository inventory indexes all 71 currently public repositories, including learning and reference work; it does not imply equal technical depth or originality.

### Ideas to retain without pretending they are finished

GURU mentoring ecosystem; Alexa+ GURU-style hackathon concept; BUJJI personal Windows assistant; agent workflow platform; AI bird deterrence; quantum V2G authentication manuscript; cultural alignment extension. Other private research notes must remain unindexed until permission and public artifacts are verified.

## Build scope in this branch

**Implemented V2 foundation:** Next.js App Router, strict TypeScript, content catalog, static case-study routes, responsive visual system, Quick/Explore toggle, public archive, research index, scoped Maya search, basic command palette, scene components, contact email handoff, SEO/sitemap and content checks. The GitHub Pages configuration emits a static export and does not require a paid runtime.

**Not yet implemented, do not claim completed:** secure admin CMS, actual OTP authentication, server-sent contact storage, server-grounded LLM backend, optional sound, travel photos requiring owner-approved assets, advanced 3D road/graphics, authoritative proof-backed research metrics and a fully custom pointer. Rather than fake those, separate them into future, testable phases.

## Future phase gates

1. **Assets & editorial review:** owner-approved photos, resume, social links, paper PDFs, institutional confirmation, repository authorship notes.
2. **Quality of experience:** mobile/browser screenshot verification, accessibility/keyboard audit, animation performance, refined interactions, actual project-specific media.
3. **Research proofs:** experimental tables, citations, method diagrams, metrics provenance and clear publication labels.
4. **Contact service:** server-side validated and rate-limited Resend endpoint; show success only on confirmed delivery.
5. **Maya backend:** server-trusted published content only, proper quotas, abuse prevention, model feedback and citations; current frontend guide remains as safe fallback.
6. **Control Center:** separate authenticated server app with OTP/session/CSRF checks, Prisma/Postgres, object storage and publish review; keep drafts out of static bundles.
7. **Deployment:** build artifacts, CI, Lighthouse/perf, image optimization, accessibility, SEO, preview site and rollback before merging main.

## Engineering & truthfulness rules

- Every featured project has a public status that distinguishes plans from validated work.
- Original research and software serving platform remain distinct project pages with related links.
- No confidential repos, unpublished materials, internal company code or private datasets in public bundles.
- No academic score fields, counters or derived assistant facts anywhere in the public website.
- Never invent measured results, acceptance/awards, actual contact delivery, production deployment or a phone-optimized model without verification.
- Respect reduced-motion, keyboard navigation and responsive layouts.
- Preserve original `main` until review of the draft pull request; run Antigravity locally and review all rendered routes first.
