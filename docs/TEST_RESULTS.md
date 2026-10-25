# Sandbox validation log · Phase 2

## Checks completed
- **Content/assets:** `node scripts/check-content.mjs` passed; all required images and PDF were present and nonempty.
- **Source syntax:** TypeScript transpile parser verified syntax of all `.ts`/`.tsx` modules; no syntax diagnostics. This is **not** a TypeScript semantic typecheck.
- **Offline-preview browser:** Chromium loaded the uploaded portrait and exercised the DOM at 1280×960 and 390×844. Both passed photo-to-right/same-row, no horizontal overflow, next experience, Work navigation, research Published empty state and About navigation. Screenshots saved under `docs/previews/`.
- **Bug found and fixed:** A hidden offline-dialog overlay was intercepting clicks because author CSS overrode UA `[hidden]` behavior; added `[hidden]{display:none!important}`.

## Not yet verified
- No `npm install`, `npm run typecheck`, `npm run build` or Next.js runtime test was possible: npm package downloads returned `EAI_AGAIN` due restricted registry DNS.
- End-to-end project dialog / keyboard screen-reader audit in the actual React runtime is pending.
- No production hosting, CDN or CMS/OTP exists at Phase 2.

## Exact test reproduction
- `python tests/test_offline_preview.py` (optional Python playwright, Chromium at `/usr/bin/chromium`)
- `npm run test:content`
- `npm run typecheck && npm run build` once dependencies are accessible.
