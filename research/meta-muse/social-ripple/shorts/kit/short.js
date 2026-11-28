/* SHORT: vertical (1080x1920) frame for Social Ripple Shorts in the ink-notebook + poster style.
   The camera glides DOWN one tall sheet of paper; poster cards (black, Anton, one red) cut in for punchlines.
   const K = SHORT({ keys }); draw scenes into K.ink at world coords (x 0..1080, beat k centred at y = K.Y(k)), then
   K.run({ shots, posters, extra(t), events }). */
(function () {
  window.SHORT = function (o = {}) {
    const T = window.DT, D = window.DUR, WD = window.WORDS; for (const id in (o.fix || {})) for (const k in o.fix[id]) WD[id][k].text = o.fix[id][k];
    const S = (i) => T[i][0], E = (i) => T[i][0] + T[i][1], W = (i, k) => T[i][0] + WD[i][k < 0 ? WD[i].length + k : k].start;
    const svg = document.getElementById("ov"), I = INK(svg), { el, sm, ease, back, clamp, INKC, HI, RED } = I;
    el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: I.PAPER }, svg);
    const cam = el("g", {}, svg), world = el("g", {}, cam);
    for (let i = 0; i < 260; i++) el("line", { x1: -400, x2: 1500, y1: -400 + i * 50, y2: -400 + i * 50, stroke: "#9CC3D9", "stroke-width": 2, opacity: 0.45 }, world);
    el("line", { x1: 90, x2: 90, y1: -400, y2: 13000, stroke: "#E07A7A", "stroke-width": 3, opacity: 0.6 }, world);
    const ink = el("g", {}, world);
    el("rect", { x: 0, y: 0, width: 1080, height: 1920, filter: "url(#paperTex)", "pointer-events": "none" }, svg);
    const Y = (k) => 900 + k * 2200;   // beat centres down the sheet
    const hi = (p, x, y, w, h, at, rot = -2) => I.fill(p, el("rect", { x, y, width: w, height: h, fill: HI, opacity: 0, transform: `rotate(${rot} ${x + w / 2} ${y + h / 2})` }), at, 0.25, { sound: "swish" });
    const label = (p, str, x, y, size, at, color = INKC, font = "Patrick Hand") => I.fill(p, Object.assign(el("text", { x, y, "text-anchor": "middle", "font-family": font, "font-weight": font === "Caveat" ? 700 : 400, "font-size": size, fill: color, opacity: 0 }), { textContent: str }), at, 0.2, { sound: false });
    const figs = [];
    const fig = (...a) => { const f = I.figure(...a); figs.push(f); return f; };
    const K = { T, D, WD, S, E, W, svg, I, ink, world, Y, hi, label, fig, el, sm, ease, back, clamp, INKC, HI, RED };

    K.run = (cfg) => {
      // ---------- posters (screen space): [{ on:[a,b], bg, lines:[{txt,y,size,fill,at,x?}], slashAt?, shakeAt? }]
      const posters = (cfg.posters || []).map((p) => { const g = el("g", { opacity: 0 }, svg); el("rect", { width: 1080, height: 1920, fill: p.bg || "#0D0D0D" }, g);
        const slash = p.slashAt != null ? el("path", { d: "M640 -20 L1100 -20 L1100 1940 L820 1940 Z", fill: RED }, g) : null;
        const lines = p.lines.map((l) => { const t = el("text", { x: l.x ?? 90, y: l.y, "font-family": l.font || "Anton", "font-size": l.size, fill: l.fill || "#F4EFE6", "letter-spacing": 2, "text-anchor": l.anchor || "start" }, g); t.textContent = l.txt; return { t, l }; });
        return { p, g, slash, lines }; });
      // ---------- captions
      const KEY = o.keys || {}, inPoster = (t) => posters.some(({ p }) => t >= p.on[0] && t < p.on[1]);
      const caps = []; for (const id of Object.keys(T)) { if ((o.noCap || []).includes(id)) continue; let ch = []; const ws = WD[id];
        ws.forEach((w, k) => { ch.push(w); if (ch.length === (o.capStyle === "big" ? 2 : 3) || /[.,!?]$/.test(w.text) || k === ws.length - 1) { caps.push({ t: S(id) + ch[0].start, e: S(id) + (ws[k + 1] ? ws[k + 1].start : T[id][1] + 0.3), w: ch.map((x) => x.text) }); ch = []; } }); }
      const CY = o.capY || 1520, capG = el("g", {}, svg), capBox = el("rect", { y: CY - 72, height: 104, rx: 16, fill: "#FFFDF6", stroke: INKC, "stroke-width": 5 }, capG);
      const capT = el("text", { x: 540, y: CY, "text-anchor": "middle", "font-family": "Patrick Hand", "font-size": 76, fill: INKC }, capG);
      const BIG = o.capStyle === "big"; if (BIG) { capBox.setAttribute("display", "none"); capT.setAttribute("font-family", "Anton"); capT.setAttribute("font-size", 112); capT.setAttribute("fill", "#FFFDF6"); capT.setAttribute("stroke", INKC); capT.setAttribute("stroke-width", 12); capT.setAttribute("stroke-linejoin", "round"); capT.setAttribute("paint-order", "stroke"); capT.setAttribute("letter-spacing", 5); }
      function setCap(t) { const c = caps.find((c) => t >= c.t && t < c.e); if (!c || inPoster(t)) { capG.setAttribute("opacity", 0); return; }
        capG.setAttribute("opacity", 1); while (capT.firstChild) capT.removeChild(capT.firstChild);
        c.w.forEach((w, i) => { const ts = el("tspan", {}, capT); ts.textContent = (i ? " " : "") + w; if (BIG) ts.textContent = ts.textContent.toUpperCase(); if (KEY[w.toLowerCase().replace(/[^a-z0-9%]/g, "")]) ts.setAttribute("fill", BIG ? "#F2C230" : RED); });
        const L = Math.min(1040, c.w.join(" ").length * 35 + 70); capBox.setAttribute("x", 540 - L / 2); capBox.setAttribute("width", L);
        const k = clamp((t - c.t) / 0.15, 0, 1); capG.setAttribute("transform", `translate(540,${CY - 20}) scale(${(0.85 + 0.15 * back(k)).toFixed(3)}) translate(-540,${-(CY - 20)})`); }
      // ---------- camera: shots [t, x, y, zoom]; a glide of 0.6 s starts at t
      const shots = cfg.shots, G = cfg.glide || 0.6, DRIFT = cfg.drift ?? 0.012;
      // camera dynamics: glide between shots (ease), slow push-in drift + gentle sway inside each shot, punch-ins on key words, shake on slams
      const punches = (cfg.punches || []).map((p) => Object.assign({ z: 1.12, dur: 0.9 }, p));
      const shakes = (cfg.shakes || []).concat((cfg.posters || []).flatMap((p) => p.lines.filter((l) => l.big).map((l) => ({ t: l.at, a: 14 }))));
      const camAt = (t) => { let i = 0; while (i + 1 < shots.length && t >= shots[i + 1][0]) i++; const b = shots[i], a = shots[i - 1] || b, u = i === 0 ? 1 : ease(sm(b[0], b[0] + G, t));
        let x = a[1] + (b[1] - a[1]) * u, y = a[2] + (b[2] - a[2]) * u, z = a[3] + (b[3] - a[3]) * u, r = (a[4] || 0) + ((b[4] || 0) - (a[4] || 0)) * u;
        const since = Math.max(0, t - b[0]); z *= 1 + Math.min(DRIFT * since, 0.08); x += Math.sin(t * 0.45) * 6; y += Math.cos(t * 0.37) * 4; r += Math.sin(t * 0.3) * 0.25;
        for (const p of punches) { const q = (t - p.t) / p.dur; if (q > 0 && q < 1) { const k = q < 0.25 ? ease(q / 0.25) : 1 - ease((q - 0.25) / 0.75) * 0.6; z *= 1 + (p.z - 1) * k; if (p.x != null) { x += (p.x - x) * 0.35 * k; y += (p.y - y) * 0.35 * k; } } }
        let sx = 0, sy = 0; for (const sh of shakes) { const d = t - sh.t; if (d > 0 && d < 0.35) { const k = (1 - d / 0.35) * (sh.a || 10); sx += Math.sin(t * 90) * k; sy += Math.cos(t * 73) * k * 0.8; } }
        return [x, y, z, r, sx, sy]; };
      I.ready();
      function draw(t) {
        I.update(t); figs.forEach((f) => f.update(t));
        const [x, y, z, rr, sx, sy] = camAt(t); cam.setAttribute("transform", `translate(${(540 + sx).toFixed(1)},${(960 + sy).toFixed(1)}) rotate(${rr.toFixed(3)}) scale(${z.toFixed(4)}) translate(${(-x).toFixed(1)},${(-y).toFixed(1)})`);
        I.setView(x - 620 / z, y - 1040 / z, 1240 / z, 2080 / z); ink.setAttribute("filter", `url(#boil${Math.floor(t * 8) % 3})`);
        for (const { p, g, slash, lines } of posters) { const v = t >= p.on[0] && t < p.on[1]; g.setAttribute("opacity", v ? 1 : 0); if (!v) continue;
          for (const { t: n, l } of lines) { const u = clamp((t - l.at) / 0.18, 0, 1); n.setAttribute("opacity", u > 0 ? 1 : 0); const s = 1.35 - 0.35 * ease(u), bb = n.getBBox(), ax = l.anchor === "middle" ? bb.x + bb.width / 2 : bb.x;
            n.setAttribute("transform", `translate(${ax},${bb.y + bb.height}) scale(${s.toFixed(3)}) translate(${-ax},${-(bb.y + bb.height)})`); }
          if (slash) slash.setAttribute("transform", `translate(${((1 - sm(p.slashAt, p.slashAt + 0.3, t)) * 600).toFixed(1)},0)`);
          if (p.shakeAt != null) { const sh = t >= p.shakeAt ? Math.max(0, 1 - (t - p.shakeAt) * 5) : 0; g.setAttribute("transform", `translate(${(Math.sin(t * 90) * 12 * sh).toFixed(1)},${(Math.cos(t * 70) * 10 * sh).toFixed(1)})`); } }
        if (cfg.extra) cfg.extra(t);
        setCap(t);
      }
      const tl = gsap.timeline({ paused: true }), proxy = { t: 0 }; tl.fromTo(proxy, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: () => draw(proxy.t) }, 0); draw(0);
      window.__timelines = window.__timelines || {}; window.__timelines.main = tl;
      const pev = []; for (const { p } of posters) p.lines.forEach((l, i) => pev.push({ type: l.big ? "bigslam" : "slam", at: l.at }));
      const wev = shots.slice(1).filter((s) => Math.abs(s[2] - shots[shots.indexOf(s) - 1][2]) > 600).map((s) => ({ type: "whoosh", at: s[0] }));
      window.__INK = { events: I.events.concat(pev, wev, cfg.events || []), posterOn: posters.map(({ p }) => p.on), titleOn: cfg.titleOn || null, D, musicDb: cfg.musicDb ?? -21 };
    };
    return K;
  };
})();
