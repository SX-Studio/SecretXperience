/* SR Type: kinetic on-screen words for Social Ripple.
   - Cards size themselves to their text (measured with the real font once it has loaded) and wrap to 2 lines when long.
   - A layout pass gives every card a zone slot so cards that are on screen at the same time NEVER overlap.
   - Each card has a MOOD that sets its colours and its per-letter entrance / idle / exit motion, matched to what is being said.
   const TY = SRType.create(svg, { W: 1920, H: 1080 });
   TY.card({ text, sub, t0, t1, mood: "hype|money|alert|calm|sad|fact|funny|question|title|plain", zone: "top|lower|left|right|center|source", size });
   TY.update(t)   — pure function of t.  Moods also export a suggested sound: TY.cards[i].sfx */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), mix = (a, b, k) => a + (b - a) * k;
  const E = { out: (k) => 1 - Math.pow(1 - k, 3), back: (k) => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); }, elastic: (k) => k <= 0 ? 0 : k >= 1 ? 1 : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * (2 * Math.PI) / 3) + 1, inOut: (k) => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  // ---------- moods: palette + motion ----------
  const MOODS = {
    plain:    { bg: "#FFF6E4", ink: "#1E1B22", border: "#1E1B22", font: "Outfit", weight: 900, sfx: "pop" },
    title:    { bg: "#FFF6E4", ink: "#1E1B22", border: "#1E1B22", font: "Outfit", weight: 900, sfx: "whoosh_b", stagger: 0.035 },
    hype:     { bg: "#FFD24A", ink: "#1E1B22", border: "#1E1B22", font: "Outfit", weight: 900, sfx: "boom", burst: "#FFF2B0", stagger: 0.025 },
    money:    { bg: "#EAF8EC", ink: "#1E7A44", border: "#1E1B22", font: "Outfit", weight: 900, sfx: "ka_ching", sparkle: "#FFD24A", stagger: 0.045 },
    alert:    { bg: "#FFF1EC", ink: "#D23A2A", border: "#D23A2A", font: "Outfit", weight: 900, sfx: "stamp", tilt: -5 },
    calm:     { bg: "#FFF4E2", ink: "#5A3E2A", border: "#E8B060", font: "Nunito", weight: 900, sfx: "gold_chime", glow: "#FFD592", stagger: 0.05 },
    sad:      { bg: "#E3E9F4", ink: "#34466A", border: "#34466A", font: "Nunito", weight: 900, sfx: "steel_down", stagger: 0.04 },
    fact:     { bg: "#FFFDF6", ink: "#1E1B22", border: "#1E1B22", font: "Nunito", weight: 900, sfx: "typing", tape: true },
    funny:    { bg: "#FFFFFF", ink: "#1E1B22", border: "#1E1B22", font: "Outfit", weight: 900, sfx: "boing", rainbow: ["#E8574A", "#F2A23A", "#3FA7A0", "#5A7FD8", "#B05AC8"], stagger: 0.03 },
    question: { bg: "#FFFFFF", ink: "#1E1B22", border: "#1E1B22", font: "Outfit", weight: 900, sfx: "pop", stagger: 0.04 },
  };
  // zone anchors (centre x, first-slot y, stack direction)
  const ZONES = (W, H) => ({ top: { x: W / 2, y: 150, dir: 1 }, lower: { x: W / 2, y: H - 300, dir: -1 }, center: { x: W / 2, y: H / 2 - 40, dir: 1 },
    left: { x: 520, y: 220, dir: 1 }, right: { x: W - 520, y: 220, dir: 1 }, source: { x: 70, y: H - 92, dir: -1, left: true } });

  function create(svg, opt = {}) {
    const W = opt.W || 1920, H = opt.H || 1080, MAXW = opt.maxW || 1480, Z = ZONES(W, H), PAD = 44, GAP = 22;
    const layer = el("g", {}, svg), defs = svg.querySelector("defs") || el("defs", {}, svg);
    if (!svg.querySelector("#tyShadow")) { const f = el("filter", { id: "tyShadow", x: "-20%", y: "-30%", width: "140%", height: "170%" }, defs); el("feDropShadow", { dx: 0, dy: 9, stdDeviation: 9, "flood-color": "#120C22", "flood-opacity": 0.42 }, f); }
    if (!svg.querySelector("#tyGlow")) { const f = el("filter", { id: "tyGlow", x: "-30%", y: "-60%", width: "160%", height: "220%" }, defs); el("feGaussianBlur", { stdDeviation: 14 }, f); }
    const cv = document.createElement("canvas").getContext("2d");
    const cards = []; let laidOut = false;
    const TY = { cards, layer };
    TY.card = (o) => { const c = Object.assign({ zone: "top", mood: "plain", size: 64 }, o); c.M = Object.assign({}, MOODS.plain, MOODS[c.mood] || {}); if (c.zone === "source") { c.mood = "source"; c.M = { bg: "#120C22", ink: "#FFE7A0", border: "none", font: "Nunito", weight: 800, sfx: null }; c.size = c.size === 64 ? 27 : c.size; }
      c.sfx = c.M.sfx; c.g = el("g", { display: "none" }, layer); cards.push(c); laidOut = false; return c; };
    function measure(text, size, font, weight) { cv.font = `${weight} ${size}px "${font}", Nunito, sans-serif`; return cv.measureText(text).width; }
    function wrap(text, size, M, maxW) { // balanced 2-line wrap, then shrink if still too wide
      let s = size, lines = [text];
      for (let iter = 0; iter < 12; iter++) {
        const w1 = measure(text, s, M.font, M.weight); if (w1 <= maxW) { lines = [text]; break; }
        const words = text.split(" "); let best = null;
        for (let i = 1; i < words.length; i++) { const a = words.slice(0, i).join(" "), b = words.slice(i).join(" "), w = Math.max(measure(a, s, M.font, M.weight), measure(b, s, M.font, M.weight)); if (!best || w < best.w) best = { a, b, w }; }
        if (best && best.w <= maxW) { lines = [best.a, best.b]; break; }
        s *= 0.92;
      }
      return { lines, size: s };
    }
    function build(c) {
      const M = c.M, g = c.g; g.innerHTML = "";
      const src = c.zone === "source", maxW = src ? 1100 : (c.zone === "left" || c.zone === "right" ? 760 : MAXW);
      const wr = wrap(c.text, c.size, M, maxW - PAD * 2); c.lines = wr.lines; c.fs = wr.size;
      const subFs = c.sub ? Math.max(26, c.fs * 0.46) : 0, subW = c.sub ? measure(c.sub, subFs, "Nunito", 800) : 0;
      const lineH = c.fs * 1.08, textW = Math.max(...c.lines.map((l) => measure(l, c.fs, M.font, M.weight)), subW);
      c.w = Math.min(maxW, textW + PAD * 2); c.h = (src ? 18 : 34) + lineH * c.lines.length + (c.sub ? subFs * 1.5 : 0) + (src ? 8 : 18);
      c.inner = el("g", {}, g);
      if (M.burst) { c.burstEl = el("path", { d: starPath(c.w * 0.62, c.h * 1.15, 18), fill: M.burst, opacity: 0 }, c.inner); }
      if (M.glow) el("rect", { x: -c.w / 2 - 10, y: -c.h / 2 - 10, width: c.w + 20, height: c.h + 20, rx: 40, fill: M.glow, opacity: 0.55, filter: "url(#tyGlow)" }, c.inner);
      c.box = el("rect", { x: -c.w / 2, y: -c.h / 2, width: c.w, height: c.h, rx: src ? 16 : 28, fill: M.bg, stroke: M.border === "none" ? "none" : M.border, "stroke-width": src ? 0 : 7, filter: src ? "" : "url(#tyShadow)", opacity: src ? 0.86 : 1 }, c.inner);
      if (M.tape) [-1, 1].forEach((s) => el("rect", { x: s * c.w / 2 - 34, y: -c.h / 2 - 16, width: 68, height: 28, fill: "#F2E2A0", opacity: 0.85, transform: `rotate(${s * 12} ${s * c.w / 2} ${-c.h / 2})` }, c.inner));
      // letters: one <text> per glyph so each can move on its own
      c.letters = []; const top = -c.h / 2 + (src ? 14 : 30) + c.fs * 0.86;
      c.lines.forEach((line, li) => { const lw = measure(line, c.fs, M.font, M.weight); let x0 = src ? -c.w / 2 + PAD * 0.6 : -lw / 2;
        for (let i = 0; i < line.length; i++) { const ch = line[i]; const adv = measure(line.slice(0, i), c.fs, M.font, M.weight);
          const col = M.rainbow && ch !== " " ? M.rainbow[(c.letters.length) % M.rainbow.length] : M.ink;
          const t = el("text", { x: 0, y: 0, "font-family": `${M.font}, Nunito, sans-serif`, "font-weight": M.weight, "font-size": c.fs.toFixed(1), fill: col, "text-anchor": "start" }, c.inner); t.textContent = ch;
          c.letters.push({ t, x: x0 + adv, y: top + li * c.fs * 1.08, i: c.letters.length, ch }); } });
      if (c.sub) { const st = el("text", { x: 0, y: c.h / 2 - subFs * 0.9 - 6, "font-family": "Nunito, sans-serif", "font-weight": 800, "font-size": subFs.toFixed(1), fill: M.mood === "sad" ? "#5A6A8A" : "#6A5A7A", "text-anchor": "middle" }, c.inner); st.textContent = c.sub; c.subEl = st; }
      if (M.sparkle) c.sparks = [0, 1, 2, 3].map((i) => el("path", { d: "M0,-14 C2,-3 3,-2 14,0 C3,2 2,3 0,14 C-2,3 -3,2 -14,0 C-3,-2 -2,-3 0,-14 Z", fill: M.sparkle, opacity: 0 }, c.inner));
      if (c.mood === "fact") c.caret = el("rect", { width: 6, height: c.fs * 0.8, fill: M.ink, opacity: 0 }, c.inner);
    }
    const starPath = (rx, ry, n) => { let d = ""; for (let i = 0; i <= n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? 0.72 : 1; d += (i ? "L" : "M") + (Math.cos(a) * rx * r).toFixed(1) + "," + (Math.sin(a) * ry * r).toFixed(1); } return d + "Z"; };
    // layout: give each card a slot in its zone so cards visible at the same time never overlap
    function layout() {
      cards.forEach(build);
      // keep cards off faces: if a card would cover a face (opt.avoid(t) → screen rects), move it to the opposite zone
      const ALT = { top: "lower", lower: "top", left: "right", right: "left", center: "top" };
      const hits = (c, zn, off = 0) => { if (!opt.avoid || c.zone === "source") return 0; const z = Z[zn] || Z.top, cx = z.left ? z.x + c.w / 2 : z.x, cy = z.dir < 0 ? z.y - off - c.h / 2 : z.y + off + c.h / 2;
        let n = 0; for (const tt of [c.t0 + 0.1, (c.t0 + c.t1) / 2, c.t1 - 0.1]) for (const r of opt.avoid(tt) || []) if (cx - c.w / 2 < r.x1 && cx + c.w / 2 > r.x0 && cy - c.h / 2 < r.y1 && cy + c.h / 2 > r.y0) n++; return n; };
      cards.forEach((c) => { if (c.zone !== "source" && !c.fixedZone && ALT[c.zone] && hits(c, c.zone) > 0 && hits(c, ALT[c.zone]) < hits(c, c.zone)) c.zone = ALT[c.zone]; });
      const byZone = {}; cards.slice().sort((a, b) => a.t0 - b.t0).forEach((c) => { (byZone[c.zone] = byZone[c.zone] || []).push(c); });
      for (const zn in byZone) { const z = Z[zn] || Z.top, placed = [];
        byZone[zn].forEach((c) => { const live = placed.filter((p) => p.t0 < c.t1 + 0.35 && c.t0 < p.t1 + 0.35);
          // find the lowest offset where this card doesn't intersect any live card
          let off = 0; const sorted = live.map((p) => [p.off, p.off + p.h]).sort((a, b) => a[0] - b[0]);
          for (const [a, b] of sorted) { if (off + c.h + GAP > a && off < b + GAP) off = b + GAP; }
          c.off = off; placed.push(c);
          c.cx = z.left ? z.x + c.w / 2 : z.x; c.cy = z.y + z.dir * (off + c.h / 2) - (z.dir < 0 ? 0 : 0);
          if (z.dir < 0) c.cy = z.y - off - c.h / 2;
          if (c.at) { c.cx = c.at.x; c.cy = c.at.y; } // explicit screen position (still counted for stacking in its zone)
          c.cx = clamp(c.cx, c.w / 2 + 40, W - c.w / 2 - 40); c.cy = clamp(c.cy, c.h / 2 + 40, H - c.h / 2 - 40); }); }
      laidOut = true;
    }
    window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
    window.__hf.buildReady["srtype"] = (document.fonts ? Promise.all(["900 64px Outfit", "900 64px Nunito", "800 30px Nunito"].map((f) => document.fonts.load(f).catch(() => 0))) : Promise.resolve()).then(() => { laidOut = false; });
    TY.update = (t) => {
      if (!laidOut) layout();
      for (const c of cards) {
        const vis = t >= c.t0 - 0.02 && t < c.t1 + 0.45; c.g.setAttribute("display", vis ? "inline" : "none"); if (!vis) continue;
        const M = c.M, a = t - c.t0, k = clamp(a / 0.32, 0, 1), ex = clamp((t - c.t1) / 0.3, 0, 1), n = c.letters.length;
        let s = 1, rot = 0, dx = 0, dy = 0, op = 1;
        // ---- whole-card motion per mood
        switch (c.mood) {
          case "hype": s = 1.55 - 0.55 * E.back(clamp(a / 0.22, 0, 1)); if (a < 0.45) { dx = (hash(Math.floor(a * 60)) - 0.5) * 14 * (1 - a / 0.45); dy = (hash(Math.floor(a * 60) + 7) - 0.5) * 10 * (1 - a / 0.45); } break;
          case "alert": s = 2.1 - 1.1 * E.out(clamp(a / 0.14, 0, 1)); rot = M.tilt; if (a > 0.14 && a < 0.4) { dx = Math.sin(a * 90) * 6 * (1 - (a - 0.14) / 0.26); } break;
          case "calm": dy = 34 * (1 - E.out(clamp(a / 0.7, 0, 1))); op = clamp(a / 0.6, 0, 1); s = 1 + 0.008 * Math.sin(t * 1.6); break;
          case "sad": dy = -26 * (1 - E.out(clamp(a / 0.5, 0, 1))); op = clamp(a / 0.4, 0, 1); rot = -1.5 * Math.sin(Math.min(1, a / 0.8) * Math.PI); break;
          case "fact": op = clamp(a / 0.2, 0, 1); dy = 18 * (1 - E.out(clamp(a / 0.3, 0, 1))); break;
          case "funny": s = 0.6 + 0.4 * E.elastic(clamp(a / 0.6, 0, 1)); rot = 2.5 * Math.sin(t * 5.5); break;
          case "source": op = clamp(a / 0.3, 0, 1); dx = -30 * (1 - E.out(k)); break;
          default: s = 0.65 + 0.35 * E.back(k); op = Math.min(1, k * 2);
        }
        // exit
        if (ex > 0) { if (c.mood === "sad") { op *= 1 - ex; dy += 40 * ex * ex; } else { s *= 1 - 0.25 * E.inOut(ex); op *= 1 - ex; } }
        c.g.setAttribute("opacity", op.toFixed(3));
        c.g.setAttribute("transform", `translate(${(c.cx + dx).toFixed(1)},${(c.cy + dy).toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(4)})`);
        if (c.burstEl) { const b = clamp(a / 0.5, 0, 1); c.burstEl.setAttribute("opacity", (Math.sin(b * Math.PI) * 0.9).toFixed(3)); c.burstEl.setAttribute("transform", `rotate(${(a * 40).toFixed(1)}) scale(${(0.6 + b * 0.6).toFixed(3)})`); }
        // ---- per-letter motion
        const st = M.stagger || 0.02;
        for (const L of c.letters) { const la = a - L.i * st; let lx = L.x, ly = L.y, lr = 0, ls = 1, lo = 1;
          switch (c.mood) {
            case "title": { const q = clamp(la / 0.35, 0, 1); ly += 60 * (1 - E.back(q)); lo = clamp(la / 0.15, 0, 1); break; }
            case "hype": { const q = clamp(la / 0.18, 0, 1); ls = 0.2 + 0.8 * E.back(q); lo = q > 0 ? 1 : 0; break; }
            case "money": { const q = clamp(la / 0.3, 0, 1); ls = 1; lo = q > 0 ? 1 : 0; const flip = Math.cos((1 - E.out(q)) * Math.PI * 1.5); L.sx = Math.max(0.05, Math.abs(flip)); break; }
            case "calm": { lo = clamp(la / 0.45, 0, 1); ly += 10 * (1 - E.out(clamp(la / 0.6, 0, 1))); break; }
            case "sad": { const q = clamp(la / 0.55, 0, 1); ly -= 40 * (1 - E.out(q)) * (1 - q) + 0; ly += Math.sin(q * Math.PI) * 6; lo = clamp(la / 0.2, 0, 1); if (ex > 0) { const f = clamp(ex * 1.8 - (L.i % 7) * 0.06, 0, 1); ly += 120 * f * f; lr = 25 * f * (L.i % 2 ? 1 : -1); } break; }
            case "fact": { const cps = 34, shown = a * cps; lo = L.i < shown ? 1 : 0; break; }
            case "funny": { const q = clamp(la / 0.4, 0, 1); ls = 0.3 + 0.7 * E.elastic(q); ly += Math.sin(t * 7 + L.i * 0.8) * 5; lr = Math.sin(t * 6 + L.i) * 7; lo = q > 0 ? 1 : 0; break; }
            case "question": { const q = clamp(la / 0.25, 0, 1); ls = 0.3 + 0.7 * E.back(q); lo = q > 0 ? 1 : 0; if (L.ch === "?") lr = 12 * Math.sin(t * 6); break; }
            case "alert": { break; }
            default: { const q = clamp(la / 0.25, 0, 1); lo = Math.min(1, q * 3); ly += 14 * (1 - E.out(q)); }
          }
          const sx = (L.sx || 1) * ls; L.sx = null;
          L.t.setAttribute("opacity", lo.toFixed(3));
          L.t.setAttribute("transform", `translate(${lx.toFixed(1)},${ly.toFixed(1)}) rotate(${lr.toFixed(2)}) scale(${sx.toFixed(3)},${ls.toFixed(3)})`); }
        if (c.subEl) c.subEl.setAttribute("opacity", clamp((a - 0.25) / 0.3, 0, 1).toFixed(3));
        if (c.sparks) c.sparks.forEach((sp, i) => { const ph = (t * 1.3 + i * 0.27) % 1, px = (hash(i + Math.floor(t * 1.3 + i * 0.27) * 3) - 0.5) * c.w * 0.9, py = (hash(i * 5 + Math.floor(t * 1.3 + i * 0.27)) - 0.5) * c.h * 0.9;
          sp.setAttribute("opacity", (Math.sin(ph * Math.PI) * clamp(a / 0.5, 0, 1)).toFixed(3)); sp.setAttribute("transform", `translate(${px.toFixed(1)},${py.toFixed(1)}) scale(${(0.5 + Math.sin(ph * Math.PI) * 0.6).toFixed(3)}) rotate(${(ph * 90).toFixed(1)})`); });
        if (c.caret) { const shown = Math.min(n, Math.floor(a * 34)), L = c.letters[Math.max(0, shown - 1)]; if (L) { c.caret.setAttribute("x", (L.x + measure(L.ch, c.fs, M.font, M.weight) + 4).toFixed(1)); c.caret.setAttribute("y", (L.y - c.fs * 0.72).toFixed(1)); }
          c.caret.setAttribute("opacity", shown < n || Math.floor(t * 2.5) % 2 ? 1 : 0); }
      }
    };
    // ---- audit: step through the timeline and report every on-screen word problem (pure layout math, no rendering)
    TY.audit = (D, step = 0.1) => { if (!laidOut) layout(); const issues = [], SAFE = { x0: 48, y0: 40, x1: W - 48, y1: H - 40 };
      const rect = (c) => ({ x0: c.cx - c.w / 2, y0: c.cy - c.h / 2, x1: c.cx + c.w / 2, y1: c.cy + c.h / 2 });
      const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
      const seen = new Set(), push = (key, o) => { if (!seen.has(key)) { seen.add(key); issues.push(o); } };
      for (const c of cards) { // text wider than its box?
        const tw = Math.max(...c.lines.map((l) => measure(l, c.fs, c.M.font, c.M.weight))); if (tw > c.w - 20) push("ovf" + c.text, { t: c.t0, kind: "text overflows card", text: c.text });
        if (c.fs < 26 && c.zone !== "source") push("small" + c.text, { t: c.t0, kind: "font too small (" + c.fs.toFixed(0) + "px)", text: c.text }); }
      for (let t = 0; t <= D; t += step) { const vis = cards.filter((c) => t >= c.t0 && t < c.t1);
        for (let i = 0; i < vis.length; i++) { const a = rect(vis[i]);
          if (a.x0 < SAFE.x0 || a.x1 > SAFE.x1 || a.y0 < SAFE.y0 || a.y1 > SAFE.y1) push("safe" + vis[i].text, { t: +t.toFixed(2), kind: "outside safe area", text: vis[i].text });
          for (let j = i + 1; j < vis.length; j++) if (hit(a, rect(vis[j]))) push("ov" + vis[i].text + vis[j].text, { t: +t.toFixed(2), kind: "cards overlap", text: vis[i].text + "  ×  " + vis[j].text });
          if (opt.avoid && vis[i].zone !== "source") for (const f of opt.avoid(t) || []) if (hit(a, f)) push("face" + vis[i].text + Math.round(t), { t: +t.toFixed(2), kind: "covers a face", text: vis[i].text }); } }
      return issues; };
    window.__TY = TY;
    return TY;
  }
  window.SRType = { create, MOODS };
})();
