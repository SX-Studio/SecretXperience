/* One Piece help ep, ch2: Nami's story (eps 36–37), told in our own words. Characters per the locked model sheet (Arlong Park outfits). */
(function () {
  const K = LONG({ keys: { deal: 1, ten: 1, arlong: 1, village: 1, hundred: 1, million: 1, eight: 1, years: 1, alone: 1, killed: 1, seven: 1, marine: 1, breaks: 1, despair: 1, catches: 1, stays: 1, luffy: 1, help: 1, hat: 1, course: 1, waiting: 1, four: 1, park: 1 }, fix: {} });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at, w = 1100) => I.path(g, `M${x - w},${FL} H${x + w}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const person = (p, x, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: FL - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${FL} Q${x - 70 * s},${FL - 250 * s} ${x},${FL - 270 * s} Q${x + 70 * s},${FL - 250 * s} ${x + 62 * s},${FL} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };

  // ---------- B0: the village and the deal ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, 0);
  L.tx(g0, "Cocoyasi Village", X0 - 820, 170, 96, 0.1, 0.8);
  I.path(g0, `M${X0 - 800},${FL} v-240 l130,-100 l130,100 v240 M${X0 - 480},${FL} v-200 l110,-90 l110,90 v200 M${X0 - 200},${FL} v-260 l140,-110 l140,110 v260`, 0.2, 0.9, { w: 7, color: "#8A847A" });
  [[-670, 0], [-370, 1], [-60, 2]].forEach(([dx, i]) => I.path(g0, `M${X0 + dx - 30},${FL} v-90 h60 v90`, 0.6 + i * 0.1, 0.2, { w: 5, color: "#8A5A2B", silent: true }));
  const arl = el("g", { opacity: 0 }, g0); el("circle", { cx: X0 + 520, cy: 360, r: 86, fill: "#2A3A4A" }, arl); el("path", { d: `M${X0 + 400},${FL} Q${X0 + 380},${470} ${X0 + 520},${450} Q${X0 + 660},${470} ${X0 + 640},${FL} Z`, fill: "#2A3A4A" }, arl);
  el("path", { d: `M${X0 + 440},${370} l-120,10 l16,-12 l-10,-10 l18,-8 l-8,-12 l20,-4 l-6,-14 l70,10 z`, fill: "#2A3A4A" }, arl); el("path", { d: `M${X0 + 520},${282} l30,-90 l40,100 z`, fill: "#2A3A4A" }, arl);
  I.fill(g0, arl, F("v1", 0.55), 0.3, { sound: "bigslam" }); L.pop(g0, "Arlong", X0 + 520, 230 - 70, 60, F("v1", 0.6), "#2A3A4A", "Patrick Hand", false);
  L.sign(g0, "100,000,000 berries", X0 + 20, 420, 620, 110, F("v2", 0.6), { font: "Anton", size: 64, rot: -3 }); L.pop(g0, "to buy the village back", X0 + 20, 540, 52, F("v2", 0.7), L.GREY, "Patrick Hand", false);

  // ---------- B1: eight years, alone — and then it's taken ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("v3") - 0.4);
  const nami1 = mk(g1, "nami", X1 - 520, FL, 1.0, S("v3") - 0.3); nami1.face(0, "determined").face(F("v4", 0.6), "wow").face(F("v4", 0.9), "sad").key(F("v4", 0.9), "slump", 0.4);
  L.tx(g1, "8 years", X1 - 820, 180, 110, S("v3"), 0.5); L.pop(g1, "alone.", X1 - 380, 300, 80, F("v3", 0.35), RED, "Caveat", false);
  const chest = el("g", {}, g1); I.path(chest, `M${X1 - 60},${FL - 20} h360 v-180 h-360 z M${X1 - 60},${FL - 200} q180,-110 360,0`, S("v3") + 0.2, 0.6, { w: 8, color: "#8A5A2B" });
  const coins = el("rect", { x: X1 - 40, y: FL - 30, width: 320, height: 0, fill: "#F2C230", stroke: INKC, "stroke-width": 5 }, chest);
  const cnt = el("text", { x: X1 + 120, y: 480, "text-anchor": "middle", "font-family": "Anton", "font-size": 110, fill: INKC, opacity: 0 }, g1);
  const marine = person(g1, X1 + 700, 1.0, F("v4", 0.45), "#DDE3EA"); const cap = el("g", { opacity: 0 }, g1); el("path", { d: `M${X1 + 640},${FL - 372} h120 v-30 q-60,-30 -120,0 z`, fill: "#FFFFFF", stroke: INKC, "stroke-width": 5 }, cap); I.fill(g1, cap, F("v4", 0.5), 0.2, { sound: false });
  L.pop(g1, "a corrupt Marine", X1 + 700, 380, 50, F("v4", 0.55), L.GREY, "Patrick Hand", false);
  ups.push((t) => { const u = ease(clamp((t - S("v3") - 0.5) / (T.v3[1] * 0.8), 0, 1)), gone = ease(clamp((t - F("v4", 0.62)) / 0.7, 0, 1)), h = 150 * u * 0.93;
    coins.setAttribute("height", h.toFixed(1)); coins.setAttribute("y", (FL - 30 - h).toFixed(1)); chest.setAttribute("transform", `translate(${(gone * 760).toFixed(1)},0)`); marine.setAttribute("transform", `translate(${(gone * 400).toFixed(1)},0)`); cap.setAttribute("transform", `translate(${(gone * 400).toFixed(1)},0)`);
    cnt.setAttribute("opacity", t > S("v3") + 0.5 ? 1 : 0); cnt.textContent = gone > 0.5 ? "0" : Math.round(93 * u) + ",000,000"; cnt.setAttribute("fill", gone > 0.5 ? RED : (t >= S("v4") && t < F("v4", 0.45) ? RED : INKC)); });
  L.pop(g1, "7 million short", X1 + 120, 600, 60, S("v4") + 0.2, RED, "Caveat", false);

  const win = (g, a, b) => { const w = el("g", {}, g); ups.push((t) => w.setAttribute("display", t >= a && t < b ? "inline" : "none")); return w; };
  // ---------- B2: episode 37 — he catches her arm; "help me"; the hat ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("v5") - 0.4, 1500);
  L.tx(g2, "episode 37", X2 - 900, 170, 90, S("v5") - 0.1, 0.5, { color: L.GREY });
  const nami = mk(g2, "nami", X2 - 320, FL, 1.0, S("v5") - 0.3); nami.key(0, "stand", 0).face(0, "sad").key(F("v5", 0.3), "kneel", 0.5).face(F("v5", 0.45), "strain").key(F("v5", 0.5), { aL: -78, eL: -36 }, 0.3)
    .face(F("v5", 0.9), "wow").face(S("v6"), "strain").key(S("v6"), { aR: -30, eR: 20, aL: 30, eL: -20 }, 0.3).face(F("v6", 0.75), "sad").key(F("v6", 0.75), { aR: -14, eR: 10, aL: 14, eL: -10, head: 24 }, 0.5)
    .face(F("v7", 0.6), "sad").key(F("v7", 0.6), { head: -6 }, 0.5).acc(F("v8", 0.32), "strawhat").key(F("v8", 0.35), { head: 14 }, 0.4);
  const luffy = mk(g2, "luffy", X2 + 900, FL, 1.0, F("v5", 0.6)); luffy.view(0, "side", -1).move(F("v5", 0.62), X2 - 110, 0.7).view(F("v5", 0.88), "front").face(0, "determined").key(F("v5", 0.88), { aL: 62, eL: 30 }, 0.2)
    .key(F("v6", 0.75), "stand", 0.4).face(F("v7", 0.8), "neutral").key(F("v8", 0.2), { aL: 120, eL: 20 }, 0.3).acc(F("v8", 0.32), "none").key(F("v8", 0.45), "stand", 0.3)
    .view(F("v8", 0.5), "side", 1).move(F("v8", 0.5), X2 + 420, 0.9).view(F("v8", 0.72), "front").key(F("v8", 0.74), { aL: 146, eL: -14, aR: -146, eR: 14, head: -8 }, 0.2).face(F("v8", 0.74), "strain");
  const wb = win(g2, S("v6") - 0.1, F("v6", 0.7)), ws = win(g2, 0, S("v7") - 0.1), wh = win(g2, 0, F("v8", 0.3));
  for (let i = 0; i < 5; i++) { const a = (-150 + i * 30) * Math.PI / 180; I.path(wb, `M${X2 - 320 + Math.cos(a) * 250},${560 + Math.sin(a) * 250} l${Math.cos(a) * 60},${Math.sin(a) * 60}`, S("v6") + i * 0.04, 0.15, { w: 8, color: RED, silent: i > 0 }); }
  L.pop(ws, "he stays.", X2 + 160, 420, 80, F("v6", 0.78), INKC, "Caveat", false);
  nami.cry(F("v6", 0.75));
  L.rect(wh, X2 - 660, 300, 300, 110, W("v7", -2) - 0.1, "#FFFDF6", { rx: 36, sound: "pop" }); L.pop(wh, "help me.", X2 - 510, 375, 72, W("v7", -2), RED, "Caveat", false);
  L.pop(g2, "OF COURSE!", X2 + 420, 250, 130, F("v8", 0.76), RED, "Anton", "bigslam", -3);

  // ---------- B3: the walk to Arlong Park ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("v9") - 0.4, 1500);
  I.path(g3, `M${X3 + 560},${FL} V${300} H${X3 + 1000} V${FL} M${X3 + 520},${300} H${X3 + 1040}`, S("v9") + 0.2, 0.7, { w: 12, color: "#6B6359" }); L.sign(g3, "ARLONG PARK", X3 + 780, 240, 440, 90, F("v9", 0.55), { font: "Anton", size: 58, rot: 0, fill: "#2A3A4A", color: "#F4EFE6" });
  const walkers = [["zoro", -200], ["usopp", 40], ["sanji", 280]].map(([n, dx], i) => { const h = mk(g3, n, X3 + dx, FL, 0.95, S("v9") - 0.3 + i * 0.1); h.face(0, n === "usopp" ? "wow" : "determined"); return [h, dx]; });
  const l3 = mk(g3, "luffy", X3 - 1300, FL, 0.95, S("v9") - 0.3); l3.acc(0, "none").view(0, "side", 1).face(0, "determined").move(S("v9"), X3 - 440, 1.0);
  const go = F("v9", 0.55); walkers.forEach(([h, dx]) => h.view(go, "side", 1).move(go, X3 + dx + 420, T.v9[1] * 0.45 + 1)); l3.move(go, X3 - 20, T.v9[1] * 0.45 + 1);

  const shots = [[0, X0, 540, 1.0], [F("v1", 0.5), X0 + 200, 520, 1.1, 1], [S("v2") - 0.1, X0, 540, 1.05], [S("v3") - 0.4, X1, 540, 1.0, -1], [S("v4") - 0.2, X1 + 200, 540, 1.08], [S("v5") - 0.4, X2 - 100, 540, 1.0], [F("v5", 0.85), X2 - 220, 600, 1.3, 1],
    [S("v6") - 0.1, X2 - 200, 560, 1.15, -1], [F("v7", 0.45), X2 - 340, 560, 1.55], [S("v8") - 0.2, X2 - 200, 560, 1.2, 1], [F("v8", 0.5), X2 + 150, 540, 1.0], [F("v8", 0.74), X2 + 420, 480, 1.25, -1], [S("v9") - 0.4, X3, 540, 1.0], [go, X3 + 260, 540, 1.05, 1]];
  K.run({ shots, punches: [{ t: F("v2", 0.6), z: 1.08 }, { t: F("v5", 0.88), z: 1.08 }, { t: W("v7", -2), z: 1.06 }], shakes: [{ t: F("v8", 0.76), a: 14 }, { t: F("v4", 0.62), a: 8 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
