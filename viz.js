/* Phase 3: hero loss curves, architecture views, node-graph behaviour.
   Plain JS/SVG/canvas, no libraries. Uses globals from script.js ($, $$, C, RM, root, svg, IC). */
"use strict";

/* ===== 1. Hero loss-curve canvas ===== */
(function heroCurves() {
  const home = $("#home"); if (!home) return;
  const cv = document.createElement("canvas"), dot = document.createElement("i"), tip = document.createElement("span");
  cv.className = "lc"; dot.className = "lc-dot"; tip.className = "lc-tip";
  [cv, dot, tip].forEach(n => n.setAttribute("aria-hidden", "true"));
  home.prepend(cv); home.append(dot, tip);
  const ctx = cv.getContext("2d"), E = 120, YMAX = 2.6, DUR = 2400;

  // deterministic noisy curves (same picture every load)
  let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const noise = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const mk = (a, k, floor, amp, up = 0) => Array.from({ length: E + 1 }, (_, e) =>
    Math.max(.04, floor + a * Math.exp(-e / k) + noise() * (amp * Math.exp(-e / 70) + .012) + up * Math.max(0, e - 85) / 35));
  const train = mk(2.2, 22, .08, .16), val1 = mk(2.3, 26, .17, .12, .05), val2 = mk(2.4, 30, .24, .1);

  let col = {}, W = 0, H = 0, g = {};
  const readCols = () => { const cs = getComputedStyle(root), v = n => cs.getPropertyValue(n).trim(); col = { acc: v("--accent"), mut: v("--muted"), bd: v("--bd"), mono: v("--mono") }; };
  const X = e => g.l + e / E * g.pw, Y = v => g.t + (1 - v / YMAX) * g.ph;
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2); W = home.clientWidth; H = home.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    g = { l: W < 520 ? 40 : 56, r: 20, t: 28, b: Math.max(64, Math.round(H * .24)) }; g.pw = W - g.l - g.r; g.ph = H - g.t - g.b;
  };

  function draw(p) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1; ctx.strokeStyle = col.bd; ctx.beginPath();
    for (let v = 0; v <= 2.5; v += .5) { const y = Math.round(Y(v)) + .5; ctx.moveTo(g.l, y); ctx.lineTo(W - g.r, y); }
    for (let e = 0; e <= E; e += 20) { const x = Math.round(X(e)) + .5; ctx.moveTo(x, g.t); ctx.lineTo(x, g.t + g.ph); }
    ctx.stroke();
    ctx.fillStyle = col.mut; ctx.font = `500 11px ${col.mono}`; ctx.textBaseline = "middle";
    ctx.textAlign = "right"; [0, 1, 2].forEach(v => ctx.fillText(v, g.l - 8, Y(v)));
    ctx.textAlign = "center"; [0, 40, 80, 120].forEach(e => ctx.fillText(e, X(e), g.t + g.ph + 14));
    ctx.textAlign = "right"; ctx.fillText("epoch", W - g.r, g.t + g.ph + 30);
    ctx.save(); ctx.translate(12, g.t + g.ph / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText("loss", 0, 0); ctx.restore();

    const n = p * E, k = Math.min(E, Math.floor(n));
    ctx.lineJoin = ctx.lineCap = "round";
    [[val2, col.mut, .25, 1.25], [val1, col.mut, .4, 1.25], [train, col.acc, .6, 2]].forEach(([a, c, al, w]) => {
      ctx.beginPath();
      for (let i = 0; i <= k; i++) i ? ctx.lineTo(X(i), Y(a[i])) : ctx.moveTo(X(i), Y(a[i]));
      if (k < E) ctx.lineTo(X(n), Y(a[k] + (a[k + 1] - a[k]) * (n - k)));
      ctx.globalAlpha = al; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); ctx.globalAlpha = 1;
    });
  }

  // draw-in: runs only while the hero is on screen and the tab is visible
  let prog = RM ? 1 : 0, elapsed = 0, raf = 0, last = 0, inView = true;
  const ease = t => 1 - Math.pow(1 - t, 2.4), cur = () => prog >= 1 ? 1 : ease(prog);
  const redraw = () => draw(cur()), can = () => inView && !document.hidden;
  const frame = now => {
    raf = 0; if (!can()) return;
    elapsed += Math.min(now - last, 50); last = now; prog = Math.min(1, elapsed / DUR); redraw();
    if (prog < 1) raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf && prog < 1 && can()) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? start() : stop(); }).observe(home);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());

  // resize, theme switch, late font load
  let rq = 0; const refit = () => { if (rq) return; rq = requestAnimationFrame(() => { rq = 0; size(); redraw(); }); };
  new ResizeObserver(refit).observe(home);
  new MutationObserver(() => { readCols(); redraw(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  if (document.fonts) document.fonts.ready.then(() => { readCols(); redraw(); });

  // tooltip: tracked on the hero container, canvas itself never takes pointer events
  let mx = 0, want = false, lastE = -1, tw = 0, tick = false;
  const hide = () => { want = false; lastE = -1; dot.classList.remove("on"); tip.classList.remove("on"); };
  const place = () => {
    tick = false; if (!want) return;
    const x = mx - home.getBoundingClientRect().left, e = Math.min(E, Math.max(0, Math.round((x - g.l) / g.pw * E)));
    if (x < g.l - 6 || x > W - g.r + 6 || e > Math.floor(cur() * E)) return hide();
    const px = X(e), py = Y(train[e]);
    if (e !== lastE) { tip.textContent = `epoch ${e} · loss ${train[e].toFixed(2)}`; tw = tip.offsetWidth; lastE = e; }
    dot.style.transform = `translate(${px - 4}px,${py - 4}px)`;
    tip.style.transform = `translate(${px + 12 + tw > W - 8 ? px - 12 - tw : px + 12}px,${py < 40 ? py + 14 : py - 30}px)`;
    dot.classList.add("on"); tip.classList.add("on");
  };
  home.addEventListener("pointermove", e => { mx = e.clientX; want = true; if (!tick) { tick = true; requestAnimationFrame(place); } });
  home.addEventListener("pointerleave", hide); home.addEventListener("pointercancel", hide);

  readCols(); size(); redraw(); start();
})();

/* ===== shared engine for the architecture views ===== */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), smooth = t => (t = clamp(t)) * t * (3 - 2 * t);
// s in [0, n-1]: pulse hops between n stops, pausing `dwell` ms at each
const seq = (t, n, hop, dwell) => { const per = hop + dwell, k = Math.floor(t / per); if (k >= n - 1) return n - 1; const r = t - k * per; return r < dwell ? k : k + smooth((r - dwell) / hop); };

function mkPath(pts, centers = []) {
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[cum.length - 1] || 1, stops = centers.map(i => cum[i] / L);
  return {
    pts, L, stops, ci: centers,
    at(u) { const d = clamp(u) * L; let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const f = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; },
    uOf(s) { const k = Math.min(stops.length - 2, Math.floor(s)); return stops[k] + (stops[k + 1] - stops[k]) * (s - k); }
  };
}

// nodes: {id, lines[], tip, cx, cy, w, h}; edges: {a, b, sa?, sb?, dash?}. Edge ends are tucked 4px under the
// (opaque) node so the small drift in the node-graph step never shows a gap.
function graph(spec) {
  const byId = {}; spec.nodes.forEach(n => byId[n.id] = n);
  const anc = (n, s) => ({ r: [n.cx + n.w / 2 - 4, n.cy], l: [n.cx - n.w / 2 + 4, n.cy], t: [n.cx, n.cy - n.h / 2 + 4], b: [n.cx, n.cy + n.h / 2 - 4] })[s], hz = s => s == "r" || s == "l";
  const edges = spec.edges.map(e => {
    const sa = e.sa || (spec.dir == "v" ? "b" : "r"), sb = e.sb || (spec.dir == "v" ? "t" : "l"), S = anc(byId[e.a], sa), T = anc(byId[e.b], sb); let pts;
    if (hz(sa) && hz(sb)) { const m = (S[0] + T[0]) / 2; pts = [S, [m, S[1]], [m, T[1]], T]; }
    else if (!hz(sa) && !hz(sb)) { const m = (S[1] + T[1]) / 2; pts = [S, [S[0], m], [T[0], m], T]; }
    else pts = hz(sa) ? [S, [T[0], S[1]], T] : [S, [S[0], T[1]], T];
    return { ...e, pts };
  });
  const d = p => "M" + p.map(q => q[0].toFixed(1) + " " + q[1].toFixed(1)).join("L");
  const eM = edges.map(e => `<g class="ed${e.dash ? " dash" : ""}" data-a="${e.a}" data-b="${e.b}"><path class="e0" d="${d(e.pts)}"/><path class="e1" d="${d(e.pts)}"/></g>`).join("");
  const dr = i => `--dx:${(i % 2 ? -1 : 1) * (1 + i % 3 * .4)}px;--dy:${(i % 3 - 1) * 1.1}px;--dur:${6 + i % 4}s;--dl:-${(i * 1.3).toFixed(1)}s`;
  const nM = spec.nodes.map((n, i) => {
    const r = `x="${n.cx - n.w / 2}" y="${n.cy - n.h / 2}" width="${n.w}" height="${n.h}" rx="8"`;
    return `<g class="nd${n.dash ? " dash" : ""}" data-id="${n.id}" tabindex="0" role="group" aria-label="${n.lines.join(" ")}. ${n.tip}" style="${dr(i)}"><rect class="nb" ${r}/><rect class="nl" ${r}/><rect class="nh" ${r}/></g>`;
  }).join("");
  // labels live in their own layer so a travelling pulse passes under the text; same drift vars keep them in step with their node
  const tM = spec.nodes.map((n, i) => { const k = n.lines.length;
    return `<g class="nt" data-id="${n.id}" aria-hidden="true" style="${dr(i)}">${n.lines.map((l, j) => `<text${j ? ' class="s"' : ""} x="${n.cx}" y="${(n.cy + (j - (k - 1) / 2) * 14 + 4).toFixed(1)}" text-anchor="middle">${l}</text>`).join("")}</g>`; }).join("");
  const path = ids => { const pts = [], ci = []; ids.forEach((id, i) => { if (i) pts.push(...edges.find(e => e.a == ids[i - 1] && e.b == id).pts); ci.push(pts.length); pts.push([byId[id].cx, byId[id].cy]); }); return mkPath(pts, ci); };
  return { markup: eM + nM, labels: tM, byId, path };
}

// pure-function-of-time player: render(t) draws any frame, so reduced motion just draws the final one
function player(render, dur, loop, still) {
  let t = 0, raf = 0, last = 0, on = false;
  const tick = now => {
    raf = 0; if (!on || document.hidden) return;
    t += Math.min(now - last, 50); last = now;
    if (t >= dur) { if (loop) t %= dur; else { render(dur); on = false; return; } }
    render(t); raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf && on && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  const vis = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else kick(); };
  document.addEventListener("visibilitychange", vis);
  return {
    play() { cancelAnimationFrame(raf); raf = 0; if (RM) { on = false; render(still == null ? dur : still); return; } t = 0; on = true; render(0); kick(); },
    stop() { on = false; cancelAnimationFrame(raf); raf = 0; document.removeEventListener("visibilitychange", vis); }
  };
}


/* ===== 6. node-graph interaction: hover / keyboard focus / tap highlight the node, its edges and neighbours, and show a tooltip ===== */
function graphFx(sv, L, tip, stage) {
  const host = tip.parentNode, nodes = $$(".nd", sv), edges = $$(".ed", sv); let cur = null, pinned = null;
  const label = n => n.lines.join(" ").replace(/\s+-$/, "");
  const clear = () => { cur = null; nodes.forEach(n => n.classList.remove("on", "nbr")); edges.forEach(e => e.classList.remove("hl")); tip.classList.remove("on"); tip.setAttribute("aria-hidden", "true"); };
  const show = g => {
    if (g == cur) return; clear(); cur = g; const id = g.dataset.id, nb = new Set([id]);
    edges.forEach(e => { const hit = e.dataset.a == id || e.dataset.b == id; e.classList.toggle("hl", hit); if (hit) { nb.add(e.dataset.a); nb.add(e.dataset.b); } });
    nodes.forEach(n => n.classList.toggle("on", n == g) || n.classList.toggle("nbr", nb.has(n.dataset.id) && n != g));
    const d = L.byId[id]; tip.innerHTML = `<b>${label(d)}</b>${d.tip}`; tip.setAttribute("aria-hidden", "false");
    const H = host.getBoundingClientRect(), R = g.querySelector(".nb").getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    const x = clamp(R.left - H.left + R.width / 2 - tw / 2, 0, Math.max(0, H.width - tw)), above = R.top - H.top - th - 8, y = above >= -6 ? above : R.bottom - H.top + 8;
    tip.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; tip.classList.add("on");
  };
  const nd = e => e.target.closest && e.target.closest(".nd");
  const on = {
    pointerover: e => { if (e.pointerType == "mouse" && !pinned) { const g = nd(e); g && show(g); } },
    pointerout: e => { if (e.pointerType == "mouse" && !pinned && nd(e) && !(e.relatedTarget && nd(e).contains(e.relatedTarget))) clear(); },
    pointerdown: e => { // tap / click pins; tapping the same node or empty space releases
      const g = nd(e); if (e.pointerType == "mouse" && !g) { pinned = null; return; }
      if (g && g == pinned) { pinned = null; clear(); } else if (g) { pinned = g; show(g); } else { pinned = null; clear(); } },
    focusin: e => { const g = nd(e); if (g) show(g); },
    focusout: e => { if (!pinned && !(e.relatedTarget && sv.contains(e.relatedTarget))) clear(); }
  };
  for (const k in on) sv.addEventListener(k, on[k]);
  return () => { for (const k in on) sv.removeEventListener(k, on[k]); clear(); };
}

/* ===== 2. Voice Doctor ===== */
const VIEWS = {};
VIEWS.voice = {
  project: "Voice Doctor", dur: 4600, replay: true,
  aria: "Voice Doctor pipeline: microphone, Whisper speech recognition, Gemma INT4, text to speech, speaker. Network use stays at 0 bytes.",
  layout(nr) {
    const ids = ["mic", "asr", "llm", "tts", "spk"], names = ["Mic", "Whisper ASR", "Gemma (INT4)", "TTS", "Speaker"],
      tips = ["Voice input, captured on the device.", "Speech recognition running on the device.", "2-4B parameter model with INT4/INT3 quantization and KV-cache optimization to fit mobile memory limits.", "Turns the answer back into speech.", "Voice output. No network dependency anywhere in the loop."];
    const G = graph({ dir: nr ? "v" : "h", edges: ids.slice(1).map((b, i) => ({ a: ids[i], b })),
      nodes: ids.map((id, i) => ({ id, lines: [names[i]], tip: tips[i], ...(nr ? { cx: 140, cy: 30 + i * 62, w: 150, h: 40 } : { cx: 54 + i * 143, cy: 50, w: 104, h: 52 }) })) });
    const bx = nr ? 2 : 340, bw = nr ? 276 : 338, by = nr ? 372 : 154, ly = nr ? 364 : 146, ny = nr ? 338 : 162;
    return { W: nr ? 280 : 680, H: nr ? 392 : 180, byId: G.byId, path: G.path,
      markup: G.markup + `<text data-net x="2" y="${ny}">network: 0 bytes</text><text class="s" x="${bx}" y="${ly}">memory · illustrative</text>
        <rect class="trk" x="${bx}" y="${by}" width="${bw}" height="8" rx="4"/><rect class="fill" data-mem x="${bx}" y="${by}" width="${bw}" height="8" rx="4" style="transform:scaleX(0)"/>
        <g data-pk style="opacity:0"><circle class="pkh" r="9"/><circle class="pk" r="4.5"/></g>` + G.labels };
  },
  bind(sv, L) {
    const pk = $("[data-pk]", sv), mem = $("[data-mem]", sv), net = $("[data-net]", sv), nl = $$(".nl", sv), P = L.path(["mic", "asr", "llm", "tts", "spk"]);
    let bytes = 0; // the whole loop is offline, so this stays at 0
    return t => {
      const s = seq(t, 5, 700, 250), [x, y] = P.at(P.uOf(s)), txt = `network: ${bytes} bytes`;
      pk.style.opacity = 1; pk.style.transform = `translate(${x}px,${y}px)`;
      nl.forEach((n, i) => n.style.opacity = s > i + .35 ? .5 : s > i - .35 ? 1 : 0);
      mem.style.transform = `scaleX(${.62 * smooth(s - 1.5)})`;
      if (net.textContent !== txt) net.textContent = txt;
    };
  }
};


/* ===== 3. Intrusion detection ===== */
VIEWS.ids = {
  project: "Cybersecurity Intrusion Detection System", dur: 5200, loop: true, still: 3580,
  aria: "Intrusion detection flow: a packet stream splits into a supervised branch and an anomaly branch, both feed a meta-model, which gives the verdict. Anomalous packets are flagged.",
  layout(nr) {
    const n = (id, lines, tip, cx, cy, w, h) => ({ id, lines, tip, cx, cy, w, h });
    const tp = { stream: "Traffic from the NSL-KDD dataset. Mostly normal, with the occasional anomaly.", sup: "XGBoost, LightGBM and CatBoost flag known attack traffic.", ano: "DBSCAN, Isolation Forest and GMM flag unusual traffic, including zero-day.", meta: "Agreement and disagreement between the two branches become features for a stacked meta-model.", ver: "The final call, served by a FastAPI real-time classification service." };
    const nodes = nr
      ? [n("stream", ["Packet stream"], tp.stream, 140, 32, 150, 46), n("sup", ["Supervised", "known"], tp.sup, 72, 132, 124, 52), n("ano", ["Anomaly", "zero-day"], tp.ano, 208, 132, 124, 52), n("meta", ["Meta-model", "stacked"], tp.meta, 140, 232, 150, 52), n("ver", ["Verdict", "-"], tp.ver, 140, 324, 150, 52)]
      : [n("stream", ["Packet stream"], tp.stream, 68, 125, 136, 48), n("sup", ["Supervised", "known"], tp.sup, 250, 50, 128, 52), n("ano", ["Anomaly", "zero-day"], tp.ano, 250, 200, 128, 52), n("meta", ["Meta-model", "stacked"], tp.meta, 436, 125, 120, 52), n("ver", ["Verdict", "-"], tp.ver, 604, 125, 120, 52)];
    const G = graph({ dir: nr ? "v" : "h", nodes, edges: [["stream", "sup"], ["stream", "ano"], ["sup", "meta"], ["ano", "meta"], ["meta", "ver"]].map(([a, b]) => ({ a, b })) });
    const pk = k => Array.from({ length: 8 }, () => `<rect class="pt" data-p${k} x="-5" y="-5" width="10" height="10" rx="2" style="opacity:0"/>`).join("");
    return { W: nr ? 280 : 680, H: nr ? 356 : 250, nr, byId: G.byId, path: G.path, markup: G.markup + pk("a") + pk("b") + `<text class="fl" data-fl text-anchor="middle" style="opacity:0">anomaly · flagged</text>` + G.labels };
  },
  bind(sv, L) {
    const P = 520, LIFE = 3400, N = 10, CY = P * N, AN = 4, st = L.byId.stream;
    const sup = L.path(["stream", "sup", "meta", "ver"]), ano = L.path(["stream", "ano", "meta", "ver"]), x0 = L.nr ? st.cx : st.cx - st.w / 2 + 8, y0 = L.nr ? st.cy - st.h / 2 + 6 : st.cy;
    const A = mkPath([[x0, y0], ...sup.pts], sup.ci.map(i => i + 1)), B = mkPath([[x0, y0], ...ano.pts], ano.ci.map(i => i + 1));
    const pa = $$("[data-pa]", sv), pb = $$("[data-pb]", sv), fl = $("[data-fl]", sv), vt = $(".nt[data-id=ver] text.s", sv);
    const nl = id => $(`.nd[data-id=${id}] .nl`, sv), NL = { stream: [nl("stream"), A, 0], sup: [nl("sup"), A, 1], ano: [nl("ano"), B, 1], meta: [nl("meta"), A, 2], ver: [nl("ver"), A, 3] };
    const fade = f => smooth(f / .05) * (1 - smooth((f - .88) / .12)), fork = A.stops[0] + .05;
    return t => {
      const alive = [], lit = { stream: 0, sup: 0, ano: 0, meta: 0, ver: 0 }; let best = -1e9, bj = -1;
      for (let j = 0; j < N; j++) for (const off of [0, -CY]) {
        const age = t - j * P - off, arr = j * P + off + LIFE * .86;
        if (age >= 0 && age < LIFE) alive.push({ j, f: age / LIFE });
        if (arr <= t && arr > best) { best = arr; bj = j; }
      }
      [[pa, A], [pb, B]].forEach(([pool, Pt]) => pool.forEach((el, i) => {
        const p = alive[i]; if (!p) { el.style.opacity = 0; return; }
        const [x, y] = Pt.at(p.f), an = p.j == AN; el.style.transform = `translate(${x}px,${y}px)`; el.style.opacity = fade(p.f) * (an ? 1 : .6);
        if (el.classList.contains("an") != an) el.classList.toggle("an", an);
      }));
      alive.forEach(p => { for (const id in NL) { const [, Pt, k] = NL[id]; lit[id] = Math.max(lit[id], 1 - clamp(Math.abs(p.f - Pt.stops[k]) / .06)); } });
      for (const id in NL) NL[id][0].style.opacity = lit[id];
      const a = alive.find(p => p.j == AN);
      if (a && a.f > fork) { const [x, y] = B.at(a.f); fl.style.transform = `translate(${x}px,${y - 17}px)`; fl.style.opacity = smooth((a.f - fork) / .06) * fade(a.f); } else fl.style.opacity = 0;
      const flagged = bj == AN, txt = flagged ? "flagged" : "normal";
      if (vt.textContent !== txt) { vt.textContent = txt; vt.classList.toggle("dg", flagged); }
    };
  }
};


/* ===== 4. LifeSync: sequential vs parallel race ===== */
const LS_D = [.7, 1.2, .9, 1, 1.4, .8, 1.1, .9, 1.3, 1], LS_SUM = LS_D.reduce((a, b) => a + b), LS_MAX = Math.max(...LS_D), LS_U = 420;
VIEWS.life = {
  project: "LifeSync AI", dur: 5000, replay: true,
  aria: "LifeSync race, illustrative: ten API calls run one after another in one lane and all at once with asyncio.gather in the other. The parallel lane finishes far sooner.",
  layout(nr) {
    const W = nr ? 280 : 680, sc = W / LS_SUM, cum = []; LS_D.reduce((a, d, i) => (cum[i] = a, a + d), 0);
    const r = (cls, x, y, w, h, a = "") => `<rect class="${cls}" ${a} x="${x.toFixed(1)}" y="${y}" width="${Math.max(1, w).toFixed(1)}" height="${h}" rx="${h > 8 ? 3 : 2}"${a ? ' style="transform:scaleX(0)"' : ""}/>`;
    const seqCells = LS_D.map((d, i) => r("trk", cum[i] * sc, 20, d * sc - 2, 18) + r("fill", cum[i] * sc, 20, d * sc - 2, 18, "data-sa")).join("");
    const parRows = LS_D.map((d, i) => r("trk", 0, 72 + i * 8, d * sc - 2, 6) + r("fill", 0, 72 + i * 8, d * sc - 2, 6, "data-pa")).join("");
    return { W, H: 250, cum, markup: `<text x="0" y="12">${nr ? "sequential" : "sequential · one call after another"}</text>${seqCells}
      <text x="0" y="64">${nr ? "parallel · gather()" : "parallel · asyncio.gather()"}</text>${parRows}
      <text class="s" x="0" y="176">latency · illustrative</text>
      <text x="0" y="196">${nr ? "sequential: sum of calls" : "sequential: sum of the 10 calls"}</text>${r("trk", 0, 202, W, 10)}${r("fill m", 0, 202, W, 10, "data-bs")}
      <text x="0" y="230">parallel: slowest call</text>${r("trk", 0, 236, LS_MAX * sc, 10)}${r("fill", 0, 236, LS_MAX * sc, 10, "data-bp")}` };
  },
  bind(sv, L) {
    const sa = $$("[data-sa]", sv), pa = $$("[data-pa]", sv), bs = $("[data-bs]", sv), bp = $("[data-bp]", sv);
    return t => {
      sa.forEach((el, i) => el.style.transform = `scaleX(${clamp((t - L.cum[i] * LS_U) / (LS_D[i] * LS_U))})`);
      pa.forEach((el, i) => el.style.transform = `scaleX(${clamp(t / (LS_D[i] * LS_U))})`);
      bs.style.transform = `scaleX(${clamp(t / (LS_SUM * LS_U))})`; bp.style.transform = `scaleX(${clamp(t / (LS_MAX * LS_U))})`;
    };
  }
};


/* ===== 5. ChronoMind ===== */
VIEWS.chrono = {
  project: "ChronoMind AI", dur: 5600, loop: true, still: 3900,
  aria: "ChronoMind pipeline: parse intent, execute tool, synthesize response, with a pluggable tools branch off the execute step.",
  layout(nr) {
    const n = (id, lines, tip, cx, cy, w, h, dash) => ({ id, lines, tip, cx, cy, w, h, dash });
    const tp = { parse: "Works out what the user is asking for.", exec: "Runs the chosen tool. Tools are pluggable, so new ones slot in without touching the pipeline.", syn: "Builds the final reply from the tool output.", tools: "Pluggable tools: OCR ingestion into SQLite is one of them." };
    const nodes = nr
      ? [n("parse", ["Parse intent"], tp.parse, 84, 32, 136, 48), n("exec", ["Execute tool"], tp.exec, 84, 128, 136, 48), n("syn", ["Synthesize", "response"], tp.syn, 84, 224, 136, 52), n("tools", ["Pluggable", "tools"], tp.tools, 232, 128, 84, 52, 1)]
      : [n("parse", ["Parse intent"], tp.parse, 92, 60, 144, 52), n("exec", ["Execute tool"], tp.exec, 340, 60, 144, 52), n("syn", ["Synthesize", "response"], tp.syn, 588, 60, 144, 52), n("tools", ["Pluggable tools"], tp.tools, 340, 158, 144, 44, 1)];
    const G = graph({ dir: nr ? "v" : "h", nodes, edges: [{ a: "parse", b: "exec" }, { a: "exec", b: "syn" }, nr ? { a: "exec", b: "tools", sa: "r", sb: "l", dash: 1 } : { a: "exec", b: "tools", sa: "b", sb: "t", dash: 1 }] });
    return { W: nr ? 280 : 680, H: nr ? 262 : 196, nr, byId: G.byId, path: G.path, markup: G.markup + `<g data-pk style="opacity:0"><circle class="pkh" r="9"/><circle class="pk" r="4.5"/></g>` + G.labels };
  },
  bind(sv, L) {
    const pk = $("[data-pk]", sv), nl = id => $(`.nd[data-id=${id}] .nl`, sv), M = L.path(["parse", "exec", "syn"]), T = L.path(["exec", "tools"]);
    const el = { parse: nl("parse"), exec: nl("exec"), syn: nl("syn"), tools: nl("tools") }, HOP = 750, DW = 350, LEG = 600;
    // main pulse: parse -> exec -> (side trip to tools and back) -> syn
    return t => {
      let u, lit = { parse: 0, exec: 0, syn: 0, tools: 0 }, P = M;
      const side = LEG * 2 + 250;
      if (t < DW) { u = 0; lit.parse = 1; }
      else if (t < DW + HOP) { u = M.uOf(smooth((t - DW) / HOP)); lit.parse = 1 - smooth((t - DW) / HOP); lit.exec = smooth((t - DW) / HOP); }
      else if (t < DW + HOP + DW) { u = M.stops[1]; lit.exec = 1; }
      else if (t < DW + HOP + DW + side) {
        const r = t - (DW + HOP + DW); lit.exec = 1; P = T;
        const f = r < LEG ? smooth(r / LEG) : r < LEG + 250 ? 1 : 1 - smooth((r - LEG - 250) / LEG);
        u = f; lit.tools = r < LEG + 250 ? smooth(r / LEG) : 1 - smooth((r - LEG - 250) / LEG);
      }
      else { const r = t - (DW + HOP + DW + side), k = smooth(r / HOP); u = M.stops[1] + (M.stops[2] - M.stops[1]) * k; lit.exec = 1 - k; lit.syn = k; }
      if (t >= DW + HOP + DW + side + HOP) { u = 1; lit.syn = 1; P = M; }
      const [x, y] = P.at(u); pk.style.opacity = t < 60 ? t / 60 : 1; pk.style.transform = `translate(${x}px,${y}px)`;
      for (const id in el) el[id].style.opacity = lit[id];
    };
  }
};

let archLive = null;
(function archModal() {
  const dlg = $("#dlg");
  const teardown = () => { if (archLive) { archLive.ro.disconnect(); archLive.pl && archLive.pl.stop(); archLive.off(); archLive = null; } };
  dlg.addEventListener("close", teardown);
  // keep Tab / Shift+Tab cycling inside the open architecture view
  dlg.addEventListener("keydown", e => {
    if (e.key != "Tab" || !archLive) return;
    const f = $$("button:not([hidden]),[href],[tabindex]:not([tabindex='-1'])", dlg).filter(x => !x.closest("[hidden]") && x.getClientRects().length);
    if (!f.length) return; const a = f[0], z = f[f.length - 1], cur = document.activeElement;
    if (e.shiftKey && (cur == a || !dlg.contains(cur))) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && (cur == z || !dlg.contains(cur))) { e.preventDefault(); a.focus(); }
  });

  function open(key) {
    const v = VIEWS[key], P = C.projects.find(p => p.name == v.project); teardown();
    dlg.innerHTML = `<button class="ib x" data-x aria-label="Close">${svg("x")}</button><span class="b a">architecture</span><h3 id="dt">${P.name}</h3><p class="mono small">${P.short}</p>
      <div class="arch"><div class="arch-stage"></div><div class="arch-tip" role="tooltip" aria-hidden="true"></div></div>
      ${v.replay ? `<div class="acts arch-acts"><button class="btn" data-replay${RM ? " hidden" : ""}>Replay</button></div>` : ""}`;
    dlg.showModal();
    const stage = $(".arch-stage", dlg), live = archLive = { ro: null, pl: null, off: () => { } }; let narrow = null;
    const build = () => {
      const n = stage.clientWidth < 540; if (n === narrow) return; narrow = n;
      live.pl && live.pl.stop(); live.off();
      const L = v.layout(n);
      stage.innerHTML = `<svg viewBox="0 0 ${L.W} ${L.H}" role="group" aria-label="${v.aria}" tabindex="-1" focusable="false">${L.markup}</svg>`;
      const sv = stage.firstChild;
      live.off = graphFx(sv, L, $(".arch-tip", dlg), stage);
      live.pl = player(v.bind(sv, L), v.dur, v.loop, v.still); live.pl.play();
    };
    build(); live.ro = new ResizeObserver(build); live.ro.observe(stage);
    const rb = $("[data-replay]", dlg); if (rb) rb.onclick = () => live.pl.play();
  }

  // Architecture button on the four project tiles (click must not also toggle the tile)
  const map = { "Voice Doctor": "voice", "Cybersecurity Intrusion Detection System": "ids", "LifeSync AI": "life", "ChronoMind AI": "chrono" };
  $$(".tile").forEach((t, i) => {
    const key = map[C.projects[i].name], acts = $(".det .acts", t); if (!key || !acts || !VIEWS[key]) return;
    const b = document.createElement("button"); b.className = "btn"; b.textContent = "Architecture"; b.dataset.arch = key;
    b.addEventListener("click", e => { e.stopPropagation(); open(key); }); acts.prepend(b);
  });
  archModal.open = open;
})();
