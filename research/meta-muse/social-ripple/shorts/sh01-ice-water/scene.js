/* Short 1: "They fooled themselves with their arm in ice water" (Quattrone & Tversky, 1984). */
(function () {
  const K = SHORT({ keys: { ice: 1, water: 1, fooled: 1, themselves: 1, fake: 1, heart: 1, longer: 1, sooner: 1, shifted: 1, healthy: 1, purpose: 1, believing: 1, lying: 1, you: 1, minute: 1 }, noCap: ["i9"], fix: { i4: { 0: "Then" } } });
  const { S, E, W, I, ink, Y, el, label, fig, clamp, ease, sm, INKC, HI, RED } = K;
  const arrow = (p, x, y, h, up, at, color = RED) => I.path(p, up ? `M${x},${y} l0,${-h} M${x - 28},${y - h + 34} l28,-34 l28,34` : `M${x},${y - h} l0,${h} M${x - 28},${y - 34} l28,34 l28,-34`, at, 0.3, { w: 9, color });
  const heart = (cx, cy, s) => `M${cx},${cy + 0.9 * s} C${cx - 1.5 * s},${cy - 0.1 * s} ${cx - 0.7 * s},${cy - 1.15 * s} ${cx},${cy - 0.42 * s} C${cx + 0.7 * s},${cy - 1.15 * s} ${cx + 1.5 * s},${cy - 0.1 * s} ${cx},${cy + 0.9 * s} z`;
  const tx = (str, x, y, size, at, dur, o = {}) => I.text(ink, str, x, y, size, at, dur, o);

  // ---------- B0: arm in the ice bucket + stopwatch ----------
  const Y0 = Y(0);
  tx("the ice water test", 130, Y0 - 600, 104, 0.0, 0.9);
  const f0 = fig(ink, 330, Y0 + 230, 1.15, 0.05, { mood: "worried", arms: `M330,${Y0 + 0} L250,${Y0 + 130} M330,${Y0 + 0} L620,${Y0 + 120}` });
  I.path(ink, `M560,${Y0 + 40} L900,${Y0 + 40} L860,${Y0 + 340} L600,${Y0 + 340} Z`, 0.3, 0.45, { w: 8 });
  I.path(ink, `M575,${Y0 + 95} q40,-18 80,0 t80,0 t80,0 t70,0`, 0.6, 0.35, { w: 6, color: "#5B8DB8" });
  [[690, Y0 + 70, 12], [800, Y0 + 62, -10], [745, Y0 + 150, 20]].forEach(([x, y, r], i) => I.path(ink, `M${x - 26},${y - 26} h52 v52 h-52 z`, 0.75 + i * 0.1, 0.2, { w: 5, color: "#7FB2D6", attrs: { transform: `rotate(${r} ${x} ${y})` } }));
  const shiv = W("i1", 8); [[180, -150], [480, -150], [170, -60], [490, -60]].forEach(([x, dy], i) => I.path(ink, `M${x},${Y0 + dy - 30} l${i % 2 ? 14 : -14},15 l${i % 2 ? -14 : 14},15 l${i % 2 ? 14 : -14},15`, shiv + i * 0.05, 0.15, { w: 5, color: "#5B8DB8", silent: i > 0 }));
  const swX = 830, swY = Y0 - 330;
  I.circle(ink, swX, swY, 105, W("i2", 0), 0.4, { w: 8 }); I.path(ink, `M${swX - 22},${swY - 130} h44 M${swX},${swY - 130} v24`, W("i2", 0) + 0.3, 0.2, { w: 8 });
  const hand = el("line", { x1: swX, y1: swY, x2: swX, y2: swY - 80, stroke: RED, "stroke-width": 8, "stroke-linecap": "round", opacity: 0 }, ink);
  const handA = W("i2", 8), handB = E("i2") + 0.2;

  // ---------- B1: one minute on a bike ----------
  const Y1 = Y(1), b1 = S("i3") - 0.15;
  tx("1 minute", 130, Y1 - 600, 110, W("i3", 1), 0.5);
  I.circle(ink, 330, Y1 + 120, 120, b1, 0.35, { w: 8 }); I.circle(ink, 750, Y1 + 120, 120, b1 + 0.1, 0.35, { w: 8 });
  I.path(ink, `M330,${Y1 + 120} L500,${Y1 - 60} L750,${Y1 + 120} M500,${Y1 - 60} L700,${Y1 - 60} L750,${Y1 + 120} M500,${Y1 - 60} L475,${Y1 - 150} M425,${Y1 - 150} h100 M700,${Y1 - 60} L720,${Y1 - 200} M690,${Y1 - 200} h70`, b1 + 0.25, 0.5, { w: 8 });
  const spk = [330, 750].map((cx) => { const g = el("g", {}, ink); for (let k = 0; k < 3; k++) I.path(g, `M${cx - 110},${Y1 + 120} L${cx + 110},${Y1 + 120}`, b1 + 0.5, 0.2, { w: 3, silent: true, attrs: { transform: `rotate(${k * 60} ${cx} ${Y1 + 120})` } }); return [g, cx]; });
  I.circle(ink, 520, Y1 - 450, 70, b1 + 0.4, 0.3, { w: 8 }); I.path(ink, `M520,${Y1 - 380} L480,${Y1 - 160} M505,${Y1 - 300} L720,${Y1 - 200} M480,${Y1 - 160} L560,${Y1 - 30} L520,${Y1 + 60}`, b1 + 0.6, 0.4, { w: 8 });
  I.path(ink, `M495,${Y1 - 470} l0,14 M545,${Y1 - 470} l0,14 M495,${Y1 - 415} q25,-14 50,0`, b1 + 0.8, 0.15, { w: 6, silent: true });
  [[180, -300], [150, -200], [190, -100]].forEach(([x, dy], i) => I.path(ink, `M${x},${Y1 + dy} h-90`, b1 + 0.9 + i * 0.07, 0.15, { w: 6, color: "#6B6359", silent: i > 0 }));
  [[610, -500], [640, -430]].forEach(([x, dy], i) => I.path(ink, `M${x},${Y1 + dy} q12,22 0,32 q-12,-10 0,-32`, W("i3", 5) + i * 0.1, 0.2, { w: 5, color: "#5B8DB8", silent: true }));

  // ---------- B2: the fake lesson ----------
  const Y2 = Y(2);
  tx("the \"lesson\"", 130, Y2 - 610, 104, S("i4") - 0.1, 0.6);
  const stamp = el("g", {}, ink); I.fill(stamp, Object.assign(el("text", { x: 820, y: Y2 - 610, "text-anchor": "middle", "font-family": "Anton", "font-size": 110, fill: RED, opacity: 0, transform: `rotate(-10 820 ${Y2 - 640})` }), { textContent: "FAKE!" }), W("i4", 2), 0.15, { pop: [820, Y2 - 640], sound: "slap" });
  I.path(ink, heart(300, Y2 - 330, 105), W("i4", 16) - 0.2, 0.5, { w: 8, color: "#8A847A" });
  I.path(ink, `M262,${Y2 - 365} l0,16 M338,${Y2 - 365} l0,16 M262,${Y2 - 300} q38,-26 76,0`, W("i4", 16) + 0.2, 0.2, { w: 6, silent: true });
  I.path(ink, heart(780, Y2 - 330, 105), W("i4", 18) - 0.1, 0.5, { w: 9, color: RED });
  I.path(ink, `M742,${Y2 - 365} l0,16 M818,${Y2 - 365} l0,16 M742,${Y2 - 318} q38,30 76,0`, W("i4", 18) + 0.3, 0.2, { w: 6, silent: true });
  label(ink, "TYPE 1: sick, short life", 300, Y2 - 150, 46, W("i4", 16) + 0.2, "#6B6359");
  label(ink, "TYPE 2: healthy, long life", 780, Y2 - 150, 46, W("i4", 18) + 0.3, RED);
  tx("Group 1: healthy = longer", 120, Y2 + 30, 72, W("i5", 3), 0.7); arrow(ink, 960, Y2 + 40, 110, true, W("i5", 6));
  tx("Group 2: healthy = sooner", 120, Y2 + 220, 72, W("i5", 10), 0.7); arrow(ink, 960, Y2 + 230, 110, false, W("i5", 14));

  // ---------- B3: back in the water — the bars move ----------
  const Y3 = Y(3), base = Y3 + 170, k = 12;
  tx("seconds in ice water", 130, Y3 - 610, 96, S("i6") - 0.1, 0.7);
  I.path(ink, `M130,${base} H970`, S("i6"), 0.4, { w: 8 });
  const bars = [[190, 34, "#CFC6B4", W("i6", 2)], [330, 46, HI, W("i7", 3)], [590, 45, "#CFC6B4", W("i6", 2) + 0.15], [730, 37, HI, W("i7", 3) + 0.45]].map(([x, s, c, at]) => {
    const r = el("rect", { x, width: 120, y: base, height: 0, fill: c, stroke: INKC, "stroke-width": 6 }, ink); return { r, h: s * k, at }; });
  label(ink, "before", 250, base + 50, 36, W("i6", 2), "#6B6359"); label(ink, "after", 390, base + 50, 36, W("i7", 3), "#6B6359");
  label(ink, "before", 650, base + 50, 36, W("i6", 2) + 0.15, "#6B6359"); label(ink, "after", 790, base + 50, 36, W("i7", 3) + 0.45, "#6B6359");
  label(ink, "told: longer", 320, base + 115, 54, W("i6", 4), INKC); label(ink, "told: sooner", 720, base + 115, 54, W("i6", 5), INKC);
  arrow(ink, 390, base - 46 * k - 30, 120, true, W("i7", 7)); arrow(ink, 790, base - 37 * k - 30, 120, false, W("i7", 7) + 0.2);
  // the healthy-heart stamp over both "after" bars
  I.path(ink, heart(560, Y3 - 470, 52), W("i7", 11), 0.35, { w: 7, color: RED });

  // ---------- B4: on purpose? ----------
  const Y4 = Y(4);
  const f4 = fig(ink, 400, Y4 + 230, 1.2, S("i8") - 0.3, { mood: "neutral" }); f4.setMood(W("i8", 3), "worried");
  I.fill(ink, Object.assign(el("text", { x: 790, y: Y4 - 80, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 420, fill: RED, opacity: 0 }), { textContent: "?" }), W("i8", 5), 0.2, { pop: [790, Y4 - 200], sound: "pop" });

  // ---------- B5: and they believed it ----------
  const Y5 = Y(5), a5 = E("i9") + 0.2;
  tx("…and believed it.", 130, Y5 - 600, 104, W("i10", 6), 0.8);
  const f5 = fig(ink, 330, Y5 + 230, 1.15, a5, { mood: "smile", arms: `M330,${Y5 + 0} L250,${Y5 + 130} M330,${Y5 + 0} L560,${Y5 - 120}` });
  const sg = el("g", {}, ink);
  I.fill(sg, el("rect", { x: 500, y: Y5 - 330, width: 480, height: 200, rx: 12, fill: HI, stroke: INKC, "stroke-width": 7, transform: `rotate(-5 740 ${Y5 - 230})` }), W("i10", 10) - 0.05, 0.2, { pop: [740, Y5 - 230], sound: "slap" });
  I.fill(sg, Object.assign(el("text", { x: 740, y: Y5 - 250, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 62, fill: INKC, transform: `rotate(-5 740 ${Y5 - 230})` }), { textContent: "HEALTHY HEART" }), W("i10", 10), 0.2, { pop: [740, Y5 - 230], sound: false });
  I.fill(sg, Object.assign(el("text", { x: 740, y: Y5 - 165, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 62, fill: RED, transform: `rotate(-5 740 ${Y5 - 230})` }), { textContent: "✓ (I think)" }), W("i10", 11), 0.2, { pop: [740, Y5 - 230], sound: false });

  // ---------- B6: it's very good at lying to you ----------
  const Y6 = Y(6);
  tx("lies to other people", 130, Y6 - 600, 80, W("i11", 4), 0.7, { color: "#8A847A" }); I.path(ink, `M850,${Y6 - 625} l25,25 l50,-60`, W("i11", 8), 0.25, { w: 9, color: "#8A847A" });
  tx("it's very good", 130, Y6 - 380, 124, W("i11", 10), 0.6); tx("at lying to", 130, Y6 - 210, 124, W("i11", 13), 0.5);
  const you = el("g", {}, ink); K.hi(you, 120, Y6 + 40, 640, 70, W("i11", 16) + 0.25);
  I.fill(you, Object.assign(el("text", { x: 130, y: Y6 + 140, "font-family": "Anton", "font-size": 320, fill: RED, opacity: 0 }), { textContent: "YOU." }), W("i11", 16), 0.15, { pop: [130, Y6 + 140], sound: false });

  // ---------- poster: only 9 of 38 admitted ----------
  const p9 = [W("i9", 0) - 0.05, E("i9") + 0.3];
  const posters = [{ on: p9, slashAt: W("i9", 5), shakeAt: W("i9", 5), lines: [
    { txt: "ONLY", x: 90, y: 620, size: 170, fill: "#9A958C", at: W("i9", 0) },
    { txt: "9", x: 90, y: 950, size: 300, fill: RED, at: W("i9", 1) },
    { txt: "OF 38", x: 270, y: 950, size: 300, at: W("i9", 3) },
    { txt: "ADMITTED", x: 90, y: 1200, size: 200, at: W("i9", 4) },
    { txt: "TRYING.", x: 90, y: 1430, size: 200, fill: RED, at: W("i9", 5), big: true }] }];

  const shots = [[0, 540, Y0 - 120, 1.05], [S("i3") - 0.45, 540, Y1 - 120, 1.05], [S("i4") - 0.4, 540, Y2 - 120, 1.05], [S("i6") - 0.4, 540, Y3 - 120, 1.05], [S("i8") - 0.4, 540, Y4 - 120, 1.05], [W("i9", 0), 540, Y5 - 120, 1.05], [S("i11") - 0.4, 540, Y6 - 120, 1.05]];
  K.run({ shots, posters, events: [{ type: "draw", at: W("i6", 2), dur: 0.6, loud: 1.2 }, { type: "draw", at: W("i7", 3), dur: 1.2, loud: 1.2 }, { type: "slam", at: W("i11", 16) }],
    extra(t) {
      const u = clamp((t - handA) / (handB - handA), 0, 1), a = (u * 330 - 90) * Math.PI / 180; hand.setAttribute("opacity", t >= handA - 0.3 ? 1 : 0);
      hand.setAttribute("x2", (swX + Math.cos(a) * 82).toFixed(1)); hand.setAttribute("y2", (swY + Math.sin(a) * 82).toFixed(1));
      spk.forEach(([g, cx]) => g.setAttribute("transform", `rotate(${(t * 220) % 360} ${cx} ${Y1 + 120})`));
      bars.forEach((b) => { const v = ease(clamp((t - b.at) / 0.8, 0, 1)); b.r.setAttribute("y", (base - b.h * v).toFixed(1)); b.r.setAttribute("height", (b.h * v).toFixed(1)); b.r.setAttribute("opacity", v > 0 ? 1 : 0); });
    } });
})();
