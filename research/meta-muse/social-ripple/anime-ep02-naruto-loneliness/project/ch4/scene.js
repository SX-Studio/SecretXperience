/* Naruto loneliness ep, ch4: Lesson 2 — it really does hurt (Eisenberger et al. 2003 + caveats; Holt-Lunstad et al. 2010). */
(function () {
  const K = LONG({ keys: { hurt: 1, scanner: 1, catch: 1, stopped: 1, ball: 1, left: 1, pain: 1, small: 1, overlap: 1, connection: 1, "148": 1, fifty: 1, "50%": 1, survival: 1, surviving: 1, link: 1, cause: 1, signal: 1, hunger: 1 }, noCap: ["r1", "r7"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900;

  // ---------- B0: scanner + the ball-toss game ----------
  const X0 = X(0), g0 = B(0);
  L.tx(g0, "2003: a game of catch", X0 - 820, 170, 90, S("r2") - 0.1, 0.8);
  I.path(g0, `M${X0 - 860},${800} h700 v60 h-700 z`, S("r2"), 0.5, { w: 7 }); I.path(g0, `M${X0 - 300},${860} m-200,0 a200,220 0 1,1 400,0`, S("r2") + 0.2, 0.6, { w: 12, color: "#8A847A" });
  const mo = mk(g0, "mo", X0 - 760, 800, 0.62, F("r2", 0.15)); mo.view(0, "side", 1).key(0, "flat", 0).face(0, "neutral");
  L.box(g0, X0 + 80, 260, 760, 560, F("r2", 0.35)); const P = [[X0 + 250, 680, "#7FB069"], [X0 + 670, 680, "#E0A030"], [X0 + 460, 380, "#A68FD6"]];
  P.forEach(([x, y, c], i) => { I.fill(g0, el("circle", { cx: x, cy: y, r: 52, fill: c, stroke: INKC, "stroke-width": 6, opacity: 0 }), F("r2", 0.4) + i * 0.08, 0.2); });
  L.pop(g0, "you", X0 + 460, 300, 44, F("r2", 0.5), INKC, "Patrick Hand", false);
  const ball = el("circle", { r: 20, fill: RED, stroke: INKC, "stroke-width": 4, opacity: 0 }, g0);
  const throws = []; for (let tt = F("r2", 0.5); tt < E("r3") + 0.5; tt += 0.7) throws.push(tt);
  ups.push((t) => { let k = -1; for (let i = 0; i < throws.length; i++) if (t >= throws[i]) k = i; if (k < 0) { ball.setAttribute("opacity", 0); return; } ball.setAttribute("opacity", 1);
    const cut = F("r2", 0.78), included = throws[k] < cut, seq = included ? [0, 2, 1, 2] : [0, 1]; const a = P[seq[k % seq.length]], b = P[seq[(k + 1) % seq.length]], u = clamp((t - throws[k]) / 0.6, 0, 1);
    ball.setAttribute("cx", (a[0] + (b[0] - a[0]) * u).toFixed(1)); ball.setAttribute("cy", (a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 120).toFixed(1)); });
  L.pop(g0, "…then they stopped passing to you", X0 + 460, 235, 50, F("r2", 0.8), RED, "Caveat", false);

  // ---------- B1: a region that's also involved in physical pain ----------
  const X1 = X(1), g1 = B(1);
  I.path(g1, `M${X1 - 380},${560} q-20,-260 240,-300 q180,-90 340,20 q200,10 220,220 q60,160 -100,240 q-80,120 -260,60 q-200,60 -320,-60 q-160,-40 -120,-180 z`, S("r3") - 0.1, 0.9, { w: 8, color: "#B06A7A" });
  const spot = el("ellipse", { cx: X1 - 20, cy: 400, rx: 90, ry: 60, fill: RED, opacity: 0 }, g1);
  ups.push((t) => { const u = clamp((t - F("r3", 0.4)) / 0.5, 0, 1); spot.setAttribute("opacity", (u * (0.45 + 0.25 * Math.sin(t * 7))).toFixed(2)); });
  L.pop(g1, "felt more left out → this region lit up more", X1, 800, 54, F("r3", 0.45), INKC, "Patrick Hand", false);
  L.sign(g1, "also involved in physical pain", X1 + 420, 230, 600, 90, F("r3", 0.75), { size: 52, rot: 4, fill: "#FFD9C9", color: RED });

  // ---------- B2: honest caveat: overlap, not the same ----------
  const X2 = X(2), g2 = B(2);
  L.sign(g2, "small study", X2 - 560, 250, 360, 100, S("r4"), { size: 64, rot: -4, fill: "#FFFDF6", color: L.GREY });
  [[-170, "rejection", "#A68FD6"], [170, "physical pain", "#E04A3A"]].forEach(([dx, lb, c], i) => { I.fill(g2, el("circle", { cx: X2 + 200 + dx, cy: 560, r: 240, fill: c, opacity: 0 }), F("r4", 0.45) + i * 0.15, 0.3, { sound: i ? false : "pop" }).setAttribute("fill-opacity", 0.35);
    L.pop(g2, lb, X2 + 200 + dx * 1.6, 560, 52, F("r4", 0.5) + i * 0.15, INKC, "Patrick Hand", false); });
  L.pop(g2, "overlap ≠ the same", X2 + 200, 880, 76, F("r4", 0.62), RED, "Caveat", "slap");

  // ---------- B3: 148 studies, 300k+ people, ~50% higher odds of survival ----------
  const X3 = X(3), g3 = B(3);
  L.tx(g3, "148 studies · 300,000+ people", X3 - 820, 170, 90, S("r5"), 0.9);
  for (let i = 0; i < 7; i++) L.rect(g3, X3 - 820 + i * 12, 640 - i * 40, 280, 54, F("r5", 0.1) + i * 0.05, "#FFFDF6", { rx: 4, sound: i ? false : "swish" });
  const base = 820; ups.push(L.bars(g3, [{ x: X3 + 60, y: base, len: 260, thick: 180, fill: "#B8B0A2", at: F("r5", 0.55) }, { x: X3 + 360, y: base, len: 390, thick: 180, fill: L.GREEN, at: F("r5", 0.7) }]));
  L.pop(g3, "weaker ties", X3 + 150, base + 50, 44, F("r5", 0.55), INKC, "Patrick Hand", false); L.pop(g3, "stronger ties", X3 + 450, base + 50, 44, F("r5", 0.7), INKC, "Patrick Hand", false);
  L.pop(g3, "~50% higher odds of survival", X3 + 160, 370, 64, F("r5", 0.8), L.GREEN, "Caveat", "pop");
  L.sign(g3, "a link, not proof of cause", X3 - 520, 820, 560, 90, S("r6") + 0.1, { size: 52, rot: -3, fill: "#FFFDF6", color: L.GREY });
  const mo3 = mk(g3, "mo", X3 + 800, FL, 0.7, F("r5", 0.4)); mo3.key(0, "pockets", 0).face(0, "neutral").face(F("r5", 0.85), "wow");

  const posters = [{ on: [S("r1") - 0.05, E("r1") + 0.45], shakeAt: F("r1", 0.7), lines: [{ txt: "LESSON #2", y: 260, size: 120, fill: "#9A958C", at: S("r1") }, { txt: "IT REALLY", y: 560, size: 230, at: F("r1", 0.35) }, { txt: "DOES HURT.", y: 840, size: 230, fill: RED, at: F("r1", 0.7), big: true }] },
    { on: [S("r7") - 0.05, K.D + 0.1], shakeAt: F("r7", 0.62), lines: [{ txt: "YOU'RE NOT", y: 330, size: 150, fill: "#9A958C", at: F("r7", 0.08) }, { txt: "BEING DRAMATIC.", y: 520, size: 150, at: F("r7", 0.2) }, { txt: "IT'S A SIGNAL,", y: 760, size: 200, fill: RED, at: F("r7", 0.45), big: true }, { txt: "LIKE HUNGER.", y: 960, size: 160, at: F("r7", 0.62) }] }];
  const shots = [[0, X0, 540, 1.0], [F("r2", 0.35), X0 + 300, 540, 1.1, 1], [S("r3") - 0.4, X1, 520, 1.0], [F("r3", 0.4), X1 - 20, 440, 1.3], [S("r4") - 0.4, X2, 540, 1.0, -1], [S("r5") - 0.4, X3, 540, 1.0], [S("r6") - 0.2, X3 - 200, 640, 1.15]];
  K.run({ shots, posters, punches: [{ t: F("r2", 0.8), z: 1.08 }, { t: F("r4", 0.62), z: 1.1 }, { t: F("r5", 0.8), z: 1.08 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
