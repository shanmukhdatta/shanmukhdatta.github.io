// Vercel serverless function: POST /api/ask -> { answer }
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b"; // Available: openai/gpt-oss-20b, openai/gpt-oss-120b, qwen/qwen3.8-27b
const ALLOWED_ORIGINS = ["https://shanmukhdatta.github.io", "http://localhost:8000", "http://127.0.0.1:8000"];
const LIMIT = 20, WINDOW_MS = 10 * 60 * 1000; // per IP, per warm serverless instance
const SYSTEM = "You are the assistant on Datta's portfolio. Answer in a friendly, concise way (max 4 sentences) using ONLY the facts in DATTA_FACTS. If the answer is not in the facts, say you don't know and suggest emailing him. Never invent projects, papers, employers, awards or numbers. Never call unpublished work published.";
const hits = new Map();

function limited(ip) {
  const now = Date.now(), a = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  a.push(now); hits.set(ip, a); if (hits.size > 5000) hits.clear();
  return a.length > LIMIT;
}

module.exports = async (req, res) => {
  const origin = req.headers.origin, allowed = ALLOWED_ORIGINS.includes(origin);
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin); res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "GET") {
    const key = process.env.GROQ_API_KEY;
    if (!key) return res.status(500).json({ error: "GROQ_API_KEY is not set" });
    try {
      const mr = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${key}` }
      });
      const mj = await mr.json();
      return res.status(mr.status).json(mj);
    } catch (e) {
      return res.status(502).json({ error: e.message });
    }
  }
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: "GROQ_API_KEY is not set" });
  if (!GROQ_MODEL) return res.status(500).json({ error: "GROQ_MODEL is not set" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return res.status(429).json({ error: "rate limited" });

  let b = req.body; if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = null; } }
  const q = b && typeof b.question === "string" ? b.question.trim() : "";
  const facts = b && typeof b.facts === "string" ? b.facts.slice(0, 8000) : "";
  if (!q || q.length > 300) return res.status(400).json({ error: "question must be 1-300 characters" });
  if (!facts) return res.status(400).json({ error: "facts missing" });
  const history = (Array.isArray(b.history) ? b.history : []).slice(-4)
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 600) }));

  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST", signal: ctl.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: GROQ_MODEL, max_tokens: 300, temperature: 0.3,
        messages: [{ role: "system", content: `${SYSTEM}\n\nDATTA_FACTS:\n${facts}` }, ...history, { role: "user", content: q }] })
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error("Groq upstream error:", r.status, errText);
      return res.status(502).json({ error: "upstream error", status: r.status, details: errText });
    }
    const j = await r.json();
    const answer = (j.choices?.[0]?.message?.content || "").trim().split(/(?<=[.!?])\s+/).slice(0, 4).join(" ");
    if (!answer) return res.status(502).json({ error: "empty answer" });
    return res.status(200).json({ answer });
  } catch { return res.status(502).json({ error: "upstream unreachable" }); }
  finally { clearTimeout(timer); }
};
