# Datta's portfolio

Plain HTML + CSS + vanilla JS. No build step.

```
index.html   style.css   script.js   bot.js   assets/
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

## Shortcuts
`/` opens the command palette (or the `/` button in the nav). Commands: `ask`, `json`, `theme`, `resume`, plus every section and link.
