/* Exaggerated expressions: the same face dials, pushed past normal range, plus anime emotion FX around the head. */
(function () {
  const SR = window.SR, { el } = SR, TS = window.TS;
  Object.assign(SR.MOODS, {
    shockX:  { open: 1, lid: 0, slant: -0.6, size: 1.85, look: 0, happy: 0, smile: -0.5, mouth: 1, mopen: 1.6, sweat: 1.6, tremble: 1, brow: 0.2 },
    laughX:  { open: 0, lid: 0, slant: 0, size: 1, look: 0, happy: 1, smile: 1.4, mouth: 1, mopen: 1.45, tears: 1, tremble: 0.9, blushK: 1 },
    sobX:    { open: 1, lid: 0.25, slant: -1.2, size: 1.2, look: 0.4, happy: 0, smile: -1.3, mouth: 1, mopen: 1.1, tears: 2, tremble: 0.8 },
    loveX:   { open: 1, lid: 0, slant: -0.4, size: 1.6, look: 0, happy: 0, smile: 1.2, mouth: 1, mopen: 0.6, heart: 1, blushK: 1.6 },
    starX:   { open: 1, lid: 0, slant: -0.3, size: 1.75, look: 0, happy: 0, smile: 1.3, mouth: 1, mopen: 1.0, star: 1, blushK: 0.8 },
    forcedX: { open: 1, lid: 0.1, slant: -0.7, size: 1.25, look: 0.3, happy: 0, smile: 0.9, mouth: 1, mopen: 0.05, sweat: 2, tremble: 0.5, blushK: 0.4 },
  });
  for (const k in SR.MOODS) if (SR.MOODS[k].smug == null) SR.MOODS[k].smug = 0;
  // anime emotion FX around a head at (x,y) with head radius r
  TS.fx = (svg, kind, x, y, r) => { const g = el("g", {}, svg), L = (a, r0, r1, w, c) => el("line", { x1: x + Math.cos(a) * r0, y1: y + Math.sin(a) * r0, x2: x + Math.cos(a) * r1, y2: y + Math.sin(a) * r1, stroke: c || "#1E1B22", "stroke-width": w, "stroke-linecap": "round" }, g);
    if (kind === "shock") { for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.95 + i * (Math.PI * 0.9 / 8); L(a, r * 1.15, r * 1.55, 9); }
      el("text", { x: x + r * 1.15, y: y - r * 0.9, "font-family": "Outfit", "font-weight": 900, "font-size": r * 0.9, fill: "#FFD23F", stroke: "#1E1B22", "stroke-width": 10, "paint-order": "stroke" }, g).textContent = "!!"; }
    if (kind === "laugh") { [[-1, -0.2], [1, -0.4], [-1.1, 0.4], [1.15, 0.3]].forEach(([sx, sy], i) => { const cx = x + sx * r * 1.25, cy = y + sy * r; for (let j = 0; j < 3; j++) L(-Math.PI / 2 + (j - 1) * 0.5 + (sx < 0 ? -0.3 : 0.3), 0, 0, 0); 
        el("text", { x: cx, y: cy, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": r * (0.5 - i * 0.05), fill: "#FFFFFF", stroke: "#1E1B22", "stroke-width": 8, "paint-order": "stroke", transform: `rotate(${sx * 14},${cx},${cy})` }, g).textContent = "HA"; }); }
    if (kind === "sob") { [-1, 1].forEach((s) => el("path", { d: `M${x + s * r * 0.38},${y + r * 0.05} C${x + s * r * 0.9},${y + r * 0.8} ${x + s * r * 1.25},${y + r * 1.4} ${x + s * r * 1.45},${y + r * 2.4}`, fill: "none", stroke: "#7EC8FF", "stroke-width": r * 0.22, "stroke-linecap": "round", opacity: 0.9 }, g));
      for (let i = 0; i < 6; i++) el("line", { x1: x - r * 1.4 + i * r * 0.56, y1: y - r * 1.9, x2: x - r * 1.4 + i * r * 0.56, y2: y - r * 1.3, stroke: "#5C6378", "stroke-width": 6, "stroke-linecap": "round" }, g); }
    if (kind === "love") { for (let i = 0; i < 5; i++) { const a = -Math.PI * 0.9 + i * 0.45, hx = x + Math.cos(a) * r * 1.5, hy = y + Math.sin(a) * r * 1.35, k = r / 70 * (1.1 - i * 0.1);
        el("path", { d: "M0,6 C-10,-4 -22,6 -11,16 L0,26 L11,16 C22,6 10,-4 0,6 Z", fill: "#FF5A7A", stroke: "#1E1B22", "stroke-width": 3, transform: `translate(${hx},${hy}) scale(${k * 1.6})` }, g); } }
    if (kind === "star") { for (let i = 0; i < 7; i++) { const a = -Math.PI + i * (Math.PI / 6), k = r / 55; el("path", { d: "M0,-16 L4,-4 L16,0 L4,4 L0,16 L-4,4 L-16,0 L-4,-4 Z", fill: "#FFE27A", stroke: "#1E1B22", "stroke-width": 2, transform: `translate(${x + Math.cos(a) * r * 1.5},${y + Math.sin(a) * r * 1.3}) scale(${k * (0.8 + (i % 3) * 0.3)})` }, g); } }
    if (kind === "forced") { el("path", { d: `M${x + r * 0.95},${y - r * 0.9} q${r * 0.25},${r * 0.45} 0,${r * 0.62} q${-r * 0.25},${-r * 0.17} 0,${-r * 0.62} Z`, fill: "#7EC8FF", stroke: "#1E1B22", "stroke-width": 5 }, g);
      for (let i = 0; i < 4; i++) L(-Math.PI * 0.15 + i * 0.12, r * 1.2, r * 1.42, 5, "#1E1B22"); }
    return g; };
})();
