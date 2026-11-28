/* DBZ rivalry ep, ch5: Lesson 3 - the monologue of ep 280 (silent; Vegeta standing, halo; Goku far off fighting Kid Buu), and the second ruler (Gurel et al. 2020, children and teens; adult evidence thin). */
(function () {
  const K = LONG({ keys: { better: 1, worth: 1, watch: 1, silently: 1, comparison: 1, admits: 1, kakarot: 1, number: 1, one: 1, "break": 1, beat: 1, limits: 1, evidence: 1, ruler: 1, pride: 1, above: 1, thin: 1 }, noCap: ["v1", "v6"], fix: { v5: { 0: "There\u0027s" } } });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), CH = CHAR(K), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at, w = 1100) => I.path(g, `M${x - w},${FL} H${x + w}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const win = (g, a, b) => { const w = el("g", {}, g); ups.push((t) => w.setAttribute("display", t >= a && t < b ? "inline" : "none")); return w; };
  const person = (p, x, fl, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: fl - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${fl} Q${x - 70 * s},${fl - 250 * s} ${x},${fl - 270 * s} Q${x + 70 * s},${fl - 250 * s} ${x + 62 * s},${fl} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const icon = (p, x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(p, g, at, 0.12, { sound: false }); return g; };
  const flash = (p, cx, cy, at, r = 520) => { const c = el("circle", { cx, cy, r: 10, fill: "#FFFDF0", opacity: 0 }, p); ups.push((t) => { const u = clamp((t - at) / 0.5, 0, 1); c.setAttribute("opacity", u > 0 && u < 1 ? (1 - u) * 0.95 : 0); c.setAttribute("r", (40 + r * u).toFixed(0)); }); };
  const tick = (t) => { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); };
  // ---------- B0: episode 280 ----------
  const X0 = X(0), g0 = B(0);
  el("rect", { x: X0 - 1500, y: -300, width: 3000, height: FL + 300, fill: "#5A4E9A", opacity: 0.2 }, g0); [[-640, 150, 70], [-280, 90, 36], [760, 130, 52]].forEach(([dx, y, r]) => el("circle", { cx: X0 + dx, cy: y, r, fill: "#E8E2F4", stroke: "#8A84A8", "stroke-width": 4, opacity: 0.9 }, g0));
  el("path", { d: `M${X0 - 1500},${FL + 200} V${FL - 20} Q${X0 - 1000},${FL - 150} ${X0 - 520},${FL - 40} Q${X0 - 100},${FL + 40} ${X0 + 400},${FL - 60} Q${X0 + 900},${FL - 150} ${X0 + 1500},${FL - 30} V${FL + 200} Z`, fill: "#9CCB7A", stroke: INKC, "stroke-width": 6 }, g0);
  L.tx(g0, "episode 280", X0 - 900, 330, 76, S("v2") - 0.1, 0.5, { color: "#4A4466" });
  const veg = mk(g0, "vegeta", X0 - 520, FL - 44, 1.1, S("v2") - 0.3); veg.acc(0, "halo").face(0, "determined").key(F("v2", 0.5), "arms", 0.4).face(F("v3", 0.1), "sad").face(F("v3", 0.72), "smile").key(F("v4", 0.2), "stand", 0.5);
  I.path(g0, `M${X0 - 432},${392} q9,18 0,28 q-9,-10 0,-28`, F("v2", 0.55), 0.2, { w: 5, color: L.BLUE, silent: true });
  // far off: Goku (Super Saiyan 3) against Kid Buu
  const fight = el("g", { opacity: 0 }, g0), fx = X0 + 640, fy = 230; I.fill(g0, fight, S("v2") + 0.3, 0.3, { sound: false });
  const fin = el("g", {}, fight);
  el("path", { d: `M${fx - 150},${fy + 80} q-70,-90 -30,-170 q-10,60 30,60 q-20,-90 40,-140 q0,90 40,90 q30,60 -10,160 z`, fill: "#F7D54A", opacity: 0.5 }, fin);
  el("path", { d: `M${fx - 128},${fy - 96} q-40,60 -34,150 l26,-10 q2,-80 24,-126 z`, fill: "#F7D54A", stroke: INKC, "stroke-width": 4 }, fin);
  const gF = mk(fin, "gokuSSJ", fx - 110, fy + 70, 0.3, 0); gF.view(0, "side", 1).key(0, { aL: -84, eL: -6, aR: -92, eR: 4 }, 0).face(0, "strain");
  const buu = el("g", {}, fin); el("circle", { cx: fx + 120, cy: fy - 40, r: 22, fill: "#F29AC0", stroke: INKC, "stroke-width": 4 }, buu); el("path", { d: `M${fx + 120},${fy - 62} q4,-34 30,-30`, fill: "none", stroke: "#F29AC0", "stroke-width": 9, "stroke-linecap": "round" }, buu); el("path", { d: `M${fx + 100},${fy + 60} q-8,-70 20,-76 q28,6 20,76 z`, fill: "#F29AC0", stroke: INKC, "stroke-width": 4 }, buu); el("path", { d: `M${fx + 100},${fy + 20} h40 v44 h-40 z`, fill: "#FFFFFF", stroke: INKC, "stroke-width": 3 }, buu);
  const cl = el("circle", { cx: fx + 10, cy: fy - 10, r: 20, fill: "#FFFDF0", stroke: "#F2C230", "stroke-width": 6 }, fin);
  ups.push((t) => { fin.setAttribute("transform", `translate(${(Math.sin(t * 1.3) * 26).toFixed(1)},${(Math.cos(t * 1.7) * 18).toFixed(1)})`); buu.setAttribute("transform", `translate(${(Math.sin(t * 9) * 10).toFixed(1)},${(Math.cos(t * 7) * 8).toFixed(1)})`); cl.setAttribute("r", (16 + 16 * Math.abs(Math.sin(t * 8))).toFixed(1)); });
  L.pop(win(g0, 0, F("v4", 0.44)), "the final enemy", X0 + 660, 400, 48, F("v2", 0.3), "#4A4466", "Patrick Hand", false);
  const tw = win(g0, S("v3") - 0.1, S("v4") - 0.15); L.thought(tw, X0 - 20, 330, 640, 200, S("v3")); L.pop(tw, "Kakarot is better.", X0 - 20, 350, 70, F("v3", 0.22), INKC, "Caveat", false);
  const pw = win(g0, 0, S("v4") - 0.15); L.plate(pw, X0 + 170, 610, "YOU ARE NUMBER ONE", F("v3", 0.66), { size: 76, sub: "(in the original)" });
  const bx = win(g0, F("v4", 0.46), 1e9); L.rect(bx, X0 - 120, 340, 900, 530, F("v4", 0.48), "#FFFDF6", { rx: 16, sound: "pop" });
  const gh = mk(bx, "goku", X0 + 120, 850, 0.72, F("v4", 0.5)); gh.view(0, "side", 1).face(0, "determined"); ups.push(() => gh.root.setAttribute("opacity", Math.min(0.35, +gh.root.getAttribute("opacity")))); L.pop(bx, "yesterday's Goku", X0 + 110, 404, 44, F("v4", 0.52), L.GREY, "Patrick Hand", false);
  const gn = mk(bx, "goku", X0 + 250, 850, 0.72, F("v4", 0.6)); gn.view(0, "side", 1).face(0, "grin").move(F("v4", 0.66), X0 + 600, T.v4[1] * 0.28); L.pop(bx, "racing his own limits", X0 + 530, 404, 54, F("v4", 0.76), L.GREEN, "Caveat", "pop");

  // ---------- B1: the second ruler ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("v5") - 0.4);
  const nia = mk(g1, "nia", X1 - 780, FL, 0.95, S("v5") - 0.3); nia.face(0, "smile").say("v5").key(F("v5", 0.22), "point", 0.3).key(F("v5", 0.84), "think", 0.4);
  L.sign(g1, "nearly 600 kids and teens", X1 - 200, 190, 700, 96, F("v5", 0.2), { size: 54, rot: -2, fill: "#FFFDF6", color: L.GREY });
  const row = (y, lb, at, crownAt, crossAt) => { L.rect(g1, X1 - 560, y, 520, 110, at, "#FFFDF6", { rx: 14, sound: "pop" }); L.pop(g1, lb, X1 - 300, y + 72, 46, at + 0.05, INKC, "Patrick Hand", false); L.arrow(g1, X1 - 20, y + 55, X1 + 110, y + 55, at + 0.2, { w: 7 }); L.pop(g1, "pride", X1 + 240, y + 76, 70, at + 0.3, L.GREEN, "Caveat", "pop");
    const c = el("g", { opacity: 0, transform: `translate(${X1 + 520},${y + 96}) scale(0.8)` }, g1); el("path", { d: "M-70,0 L-80,-70 L-40,-30 L0,-90 L40,-30 L80,-70 L70,0 Z", fill: "#F2C230", stroke: INKC, "stroke-width": 6, "stroke-linejoin": "round" }, c); I.fill(g1, c, crownAt, 0.2, { sound: "pop" });
    if (crossAt) I.path(g1, `M${X1 + 440},${y - 10} L${X1 + 600},${y + 120} M${X1 + 600},${y - 10} L${X1 + 440},${y + 120}`, crossAt, 0.25, { w: 10, color: RED }); };
  row(330, "“better than others”", F("v5", 0.3), F("v5", 0.62)); row(540, "“better than my past self”", F("v5", 0.42), F("v5", 0.64), F("v5", 0.7));
  L.pop(g1, "the urge to be above everyone", X1 + 520, 300, 44, F("v5", 0.62), L.GREY, "Patrick Hand", false);
  L.sign(g1, "in adults: evidence still thin", X1 + 60, 790, 700, 90, F("v5", 0.84), { size: 50, rot: 2, fill: "#FFFDF6", color: L.GREY });

  const posters = [{ on: [S("v1") - 0.05, E("v1") + 0.5], shakeAt: F("v1", 0.6), lines: [{ txt: "LESSON #3", y: 260, size: 120, fill: "#9A958C", at: S("v1") }, { txt: "BETTER THAN YOU", y: 540, size: 220, at: F("v1", 0.3) }, { txt: "DOESN'T MEAN YOU'RE WORTH LESS.", y: 800, size: 116, fill: RED, at: F("v1", 0.6), big: true }] },
    { on: [S("v6") - 0.05, K.D + 0.1], shakeAt: F("v6", 0.78), lines: [{ txt: "IT STOPS HURTING WHEN", y: 340, size: 150, at: F("v6", 0.03) }, { txt: "“THEY'RE BETTER”", y: 540, size: 190, fill: "#9A958C", at: F("v6", 0.36) }, { txt: "NO LONGER MEANS", y: 760, size: 160, at: F("v6", 0.58) }, { txt: "“I'M WORTH LESS.”", y: 960, size: 190, fill: RED, at: F("v6", 0.78), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [S("v2") + 0.2, X0 + 60, 500, 1.0], [F("v2", 0.28), X0 + 560, 300, 1.5, 1], [F("v2", 0.5), X0 - 460, 520, 1.35, -1], [F("v2", 0.8), X0 - 360, 500, 1.2, 1], [S("v3") - 0.1, X0 - 220, 480, 1.12], [F("v3", 0.6), X0 - 60, 540, 1.0, -1],
    [S("v4") - 0.1, X0 - 460, 500, 1.35, 1], [F("v4", 0.44), X0 + 300, 600, 1.1, -1], [S("v5") - 0.4, X1 - 700, 620, 1.3], [F("v5", 0.2), X1 - 100, 540, 1.0, 1], [F("v5", 0.6), X1 + 150, 500, 1.1, -1], [F("v5", 0.84), X1, 560, 1.02]];
  K.run({ shots, posters, punches: [{ t: F("v3", 0.66), z: 1.04 }, { t: F("v4", 0.76), z: 1.06 }, { t: F("v5", 0.7), z: 1.06 }], shakes: [{ t: F("v3", 0.66), a: 12 }], extra: tick });
})();
