/* Short 12: "Better, or bitter?" — a rival can push you or poison you: Super Saiyan Vegeta (ep 129) and Majin Vegeta (eps 228–229);
   Kilduff 2014 (soft wording) and Kilduff, Galinsky, Gallo & Reade 2016. Rulebook: hook = slab text, open loop ("one thing you want") answered by the last line, loops with no bridge. */
(function () {
  const K = SHORT({ keys: { rival: 1, better: 1, bitter: 1, want: 1, vegeta: 1, saiyan: 1, push: 1, faster: 1, spell: 1, purpose: 1, poison: 1, lie: 1, four: 1, climb: 1, fall: 1 }, noCap: ["e5"], capStyle: "big", capY: 1480, fix: { e3: { 0: "Vegeta" } } });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;
  const flash = (cx, cy, at, r = 520) => { const c = el("circle", { cx, cy, r: 10, fill: "#FFFDF0", opacity: 0 }, ink); N.ups.push((t) => { const u = clamp((t - at) / 0.5, 0, 1); c.setAttribute("opacity", u > 0 && u < 1 ? (1 - u) * 0.95 : 0); c.setAttribute("r", (40 + r * u).toFixed(0)); }); };

  // ---------- B0: the cover, moving from frame 0 — the same Vegeta, twice ----------
  const Y0 = Y(0), FLc = Y0 + 700; N.burst(540, Y0 + 80, 260, 1050); N.hook(Y0, ["BETTER,", 190], ["OR BITTER?", 172], "DRAGON BALL Z");
  el("path", { d: `M540,${Y0 - 320} V${FLc}`, stroke: "#8A847A", "stroke-width": 5, "stroke-dasharray": "16 14" }, ink);
  const aL = L.aura(ink, 290, FLc + 10, 440, 920, "#F7D54A", -5); N.ups.push(aL.update); const aR = L.aura(ink, 790, FLc + 10, 440, 920, "#B05AD0", -5); N.ups.push(aR.update);
  const vL = mk(ink, "vegetaCellSSJ", 290, FLc, 1.4, -2); vL.key(0, "arms", 0).face(0, "smirk").key(0.25, "fist", 0.3).key(1.6, "arms", 0.4).key(S("e5"), "arms", 0);
  const vR = mk(ink, "vegetaMajin", 790, FLc, 1.4, -2); vR.key(0, "arms", 0).face(0, "smirk").key(0.5, { head: 10 }, 0.4).face(1.2, "strain").key(S("e2"), { head: -6 }, 0.4).face(S("e5"), "smirk").key(S("e5"), { head: 0 }, 0);

  // ---------- B1: the push ----------
  const Y1 = Y(1), FL1 = Y1 + 300; N.floor(Y1);
  const a1 = L.aura(ink, 250, FL1 + 10, 400, 760, "#F7D54A", S("e3") - 0.2); N.ups.push(a1.update);
  const v1 = mk(ink, "vegetaCellSSJ", 250, FL1, 0.9, S("e3") - 0.3); v1.face(0, "smirk").key(0, "arms", 0).key(F("e3", 0.1), "fist", 0.3);
  L.pop(ink, "THE PUSH", 720, Y1 - 560, 130, F("e3", 0.36), L.GREEN, "Anton", "slap", -4); L.pop(ink, "Super Saiyan, because of Goku", 600, Y1 - 440, 52, F("e3", 0.14), INKC, "Caveat", false);
  const rue = mk(ink, "rue", 520, FL1, 0.8, F("e3", 0.5)); rue.view(0, "side", 1).face(0, "determined").move(F("e3", 0.56), 960, T.e3[1] * 0.34).view(F("e3", 0.92), "front").face(F("e3", 0.92), "grin");
  const kai = mk(ink, "kai", 420, FL1, 0.8, F("e3", 0.5)); kai.view(0, "side", 1).face(0, "strain").move(F("e3", 0.56), 820, T.e3[1] * 0.32).view(F("e3", 0.92), "front").face(F("e3", 0.92), "grin");
  L.sign(ink, "a little faster with a rival in the race", 560, Y1 - 280, 900, 90, F("e3", 0.72), { size: 46, rot: -2, fill: "#E3F2D6", color: L.GREEN });

  // ---------- B2: the poison ----------
  const Y2 = Y(2), FL2 = Y2 + 300; N.floor(Y2);
  L.tx(ink, "episodes 228–229", 90, Y2 - 700, 60, S("e4") - 0.1, 0.4, { color: L.GREY });
  const tM = F("e4", 0.2), a2 = L.aura(ink, 290, FL2 + 10, 420, 780, "#B05AD0", tM + 0.05); N.ups.push(a2.update);
  const va = mk(N.win(0, tM + 0.08), "vegeta", 290, FL2, 0.95, S("e4") - 0.3); va.face(0, "determined").key(F("e4", 0.1), { aL: 34, eL: -84, aR: -34, eR: 84, head: -6 }, 0.3).face(F("e4", 0.12), "strain");
  const vb = mk(N.win(tM + 0.08, 1e9), "vegetaMajin", 290, FL2, 0.95, S("e4") - 0.3); vb.face(0, "smirk").key(0, { aL: 34, eL: -84, aR: -34, eR: 84 }, 0).key(F("e4", 0.44), "arms", 0.3);
  I.path(N.win(0, tM + 0.3), `M900,${Y2 - 560} q-220,40 -280,180 q-60,120 -230,60 q-90,-40 -100,-120`, F("e4", 0.07), 0.5, { w: 9, color: "#B05AD0", attrs: { "stroke-dasharray": "6 16" } });
  flash(290, Y2 - 100, tM); N.plate(300, Y2 - 330, "MAJIN VEGETA", tM + 0.2, { size: 52 }); L.sign(N.win(0, F("e4", 0.6)), "on purpose", 730, Y2 - 230, 340, 96, F("e4", 0.24), { size: 60, rot: 4, fill: "#FFD9C9", color: RED });
  L.pop(ink, "THE POISON", 700, Y2 - 540, 116, F("e4", 0.42), RED, "Anton", "slap", 3);
  L.pop(ink, "who lied to win a little money?", 760, Y2 - 300, 40, F("e4", 0.62), L.GREY, "Patrick Hand", false);
  N.ups.push(L.bars(ink, [{ x: 640, y: FL2, len: 400, thick: 130, fill: "#D8322A", at: F("e4", 0.78) }, { x: 850, y: FL2, len: 96, thick: 130, fill: "#B8B0A2", at: F("e4", 0.86) }]));
  L.pop(ink, "50%", 705, FL2 - 420, 76, F("e4", 0.82), RED, "Anton", "pop"); L.pop(ink, "12%", 915, FL2 - 116, 66, F("e4", 0.9), INKC, "Anton", "pop"); L.pop(ink, "to a rival", 705, FL2 - 30, 38, F("e4", 0.8), "#FFFDF6", "Patrick Hand", false); L.pop(ink, "to others", 915, FL2 - 30, 38, F("e4", 0.88), INKC, "Patrick Hand", false);

  const posters = [{ on: [S("e5") - 0.05, E("e5") + 0.02], shakeAt: W("e5", 13), lines: [
    { txt: "WANT TO CLIMB:", x: 90, y: 620, size: 138, at: W("e5", 0) }, { txt: "A RIVAL LIFTS YOU.", x: 90, y: 790, size: 108, fill: "#9A958C", at: W("e5", 4) }, { txt: "WANT THEM TO FALL:", x: 90, y: 1040, size: 106, at: W("e5", 8) }, { txt: "YOU SINK WITH THEM.", x: 90, y: 1210, size: 102, fill: RED, at: W("e5", 13), big: true }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [0.8, 480, Y0 - 98, 1.1, -1], [S("e2"), 600, Y0 - 98, 1.1, 1],
    [S("e3") - 0.3, 400, Y1 - 60, 1.3], [F("e3", 0.2), 440, Y1 - 120, 1.15, 1], [F("e3", 0.36), 560, Y1 - 220, 1.1, -1], [F("e3", 0.54), 640, Y1 - 60, 1.15, 1], [F("e3", 0.86), 760, Y1 + 20, 1.25, -1],
    [S("e4") - 0.3, 360, Y2 - 60, 1.3], [F("e4", 0.1), 400, Y2 - 100, 1.2, -1], [F("e4", 0.24), 480, Y2 - 80, 1.15, 1], [F("e4", 0.42), 560, Y2 - 220, 1.08, -1], [F("e4", 0.62), 700, Y2 - 20, 1.2, 1], [F("e4", 0.88), 600, Y2 - 60, 1.1, -1], [S("e5") + 0.4, 540, Y0 - 120, 1.05]];
  K.run({ shots, posters, drift: 0.02, events: [{ type: "bigslam", at: 0.03 }], punches: [{ t: F("e3", 0.36), z: 1.08 }, { t: tM, z: 1.1 }, { t: F("e4", 0.82), z: 1.08 }], shakes: [{ t: tM, a: 14 }], extra: N.tick });
})();
