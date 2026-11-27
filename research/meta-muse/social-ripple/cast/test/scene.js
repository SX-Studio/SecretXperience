/* Cast motion test: Kai's habit (walk in, wave, fist pump, push-ups fast → slow → collapse, skip day), Nia makes the point, crew lineup. */
(function () {
  const K = LONG({ keys: { kai: 1, energy: 1, "20": 1, easy: 1, "5": 1, complaining: 1, skips: 1, quit: 1, missing: 1, erase: 1, social: 1, ripple: 1, crew: 1 }, noCap: [] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const X0 = X(0), g0 = B(0), FL = 900;
  I.path(g0, `M${X0 - 1400},${FL} H${X0 + 1400}`, 0, 0.8, { w: 5, color: "#8A847A", silent: true });

  // ---------- Kai ----------
  const kai = mk(g0, "kai", X0 - 1150, FL, 1.05, 0.0);
  kai.face(0, "smile").move(0.15, X0 - 220, 1.5).key(W("k1", 0), "wave", 0.25).key(W("k1", 0) + 0.9, "stand", 0.3);
  kai.key(W("k1", -1) - 0.1, "fist", 0.2).face(W("k1", -1) - 0.1, "grin");
  // day 1: fast push-ups
  const p1 = S("k2") - 0.15; kai.key(p1, "pushUp", 0.35).face(p1, "grin");
  const fast = []; for (let tt = p1 + 0.4; tt < E("k2") + 0.2; tt += 0.34) fast.push(tt);
  fast.forEach((tt) => kai.key(tt, "pushDown", 0.15).key(tt + 0.17, "pushUp", 0.15));
  // day 9: slow, straining reps, then collapse
  const slow = [S("k3") + 0.1, S("k3") + 1.15]; slow.forEach((tt) => kai.key(tt, "pushDown", 0.45).key(tt + 0.55, "pushUp", 0.45));
  kai.face(S("k3"), "strain"); const col = W("k3", -1) - 0.1; kai.key(col, "flat", 0.35).face(col, "sad");
  // day 10: gets up, skips it
  kai.key(S("k4") + 0.1, "stand", 0.6).key(S("k4") + 0.8, "slump", 0.5).face(S("k4") + 0.8, "sad");
  // Nia's point: he looks up
  kai.key(F("n1", 0.45), "look", 0.4).face(F("n1", 0.45), "wow").key(F("n1", 0.8), "stand", 0.4).face(F("n1", 0.8), "smile");

  // props: day signs, counter, sweat, "ugh", calendar (each in a window group so it leaves on time)
  const win = (a, b) => { const g = el("g", {}, g0); ups.push((t) => g.setAttribute("display", t >= a && t < b ? "inline" : "none")); return g; };
  L.sign(win(0, S("k3") - 0.1), "DAY 1", X0 - 560, 240, 260, 100, S("k2") - 0.1, { font: "Anton", size: 70, rot: -4 });
  L.sign(win(0, S("k4") - 0.1), "DAY 9", X0 - 560, 240, 260, 100, S("k3") - 0.1, { font: "Anton", size: 70, rot: 3, fill: "#FFD9C9" });
  L.sign(g0, "DAY 10", X0 - 560, 240, 290, 100, S("k4") - 0.1, { font: "Anton", size: 70, rot: -3, fill: "#D9D4CB" });
  const cnt = el("text", { x: X0 + 240, y: 420, "text-anchor": "middle", "font-family": "Anton", "font-size": 150, fill: RED, opacity: 0 }, g0);
  ups.push((t) => { let n = 0, max = 0; if (t >= p1 + 0.4 && t < S("k3") - 0.3) { n = fast.filter((tt) => t >= tt + 0.17).length; max = 20; n = Math.min(20, Math.round(n * 20 / fast.length)); }
    else if (t >= S("k3") && t < S("k4")) { n = slow.filter((tt) => t >= tt + 0.55).length + (t >= W("k3", 3) ? 3 : 0); n = Math.min(5, n); max = 5; }
    cnt.setAttribute("opacity", max ? 1 : 0); cnt.textContent = max ? `${n}/${max}` : ""; cnt.setAttribute("fill", max === 5 ? "#8A847A" : RED); });
  [[X0 - 60, 520], [X0 - 20, 560], [X0 - 90, 590]].forEach(([x, y], i) => I.path(win(0, S("k4")), `M${x},${y} q12,20 0,30 q-12,-10 0,-30`, S("k3") + 0.3 + i * 0.4, 0.2, { w: 5, color: L.BLUE, silent: true }));
  L.pop(win(0, S("k4") + 0.2), "ugh…", X0 + 80, 700, 90, col + 0.35, L.GREY, "Caveat", "slap", -6);
  L.calendar(g0, X0 + 120, 250, 5, 2, 110, S("k4") + 0.2, [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i, k) => [i, S("k4") + 0.4 + k * 0.04, L.GREEN]));
  L.pop(g0, "skipped", X0 + 120 + 4 * 110 + 55, 250 + 2 * 110 + 60, 54, W("k4", 3), RED, "Caveat", "pop", -6);
  I.path(g0, `M${X0 + 120 + 4 * 110 + 22},${250 + 110 + 22} l66,66 M${X0 + 120 + 4 * 110 + 88},${250 + 110 + 22} l-66,66`, W("k4", 3), 0.2, { w: 8, color: RED });

  // ---------- Nia ----------
  const nia = mk(g0, "nia", X0 + 1250, FL, 1.0, S("n1") - 1.0);
  nia.face(0, "smile").move(S("n1") - 0.9, X0 + 380, 1.1).say("n1").say("n2").key(F("n1", 0.35), { aL: 92, eL: -8, head: -6 }, 0.3).key(F("n1", 0.95), "stand", 0.3);
  L.sign(g0, "the work still counts ✓", X0 + 380, 230, 520, 100, F("n1", 0.6), { size: 60, fill: "#E3F2D6", color: L.GREEN, rot: 3 });

  // ---------- lineup: the crew ----------
  const X1 = X(1), g1 = B(1); I.path(g1, `M${X1 - 1100},${FL} H${X1 + 1100}`, S("n2") - 0.4, 0.6, { w: 5, color: "#8A847A", silent: true });
  L.tx(g1, "the Social Ripple crew", X1 - 520, 210, 100, S("n2"), 0.8);
  const line = [["nia", -630, "wave", "smile", 0.0], ["kai", -210, "fist", "grin", 0.25], ["mo", 210, "pockets", "neutral", 0.5], ["rue", 630, "cheer", "grin", 0.75]];
  line.forEach(([n, dx, pose, f, d]) => { const h = mk(g1, n, X1 + dx, FL, 0.95, S("n2") + d); h.face(0, f).key(S("n2") + d + 0.3, pose, 0.3); if (n === "nia") h.say("n2");
    L.pop(g1, n[0].toUpperCase() + n.slice(1), X1 + dx, 340, 60, S("n2") + d + 0.35, INKC, "Caveat", false); });

  // ---------- camera: shots + punches ----------
  const shots = [[0, X0 - 300, 540, 1.0], [W("k1", -1) - 0.2, X0 - 240, 520, 1.18, -1.2], [S("k2") - 0.2, X0 - 120, 600, 1.12, 1], [S("k3") - 0.2, X0 - 80, 620, 1.25, -1.5],
    [S("k4") - 0.1, X0 + 40, 560, 1.05], [F("k4", 0.6), X0 - 200, 520, 1.3], [S("n1") - 0.6, X0 + 60, 540, 1.0], [S("n2") - 0.3, X1, 540, 1.0]];
  const punches = [{ t: W("k1", -1), z: 1.12 }, { t: W("k2", 1), z: 1.08 }, { t: col + 0.2, z: 1.15 }, { t: W("n1", 4), z: 1.1 }];
  K.run({ shots, punches, shakes: [{ t: col + 0.3, a: 12 }], events: [{ type: "whoosh", at: 0.2 }, { type: "slam", at: col + 0.3 }, { type: "whoosh", at: S("n1") - 0.9 }].concat(fast.map((tt) => ({ type: "pop", at: tt + 0.15 }))),
    extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
