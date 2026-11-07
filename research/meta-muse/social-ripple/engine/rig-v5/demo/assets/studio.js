/* Social Ripple thumbnail studio: crisp vector cast (same rig as the show) on neon backdrops, rim light, glowing props, first-person text.
   TS.hero(svg, look, {x, y, scale, pose, mood, facing, look}) / TS.rim(...) / TS.thread(svg, x1,y1,x2,y2, w) / TS.label(svg, x, y, text) */
(function () {
  const SR = window.SR, { el } = SR; SR.SKIN = "#F1EBDD";
  const TS = {};
  TS.char = (parent, look, o) => { const c = SR.Character(parent, Object.assign({}, look, { id: o.id || "h", scale: o.scale || 1, x: [[0, o.x]], y: [[0, o.y]], facing: [[0, o.facing || 1]], noWalk: true,
      pose: [[0, o.pose || "relaxed", 0]], mood: [[0, o.mood || "happy", 0]], look: [[0, o.look || { x: 0, y: 0 }]], talk: [] })); c.update(0.5); return c; };
  // glow filter for rim light / threads
  TS.defs = (svg) => { const d = el("defs", {}, svg);
    const f = el("filter", { id: "glow", x: "-50%", y: "-50%", width: "200%", height: "200%" }, d); el("feGaussianBlur", { stdDeviation: 10, result: "b" }, f); const m = el("feMerge", {}, f); el("feMergeNode", { in: "b" }, m); el("feMergeNode", { in: "SourceGraphic" }, m);
    const r = el("filter", { id: "rim", x: "-30%", y: "-30%", width: "160%", height: "160%" }, d); el("feMorphology", { operator: "dilate", radius: 7, in: "SourceAlpha", result: "dl" }, r); el("feFlood", { "flood-color": "#FFE08A", result: "fc" }, r);
    el("feComposite", { in: "fc", in2: "dl", operator: "in", result: "rim" }, r); el("feGaussianBlur", { in: "rim", stdDeviation: 6, result: "rb" }, r); const m2 = el("feMerge", {}, r); el("feMergeNode", { in: "rb" }, m2); el("feMergeNode", { in: "SourceGraphic" }, m2);
    return d; };
  TS.thread = (svg, x1, y1, x2, y2, w = 6, bend = -120, dark = false) => { const mx = (x1 + x2) / 2, my = Math.min(y1, y2) + bend, d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    if (dark) el("path", { d, fill: "none", stroke: "#B8560C", "stroke-width": w + 6, "stroke-linecap": "round", opacity: 0.85 }, svg);   // outline so it reads on bright daytime art
    el("path", { d, fill: "none", stroke: "#FF9E2C", "stroke-width": w * 4, opacity: 0.35, filter: "url(#glow)", "stroke-linecap": "round" }, svg);
    el("path", { d, fill: "none", stroke: "#FFE7A0", "stroke-width": w, "stroke-linecap": "round" }, svg); };
  TS.label = (svg, x, y, text, o = {}) => { const g = el("g", { transform: `translate(${x},${y}) rotate(${o.rot || 0})` }, svg); const w = text.length * (o.fs || 34) * 0.62 + 40;
    el("rect", { x: -w / 2, y: -30, width: w, height: 60, rx: 16, fill: o.bg || "#2B2140", stroke: o.stroke || "#FFC94A", "stroke-width": 6, filter: "url(#glow)" }, g);
    el("path", { d: "M-14,28 L0,48 L14,28 Z", fill: o.stroke || "#FFC94A" }, g);
    el("text", { x: 0, y: 12, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": o.fs || 34, fill: o.fg || "#FFE3A0", "letter-spacing": 1 }, g).textContent = text; return g; };
  window.TS = TS;
})();
/* ---- spec-driven layouts (thumbnail system) ---- */
(function () {
  const SR = window.SR, { el } = SR, TS = window.TS;
  const PROPS = {
    sandwich: (g) => { el("path", { d: "M-38,4 Q0,-36 38,4 Z", fill: "#E8B06A", stroke: "#1E1B22", "stroke-width": 5 }, g); el("rect", { x: -40, y: 4, width: 80, height: 9, rx: 4, fill: "#7DBA5A", stroke: "#1E1B22", "stroke-width": 4 }, g);
      el("rect", { x: -38, y: 13, width: 76, height: 8, rx: 4, fill: "#E2574C", stroke: "#1E1B22", "stroke-width": 4 }, g); el("rect", { x: -38, y: 21, width: 76, height: 13, rx: 6, fill: "#E8B06A", stroke: "#1E1B22", "stroke-width": 5 }, g); },
    heart: (g) => el("path", { d: "M0,6 C-10,-4 -22,6 -11,16 L0,26 L11,16 C22,6 10,-4 0,6 Z", fill: "#FF5A7A", stroke: "#1E1B22", "stroke-width": 3 }, g),
    spark: (g) => el("path", { d: "M0,-16 L4,-4 L16,0 L4,4 L0,16 L-4,4 L-16,0 L-4,-4 Z", fill: "#FFE27A" }, g),
    // inner weather (ep7): sun / cloud / rain / storm
    sun: (g) => { for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; el("line", { x1: Math.cos(a) * 30, y1: Math.sin(a) * 30, x2: Math.cos(a) * 44, y2: Math.sin(a) * 44, stroke: "#1E1B22", "stroke-width": 11, "stroke-linecap": "round" }, g);
        el("line", { x1: Math.cos(a) * 30, y1: Math.sin(a) * 30, x2: Math.cos(a) * 44, y2: Math.sin(a) * 44, stroke: "#FFC93C", "stroke-width": 5, "stroke-linecap": "round" }, g); } el("circle", { r: 24, fill: "#FFD84A", stroke: "#1E1B22", "stroke-width": 5 }, g); },
    cloud: (g, dark) => el("path", { d: "M-46,14 C-60,14 -60,-8 -42,-8 C-40,-30 -12,-34 -4,-16 C4,-34 34,-30 34,-10 C52,-12 56,14 40,14 Z", fill: dark ? "#5C6378" : "#EEF2F8", stroke: "#1E1B22", "stroke-width": 5, "stroke-linejoin": "round" }, g),
    rain: (g) => { PROPS.cloud(g, true); [-26, -6, 14, 32].forEach((x, i) => el("line", { x1: x, y1: 22 + (i % 2) * 6, x2: x - 6, y2: 40 + (i % 2) * 6, stroke: "#6FB6FF", "stroke-width": 5, "stroke-linecap": "round" }, g)); },
    storm: (g) => { PROPS.cloud(g, true); el("path", { d: "M2,14 L-12,38 L0,38 L-8,60 L16,30 L4,30 L14,14 Z", fill: "#FFD84A", stroke: "#1E1B22", "stroke-width": 4, "stroke-linejoin": "round" }, g);
      [-30, 30].forEach((x) => el("line", { x1: x, y1: 22, x2: x - 6, y2: 42, stroke: "#6FB6FF", "stroke-width": 5, "stroke-linecap": "round" }, g)); },
  };
  TS.prop = (svg, kind, x, y, k = 1, o = {}) => { const g = el("g", { transform: `translate(${x},${y}) scale(${k}) rotate(${o.rot || 0})`, opacity: o.opacity ?? 1, filter: o.glow ? "url(#glow)" : null }, svg); PROPS[kind](g); return g; };
  TS.bubble = (svg, x, y, text, o = {}) => { const g = el("g", { transform: `translate(${x},${y})` }, svg), fs = o.fs || 30, w = text.length * fs * 0.6 + 34;
    el("rect", { x: -w / 2, y: -fs, width: w, height: fs * 1.6, rx: fs * 0.6, fill: "#FFFFFF", stroke: "#1E1B22", "stroke-width": 5 }, g);
    el("path", { d: `M${-10},${fs * 0.6 - 2} L${o.tail || -18},${fs * 0.6 + 22} L${12},${fs * 0.6 - 2} Z`, fill: "#FFFFFF", stroke: "#1E1B22", "stroke-width": 5, "stroke-linejoin": "round" }, g);
    el("rect", { x: -16, y: fs * 0.6 - 9, width: 32, height: 8, fill: "#FFFFFF" }, g);
    el("text", { x: 0, y: fs * 0.33, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": fs, fill: "#1E1B22" }, g).textContent = text; return g; };
  // render a full thumbnail from a spec (see SYSTEM.md)
  TS.render = (spec) => {
    const body = document.body; body.innerHTML = "";
    const bg = document.createElement("div"); bg.style.cssText = "position:absolute;inset:0;" + (spec.bg.image ? `background:url(${spec.bg.image}) center/cover;filter:saturate(1.3) brightness(1.06)` : `background:${spec.bg.css}`); body.appendChild(bg);
    if (spec.bg.overlay) { const o = document.createElement("div"); o.style.cssText = "position:absolute;inset:0;background:" + spec.bg.overlay; body.appendChild(o); }
    const svg = el("svg", { viewBox: "0 0 1280 720", width: 1280, height: 720, style: "position:absolute;inset:0" }, body); TS.defs(svg);
    const conn = el("g", {}, svg), crowd = el("g", { opacity: spec.crowdOpacity ?? 0.6 }, svg), fx = el("g", {}, svg), hero = el("g", { filter: "url(#rim)" }, svg), top = el("g", {}, svg);
    (spec.crowd || []).forEach((c, i) => { const k = c.scale, hy = c.y - 262 * k, chestY = c.y - 150 * k;   // head centre / chest for a standing rig
      if (spec.connect) TS.thread(conn, spec.connect.x, spec.connect.y, c.x, chestY, 3 + k * 4, -(60 + (i * 37) % 110), !!spec.connect.dark);
      TS.char(c.solid ? fx : crowd, c.look, { id: "c" + i, x: c.x, y: c.y, scale: k, mood: c.mood || "happy", pose: c.pose || "relaxed", facing: c.facing || 1 });
      (c.over || []).forEach((p) => TS.prop(fx, p.kind, c.x + (p.dx || 0) * k, hy + (p.dy || -40) * k, (p.k || 1) * k, { glow: p.glow, opacity: p.opacity }));
      if (c.say) TS.bubble(fx, c.x + (c.say.dx || 0) * k, hy + (c.say.dy || -60) * k, c.say.text, { fs: (c.say.fs || 30) * Math.max(0.7, k) }); });
    if (spec.hero) { const h = spec.hero; TS.char(hero, h.look, { id: "hero", x: h.x, y: h.y, scale: h.scale, mood: h.mood, pose: h.pose, facing: h.facing || 1, look: h.lookDir });
      (h.over || []).forEach((p) => TS.prop(top, p.kind, h.x + (p.dx || 0), h.y - 262 * h.scale + (p.dy || -40), p.k || 1, { glow: p.glow })); }
    (spec.props || []).forEach((p) => TS.prop(top, p.kind, p.x, p.y, p.k || 1, { glow: p.glow, rot: p.rot }));
    const css = (s) => { const d = document.createElement("div"); d.style.cssText = s; body.appendChild(d); return d; };
    if (spec.text) { const t = spec.text, d = css(`position:absolute;${t.pos || "left:28px;top:14px"};font-family:Outfit;font-weight:900;line-height:.92;color:#fff;-webkit-text-stroke:16px #1E1B22;paint-order:stroke fill;text-shadow:0 10px 0 #1E1B22;text-align:${t.align || "left"}`);
      t.lines.forEach((l) => { const s = document.createElement("div"); s.textContent = l.t; s.style.fontSize = (l.size || 120) + "px"; s.style.color = l.punch ? "#FFD23F" : "#FFFFFF"; d.appendChild(s); }); }
    if (spec.counter) { const c = spec.counter, d = css(`position:absolute;${c.pos || "left:34px;bottom:30px"};background:#2B2140;border:7px solid #FFC94A;border-radius:26px;padding:10px 26px 4px;font-family:Outfit;font-weight:900;color:#fff;box-shadow:0 0 36px #ffc94acc,0 10px 0 rgba(0,0,0,.4)`);
      d.innerHTML = `<small style="display:block;font-size:26px;color:#FFE3A0;letter-spacing:4px">${c.label}</small><b style="font-size:84px;line-height:1">${c.value}</b>`; }
  };
})();
