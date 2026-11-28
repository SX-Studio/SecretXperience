/* Short 7: "One person changed everything" — Iruka and Naruto; the thought loneliness creates is often wrong (Epley & Schroeder 2014); send one message. First frame = cover; loops. */
(function () {
  const K = SHORT({ keys: { one: 1, person: 1, changed: 1, iruka: 1, them: 1, nobody: 1, wrong: 1, stranger: 1, nicer: 1, message: 1, thought: 1 }, fix: { i6: { 0: "Because" } } });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;

  // ---------- B0: the cover — Iruka shields Naruto ----------
  const Y0 = Y(0), FL0 = Y0 + 300; N.floor(Y0); N.hook(Y0, ["ONE PERSON", 170], ["CHANGED EVERYTHING.", 112], "NARUTO");
  el("path", { d: `M700,${Y0 - 220} q-40,-130 110,-140 q60,-100 190,-30 q130,-20 140,110 q100,50 30,150 q-60,60 -180,36 q-130,50 -230,-36 q-110,-20 -60,-90 z`, fill: "#5A5560", stroke: INKC, "stroke-width": 7 }, ink);
  el("path", { d: `M900,${Y0 - 150} l-50,120 l50,0 l-36,110`, fill: "none", stroke: "#F2C230", "stroke-width": 14, "stroke-linecap": "round", "stroke-linejoin": "round" }, ink);
  const nar = mk(ink, "naruto", 250, FL0, 0.82, -2); nar.face(0, "wow").key(0, "look", 0);
  const iru = mk(ink, "iruka", 560, FL0, 1.0, -2); iru.face(0, "determined").key(0, { aL: 100, eL: 0, aR: -100, eR: 0 }, 0);

  // ---------- B1: ignored … then seen ----------
  const Y1 = Y(1), FL1 = Y1 + 300; N.floor(Y1);
  const vil = [130, 300, 800, 960].map((x, i) => person(x, FL1, 0.8, S("i2") - 0.2 + i * 0.04));
  N.ups.push((t) => { const u = ease(clamp((t - F("i2", 0.12)) / 0.6, 0, 1)); vil.forEach((g, i) => g.setAttribute("transform", `translate(${((i < 2 ? -1 : 1) * 90 * u).toFixed(1)},0)`)); });
  const n1 = mk(ink, "naruto", 470, FL1, 0.82, S("i2") - 0.3); n1.face(0, "sad").key(0, "slump", 0).face(F("i2", 0.62), "wow").key(F("i2", 0.62), "look", 0.3).acc(F("i2", 0.86), "band").face(F("i2", 0.88), "grin");
  const i1 = mk(ink, "iruka", 1300, FL1, 1.0, F("i2", 0.4)); i1.view(0, "side", -1).view(F("i2", 0.62), "front").move(F("i2", 0.42), 700, 0.7).face(0, "smile").key(F("i2", 0.7), { aL: 70, eL: -30 }, 0.3);
  L.pop(ink, "one of us.", 540, Y1 - 420, 90, F("i2", 0.84), RED, "Caveat", "pop");

  // ---------- B2: the thought is often wrong ----------
  const Y2 = Y(2), FL2 = Y2 + 300; N.floor(Y2);
  const mo = mk(ink, "mo", 300, FL2, 0.95, S("i3") - 0.3); mo.face(0, "sad").key(0, "slump", 0).face(F("i3", 0.8), "wow").key(F("i3", 0.8), "stand", 0.3);
  L.thought(ink, 640, Y2 - 380, 700, 230, S("i3")); L.pop(ink, "\"nobody wants to", 640, Y2 - 400, 54, F("i3", 0.2), INKC, "Caveat", false); L.pop(ink, "hear from me\"", 640, Y2 - 330, 54, F("i3", 0.3), INKC, "Caveat", false);
  I.path(ink, `M320,${Y2 - 520} L960,${Y2 - 240} M960,${Y2 - 520} L320,${Y2 - 240}`, F("i3", 0.72), 0.3, { w: 14, color: RED, loud: 1.3 });
  L.sign(ink, "often wrong", 720, Y2 - 80, 380, 100, F("i3", 0.82), { size: 64, rot: -4, fill: "#E3F2D6", color: L.GREEN });

  // ---------- B3: the train ----------
  const Y3 = Y(3), FL3 = Y3 + 300; N.floor(Y3);
  el("path", { d: `M-100,${Y3 - 600} H1180 M-100,${Y3 - 560} H1180`, stroke: "#8A847A", "stroke-width": 6, fill: "none" }, ink); [80, 420, 760].forEach((x) => el("rect", { x, y: Y3 - 520, width: 260, height: 190, fill: "none", stroke: "#9CC3D9", "stroke-width": 5 }, ink));
  const m3 = mk(ink, "mo", 360, FL3, 0.95, S("i4") - 0.3); m3.face(0, "neutral").face(F("i4", 0.4), "smile").key(F("i4", 0.3), { aR: -70, eR: -20 }, 0.3);
  const kai = mk(ink, "kai", 740, FL3, 0.95, S("i4") - 0.1); kai.face(0, "neutral").face(F("i4", 0.45), "grin").key(F("i4", 0.45), "wave", 0.3);
  L.sign(ink, "nicer ride ✓", 540, Y3 - 250, 400, 100, F("i4", 0.62), { size: 64, rot: -3, fill: "#E3F2D6", color: L.GREEN });

  // ---------- B4: one message ----------
  const Y4 = Y(4), FL4 = Y4 + 300; N.floor(Y4);
  L.phone(ink, 410, Y4 - 600, S("i5")); L.rect(ink, 432, Y4 - 480, 216, 130, F("i5", 0.45), "#9CC3D9", { rx: 20, sound: "pop" });
  L.pop(ink, "hey, I thought", 540, Y4 - 425, 32, F("i5", 0.48), INKC, "Patrick Hand", false); L.pop(ink, "of you", 540, Y4 - 385, 32, F("i5", 0.5), INKC, "Patrick Hand", false);
  const m4 = mk(ink, "mo", 280, FL4, 0.9, S("i5") - 0.2); m4.face(0, "smile"); const rue = mk(ink, "rue", 800, FL4, 0.9, F("i5", 0.6)); rue.face(0, "grin").key(F("i5", 0.75), "cheer", 0.3);

  const shots = [[0, 540, Y0 - 120, 1.05], [1.2, 500, Y0 - 100, 1.12, -1], [S("i2") - 0.35, 540, Y1 - 120, 1.05, 1], [F("i2", 0.62), 560, Y1 - 60, 1.2], [S("i3") - 0.35, 540, Y2 - 120, 1.05, -1], [F("i3", 0.7), 600, Y2 - 220, 1.15], [S("i4") - 0.35, 540, Y3 - 120, 1.05, 1], [F("i4", 0.55), 540, Y3 - 40, 1.18], [S("i5") - 0.35, 540, Y4 - 120, 1.05], [F("i5", 0.45), 540, Y4 - 300, 1.25, -1], [S("i6") - 0.25, 540, Y0 - 120, 1.05]];
  K.run({ shots, drift: 0.02, glide: 0.45, punches: [{ t: F("i2", 0.86), z: 1.1 }, { t: F("i3", 0.72), z: 1.08 }, { t: F("i5", 0.75), z: 1.06 }], shakes: [{ t: F("i3", 0.72), a: 8 }], extra: N.tick });
})();
