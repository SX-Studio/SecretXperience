/* Short 4: "21 days to form a habit is a myth" (Maltz 1960; Lally et al. 2010) — Solo Leveling tie-in. */
(function () {
  const K = SHORT({ keys: { myth: 1, "1960": 1, minimum: 1, "21": 1, twenty: 1, one: 0, london: 1, "66": 1, sixty: 1, six: 1, "18": 1, eighteen: 1, "254": 1, failing: 1, showing: 1, quest: 1, channel: 1 }, noCap: ["s3"] });
  const { S, E, W, T, I, Y, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CHAR(K), F = (i, f) => S(i) + f * T[i][1], ch = [];
  const fig = (...a) => { const h = C.draw(...a); ch.push(h); return h; };

  // ---------- B0: 21 days? myth ----------
  const Y0 = Y(0);
  L.tx(ink(), "21 days to form a habit?", 110, Y0 - 600, 84, 0.0, 0.8);
  function ink() { return K.ink; }
  L.calendar(K.ink, 225, Y0 - 530, 7, 3, 90, 0.15, [...Array(21)].map((_, i) => [i, 0.4 + i * 0.05, L.GREEN]));
  const j0 = fig(K.ink, "jinwoo", 300, Y0 + 300, 0.82, 0.3, { mood: "neutral" }); j0.setMood(F("s1", 0.6), "serious");
  L.sign(K.ink, "MYTH", 760, Y0 + 20, 300, 130, F("s1", 0.75), { font: "Anton", size: 100, fill: "#FFFDF6", color: RED, rot: -10 });

  // ---------- B1: 1960 self-help book ----------
  const Y1 = Y(1);
  L.rect(K.ink, 110, Y1 - 560, 300, 400, F("s2", 0.05), "#C9A66B", { rx: 6 }); L.pop(K.ink, "SELF-HELP", 260, Y1 - 420, 56, F("s2", 0.1), INKC, "Anton", false); L.pop(K.ink, "1960", 260, Y1 - 300, 90, F("s2", 0.12), RED, "Anton", false);
  fig(K.ink, "surgeon", 760, Y1 - 120, 0.62, F("s2", 0.3), { mood: "smile", look: { hair: "#6B6359", top: "#F4F4F0", pants: "#4A4F5A", collar: "#9CC3D9" } });
  L.pop(K.ink, "a plastic surgeon", 760, Y1 - 470, 50, F("s2", 0.32), L.GREY, "Patrick Hand", false);
  L.tx(K.ink, "\"a minimum of about", 110, Y1 + 30, 74, F("s2", 0.6), 0.7); L.tx(K.ink, "21 days\"", 110, Y1 + 150, 110, F("s2", 0.72), 0.5, { color: RED });
  L.pop(K.ink, "…for a self-image to change", 600, Y1 + 260, 50, F("s2", 0.85), L.GREY, "Patrick Hand", false);

  // ---------- B2: the range ----------
  const Y2 = Y(2), ax = (d) => 120 + d * 3.3;
  L.tx(K.ink, "days until it felt automatic", 110, Y2 - 600, 70, S("s4") - 0.6, 0.8);
  I.path(K.ink, `M${ax(0)},${Y2 + 100} H${ax(260)}`, S("s4") - 0.4, 0.4, { w: 7 });
  [0, 100, 200].forEach((d, i) => L.pop(K.ink, String(d), ax(d), Y2 + 160, 40, S("s4") - 0.3 + i * 0.05, L.GREY, "Anton", false));
  I.path(K.ink, `M${ax(66)},${Y2 + 100} V${Y2 - 300}`, S("s4") - 0.3, 0.3, { w: 10, color: RED }); L.pop(K.ink, "66", ax(66), Y2 - 330, 120, S("s4") - 0.2, RED, "Anton", false);
  I.path(K.ink, `M${ax(18)},${Y2 - 20} H${ax(254)}`, F("s4", 0.2), 0.8, { w: 8, color: L.GREY, attrs: { "stroke-dasharray": "18 12" } });
  L.pop(K.ink, "18", ax(18), Y2 - 60, 80, F("s4", 0.25), L.GREEN, "Anton", "pop"); L.pop(K.ink, "254", ax(254) - 20, Y2 - 60, 80, F("s4", 0.75), INKC, "Anton", "pop");
  L.pop(K.ink, "(estimated)", ax(254) - 40, Y2 + 30, 40, F("s4", 0.8), L.GREY, "Patrick Hand", false);

  // ---------- B3: keep showing up ----------
  const Y3 = Y(3);
  const j3 = fig(K.ink, "jinwoo", 280, Y3 + 300, 0.85, S("s5") - 0.3, { mood: "sad" }); j3.setMood(F("s5", 0.5), "serious"); j3.setGlow(F("s5", 0.6), true);
  L.tx(K.ink, "3 weeks in, still hard?", 110, Y3 - 600, 76, S("s5"), 0.8);
  L.sign(K.ink, "not failing.", 700, Y3 - 430, 380, 100, F("s5", 0.35), { size: 66, rot: 4, fill: "#E3F2D6", color: L.GREEN });
  C.system(K.ink, 520, Y3 - 280, 500, ["Show up.", "Again."], F("s5", 0.65), { rowTimes: [F("s5", 0.78), F("s5", 0.9)] });

  // ---------- B4: full video ----------
  const Y4 = Y(4);
  fig(K.ink, "jinwoo", 540, Y4 + 300, 0.85, S("s6") - 0.3, { mood: "smile", glow: true, daggers: true });
  L.tx(K.ink, "full breakdown on the channel", 110, Y4 - 600, 66, S("s6"), 0.8); L.arrow(K.ink, 540, Y4 - 520, 800, Y4 - 440, F("s6", 0.6), { w: 8, color: RED });

  const posters = [{ on: [S("s3") - 0.05, E("s3") + 0.35], shakeAt: W("s3", -2), lines: [
    { txt: "THEY TRACKED IT.", x: 90, y: 560, size: 120, fill: "#9A958C", at: S("s3") + 0.1 },
    { txt: "MIDDLE POINT:", x: 90, y: 800, size: 150, at: F("s3", 0.6) },
    { txt: "66", x: 90, y: 1180, size: 420, fill: RED, at: W("s3", -2), big: true },
    { txt: "DAYS.", x: 600, y: 1180, size: 200, at: W("s3", -1) }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [S("s2") - 0.4, 540, Y1 - 120, 1.05], [S("s3"), 540, Y2 - 120, 1.05], [S("s5") - 0.4, 540, Y3 - 120, 1.05], [S("s6") - 0.4, 540, Y4 - 120, 1.05]];
  K.run({ shots, posters, extra(t) { ch.forEach((h) => h.update(t)); } });
})();
