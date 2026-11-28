/* Short 8: "8 years alone. 2 words fixed it." — Nami, "help me" (One Piece ep 37); people say yes more than we expect (Flynn & Lake 2008). First frame = cover; loops. */
(function () {
  const K = SHORT({ keys: { two: 1, words: 1, eight: 1, years: 1, alone: 1, killed: 1, help: 1, why: 1, twenty: 1, "20": 1, strangers: 1, ten: 1, "10": 1, no: 1, head: 1 }, noCap: ["a5"], capStyle: "big", capY: 1480, fix: { a1: { 3: "help?", 4: "Neither", 6: "Nami.", 7: "For" }, a6: { 2: "you…" } } });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;
  const icon = (x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, ink); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(ink, g, at, 0.12, { sound: false }); return g; };
  const chest = (x, fl, fillH) => { const g = el("g", {}, ink); el("path", { d: `M${x},${fl - 16} h300 v-160 h-300 z M${x},${fl - 176} q150,-96 300,0`, fill: "#FFFDF6", stroke: "#8A5A2B", "stroke-width": 8, "stroke-linejoin": "round" }, g); const c = el("rect", { x: x + 18, y: fl - 26 - fillH, width: 264, height: fillH, fill: "#F2C230", stroke: INKC, "stroke-width": 5 }, g); return [g, c]; };

  // ---------- B0: the hook, in motion from frame 0 — Luffy puts his hat on a crying Nami ----------
  const Y0 = Y(0), FLc = Y0 + 700;
  N.burst(600, Y0 + 60, 230, 1050); N.hook(Y0, ["CAN'T ASK", 172], ["FOR HELP?", 172], "ONE PIECE");
  const nami0 = mk(ink, "nami", 390, FLc, 2.0, -2); nami0.key(0, "kneel", 0).key(0, { head: 18 }, 0).face(0, "sad").cry(0).acc(0.5, "strawhat").key(0.5, { head: 26 }, 0.2).key(1.5, { head: 2 }, 0.5).acc(S("a5"), "none").key(S("a5"), { head: 18 }, 0);
  const luffy0 = mk(ink, "luffy", 810, FLc, 1.9, -2); luffy0.face(0, "determined").key(0, { aL: 150, eL: 24 }, 0).key(0.12, { aL: 108, eL: -4 }, 0.36).acc(0.5, "none").key(0.9, "stand", 0.4).face(1.6, "grin").acc(S("a5"), "strawhat").face(S("a5"), "determined").key(S("a5"), { aL: 150, eL: 24 }, 0);

  // ---------- B1: buying the village back, alone ----------
  const Y1 = Y(1), FL1 = Y1 + 300; N.floor(Y1);
  L.tx(ink, "8 years", 90, Y1 - 610, 120, S("a2") - 0.1, 0.5); L.pop(ink, "alone.", 560, Y1 - 620, 96, F("a2", 0.4), RED, "Caveat", "slap");
  const arl = el("g", { opacity: 0 }, ink); el("circle", { cx: 850, cy: Y1 - 330, r: 80, fill: "#2A3A4A" }, arl); el("path", { d: `M740,${Y1 - 20} Q720,${Y1 - 230} 850,${Y1 - 250} Q980,${Y1 - 230} 960,${Y1 - 20} Z`, fill: "#2A3A4A" }, arl);
  el("path", { d: `M776,${Y1 - 322} l-112,10 l15,-11 l-9,-10 l17,-7 l-8,-11 l19,-4 l-6,-13 l66,9 z`, fill: "#2A3A4A" }, arl); el("path", { d: `M850,${Y1 - 404} l28,-84 l38,94 z`, fill: "#2A3A4A" }, arl); I.fill(ink, arl, S("a2") + 0.5, 0.3, { sound: "bigslam" });
  I.path(ink, `M80,${Y1 - 20} v-170 l90,-70 l90,70 v170 M330,${Y1 - 20} v-140 l80,-64 l80,64 v140 M540,${Y1 - 20} v-180 l95,-76 l95,76 v180 M0,${Y1 - 20} H1080`, S("a2"), 0.8, { w: 6, color: "#8A847A" });
  N.plate(310, Y1 - 205, "CAT BURGLAR NAMI", S("a2") + 0.15, { size: 54 });
  const nami1 = mk(ink, "nami", 250, FL1, 0.9, S("a2") - 0.2); nami1.face(0, "determined").face(F("a2", 0.6), "sad");
  const [, coins1] = chest(560, FL1, 0); const c1 = el("text", { x: 710, y: FL1 - 250, "text-anchor": "middle", "font-family": "Anton", "font-size": 70, fill: INKC, opacity: 0 }, ink);
  N.ups.push((t) => { const u = ease(clamp((t - S("a2") - 0.4) / (T.a2[1] * 0.5), 0, 1)), h = 124 * u; coins1.setAttribute("height", h.toFixed(1)); coins1.setAttribute("y", (FL1 - 26 - h).toFixed(1)); c1.setAttribute("opacity", t > S("a2") + 0.4 ? 1 : 0); c1.textContent = Math.round(93 * u) + ",000,000"; });
  L.sign(ink, "\"asking gets people killed\"", 410, Y1 - 440, 700, 96, F("a2", 0.62), { size: 50, rot: -3, fill: "#FFFDF6", color: L.GREY });

  // ---------- B2: "help me" — and the hat ----------
  const Y2 = Y(2), FL2 = Y2 + 300; N.floor(Y2);
  L.tx(ink, "episode 37", 90, Y2 - 620, 80, S("a3") - 0.1, 0.5, { color: L.GREY });
  const nami2 = mk(ink, "nami", 360, FL2, 1.05, S("a3") - 0.3); nami2.key(0, "kneel", 0).key(0, { head: 20 }, 0).face(0, "sad").cry(0).key(F("a3", 0.3), { head: -4 }, 0.4).acc(F("a3", 0.62), "strawhat").key(F("a3", 0.66), { head: 12 }, 0.4);
  const luffy = mk(ink, "luffy", 720, FL2, 1.05, S("a3") - 0.2); luffy.face(0, "determined").key(F("a3", 0.52), { aL: 118, eL: -8 }, 0.3).acc(F("a3", 0.62), "none").key(F("a3", 0.74), { aL: 146, eL: -14, aR: -146, eR: 14, head: -8 }, 0.2).face(F("a3", 0.74), "strain");
  N.plate(770, Y2 - 400, "STRAW HAT LUFFY", S("a3") + 0.1, { size: 52, until: W("a3", 6) - 0.25 });
  L.rect(ink, 130, Y2 - 470, 420, 140, W("a3", 6) - 0.1, "#FFFDF6", { rx: 44, sound: "pop" }); L.pop(ink, "help me.", 340, Y2 - 372, 96, W("a3", 6), RED, "Caveat", false);
  L.pop(ink, "OF COURSE I WILL!", 650, Y2 - 545, 78, F("a3", 0.76), RED, "Anton", "bigslam", -3);

  // ---------- B3: guess 20, took about 10 ----------
  const Y3 = Y(3), FL3 = Y3 + 300; N.floor(Y3);
  L.tx(ink, "\"will you fill out a survey?\"", 90, Y3 - 620, 66, F("a4", 0.25), 0.8);
  const kai = mk(ink, "kai", 170, FL3, 0.85, S("a4") - 0.3); kai.face(0, "smile").say("a4").key(F("a4", 0.3), { aR: -80, eR: -10 }, 0.3);
  L.tx(ink, "guess: ask about 20", 340, Y3 - 470, 60, F("a4", 0.42), 0.4, { font: "Patrick Hand", color: L.GREY });
  for (let i = 0; i < 20; i++) icon(350 + (i % 10) * 64, Y3 - 430 + Math.floor(i / 10) * 104, F("a4", 0.45) + i * 0.02, "#D9D4CB", 0.95);
  L.tx(ink, "it took: about 10", 340, Y3 - 160, 60, F("a4", 0.86), 0.4, { font: "Patrick Hand", color: RED });
  for (let i = 0; i < 10; i++) icon(350 + i * 64, Y3 - 120, F("a4", 0.88) + i * 0.03, i % 2 ? "#D9D4CB" : "#7FB069", 0.95);
  L.pop(ink, "5 surveys ✓", 760, Y3 + 90, 70, F("a4", 0.95), L.GREEN, "Caveat", "pop");

  const posters = [{ on: [S("a5") - 0.05, E("a5") + 0.3], shakeAt: F("a5", 0.72), lines: [
    { txt: "THE \"NO\"", x: 90, y: 650, size: 230, at: S("a5") }, { txt: "YOU'RE AFRAID OF", x: 90, y: 840, size: 118, fill: "#9A958C", at: F("a5", 0.28) }, { txt: "IS MOSTLY", x: 90, y: 1030, size: 170, at: F("a5", 0.55) }, { txt: "IN YOUR HEAD.", x: 90, y: 1240, size: 150, fill: RED, at: F("a5", 0.72), big: true }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [0.9, 560, Y0 - 92, 1.13, -1], [2.0, 520, Y0 - 90, 1.1, 1], [S("a2") - 0.35, 540, Y1 - 120, 1.05, 1], [F("a2", 0.6), 500, Y1 - 160, 1.14], [S("a3") - 0.35, 540, Y2 - 120, 1.05, -1], [W("a3", 6) - 0.2, 500, Y2 - 40, 1.25], [F("a3", 0.72), 580, Y2 - 130, 1.1, 1],
    [S("a4") - 0.35, 270, Y3 + 60, 1.6], [F("a4", 0.33), 540, Y3 - 130, 1.05, 1], [F("a4", 0.45), 540, Y3 - 190, 1.06, -1], [F("a4", 0.86), 540, Y3 - 140, 1.1, 1], [S("a6") - 0.25, 540, Y0 - 120, 1.05]];
  K.run({ shots, posters, drift: 0.02, events: [{ type: "bigslam", at: 0.03 }], punches: [{ t: F("a2", 0.4), z: 1.07 }, { t: W("a3", 6), z: 1.08 }, { t: F("a4", 0.95), z: 1.06 }], shakes: [{ t: S("a2") + 0.5, a: 8 }, { t: F("a3", 0.76), a: 14 }], extra: N.tick });
})();
