/* Short 11: "You can't stop comparing." — the scouter (DBZ ep 28) and social comparison (Festinger 1954, theory; Gerber, Wheeler & Suls 2018).
   Rulebook: spoken hook = slab text at frame 0, open loop ("the reason isn't weakness") answered at the end, no exit phrases, last sentence runs into the first. */
(function () {
  const K = SHORT({ keys: { comparing: 1, vegeta: 1, episodes: 1, weakness: 1, scouter: 1, number: 1, crushed: 1, ruler: 1, level: 1, up: 1, smaller: 1, flaw: 1, measurement: 1 }, noCap: ["d6"], capStyle: "big", capY: 1480 });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;
  const icon = (x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, ink); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(ink, g, at, 0.12, { sound: false }); return g; };
  const tR = W("d6", -5);

  // ---------- B0: the cover, moving from frame 0 — Vegeta reads a number he doesn't like ----------
  const Y0 = Y(0), FLc = Y0 + 700; N.burst(330, Y0 + 60, 240, 1050); N.hook(Y0, ["YOU CAN'T STOP", 140], ["COMPARING.", 176], "DRAGON BALL Z");
  const v0 = mk(ink, "vegetaArmor", 330, FLc, 1.55, -2); v0.key(0, "arms", 0).face(0, "smirk").face(0.9, "wow").face(1.9, "strain").key(1.9, { head: 8 }, 0.3).face(S("d6"), "smirk").key(S("d6"), { head: 0 }, 0);
  el("path", { d: `M600,${Y0 - 150} h400 q20,0 20,20 v220 q0,20 -20,20 h-400 q-20,0 -20,-20 v-220 q0,-20 20,-20 z`, fill: "#FFFDF6", stroke: INKC, "stroke-width": 8 }, ink); el("path", { d: `M580,${Y0 - 20} L470,${Y0 - 60}`, stroke: "#E0567A", "stroke-width": 6 }, ink);
  const pl = el("text", { x: 800, y: Y0 - 90, "text-anchor": "middle", "font-family": "Patrick Hand", "font-size": 46, fill: "#6B6359" }, ink); pl.textContent = "POWER LEVEL";
  const n0 = el("text", { x: 800, y: Y0 + 60, "text-anchor": "middle", "font-family": "Anton", "font-size": 130, fill: "#C62F2A" }, ink);
  N.ups.push((t) => { const tt = t >= tR - 0.6 ? 0 : t, u = ease(clamp(tt / 1.1, 0, 1)); n0.textContent = u >= 1 ? "9,000+" : Math.round(4200 + 4800 * u).toLocaleString("en-US"); });
  N.plate(650, Y0 + 230, "PRINCE OF ALL SAIYANS", S("d2") + 0.1, { size: 40, until: S("d3") - 0.2 });

  // ---------- B1: the scouter ----------
  const Y1 = Y(1), FL1 = Y1 + 300; N.floor(Y1);
  L.tx(ink, "episode 28", 90, Y1 - 700, 64, S("d3") - 0.1, 0.4, { color: L.GREY });
  const au = L.aura(ink, 810, FL1 + 10, 400, 700, "#9CD3F5", F("d3", 0.52)); N.ups.push(au.update);
  const tC = F("d3", 0.84), v1 = mk(ink, "vegetaArmor", 250, FL1, 0.85, S("d3") - 0.3); v1.face(0, "smirk").face(F("d3", 0.62), "wow").face(F("d3", 0.74), "strain").acc(tC, "none").key(tC - 0.1, { aR: -64, eR: -104 }, 0.25);
  const g1 = mk(ink, "gokuSaiyan", 810, FL1, 0.82, S("d3") - 0.2); g1.face(0, "determined").key(F("d3", 0.52), { aL: 34, eL: -84, aR: -34, eR: 84, head: -4 }, 0.3).face(F("d3", 0.52), "strain");
  L.box(ink, 240, Y1 - 640, 600, 220, S("d3") + 0.1); L.pop(ink, "POWER LEVEL", 540, Y1 - 580, 44, S("d3") + 0.2, L.GREY, "Patrick Hand", false);
  const n1 = el("text", { x: 540, y: Y1 - 455, "text-anchor": "middle", "font-family": "Anton", "font-size": 116, fill: "#C62F2A", opacity: 0 }, ink);
  N.ups.push((t) => { const u = ease(clamp((t - F("d3", 0.5)) / (T.d3[1] * 0.18), 0, 1)); n1.setAttribute("opacity", t >= F("d3", 0.22) ? 1 : 0); n1.textContent = t >= tC ? "- - - -" : (u >= 1 ? "9,000+" : Math.round(1200 + 7800 * u).toLocaleString("en-US")); });
  L.pop(ink, "IT'S OVER 9000!", 540, Y1 - 300, 104, F("d3", 0.7), RED, "Anton", "bigslam", -3); L.pop(ink, "(English dub. Original: 8,000)", 590, Y1 - 240, 38, F("d3", 0.76), L.GREY, "Patrick Hand", false);
  for (let i = 0; i < 6; i++) { const a = (-150 + i * 34) * Math.PI / 180; I.path(ink, `M${335 + Math.cos(a) * 40},${Y1 + 30 + Math.sin(a) * 40} l${Math.cos(a) * 48},${Math.sin(a) * 48}`, tC + i * 0.02, 0.12, { w: 7, color: "#E0567A", silent: i > 0 }); }

  // ---------- B2: no ruler, so we use each other ----------
  const Y2 = Y(2), FL2 = Y2 + 300; N.floor(Y2);
  L.sign(ink, "a classic theory · Festinger, 1954", 540, Y2 - 640, 800, 90, S("d4") + 0.1, { size: 46, rot: -2, fill: "#FFFDF6", color: L.GREY });
  const kai = mk(ink, "kai", 240, FL2, 0.85, S("d4") - 0.3); kai.face(0, "neutral").key(F("d4", 0.2), "think", 0.3).face(F("d4", 0.58), "wow").key(F("d4", 0.58), "look", 0.3);
  const qw = N.win(0, F("d4", 0.62)); L.pop(qw, "how good am I?", 330, Y2 - 300, 64, F("d4", 0.18), INKC, "Caveat", false);
  I.path(qw, `M520,${Y2 - 260} h360 v70 h-360 z M580,${Y2 - 260} v30 M640,${Y2 - 260} v30 M700,${Y2 - 260} v30 M760,${Y2 - 260} v30 M820,${Y2 - 260} v30`, F("d4", 0.34), 0.3, { w: 6 }); I.path(qw, `M500,${Y2 - 300} L900,${Y2 - 150} M900,${Y2 - 300} L500,${Y2 - 150}`, F("d4", 0.44), 0.25, { w: 10, color: RED }); L.pop(qw, "no ruler", 700, Y2 - 100, 56, F("d4", 0.46), RED, "Caveat", false);
  const rue = mk(ink, "rue", 560, FL2, 0.85, F("d4", 0.6)); rue.face(0, "smile"); const mo = mk(ink, "mo", 850, FL2, 0.85, F("d4", 0.66)); mo.face(0, "neutral");
  I.path(ink, `M130,${Y2 - 124} H960`, F("d4", 0.72), 0.4, { w: 6, color: L.BLUE, attrs: { "stroke-dasharray": "16 12" } }); L.pop(ink, "people close to our level", 560, Y2 - 180, 58, F("d4", 0.8), L.BLUE, "Caveat", "pop");

  // ---------- B3: we look up ----------
  const Y3 = Y(3), FL3 = Y3 + 300; N.floor(Y3);
  L.pop(ink, "60 years of experiments", 540, Y3 - 640, 56, S("d5") + 0.2, L.GREY, "Patrick Hand", false);
  for (let i = 0; i < 4; i++) { I.path(ink, `M${420 + i * 150},${FL3 - i * 150} h150 v-150`, S("d5") + i * 0.07, 0.2, { w: 7, color: "#8A847A", silent: i > 0 }); if (i) icon(495 + i * 150, FL3 - i * 150 - 96, F("d5", 0.3) + i * 0.08, ["", "#D9D4CB", "#C9E2B8", "#F2C230"][i], 1.05); }
  const mW = el("g", {}, ink), m3 = mk(mW, "mo", 220, FL3, 0.95, S("d5") - 0.3); m3.face(0, "neutral").key(F("d5", 0.4), "look", 0.3).key(F("d5", 0.4), { head: -18 }, 0.3).face(F("d5", 0.76), "sad").key(F("d5", 0.76), "slump", 0.4);
  N.ups.push((t) => { const u = ease(clamp((t - F("d5", 0.76)) / 0.6, 0, 1)); mW.setAttribute("transform", `translate(220,${FL3}) scale(${(1 - 0.22 * u).toFixed(3)}) translate(-220,${-FL3})`); });
  L.arrow(ink, 330, Y3 - 60, 900, Y3 - 420, F("d5", 0.42), { w: 8, color: RED }); L.pop(ink, "we look up", 540, Y3 - 330, 70, F("d5", 0.46), RED, "Caveat", "pop", -28); L.pop(ink, "…and feel smaller", 340, Y3 - 220, 58, F("d5", 0.8), INKC, "Caveat", false);

  const posters = [{ on: [S("d6") - 0.05, tR - 0.05], shakeAt: W("d6", 8), lines: [
    { txt: "THAT ISN'T", x: 90, y: 640, size: 190, at: W("d6", 0) }, { txt: "A FLAW.", x: 90, y: 860, size: 230, fill: "#9A958C", at: W("d6", 2) }, { txt: "IT'S YOUR MIND TAKING", x: 90, y: 1050, size: 92, at: W("d6", 4) }, { txt: "A MEASUREMENT.", x: 90, y: 1230, size: 138, fill: RED, at: W("d6", 8), big: true }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [0.8, 560, Y0 - 98, 1.1, -1], [S("d2"), 500, Y0 - 110, 1.06, 1], [F("d2", 0.55), 580, Y0 - 96, 1.1, -1],
    [S("d3") - 0.3, 540, Y1 - 120, 1.05], [F("d3", 0.18), 440, Y1 - 220, 1.2, -1], [F("d3", 0.5), 560, Y1 - 120, 1.1, 1], [F("d3", 0.68), 540, Y1 - 150, 1.06], [tC - 0.1, 340, Y1 - 20, 1.4, -1],
    [S("d4") - 0.3, 540, Y2 - 120, 1.05], [F("d4", 0.12), 400, Y2 - 80, 1.25, 1], [F("d4", 0.58), 540, Y2 - 100, 1.08, -1], [F("d4", 0.8), 560, Y2 - 60, 1.14, 1],
    [S("d5") - 0.3, 540, Y3 - 120, 1.05], [F("d5", 0.4), 620, Y3 - 220, 1.15, 1], [F("d5", 0.76), 320, Y3 - 20, 1.3, -1], [tR - 0.6, 540, Y0 - 120, 1.05]];
  K.run({ shots, posters, drift: 0.02, events: [{ type: "bigslam", at: 0.03 }], punches: [{ t: F("d3", 0.7), z: 1.1 }, { t: F("d4", 0.44), z: 1.06 }, { t: F("d5", 0.46), z: 1.06 }], shakes: [{ t: F("d3", 0.7), a: 16 }, { t: tC, a: 10 }], extra: N.tick });
})();
