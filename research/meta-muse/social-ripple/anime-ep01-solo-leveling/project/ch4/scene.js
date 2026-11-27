/* Solo Leveling ep, ch4: Lesson 2 — decide the when (implementation intentions; Gollwitzer & Sheeran 2006). */
(function () {
  const K = LONG({ keys: { when: 1, appears: 1, trigger: 1, implementation: 1, intention: 1, if: 1, then: 1, lunch: 1, walk: 1, "94": 1, ninety: 1, eight: 1, thousand: 1, medium: 1, large: 1, stacks: 1, run: 1, raid: 1, motivation: 1, decision: 1, made: 1 }, noCap: ["d1"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CHAR(K), F = (i, f) => S(i) + f * T[i][1], ch = [], ups = [];
  const fig = (...a) => { const h = C.draw(...a); ch.push(h); return h; };

  // ---------- B0: the quest just appears ----------
  const X0 = X(0), g0 = B(0);
  fig(g0, "jinwoo", X0 - 600, 950, 1.05, S("d2") - 0.3, { mood: "neutral" });
  I.circle(g0, X0 - 180, 330, 110, S("d2") + 0.1, 0.4, { w: 8 }); I.path(g0, `M${X0 - 180},${330} v-70 M${X0 - 180},${330} l50,30`, S("d2") + 0.4, 0.2, { w: 8 });
  L.pop(g0, "no debate", X0 - 180, 520, 60, F("d2", 0.3), L.GREY, "Caveat", false);
  C.system(g0, X0 + 60, 230, 780, ["Same task.", "Every day."], F("d2", 0.45), { rowTimes: [F("d2", 0.62), F("d2", 0.82)] });

  // ---------- B1: IF → THEN ----------
  const X1 = X(1), g1 = B(1);
  L.tx(g1, "an implementation intention", X1 - 820, 160, 96, S("d3") - 0.2, 0.9);
  L.box(g1, X1 - 820, 260, 760, 420, F("d3", 0.3)); L.pop(g1, "IF", X1 - 700, 420, 140, F("d3", 0.62), RED, "Anton", "slap", 0, "start"); L.pop(g1, "this happens,", X1 - 520, 410, 76, F("d3", 0.66), INKC, "Caveat", false, 0, "start");
  L.pop(g1, "THEN", X1 - 700, 600, 140, F("d3", 0.8), RED, "Anton", "slap", 0, "start"); L.pop(g1, "I'll do that.", X1 - 380, 590, 76, F("d3", 0.84), INKC, "Caveat", false, 0, "start");
  fig(g1, "walker", X1 + 760, 950, 0.95, S("d4") - 0.2, { mood: "smile", look: { hair: "#2A221E", top: "#E0A030", pants: "#3A3F4A" } });
  L.sign(g1, "if: I finish lunch", X1 + 280, 330, 480, 90, F("d4", 0.2), { size: 56, rot: -3, fill: "#FFFDF6" }); L.sign(g1, "then: a 10-minute walk", X1 + 280, 470, 560, 90, F("d4", 0.6), { size: 56, rot: 3 });

  // ---------- B2: the meta-analysis ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "a review of the research", X2 - 820, 160, 96, S("d5") - 0.1, 0.9);
  for (let i = 0; i < 6; i++) L.rect(g2, X2 - 780 + i * 14, 640 - i * 46, 300, 60, F("d5", 0.1) + i * 0.06, "#FFFDF6", { rx: 4, sound: i ? false : "swish" });
  L.pop(g2, "94 tests", X2 - 620, 760, 76, F("d5", 0.25), INKC, "Anton", false);
  for (let i = 0; i < 12; i++) { const x = X2 - 280 + (i % 6) * 70, y = 420 + Math.floor(i / 6) * 120, at = F("d5", 0.35) + i * 0.03; I.circle(g2, x, y, 22, at, 0.1, { w: 4, silent: i > 0 }); I.path(g2, `M${x},${y + 22} v50`, at + 0.03, 0.08, { w: 4, silent: true }); }
  L.pop(g2, "8,000+ people", X2 - 100, 760, 76, F("d5", 0.45), INKC, "Anton", false);
  I.path(g2, `M${X2 + 220},${700} A300,300 0 0,1 ${X2 + 820},${700}`, F("d5", 0.6), 0.5, { w: 9 });
  [["small", 200], ["medium", 270], ["large", 340]].forEach(([lb, a], i) => L.pop(g2, lb, X2 + 520 + Math.cos(a * Math.PI / 180) * 360, 700 + Math.sin(a * Math.PI / 180) * 360 + 20, 42, F("d5", 0.65) + i * 0.05, L.GREY, "Patrick Hand", false));
  const needle = el("line", { x1: X2 + 520, y1: 700, x2: X2 + 520, y2: 700, stroke: RED, "stroke-width": 10, "stroke-linecap": "round", opacity: 0 }, g2);
  ups.push((t) => { const u = ease(clamp((t - F("d5", 0.72)) / 0.6, 0, 1)), a = (180 + u * 115) * Math.PI / 180; needle.setAttribute("opacity", u > 0 ? 1 : 0); needle.setAttribute("x2", (X2 + 520 + Math.cos(a) * 250).toFixed(1)); needle.setAttribute("y2", (700 + Math.sin(a) * 250).toFixed(1)); });
  L.pop(g2, "medium to large effect", X2 + 520, 860, 60, F("d5", 0.85), RED, "Caveat", false);

  // ---------- B3: habit stacking — the run to the raid ----------
  const X3 = X(3), g3 = B(3);
  L.tx(g3, "habit stacking", X3 - 820, 160, 110, S("d6") - 0.1, 0.7);
  I.path(g3, `M${X3 - 900},${960} H${X3 + 900}`, S("d6"), 0.5, { w: 6, color: "#8A847A" });
  const run = fig(g3, "jinwoo", X3 - 420, 950, 1.0, S("d6") + 0.1, { mood: "serious" });
  for (let i = 0; i < 3; i++) I.path(g3, `M${X3 - 640},${520 + i * 90} h-160`, F("d6", 0.4) + i * 0.06, 0.15, { w: 7, color: L.GREY, silent: i > 0 });
  I.fill(g3, el("ellipse", { cx: X3 + 520, cy: 600, rx: 190, ry: 300, fill: "#2A2440", stroke: "#7B6CFF", "stroke-width": 10, opacity: 0 }), F("d6", 0.6), 0.3, { sound: "whoosh" });
  I.fill(g3, el("ellipse", { cx: X3 + 520, cy: 600, rx: 120, ry: 210, fill: "#5D4BE0", opacity: 0 }), F("d6", 0.65), 0.3, { sound: false });
  L.pop(g3, "daily run", X3 - 500, 300, 70, F("d6", 0.55), INKC, "Caveat", false); L.pop(g3, "+ raid", X3 + 520, 260, 70, F("d6", 0.75), "#5D4BE0", "Caveat", false);
  ups.push((t) => { const u = clamp((t - F("d6", 0.4)) / (T.d6[1] * 0.6), 0, 1); run.g.setAttribute("transform", `translate(${(u * 380).toFixed(1)},${(Math.abs(Math.sin(t * 12)) * -14).toFixed(1)})`); });

  // ---------- B4: the decision is already made ----------
  const X4 = X(4), g4 = B(4);
  L.tx(g4, "not motivation.", X4 - 820, 220, 110, S("d7") - 0.1, 0.6, { color: L.GREY }); I.path(g4, `M${X4 - 830},${190} L${X4 - 140},${200}`, F("d7", 0.25), 0.25, { w: 9, color: RED });
  L.tx(g4, "decided in advance.", X4 - 820, 400, 130, F("d7", 0.4), 0.8);
  fig(g4, "jinwoo", X4 + 520, 950, 1.1, S("d7") - 0.2, { mood: "serious", glow: true });
  L.sign(g4, "DECIDED ✓", X4 - 420, 680, 460, 140, F("d7", 0.8), { font: "Anton", size: 90, rot: -4, fill: "#E3F2D6", color: L.GREEN });

  const posters = [{ on: [S("d1") - 0.05, E("d1") + 0.45], shakeAt: F("d1", 0.75), lines: [
    { txt: "LESSON #2", y: 260, size: 120, fill: "#9A958C", at: S("d1") }, { txt: "DECIDE THE WHEN,", y: 560, size: 200, at: F("d1", 0.35) }, { txt: "NOT JUST THE WHAT.", y: 830, size: 180, fill: RED, at: F("d1", 0.75), big: true }] }];
  const shots = [[0, X0, 540, 1], [S("d3") - 0.4, X1, 540, 1], [S("d5") - 0.4, X2, 540, 1], [S("d6") - 0.4, X3, 540, 1], [S("d7") - 0.4, X4, 540, 1]];
  K.run({ shots, posters, extra(t) { ch.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
