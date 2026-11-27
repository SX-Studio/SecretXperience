/* LONG: 16:9 (1920x1080) frame for Social Ripple episodes in the ink-notebook + poster style. The camera glides ALONG one
   long sheet; beat k is centred at x = K.X(k), y 540; draw into K.B(k) (off-camera beats are hidden). K.run({ shots:[t,x,y,z], posters, extra, events }). */
(function () {
  window.LONG = function (o = {}) {
    const T = window.DT, D = window.DUR, WD = window.WORDS; for (const id in (o.fix || {})) for (const k in o.fix[id]) WD[id][k].text = o.fix[id][k];
    const S = (i) => T[i][0], E = (i) => T[i][0] + T[i][1], W = (i, k) => T[i][0] + WD[i][k < 0 ? WD[i].length + k : k].start;
    const svg = document.getElementById("ov"), I = INK(svg), { el, sm, ease, back, clamp, INKC, HI, RED } = I;
    el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: I.PAPER }, svg);
    const cam = el("g", {}, svg), world = el("g", {}, cam);
    for (let i = 0; i < 30; i++) el("line", { x1: -1000, x2: 40000, y1: -150 + i * 48, y2: -150 + i * 48, stroke: "#9CC3D9", "stroke-width": 2, opacity: 0.45 }, world);
    el("line", { x1: 120, x2: 120, y1: -300, y2: 1400, stroke: "#E07A7A", "stroke-width": 3, opacity: 0.6 }, world);
    const ink = el("g", {}, world); const groups = [];
    el("rect", { x: 0, y: 0, width: 1920, height: 1080, filter: "url(#paperTex)", "pointer-events": "none" }, svg);
    const X = (k) => 960 + k * 2600;   // beat centres along the sheet
    const B = (k) => { const g = el("g", {}, ink); groups.push([g, X(k)]); return g; };
    const hi = (p, x, y, w, h, at, rot = -2) => I.fill(p, el("rect", { x, y, width: w, height: h, fill: HI, opacity: 0, transform: `rotate(${rot} ${x + w / 2} ${y + h / 2})` }), at, 0.25, { sound: "swish" });
    const label = (p, str, x, y, size, at, color = INKC, font = "Patrick Hand") => I.fill(p, Object.assign(el("text", { x, y, "text-anchor": "middle", "font-family": font, "font-weight": font === "Caveat" ? 700 : 400, "font-size": size, fill: color, opacity: 0 }), { textContent: str }), at, 0.2, { sound: false });
    const figs = [];
    const fig = (...a) => { const f = I.figure(...a); figs.push(f); return f; };
    const K = { T, D, WD, S, E, W, svg, I, ink, world, X, B, hi, label, fig, el, sm, ease, back, clamp, INKC, HI, RED };

    K.run = (cfg) => {
      // ---------- posters (screen space): [{ on:[a,b], bg, lines:[{txt,y,size,fill,at,x?}], slashAt?, shakeAt? }]
      const posters = (cfg.posters || []).map((p) => { const g = el("g", { opacity: 0 }, svg); el("rect", { width: 1920, height: 1080, fill: p.bg || "#0D0D0D" }, g);
        const slash = p.slashAt != null ? el("path", { d: "M1180 -20 L1960 -20 L1960 1100 L1420 1100 Z", fill: RED }, g) : null;
        const lines = p.lines.map((l) => { const t = el("text", { x: l.x ?? 120, y: l.y, "font-family": l.font || "Anton", "font-size": l.size, fill: l.fill || "#F4EFE6", "letter-spacing": 2, "text-anchor": l.anchor || "start" }, g); t.textContent = l.txt; return { t, l }; });
        return { p, g, slash, lines }; });
      // ---------- captions
      const KEY = o.keys || {}, inPoster = (t) => posters.some(({ p }) => t >= p.on[0] && t < p.on[1]);
      const caps = []; for (const id of Object.keys(T)) { if ((o.noCap || []).includes(id)) continue; let ch = []; const ws = WD[id];
        ws.forEach((w, k) => { ch.push(w); if (ch.length === 3 || /[.,!?]$/.test(w.text) || k === ws.length - 1) { caps.push({ t: S(id) + ch[0].start, e: S(id) + (ws[k + 1] ? ws[k + 1].start : T[id][1] + 0.3), w: ch.map((x) => x.text) }); ch = []; } }); }
      const CY = o.capY || 1016, capG = el("g", {}, svg), capBox = el("rect", { y: CY - 64, height: 92, rx: 14, fill: "#FFFDF6", stroke: INKC, "stroke-width": 5 }, capG);
      const capT = el("text", { x: 960, y: CY, "text-anchor": "middle", "font-family": "Patrick Hand", "font-size": 66, fill: INKC }, capG);
      function setCap(t) { const c = caps.find((c) => t >= c.t && t < c.e); if (!c || inPoster(t)) { capG.setAttribute("opacity", 0); return; }
        capG.setAttribute("opacity", 1); while (capT.firstChild) capT.removeChild(capT.firstChild);
        c.w.forEach((w, i) => { const ts = el("tspan", {}, capT); ts.textContent = (i ? " " : "") + w; if (KEY[w.toLowerCase().replace(/[^a-z0-9%]/g, "")]) ts.setAttribute("fill", RED); });
        const L = Math.min(1500, c.w.join(" ").length * 30 + 60); capBox.setAttribute("x", 960 - L / 2); capBox.setAttribute("width", L);
        const k = clamp((t - c.t) / 0.15, 0, 1); capG.setAttribute("transform", `translate(960,${CY - 16}) scale(${(0.85 + 0.15 * back(k)).toFixed(3)}) translate(-960,${-(CY - 16)})`); }
      // ---------- camera: shots [t, x, y, zoom]; a glide of 0.6 s starts at t
      const shots = cfg.shots, G = cfg.glide || 0.6;
      const camAt = (t) => { let i = 0; while (i + 1 < shots.length && t >= shots[i + 1][0]) i++; const b = shots[i]; if (i === 0) return b.slice(1); const a = shots[i - 1], u = ease(sm(b[0], b[0] + G, t));
        return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u]; };
      I.ready();
      function draw(t) {
        I.update(t); figs.forEach((f) => f.update(t));
        const [x, y, z] = camAt(t); cam.setAttribute("transform", `translate(960,540) scale(${z.toFixed(4)}) translate(${(-x).toFixed(1)},${(-y).toFixed(1)})`);
        I.setView(x - 1000 / z, y - 600 / z, 2000 / z, 1200 / z); for (const [g, gx] of groups) g.setAttribute("display", Math.abs(gx - x) < 2300 / z ? "inline" : "none"); ink.setAttribute("filter", `url(#boil${Math.floor(t * 8) % 3})`);
        for (const { p, g, slash, lines } of posters) { const v = t >= p.on[0] && t < p.on[1]; g.setAttribute("opacity", v ? 1 : 0); if (!v) continue;
          for (const { t: n, l } of lines) { const u = clamp((t - l.at) / 0.18, 0, 1); n.setAttribute("opacity", u > 0 ? 1 : 0); const s = 1.35 - 0.35 * ease(u), bb = n.getBBox(), ax = l.anchor === "middle" ? bb.x + bb.width / 2 : bb.x;
            n.setAttribute("transform", `translate(${ax},${bb.y + bb.height}) scale(${s.toFixed(3)}) translate(${-ax},${-(bb.y + bb.height)})`); }
          if (slash) slash.setAttribute("transform", `translate(${((1 - sm(p.slashAt, p.slashAt + 0.3, t)) * 900).toFixed(1)},0)`);
          if (p.shakeAt != null) { const sh = t >= p.shakeAt ? Math.max(0, 1 - (t - p.shakeAt) * 5) : 0; g.setAttribute("transform", `translate(${(Math.sin(t * 90) * 12 * sh).toFixed(1)},${(Math.cos(t * 70) * 10 * sh).toFixed(1)})`); } }
        if (cfg.extra) cfg.extra(t);
        setCap(t);
      }
      const tl = gsap.timeline({ paused: true }), proxy = { t: 0 }; tl.fromTo(proxy, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: () => draw(proxy.t) }, 0); draw(0);
      window.__timelines = window.__timelines || {}; window.__timelines.main = tl;
      const pev = []; for (const { p } of posters) p.lines.forEach((l, i) => pev.push({ type: l.big ? "bigslam" : "slam", at: l.at }));
      const wev = shots.slice(1).filter((s) => Math.abs(s[1] - shots[shots.indexOf(s) - 1][1]) > 900).map((s) => ({ type: "whoosh", at: s[0] }));
      window.__INK = { events: I.events.concat(pev, wev, cfg.events || []), posterOn: posters.map(({ p }) => p.on), titleOn: cfg.titleOn || null, D, musicDb: cfg.musicDb ?? -200 };
    };
    return K;
  };
})();
