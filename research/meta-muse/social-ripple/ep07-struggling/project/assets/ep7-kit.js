/* Ep7 kit: inner-weather icons (animated, blendable sun -> cloud -> drizzle -> rain -> storm), v5 extras, HUD counter, rules card, source tags.
   Everything is a pure function of t (seek-safe). */
(function () {
  const SR = window.SR, { el, clamp, lerp } = SR, INK = "#1E1B22";
  const K = (window.K7 = {});
  K.sm = (a, b, t) => { const u = clamp((t - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  K.win = (t, a, b, fi = 0.3, fo = 0.3) => Math.min(K.sm(a, a + fi, t), 1 - K.sm(b - fo, b, t));
  K.back = (u) => { u = clamp(u, 0, 1); const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  K.mix = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); k = clamp(k, 0, 1); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join(""); };
  K.track = (keys, t) => SR.sampleTrack(keys, t, keys[0][1]);
  // ---------- inner weather: level 0 sun, 1 cloud, 2 drizzle, 3 rain, 4 storm ----------
  K.weather = function (parent, o = {}) {
    const g = el("g", {}, parent), inner = el("g", {}, g), sunG = el("g", {}, inner), rays = el("g", {}, sunG);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; el("line", { x1: Math.cos(a) * 30, y1: Math.sin(a) * 30, x2: Math.cos(a) * 45, y2: Math.sin(a) * 45, stroke: INK, "stroke-width": 11, "stroke-linecap": "round" }, rays);
      el("line", { x1: Math.cos(a) * 30, y1: Math.sin(a) * 30, x2: Math.cos(a) * 45, y2: Math.sin(a) * 45, stroke: "#FFC93C", "stroke-width": 5, "stroke-linecap": "round" }, rays); }
    el("circle", { r: 24, fill: "#FFD84A", stroke: INK, "stroke-width": 5 }, sunG);
    const rainG = el("g", {}, inner), drops = [0, 1, 2, 3, 4, 5].map((i) => el("line", { stroke: "#6FB6FF", "stroke-width": 5, "stroke-linecap": "round" }, rainG));
    const bolt = el("path", { d: "M2,10 L-12,36 L0,36 L-8,60 L16,28 L4,28 L14,10 Z", fill: "#FFD84A", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, inner);
    const cloud = el("path", { d: "M-46,14 C-60,14 -60,-8 -42,-8 C-40,-30 -12,-34 -4,-16 C4,-34 34,-30 34,-10 C52,-12 56,14 40,14 Z", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, inner);
    const sh = el("path", { d: "M-40,10 C-20,14 20,14 38,9", fill: "none", stroke: "#FFFFFF", "stroke-width": 3, "stroke-linecap": "round", opacity: 0.6 }, inner);
    const seed = o.seed || 1;
    function set(level, t, k = 1, pop = 1) {
      const lv = clamp(level, 0, 4), p = K.back(pop);
      g.setAttribute("opacity", pop > 0.001 ? 1 : 0); inner.setAttribute("transform", `scale(${(k * p).toFixed(3)})`);
      sunG.setAttribute("opacity", clamp(1 - lv * 1.4, 0, 1).toFixed(3)); rays.setAttribute("transform", `rotate(${(t * 20) % 360})`); sunG.setAttribute("transform", `translate(${lv * 14},${-lv * 6})`);
      const co = clamp(lv * 1.3, 0, 1); cloud.setAttribute("opacity", co.toFixed(3)); sh.setAttribute("opacity", (co * clamp(2.5 - lv, 0, 1) * 0.6).toFixed(3));
      cloud.setAttribute("fill", lv < 2 ? K.mix("#F4F6FA", "#C9CED8", lv - 1) : K.mix("#C9CED8", "#5C6378", (lv - 2) / 2));
      const bob = Math.sin(t * 2 + seed) * 2.5; cloud.setAttribute("transform", `translate(0,${bob.toFixed(2)})`);
      const rainK = clamp(lv - 1.4, 0, 2.6) / 2.6, nDrops = Math.round(2 + rainK * 4);
      drops.forEach((d, i) => { const x = -34 + i * 14, ph = ((t * (1.6 + rainK) + i * 0.37 + seed * 0.13) % 1), y = 18 + ph * 34, L = 8 + rainK * 12;
        d.setAttribute("x1", x); d.setAttribute("y1", y.toFixed(1)); d.setAttribute("x2", (x - 4).toFixed(1)); d.setAttribute("y2", (y + L).toFixed(1)); d.setAttribute("opacity", i < nDrops && lv > 1.4 ? (clamp(lv - 1.4, 0, 1) * (1 - ph * 0.6)).toFixed(3) : 0); });
      const flash = lv > 3.3 ? ((Math.floor(t * 6 + seed) % 5) < 3 ? 1 : 0.25) * clamp((lv - 3.3) * 1.5, 0, 1) : 0; bolt.setAttribute("opacity", flash.toFixed(2));
    }
    // long rain streaks falling from the cloud onto the head (big storms)
    const longG = el("g", { opacity: 0 }, g), longs = Array.from({ length: 7 }, () => el("line", { stroke: "#7EB8FF", "stroke-width": 4, "stroke-linecap": "round", opacity: 0.8 }, longG));
    function setLong(k, t, sc = 1) { longG.setAttribute("opacity", (k * 0.85).toFixed(3)); longs.forEach((l, i) => { const x = (-36 + i * 12) * sc, ph = (t * 1.8 + i * 0.29) % 1, y = (24 + ph * 130) * sc;
      l.setAttribute("x1", x.toFixed(1)); l.setAttribute("y1", y.toFixed(1)); l.setAttribute("x2", (x - 5 * sc).toFixed(1)); l.setAttribute("y2", (y + 26 * sc).toFixed(1)); l.setAttribute("opacity", ((1 - ph) * 0.85).toFixed(2)); }); }
    const api = { g, set, setLong }; return api;
  };
  // ---------- v5 extras: random looks for crowds ----------
  const SKINS = ["#F6D2B4", "#F0C8A0", "#E3AE85", "#C98B5E", "#B07448", "#9A6440", "#7A4A32", "#5E3B2A"];
  const COLS = ["#E8834A", "#3FA7A0", "#8A93A6", "#F2C14E", "#6C5CE7", "#E8634A", "#5E9E5A", "#D85A8A", "#4F7FB0", "#C9875A", "#7B6BB0", "#2F9E8F"];
  const HAIR = ["short", "bun", "curly", "ponytail", "long", "afro", "spiky", "cap", "short", "long"], HC = ["#1E1B22", "#3A2A22", "#6A4A3A", "#C79A5A", "#8A5A35", "#2A1A14"];
  const OUT = ["tee", "hoodie", "jacket", "shirt", "dress", "coat", "tee"], BODY = ["avg", "slim", "round", "broad", "pear", "lanky", "avg", "slim"], PANTS = ["#3A4A63", "#2F3A4A", "#5A4E44", "#6B6F7A", "#46524A", "#2E5A74"];
  K.extra = (i) => { const R = SR.mulberry32(1000 + i * 7), pick = (a) => a[Math.floor(R() * a.length)];
    return { build: "v5", body: pick(BODY), skin: pick(SKINS), color: pick(COLS), outfit: pick(OUT), hair: pick(HAIR), hairColor: pick(HC), pants: pick(PANTS), shoes: pick(["#F2EDE4", "#3B3446", "#7A5230", "#E86A8A"]), seed: 30 + i }; };
  // ---------- HUD: counter, source tag, label ----------
  K.counter = (svg, label) => { const g = el("g", { transform: "translate(1560,70)" }, svg);
    el("rect", { x: -190, y: -38, width: 380, height: 76, rx: 18, fill: "#2B2140", stroke: "#FFC94A", "stroke-width": 5 }, g);
    const ic = el("g", { transform: "translate(-140,0) scale(0.55)" }, g); el("path", { d: "M-46,14 C-60,14 -60,-8 -42,-8 C-40,-30 -12,-34 -4,-16 C4,-34 34,-30 34,-10 C52,-12 56,14 40,14 Z", fill: "#C9CED8", stroke: INK, "stroke-width": 6 }, ic);
    el("text", { x: -100, y: 11, "font-family": "Outfit", "font-weight": 900, "font-size": 30, fill: "#FFE3A0", "letter-spacing": 1 }, g).textContent = label;
    const num = el("text", { x: 160, y: 13, "text-anchor": "end", "font-family": "Outfit", "font-weight": 900, "font-size": 40, fill: "#FFFFFF" }, g);
    return { g, set(n, op, bump) { num.textContent = n; g.setAttribute("opacity", op.toFixed(3)); g.setAttribute("transform", `translate(1560,70) scale(${(1 + 0.12 * bump).toFixed(3)})`); } }; };
  K.source = (svg, text) => { const g = el("g", { transform: "translate(40,1030)" }, svg); const w = text.length * 11.5 + 36;
    el("rect", { x: 0, y: -26, width: w, height: 40, rx: 10, fill: "rgba(30,27,34,0.72)" }, g);
    el("text", { x: 18, y: 0, "font-family": "Nunito", "font-weight": 800, "font-size": 20, fill: "#F4EEE2" }, g).textContent = text; return g; };
  K.tag = (parent, text, o = {}) => { const g = el("g", {}, parent), fs = o.fs || 30, w = text.length * fs * 0.62 + 34;
    el("rect", { x: -w / 2, y: -fs * 0.9, width: w, height: fs * 1.75, rx: 14, fill: o.bg || "#6C5CE7", stroke: INK, "stroke-width": 5 }, g);
    el("text", { x: 0, y: fs * 0.33, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": fs, fill: o.fg || "#FFFFFF" }, g).textContent = text; return g; };
  // ---------- rules card ----------
  K.rules = (svg) => { const g = el("g", {}, svg);
    el("rect", { x: 360, y: 150, width: 1200, height: 780, rx: 36, fill: "#FFF6E3", stroke: INK, "stroke-width": 8 }, g);
    el("rect", { x: 360, y: 150, width: 1200, height: 130, rx: 36, fill: "#6C5CE7", stroke: INK, "stroke-width": 8 }, g);
    el("text", { x: 960, y: 238, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 64, fill: "#FFFFFF", "letter-spacing": 3 }, g).textContent = "THE RULES";
    const R = [["1", "You can see everyone's inner weather."], ["2", "They can't."], ["3", "You can't see your own."]];
    const rows = R.map(([n, s], i) => { const r = el("g", {}, g), y = 400 + i * 190;
      el("circle", { cx: 470, cy: y, r: 52, fill: "#FFC93C", stroke: INK, "stroke-width": 6 }, r); el("text", { x: 470, y: y + 22, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 60, fill: INK }, r).textContent = n;
      el("text", { x: 560, y: y + 20, "font-family": "Outfit", "font-weight": 900, "font-size": 54, fill: INK }, r).textContent = s; return r; });
    return { g, set(op, ks) { g.setAttribute("opacity", op.toFixed(3)); g.setAttribute("transform", `translate(960,540) scale(${(0.9 + 0.1 * K.back(op)).toFixed(3)}) translate(-960,-540)`);
      rows.forEach((r, i) => { const k = K.back(ks[i]); r.setAttribute("opacity", clamp(ks[i] * 3, 0, 1).toFixed(3)); r.setAttribute("transform", `translate(${((1 - k) * -60).toFixed(1)},0)`); }); } }; };
})();
(function () { const SR = window.SR, { el } = SR, base = SR.buildProp;
  SR.buildProp = function (g, kind) { if (kind === "box") { el("rect", { x: -44, y: -40, width: 88, height: 64, rx: 6, fill: "#C9875A", stroke: "#1E1B22", "stroke-width": 4 }, g); el("path", { d: "M-44,-24 L44,-24 M-10,-40 L-10,-24 M10,-40 L10,-24", fill: "none", stroke: "#1E1B22", "stroke-width": 3 }, g); return g; } return base ? base(g, kind) : null; }; })();
