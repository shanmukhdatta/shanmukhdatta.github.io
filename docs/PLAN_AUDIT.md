# shanXAI — Plan compliance and test audit

Audit date: 15 October 2026. Branch: `redesign/shanxai-portfolio-v2`.

## Verdict

**The complete master plan is not 100% implemented or verified.** The primary portfolio scenes, project archive and server APIs exist. This audit adds demo assets, fixes several interaction gaps, adds private revision history/backup export, and exercises UI, API and PostgreSQL behavior. Passing these checks is not certification of live third-party services, visual fidelity or every design detail.

Status meanings:

- **Implemented**: the behavior exists in source. Automated coverage is identified separately.
- **Partial**: some intended behavior exists, with a concrete gap described below.
- **Missing**: no complete implementation of the specified feature was found.
- **External/unverified**: requires a real deployment, account, original evidence, browser or supplied document.

## Requirement-by-requirement check

| Plan requirement | Status | Evidence and remaining difference |
| --- | --- | --- |
| Brand, metallic dark/silver and restrained amber | Implemented | `content/site.ts`, `app/globals.css`; actual visual fidelity requires browser review |
| Light and monochrome settings | Implemented | Theme toggle and published `signalAccent` setting |
| Multilingual intro and motto | Implemented | `Portfolio.tsx`; skip and replay timing tested |
| First-visit intro, skip, replay, reduced motion | Implemented | Session preference, 2.15-second timer, reduced-motion bypass; component test |
| Hero name, portrait fade and desktop parallax | Implemented | GitHub profile portrait, CSS mask, capable-pointer guard; rendering not visually certified |
| Hero constellation, counters, work/social links | Implemented | Decorative neural scene; counters computed from published projects |
| Hero Research CTA and name marquee | Partial | Research available through nav; no separate hero research CTA or scrolling name marquee |
| Hero currently-working line | Partial | Currently exploring appears in About, not a dedicated live hero placard |
| Quick/Explore single source and persistence | Implemented | Shared typed documents, server initial data, stored mode preference; component test |
| Exact Quick order and simple recruiter presentation | Partial | Main sections reordered, but My Mind remains rendered and full Journey scenery is retained |
| Sticky navigation and mobile menu | Partial | Responsive menu, Escape/focus handling; full-height backdrop dismissal and resize behavior need work/review |
| Top-nav Resume | Partial | Hero, command palette and terminal have resume; not a permanent top-nav item |
| Five-photo About gallery, arrows and captions | Implemented | Five local demo JPEGs; wraparound controls tested |
| Gallery auto-advance, pause on hover/focus | Implemented | Interval paused on pointer/focus and reduced motion; real browser/touch test pending |
| Real personal travel photos/map | External/unverified | Demo images expressly make no travel claim; optional map intentionally absent |
| Sample resume download | Implemented | Local PDF, visually inspected; visible demo labels; production asset request tested |
| Original final resume | External/unverified | Demo PDF is not a real CV |
| About bio, affiliation and exploration | Implemented | Typed profile; claims still require owner review |
| Toolkit grouped nodes and project search | Implemented | Skill selection links to filtered archive |
| Spatial proof graph and per-skill learning status | Partial | Grouped chips rather than a complete graph; individual Used/Learning/Exploring fields absent |
| Command palette sections/projects/resume/Maya | Implemented | Added resume and Maya entries; command search tested |
| Experience/Achievements command shortcuts | Implemented | Jump to Journey with corresponding filter; empty categories do not invent accomplishments |
| Journey rail, section progress and signal transition | Implemented | Existing rail, top progress and route-transition component; visual/motion QA pending |
| Contextual cursor labels | Partial | Fine-pointer cursor exists; distinguishes Type/Open, not all View/Drag/Play contexts |
| Optional sound and IST clock | Implemented | Sound off by default; live clock; audio not exercised in real browser |
| Journey filters and readable milestones | Implemented | Filtered typed records and clickable detail dialog; tested |
| Winding road, trees, year signs and future fade | Partial | Road/hills/clouds/scooter/day states exist; roadway is largely straight, no full tree scene or authored winding vehicle path |
| You Are Here marker | Implemented | Explicit marker added |
| Journey proof-linked detail and all candidate milestones | Partial | Detail notes exist; no per-record verified proof links for most milestones; candidate achievements are not fabricated |
| My Mind chalkboard, decor, drawing and topic drawer | Implemented | Room/clock/sticky notes/canvas and text topic controls; topic selection tested; pointer drawing needs browser QA |
| Chalkboard connections and learning labels | Partial | Added decorative connecting strokes and derived stage labels; edges are not a semantic topic graph with connected-neighbor highlighting |
| Quantum manuscript thought cluster | External/unverified | No invented public manuscript contents or publication permission |
| Research index and evidence/limitations text | Implemented | Research index plus canonical project case studies |
| Research-specific detail routes and structured study records | Partial | Shared `/projects/[slug]` template; no separate `/research/[slug]` template, datasets/collaborators/publication schemas or research figures registry |
| Paper links and research measurement sources | Partial | Optional paper/metric fields exist; verified real PDFs and experiment records are not supplied for every study |
| Featured focus carousel, arrows/swipe/keyboard | Implemented | Interactive carousel; keyboard tested; adjacent project previews added |
| Partial neighboring visual cards and per-project animation | Partial | Neighbor preview cards and schematic families exist; not full overlapping visual cards or bespoke animation for every project |
| Searchable archive, stage/year/track filtering | Implemented | Query, track, stage, supplied-year filters and reset; component test |
| Project case studies and sibling relationships | Implemented | 29 routes; source/status/evidence/roadmap and related records; production requests tested |
| Complete public repository directory | Implemented | 71 public entries; dated snapshot, not an automatic sync |
| Full private 76-record provenance/permission register | Partial | Public taxonomy exists; per-repository ownership, verification and permission records are not fully modeled |
| Downloadable text equivalents for technical diagrams | Partial | Descriptive diagram labels and architecture prose exist; no dedicated diagram download feature |
| Contact traffic signal and terminal commands | Implemented | Signal links, status colors and documented commands; component/provider response tests |
| Secure contact validation/rate limit/provider acceptance | Implemented | API simulations verify validation, quotas, failure and acceptance; live delivery unverified |
| Maya local fallback and streamed provider responses | Implemented | Fallback and provider SSE simulation tested; concurrent client sends serialized |
| Maya server facts/privacy/quotas | Implemented | Caller-supplied facts ignored; published server data, context cap and fail-closed quota checks tested |
| Maya citations for every streamed answer | Partial | Deterministic replies link case studies; provider replies are plain streamed text without enforced structured citations |
| Full context-aware Maya nudges | Partial | One project-section nudge, not one semantic suggestion per section |
| Hidden owner discovery | Partial | Logo double-click exists; long-press discovery absent |
| Owner OTP, expiry, attempt cap, sessions | Implemented | SQL single-use/expiry/attempt tests; real email sign-in and browser cookies still require live integration |
| Draft/edit/preview/publish/restore/revision guards | Implemented | JSON editor, preview, publish, SQL compare-and-swap; UI/API/SQL tests |
| Media upload/listing and resume URL management | Implemented | Authenticated upload route with type/magic/size validation; real Storage integration not exercised |
| Private inbox | Implemented | Authenticated inbox endpoint/UI; demo inbox is fictional |
| Audit trail, revision snapshots and backup download | Implemented | Transactional history trigger, private history API, restore-to-draft UI, private JSON export; SQL/authorization tests |
| Complete dedicated CMS managers | Partial | Profile/gallery/skills/Journey/topics/projects/settings through consolidated JSON; separate Writing, SEO/redirect, Intro and Maya-knowledge managers absent |
| Full project wizard as specified | Partial | 12 fields/category/status editor exists; role, screenshots, measured evidence review and mandatory preview gate are not all wizard stages |
| Writing & Notes hub and draft-only articles | Missing | No complete Article model, authoring manager or writing routes; no fictional articles presented as published work |
| SEO metadata, sitemap and robots | Partial | Implemented baseline; all CMS SEO updates/redirect editing/OG image and rich per-study metadata are incomplete |
| Analytics choice | Implemented | No analytics/tracking service added; no visitor tracking is required for the demo |
| Dependency lock and CI checks | Implemented | npm lockfile; schema/contracts, component/API, PostgreSQL, types, production build and HTTP smoke checks in CI |
| Lint and formatting scripts | Missing | TypeScript checking is present; dedicated lint/format enforcement from the plan is not configured |
| Browser E2E, contrast and real mobile QA | External/unverified | Component tests use jsdom; no real browser/screenshot/Playwright or WCAG certification was performed here |
| Mobile performance/Web Vitals budgets | Missing | No measured Lighthouse/Web Vitals budget enforcement |
| Public/private content and academic-statistic scan | Implemented | Content/schema checks; lockfile integrity hashes explicitly excluded as dependency metadata |
| Outbound evidence/demo links | Partial | HTTP reachability recorded separately in `link-audit.json`; reachability does not verify project behavior or ownership |
| Hosting transition, domain, deployment and rollback rehearsal | External/unverified | Feature branch only; no main merge, DNS modification or production cutover |
| Eight referenced deeper specification files | External/unverified | Not available; compliance with unseen details cannot be claimed |

## Demo data boundaries

- `public/demo/gallery-1.jpg` through `gallery-5.jpg`: bundled sample photography, credited in `public/demo/ASSET_SOURCES.md`. Not personal travel history.
- `public/demo/demo-resume.pdf`: generated sample document with explicit demo notice; not an actual CV.
- `/demo/`: fictional project/editor/inbox/research sample and simulated traffic-signal outcomes. State is local to the tab, reset on refresh, and never writes real portfolio content.
- `/control-center/`: real authenticated owner dashboard. The demo does not bypass this authentication.
- Actual project descriptions retain their existing evidence and stage labels. No demo success is relabeled as real deployment or research results.

## Recorded results

- 10 content/contract/schema tests passed.
- 25 component/API tests passed (including intro skip/replay, gallery, modes, search, carousel, Maya fallback, contact outcomes and owner editor).
- Embedded PostgreSQL checks passed.
- TypeScript, production build and production HTTP smoke checks passed.
- 77 outbound URLs checked: 76 returned HTTP 200; the EAPCET Render demo timed out and remains unverified.

## Checks and their limits

`npm run check` executes content/contracts, UI/API simulations, embedded PostgreSQL tests, TypeScript, production build and production HTTP smoke tests. The production smoke requests all 29 case studies, core pages, demo assets, protected endpoints and a missing-project route. API provider tests are simulations, not paid/live requests.

PostgreSQL tests apply the real schema in PGlite and exercise revision conflicts, publication separation, history creation, OTP single use, attempt cap/expiry, shared quotas and anonymous access denial. This does not replace deployment-specific Supabase permissions, Storage, SMTP/provider or concurrent multi-instance operational testing.

The resume PDF was rendered and visually inspected. The website itself was not visually certified in a real browser. Real phone layout, mouse/touch drawing, sound, performance, reduced-motion rendering and full accessibility need browser review.

## Next implementation gaps, in priority order

1. Complete Writing/Article, research-record and CMS SEO/redirect/knowledge managers, with published-only data and validation.
2. Finish semantic Toolkit/My Mind connections, winding-road visual treatment, the specified neighbor-card composition and remaining nav/hero details.
3. Add mandatory wizard preview/evidence review, full milestone proof records and structured Maya citations.
4. Add lint/format and measured browser accessibility/performance checks; run real desktop/mobile E2E.
5. Configure real services and approved assets; verify delivery/login/storage/AI behavior, then plan launch and rollback.

This is the remaining scope. Demo content and passing automated checks do not make these items complete.
