# Datta's portfolio

Plain HTML + CSS + vanilla JS. No build step.

```
index.html   style.css   script.js   bot.js   viz.js   assets/
proxy/api/ask.js      <- Vercel serverless function for the Ask Datta bot
```

## Edit the content
Everything on the page lives in the `CONTENT` object at the top of `script.js`. Search the repo for `[ADD` to find placeholders. The bot's facts (`buildFacts()` in `bot.js`) and the "View as JSON" page are built from the same object, and placeholders are dropped from the facts. Put your photo in `assets/` and set `profile.photo`.

## Run locally
```
python -m http.server 8000
```
Open http://localhost:8000. Use port 8000: the proxy only allows `localhost:8000` and `127.0.0.1:8000` for local testing.

## Deploy the site (GitHub Pages)
1. Create a repo named `shanmukhdatta.github.io` and push this folder to `main`.
2. Repo Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at https://shanmukhdatta.github.io. The `proxy/` folder is ignored by Pages.

## Deploy the proxy (Vercel), what you must set
The Groq key never goes in any file. It exists only as a Vercel environment variable.

1. Get a key at https://console.groq.com/keys.
2. Vercel dashboard > Add New > Project > import the same GitHub repo.
3. In the import screen set:

| Setting | Value |
|---|---|
| Root Directory | `proxy` |
| Framework Preset | Other |
| Build / Output settings | leave empty |
| Environment Variable | Name `GROQ_API_KEY`, Value = your Groq key, environments Production (and Preview if you want) |

4. Deploy. Your endpoint is `https://<your-project>.vercel.app/api/ask`.
5. Edit two things in the code, commit and push:
   - `bot.js`: `PROXY_URL = "https://<your-project>.vercel.app/api/ask"`
   - `proxy/api/ask.js`: `GROQ_MODEL = "<a current Llama model id from https://console.groq.com/docs/models>"`
6. If you change an environment variable later, redeploy the Vercel project so it takes effect.

Test it (should return `{"answer": ...}`):
```
curl -X POST https://<your-project>.vercel.app/api/ask \
  -H "Origin: https://shanmukhdatta.github.io" -H "Content-Type: application/json" \
  -d '{"question":"What is QTagger+?","facts":"QTagger+ is a quantum-kernel malware classification project."}'
```
Errors: `403 origin not allowed` means the Origin is not in `ALLOWED_ORIGINS` (add your custom domain there if you use one); `500 ... is not set` means `GROQ_API_KEY` or `GROQ_MODEL` is missing.

## How the bot stays safe
- The front-end has no key. It sends `{question, history (last 4 messages), facts}` to the proxy.
- The proxy checks the origin allow-list, limits questions to 300 characters, caps facts at 8000 characters, limits each IP to 20 requests per 10 minutes (in memory, per warm instance), and asks Groq for at most 300 tokens.
- `facts` come from the browser, so a determined visitor could send different facts. The origin list, rate limit and token cap keep that low-risk; if you want it locked down, move the facts into `proxy/` and stop accepting them from the client.
- The page also allows 10 questions per session.

## Visuals (Phase 3, `viz.js`)
Plain JS, canvas and inline SVG. No libraries, no build step, no network calls. It loads after `script.js` and reuses its globals (`$`, `$$`, `C`, `RM`, `root`, `svg`).

- **Hero loss curves.** A canvas behind the hero draws a noisy training-loss curve (accent, 60% opacity) and two faint validation curves over 2.4s. The curves are generated from a fixed seed, so every visit shows the same picture, and they are decorative, not real results. Hovering the hero shows `epoch N · loss X.XX` along the curve. The canvas has `pointer-events:none` (the pointer is tracked on the hero), handles `devicePixelRatio` (capped at 2) and resize, pauses when offscreen or when the tab is hidden, and redraws on theme change.
- **Architecture views.** Voice Doctor, Intrusion Detection, LifeSync and ChronoMind projects get an **Architecture** button (visible when the tile is open) that opens the existing modal with an inline SVG. Esc closes it, Tab is trapped inside, and focus returns to the button. Nodes drift slightly; hover, keyboard focus or a tap highlights the node, its edges and its neighbours and shows a tooltip.
  - Voice Doctor: `network: 0 bytes` counter and a memory bar labelled *illustrative*.
  - LifeSync: sequential vs `asyncio.gather` race, labelled *illustrative*. The call durations are made up for the animation; they are not measurements.
  - Replay buttons on Voice Doctor and LifeSync. Intrusion Detection and ChronoMind loop.
- **Edit a view.** Each view is an entry in the `VIEWS` object in `viz.js` (`layout()` places the nodes, `bind()` draws one frame from a time value). Node and edge text come from the same strings used in the project descriptions, so keep them in sync if you change the copy.
- **Motion rules.** Only `transform` and `opacity` are animated in CSS/SVG. With `prefers-reduced-motion` the canvas and every view draw their final static frame, drift is off, and Replay is hidden.
- **Tokens.** Everything uses the tokens in `style.css` (`--bd` for grid lines, `--muted`, `--accent`, `--mono`). One token was added, `--danger`, used only for the flagged-anomaly packet and label.

## Shortcuts
`/` opens the command palette (or the `/` button in the nav). Commands: `ask`, `json`, `theme`, `resume`, plus every section and link.
