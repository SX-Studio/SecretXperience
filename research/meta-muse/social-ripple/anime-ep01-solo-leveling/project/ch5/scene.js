/* Solo Leveling ep, ch5: Lesson 3 — make progress visible (Amabile & Kramer 2011). */
(function () {
  const K = LONG({ keys: { visible: 1, numbers: 1, strength: 1, stats: 1, stronger: 1, twelve: 1, thousand: 1, diary: 1, best: 1, progress: 1, meaningful: 1, small: 1, step: 1, work: 1, habits: 1, status: 1, window: 1, streak: 1, calendar: 1 }, noCap: ["e1"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp } = K, L = LIB(K), C = CHAR(K), F = (i, f) => S(i) + f * T[i][1], ch = [], ups = [];
  const fig = (...a) => { const h = C.draw(...a); ch.push(h); return h; };

  // ---------- B0: the numbers go up ----------
  const X0 = X(0), g0 = B(0);
  const j0 = fig(g0, "jinwoo", X0 - 580, 950, 1.05, S("e2") - 0.3, { mood: "neutral" }); j0.setMood(F("e2", 0.55), "smile");
  const st = C.system(g0, X0 - 220, 220, 820, ["STR   10", "AGI   10", "LEVEL   1"], F("e2", 0.3), { title: "[ STATUS ]", rowTimes: [F("e2", 0.35), F("e2", 0.38), F("e2", 0.41)] });
  const nums = [[0, 10, 34, F("e2", 0.5)], [1, 10, 22, F("e2", 0.65)], [2, 1, 12, F("e2", 0.75)]];
  ups.push((t) => nums.forEach(([i, a, b, at]) => { const u = clamp((t - at) / 1.6, 0, 1), v = Math.round(a + (b - a) * u); st.rowEls[i].textContent = ["STR   ", "AGI   ", "LEVEL   "][i] + v + (u > 0 && u < 1 ? "  ▲" : ""); }));
  L.pop(g0, "he can SEE it", X0 + 190, 860, 90, F("e2", 0.85), RED, "Caveat", "slap", -3);

  // ---------- B1: 12,000 diary entries; best days = progress ----------
  const X1 = X(1), g1 = B(1);
  L.tx(g1, "nearly 12,000 diary entries", X1 - 820, 160, 96, S("e3") - 0.1, 0.9);
  for (let i = 0; i < 7; i++) L.rect(g1, X1 - 800 + i * 12, 640 - i * 40, 280, 54, F("e3", 0.15) + i * 0.05, "#FFFDF6", { rx: 4, sound: i ? false : "swish" });
  for (let i = 0; i < 14; i++) { const x = X1 - 380 + (i % 7) * 64, y = 420 + Math.floor(i / 7) * 120, at = F("e3", 0.6) + i * 0.025; I.circle(g1, x, y, 20, at, 0.1, { w: 4, silent: i > 0 }); I.path(g1, `M${x},${y + 20} v46`, at + 0.03, 0.08, { w: 4, silent: true }); }
  L.pop(g1, "238 professionals", X1 - 180, 760, 64, F("e3", 0.7), INKC, "Anton", false);
  I.circle(g1, X1 + 520, 380, 110, S("e4"), 0.4, { w: 9, color: "#E0A030" }); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; I.path(g1, `M${X1 + 520 + Math.cos(a) * 140},${380 + Math.sin(a) * 140} l${Math.cos(a) * 50},${Math.sin(a) * 50}`, S("e4") + 0.2 + i * 0.03, 0.1, { w: 7, color: "#E0A030", silent: true }); }
  L.pop(g1, "best days", X1 + 520, 600, 70, F("e4", 0.2), INKC, "Caveat", false);
  L.sign(g1, "made progress ✓", X1 + 520, 730, 460, 100, F("e4", 0.55), { size: 64, rot: -3, fill: "#E3F2D6", color: L.GREEN });
  L.pop(g1, "(even a small step)", X1 + 520, 860, 54, F("e4", 0.85), L.GREY, "Patrick Hand", false);

  // ---------- B2: honest caveat ----------
  const X2 = X(2), g2 = B(2);
  L.box(g2, X2 - 600, 260, 1200, 420, S("e5"), { w: 6, color: L.GREY });
  L.pop(g2, "fine print", X2, 360, 80, S("e5") + 0.2, L.GREY, "Caveat", false);
  L.pop(g2, "from their book and articles", X2, 470, 60, F("e5", 0.25), INKC, "Patrick Hand", false);
  L.pop(g2, "about work, not habits", X2, 560, 60, F("e5", 0.45), INKC, "Patrick Hand", false);
  L.pop(g2, "but the idea travels →", X2 + 120, 800, 84, F("e5", 0.75), RED, "Caveat", false);

  // ---------- B3: make your own status window ----------
  const X3 = X(3), g3 = B(3);
  L.tx(g3, "make your own status window", X3 - 820, 160, 96, S("e6") - 0.1, 0.9);
  L.calendar(g3, X3 - 800, 260, 7, 4, 110, F("e6", 0.3), [...Array(18)].map((_, i) => [i, F("e6", 0.38) + i * 0.06]));
  L.phone(g3, X3 + 80, 250, F("e6", 0.55)); L.pop(g3, "streak:", X3 + 210, 400, 50, F("e6", 0.6), INKC, "Patrick Hand", false); L.pop(g3, "18 days", X3 + 210, 480, 60, F("e6", 0.63), RED, "Anton", false);
  fig(g3, "you", X3 + 640, 950, 1.0, F("e6", 0.7), { mood: "grin", pose: "fist", look: { hair: "#3B2A20", style: "spiky", top: "#5D4BE0", pants: "#2A2A30" } });

  const posters = [{ on: [S("e1") - 0.05, E("e1") + 0.45], slashAt: W("e1", -1), shakeAt: W("e1", -1), lines: [
    { txt: "LESSON #3", y: 260, size: 120, fill: "#9A958C", at: S("e1") }, { txt: "MAKE PROGRESS", y: 560, size: 210, at: F("e1", 0.45) }, { txt: "VISIBLE.", y: 860, size: 280, fill: RED, at: W("e1", -1), big: true }] }];
  const shots = [[0, X0, 540, 1], [S("e3") - 0.4, X1, 540, 1], [S("e5") - 0.4, X2, 540, 1], [S("e6") - 0.4, X3, 540, 1]];
  K.run({ shots, posters, extra(t) { ch.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
