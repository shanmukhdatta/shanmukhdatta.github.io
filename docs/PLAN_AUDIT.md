# shanXAI — Completed implementation and verification record

This document supersedes the earlier gap audit. The code gaps identified there have been implemented on `redesign/shanxai-portfolio-v2`. Code completion is distinct from owner-approved evidence and live provider deployment.

## Completed features

| Previous gap | Implementation |
| --- | --- |
| Writing and Notes | Article schema, draft/public status, index/detail routes, labeled noindex demo note, CMS Writing manager |
| Rich research records | Independent study routes, abstract/method/datasets/collaborators/publication/reproducibility/limitations/figures/source fields, links to engineering case studies |
| SEO and redirects | Published metadata, generated OpenGraph image, Twitter card, sitemap including articles/studies, local redirect middleware with cycle/off-site rejection |
| Intro and Maya managers | Editable greetings/motto/timing/enabled state; server-only published knowledge projection |
| Skill proof graph | Radial desktop toolkit, mobile list fallback, per-skill Used/Learning/Exploring states and actual proof-project links |
| Semantic My Mind | Edges derived from real shared technologies/related projects, active-neighbor highlighting, clickable connected topics, ten thought clusters including architecture-only V2G |
| Journey | Winding SVG road, path-following scooter, trees/year signs/day cycle/future fade, evidence-source dialogs with honest verification status, compact Quick timeline |
| Hero/navigation | Research CTA, currently-working line, name marquee, permanent Writing/Resume links, full-height mobile menu/backdrop/resize close, long-press owner discovery |
| Quick/Explore | Quick order matches recruiter flow and hides the chalkboard; command palette can open it in Explore |
| Cursor and carousel | Context labels, visual neighboring project cards, keyboard/swipe controls, project schematics |
| Wizard and review | Attribution, screenshots, paper URL, measurement records with source/dataset/version/setup, explicit final preview, required publish review |
| Maya citations | Server-selected structured public source references travel with provider responses and remain linked with each chat answer; no caller-supplied facts |
| Editorial register | Authenticated 76-slot provenance/ownership/permission/verification/placement model; five private identities must be filled privately by the owner; never public |
| Accessible diagram equivalent | Architecture text downloads generated from each published project record |
| CMS revisions/backups | Private transactional audit history, restore-to-draft, revision checks, JSON backup export |
| Formatting/lint/dependency checks | Biome formatting and correctness lint, repeatable lockfile, production dependency audit and patched PostCSS override |
| Browser verification infrastructure | Chromium desktop/Pixel emulation E2E, axe WCAG checks, responsive bounds/DOM readiness/initial JS transfer budgets, screenshot and trace artifacts in CI |
| Launch and rollback | Concrete preview/provider/editorial/cutover/backup/rollback runbook in `LAUNCH_RUNBOOK.md` |

## Test layers

- Content schemas and source contracts.
- Component and API simulations, including draft leakage, redirect validation, semantic links and source citations.
- Actual PostgreSQL schema in PGlite: revision conflict, publication separation, history, OTP single use/attempt cap/expiry, shared quotas and denied anonymous access.
- Production build and HTTP checks across project/research/writing/demo/metadata routes and local demo assets.
- Real Chromium desktop/mobile emulation with axe, overflow checks and measured performance budgets in GitHub Actions.

The final GitHub workflow result is authoritative for the branch tip; the browser report includes screenshots/traces for review. Automated budgets are concrete test thresholds, not a claim of measured Core Web Vitals on physical phones or production networks.

## External release inputs

1. Original personal photos/resume and owner-confirmed role dates, paper permissions and real research measurement sources. Demo assets are deliberately labeled.
2. Names/details for five private editorial slots, entered only inside authenticated CMS. Public source code deliberately does not disclose them.
3. Supabase/Storage, Resend sender, owner email/session secret and optional Groq credentials; real delivery/login/storage/inference verification after configuration.
4. Production hosting/domain approval, final screenshot review and physical-device/network checks before launch.
5. The eight deeper specifications mentioned in the original plan, if they exist. Unseen requirements cannot be certified.

These are external evidence/configuration gates. They are not represented as completed live integrations. No main merge, DNS change or production cutover is implied by a feature-branch push.

## Demo boundaries

Five bundled sample photographs and a demo PDF resume remain clearly labeled. `/demo/` contains fictional project editing, simulated message outcomes and a demo inbox; it never writes actual portfolio content or bypasses owner authentication. The sample writing note is labeled and excluded from indexing. Actual project records retain their evidence and limitation labels.

## Link audit

The prior dated reachability audit checked 77 URLs: 76 returned HTTP 200 and one Render demo timed out. This is retained in `link-audit.json`; HTTP success is not proof of remote application correctness. Remote outages cannot be repaired inside this portfolio repository.
