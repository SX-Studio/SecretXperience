/* Short 10: "They're waiting for you to ask." — helpers can't see how hard asking is (Bohns & Flynn 2010); Nami and Robin both had to say the words. First frame = cover; loops. */
(function () {
  const K = SHORT({ keys: { help: 1, hard: 1, ask: 1, village: 1, knew: 1, crew: 1, words: 1, advisors: 1, thirteen: 1, "13": 1, eight: 1, wait: 1, nothing: 1, door: 1, open: 1, knock: 1, noticed: 1 }, noCap: ["c5"], capStyle: "big", capY: 1480, fix: { c1: { 3: "noticed?", 4: "The" }, c6: { 2: "you're…" } } });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;
  const icon = (x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, ink); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(ink, g, at, 0.12, { sound: false }); return g; };
  const door = (cx, fl) => { el("path", { d: `M${cx - 105},${fl} V${fl - 600} H${cx + 105} V${fl}`, fill: "#FFFDF6", stroke: "#8A5A2B", "stroke-width": 11, "stroke-linejoin": "round" }, ink); el("circle", { cx: cx + 66, cy: fl - 280, r: 13, fill: INKC }, ink); };

  // ---------- B0: the hook, in motion from frame 0 — Nami can't knock; Luffy is waiting on the other side ----------
  const Y0 = Y(0), FLc = Y0 + 640; N.hook2(Y0, ["WAITING TO", 196], ["BE NOTICED?", 172], "ONE PIECE", 230);
  el("path", { d: `M375,${FLc} V${FLc - 880} H660 V${FLc}`, fill: "#FFFDF6", stroke: "#8A5A2B", "stroke-width": 14, "stroke-linejoin": "round" }, ink); el("circle", { cx: 612, cy: FLc - 400, r: 18, fill: INKC }, ink);
  const nami0 = mk(ink, "nami", 200, FLc, 1.6, -2); nami0.face(0, "sad").key(0, { aR: -100, eR: -80, head: 10 }, 0).key(0.1, { aR: -134, eR: -60, head: 2 }, 0.4).key(0.9, { aR: -120, eR: -70, head: 6 }, 0.3).key(1.7, { aR: -96, eR: -84, head: 16 }, 0.6).key(S("c5"), { aR: -100, eR: -80, head: 10 }, 0);
  const luffy0 = mk(ink, "luffy", 850, FLc, 1.6, -2); luffy0.key(0, "arms", 0).face(0, "smile").key(0.6, { head: -8 }, 0.4).key(1.8, { head: 6 }, 0.5).key(S("c5"), { head: 0 }, 0);

  // ---------- B1: they knew — but both had to say it ----------
  const Y1 = Y(1), FL1 = Y1 + 300; N.floor(Y1);
  I.path(ink, `M540,${Y1 - 560} V${FL1}`, S("c2"), 0.4, { w: 4, color: "#8A847A", attrs: { "stroke-dasharray": "14 12" } });
  [50, 140].forEach((x, i) => person(x, FL1, 0.62, S("c2") + i * 0.06)); const nami = mk(ink, "nami", 340, FL1, 0.92, S("c2") - 0.2); nami.acc(0, "strawhat").face(0, "sad").face(F("c2", 0.84), "smile");
  L.pop(ink, "the village knew", 250, Y1 - 205, 50, F("c2", 0.12), L.GREY, "Patrick Hand", false);
  [940, 1030].forEach((x, i) => person(x, FL1, 0.62, F("c2", 0.36) + i * 0.06)); const robin = mk(ink, "robin", 760, FL1, 0.92, F("c2", 0.36)); robin.face(0, "sad").face(F("c2", 0.9), "smile");
  L.pop(ink, "the crew came", 820, Y1 - 205, 50, F("c2", 0.45), L.GREY, "Patrick Hand", false);
  L.rect(ink, 100, Y1 - 440, 330, 120, F("c2", 0.8), "#FFFDF6", { rx: 40, sound: "pop" }); L.pop(ink, "help me.", 265, Y1 - 358, 78, F("c2", 0.82), RED, "Caveat", false);
  L.rect(ink, 560, Y1 - 440, 440, 120, F("c2", 0.9), "#FFFDF6", { rx: 40, sound: "pop" }); L.pop(ink, "I want to live!", 780, Y1 - 358, 68, F("c2", 0.92), RED, "Caveat", false);

  // ---------- B2: expected 13, fewer than 8 came ----------
  const Y2 = Y(2), FL2 = Y2 + 300; N.floor(Y2);
  const nia = mk(ink, "nia", 170, FL2, 0.85, S("c3") - 0.3); nia.face(0, "smile").say("c3").key(F("c3", 0.3), { aR: -110, eR: 0 }, 0.3).key(F("c3", 0.8), "think", 0.4);
  L.sign(ink, "HELP DESK", 250, Y2 - 620, 380, 100, S("c3"), { font: "Anton", size: 64, rot: -3 });
  L.tx(ink, "expected: about 13", 330, Y2 - 460, 60, F("c3", 0.4), 0.4, { font: "Patrick Hand", color: L.GREY });
  for (let i = 0; i < 13; i++) icon(350 + (i % 7) * 88, Y2 - 420 + Math.floor(i / 7) * 108, F("c3", 0.42) + i * 0.03, "#D9D4CB", 1.0);
  L.tx(ink, "came: fewer than 8", 330, Y2 - 150, 60, F("c3", 0.8), 0.4, { font: "Patrick Hand", color: RED });
  for (let i = 0; i < 7; i++) icon(350 + i * 88, Y2 - 110, F("c3", 0.82) + i * 0.04, "#7FB069", 1.0);

  // ---------- B3: both sides waiting ----------
  const Y3 = Y(3), FL3 = Y3 + 300; N.floor(Y3); const dg = el("g", { opacity: 0 }, ink); { const cx = 540, fl = FL3; el("path", { d: `M${cx - 105},${fl} V${fl - 600} H${cx + 105} V${fl}`, fill: "#FFFDF6", stroke: "#8A5A2B", "stroke-width": 11, "stroke-linejoin": "round" }, dg); el("circle", { cx: cx + 66, cy: fl - 280, r: 13, fill: INKC }, dg); } I.fill(ink, dg, S("c4") - 0.2, 0.3, { sound: "pop" });
  const rue = mk(ink, "rue", 850, FL3, 0.95, S("c4") + 0.05); rue.face(0, "smile").face(F("c4", 0.6), "neutral").key(F("c4", 0.3), "think", 0.4);
  const mo = mk(ink, "mo", 230, FL3, 0.95, S("c4") - 0.1); mo.face(0, "sad").key(F("c4", 0.12), { aR: -118, eR: -70 }, 0.4).key(F("c4", 0.42), "pockets", 0.4);
  L.pop(ink, "…", 850, FL3 - 470, 130, F("c4", 0.3), L.GREY, "Caveat", false); L.pop(ink, "…", 230, FL3 - 470, 130, F("c4", 0.55), L.GREY, "Caveat", false);
  I.circle(ink, 540, FL3 - 720, 76, F("c4", 0.5), 0.3, { w: 7 }); const hand = el("line", { x1: 540, y1: FL3 - 720, x2: 540, y2: FL3 - 780, stroke: RED, "stroke-width": 7, "stroke-linecap": "round", opacity: 0 }, ink);
  N.ups.push((t) => { hand.setAttribute("opacity", t > F("c4", 0.56) ? 1 : 0); const a = (t * 220 - 90) * Math.PI / 180; hand.setAttribute("x2", (540 + Math.cos(a) * 58).toFixed(1)); hand.setAttribute("y2", (FL3 - 720 + Math.sin(a) * 58).toFixed(1)); });

  const posters = [{ on: [S("c5") - 0.05, E("c5") + 0.3], shakeAt: F("c5", 0.78), lines: [
    { txt: "THE DOOR IS", x: 90, y: 640, size: 170, at: S("c5") }, { txt: "USUALLY OPEN.", x: 90, y: 840, size: 148, fill: "#9A958C", at: F("c5", 0.25) }, { txt: "SOMEONE HAS", x: 90, y: 1060, size: 160, fill: RED, at: F("c5", 0.6) }, { txt: "TO KNOCK.", x: 90, y: 1270, size: 210, fill: RED, at: F("c5", 0.78), big: true }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [0.9, 515, Y0 - 92, 1.12, -1], [2.2, 600, Y0 - 80, 1.1, 1], [S("c2") - 0.35, 340, Y1 - 20, 1.35, 1], [F("c2", 0.34), 540, Y1 - 100, 1.05, -1], [F("c2", 0.78), 540, Y1 - 110, 1.1], [S("c3") - 0.35, 540, Y2 - 120, 1.05, 1], [F("c3", 0.42), 540, Y2 - 180, 1.08], [F("c3", 0.8), 540, Y2 - 120, 1.12, -1],
    [S("c4") - 0.35, 540, Y3 - 120, 1.05], [F("c4", 0.5), 540, Y3 - 170, 1.1, 1], [S("c6") - 0.25, 540, Y0 - 120, 1.05]];
  K.run({ shots, posters, drift: 0.02, events: [{ type: "bigslam", at: 0.03 }], punches: [{ t: F("c2", 0.82), z: 1.07 }, { t: F("c3", 0.82), z: 1.07 }, { t: F("c4", 0.56), z: 1.05 }], extra: N.tick });
})();
