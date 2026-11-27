/* Solo Leveling ep, ch1: cold open — weakest → strongest, and it started with push-ups. */
(function () {
  const K = LONG({ keys: { weakest: 1, strongest: 1, "push": 1, ups: 1, day: 1, habits: 1, psychologists: 1, studied: 1, surprise: 1, proud: 1, leveling: 1 }, noCap: [] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED } = K, L = LIB(K), C = CHAR(K), F = (i, f) => S(i) + f * T[i][1], ch = [];
  const fig = (...a) => { const h = C.draw(...a); ch.push(h); return h; };

  // ---------- B0: weakest → strongest ----------
  const X0 = X(0), g0 = B(0);
  const weak = fig(g0, "jinwoo", X0 - 470, 950, 1.05, 0.0, { mood: "sad" });
  L.sign(g0, "E-RANK", X0 - 470, 240, 260, 100, F("a1", 0.05), { font: "Anton", size: 64, fill: "#D9D4CB", color: "#6B6359", rot: -4 });
  L.pop(g0, "the weakest hunter", X0 - 470, 330, 52, F("a1", 0.25), L.GREY, "Patrick Hand", false);
  L.arrow(g0, X0 - 180, 560, X0 + 180, 560, F("a1", 0.25), { w: 10, color: RED });
  const strong = fig(g0, "jinwoo", X0 + 470, 950, 1.05, F("a1", 0.3), { mood: "serious", glow: true });
  L.sign(g0, "S-RANK", X0 + 470, 240, 260, 100, F("a1", 0.82), { font: "Anton", size: 64, fill: "#1E1B2E", color: "#BFB4FF", rot: 4 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; I.path(g0, `M${X0 + 470 + Math.cos(a) * 250},${560 + Math.sin(a) * 300} l${Math.cos(a) * 60},${Math.sin(a) * 60}`, F("a1", 0.7) + i * 0.04, 0.15, { w: 7, color: "#7B6CFF", silent: i > 0 }); }

  // ---------- B1: the first thing it asked: push-ups. every single day ----------
  const X1 = X(1), g1 = B(1);
  const j1 = fig(g1, "jinwoo", X1 - 560, 950, 1.05, S("a2") - 0.3, { mood: "neutral" }); j1.setMood(F("a2", 0.85), "sad");
  L.pop(g1, "a battle?", X1 - 120, 230, 70, F("a2", 0.3), L.GREY, "Caveat", false); I.path(g1, `M${X1 - 240},${210} L${X1},${245}`, F("a2", 0.45), 0.2, { w: 6, color: RED });
  L.pop(g1, "a secret power?", X1 + 330, 230, 70, F("a2", 0.55), L.GREY, "Caveat", false); I.path(g1, `M${X1 + 160},${210} L${X1 + 500},${245}`, F("a2", 0.68), 0.2, { w: 6, color: RED });
  const sys = C.system(g1, X1 - 230, 330, 760, ["Push-ups  0 / 100", "Sit-ups  0 / 100", "Squats  0 / 100", "Run  0 / 10 km"], F("a2", 0.8), { rowGap: 0.12 });
  L.pop(g1, "every. single. day.", X1 + 150, 880, 84, S("a3") + 0.1, RED, "Caveat", "slap", -3);

  // ---------- B2: a story about leveling up ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "a story about leveling up…", X2 - 800, 180, 100, S("a4") - 0.2, 0.9);
  I.path(g2, `M${X2 - 760},${380} h1100 v70 h-1100 z`, S("a4"), 0.5, { w: 7 });
  const lvl = el("rect", { x: X2 - 755, y: 385, width: 0, height: 60, fill: "#7B6CFF" }, g2);
  L.pop(g2, "LV 1", X2 - 760, 520, 70, S("a4") + 0.2, INKC, "Anton", false, 0, "start"); const lvTxt = el("text", { x: X2 + 340, y: 520, "text-anchor": "end", "font-family": "Anton", "font-size": 70, fill: "#5D4BE0", opacity: 0 }, g2);
  for (let i = 0; i < 5; i++) { const sx = X2 - 650 + i * 260; I.fill(g2, el("path", { d: `M${sx},${900} q0,-120 40,-170 q-30,-40 0,-80 q40,-30 70,0 q30,40 0,80 q40,50 40,170 z`, fill: "#2A2440", stroke: "#7B6CFF", "stroke-width": 5, opacity: 0 }), F("a4", 0.25) + i * 0.08, 0.2, { sound: i ? false : "whoosh" }); }
  L.pop(g2, "shadows", X2 + 620, 760, 64, F("a4", 0.3), "#5D4BE0", "Caveat", false); L.pop(g2, "boss fights", X2 + 620, 850, 64, F("a4", 0.42), RED, "Caveat", false);

  // ---------- B3: psychologists studied it ----------
  const X3 = X(3), g3 = B(3);
  L.tx(g3, "what science says", X3 - 800, 180, 110, S("a5") - 0.2, 0.8);
  const sci = fig(g3, "scientist", X3 - 520, 930, 0.9, S("a5"), { mood: "smile", look: { hair: "#5A3A2A", top: "#F4F4F0", pants: "#4A4F5A", collar: "#9CC3D9" } });
  I.path(g3, `M${X3 - 120},${300} h420 v520 h-420 z M${X3 - 40},${280} h260 v50 h-260 z`, F("a5", 0.15), 0.5, { w: 7 });
  for (let i = 0; i < 5; i++) I.path(g3, `M${X3 - 70},${400 + i * 80} l20,20 l40,-40 M${X3 + 20},${400 + i * 80} h220`, F("a5", 0.2) + i * 0.1, 0.2, { w: 5, color: i < 3 ? L.GREEN : L.GREY, silent: i > 0 });
  L.pop(g3, "proud", X3 + 600, 430, 90, F("a5", 0.55), "#5D4BE0", "Caveat", "pop", -5); L.pop(g3, "surprised?", X3 + 600, 650, 90, F("a5", 0.85), RED, "Caveat", "pop", 5);

  // ---------- title poster ----------
  const P0 = F("a4", 0.6);
  const posters = [{ on: [P0, E("a4") + 0.45], slashAt: P0 + 0.9, shakeAt: P0 + 0.9, lines: [
    { txt: "WHAT SOLO LEVELING", y: 330, size: 150, at: P0 },
    { txt: "TEACHES US ABOUT", y: 520, size: 150, fill: "#9A958C", at: P0 + 0.45 },
    { txt: "HABITS.", y: 880, size: 320, fill: RED, at: P0 + 0.9, big: true }] }];
  const shots = [[0, X0, 540, 1], [S("a2") - 0.4, X1, 540, 1], [S("a4") - 0.4, X2, 540, 1], [E("a4") + 0.1, X3, 540, 1]];
  K.run({ shots, posters, events: [{ type: "slam", at: S("a3") + 0.1 }],
    extra(t) { ch.forEach((h) => h.update(t)); const u = K.ease(K.clamp((t - S("a4") - 0.3) / (T.a4[1] * 0.5), 0, 1)); lvl.setAttribute("width", (1090 * u).toFixed(1));
      lvTxt.setAttribute("opacity", u > 0.02 ? 1 : 0); lvTxt.textContent = "LV " + Math.max(1, Math.round(1 + 99 * u)); } });
})();
