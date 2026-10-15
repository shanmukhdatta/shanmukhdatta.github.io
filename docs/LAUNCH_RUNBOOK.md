# Preview, launch and rollback

The feature branch is the deployable application source. Keep `main` and the existing Pages site unchanged until a preview passes the release checklist. No domain or live deployment is changed by CI.

## Start a review preview

1. Import this repository/branch into a Node-capable host such as Vercel. Use `npm ci`, `npm run build` and the Next.js framework preset.
2. Set `NEXT_PUBLIC_SITE_URL` to the preview's intended canonical URL. Keep all other `.env.example` values private on the server.
3. Apply the complete, idempotent `db/schema.sql` in the private Supabase project. Create the public `portfolio-media` Storage bucket; do not grant visitor upload privileges.
4. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, a long random `SESSION_SECRET`, and `ADMIN_EMAIL`. Configure Resend's approved sender in `RESEND_API_KEY`, `MAIL_FROM`, and `CONTACT_TO_EMAIL`. Configure Groq only when live AI is desired. Missing providers fail closed and keep local Maya/email-link fallback available.
5. Run `npm run check`. CI additionally runs `npm run test:e2e` on Chromium desktop and Pixel-sized mobile emulation, including axe contrast/accessibility and resource/time/overflow budgets.
6. In the preview, verify owner OTP delivery and single-use behavior, two-session revision conflict, private drafts/history/export, valid and invalid media uploads, actual contact provider acceptance/inbox archival, and a bounded live Maya reply with server-selected citations. These live integrations cannot be certified by simulated tests.

## Editorial release checklist

- Replace sample photos and demo resume, or intentionally retain the visible demo labels. Set `site.demoAssets=false` only after replacing them.
- Verify personal names, role dates, paper permissions, source links and measurement provenance. No measurement may be published without source, dataset, version and setup.
- Finish private inventory slots inside the authenticated register. They are not present in public JSON, search or Maya.
- Review articles and studies as drafts; Publish only after preview and permission review. Demo writing remains marked and excluded from search indexing.
- Verify redirects in the preview. Only local destinations are allowed; cycles are rejected.
- Review the desktop/mobile screenshot artifact from the final successful CI commit. Automated checks supplement visual owner review.

## Cutover

1. Record the exact preview deployment/version and commit.
2. Export a private content backup through Control Center. Keep the export private.
3. Tag the original main commit before release: `git tag portfolio-before-launch origin/main`, then push that tag using an authorized GitHub session. Never move or overwrite an existing backup tag.
4. Approve the PR and production deployment. Set the final canonical URL. Configure a custom domain only after ownership/DNS approval.
5. Keep GitHub Pages as a fallback, or deliberately configure forwarding only after the new site and all providers pass live tests.

## Rollback

- Application regression: promote the recorded previous deployment/version, then verify home, project routes, owner sign-in and contact fallback.
- Content regression: load a historical private snapshot into a draft, preview, then publish explicitly. Current revision guards prevent silent overwrites.
- Provider outage: disable the failing provider configuration; local Maya and mail links continue to work. Never report an unconfirmed email as delivered.
- Restore the Pages fallback if a hosting cutover fails. Do not overwrite the backup tag.

Rollback commands and service configuration are documented for the owner; this run did not change DNS or perform a production cutover.
