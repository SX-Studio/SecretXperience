/* DBZ rivalry ep, ch2: Vegeta's story — prince and low-class warrior, the scouter (ep 28), the first fight (eps 30–35), Goku's Super Saiyan (ep 95), Vegeta's (ep 129), still behind. Outfits per the model sheet and RESEARCH.md A8. */
(function () {
  const K = LONG({ keys: { prince: 1, saiyans: 1, saiyan: 1, elite: 1, low: 1, scouter: 1, number: 1, crushes: 1, stronger: 1, four: 1, humiliation: 1, super: 1, birthright: 1, alone: 1, gravity: 1, second: 1, ahead: 1 }, fix: { s4: { 0: "Then" }, s6: { 0: "And" } } });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), CH = CHAR(K), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at, w = 1100) => I.path(g, `M${x - w},${FL} H${x + w}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const win = (g, a, b) => { const w = el("g", {}, g); ups.push((t) => w.setAttribute("display", t >= a && t < b ? "inline" : "none")); return w; };
  const person = (p, x, fl, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: fl - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${fl} Q${x - 70 * s},${fl - 250 * s} ${x},${fl - 270 * s} Q${x + 70 * s},${fl - 250 * s} ${x + 62 * s},${fl} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const icon = (p, x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(p, g, at, 0.12, { sound: false }); return g; };
  const flash = (p, cx, cy, at, r = 520) => { const c = el("circle", { cx, cy, r: 10, fill: "#FFFDF0", opacity: 0 }, p); ups.push((t) => { const u = clamp((t - at) / 0.5, 0, 1); c.setAttribute("opacity", u > 0 && u < 1 ? (1 - u) * 0.95 : 0); c.setAttribute("r", (40 + r * u).toFixed(0)); }); };
  const tick = (t) => { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); };
  // ---------- B0: born elite / sent away ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, 0);
  I.path(g0, `M${X0 - 830},${FL} v-50 h460 v50 M${X0 - 770},${FL - 50} v-50 h340 v50`, 0.1, 0.5, { w: 7, color: "#8A847A" });
  const v0 = mk(g0, "vegetaArmor", X0 - 600, FL - 100, 1.0, 0.1); v0.key(0, "arms", 0).face(0, "smirk");
  L.plate(g0, X0 - 330, 150, "PRINCE OF ALL SAIYANS", F("s1", 0.06), { size: 52 }); L.pop(g0, "ELITE", X0 - 250, 520, 120, F("s1", 0.33), RED, "Anton", "slap", -4);
  I.fill(g0, el("circle", { cx: X0 + 180, cy: 250, r: 62, fill: "#C86A5A", stroke: INKC, "stroke-width": 6, opacity: 0 }), F("s1", 0.42), 0.2, { sound: false }); I.fill(g0, el("circle", { cx: X0 + 820, cy: 330, r: 78, fill: "#7FB8E0", stroke: INKC, "stroke-width": 6, opacity: 0 }), F("s1", 0.5), 0.2, { sound: false });
  I.fill(g0, el("path", { d: `M${X0 + 770},${300} q30,-30 60,0 q20,30 -10,50 q-40,10 -50,-50 z`, fill: "#7FB069", opacity: 0 }), F("s1", 0.52), 0.2, { sound: false });
  I.path(g0, `M${X0 + 250},${240} Q${X0 + 500},${90} ${X0 + 745},${300}`, F("s1", 0.55), 0.6, { w: 5, color: "#8A847A", attrs: { "stroke-dasharray": "10 14" }, silent: true });
  const pod = el("circle", { r: 22, fill: "#F4F0E6", stroke: INKC, "stroke-width": 5, opacity: 0 }, g0); ups.push((t) => { const u = clamp((t - F("s1", 0.56)) / (T.s1[1] * 0.2), 0, 1), q = (a, b, c2) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c2; pod.setAttribute("opacity", u > 0 && u < 1 ? 1 : 0); pod.setAttribute("cx", q(X0 + 250, X0 + 500, X0 + 745).toFixed(1)); pod.setAttribute("cy", q(240, 90, 300).toFixed(1)); });
  L.pop(g0, "sent away as a baby", X0 + 470, 335, 50, F("s1", 0.66), L.GREY, "Patrick Hand", false);
  const gk0 = mk(g0, "gokuSaiyan", X0 + 660, FL, 0.92, F("s1", 0.48)); gk0.face(0, "grin").key(F("s1", 0.5), "wave", 0.3);
  L.pop(g0, "LOW-CLASS", X0 + 240, 700, 100, F("s1", 0.86), "#8A847A", "Anton", "slap", 3);

  // ---------- B1: the scouter ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("s2") - 0.4);
  L.tx(g1, "episode 28", X1 - 900, 150, 76, S("s2") - 0.1, 0.5, { color: L.GREY });
  const au1 = L.aura(g1, X1 + 600, FL + 10, 460, 800, "#9CD3F5", F("s2", 0.5)); ups.push(au1.update);
  const tC = F("s2", 0.84), v1 = mk(g1, "vegetaArmor", X1 - 560, FL, 1.1, S("s2") - 0.3); v1.face(0, "smirk").face(F("s2", 0.62), "wow").face(F("s2", 0.72), "strain").acc(tC, "none").key(tC - 0.1, { aR: -64, eR: -104 }, 0.25);
  const gk1 = mk(g1, "gokuSaiyan", X1 + 600, FL, 1.0, S("s2") - 0.2); gk1.face(0, "determined").key(F("s2", 0.5), { aL: 34, eL: -84, aR: -34, eR: 84, head: -4 }, 0.3).face(F("s2", 0.5), "strain");
  L.box(g1, X1 - 330, 240, 560, 230, F("s2", 0.14)); L.pop(g1, "POWER LEVEL", X1 - 50, 300, 46, F("s2", 0.18), L.GREY, "Patrick Hand", false); I.path(g1, `M${X1 - 330},${330} L${X1 - 440},${360}`, F("s2", 0.16), 0.2, { w: 5, color: "#E0567A", silent: true });
  const num = el("text", { x: X1 - 50, y: 430, "text-anchor": "middle", "font-family": "Anton", "font-size": 120, fill: "#C62F2A", opacity: 0 }, g1);
  ups.push((t) => { const u = ease(clamp((t - F("s2", 0.5)) / (T.s2[1] * 0.18), 0, 1)); num.setAttribute("opacity", t >= F("s2", 0.32) ? 1 : 0); num.textContent = t >= tC ? "- - - -" : (u >= 1 ? "9,000+" : Math.round(1200 + 7800 * u).toLocaleString("en-US")); });
  L.pop(g1, "IT'S OVER 9000!", X1 + 20, 690, 136, F("s2", 0.7), RED, "Anton", "bigslam", -3); L.pop(g1, "(English dub. In the original: 8,000)", X1 + 20, 770, 44, F("s2", 0.76), L.GREY, "Patrick Hand", false);
  for (let i = 0; i < 6; i++) { const a = (-150 + i * 34) * Math.PI / 180; I.path(g1, `M${X1 - 450 + Math.cos(a) * 46},${600 + Math.sin(a) * 46} l${Math.cos(a) * 54},${Math.sin(a) * 54}`, tC + i * 0.02, 0.12, { w: 7, color: "#E0567A", silent: i > 0 }); }

  // ---------- B2: the first fight ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("s3") - 0.4, 1300);
  const tB = F("s3", 0.42), bw = win(g2, S("s3") - 0.2, tB), A = [X2 - 560, FL - 330], Bp = [X2 + 520, FL - 600];
  const bm = (c) => [el("line", { stroke: c, "stroke-width": 54, "stroke-linecap": "round", opacity: 0.9 }, bw), el("line", { stroke: "#FFFFFF", "stroke-width": 20, "stroke-linecap": "round", opacity: 0.9 }, bw)], bG = bm("#6FC0F2"), bV = bm("#B487E8"), cl = el("circle", { fill: "#FFFDF0", stroke: "#F2C230", "stroke-width": 8 }, bw);
  ups.push((t) => { const k = clamp((t - S("s3")) / (tB - S("s3")), 0, 1), u = 0.55 - 0.3 * ease(k) + 0.03 * Math.sin(t * 19), px = A[0] + (Bp[0] - A[0]) * u, py = A[1] + (Bp[1] - A[1]) * u; bG.forEach((l) => { l.setAttribute("x1", A[0]); l.setAttribute("y1", A[1]); l.setAttribute("x2", px); l.setAttribute("y2", py); }); bV.forEach((l) => { l.setAttribute("x1", Bp[0]); l.setAttribute("y1", Bp[1]); l.setAttribute("x2", px); l.setAttribute("y2", py); }); cl.setAttribute("cx", px); cl.setAttribute("cy", py); cl.setAttribute("r", (62 + 14 * Math.sin(t * 23)).toFixed(1)); });
  const gk2 = mk(g2, "gokuBare", X2 - 700, FL, 0.95, S("s3") - 0.3); gk2.view(0, "side", 1).key(0, { aL: -84, eL: -6, aR: -92, eR: 4 }, 0).face(0, "strain").view(tB, "front").key(tB, "slump", 0.4).face(tB, "tired");
  const vW = el("g", {}, g2), v2 = mk(vW, "vegetaArmor", X2 + 660, FL, 1.0, S("s3") - 0.3); v2.acc(0, "none").view(0, "side", -1).key(0, { aL: -84, eL: -6, aR: -92, eR: 4 }, 0).face(0, "smirk").view(F("s3", 0.5), "front").face(F("s3", 0.5), "strain").key(F("s3", 0.56), "kneel", 0.3);
  ups.push((t) => { const u = ease(clamp((t - F("s3", 0.46)) / 0.4, 0, 1)); vW.setAttribute("transform", `translate(0,${(-270 * (1 - u)).toFixed(1)})`); });
  L.pop(g2, "one on one: Vegeta", X2 + 80, 250, 64, F("s3", 0.1), INKC, "Caveat", false);
  [[-470, 0.58], [-350, 0.5], [-220, 0.74]].forEach(([dx, s], i) => person(g2, X2 + dx, FL, s, F("s3", 0.42) + i * 0.08)); L.pop(g2, "4 vs 1", X2 - 40, 430, 150, F("s3", 0.5), RED, "Anton", "bigslam", -3);
  L.sign(g2, "his first great humiliation", X2 + 520, 400, 660, 100, F("s3", 0.76), { size: 54, rot: 3, fill: "#FFD9C9", color: RED });

  // ---------- B3: Goku gets there first ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("s4") - 0.4);
  L.tx(g3, "episode 95", X3 - 900, 150, 76, S("s4") - 0.1, 0.5, { color: L.GREY });
  const tT = F("s4", 0.3), au3 = L.aura(g3, X3 - 320, FL + 10, 520, 880, "#F7D54A", tT + 0.1); ups.push(au3.update);
  const ga = mk(win(g3, 0, tT + 0.12), "gokuNamek", X3 - 320, FL, 1.08, S("s4") - 0.3); ga.face(0, "strain").key(0, { aL: 34, eL: -84, aR: -34, eR: 84 }, 0);
  const gb = mk(win(g3, tT + 0.12, 1e9), "gokuNamekSSJ", X3 - 320, FL, 1.08, S("s4") - 0.3); gb.face(0, "determined").key(0, { aL: 34, eL: -84, aR: -34, eR: 84 }, 0).key(F("s4", 0.6), "stand", 0.5);
  flash(g3, X3 - 320, 520, tT); L.plate(g3, X3 - 320, 150, "SUPER SAIYAN", tT + 0.3, { size: 70 });
  I.path(g3, `M${X3 + 420},${FL} v-240 h260 v240 M${X3 + 390},${FL - 240} h320`, F("s4", 0.5), 0.4, { w: 8, color: "#8A847A" }); L.pop(g3, "Vegeta's birthright", X3 + 550, 810, 50, F("s4", 0.62), L.GREY, "Patrick Hand", false);
  const crown = el("g", { opacity: 0 }, g3); el("path", { d: "M-70,0 L-80,-70 L-40,-30 L0,-90 L40,-30 L80,-70 L70,0 Z", fill: "#F2C230", stroke: INKC, "stroke-width": 6, "stroke-linejoin": "round" }, crown); [-80, 0, 80].forEach((x, i) => el("circle", { cx: x, cy: i === 1 ? -90 : -70, r: 9, fill: "#E0567A", stroke: INKC, "stroke-width": 3 }, crown));
  ups.push((t) => { const u = ease(clamp((t - F("s4", 0.72)) / 0.8, 0, 1)), x = X3 + 550 + (X3 - 320 - (X3 + 550)) * u, y = 640 + (318 - 640) * u - Math.sin(u * Math.PI) * 220; crown.setAttribute("opacity", t >= F("s4", 0.52) ? 1 : 0); crown.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(u * -12).toFixed(1)})`); });

  // ---------- B4: 450 times gravity ----------
  const X4 = X(4), g4 = B(4); floor(g4, X4, S("s5") - 0.4);
  I.path(g4, `M${X4 - 760},${FL} V${420} Q${X4 - 760},${140} ${X4 - 100},${140} Q${X4 + 560},${140} ${X4 + 560},${420} V${FL}`, S("s5") - 0.2, 0.7, { w: 7, color: "#8A847A" });
  L.box(g4, X4 + 130, 220, 360, 210, S("s5") + 0.2); L.pop(g4, "GRAVITY", X4 + 310, 278, 44, S("s5") + 0.3, L.GREY, "Patrick Hand", false); const gv = el("text", { x: X4 + 310, y: 400, "text-anchor": "middle", "font-family": "Anton", "font-size": 110, fill: "#C62F2A", opacity: 0 }, g4);
  ups.push((t) => { const u = ease(clamp((t - S("s5") - 0.4) / (T.s5[1] * 0.22), 0, 1)); gv.setAttribute("opacity", t > S("s5") + 0.4 ? 1 : 0); gv.textContent = Math.round(1 + 449 * u) + "×"; });
  const tV = F("s5", 0.62), va = mk(win(g4, 0, tV), "vegetaCell", X4 - 260, FL, 1.0, S("s5") - 0.3); va.view(0, "side", 1).key(0, "pushUp", 0).face(0, "strain"); for (let k = 0, tt = S("s5") + 0.2; tt < tV; tt += 0.55, k++) va.key(tt, k % 2 ? "pushUp" : "pushDown", 0.5);
  [[-60, 0.2], [-10, 0.45], [-100, 0.7]].forEach(([dx, f], i) => I.path(win(g4, 0, tV), `M${X4 - 260 + dx},${640} q9,18 0,28 q-9,-10 0,-28`, S("s5") + 0.6 + i * 0.5, 0.2, { w: 5, color: L.BLUE, silent: true }));
  const au4 = L.aura(g4, X4 - 260, FL + 10, 500, 860, "#F7D54A", tV + 0.1); ups.push(au4.update); flash(g4, X4 - 260, 520, tV);
  const vb = mk(win(g4, tV, 1e9), "vegetaCellSSJ", X4 - 260, FL, 1.0, S("s5") - 0.3); vb.face(0, "strain").key(0, { aL: 34, eL: -84, aR: -34, eR: 84 }, 0).face(F("s5", 0.8), "determined");
  L.tx(g4, "episode 129", X4 - 900, 110, 70, tV, 0.4, { color: L.GREY }); L.pop(g4, "2nd.", X4 + 310, 640, 170, F("s5", 0.9), RED, "Anton", "bigslam", -5); L.pop(g4, "fury at himself", X4 + 310, 730, 60, F("s5", 0.78), INKC, "Caveat", false);

  // ---------- B5: still ahead ----------
  const X5 = X(5), g5 = B(5);
  const gk5 = mk(g5, "gokuSSJ", X5 - 700, 470, 0.55, S("s6") - 0.3); gk5.face(0, "grin"); const v5 = mk(g5, "vegetaCellSSJ", X5 - 700, 830, 0.52, S("s6") - 0.2); v5.face(0, "strain").key(0, "arms", 0);
  const rG = el("rect", { x: X5 - 560, y: 300, height: 100, rx: 8, fill: "#F28C28", stroke: INKC, "stroke-width": 6 }, g5), rV = el("rect", { x: X5 - 560, y: 660, height: 100, rx: 8, fill: "#2A3F7A", stroke: INKC, "stroke-width": 6 }, g5);
  ups.push((t) => { const u = clamp((t - S("s6") + 0.2) / (T.s6[1] + 0.6), 0, 1), lv = 200 + 820 * ease(u), lg = lv + 150 + 60 * Math.sin(u * 9); rV.setAttribute("width", lv.toFixed(0)); rG.setAttribute("width", lg.toFixed(0)); const o = t >= S("s6") - 0.2 ? 1 : 0; rV.setAttribute("opacity", o); rG.setAttribute("opacity", o); });
  L.pop(g5, "still ahead", X5 + 560, 250, 80, F("s6", 0.6), RED, "Caveat", "slap", -3);

  const shots = [[0, X0 - 100, 540, 1.0], [F("s1", 0.1), X0 - 420, 480, 1.2, -1], [F("s1", 0.42), X0 + 480, 500, 1.12, 1], [F("s1", 0.84), X0 + 60, 540, 1.0],
    [S("s2") - 0.4, X1, 540, 1.0], [F("s2", 0.1), X1 - 330, 440, 1.45, -1], [F("s2", 0.48), X1 + 330, 520, 1.12, 1], [F("s2", 0.68), X1, 540, 1.02], [tC - 0.15, X1 - 470, 540, 1.45, -1],
    [S("s3") - 0.4, X2, 500, 0.98], [F("s3", 0.12), X2 - 20, 470, 1.08, 1], [tB, X2 - 250, 560, 1.08, -1], [F("s3", 0.72), X2 + 520, 580, 1.3, 1],
    [S("s4") - 0.4, X3, 540, 1.0], [tT - 0.5, X3 - 320, 480, 1.3, -1], [F("s4", 0.5), X3 + 120, 520, 1.02, 1],
    [S("s5") - 0.4, X4 - 100, 540, 1.0], [F("s5", 0.12), X4 - 180, 640, 1.35, 1], [F("s5", 0.36), X4 + 40, 520, 1.1, -1], [tV - 0.3, X4 - 240, 500, 1.25], [F("s5", 0.86), X4 + 20, 520, 1.08, 1],
    [S("s6") - 0.3, X5, 540, 1.0], [S("s6") + 0.7, X5 + 120, 540, 1.1, -1]];
  K.run({ shots, punches: [{ t: F("s1", 0.33), z: 1.06 }, { t: F("s2", 0.7), z: 1.1 }, { t: F("s3", 0.5), z: 1.08 }, { t: tT, z: 1.1 }, { t: tV, z: 1.1 }, { t: F("s5", 0.9), z: 1.08 }], shakes: [{ t: F("s2", 0.7), a: 16 }, { t: tC, a: 10 }, { t: tT, a: 14 }, { t: tV, a: 14 }, { t: F("s3", 0.5), a: 10 }], extra: tick });
})();
