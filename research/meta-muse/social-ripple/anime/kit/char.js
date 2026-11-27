/* Anime character "ink" figures for Social Ripple: our own simplified drawings built from each character's
   signature traits (hair, outfit colours, marks). CHAR(K or {I}) → { draw(p, name, x, y, s, at, o) } returning a figure handle. */
(function () {
  window.CHAR = function (K) {
    const { I } = K, el = I.el, INKC = I.INKC;
    const poly = (pts) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" L") + " Z";
    const spikes = (cx, cy, r, a0, a1, n, rin, rout, jit = 0) => { const pts = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * (i / n)) * Math.PI / 180, rr = i % 2 ? rout + (i % 4 === 1 ? jit : -jit) : rin; pts.push([cx + Math.cos(a) * r * rr, cy + Math.sin(a) * r * rr]); } return pts.concat([[cx + r * 0.92, cy - r * 0.38], [cx - r * 0.92, cy - r * 0.38]]); };
    const fillP = (p, d, fill, at, o = {}) => I.fill(p, el("path", { d, fill, stroke: o.stroke ?? INKC, "stroke-width": o.sw ?? 6, "stroke-linejoin": "round", opacity: 0 }), at, o.dur || 0.25, { sound: o.sound ?? false });
    const P = {
      jinwoo: { hair: "#1D1B1A", coat: "#262330", coatLen: 1.0, collar: true, pants: "#1D1B1A", eye: "#3FA9F5" },
      naruto: { hair: "#F4C430", coat: "#F28C28", coatLen: 0.55, pants: "#F28C28", eye: "#3B7DD8", band: true, whiskers: true },
      luffy: { hair: "#1D1B1A", coat: "#D8322A", coatLen: 0.5, vest: true, pants: "#3D6FB0", eye: INKC, hat: true, scar: true },
    };
    function draw(p, name, x, y, s, at, o = {}) {
      const c = P[name], g = el("g", {}, p), r = 80 * s, cx = x, cy = y - 330 * s;
      // body: coat / jacket as a filled shape under the stick limbs
      const sh = y - 250 * s, hem = y - 250 * s + 300 * s * c.coatLen + (c.coatLen > 0.8 ? 40 * s : 0);
      const legs = I.path(g, `M${x - 18 * s},${y - 60 * s} L${x - 55 * s},${y + 90 * s} M${x + 18 * s},${y - 60 * s} L${x + 55 * s},${y + 90 * s}`, at + 0.6, 0.3, { w: 14 * s, color: c.pants });
      fillP(g, c.vest ? `M${x - 70 * s},${sh + 10 * s} L${x - 20 * s},${sh} L${x - 25 * s},${hem} L${x - 85 * s},${hem} Z M${x + 70 * s},${sh + 10 * s} L${x + 20 * s},${sh} L${x + 25 * s},${hem} L${x + 85 * s},${hem} Z`
        : `M${x - 60 * s},${sh + 5 * s} L${x + 60 * s},${sh + 5 * s} L${x + (c.coatLen > 0.8 ? 120 : 80) * s},${hem} L${x - (c.coatLen > 0.8 ? 120 : 80) * s},${hem} Z`, c.coat, at + 0.3, { sound: "swish" });
      if (c.collar) fillP(g, `M${x - 62 * s},${sh + 8 * s} L${x - 40 * s},${sh - 55 * s} L${x},${sh + 30 * s} L${x + 40 * s},${sh - 55 * s} L${x + 62 * s},${sh + 8 * s} L${x},${sh + 70 * s} Z`, c.coat, at + 0.35);
      if (c.vest) I.path(g, `M${x},${sh} V${hem}`, at + 0.35, 0.2, { w: 6 * s, color: "#E9C8A0", silent: true });
      const arms = o.arms || `M${x - 55 * s},${sh + 20 * s} L${x - 100 * s},${sh + 150 * s} M${x + 55 * s},${sh + 20 * s} L${x + 100 * s},${sh + 150 * s}`;
      I.path(g, arms, at + 0.45, 0.3, { w: 16 * s, color: c.vest ? "#E9C8A0" : c.coat });
      // head
      I.fill(g, el("circle", { cx, cy, r, fill: "#FFF6E8", stroke: INKC, "stroke-width": 7 * s, opacity: 0 }), at, 0.2, { sound: "pop" });
      // eyes (two styles), mouths by mood
      const eyes = el("g", {}, g), glow = el("g", { opacity: 0 }, g);
      I.path(eyes, `M${cx - 30 * s},${cy - 12 * s} l0,${18 * s} M${cx + 30 * s},${cy - 12 * s} l0,${18 * s}`, at + 0.3, 0.15, { w: 9 * s, silent: true });
      [-1, 1].forEach((d) => { el("ellipse", { cx: cx + d * 30 * s, cy: cy - 2 * s, rx: 26 * s, ry: 11 * s, fill: c.eye, opacity: 0.3 }, glow);
        el("path", { d: `M${cx + d * 14 * s},${cy} L${cx + d * 46 * s},${cy - 11 * s} L${cx + d * 40 * s},${cy + 5 * s} Z`, fill: c.eye, stroke: INKC, "stroke-width": 3.5 * s }, glow); });
      const mouth = { neutral: `M${cx - 20 * s},${cy + 38 * s} l${40 * s},0`, smile: `M${cx - 30 * s},${cy + 30 * s} q${30 * s},${26 * s} ${60 * s},0`, grin: `M${cx - 40 * s},${cy + 26 * s} q${40 * s},${44 * s} ${80 * s},0 z`, sad: `M${cx - 26 * s},${cy + 46 * s} q${26 * s},${-20 * s} ${52 * s},0`, serious: `M${cx - 16 * s},${cy + 40 * s} l${32 * s},${-3 * s}` };
      const ms = {}; for (const m in mouth) { ms[m] = I.path(g, mouth[m], at + 0.35, 0.15, { w: 6 * s, silent: true }); ms[m].style.display = "none"; }
      // signature marks
      if (c.whiskers) for (const d of [-1, 1]) for (let k = 0; k < 3; k++) I.path(g, `M${cx + d * 40 * s},${cy + (12 + k * 12) * s} l${d * 34 * s},${(k - 1) * 4 * s}`, at + 0.4, 0.1, { w: 4 * s, silent: true });
      if (c.scar) I.path(g, `M${cx - 50 * s},${cy + 16 * s} q${14 * s},${10 * s} ${30 * s},0 M${cx - 44 * s},${cy + 12 * s} l${4 * s},${12 * s} M${cx - 32 * s},${cy + 12 * s} l${4 * s},${12 * s}`, at + 0.4, 0.15, { w: 3.5 * s, silent: true });
      // hair
      if (name === "jinwoo") { fillP(g, poly(spikes(cx, cy, r, 192, 348, 12, 1.0, 1.3, 0.07)), c.hair, at + 0.15, { sw: 4 * s });
        const R = (u, v) => [cx + u * r, cy + v * r];
        fillP(g, poly([R(-0.98, -0.3), R(-1.02, 0.2), R(-0.86, 0.02), R(-0.78, -0.28), R(-0.6, -0.12), R(-0.48, -0.42), R(-0.22, -0.2), R(-0.06, -0.46), R(0.22, -0.17), R(0.36, -0.44), R(0.62, -0.19), R(0.72, -0.4), R(0.86, 0.04), R(1.02, 0.18), R(0.98, -0.3), R(0.7, -0.9), R(-0.7, -0.9)]), c.hair, at + 0.2, { sw: 4 * s }); }
      if (name === "naruto") { fillP(g, poly(spikes(cx, cy, r, 160, 380, 18, 0.95, 1.62, 0.12)), c.hair, at + 0.15, { sw: 5 * s });
        fillP(g, poly([[cx - 70 * s, cy - 40 * s], [cx - 52 * s, cy - 24 * s], [cx - 30 * s, cy - 40 * s], [cx + 30 * s, cy - 40 * s], [cx + 52 * s, cy - 24 * s], [cx + 70 * s, cy - 40 * s], [cx + 60 * s, cy - 80 * s], [cx - 60 * s, cy - 80 * s]]), c.hair, at + 0.2, { sw: 4 * s });
        fillP(g, `M${cx - 84 * s},${cy - 48 * s} Q${cx},${cy - 70 * s} ${cx + 84 * s},${cy - 48 * s} L${cx + 82 * s},${cy - 24 * s} Q${cx},${cy - 46 * s} ${cx - 82 * s},${cy - 24 * s} Z`, "#2C3E73", at + 0.25, { sw: 4 * s });
        fillP(g, `M${cx - 36 * s},${cy - 62 * s} h${72 * s} v${30 * s} h${-72 * s} z`, "#C9CED6", at + 0.3, { sw: 4 * s }); }
      if (name === "luffy") { fillP(g, poly(spikes(cx, cy, r, 175, 365, 12, 0.98, 1.18, 0.05)), c.hair, at + 0.15, { sw: 4 * s });
        fillP(g, `M${cx - 165 * s},${cy - 48 * s} Q${cx},${cy - 10 * s} ${cx + 165 * s},${cy - 48 * s} Q${cx},${cy - 92 * s} ${cx - 165 * s},${cy - 48 * s} Z`, "#E8C15A", at + 0.25, { sw: 5 * s, sound: "slap" });
        fillP(g, `M${cx - 78 * s},${cy - 60 * s} Q${cx - 80 * s},${cy - 175 * s} ${cx},${cy - 178 * s} Q${cx + 80 * s},${cy - 175 * s} ${cx + 78 * s},${cy - 60 * s} Z`, "#E8C15A", at + 0.28, { sw: 5 * s });
        fillP(g, `M${cx - 79 * s},${cy - 88 * s} Q${cx},${cy - 100 * s} ${cx + 79 * s},${cy - 88 * s} L${cx + 78 * s},${cy - 62 * s} Q${cx},${cy - 74 * s} ${cx - 78 * s},${cy - 62 * s} Z`, "#C62F2A", at + 0.32, { sw: 4 * s }); }
      const keys = [[0, o.mood || "neutral", !!o.glow]];
      return { g, keys, setMood: (t0, m) => keys.push([t0, m, keys[keys.length - 1][2]]), setGlow: (t0, v) => keys.push([t0, keys[keys.length - 1][1], v]),
        update(t) { let k = keys[0]; for (const kk of keys) if (t >= kk[0]) k = kk; for (const m in ms) ms[m].style.display = m === k[1] ? "inline" : "none";
          glow.setAttribute("opacity", k[2] && t >= at + 0.3 ? 1 : 0); eyes.setAttribute("opacity", k[2] ? 0 : 1);
          const blink = !k[2] && (t * 1000 + x) % 3900 < 110; eyes.setAttribute("transform", blink ? `translate(0,${cy}) scale(1,0.15) translate(0,${-cy})` : "");
          g.setAttribute("transform", `translate(0,${(Math.sin(t * 2.2 + x) * 3).toFixed(2)})`); } };
    }
    // the "System" window (our own design): a glowing blue panel with a header and rows
    function system(p, x, y, w, rows, at, o = {}) {
      const g = el("g", {}, p), h = 110 + rows.length * 78;
      I.fill(g, el("rect", { x: x - 14, y: y - 14, width: w + 28, height: h + 28, rx: 18, fill: "#3FA9F5", opacity: 0 }), at, 0.25, { sound: "swish" }).setAttribute("fill-opacity", 0.18);
      I.fill(g, el("rect", { x, y, width: w, height: h, rx: 12, fill: "#0E1B2E", stroke: "#7CCBFF", "stroke-width": 5, opacity: 0 }), at + 0.05, 0.25, { sound: false });
      I.fill(g, Object.assign(el("text", { x: x + w / 2, y: y + 68, "text-anchor": "middle", "font-family": "Anton", "font-size": 52, fill: "#BFE6FF", "letter-spacing": 4, opacity: 0 }), { textContent: o.title || "[ DAILY QUEST ]" }), at + 0.15, 0.2, { sound: false });
      const rowEls = rows.map((r, i) => { const t = el("text", { x: x + 40, y: y + 150 + i * 78, "font-family": "Patrick Hand", "font-size": 50, fill: "#E8F6FF", opacity: 0 }, g); t.textContent = r; I.fill(g, t, at + 0.3 + i * (o.rowGap ?? 0.25), 0.15, { sound: i ? false : "pop" }); return t; });
      return { g, rowEls };
    }
    return { draw, system, presets: P };
  };
})();
