# Student's Blackboard — Approved Design Specification

**Design lock:** Phase 1 approved by the user on 26 October 2026. Do not replace it with a generic developer portfolio template without explicit approval.

## Visual language
- Primarily white/off-white paper background, thin notebook-grid lines and strong black geometry/borders.
- Four adjacent rectangular navigation boxes: Home, Work, Blogs, About Me. On pointer hover/selection their colors change discretely to red, blue, green and yellow respectively (no fluid gradient).
- Student/classroom identity: modest handwritten annotations, paper cards, a green chalkboard, a noticeboard, colored-paper work entries and diagonal tile split.
- Accessible controls and responsive layouts without turning the design into a different theme.

## Splash
- A multilingual welcome: Namaste/నమస్తే, Hello, Bonjour, other greetings, and World. Offers an explicit Enter action. No forced delay; respect reduced motion. Provide an Intro replay control.

## Home
- Intro copy **left**, uploaded photo **right**, ALWAYS side-by-side, including on mobile. Crop portrait without removing architectural backdrop. This correction was explicitly approved.
- Action buttons View CV and Download CV link to the actual PDF.
- Below hero: single large rectangular/square area split diagonally into separate **Projects** and **Research** click targets. Adjacent smaller rectangular Hackathons and Open Source areas. Rectangular quick links.
- Green chalkboard contains carousel/slides of the user's actual internships and campus work experience. Separate achievements/noticeboard section below.

## Work
- Filters: All, Projects, Research, Hackathons, Open Source. Each item is a colored paper rectangle.
- Detail view shows genuine description, stack, stage, and verified links only.
- Research subfilters: **Ongoing** and **Published**. Do not claim any published paper without verified publication details; default Published empty.

## Blogs
- Same notebook/page idiom. No demo articles presented as the user's publications. Default honest empty state until actual posts are provided.

## About Me
- One real photo in gallery; no invented photographs.
- Education, summarized internship experience, technical skills, certificates/credentials, personal interests/roadmap. Recognitions must not masquerade as completion certificates.

## Footer
- Approved phrase: "Stop doing. Start doing." Email contact, social-link mini traffic-light window (GitHub, LinkedIn, email).

## Phase 2 engineering constraints
- Next.js App Router + React + Tailwind-supported CSS + Motion for React. Typed content stored under `/content`, ready for later CMS replacement.
- Maintain focus and keyboard navigation, contrast, labels, `prefers-reduced-motion`, and responsive image usage.
- Semantic project lifecycle labels (built, in development, planned, research in progress, contributions). Avoid false completion/publication claims.
- Admin OTP and database are **Phase 3**, not included in the current frontend; never say they are live.
