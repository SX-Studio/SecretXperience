/* Ep8 additions on top of ep7b-sets.js (window.SETS): party café, night window, clock header, generic rules card,
   coin-flip insert, and the glowing lie counters (screen-space, ConChaser-style neon numbers with an arrow). */
(function () {
  const SR = window.SR, { el, clamp, lerp } = SR, K = window.PK, S = window.SETS;
  const R = (p, x, y, w, h, fill, rx = 0, o = {}) => el("rect", Object.assign({ x, y, width: w, height: h, fill, rx }, o), p);
  const P = (p, d, fill, o = {}) => el("path", Object.assign({ d, fill }, o), p);
  const C = (p, cx, cy, r, fill, o = {}) => el("circle", Object.assign({ cx, cy, r, fill }, o), p);
  const T = (p, x, y, s, fs, fill = "#3a2e2a", o = {}) => { const e = el("text", Object.assign({ x, y, "text-anchor": "middle", "font-family": "Fredoka", "font-weight": 700, "font-size": fs, fill }, o), p); e.textContent = s; return e; };
  const Lg = (p, big) => el("g", { filter: big ? "url(#pshadowL)" : "url(#pshadow)" }, p);

  // ---------- glow filters (added once to the svg defs) ----------
  S.neonDefs = (svg) => { let d = svg.querySelector("defs"); if (!d) d = el("defs", {}, svg);
    if (!svg.querySelector("#neonR")) { const f = el("filter", { id: "neonR", x: "-40%", y: "-80%", width: "180%", height: "260%" }, d);
      el("feGaussianBlur", { in: "SourceGraphic", stdDeviation: 10, result: "b1" }, f); el("feGaussianBlur", { in: "SourceGraphic", stdDeviation: 3, result: "b2" }, f);
      const m = el("feMerge", {}, f); ["b1", "b1", "b2", "SourceGraphic"].forEach((i) => el("feMergeNode", { in: i }, m)); } };

  // ---------- café with a party (decor + darkness that also covers the characters) ----------
  S.cafeParty = (L) => { const base = S.cafe(L);
    const decor = el("g", { opacity: 0 }, L.mid);
    const cols = ["#E8634A", "#F2C14E", "#3FA7A0", "#6C5CE7", "#D85A8A"];
    for (let i = 0; i < 22; i++) { const x = -300 + i * 110; P(decor, `M${x},90 L${x + 55},90 L${x + 27},150 Z`, cols[i % 5]); }
    el("path", { d: "M-300,90 Q900,140 2100,90", stroke: "#7A4E32", "stroke-width": 5, fill: "none" }, decor);
    const ban = Lg(decor, true); R(ban, 140, 200, 900, 130, "#6C5CE7", 22); T(ban, 590, 290, "HAPPY BIRTHDAY!", 76, "#FFF6E3");
    [[-120, 380, "#E8634A"], [80, 330, "#F2C14E"], [1080, 360, "#3FA7A0"], [1260, 300, "#D85A8A"], [1780, 340, "#6C5CE7"], [1960, 390, "#F2C14E"]].forEach(([x, y, c]) => { const b = Lg(decor); el("ellipse", { cx: x, cy: y, rx: 52, ry: 64, fill: c }, b); P(b, `M${x},${y + 64} q-14,60 6,130 q14,60 -4,120`, "none", { stroke: "#3a2e2a", "stroke-width": 3 }); });
    const dark = R(L.front, -2000, -1500, 6000, 4000, "#0E0B14", 0, { opacity: 0 });
    return { HZ: 520, update(t, k = {}) { base.update(t, k.m ?? 0.15); decor.setAttribute("opacity", (k.party ?? 0).toFixed(2)); dark.setAttribute("opacity", (k.dark ?? 0).toFixed(2)); } }; };

  // ---------- the café window at night (YOU's reflection lives in reflG) ----------
  S.windowNight = (L) => { R(L.sky, -1200, -800, 4320, 2000, "#3B2A22");
    const out = el("g", {}, L.mid); R(out, 260, 60, 1400, 960, "#1B2236");
    [[300, 440, 520], [760, 380, 460], [1160, 460, 540]].forEach(([x, w, h], i) => { R(out, x, 1020 - h, w, h, "#2A3350", 6); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) R(out, x + 40 + c * (w - 80) / 3, 1020 - h + 40 + r * 120, 50, 60, (r + c + i) % 3 ? "#FFD27A" : "#3A4466", 4, { opacity: 0.85 }); });
    C(out, 1480, 180, 46, "#F4EFD8", { opacity: 0.9 });
    const reflG = el("g", {}, L.back); const sheen = el("g", {}, L.front); P(sheen, "M300,1020 L700,60 L820,60 L420,1020 Z", "#FFFFFF", { opacity: 0.08 }); P(sheen, "M1300,1020 L1600,300 L1640,300 L1340,1020 Z", "#FFFFFF", { opacity: 0.06 });
    R(L.front, 260, 60, 1400, 960, "none", 0, { stroke: "#4A3328", "stroke-width": 40 });
    return { HZ: 540, reflG, update() {} }; };

  // ---------- time-of-day header (top-left paper tag) ----------
  S.clock = (svg) => { const g = el("g", { opacity: 0 }, svg), b = Lg(g, true); const box = R(b, 40, 36, 330, 96, "#FFF6E3", 18); const ic = el("g", {}, b); C(ic, 100, 84, 30, "none", { stroke: "#3a2e2a", "stroke-width": 6 }); const hh = P(ic, "", "none", { stroke: "#3a2e2a", "stroke-width": 6, "stroke-linecap": "round" });
    const txt = T(b, 150, 104, "", 56, "#3a2e2a", { "text-anchor": "start" });
    return { g, set(op, text, t = 0) { g.setAttribute("opacity", op.toFixed(2)); txt.textContent = text; box.setAttribute("width", 140 + text.length * 31); const a = t * 1.5; hh.setAttribute("d", `M100,84 L${(100 + Math.sin(a) * 20).toFixed(1)},${(84 - Math.cos(a) * 20).toFixed(1)} M100,84 L${(100 + Math.sin(a / 12) * 13).toFixed(1)},${(84 - Math.cos(a / 12) * 13).toFixed(1)}`); g.setAttribute("transform", `translate(${((1 - K.back(clamp(op * 1.4, 0, 1))) * -60).toFixed(1)},0)`); } }; };

  // ---------- rules card with any rows ----------
  S.rules = (svg, rows, fine) => { const g = el("g", { opacity: 0 }, svg); const c = Lg(g, true); R(c, 300, 140, 1320, 800, "#FFF6E3", 30); R(c, 300, 140, 1320, 130, "#E8634A", 30); R(c, 300, 230, 1320, 40, "#E8634A");
    T(c, 960, 230, "THE RULES", 70, "#FFFFFF"); const rs = rows.map((s, i) => { const r = el("g", {}, c), y = 400 + i * 170; C(r, 420, y, 52, "#FFC93C"); T(r, 420, y + 22, String(i + 1), 60); T(r, 505, y + 20, s, 54, "#3a2e2a", { "text-anchor": "start" }); return r; });
    const fn = fine ? T(c, 1560, 900, fine, 36, "#3a2e2a", { "text-anchor": "end", opacity: 0 }) : null;
    return { g, set(op, ks, fineK = 0) { g.setAttribute("opacity", op.toFixed(2)); rs.forEach((r, i) => { const k = K.back(ks[i] || 0); r.setAttribute("opacity", clamp((ks[i] || 0) * 3, 0, 1).toFixed(2)); r.setAttribute("transform", `translate(${((1 - k) * -60).toFixed(1)},0)`); }); if (fn) fn.setAttribute("opacity", fineK.toFixed(2)); } }; };

  // ---------- coin flip insert: "54%" ----------
  S.coin = (svg) => { const g = el("g", { opacity: 0 }, svg); R(g, 0, 0, 1920, 1080, "#1E1B22"); const coin = el("g", {}, g); const face = el("g", {}, coin);
    C(face, 0, 0, 200, "#F2C14E"); C(face, 0, 0, 170, "none", { stroke: "#D9A23A", "stroke-width": 14 }); const L1 = T(face, 0, 34, "?", 140, "#B8862C");
    const pct = T(g, 960, 960, "54%", 150, "#FF5A5A", { filter: "url(#neonR)" }); const sub = T(g, 960, 1040, "", 40, "#F4EEE2");
    return { g, set(op, t, t0) { g.setAttribute("opacity", op.toFixed(2)); const u = Math.max(0, t - t0), spin = Math.cos(u * 14) * Math.exp(-u * 0.25), y = 470 - Math.sin(clamp(u / 1.6, 0, 1) * Math.PI) * 180;
      coin.setAttribute("transform", `translate(960,${y.toFixed(1)}) scale(${Math.max(0.04, Math.abs(spin)).toFixed(3)},1)`); L1.textContent = spin > 0 ? "?" : "!"; pct.setAttribute("opacity", K.sm(t0 + 1.2, t0 + 1.6, t).toFixed(2)); pct.setAttribute("transform", `translate(960,960) scale(${(0.6 + 0.4 * K.back(clamp((t - t0 - 1.2) / 0.35, 0, 1))).toFixed(3)}) translate(-960,-960)`); } }; };

  // ---------- lie counters: neon numbers above heads ----------
  S.counters = (svg) => { const g = el("g", {}, svg), items = {};
    function item(name) { if (items[name]) return items[name]; const n = el("g", {}, g), glow = el("g", { filter: "url(#neonR)", opacity: 0.85 }, n);
      const t = T(glow, 0, 0, "", 100, "#FF4D4D"); const a = P(glow, "", "none", { stroke: "#FF4D4D", "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round" });
      const t2 = T(n, 0, 0, "", 100, "#FFFFFF", { stroke: "#FF4D4D", "stroke-width": 5, "paint-order": "stroke" }); return (items[name] = { n, t, a, t2 }); }
    return { hideAll() { for (const k in items) items[k].n.setAttribute("display", "none"); },
      show(name, value, x, headTop, hr, popK = 1, color = "#FF4D4D", op = 1) { const it = item(name), fs = clamp(hr * 1.15, 64, 170);
        it.n.setAttribute("display", op > 0.01 ? "inline" : "none"); it.n.setAttribute("opacity", op.toFixed(2)); it.t.textContent = String(value); it.t.setAttribute("fill", color); it.a.setAttribute("stroke", color); it.t2.textContent = String(value); it.t2.setAttribute("stroke", color); it.t2.setAttribute("stroke-width", (fs * 0.06).toFixed(1));
        const yN = Math.max(fs * 0.95, headTop - fs * 0.62); [it.t, it.t2].forEach((x) => { x.setAttribute("y", (fs * 0.36).toFixed(1)); x.setAttribute("font-size", fs.toFixed(1)); });
        const ay = fs * 0.55, ah = clamp(headTop - yN - fs * 0.55, 6, fs * 0.5); it.a.setAttribute("d", ah > 10 ? `M0,${ay.toFixed(1)} L0,${(ay + ah).toFixed(1)} M${(-ah * 0.45).toFixed(1)},${(ay + ah * 0.55).toFixed(1)} L0,${(ay + ah).toFixed(1)} L${(ah * 0.45).toFixed(1)},${(ay + ah * 0.55).toFixed(1)}` : "");
        const s = 1 + 0.45 * Math.sin(Math.PI * clamp(popK, 0, 1)) * (popK < 1 ? 1 : 0); it.n.setAttribute("transform", `translate(${x.toFixed(1)},${yN.toFixed(1)}) scale(${s.toFixed(3)})`); } }; };
})();
