/* ===== CONTENT — edit here; everything on the page is rendered from this object ===== */
const CONTENT = {
  profile: {
    name: "Boda Shanmukh Datta", short: "Datta", photo: "", // [ADD PHOTO] e.g. "assets/photo.jpg"
    tagline: "AI researcher · applied ML for security & healthcare · NIT Jalandhar",
    intro: "I'm an undergraduate researcher working on reliable, reproducible AI: medical imaging with synthetic data, quantum-kernel classifiers for malware, graph-based anomaly detection, and models that run on-device. I also build the systems around the research.",
    interests: "Research interests: reliable evaluation, synthetic data for medical imaging, quantum kernels for security, graph anomaly detection, on-device AI."
  },
  links: {
    email: "[ADD EMAIL]", github: "https://github.com/shanmukhdatta", linkedin: "https://www.linkedin.com/in/Shanmukh-Datta",
    scholar: "[ADD Google Scholar / OpenReview]", site: "https://shanXAI.com", resume: "[ADD RESUME PDF LINK]"
  },
  research: [
    { title: "Facial Skin Disease Classification", badge: "Preprint in preparation", tone: "w", venue: "DenseNet-121 · real + synthetic data",
      summary: "DenseNet-121 reaches 94.22% accuracy on real plus synthetic images, using leakage-aware perceptual-hash grouped splits.",
      problem: "Classify facial skin disease from images using real and synthetic data without train/test leakage.",
      method: "DenseNet-121 trained on real images plus synthetic images from Realistic Vision V5.1 and StyleGAN2-ADA. Splits are grouped by perceptual hash to avoid leakage, and the synthetic and real mixing fractions are set independently for reproducibility.",
      result: "94.22% accuracy. Preprint in preparation; not published.",
      links: [["GitHub", "https://github.com/shanmukhdatta/Facial_Skin_Diesease"], ["Paper", "[ADD PAPER LINK]"]] },
    { title: "QTagger+ (QWorld QIntern 2026)", badge: "Internship research", tone: "a", venue: "QWorld QIntern 2026 · Jun–Aug 2026",
      summary: "Quantum-kernel SVM pipeline for malware family classification on CIC-MalMem-2022, tested cross-corpus on EMBER.",
      problem: "Classify malware families on CIC-MalMem-2022 with a quantum-kernel SVM pipeline.",
      method: "Kernel concentration diagnostics, local vs. global measurement ablations, 8-seed significance testing, and EMBER cross-corpus testing.",
      result: "p = 0.011, Cohen's d = 1.21 (8 seeds).", links: [["Code", "[ADD LINK]"], ["Report", "[ADD LINK]"]] },
    { title: "Malware Detection under Class Imbalance", badge: "Research project", tone: "", venue: "CIC-MalMem-2022 · SOREL-20M · EMBER · MalDICT",
      summary: "Borderline-SMOTE and ADASYN compared on CIC-MalMem-2022, with datasets evaluated across SOREL-20M, EMBER and MalDICT.",
      problem: "Handle class imbalance in malware detection.", method: "Borderline-SMOTE and ADASYN compared on CIC-MalMem-2022; datasets evaluated across SOREL-20M, EMBER and MalDICT.",
      result: "[ADD RESULT]", links: [["Code", "[ADD LINK]"]] },
    { title: "Bitcoin Transaction Anomaly Detection", badge: "In progress", tone: "w", venue: "Graph anomaly detection",
      summary: "Anomaly detection on a transaction graph, with addresses as nodes and transactions as edges.",
      problem: "Detect anomalous activity in Bitcoin transactions.", method: "Transaction graph: addresses as nodes, transactions as edges.",
      result: "[ADD RESULT]", links: [["Code", "[ADD LINK]"]] }
  ],
  updates: [
    ["2026", "Selected as an Amazon ML Summer School 2026 scholar."],
    ["Jun–Aug 2026", "Research Intern at QWorld QIntern 2026 (QTagger+)."],
    ["2026", "Contributed to GirlScript Summer of Code (CodeGraphContext)."],
    ["2026", "Participating in Amazon ML Challenge 2026 (business entity resolution) [CONFIRM]."],
    ["[ADD DATE]", "[ADD: talks, awards, hackathon results, paper milestones]"]
  ],
  projects: [
    { n: "01", name: "Voice Doctor", cat: ["AI"], fl: 1, short: "Offline on-device voice-to-voice medical assistant for Android, targeting Telugu.",
      desc: "Whisper ASR → on-device Gemma → TTS with zero network dependency; a 2-4B parameter model under strict mobile memory limits using INT4/INT3 quantization and KV-cache optimization.", stack: ["Android", "C++", "Whisper", "Gemma"] },
    { n: "02", name: "Cybersecurity Intrusion Detection System", cat: ["Security", "AI"], short: "Hybrid supervised + unsupervised pipeline on NSL-KDD.",
      desc: "XGBoost/LightGBM/CatBoost combined with DBSCAN, Isolation Forest and GMM to flag known and zero-day traffic; agreement/disagreement features feed a stacked meta-model; deployed as a FastAPI real-time classification service.", stack: ["XGBoost", "LightGBM", "CatBoost", "DBSCAN", "Isolation Forest", "GMM", "FastAPI"] },
    { n: "03", name: "ChronoMind AI", cat: ["AI", "Backend"], short: "Agentic backend with a modular 3-stage pipeline and pluggable tools.",
      desc: "Parse intent → execute tool → synthesize response; JWT auth with Google OAuth 2.0; PaddleOCR ingestion converting images into structured SQLite records; backend and frontend deployed as independent services (Render + Vercel).", stack: ["FastAPI", "LangGraph", "SQLite", "React"] },
    { n: "04", name: "LifeSync AI", cat: ["Backend", "AI"], short: "Multi-API assistant integrating 10 Google APIs.",
      desc: "asyncio.gather() to parallelize I/O; SOLID service-oriented design; rate limiting (SlowAPI, 100 req/min); stateless JWT sessions with server-side refresh; 20+ unit tests using real and mocked service pairs.", stack: ["asyncio", "SlowAPI", "JWT"] },
    { n: "05", name: "workspace-mcp", cat: ["AI", "Backend"], short: "Python MCP server with sandboxed filesystem tools for AI agents.", desc: "22 tools, 83 tests.", stack: ["Python", "MCP"] },
    { n: "06", name: "ShanXBot", cat: ["AI", "Web"], short: "Multi-LLM agentic chatbot on Groq, Gemini and OpenRouter.", desc: "Live at shan-x-bot.vercel.app.", stack: ["Groq", "Gemini", "OpenRouter"], live: "https://shan-x-bot.vercel.app" },
    { n: "07", name: "AI Resume Copilot", cat: ["AI", "Backend"], short: "FastAPI + LangGraph multi-agent backend.", desc: "[ADD DESCRIPTION]", stack: ["FastAPI", "LangGraph"] },
    { n: "08", name: "Smart Stadium Copilot", cat: ["AI"], short: "Built for the FIFA World Cup 2026 hackathon.", desc: "[ADD DESCRIPTION]", stack: [] },
    { n: "09", name: "CarbonWise AI", cat: ["AI"], short: "Carbon footprint tracker.", desc: "[ADD DESCRIPTION]", stack: [] },
    { n: "10", name: "ElectIQ", cat: ["AI"], short: "Election chatbot.", desc: "[ADD DESCRIPTION]", stack: [] }
  ],
  experience: [
    { hash: "f3a9c21", dates: "Dec 2025 – Present", role: "Web Development Team Member", org: "Center for Training & Placement, NIT Jalandhar", kind: "engineering",
      text: "Maintain the institutional placement portal (MERN) in production; REST endpoints for student-data pipelines and company-registration workflows for the entire graduating batch; Git-based code review." },
    { hash: "b7e401d", dates: "Jun 2026 – Aug 2026", role: "Research Intern (Applied ML for Security)", org: "QWorld QIntern 2026", kind: "research",
      text: "4-class malware classification pipeline combining gradient-boosted feature selection with kernel-based classifiers; evaluated cross-dataset generalization from CIC-MalMem-2022 to EMBER." },
    { hash: "1c88ae4", dates: "Aug 2025 – Nov 2025", role: "Software Engineering Intern", org: "Infosys Springboard", kind: "engineering",
      text: "Full-stack AI music composition system (React + Flask REST API) with a YAMNet audio-analysis service for real-time mood detection; Base64 audio streaming and IndexedDB offline caching; owned it end to end." }
  ],
  otherRoles: ["AI Lead, GDGC NIT Jalandhar", "Institute Internship Representative, NIT Jalandhar"],
  oss: { title: "CodeGraphContext · GSSoC 2026", text: "Improved cross-file call-graph resolution (issue #1573).", link: "[ADD LINK]" },
  skills: {
    "ML / AI": ["PyTorch", "TensorFlow", "scikit-learn", "LangChain", "LangGraph", "XGBoost"],
    "Research topics": ["synthetic data", "quantum kernels", "anomaly detection", "class imbalance", "reproducibility"],
    "Languages": ["Python", "C++", "Java", "JavaScript", "SQL"],
    "Backend": ["FastAPI", "Flask", "Node.js", "REST", "OAuth 2.0", "JWT", "async I/O"],
    "Infra": ["Linux", "Docker", "AWS", "Git/GitHub", "MySQL", "MongoDB", "SQLite"],
    "Web": ["React", "MERN"]
  },
  recognition: [
    "<b>Amazon ML Summer School 2026 Scholar.</b> Selected for advanced training in probability and statistics, classical ML, deep learning, reinforcement learning and causal inference.",
    "<b>AI Lead</b>, Google Developer Groups on Campus (GDGC), NIT Jalandhar.",
    "<b>Institute Internship Representative</b>, NIT Jalandhar.",
    "[ADD certificates or hackathon wins]"
  ],
  writing: [
    { title: "[ADD TITLE]", date: "[ADD DATE]", tag: "[ADD TAG]", link: "[ADD LINK]", summary: "Suggested topic: leakage-aware splits for medical image datasets." },
    { title: "[ADD TITLE]", date: "[ADD DATE]", tag: "[ADD TAG]", link: "[ADD LINK]", summary: "Suggested topic: quantum kernels for malware classification, and what concentration diagnostics show." },
    { title: "[ADD TITLE]", date: "[ADD DATE]", tag: "[ADD TAG]", link: "[ADD LINK]", summary: "Suggested topic: fitting a 2-4B model on a phone with INT4, INT3 and KV-cache." }
  ],
  about: [
    ["01 / Background", "I'm pursuing a B.Tech in Instrumentation and Control Engineering with a Minor in Artificial Intelligence at NIT Jalandhar (July 2024 onward)."],
    ["02 / Research", "I care about evaluating AI honestly: leakage-aware data splits, significance testing, cross-dataset generalization, and reproducible repositories."],
    ["03 / Beyond", "I lead AI at GDGC NIT Jalandhar, represent internships at the institute, and take part in hackathons and open source. [ADD one line about hobbies or travel]"]
  ]
};

/* ===== helpers ===== */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement, C = CONTENT;
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isPh = u => !u || u.startsWith("[");
const IC = {
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  gh: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  li: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zM20 17v5H6.5A2.5 2.5 0 0 1 4 19.5",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z", menu: "M3 6h18M3 12h18M3 18h18", x: "M18 6L6 18M6 6l12 12", up: "M12 19V5M5 12l7-7 7 7"
};
const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[k]}"/></svg>`;
const A = (label, u, cls = "btn") => isPh(u)
  ? `<span class="${cls} ph" title="${u || ""}">${label}</span>`
  : `<a class="${cls}" href="${u}"${u[0] === "#" ? "" : ' target="_blank" rel="noopener"'}>${label}</a>`;
const IB = (k, label, u) => isPh(u)
  ? `<span class="ib ph" role="img" aria-label="${label} (not set yet)" title="${u}">${svg(k)}</span>`
  : `<a class="ib" aria-label="${label}" title="${label}" href="${u}"${u.startsWith("mailto") ? "" : ' target="_blank" rel="noopener"'}>${svg(k)}</a>`;
const toast = t => { const e = $("#toast"); e.textContent = t; e.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("on"), 1800); };
const H = (n, i, extra = "") => `<div class="sh"><span><b>@@</b> ${n} <b>@@</b>${extra}</span><i></i><span>${i}</span></div>`;
const sec = (id, n, i, body, deep, extra) => `<section id="${id}" class="sec${deep ? " deep" : ""}"><div class="${deep ? "dw" : ""}"><div class="wrap">${H(n, i, extra)}${body}</div></div></section>`;

/* ===== render ===== */
function render() {
  const P = C.profile, L = C.links;
  const hero = `<section id="home" class="sec hero"><div class="wrap">
    <div class="pic rv"><div class="avatar" role="img" aria-label="Portrait of ${P.name}">${P.photo ? `<img src="${P.photo}" alt="">` : "BD"}</div></div>
    <div><p class="mono small rv">/* profile.datta */</p>
    <h1 aria-label="${P.name}"><span id="name" aria-hidden="true"></span></h1>
    <p class="mono tag rv">${P.tagline}</p><p class="intro rv">${P.intro}</p>
    <div class="ir rv">${IB("mail", "Email", isPh(L.email) ? L.email : "mailto:" + L.email)}${IB("gh", "GitHub", L.github)}${IB("li", "LinkedIn", L.linkedin)}${IB("book", "Google Scholar / OpenReview", L.scholar)}${IB("globe", "shanXAI.com", L.site)}</div>
    <div class="acts rv">${A("View research", "#research", "btn p")}${A("Résumé", L.resume)}</div></div></div></section>
    <div class="seg-wrap"><div class="seg rv" role="group" aria-label="Reading mode"><button data-m="recruiter">Recruiter (30s)</button><button data-m="researcher">Researcher (deep dive)</button></div></div>`;

  const research = sec("research", "research", "02", `<p class="mono small lead">${P.interests}</p><div class="grid">${C.research.map((r, i) =>
    `<article class="card rv${i > 2 ? " dx" : ""}"><div class="fig">[ADD FIGURE]</div><span class="b ${r.tone}">${r.badge}</span><h3>${r.title}</h3><p class="mono small">${r.venue}</p><p>${r.summary}</p>
    <div class="acts"><button class="btn" data-r="${i}">Details</button>${r.links.map(([l, u]) => A(l, u)).join("")}</div></article>`).join("")}</div>`);

  const LIM = 5, ups = C.updates.map(([d, t]) => `<div class="row"><span class="mono">${d}</span><span>${t}</span></div>`);
  const updates = sec("updates", "updates", "03", ups.slice(0, LIM).join("") + (ups.length > LIM ? `<div class="more" id="more"><div>${ups.slice(LIM).join("")}</div></div><p style="margin-top:16px"><button class="btn" id="showall" aria-expanded="false">Show all</button></p>` : ""), 1);

  const projects = sec("projects", "projects", "04", `<p class="lead">Research is why I build. These are the systems I've shipped around it.</p>
    <div class="filters" role="group" aria-label="Filter projects">${["All", "AI", "Backend", "Security", "Web"].map((f, i) => `<button class="b" data-f="${f}" aria-pressed="${i == 0}">${f}</button>`).join("")}</div>
    <div class="grid g3" id="pgrid">${C.projects.map((p, i) => `<article class="card tile rv${p.fl ? " fl" : ""}${i > 3 ? " dx" : ""}" tabindex="0" aria-expanded="false" data-c="${p.cat.join(",")}">
      <span class="n">${p.n}</span>${p.live ? '<span class="b ok">live</span> ' : ""}${p.fl ? '<span class="b a">flagship</span>' : ""}<h3>${p.name}</h3><p class="small">${p.short}</p>
      <div class="det"><div><div class="in"><p>${p.desc}</p><div class="chips">${p.stack.map(s => `<span class="b mono">${s}</span>`).join("")}</div>
      <div class="acts" style="margin-top:12px">${A("GitHub", "[ADD GITHUB LINK]")}${A(p.live ? "Live" : "Demo", p.live || "[ADD DEMO LINK]")}</div></div></div></div></article>`).join("")}</div>`, 0, ' &nbsp;<span class="small">index / 01–10</span>');

  const exp = sec("experience", "experience", "05", `<ol class="tl" id="tl">${C.experience.map((e, i) => `<li class="rv${i == 0 ? " head" : ""}"><div class="meta mono"><span class="hash">${e.hash}</span><span>${e.dates}</span>${i == 0 ? '<span class="b hd">HEAD</span>' : ""}<span class="b ${e.kind == "research" ? "a" : ""}">${e.kind}</span></div>
    <h3>${e.role} @ ${e.org}</h3><p>${e.text}</p></li>`).join("")}</ol><div class="plain-rows">${C.otherRoles.map(r => `<p>${r}</p>`).join("")}</div>`);

  const o = C.oss;
  const oss = sec("open-source", "open source", "06", `<div class="panel"><p class="mono">${o.title}</p><p>${o.text} ${A("Contribution", o.link, "b")}</p>${Object.entries(C.skills).map(([g, v]) => `<p class="mono small gl">${g}</p><div class="chips">${v.map(s => `<span class="b">${s}</span>`).join("")}</div>`).join("")}</div>`, 1);

  const rec = sec("recognition", "recognition", "07", `<ul class="list">${C.recognition.map(r => `<li>${r.startsWith("[") ? `<span class="small">${r}</span>` : r}</li>`).join("")}</ul>`);

  const writing = sec("writing", "writing", "08", `<div class="grid">${C.writing.map(w => `<article class="card rv"><div class="meta mono"><span>${w.date}</span><span class="b">${w.tag}</span></div><h3>${w.title}</h3><p>${w.summary}</p><div class="acts">${A("Read", w.link)}</div></article>`).join("")}</div>`, 1);

  const about = sec("about", "about", "09", `<div class="about">${C.about.map(([k, t]) => `<p class="rv"><span class="mono small">${k}</span><span>${t}</span></p>`).join("")}</div>`, 1);

  const contact = sec("contact", "contact", "10", `<p class="big">Let's do research together.</p><div class="acts"><button class="btn p" id="copy">${svg("mail")} Copy email</button>${A("GitHub", L.github)}${A("LinkedIn", L.linkedin)}</div>`);

  $("#main").innerHTML = hero + research + updates + projects + exp + oss + rec + writing + about + contact;
  $("#links").innerHTML = ["Home", "Research", "Projects", "Experience", "Writing", "About"].map(n => `<a href="#${n.toLowerCase()}">${n}</a>`).join("") + A("Résumé", L.resume);
  $("#foot").innerHTML = `<div class="bar"><div class="fl2"><a href="#research">Research</a><a href="#projects">Projects</a><a href="${L.github}" target="_blank" rel="noopener">GitHub</a><a href="${L.linkedin}" target="_blank" rel="noopener">LinkedIn</a></div>
    <span class="small">Made with ♥ in Jalandhar</span><a class="btn" href="#home" aria-label="Back to top">${svg("up")} Top</a></div><p class="mono" id="eof" aria-label="// EOF"></p>`;
  $("#burger").innerHTML = svg("menu");
}

/* ===== behaviour ===== */
function init() {
  // theme
  const setIcon = () => { $("#theme").innerHTML = svg(root.dataset.theme == "dark" ? "sun" : "moon"); $("meta[name=theme-color]").content = root.dataset.theme == "dark" ? "#0c0c0e" : "#fafaf7"; };
  setIcon();
  $("#theme").onclick = () => { root.dataset.theme = root.dataset.theme == "dark" ? "light" : "dark"; try { localStorage.setItem("theme", root.dataset.theme) } catch (e) { } setIcon(); };
  // mode
  const setMode = m => { root.dataset.mode = m; $$("[data-m]").forEach(b => b.setAttribute("aria-pressed", b.dataset.m == m)); try { localStorage.setItem("mode", m) } catch (e) { } };
  setMode(root.dataset.mode || "recruiter");
  $$("[data-m]").forEach(b => b.onclick = () => setMode(b.dataset.m));
  $$(".links a,footer a").forEach(a => a.addEventListener("click", () => { if (/#(writing|about|updates|open-source)/.test(a.hash)) setMode("researcher"); document.body.classList.remove("menu-open"); $("#burger").setAttribute("aria-expanded", "false"); }));
  // mobile menu
  $("#burger").onclick = () => { const o = document.body.classList.toggle("menu-open"); $("#burger").setAttribute("aria-expanded", o); $("#burger").innerHTML = svg(o ? "x" : "menu"); };
  addEventListener("keydown", e => { if (e.key == "Escape" && document.body.classList.contains("menu-open")) $("#burger").click(); });
  // typed name
  const nm = $("#name"), full = C.profile.name;
  if (RM) nm.textContent = full; else { let i = 0; nm.classList.add("caret"); (function t() { nm.textContent = full.slice(0, ++i); i < full.length ? setTimeout(t, 60) : setTimeout(() => nm.classList.remove("caret"), 2500); })(); }
  // clock
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tick = () => $("#clock").textContent = "Jalandhar · IST " + fmt.format(new Date()); tick(); setInterval(tick, 1000);
  // reveal (stagger 80ms among siblings)
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".rv").forEach(el => { const i = [...el.parentNode.children].filter(c => c.classList.contains("rv")).indexOf(el); el.style.setProperty("--d", Math.min(i, 6) * 80 + "ms"); io.observe(el); });
  // scroll: progress, nav, timeline draw
  const tl = $("#tl"); let tk = false;
  const onScroll = () => { tk = false; const y = scrollY, h = root.scrollHeight - innerHeight;
    $("#progress").style.transform = `scaleX(${h > 0 ? y / h : 0})`; $("#nav").classList.toggle("s", y > 20);
    const r = tl.getBoundingClientRect(); tl.style.setProperty("--p", Math.max(0, Math.min(1, (innerHeight * .65 - r.top) / r.height))); };
  addEventListener("scroll", () => { if (!tk) { tk = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
  // scroll-spy
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$(".links a").forEach(a => a.classList.toggle("on", a.hash == "#" + e.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
  ["home", "research", "projects", "experience", "writing", "about"].forEach(id => spy.observe($("#" + id)));
  // updates toggle
  const sa = $("#showall"); if (sa) sa.onclick = () => { const o = $("#more").classList.toggle("open"); sa.textContent = o ? "Show less" : "Show all"; sa.setAttribute("aria-expanded", o); };
  // project filter + tile expand
  $(".filters").onclick = e => { const b = e.target.closest("button"); if (!b) return; $$(".filters button").forEach(x => x.setAttribute("aria-pressed", x == b));
    $$(".tile").forEach(t => { const show = b.dataset.f == "All" || t.dataset.c.split(",").includes(b.dataset.f); t.classList.toggle("gone", !show); if (show) { t.classList.remove("pop"); void t.offsetWidth; t.classList.add("pop"); } }); };
  const tog = t => t.setAttribute("aria-expanded", t.classList.toggle("open"));
  $$(".tile").forEach(t => { t.addEventListener("click", e => { if (!e.target.closest("a")) tog(t); }); t.addEventListener("keydown", e => { if (e.target == t && (e.key == "Enter" || e.key == " ")) { e.preventDefault(); tog(t); } }); });
  // research modal (native <dialog>: focus trap, Esc, focus return)
  const dlg = $("#dlg");
  document.addEventListener("click", e => { const b = e.target.closest("[data-r]"); if (!b) return; const r = C.research[b.dataset.r];
    dlg.innerHTML = `<button class="ib x" data-x aria-label="Close">${svg("x")}</button><span class="b ${r.tone}">${r.badge}</span><h3 id="dt">${r.title}</h3><p class="mono small">${r.venue}</p>
      <h4>Problem</h4><p>${r.problem}</p><h4>Method</h4><p>${r.method}</p><h4>Result</h4><p>${r.result}</p><h4>Reproducibility</h4><div class="acts">${r.links.map(([l, u]) => A(l, u)).join("")}</div><div class="fig" style="margin:20px 0 0">[ADD FIGURE]</div>`;
    dlg.showModal(); });
  dlg.addEventListener("click", e => { if (e.target == dlg || e.target.closest("[data-x]")) dlg.close(); });
  // copy email
  $("#copy").onclick = async () => { const m = C.links.email; if (isPh(m)) return toast("Set your email in script.js first"); try { await navigator.clipboard.writeText(m); toast("Copied!"); } catch (e) { toast(m); } };
  // EOF typing
  const eof = $("#eof"), eio = new IntersectionObserver(es => { if (!es[0].isIntersecting) return; eio.disconnect(); const s = "// EOF"; if (RM) return eof.textContent = s; let i = 0; (function t() { eof.textContent = s.slice(0, ++i); if (i < s.length) setTimeout(t, 140); })(); });
  eio.observe(eof);
}
render(); init();
