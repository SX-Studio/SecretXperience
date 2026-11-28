/* Short 6: "Left out hurts" — rejection overlaps with pain (Eisenberger et al. 2003, with caveat); loneliness as a signal. First frame = cover; loops. */
(function () {
  const K = SHORT({ keys: { left: 1, hurts: 1, catch: 1, stopped: 1, ball: 1, pain: 1, small: 1, overlap: 1, signal: 1, hunger: 1, missing: 1 }, noCap: ["h5"], fix: { h1: { 0: "Being" }, h6: { 0: "Which" } } });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;

  // ---------- B0: the cover — Naruto left out of the game ----------
  const Y0 = Y(0), FL0 = Y0 + 300; N.floor(Y0); N.hook(Y0, ["BEING LEFT OUT", 128], ["HURTS.", 150], "NARUTO");
  const nar = mk(ink, "naruto", 230, FL0, 0.85, -2); nar.face(0, "sad").key(0, "slump", 0);
  const kids = [[610, 0.6], [800, 0.66], [960, 0.58]].map(([x, s]) => { person(x, FL0, s, -2); return [x, FL0 - 330 * s - 80]; });
  const ball0 = el("circle", { r: 24, fill: RED, stroke: INKC, "stroke-width": 5 }, ink);
  const tau = K.D / (3 * Math.round(K.D / 2.1)); N.ups.push((t) => { const k = Math.floor(t / tau), u = (t / tau) % 1, a = kids[k % 3], b = kids[(k + 1) % 3]; ball0.setAttribute("cx", (a[0] + (b[0] - a[0]) * u).toFixed(1)); ball0.setAttribute("cy", (a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 110).toFixed(1)); });

  // ---------- B1: the scanner game ----------
  const Y1 = Y(1);
  L.tx(ink, "a game of catch, in a brain scanner", 90, Y1 - 610, 58, S("h2") - 0.1, 0.8);
  L.box(ink, 140, Y1 - 540, 800, 560, S("h2")); const P = [[330, Y1 - 120, "#7FB069"], [750, Y1 - 120, "#E0A030"], [540, Y1 - 420, "#A68FD6"]];
  P.forEach(([x, y, c], i) => I.fill(ink, el("circle", { cx: x, cy: y, r: 56, fill: c, stroke: INKC, "stroke-width": 6, opacity: 0 }), S("h2") + 0.15 + i * 0.06, 0.2, { sound: i ? false : "pop" }));
  L.pop(ink, "you", 540, Y1 - 495, 46, S("h2") + 0.3, INKC, "Patrick Hand", false);
  const ball = el("circle", { r: 22, fill: RED, stroke: INKC, "stroke-width": 4, opacity: 0 }, ink), cut = F("h2", 0.62), th = []; for (let tt = S("h2") + 0.3; tt < E("h3"); tt += 0.6) th.push(tt);
  N.ups.push((t) => { let k = -1; for (let i = 0; i < th.length; i++) if (t >= th[i]) k = i; ball.setAttribute("opacity", k < 0 ? 0 : 1); if (k < 0) return; const seq = th[k] < cut ? [0, 2, 1, 2] : [0, 1], a = P[seq[k % seq.length]], b = P[seq[(k + 1) % seq.length]], u = clamp((t - th[k]) / 0.5, 0, 1);
    ball.setAttribute("cx", (a[0] + (b[0] - a[0]) * u).toFixed(1)); ball.setAttribute("cy", (a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 100).toFixed(1)); });
  L.sign(ink, "they stopped passing to you", 540, Y1 + 130, 760, 96, cut, { size: 54, rot: -2, fill: "#FFD9C9", color: RED });

  // ---------- B2: a region also involved in physical pain ----------
  const Y2 = Y(2);
  I.path(ink, `M200,${Y2 - 160} q-20,-260 240,-300 q180,-90 340,20 q200,10 220,220 q60,160 -100,240 q-80,120 -260,60 q-200,60 -320,-60 q-160,-40 -120,-180 z`, S("h3") - 0.2, 0.8, { w: 9, color: "#B06A7A" });
  const spot = el("ellipse", { cx: 560, cy: Y2 - 320, rx: 96, ry: 64, fill: RED, opacity: 0 }, ink);
  N.ups.push((t) => { const u = clamp((t - F("h3", 0.35)) / 0.5, 0, 1); spot.setAttribute("opacity", (u * (0.5 + 0.25 * Math.sin(t * 7))).toFixed(2)); });
  L.pop(ink, "more left out → more activity", 540, Y2 + 70, 56, F("h3", 0.3), INKC, "Patrick Hand", false);
  L.sign(ink, "also involved in physical pain", 540, Y2 - 600, 760, 96, F("h3", 0.6), { size: 52, rot: 3, fill: "#FFD9C9", color: RED });

  // ---------- B3: honest caveat + Naruto ----------
  const Y3 = Y(3); N.floor(Y3);
  L.sign(ink, "small study", 250, Y3 - 610, 340, 96, S("h4"), { size: 60, rot: -4, fill: "#FFFDF6", color: L.GREY });
  [[-120, "rejection", "#A68FD6"], [120, "physical pain", "#E04A3A"]].forEach(([dx, lb, c], i) => { I.fill(ink, el("circle", { cx: 540 + dx, cy: Y3 - 330, r: 190, fill: c, opacity: 0 }), F("h4", 0.2) + i * 0.12, 0.3, { sound: i ? false : "pop" }).setAttribute("fill-opacity", 0.35);
    L.pop(ink, lb, 540 + dx * 1.9, Y3 - 320, 44, F("h4", 0.25) + i * 0.12, INKC, "Patrick Hand", false); });
  L.pop(ink, "overlap ≠ identical", 540, Y3 - 80, 70, F("h4", 0.4), RED, "Caveat", "slap");
  const n3 = mk(ink, "naruto", 540, Y3 + 300, 0.62, F("h4", 0.6)); n3.face(0, "sad");

  const posters = [{ on: [S("h5") - 0.05, E("h5") + 0.3], shakeAt: F("h5", 0.38), lines: [
    { txt: "LONELINESS IS", x: 90, y: 640, size: 150, at: S("h5") }, { txt: "A SIGNAL,", x: 90, y: 880, size: 230, fill: RED, at: F("h5", 0.22), big: true }, { txt: "LIKE HUNGER.", x: 90, y: 1080, size: 170, at: F("h5", 0.38) },
    { txt: "something you need is missing", x: 90, y: 1230, size: 60, font: "Patrick Hand", fill: "#9A958C", at: F("h5", 0.7) }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [1.6, 520, Y0 - 90, 1.14, 1], [S("h2") - 0.35, 540, Y1 - 120, 1.05, -1], [cut, 540, Y1 - 140, 1.16], [S("h3") - 0.35, 540, Y2 - 120, 1.05, 1], [F("h3", 0.5), 540, Y2 - 260, 1.2], [S("h4") - 0.35, 540, Y3 - 120, 1.05, -1], [F("h4", 0.6), 540, Y3 - 60, 1.15], [S("h5"), 540, Y0 - 120, 1.05]];
  K.run({ shots, posters, drift: 0.02, punches: [{ t: cut, z: 1.08 }, { t: F("h3", 0.6), z: 1.06 }, { t: F("h4", 0.4), z: 1.08 }], shakes: [{ t: cut, a: 8 }], extra: N.tick });
})();
