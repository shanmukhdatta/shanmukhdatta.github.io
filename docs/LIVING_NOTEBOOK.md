# The Living Notebook

The approved update keeps the notebook grid, colored navigation, chalkboard, introduction, real content and portrait beside the introduction. It adds a larger type hierarchy, shortcut strip, layered featured-work papers, illustrated empty state, section reveals, spring hover feedback and page transitions. Reduced-motion preferences disable automatic portrait rotation and decorative motion. Portrait controls pause rotation during interaction, offscreen visibility and hidden tabs.

## Bujji setup

Set `GROQ_API_KEY` in the hosting provider's **server** environment, then redeploy. Never prefix it with `NEXT_PUBLIC_`. Optional `GROQ_MODEL` defaults to `openai/gpt-oss-120b`. The application requires a Node.js host such as Vercel; GitHub Pages cannot run this endpoint.

Without a key, Bujji answers common questions from published portfolio content. Provider failures also return a clearly identified notebook answer. Live Groq requests have not been tested with an actual key. Answers are plain text; the assistant has no tools, CMS access or ability to send messages. Conversations stay in page memory; live questions and public portfolio context are sent to Groq.

Requests are bounded to nine messages, 1,600 characters per message, 18,000 body bytes and 12 requests per minute. For a distributed production limit, configure both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. The fallback limiter is per process and resets on restart; outside Vercel it shares one local bucket. Redis failure blocks requests. Configure provider spending limits separately. Real Redis credentials have not been tested.

## Replace the portraits

The reel contains the existing Jaipur portrait and four replaceable travel portraits. Replace the WebP files under `public/images/travel/`, keeping their names, or update `content/portraits.ts` with new paths and accurate alt text/captions. Keep portrait crops and optimize to roughly 900px width. The original CMS profile portrait remains the first slide. Four added assets total about 406KB and only the next portrait is prefetched.

## Verification

Passed locally: TypeScript, content validation, nine CMS unit tests, seven Bujji tests including a mocked Groq contract, production build and API/static-asset smoke tests. Browser checks confirmed home/work/about/blogs navigation, research filtering, project details, Bujji fallback response and Escape focus restoration. Earlier mobile checks caught a chat overflow issue, corrected in CSS. The latest browser viewport override did not take effect, so final automated responsive coverage is left to the PR workflow at 360, 390, 768 and 1440px, including reduced motion and chat fit.

Run `npm run test:bujji`, `npm run test:cms`, `npm run test:content`, `npm run typecheck`, `npm run build` and `node scripts/ci-smoke.mjs`. CI also runs the existing isolated PostgreSQL/email integration and production browser checks. Real hosted CMS/email/storage and live Groq/Redis are separate deployment checks.

Screenshots in `docs/previews/` show the production application. `preview.html` is a static screenshot companion; use `npm run dev` for animations and interaction. No production deployment or merge is part of this branch.
