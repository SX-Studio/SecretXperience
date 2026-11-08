/* Ep3 kit: time-of-day environment, HUD cards (screen space), word clock helpers. Pure functions of t. */
(function () {
  const SR = window.SR, TH = window.THREE; const { el, clamp, EASE } = SR;
  const K = {};
  // ---------- word clock ----------
  K.W = (w0, nth = 0, line) => { const w = w0.toLowerCase().replace(/[^a-z0-9']/g, ""); let k = 0; for (const x of window.WORDS) { if ((!line || x[3] === line) && x[0].toLowerCase().replace(/[^a-z0-9']/g, "") === w) { if (k === nth) return x[1]; k++; } } console.warn("word?", w, nth, line); return null; };
  K.win = (t, a, b, fi = 0.25, fo = 0.25) => clamp((t - a) / fi, 0, 1) * (1 - clamp((t - b) / fo, 0, 1));
  // ---------- environment presets ----------
  const P = {
    day:    { top: "#3F7FD6", mid: "#8EC0EE", hor: "#FFE6C4", gnd: "#2A8FA8", fog: "#B8D4EC", sun: "#FFF2D8", sunI: 2.7, sunPos: [24, 34, 18], hS: "#CFE4FF", hG: "#7A6A9A", hI: 1.55, stars: 0, sunK: 0.6, night: 0 },
    golden: { top: "#3A5BA8", mid: "#F2A86A", hor: "#FFD08A", gnd: "#3A7A98", fog: "#F2C49A", sun: "#FFB070", sunI: 2.6, sunPos: [40, 10, 12], hS: "#FFD8B0", hG: "#6A4A8A", hI: 1.2, stars: 0, sunK: 1.0, night: 0.15 },
    dusk:   { top: "#1E2A5A", mid: "#7A5A9A", hor: "#F08A6A", gnd: "#2A3A5A", fog: "#7A6A9A", sun: "#FF8A6A", sunI: 1.3, sunPos: [40, 4, 10], hS: "#9A8AC8", hG: "#3A2A5A", hI: 0.95, stars: 0.3, sunK: 0.6, night: 0.65 },
    night:  { top: "#0B1030", mid: "#1C2A5A", hor: "#3A3A6A", gnd: "#141A34", fog: "#1E2650", sun: "#9FB0FF", sunI: 0.75, sunPos: [-20, 30, 10], hS: "#5A6AB0", hG: "#2A2040", hI: 0.75, stars: 1, sunK: 0, night: 1 },
    dawn:   { top: "#4A6AB0", mid: "#F0B0A0", hor: "#FFE0B0", gnd: "#4A8AA8", fog: "#E8C8C0", sun: "#FFC8A0", sunI: 2.0, sunPos: [-40, 8, 10], hS: "#E8D0E0", hG: "#6A5A8A", hI: 1.2, stars: 0.1, sunK: 0.9, night: 0.3 },
  };
  K.P = P;
  const mixHex = (a, b, k) => { const ca = new TH.Color(a), cb = new TH.Color(b); return ca.lerp(cb, k); };
  // keys: [[t, presetName], ...] → blended env
  K.envAt = (keys, t) => { let i = 0; while (i < keys.length - 1 && t >= keys[i + 1][0]) i++; const a = P[keys[i][1]], j = Math.min(i + 1, keys.length - 1), b = P[keys[j][1]];
    const span = keys[j][0] - keys[i][0], k = j === i ? 0 : SR.EASE.inOut(clamp((t - keys[i][0]) / Math.max(0.01, span), 0, 1));
    const o = {}; for (const key in a) { const va = a[key], vb = b[key]; if (typeof va === "number") o[key] = va + (vb - va) * k; else if (Array.isArray(va)) o[key] = va.map((v, n) => v + (vb[n] - v) * k); else o[key] = mixHex(va, vb, k); } return o; };
  // install global lights; returns apply(env)
  K.lights = (W3) => { const hemi = new TH.HemisphereLight(0xffffff, 0x444444, 1.5), sun = new TH.DirectionalLight(0xffffff, 2.5); W3.scene.add(hemi); W3.scene.add(sun); W3.scene.add(sun.target);
    return (e, center) => { hemi.color.copy(e.hS); hemi.groundColor.copy(e.hG); hemi.intensity = e.hI; sun.color.copy(e.sun); sun.intensity = e.sunI; const c = center || [0, 0, 0]; sun.position.set(c[0] + e.sunPos[0], c[1] + e.sunPos[1], c[2] + e.sunPos[2]); sun.target.position.set(c[0], c[1], c[2]);
      const u = W3.sky.material.uniforms; u.cT.value.copy(e.top); u.cM.value.copy(e.mid); u.cH.value.copy(e.hor); u.cG.value.copy(e.gnd); u.sunDir.value.set(e.sunPos[0], Math.max(2, e.sunPos[1]), e.sunPos[2]).normalize(); u.sunCol.value.copy(e.sun); u.sunK.value = e.sunK;
      W3.fog.color.copy(e.fog); W3.stars.material.opacity = e.stars; }; };

  // ---------- HUD (screen space SVG) ----------
  K.hud = (svg) => {
    const H = {}; const defs = svg.querySelector("defs") || el("defs", {}, svg);
    const T = (p, x, y, s, size, fill, o = {}) => { const t = el("text", Object.assign({ x, y, "font-family": o.font || "Outfit", "font-weight": o.weight || 900, "font-size": size, fill, "text-anchor": o.anchor || "middle", "dominant-baseline": "central" }, o.attrs || {}), p); t.textContent = s; return t; };
    H.T = T;
    const shadow = (() => { const f = el("filter", { id: "hudsh", x: "-20%", y: "-20%", width: "140%", height: "160%" }, defs); el("feDropShadow", { dx: 0, dy: 8, stdDeviation: 8, "flood-color": "#120C22", "flood-opacity": 0.45 }, f); return "url(#hudsh)"; })();
    // pop-in group: scale with overshoot around (cx,cy)
    H.pop = (g, t, a, b, cx, cy, s0 = 0.6) => { const k = clamp((t - a) / 0.28, 0, 1), o = (1 - clamp((t - b) / 0.22, 0, 1)); const vis = t >= a && t < b + 0.22; g.setAttribute("display", vis ? "inline" : "none"); if (!vis) return;
      const sc = (s0 + (1 - s0) * EASE.back(k)) * (0.92 + 0.08 * o); g.setAttribute("opacity", Math.min(k * 2, 1) * o); g.setAttribute("transform", `translate(${cx},${cy}) scale(${sc}) translate(${-cx},${-cy})`); };
    // a paper card with a title (and optional subtitle)
    H.card = (o) => { const g = el("g", { display: "none" }, svg), w = o.w || 760, h = o.h || (o.sub ? 190 : 130), x = o.x ?? 960, y = o.y ?? 200;
      el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 26, fill: o.bg || "#FFF6E4", stroke: "#1E1B22", "stroke-width": 7, filter: shadow }, g);
      const tt = T(g, x, y - (o.sub ? 28 : 0), o.text, o.size || 64, o.color || "#1E1B22");
      const st = o.sub ? T(g, x, y + 48, o.sub, o.subSize || 30, o.subColor || "#6A5A7A", { font: "Nunito" }) : null;
      return { g, tt, st, update(t) { H.pop(g, t, o.t0, o.t1, x, y); }, setText(s) { tt.textContent = s; } }; };
    // a source tag (bottom-left), the "one study, one number, source named" rule
    H.source = (o) => { const g = el("g", { display: "none" }, svg); const w = o.w || 640; el("rect", { x: 70, y: 952, width: w, height: 70, rx: 16, fill: "#120C22", opacity: 0.82 }, g);
      T(g, 100, 987, o.text, 28, "#FFE7A0", { anchor: "start", font: "Nunito" }); return { g, update(t) { const k = K.win(t, o.t0, o.t1, 0.3, 0.3); g.setAttribute("display", k > 0 ? "inline" : "none"); g.setAttribute("opacity", k); g.setAttribute("transform", `translate(${-30 * (1 - k)},0)`); } }; };
    // speech/thought bubble with an icon or text, follows a screen point
    H.think = (o) => { const g = el("g", { display: "none" }, svg); const r = o.r || 70; el("circle", { cx: 0, cy: 0, r, fill: "#FFFFFF", stroke: "#1E1B22", "stroke-width": 6 }, g);
      el("circle", { cx: -r * 0.7, cy: r * 1.05, r: 13, fill: "#FFFFFF", stroke: "#1E1B22", "stroke-width": 5 }, g); el("circle", { cx: -r * 1.0, cy: r * 1.45, r: 8, fill: "#FFFFFF", stroke: "#1E1B22", "stroke-width": 4 }, g);
      const ic = el("g", {}, g); if (o.draw) o.draw(ic); if (o.text) T(ic, 0, 0, o.text, o.size || 30, "#1E1B22");
      return { g, ic, update(t, p) { const vis = t >= o.t0 && t < o.t1 + 0.2 && p; g.setAttribute("display", vis ? "inline" : "none"); if (!vis) return; const k = EASE.back(clamp((t - o.t0) / 0.3, 0, 1)) * (1 - clamp((t - o.t1) / 0.2, 0, 1)); const s = (o.s || 1) * k;
        g.setAttribute("transform", `translate(${p.x + (o.dx ?? 120)},${p.y + (o.dy ?? -150) + Math.sin(t * 2.4) * 4}) scale(${s})`); } }; };
    // speech bubble
    H.say = (o) => SR.Bubble(svg, { text: o.text, t0: o.t0, t1: o.t1, side: o.side || 1, size: o.size || 40, shout: o.shout });
    // icons
    H.icon = {
      bread: (g) => { el("path", { d: "M-34,10 q-6,-34 34,-34 q40,0 34,34 z", fill: "#D99A4E", stroke: "#1E1B22", "stroke-width": 5 }, g); [-14, 0, 14].forEach((x) => el("path", { d: `M${x - 6},-14 l10,-8`, stroke: "#8A5A2A", "stroke-width": 4 }, g)); },
      fish: (g) => { el("path", { d: "M-36,0 q20,-24 46,0 q-26,24 -46,0 z M10,0 l22,-16 v32 z", fill: "#7EC8E3", stroke: "#1E1B22", "stroke-width": 5, "stroke-linejoin": "round" }, g); el("circle", { cx: -22, cy: -4, r: 4, fill: "#1E1B22" }, g); },
      sandwich: (g) => { el("path", { d: "M-38,4 q38,-46 76,0 z", fill: "#E8B062", stroke: "#1E1B22", "stroke-width": 5 }, g); el("path", { d: "M-40,6 q10,8 20,0 q10,8 20,0 q10,8 20,0 q10,8 20,0", fill: "none", stroke: "#5FB04A", "stroke-width": 7 }, g); el("rect", { x: -38, y: 10, width: 76, height: 9, fill: "#E05A4A", stroke: "#1E1B22", "stroke-width": 3 }, g); el("rect", { x: -38, y: 19, width: 76, height: 11, rx: 5, fill: "#E8B062", stroke: "#1E1B22", "stroke-width": 5 }, g); },
      oven: (g) => { el("path", { d: "M-40,26 v-30 q0,-30 40,-30 q40,0 40,30 v30 z", fill: "#C8553D", stroke: "#1E1B22", "stroke-width": 5 }, g); el("path", { d: "M-18,26 v-14 q0,-14 18,-14 q18,0 18,14 v14 z", fill: "#FFB040", stroke: "#1E1B22", "stroke-width": 4 }, g); },
      coin: (g) => { el("circle", { r: 30, fill: "#FFC24A", stroke: "#1E1B22", "stroke-width": 5 }, g); T(g, 0, 2, "$", 34, "#8A5A10"); },
    };
    return H;
  };
  window.EP3K = K;
})();
