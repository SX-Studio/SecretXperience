/* INK: hand-drawn notebook engine. Everything is a stroke that draws itself on; lines "boil" (hand-drawn jitter);
   a camera glides across one long sheet of paper; POSTER cards (black, giant type, one red) cut in for big moments.
   API: const I = INK(svg); I.path(parent, d, at, dur, opts) / I.circle / I.text / I.fill ... I.update(t). */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (n, a = {}, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), sm = (a, b, t) => { const u = clamp((t - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2), back = (u) => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  const INKC = "#1D1B1A", PAPER = "#F5EEDC", HI = "#FFE45C", RED = "#E23B2E";
  window.INK = function (svg) {
    const defs = el("defs", {}, svg);
    for (let i = 0; i < 3; i++) { const f = el("filter", { id: "boil" + i, filterUnits: "userSpaceOnUse", x: 0, y: 0, width: 1920, height: 1080 }, defs);
      el("feTurbulence", { type: "fractalNoise", baseFrequency: 0.022, numOctaves: 2, seed: 3 + i * 7 }, f); el("feDisplacementMap", { in: "SourceGraphic", scale: 5 }, f); }
    const pf = el("filter", { id: "paperTex" }, defs); el("feTurbulence", { type: "fractalNoise", baseFrequency: 0.85, numOctaves: 3, seed: 2 }, pf); el("feColorMatrix", { values: "0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .25  0 0 0 .07 0" }, pf);
    const items = [], events = [];
    const api = { setView(x, y, w, h) { for (let i = 0; i < 3; i++) { const f = defs.querySelector('#boil' + i); f.setAttribute('x', x); f.setAttribute('y', y); f.setAttribute('width', w); f.setAttribute('height', h); } }, defs, items, events, INKC, PAPER, HI, RED, el, sm, ease, back, clamp };
    // a stroke that draws itself on between `at` and `at+dur`
    api.path = (p, d, at, dur = 0.5, o = {}) => { const e = el("path", Object.assign({ d, fill: "none", stroke: o.color || INKC, "stroke-width": o.w || 7, "stroke-linecap": "round", "stroke-linejoin": "round" }, o.attrs || {}), p);
      items.push({ e, at, dur, kind: "stroke" }); if (!o.silent) events.push({ type: "draw", at, dur, loud: o.loud ?? (o.w || 7) / 7 }); return e; };
    api.circle = (p, cx, cy, r, at, dur = 0.5, o = {}) => api.path(p, `M${cx + r},${cy} a${r},${r} 0 1,1 ${-2 * r},0 a${r},${r} 0 1,1 ${2 * r},0`, at, dur, o);
    api.fill = (p, node, at, dur = 0.25, o = {}) => { p.appendChild(node); items.push({ e: node, at, dur, kind: "fade", pop: o.pop }); if (o.sound !== false) events.push({ type: o.sound || "pop", at }); return node; };
    // hand-lettered text revealed left to right
    api.text = (p, str, x, y, size, at, dur = 0.6, o = {}) => { const id = "clip" + items.length; const cp = el("clipPath", { id }, defs); const r = el("rect", { x: x - (o.anchor === "middle" ? size * str.length * 0.3 : 0) - 20, y: y - size * 1.1, width: 0, height: size * 1.6 }, cp);
      const t = el("text", { x, y, "font-family": o.font || "Caveat", "font-weight": 700, "font-size": size, fill: o.color || INKC, "text-anchor": o.anchor || "start", "clip-path": `url(#${id})` }, p); t.textContent = str;
      items.push({ e: r, at, dur, kind: "reveal", w: size * str.length * 0.62 + 60 }); events.push({ type: "draw", at, dur, loud: 0.7 }); return t; };
    api.ready = () => { for (const it of items) if (it.kind === "stroke") { it.L = it.e.getTotalLength(); it.e.setAttribute("stroke-dasharray", `${it.L} ${it.L}`); } };
    api.update = (t) => { for (const it of items) { const u = clamp((t - it.at) / it.dur, 0, 1);
      if (it.kind === "stroke") { it.e.setAttribute("stroke-dashoffset", (it.L * (1 - ease(u))).toFixed(1)); it.e.setAttribute("visibility", u > 0 ? "visible" : "hidden"); }
      else if (it.kind === "fade") { it.e.setAttribute("opacity", u.toFixed(3)); if (it.pop) { const bb = it.pop; it.e.setAttribute("transform", `translate(${bb[0]},${bb[1]}) scale(${(0.6 + 0.4 * back(u)).toFixed(3)}) translate(${-bb[0]},${-bb[1]})`); } }
      else if (it.kind === "reveal") it.e.setAttribute("width", (it.w * ease(u)).toFixed(1)); } };
    // a stick figure with a big round head; returns handles for mood/blink
    api.figure = (p, x, y, s, at, o = {}) => { const g = el("g", {}, p), k = s; const head = el("g", {}, g);
      api.circle(head, x, y - 330 * k, 80 * k, at, 0.45);
      const eyes = el("g", {}, head), mouths = {}, brows = {};
      api.path(eyes, `M${x - 30 * k},${y - 345 * k} l0,${16 * k} M${x + 30 * k},${y - 345 * k} l0,${16 * k}`, at + 0.4, 0.15, { w: 8 * k });
      const mood = { neutral: `M${x - 22 * k},${y - 295 * k} l44,0`, smile: `M${x - 34 * k},${y - 300 * k} q34,30 68,0`, sad: `M${x - 30 * k},${y - 285 * k} q30,-22 60,0`, forced: `M${x - 40 * k},${y - 302 * k} q40,26 80,0 M${x - 44 * k},${y - 306 * k} l-8,-6 M${x + 44 * k},${y - 306 * k} l8,-6`, worried: `M${x - 26 * k},${y - 290 * k} q13,-8 26,0 q13,8 26,0` };
      for (const m in mood) { mouths[m] = api.path(head, mood[m], at + 0.5, 0.15, { w: 6 * k, silent: true }); mouths[m].style.display = "none"; }
      const browD = { worried: `M${x - 48 * k},${y - 378 * k} l30,-10 M${x + 48 * k},${y - 378 * k} l-30,-10`, sad: `M${x - 48 * k},${y - 368 * k} l30,-12 M${x + 48 * k},${y - 368 * k} l-30,-12`, smile: "", neutral: "", forced: `M${x - 46 * k},${y - 380 * k} l28,4 M${x + 46 * k},${y - 380 * k} l-28,4` };
      for (const m in browD) if (browD[m]) { brows[m] = api.path(head, browD[m], at + 0.5, 0.15, { w: 5 * k, silent: true }); brows[m].style.display = "none"; }
      const body = el("g", {}, g); const arms = o.arms || `M${x},${y - 200 * k} L${x - 80 * k},${y - 90 * k} M${x},${y - 200 * k} L${x + 80 * k},${y - 90 * k}`;
      api.path(body, `M${x},${y - 250 * k} L${x},${y - 60 * k}`, at + 0.3, 0.3); api.path(body, arms, at + 0.55, 0.3);
      api.path(body, `M${x},${y - 60 * k} L${x - 55 * k},${y + 90 * k} M${x},${y - 60 * k} L${x + 55 * k},${y + 90 * k}`, at + 0.75, 0.3);
      const keys = [[0, o.mood || "neutral"]];
      return { g, head, eyes, keys, setMood: (t0, m) => keys.push([t0, m]), update(t) { let m = keys[0][1]; for (const [t0, mm] of keys) if (t >= t0) m = mm;
        for (const k2 in mouths) mouths[k2].style.display = k2 === m ? "inline" : "none"; for (const k2 in brows) brows[k2].style.display = k2 === m ? "inline" : "none";
        const blink = (t * 1000) % 3700 < 110; const ey = y - 337 * k; eyes.setAttribute("transform", blink ? `translate(0,${ey}) scale(1,0.15) translate(0,${-ey})` : "");
        g.setAttribute("transform", `translate(0,${(Math.sin(t * 2.2 + x) * 3).toFixed(2)})`); } };
    };
    // a speech bubble drawn by hand, with lettering inside
    api.bubble = (p, x, y, w, h, str, at, o = {}) => { const g = el("g", {}, p); const tx = o.tail ?? -1;
      api.path(g, `M${x - w / 2 + 30},${y} h${w - 60} q30,0 30,30 v${h - 60} q0,30 -30,30 h${-(w / 2 - 70)} l${tx * -10},40 l${tx * 40},-40 h${-(w / 2 - 10)} q-30,0 -30,-30 v${-(h - 60)} q0,-30 30,-30 z`, at, 0.45, { w: 6 });
      api.text(g, str, x, y + h / 2 + (o.size || 64) * 0.34, o.size || 64, at + 0.35, 0.5, { anchor: "middle" }); return g; };
    return api;
  };
})();
