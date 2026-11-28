/* Test clip: opening of "Why Do People Lie to Themselves?" in the new mixed style (ink notebook + bold poster cards). */
(function () {
  const T = window.DT, D = window.DUR, WD = window.WORDS, S = (i) => T[i][0], E = (i) => T[i][0] + T[i][1], W = (i, k) => T[i][0] + WD[i][k].start;
  const svg = document.getElementById("ov"), I = INK(svg), { el, sm, ease, back, clamp, INKC, HI, RED } = I;
  // ---------- paper world (one long sheet) ----------
  const paperBg = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: I.PAPER }, svg);
  const cam = el("g", {}, svg), world = el("g", {}, cam);
  for (let i = 0; i < 24; i++) el("line", { x1: -800, x2: 11000, y1: 40 + i * 48, y2: 40 + i * 48, stroke: "#9CC3D9", "stroke-width": 2, opacity: 0.45 }, world);
  el("line", { x1: 120, x2: 120, y1: -200, y2: 1300, stroke: "#E07A7A", "stroke-width": 3, opacity: 0.6 }, world);
  const ink = el("g", {}, world);   // everything hand-drawn boils
  el("rect", { x: 0, y: 0, width: 1920, height: 1080, filter: "url(#paperTex)", "pointer-events": "none" }, svg);
  const hi = (p, x, y, w, h, at, rot = -2) => I.fill(p, el("rect", { x, y, width: w, height: h, fill: HI, opacity: 0, transform: `rotate(${rot} ${x + w / 2} ${y + h / 2})` }), at, 0.25, { sound: "swish" });

  // ---------- S1: the things you tell yourself (x≈960) ----------
  const f1 = I.figure(ink, 960, 860, 1.25, 0.15, { mood: "neutral" }); f1.setMood(S("a1") + 0.9, "worried");
  [[700, 330, -1], [960, 250, 0], [1220, 330, 1]].forEach(([x, y, d], i) => { const at = W("a1", [3, 5, 7][i]); const g = el("g", {}, ink);
    I.path(g, `M${x - 110},${y} q0,-70 110,-70 q110,0 110,70 q0,70 -110,70 q-30,0 -55,-10 l-45,30 l15,-45 q-25,-20 -25,-45 z`, at, 0.35, { w: 6 });
    I.path(g, `M${x - 55},${y - 8} q15,-18 30,0 t30,0 t30,0`, at + 0.3, 0.3, { w: 5, color: "#6B6359" }); });
  const t1 = el("g", {}, ink); I.text(t1, "the things you tell yourself…", 230, 120, 84, S("a1") - 0.35, 1.1);

  // ---------- S2: "I'll start on Monday." (x≈3000) — a calendar of broken Mondays ----------
  const X2 = 3000, f2 = I.figure(ink, X2 - 330, 900, 1.15, S("a2") - 1.0, { mood: "smile" }); f2.setMood(E("a2") + 1.0, "worried");
  I.bubble(ink, X2 - 330, 170, 600, 190, "I'll start Monday!", S("a2") - 0.1, { size: 74, tail: -1 });
  const cal = el("g", {}, ink), cx = X2 + 80, cy = 360;
  I.path(cal, `M${cx},${cy} h600 v460 h-600 z`, S("a2") - 0.8, 0.5); I.path(cal, `M${cx},${cy + 80} h600`, S("a2") - 0.4, 0.25, { w: 5 });
  for (let c = 1; c < 7; c++) I.path(cal, `M${cx + c * 86},${cy + 80} v380`, S("a2") - 0.35 + c * 0.03, 0.2, { w: 3, silent: true });
  for (let r = 1; r < 5; r++) I.path(cal, `M${cx},${cy + 80 + r * 76} h600`, S("a2") - 0.3 + r * 0.03, 0.2, { w: 3, silent: true });
  I.text(cal, "MON", cx + 12, cy + 58, 46, S("a2") - 0.2, 0.3, { font: "Patrick Hand" });
  for (let r = 0; r < 4; r++) { const x = cx + 18, y = cy + 98 + r * 76, at = E("a2") + 0.05 + r * 0.24; I.path(cal, `M${x},${y} l50,40 M${x + 50},${y} l-50,40`, at, 0.18, { w: 7, color: RED, loud: 1.4 }); }

  // ---------- S3: "It doesn't really bother me." (x≈5000) — the smile and the storm behind it ----------
  const X3 = 5000, f3 = I.figure(ink, X3 - 120, 900, 1.2, E("a2") + 1.3, { mood: "forced" });
  I.bubble(ink, X3 - 560, 260, 640, 190, "Doesn't bother me :)", S("a3") - 0.3, { size: 66, tail: 1 });
  const storm = el("g", {}, ink); const sAt = S("a3") + 0.25;
  I.path(storm, `M${X3 + 120},${300} q-20,-110 90,-120 q40,-90 150,-40 q110,-30 140,70 q90,30 40,120 q-10,60 -110,50 q-70,50 -150,10 q-110,20 -140,-50 q-60,-20 -20,-40 z`, sAt, 0.6, { w: 8 });
  for (let i = 0; i < 6; i++) I.path(storm, `M${X3 + 180 + i * 50},${230 + (i % 2) * 30} q20,-20 40,0 t40,0`, sAt + 0.4 + i * 0.06, 0.2, { w: 5, color: "#4A4542", silent: true });
  I.path(storm, `M${X3 + 330},${360} l-40,90 l40,0 l-30,90`, sAt + 0.8, 0.3, { w: 12, color: "#E0B400", loud: 1.2 });
  for (let i = 0; i < 5; i++) I.path(storm, `M${X3 + 200 + i * 55},${380} l-15,50`, sAt + 0.9 + i * 0.05, 0.15, { w: 5, color: "#5B8DB8", silent: true });

  // ---------- S4: "I'm fine." (x≈7000) — the mirror ----------
  const X4 = 7000, f4a = I.figure(ink, X4 - 380, 900, 1.15, S("a4") - 0.95, { mood: "sad" });
  const mir = el("g", {}, ink); I.path(mir, `M${X4 - 60},${170} h460 v800 h-460 z`, S("a4") - 0.9, 0.4); I.path(mir, `M${X4 - 35},${195} h410 v750 h-410 z`, S("a4") - 0.6, 0.3, { w: 3, attrs: { "stroke-dasharray": "2 14" }, silent: true });
  const f4b = I.figure(ink, X4 + 170, 900, 1.15, S("a4") - 0.55, { mood: "smile", arms: `M${X4 + 170},${900 - 230} L${X4 + 60},${900 - 190} M${X4 + 170},${900 - 230} L${X4 + 280},${900 - 190}` });
  const sign = el("g", {}, ink); I.fill(sign, el("rect", { x: X4 + 20, y: 655, width: 300, height: 110, rx: 10, fill: HI, stroke: INKC, "stroke-width": 6, transform: `rotate(-6 ${X4 + 170} 710)` }), W("a4", 1) - 0.05, 0.2, { pop: [X4 + 170, 710], sound: "slap" });
  I.fill(sign, Object.assign(el("text", { x: X4 + 170, y: 734, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 74, fill: INKC, transform: `rotate(-6 ${X4 + 170} 710)` }), { textContent: "I'm fine!" }), W("a4", 1), 0.2, { pop: [X4 + 170, 710], sound: false });

  // ---------- S6: why does your brain work so hard… (x≈9200) — the guard at the door ----------
  const X6 = 9200, h6 = el("g", {}, ink), a6 = S("a6") - 0.5;
  I.path(h6, `M${X6 - 420},${980} q-60,-200 -30,-380 q40,-330 380,-360 q330,-20 420,280 q30,110 -10,190 l70,110 l-80,20 q20,80 -50,110 q-80,20 -150,0 l-10,30`, a6, 0.9, { w: 9 });
  I.path(h6, `M${X6 - 320},${420} q-30,-120 110,-150 q60,-80 170,-30 q110,-30 150,60 q80,40 40,130 q20,90 -90,100 q-60,60 -160,20 q-100,40 -170,-30 q-90,-30 -50,-100 z`, a6 + 0.6, 0.8, { w: 6, color: "#B06A7A" });
  const door = el("g", {}, h6); I.path(door, `M${X6 - 60},${330} h150 v230 h-150 z`, W("a6", 4), 0.4, { w: 7 }); I.path(door, `M${X6 + 70},${450} l0,0`, W("a6", 4) + 0.3, 0.05, { w: 14, silent: true });
  I.fill(door, Object.assign(el("text", { x: X6 + 15, y: 300, "text-anchor": "middle", "font-family": "Patrick Hand", "font-size": 44, fill: RED, opacity: 0 }), { textContent: "THE TRUTH" }), W("a6", 5), 0.2);
  const guard = I.figure(h6, X6 - 140, 560, 0.5, W("a6", 6), { mood: "worried", arms: `M${X6 - 140},${560 - 100} L${X6 - 70},${560 - 110} M${X6 - 140},${560 - 100} L${X6 - 70},${560 - 80}` });
  hi(ink, X6 - 470, 1000, 0, 0, 0);   // placeholder keeps item order stable

  // ---------- POSTER cards (screen space) ----------
  const poster = el("g", { opacity: 0 }, svg); el("rect", { width: 1920, height: 1080, fill: "#0D0D0D" }, poster);
  const slash = el("path", { d: "M1180 -20 L1960 -20 L1960 1100 L1420 1100 Z", fill: RED }, poster);
  const spot = el("ellipse", { cx: 1500, cy: 900, rx: 300, ry: 60, fill: "#FFF6E5", opacity: 0.35 }, poster);
  const sil = el("g", { fill: "#0D0D0D" }, poster); el("circle", { cx: 1500, cy: 560, r: 70 }, sil); el("path", { d: "M1440 640 q60 -20 120 0 l25 230 l-170 0 z" }, sil);
  const PW = (txt, x, y, size, fill) => { const t = el("text", { x, y, "font-family": "Anton", "font-size": size, fill, "letter-spacing": 2 }, poster); t.textContent = txt; return t; };
  const pDeep = PW("DEEP DOWN,", 128, 200, 90, "#9A958C"), pYou = PW("YOU", 120, 440, 250, "#F4EFE6"), pAlr = PW("ALREADY", 120, 700, 250, "#F4EFE6"), pKnow = PW("KNOW.", 120, 960, 250, RED);
  const title = el("g", { opacity: 0 }, svg); el("rect", { width: 1920, height: 1080, fill: "#0D0D0D" }, title);
  const tt = (txt, y, size, fill) => { const t = el("text", { x: 960, y, "text-anchor": "middle", "font-family": "Anton", "font-size": size, fill, "letter-spacing": 3 }, title); t.textContent = txt; return t; };
  const tWhy = tt("WHY WE", 330, 170, "#F4EFE6"), tLie = tt("LIE", 610, 300, RED), tOur = tt("TO OURSELVES", 830, 170, "#F4EFE6");
  const under = el("path", { d: "M760 650 q200 30 420 -6", fill: "none", stroke: HI, "stroke-width": 18, "stroke-linecap": "round" }, title);
  const sub = el("text", { x: 960, y: 960, "text-anchor": "middle", "font-family": "Patrick Hand", "font-size": 54, fill: "#9A958C" }, title); sub.textContent = "(and why it's not your fault)";
  const posterOn = [W("a5", 0) - 0.05, S("a6") - 0.35], titleOn = [S("a7") - 0.1, D];

  // ---------- captions (paper scenes only): ink handwriting, keyword highlighted ----------
  const KEY = { monday: 1, bother: 1, fine: 1, brain: 1, never: 1, notice: 1, yourself: 1 };
  const caps = []; for (const id of ["a1", "a2", "a3", "a4", "a6"]) { let ch = []; const ws = WD[id];
    ws.forEach((w, k) => { ch.push(w); if (ch.length === 3 || /[.,!?]$/.test(w.text) || k === ws.length - 1) { caps.push({ t: S(id) + ch[0].start, e: S(id) + (ws[k + 1] ? ws[k + 1].start : T[id][1]) + (ws[k + 1] ? 0 : 0.35), w: ch.map((x) => x.text) }); ch = []; } }); }
  const capG = el("g", {}, svg); const capBox = el("rect", { y: 952, height: 92, rx: 14, fill: "#FFFDF6", stroke: INKC, "stroke-width": 4, opacity: 0 }, capG); const capT = el("text", { x: 960, y: 1016, "text-anchor": "middle", "font-family": "Patrick Hand", "font-size": 66, fill: INKC }, capG);
  function setCap(t) { const c = caps.find((c) => t >= c.t && t < c.e); if (!c || (t >= posterOn[0] && t < posterOn[1])) { capG.setAttribute("opacity", 0); return; }
    capG.setAttribute("opacity", 1); while (capT.firstChild) capT.removeChild(capT.firstChild);
    c.w.forEach((w, i) => { const ts = el("tspan", {}, capT); ts.textContent = (i ? " " : "") + w; if (KEY[w.toLowerCase().replace(/[^a-z]/g, "")]) ts.setAttribute("fill", RED); });
    const L = c.w.join(" ").length * 30 + 60; capBox.setAttribute("x", 960 - L / 2); capBox.setAttribute("width", L); capBox.setAttribute("opacity", 1);
    const k = clamp((t - c.t) / 0.15, 0, 1); capG.setAttribute("transform", `translate(960,1000) scale(${(0.85 + 0.15 * back(k)).toFixed(3)}) translate(-960,-1000)`); }

  // ---------- camera: glides along the sheet ----------
  const shots = [[0, 960, 540, 1.0], [S("a1") + 1.2, 900, 560, 1.03], [S("a2") - 1.7, X2, 560, 1.0], [E("a2") + 0.85, X3, 560, 1.0], [E("a3") + 0.35, X4, 560, 1.0], [S("a6") - 1.1, X6, 600, 1.0], [S("a6") + 1.2, X6 - 40, 520, 1.25]];
  const camAt = (t) => { let i = 0; while (i + 1 < shots.length && t >= shots[i + 1][0]) i++; const a = shots[i - 1] || shots[0], b = shots[i]; const g = 0.7, u2 = sm(b[0], b[0] + g, t); if (i === 0) return b.slice(1); return [a[1] + (b[1] - a[1]) * ease(u2), a[2] + (b[2] - a[2]) * ease(u2), a[3] + (b[3] - a[3]) * ease(u2)];
    if (!b) return a.slice(1); const glide = 0.7, j = i; void j; const u = 0; return [a[1] + (b[1] - a[1]) * ease(u), a[2] + (b[2] - a[2]) * ease(u), a[3] + (b[3] - a[3]) * ease(u)]; };
  const figs = [f1, f2, f3, f4a, f4b, guard];
  I.ready();
  function draw(t) {
    I.update(t); figs.forEach((f) => f.update(t));
    const [x, y, z] = camAt(t); cam.setAttribute("transform", `translate(960,540) scale(${z.toFixed(4)}) translate(${(-x).toFixed(1)},${(-y).toFixed(1)})`);
    I.setView(x - 1000 / z, y - 600 / z, 2000 / z, 1200 / z); ink.setAttribute("filter", `url(#boil${Math.floor(t * 8) % 3})`);
    // poster card: slam each word on its spoken word
    const pv = t >= posterOn[0] && t < posterOn[1]; poster.setAttribute("opacity", pv ? 1 : 0);
    if (pv) { const slam = (node, at) => { const u = clamp((t - at) / 0.18, 0, 1); node.setAttribute("opacity", u > 0 ? 1 : 0); const s = 1.35 - 0.35 * ease(u); const bb = node.getBBox(); node.setAttribute("transform", `translate(${bb.x},${bb.y + bb.height}) scale(${s.toFixed(3)}) translate(${-bb.x},${-(bb.y + bb.height)})`); };
      slam(pDeep, W("a5", 0)); slam(pYou, W("a5", 2)); slam(pAlr, W("a5", 3)); slam(pKnow, W("a5", 4));
      const su = sm(W("a5", 4), W("a5", 4) + 0.3, t); slash.setAttribute("transform", `translate(${((1 - su) * 900).toFixed(1)},0)`); sil.setAttribute("opacity", su.toFixed(2)); spot.setAttribute("opacity", (0.35 * su).toFixed(2));
      const sh = Math.max(0, 1 - (t - W("a5", 4)) * 5) * (t >= W("a5", 4) ? 1 : 0); poster.setAttribute("transform", `translate(${(Math.sin(t * 90) * 10 * sh).toFixed(1)},${(Math.cos(t * 70) * 8 * sh).toFixed(1)})`); }
    const tv = t >= titleOn[0]; title.setAttribute("opacity", tv ? 1 : 0);
    if (tv) { const a = titleOn[0]; [[tWhy, a], [tLie, a + 0.35], [tOur, a + 0.7]].forEach(([n, at]) => { const u = clamp((t - at) / 0.2, 0, 1); n.setAttribute("opacity", u > 0 ? 1 : 0); n.setAttribute("transform", `translate(960,${n.getAttribute("y")}) scale(${(1.3 - 0.3 * ease(u)).toFixed(3)}) translate(-960,${-n.getAttribute("y")})`); });
      const L = 440, u = clamp((t - a - 1.0) / 0.35, 0, 1); under.setAttribute("stroke-dasharray", `${L} ${L}`); under.setAttribute("stroke-dashoffset", (L * (1 - ease(u))).toFixed(1)); sub.setAttribute("opacity", sm(a + 1.5, a + 1.9, t).toFixed(2)); }
    setCap(t);
  }
  const tl = gsap.timeline({ paused: true }); const proxy = { t: 0 }; tl.fromTo(proxy, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: () => draw(proxy.t) }, 0); draw(0);
  window.__timelines = window.__timelines || {}; window.__timelines.main = tl;
  window.__INK = { events: I.events.concat([{ type: "whoosh", at: S("a2") - 1.7 }, { type: "whoosh", at: E("a2") + 0.85 }, { type: "whoosh", at: E("a3") + 0.35 }, { type: "whoosh", at: S("a6") - 1.1 },
    { type: "slam", at: W("a5", 0) }, { type: "slam", at: W("a5", 2) }, { type: "slam", at: W("a5", 3) }, { type: "bigslam", at: W("a5", 4) }, { type: "slam", at: titleOn[0] }, { type: "slam", at: titleOn[0] + 0.35 }, { type: "slam", at: titleOn[0] + 0.7 }, { type: "draw", at: titleOn[0] + 1.0, dur: 0.35, loud: 1.6 }]),
    posterOn, titleOn, D };
})();
