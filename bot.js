/* Phase 2: Ask Datta bot, command palette, JSON view. Uses globals from script.js (CONTENT, $, svg, IC, isPh, toast, RM, root). */
const PROXY_URL = "[ADD PROXY URL]"; // e.g. "https://your-project.vercel.app/api/ask"  (no API key ever goes in the front-end)
const MAX_Q = 10, MAX_LEN = 300;
IC.term = "M4 17l6-6-6-6M12 19h8";

/* Facts for the bot are built from CONTENT so they never drift. Placeholders are dropped. */
const strip = s => String(s).replace(/<[^>]+>/g, "").replace(/\s*\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
function buildFacts() {
  const c = CONTENT, p = c.profile, ok = s => s && !/^\s*\[/.test(s), f = [];
  f.push(`Name: ${p.name}, goes by ${p.short}. ${p.tagline}. ${p.intro}`, p.interests);
  c.research.forEach(r => f.push(`Research "${r.title}" (status: ${r.badge}). ${r.summary} Method: ${r.method}` + (ok(r.result) ? ` Result: ${r.result}` : "")));
  c.experience.forEach(e => f.push(`${e.dates}: ${e.role} at ${e.org} (${e.kind}). ${e.text}`));
  c.otherRoles.forEach(r => f.push(r));
  c.projects.forEach(x => f.push(`Project ${x.name}: ${x.short}` + (ok(x.desc) ? ` ${x.desc}` : "") + (x.stack.length ? ` Stack: ${x.stack.join(", ")}.` : "")));
  c.updates.filter(u => ok(u[0]) && ok(u[1])).forEach(u => f.push(`${u[0]}: ${u[1].replace("[CONFIRM]", "(not yet confirmed)")}`));
  c.recognition.filter(ok).forEach(r => f.push(r));
  f.push(`Open source: ${c.oss.title}. ${c.oss.text}`);
  c.about.forEach(a => f.push(a[1]));
  f.push("Skills: " + Object.entries(c.skills).map(([g, v]) => `${g}: ${v.join(", ")}`).join("; "));
  return f.map(strip).filter(Boolean).join("\n").slice(0, 7500);
}

/* ===== DOM ===== */
document.body.insertAdjacentHTML("beforeend", `
<button class="fab" id="askbtn" aria-expanded="false" aria-controls="term">${svg("term")}ask-datta</button>
<section class="term" id="term" role="dialog" aria-label="Ask Datta terminal">
  <div class="th"><span>ask-datta</span><button id="tclose" aria-label="Close terminal">${svg("x")}</button></div>
  <div class="tb" id="tlog" aria-live="polite"><p class="dim">Ask about Datta's research, projects or experience. Answers use only the facts on this site.</p><div class="tchips" id="tchips"></div></div>
  <form class="tin" id="tform"><label for="tq" class="sr">Your question</label><span aria-hidden="true">$</span><input id="tq" maxlength="${MAX_LEN}" autocomplete="off" placeholder="ask something…"><button class="tsend" aria-label="Send question">↵</button></form>
</section>
<dialog id="pal" aria-label="Command palette"><input id="pq" role="combobox" aria-expanded="true" aria-controls="pl" aria-label="Type a command or section" placeholder="Jump to… or type ask, json, theme, resume" autocomplete="off"><ul id="pl" role="listbox"></ul><div class="hint mono small">↑↓ navigate · ↵ select · esc close</div></dialog>
<dialog id="jv" aria-labelledby="jt"><div class="jh"><h2 id="jt">GET /datta → 200 OK</h2><div class="acts"><button class="btn" id="jcopy">Copy</button><button class="btn p" id="jback">Back to site</button></div></div><pre class="jp" tabindex="0" aria-label="Site content as JSON"><code id="jp"></code></pre></dialog>`);
$(".right").insertAdjacentHTML("afterbegin", `<button class="ib mono" id="palbtn" aria-label="Open command palette" title="Command palette ( / )">/</button>`);
$("#home .acts")?.insertAdjacentHTML("beforeend", `<button class="btn" id="jsonbtn">{ } View as JSON</button>`);

/* ===== Ask Datta ===== */
const term = $("#term"), log = $("#tlog"), inp = $("#tq"), sleep = ms => new Promise(r => setTimeout(r, ms));
let used = 0, busy = false, hist = [];
const add = (cls, text) => { const d = document.createElement("div"); d.className = cls; d.textContent = text; log.append(d); log.scrollTop = log.scrollHeight; return d; };
function openBot() { term.classList.add("on"); document.body.classList.add("bot-open"); $("#askbtn").setAttribute("aria-expanded", "true"); setTimeout(() => inp.focus(), 60); }
function closeBot() { term.classList.remove("on"); document.body.classList.remove("bot-open"); const b = $("#askbtn"); b.setAttribute("aria-expanded", "false"); b.focus(); }
["What is Datta researching?", "Explain the facial skin disease project", "What is QTagger+?", "Why hire Datta?"].forEach(t => {
  const b = document.createElement("button"); b.type = "button"; b.textContent = t; b.onclick = () => ask(t); $("#tchips").append(b); });
async function fetchAnswer(q) {
  if (isPh(PROXY_URL)) throw new Error("unset");
  const r = await fetch(PROXY_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, history: hist.slice(-4), facts: buildFacts() }) });
  if (!r.ok) throw new Error(String(r.status));
  const j = await r.json(); if (!j.answer) throw new Error("empty"); return j.answer;
}
async function ask(q) {
  q = q.trim().slice(0, MAX_LEN); if (!q || busy) return;
  if (used >= MAX_Q) return add("err", "Session limit reached (10 questions). Email me for anything else.");
  busy = true; used++; $("#tchips").hidden = true; inp.value = ""; add("u", q);
  const st = add("st", ""), req = fetchAnswer(q).then(a => ({ a }), e => ({ e }));
  for (const s of ["[1/3] parse intent…", "[2/3] retrieve facts…", "[3/3] synthesize answer…"]) { st.append(Object.assign(document.createElement("div"), { textContent: s })); log.scrollTop = log.scrollHeight; await sleep(RM ? 0 : 420); }
  const { a, e } = await req;
  if (e) {
    used--; busy = false;
    return add("err", e.message == "unset" ? "The bot isn't connected yet (proxy URL not set). Email me instead." : e.message == "429" ? "Too many questions right now. Try again in a few minutes." : "Couldn't reach the answer service. Try again shortly, or email me.");
  }
  const ans = a.split(/(?<=[.!?])\s+/).slice(0, 4).join(" "), el = add("a", "");
  hist.push({ role: "user", content: q }, { role: "assistant", content: ans });
  if (RM) el.textContent = ans; else for (let i = 3; i < ans.length + 3; i += 3) { el.textContent = ans.slice(0, i); log.scrollTop = log.scrollHeight; await sleep(14); }
  el.textContent = ans; log.scrollTop = log.scrollHeight; busy = false;
}
$("#askbtn").onclick = () => term.classList.contains("on") ? closeBot() : openBot();
$("#tclose").onclick = closeBot;
term.addEventListener("keydown", e => { if (e.key == "Escape") closeBot(); });
$("#tform").onsubmit = e => { e.preventDefault(); ask(inp.value); };

/* ===== JSON view ===== */
const jv = $("#jv"); let jtxt = "";
const hl = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])).replace(/("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g,
  (m, str, colon, bool) => str ? (colon ? `<span class="tk-k">${str}</span>${colon}` : `<span class="tk-s">${str}</span>`) : `<span class="${bool ? "tk-b" : "tk-n"}">${m}</span>`);
function openJson() { jtxt = JSON.stringify(CONTENT, null, 2); $("#jp").innerHTML = hl(jtxt); jv.showModal(); $("#jback").focus(); }
$("#jsonbtn").onclick = openJson; $("#jback").onclick = () => jv.close();
$("#jcopy").onclick = async e => { const b = e.currentTarget; try { await navigator.clipboard.writeText(jtxt); b.textContent = "Copied!"; } catch (x) { b.textContent = "Copy failed"; } setTimeout(() => b.textContent = "Copy", 1600); };

/* ===== Command palette ===== */
const pal = $("#pal"), pq = $("#pq"), pl = $("#pl"); let items = [], ai = 0;
const SECS = [["Home", "home"], ["Research", "research"], ["Updates", "updates"], ["Projects", "projects"], ["Experience", "experience"], ["Open source", "open-source"], ["Recognition", "recognition"], ["Writing", "writing"], ["About", "about"], ["Contact", "contact"]];
const go = id => { const el = $("#" + id); if (!el) return; let w = 0; if (/^(updates|open-source|writing|about)$/.test(id) && root.dataset.mode == "recruiter") { $("[data-m=researcher]").click(); w = 450; } setTimeout(() => el.scrollIntoView({ behavior: RM ? "auto" : "smooth" }), w); };
const ext = u => () => isPh(u) ? toast("That link isn't set yet") : window.open(u, "_blank", "noopener");
const L = CONTENT.links;
const CMDS = [...SECS.map(([n, id]) => ({ l: "Go to " + n, d: "section", k: "", run: () => go(id) })),
  { l: "ask", d: "open the Ask Datta terminal", k: "bot chat question", run: openBot },
  { l: "json", d: "view site content as JSON", k: "data api", run: openJson },
  { l: "theme", d: "toggle light / dark", k: "dark mode", run: () => $("#theme").click() },
  { l: "resume", d: "open résumé", k: "cv pdf", run: ext(L.resume) },
  { l: "GitHub", d: "link", k: "code", run: ext(L.github) }, { l: "LinkedIn", d: "link", k: "", run: ext(L.linkedin) },
  { l: "shanXAI.com", d: "link", k: "website", run: ext(L.site) }, { l: "Copy email", d: "to clipboard", k: "contact mail", run: () => $("#copy").click() }];
function paint() {
  const q = pq.value.trim().toLowerCase(); items = CMDS.filter(c => (c.l + " " + c.d + " " + c.k).toLowerCase().includes(q));
  ai = Math.min(ai, Math.max(items.length - 1, 0));
  pl.innerHTML = items.map((c, i) => `<li role="option" id="po${i}" data-i="${i}" aria-selected="${i == ai}"><span>${c.l}</span><span class="small mono">${c.d}</span></li>`).join("") || '<li class="small">No matches</li>';
  pq.setAttribute("aria-activedescendant", items.length ? "po" + ai : ""); pl.children[ai]?.scrollIntoView({ block: "nearest" });
}
function openPal() { pq.value = ""; ai = 0; paint(); pal.showModal(); pq.focus(); }
function runItem(i) { const c = items[i]; if (!c) return; pal.close(); setTimeout(c.run, 60); }
pq.oninput = () => { ai = 0; paint(); };
pq.addEventListener("keydown", e => {
  if (e.key == "ArrowDown" || e.key == "ArrowUp") { e.preventDefault(); if (items.length) { ai = (ai + (e.key == "ArrowDown" ? 1 : items.length - 1)) % items.length; paint(); } }
  else if (e.key == "Enter") { e.preventDefault(); runItem(ai); }
});
pl.onclick = e => { const li = e.target.closest("li[data-i]"); if (li) runItem(+li.dataset.i); };
pal.addEventListener("click", e => { if (e.target == pal) pal.close(); });
$("#palbtn").onclick = openPal;
addEventListener("keydown", e => {
  if (e.key != "/" || e.ctrlKey || e.metaKey || e.altKey || e.target.matches("input,textarea,select,[contenteditable]") || document.querySelector("dialog[open]")) return;
  e.preventDefault(); openPal();
});
