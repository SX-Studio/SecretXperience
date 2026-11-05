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
  TS.thread = (svg, x1, y1, x2, y2, w = 6, bend = -120) => { const mx = (x1 + x2) / 2, my = Math.min(y1, y2) + bend, d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    el("path", { d, fill: "none", stroke: "#FF9E2C", "stroke-width": w * 4, opacity: 0.35, filter: "url(#glow)", "stroke-linecap": "round" }, svg);
    el("path", { d, fill: "none", stroke: "#FFE7A0", "stroke-width": w, "stroke-linecap": "round" }, svg); };
  TS.label = (svg, x, y, text, o = {}) => { const g = el("g", { transform: `translate(${x},${y}) rotate(${o.rot || 0})` }, svg); const w = text.length * (o.fs || 34) * 0.62 + 40;
    el("rect", { x: -w / 2, y: -30, width: w, height: 60, rx: 16, fill: o.bg || "#2B2140", stroke: o.stroke || "#FFC94A", "stroke-width": 6, filter: "url(#glow)" }, g);
    el("path", { d: "M-14,28 L0,48 L14,28 Z", fill: o.stroke || "#FFC94A" }, g);
    el("text", { x: 0, y: 12, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": o.fs || 34, fill: o.fg || "#FFE3A0", "letter-spacing": 1 }, g).textContent = text; return g; };
  window.TS = TS;
})();
