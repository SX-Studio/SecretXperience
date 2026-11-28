/* Short 13: "Someone's better than you." — Vegeta's admission in DBZ ep 280 ("You are number one" in the original); Gurel et al. 2020 (kids and teens).
   Rulebook: hook = slab text, open loop ("without breaking") answered at the end, no exit phrases, last sentence ("Even when,") runs into the first. */
(function () {
  const K = SHORT({ keys: { better: 1, vegeta: 1, episodes: 1, breaking: 1, prince: 1, low: 1, passing: 1, gravity: 1, second: 1, kakarot: 1, "break": 1, racing: 1, limits: 1, pride: 1, top: 1, worth: 1, less: 1 }, noCap: ["f7"], capStyle: "big", capY: 1480 });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;
  const tR = W("f7", -2);

  // ---------- B0: the cover, moving from frame 0 — second place ----------
  const Y0 = Y(0), FLc = Y0 + 700; N.burst(270, Y0 + 120, 240, 1050); N.hook(Y0, ["SOMEONE'S BETTER", 120], ["THAN YOU.", 158], "DRAGON BALL Z");
  const pod = (x, w, h, lb, fill) => { el("rect", { x, y: FLc - h, width: w, height: h, fill, stroke: INKC, "stroke-width": 8 }, ink); const t = el("text", { x: x + w / 2, y: FLc - h / 2 + 50, "text-anchor": "middle", "font-family": "Anton", "font-size": 140, fill: INKC }, ink); t.textContent = lb; };
  pod(100, 340, 200, "2", "#D9D4CB"); pod(480, 380, 330, "1", "#F2C230");
  const g0 = mk(ink, "goku", 670, FLc - 330, 1.0, -2); g0.face(0, "grin").key(0, "wave", 0).key(0.5, "cheer", 0.3).key(1.3, "wave", 0.3).key(S("f7"), "wave", 0);
  const v0 = mk(ink, "vegeta", 270, FLc - 200, 1.12, -2); v0.key(0, "arms", 0).key(0, { head: 8 }, 0).face(0, "strain").key(0.4, { head: 16 }, 0.4).key(1.5, { head: -6 }, 0.4).key(S("f7"), { head: 8 }, 0);
  const am = el("g", {}, ink); el("path", { d: "M-26,-10 q16,-2 16,-18 M10,-28 q0,16 18,16 M26,10 q-16,2 -16,18 M-10,28 q0,-16 -18,-16", fill: "none", stroke: RED, "stroke-width": 9, "stroke-linecap": "round" }, am);
  N.ups.push((t) => { const s = 1 + 0.18 * Math.sin((t / K.D) * Math.PI * 2 * Math.round(K.D / 0.5)); am.setAttribute("transform", `translate(430,${Y0 - 120}) rotate(12) scale(${s.toFixed(3)})`); });

  // ---------- B1: prince, low-class, 450 times gravity, still second ----------
  const Y1 = Y(1), FL1 = Y1 + 300; N.floor(Y1);
  const tP = F("f3", 0.66), va = mk(N.win(0, tP), "vegetaCell", 260, FL1, 0.9, S("f3") - 0.3); va.key(0, "arms", 0).face(0, "smirk").face(F("f3", 0.52), "strain");
  N.plate(260, Y1 - 300, "THE PRINCE", S("f3") + 0.05, { size: 50, until: F("f3", 0.62) });
  const gk = mk(ink, "goku", 870, FL1, 0.9, F("f3", 0.2)); gk.face(0, "grin").key(F("f3", 0.52), "fist", 0.3).key(F("f3", 0.7), "stand", 0.3);
  L.pop(N.win(0, F("f3", 0.62)), "LOW-CLASS", 850, Y1 - 250, 72, F("f3", 0.26), "#8A847A", "Anton", "slap", 3);
  const rG = el("rect", { x: 120, y: Y1 - 620, height: 90, rx: 8, fill: "#F28C28", stroke: INKC, "stroke-width": 6, opacity: 0 }, ink), rV = el("rect", { x: 120, y: Y1 - 500, height: 90, rx: 8, fill: "#2A3F7A", stroke: INKC, "stroke-width": 6, opacity: 0 }, ink);
  const lb = (s, y) => { const e = el("text", { x: 144, y, "font-family": "Anton", "font-size": 46, fill: "#FFFDF6", opacity: 0, "letter-spacing": 2 }, ink); e.textContent = s; return e; }, lG = lb("GOKU", Y1 - 558), lV = lb("VEGETA", Y1 - 438);
  N.ups.push((t) => { const o = t >= F("f3", 0.46) ? 1 : 0, u = clamp((t - F("f3", 0.46)) / (T.f3[1] * 0.5), 0, 1), lv = 260 + 500 * ease(u), lg = lv + 110 + 40 * Math.sin(u * 9); [rG, rV, lG, lV].forEach((e) => e.setAttribute("opacity", o)); rV.setAttribute("width", lv.toFixed(0)); rG.setAttribute("width", lg.toFixed(0)); });
  const vp = mk(N.win(tP, 1e9), "vegetaCell", 230, FL1, 0.9, S("f3") - 0.3); vp.view(0, "side", 1).key(0, "pushUp", 0).face(0, "strain"); for (let k = 0, tt = tP; tt < E("f3") + 0.3; tt += 0.42, k++) vp.key(tt, k % 2 ? "pushUp" : "pushDown", 0.4);
  L.pop(ink, "450× GRAVITY", 540, Y1 - 270, 96, F("f3", 0.68), INKC, "Anton", "slap", -2); L.pop(ink, "STILL 2ND.", 420, Y1 - 90, 120, F("f3", 0.86), RED, "Anton", "bigslam", -4);

  // ---------- B2: episode 280 ----------
  const Y2 = Y(2), GY = Y2 + 270;
  el("rect", { x: -300, y: Y2 - 1150, width: 1680, height: 1450, fill: "#5A4E9A", opacity: 0.2 }, ink); [[200, -780, 60], [520, -860, 30], [930, -700, 44]].forEach(([x, dy, r]) => el("circle", { cx: x, cy: Y2 + dy, r, fill: "#E8E2F4", stroke: "#8A84A8", "stroke-width": 4, opacity: 0.9 }, ink));
  el("path", { d: `M-300,${Y2 + 600} V${Y2 + 300} Q200,${Y2 + 200} 540,${Y2 + 300} Q860,${Y2 + 380} 1380,${Y2 + 270} V${Y2 + 600} Z`, fill: "#9CCB7A", stroke: INKC, "stroke-width": 6 }, ink);
  L.tx(ink, "episode 280", 90, Y2 - 760, 64, S("f4") - 0.1, 0.4, { color: "#4A4466" });
  const vg = mk(ink, "vegeta", 290, GY, 1.15, S("f4") - 0.3); vg.acc(0, "halo").key(0, "arms", 0).face(0, "determined").face(F("f4", 0.62), "sad").face(S("f5") + 0.3, "smile").key(S("f5") + 0.3, "stand", 0.5);
  const fight = el("g", { opacity: 0 }, ink), fx = 800, fy = Y2 - 380; I.fill(ink, fight, S("f4") + 0.1, 0.3, { sound: false }); const fin = el("g", {}, fight);
  el("path", { d: `M${fx - 150},${fy + 80} q-70,-90 -30,-170 q-10,60 30,60 q-20,-90 40,-140 q0,90 40,90 q30,60 -10,160 z`, fill: "#F7D54A", opacity: 0.5 }, fin); el("path", { d: `M${fx - 128},${fy - 96} q-40,60 -34,150 l26,-10 q2,-80 24,-126 z`, fill: "#F7D54A", stroke: INKC, "stroke-width": 4 }, fin);
  const gF = mk(fin, "gokuSSJ", fx - 110, fy + 70, 0.3, 0); gF.view(0, "side", 1).key(0, { aL: -84, eL: -6, aR: -92, eR: 4 }, 0).face(0, "strain");
  const buu = el("g", {}, fin); el("circle", { cx: fx + 120, cy: fy - 40, r: 22, fill: "#F29AC0", stroke: INKC, "stroke-width": 4 }, buu); el("path", { d: `M${fx + 120},${fy - 62} q4,-34 30,-30`, fill: "none", stroke: "#F29AC0", "stroke-width": 9, "stroke-linecap": "round" }, buu); el("path", { d: `M${fx + 100},${fy + 60} q-8,-70 20,-76 q28,6 20,76 z`, fill: "#F29AC0", stroke: INKC, "stroke-width": 4 }, buu); el("path", { d: `M${fx + 100},${fy + 20} h40 v44 h-40 z`, fill: "#FFFFFF", stroke: INKC, "stroke-width": 3 }, buu);
  const cl = el("circle", { cx: fx + 10, cy: fy - 10, r: 20, fill: "#FFFDF0", stroke: "#F2C230", "stroke-width": 6 }, fin);
  N.ups.push((t) => { fin.setAttribute("transform", `translate(${(Math.sin(t * 1.3) * 22).toFixed(1)},${(Math.cos(t * 1.7) * 16).toFixed(1)})`); buu.setAttribute("transform", `translate(${(Math.sin(t * 9) * 10).toFixed(1)},${(Math.cos(t * 7) * 8).toFixed(1)})`); cl.setAttribute("r", (16 + 16 * Math.abs(Math.sin(t * 8))).toFixed(1)); });
  const tw = N.win(0, S("f5") - 0.1); L.thought(tw, 700, Y2 - 110, 600, 190, F("f4", 0.6)); L.pop(tw, "Kakarot is better.", 700, Y2 - 92, 62, F("f4", 0.72), INKC, "Caveat", false);
  N.plate(540, Y2 - 640, "YOU ARE NUMBER ONE", F("f4", 0.84), { size: 62, sub: "(in the original)", until: S("f5") - 0.05 });
  const bx = N.win(F("f5", 0.42), 1e9); L.rect(bx, 400, Y2 - 330, 640, 500, F("f5", 0.44), "#FFFDF6", { rx: 16, sound: "pop" });
  const gh = mk(bx, "goku", 540, Y2 + 140, 0.6, F("f5", 0.46)); gh.view(0, "side", 1).face(0, "determined"); N.ups.push(() => gh.root.setAttribute("opacity", Math.min(0.35, +gh.root.getAttribute("opacity")))); L.pop(bx, "yesterday's Goku", 560, Y2 - 270, 40, F("f5", 0.48), L.GREY, "Patrick Hand", false);
  const gn = mk(bx, "goku", 640, Y2 + 140, 0.6, F("f5", 0.56)); gn.view(0, "side", 1).face(0, "grin").move(F("f5", 0.62), 900, T.f5[1] * 0.3); L.pop(bx, "racing his own limits", 720, Y2 - 215, 50, F("f5", 0.72), L.GREEN, "Caveat", "pop");

  // ---------- B3: the second ruler ----------
  const Y3 = Y(3), FL3 = Y3 + 300; N.floor(Y3);
  const nia = mk(ink, "nia", 150, FL3, 0.8, S("f6") - 0.3); nia.face(0, "smile").say("f6").key(F("f6", 0.2), { aR: -110, eR: 0 }, 0.3);
  L.sign(ink, "a study of kids and teens", 600, Y3 - 640, 680, 90, S("f6") + 0.1, { size: 50, rot: -2, fill: "#FFFDF6", color: L.GREY });
  const row = (y, lbl, at, crownAt, crossAt) => { L.rect(ink, 290, y, 440, 100, at, "#FFFDF6", { rx: 14, sound: "pop" }); L.pop(ink, lbl, 510, y + 66, 42, at + 0.05, INKC, "Patrick Hand", false); L.pop(ink, "pride", 830, y + 70, 60, at + 0.25, L.GREEN, "Caveat", "pop");
    const c = el("g", { opacity: 0, transform: `translate(980,${y + 86}) scale(0.55)` }, ink); el("path", { d: "M-70,0 L-80,-70 L-40,-30 L0,-90 L40,-30 L80,-70 L70,0 Z", fill: "#F2C230", stroke: INKC, "stroke-width": 8, "stroke-linejoin": "round" }, c); I.fill(ink, c, crownAt, 0.2, { sound: "pop" });
    if (crossAt) I.path(ink, `M925,${y + 20} L1035,${y + 100} M1035,${y + 20} L925,${y + 100}`, crossAt, 0.25, { w: 9, color: RED }); };
  row(Y3 - 470, "“better than others”", F("f6", 0.22), F("f6", 0.66)); row(Y3 - 250, "“better than past me”", F("f6", 0.36), F("f6", 0.68), F("f6", 0.78));
  L.pop(ink, "the urge to be on top", 880, Y3 - 500, 38, F("f6", 0.66), L.GREY, "Patrick Hand", false);

  const posters = [{ on: [S("f7") - 0.05, tR - 0.05], shakeAt: W("f7", 7), lines: [
    { txt: "BETTER THAN YOU", x: 90, y: 640, size: 126, at: W("f7", 0) }, { txt: "DOESN'T MEAN", x: 90, y: 850, size: 156, fill: "#9A958C", at: W("f7", 3) }, { txt: "YOU'RE WORTH", x: 90, y: 1040, size: 156, at: W("f7", 5) }, { txt: "LESS.", x: 90, y: 1260, size: 240, fill: RED, at: W("f7", 7), big: true }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [0.8, 490, Y0 - 98, 1.1, -1], [S("f2") + 0.1, 590, Y0 - 96, 1.1, 1], [F("f2", 0.55), 520, Y0 - 108, 1.06, -1],
    [S("f3") - 0.3, 300, Y1 - 40, 1.3, 1], [F("f3", 0.2), 800, Y1 - 20, 1.3, -1], [F("f3", 0.46), 540, Y1 - 300, 1.1, 1], [tP, 400, Y1 + 20, 1.25, -1], [F("f3", 0.86), 540, Y1 - 60, 1.1, 1],
    [S("f4") - 0.3, 540, Y2 - 120, 1.05], [F("f4", 0.22), 780, Y2 - 320, 1.45, 1], [F("f4", 0.56), 560, Y2 - 80, 1.07, -1], [F("f4", 0.82), 540, Y2 - 280, 1.06, 1], [S("f5"), 330, Y2 - 40, 1.35, -1], [F("f5", 0.42), 660, Y2 - 60, 1.14, 1],
    [S("f6") - 0.3, 540, Y3 - 120, 1.05], [F("f6", 0.22), 560, Y3 - 260, 1.06, 1], [F("f6", 0.64), 800, Y3 - 280, 1.3, -1], [tR - 0.6, 540, Y0 - 120, 1.05]];
  K.run({ shots, posters, drift: 0.02, events: [{ type: "bigslam", at: 0.03 }], punches: [{ t: F("f3", 0.86), z: 1.08 }, { t: F("f4", 0.84), z: 1.06 }, { t: F("f5", 0.72), z: 1.06 }], shakes: [{ t: F("f3", 0.86), a: 12 }, { t: F("f4", 0.84), a: 10 }], extra: N.tick });
})();
