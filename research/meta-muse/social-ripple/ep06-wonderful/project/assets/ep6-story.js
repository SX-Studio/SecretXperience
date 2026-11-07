/* Social Ripple ep6: "What If You Could See Every Life You've Ever Touched?" — the director's file.
   Premise-level inspiration only (seeing your life's impact); our own device (golden threads), cast and island.
   Crumb Island (EP3 sets). Lead: Mo. Host: Nia. Devices: EP6P threads + tally + note, EP5K rules card, EP4P soup, EP5P sandwich/trays/broom. */
(function () {
  const SR = window.SR, TH = window.THREE, T = window.T, K = window.EP3K, K4 = window.EP4K, K5 = window.EP5K, P4 = window.EP4P, P5 = window.EP5P, P6 = window.EP6P; SR.SKIN = "#F1EBDD";
  const { el, clamp } = SR; const lerp = (a, b, k) => a + (b - a) * k, ss = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
  const W = (w, nth = 0, line) => { const v = K.W(w, nth, line); return v == null ? (line ? T[line] : 0) : v; };
  const E = (id) => T[id + "_e"], D = T.D;
  const W3 = SR3D.create({ canvas: document.getElementById("bg"), ov: document.getElementById("ov"), width: 1920, height: 1080, samples: 2, ndScale: 1, dofTaps: 14 });
  K.P.overcast = Object.assign({}, K.P.day, { top: "#5E6C80", mid: "#8E9AAA", hor: "#BCC3CC", gnd: "#45606E", fog: "#9AA6B4", sun: "#D8E0EA", sunI: 1.0, hS: "#C2CCDA", hG: "#525266", hI: 1.35, stars: 0, sunK: 0 });
  const applyEnv = K.lights(W3);
  const town = window.EP3.town(W3), inner = window.EP3.interiors(W3), props = window.EP3.props(W3), FX = SRFX.create(W3);
  const IA = inner.anchors || {}; const A = Object.assign({}, town.anchors || {}, IA.shop || {});
  (town.occ || []).concat(inner.occ || []).forEach((o) => W3.occ.push(o));
  const V = (x, y, z) => ({ x, y, z }), rp = (a, dx, dy, dz) => [a.x + dx, (a.y || 0) + dy, a.z + dz];
  const hudSvg = document.getElementById("hud");

  // ======================= places =======================
  const MO0 = V(-9, 0, -8.5), ORG = V(-9, 1.18, -8.25);                // Mo at his shop door (door faces +z, toward the square)
  const THEO_N = V(-2.4, 0, 1.9), BEA_N = V(9, 0, -8.6), KAI_Q = V(0.7, 0.12, 15.3), KAI_Y = V(-11.2, 0, 3.6);
  const SH = V(300, 0, 0), MOS = V(300, 0, -1.6), CUS = V(300, 0, 1.3), SDOOR = V(302.5, 0, 3.0);   // sandwich shop interior
  const NQ = V(0.6, 0.12, 15.2);
  const HP = town.housePos, HOUSE = (i, up = 1.3) => { const [x, z] = HP[i], L = Math.hypot(x, z); return V(x - (x / L) * 3.3, up, z - (z / L) * 3.3); };
  const KAIH = [0, 1, 2, 8, 9, 11, 12];                                  // the houses Kai built ("half the houses")
  const NEIGH = 4;                                                       // Bea's neighbour, who lives alone
  const chest = (p, dy = 1.15) => V(p.x, (p.y || 0) + dy, p.z);

  // ======================= cast =======================
  function Track(p0) { const P = [[0, p0]]; return { P, at(t, p, e) { P.push([t, p, e]); return this; }, jump(t, p) { P.push([t - 0.002, P[P.length - 1][1], "linear"]); P.push([t, p, "jump"]); return this; } }; }
  const CAST = {};
  function actor(id, look, p0, o = {}) { const tr = Track(p0), face = [[0, o.face || { x: 0, z: 1 }]], rig = { pose: [[0, o.pose || "relaxed", 0]], mood: [[0, o.mood || "content", 0]], lips: [], squash: [[0, 0]] }, vis = [];
    const a = { id, tr, face, rig, vis, look, show(t0, t1) { vis.push([t0, t1]); return a; }, pose(t, n, d = 0.25) { rig.pose.push([t, n, d]); return a; }, mood(t, n, d = 0.25) { rig.mood.push([t, n, d]); return a; },
      faceTo(t, dir) { face.push([t, dir]); return a; }, at(t, p, e) { tr.at(t, p, e); return a; }, jump(t, p) { tr.jump(t, p); return a; }, bob(t, k = 0.12) { rig.squash.push([t - 0.01, 0], [t + 0.08, k], [t + 0.35, 0]); return a; } };
    CAST[id] = a; return a; }
  const says = (a, line) => a.rig.lips.push([T[line], line]);
  const mo = actor("mo", { color: "#E8834A", outfit: "apron", hair: "short", hairColor: "#3A2A22", pants: "#3A4A63", seed: 7 }, MO0, { face: { x: 0, z: -1 } });
  const theo = actor("theo", { color: "#8A93A6", outfit: "hoodie", hair: "short", hairColor: "#6A4A3A", pants: "#3A4050", seed: 21 }, THEO_N, { face: { x: -0.6, z: -1 } });
  const kai = actor("kai", { color: "#FF8A2A", outfit: "jacket", hair: "cap", hairColor: "#E0B020", pants: "#3A4A63", seed: 6 }, KAI_Q, { face: { x: 0, z: 1 } });
  const bea = actor("bea", { skin: "ink", color: "#F2C14E", outfit: "apron", hair: "ponytail", hairColor: "#1E1B22", pants: "#6A4A8A", seed: 4 }, BEA_N, { face: { x: 0, z: 1 } });
  const ana = actor("ana", { color: "#3FA7A0", outfit: "tee", hair: "bun", hairColor: "#5A3A2A", pants: "#2E7A74", seed: 5 }, V(-0.5, 0, 3.4), { face: { x: -1, z: 0 } });
  const nia = actor("nia", { skin: "ink", color: "#E8634A", outfit: "jacket", hair: "curly", hairColor: "#1E1B22", pants: "#2E3A5A", scale: 1.04, seed: 9 }, NQ, { face: { x: 0, z: 1 } });

  // ======================= camera =======================
  const KEYS = [];
  function shot(t0, t1, A0, B0, o = {}) { if (KEYS.length && KEYS[KEYS.length - 1].t >= t0 - 0.002) KEYS[KEYS.length - 1].t = t0 - 0.003; KEYS.push(Object.assign({ t: t0, p: A0[0], l: A0[1], f: A0[2], e: o.in || "cut", dof: o.dof ?? 0.25, fn: o.fn ?? 50, ff: o.ff ?? 320 })); KEYS.push({ t: t1 - 0.001, p: B0[0], l: B0[1], f: B0[2], e: o.out || "lin", dof: o.dof2 ?? o.dof ?? 0.25, fn: o.fn ?? 50, ff: o.ff ?? 320 }); }
  // standard frames
  const MO_SIDE = (t0, t1, k = 0) => shot(t0, t1, [[-6.3 - k, 1.5, -8.1], [-9, 1.2, -8.55], 38], [[-6.6 - k, 1.48, -8.15], [-9, 1.2, -8.55], 36], { dof: 0.45 });
  const AERIAL = (t0, t1, o = {}) => shot(t0, t1, [[14, 26, 30], [-3, 0, -4], 48], [[12, 24.5, 28], [-3, 0, -4], 47], Object.assign({ dof: 0.08 }, o));
  const OVER = (t0, t1, o = {}) => shot(t0, t1, [[-16, 17, -22], [2, 0, 6], 50], [[-15, 16.2, -21], [2, 0, 6], 49], Object.assign({ dof: 0.08 }, o));

  // ======================= devices =======================
  const CK = [], GK = [[0, 1.0, 0.1]], ENVK = [[0, "night"]], RAINK = [[0, 0]];
  const grade = (t, s, w) => GK.push([t, s, w]);
  const CARDS = [], card = (o) => CARDS.push(o), src = (text, t0, t1) => CARDS.push({ text, t0, t1, zone: "source", mood: "plain" });
  const TW = { burst: [], main: [], theo: [], chain: [], cascade: [], kai: [], kaiSub: [], back: [], web: [] };   // thread-set windows [t0, t1, k, fadeIn, fadeOut]
  const on = (set, a, b, k = 1, fi = 0.3, fo = 0.3) => TW[set].push([a, b, k, fi, fo]);
  const tk = () => {};
  const FOCUS = [[0, null]];
  const rnd = SR.mulberry32(606);
  // island targets for the burst: every house, every shop, the pier, plus scattered points (people we never meet)
  const targets = [];
  HP.forEach((_, i) => targets.push(HOUSE(i, 1.2 + rnd() * 0.6)));
  [V(9, 1.3, -9.3), V(0, 1.3, -9.6), V(10.3, 1.3, 3.6), V(-11.4, 1.3, 3.6), V(-11.7, 1.3, 12.1), V(0, 1.2, 36.5), V(0.5, 1.2, 15.6), V(-3.6, 1.0, 3.6), V(3.5, 1.0, 3.4)].forEach((p) => targets.push(p));
  for (let i = 0; i < 70; i++) { const a = rnd() * Math.PI * 2, r = 6 + rnd() * 24; targets.push(V(Math.sin(a) * r, 0.9 + rnd() * 1.2, Math.cos(a) * r * 0.9 + 1)); }
  const mkBurst = (t0, spread) => targets.map((p, i) => ({ id: "b" + i, from: V(ORG.x + (rnd() - 0.5) * 0.5, ORG.y + (rnd() - 0.5) * 0.4, ORG.z + rnd() * 0.3), to: p, t0: t0 + (i / targets.length) * spread + rnd() * 0.15, grow: 0.7 + rnd() * 0.6, bright: 0.15 + 0.6 * rnd() * rnd() + (i < 13 ? 0.15 : 0) }));
  const burst = P6.threads(W3, mkBurst(0.45, 1.1), { gain: 0.55 });
  // S02 onward: the same threads appear again (chronologically the cold open was a flash-forward)
  const tGlow = W("glow", 0, "n04"), main = P6.threads(W3, mkBurst(tGlow, 1.6), { gain: 0.55 });
  const theoT = P6.threads(W3, [{ id: "theo", from: ORG, to: chest(THEO_N), t0: T.n07 + 0.3, grow: 1.5, bright: 1.0, thick: 0.02, arc: 3.2 }]);
  const chain = P6.threads(W3, [{ id: "c1", from: chest(THEO_N), to: chest(BEA_N), t0: W("help", 0, "n13") - 0.2, grow: 1.4, bright: 0.85, arc: 4 },
    { id: "c2", from: chest(BEA_N), to: HOUSE(NEIGH, 1.4), t0: W("neighbour", 0, "n13") - 0.4, grow: 1.4, bright: 0.85, arc: 4 }]);
  const firstL = [HOUSE(5), HOUSE(3), HOUSE(10), V(10.3, 1.3, 3.6), V(-11.7, 1.3, 12.1), HOUSE(7), V(0.5, 1.2, 15.6), HOUSE(6)], casc = [];
  firstL.forEach((p, i) => { casc.push({ id: "f" + i, from: ORG, to: p, t0: T.n15 + i * 0.12, grow: 0.9, bright: 0.7 });
    for (let j = 0; j < 3; j++) { const a = rnd() * Math.PI * 2, r = 5 + rnd() * 7, q = V(p.x + Math.sin(a) * r, 1.1, p.z + Math.cos(a) * r); casc.push({ id: "s" + i + j, from: p, to: q, t0: W("two", 0, "n15") + i * 0.1 + j * 0.15, grow: 0.9, bright: 0.45 });
      const b = rnd() * Math.PI * 2; casc.push({ id: "t" + i + j, from: q, to: V(q.x + Math.sin(b) * 4, 1.1, q.z + Math.cos(b) * 4), t0: W("three", 0, "n15") + i * 0.08 + j * 0.1, grow: 0.8, bright: 0.3 }); } });
  const cascade = P6.threads(W3, casc);
  const tPull = W("pulled", 0, "n19"), tBack = T.n21 + 0.35;
  const kaiT = P6.threads(W3, [{ id: "kai", from: ORG, to: chest(KAI_Q, 1.1), t0: T.n16 + 0.2, grow: 1.8, bright: 1.0, thick: 0.05, arc: 5, pull: [tPull, tBack] }]);
  const kaiSub = P6.threads(W3, KAIH.map((h, i) => ({ id: "k" + i, from: chest(KAI_Y, 1.3), to: HOUSE(h, 1.6), t0: W("built", 0, "n18") + i * 0.18, grow: 1.0, bright: 0.75, arc: 3, pull: [tPull + 0.2, tBack] })));
  const backT = P6.threads(W3, [{ id: "back", from: chest(CUS, 1.2), to: chest(MOS, 1.2), t0: T.n27 + 0.2, grow: 1.4, bright: 1.0, thick: 0.015, arc: 0.7, normal: true }]);
  const webL = []; for (let i = 0; i < 46; i++) { const a = targets[Math.floor(rnd() * targets.length)], b = targets[Math.floor(rnd() * targets.length)]; if (a !== b) webL.push({ id: "w" + i, from: a, to: b, t0: T.n29 + 0.4 + rnd() * 2.2, grow: 1.4, bright: 0.25 + rnd() * 0.3 }); }
  const web = P6.threads(W3, webL);
  const SETS = { burst, main, theo: theoT, chain, cascade, kai: kaiT, kaiSub, back: backT, web };
  const tally = P6.tally(hudSvg, [[0, 0], [0.6, 12], [0.8, 41], [1.0, 96], [1.2, 158], [1.4, 223], [1.6, 291], [1.8, 347], [T.s02, 0], [T.n05, 0], [T.n05 + 0.1, 347], [T.n06, 0]], { label: "LIVES TOUCHED" });
  const sandwich = P5.sandwichIcon(hudSvg), soup = P4.soupIcon(hudSvg), note = P6.noteIcon(hudSvg), trays = P5.trays(W3, 3), broom = P5.broomIcon(hudSvg);
  const TRK = [[0, { on: 0, k: 0 }]];
  const rain = FX.rain({ center: V(-4, 7, 2), size: V(34, 14, 34), n: 1400, speed: 11, len: 0.45 });
  const VANISH = [];   // [t, k] k: 0 houses present, 1 gone
  const HANDS = [];    // [g, who, t0, t1]

  // ======================= scenes =======================
  // ---------- S01 cold open: night, Mo locks up; threads burst out across the island ----------
  {
    mo.show(0, T.s02).jump(0, MO0).faceTo(0, { x: 0, z: -1 }).pose(0, "hold", 0).mood(0, "tired", 0).faceTo(0.42, { x: 0.15, z: 1 }).pose(0.45, "startle", 0.12).mood(0.45, "surprised", 0.12).mood(T.n02, "starstruck", 0.4);
    on("burst", 0, 1.6, 0.75, 0, 0.8); on("burst", 0, T.s02, 0.22, 0, 0);
    MO_SIDE(0, T.n02 - 0.1);
    OVER(T.n02 - 0.1, T.s02);
    card({ text: "HALF THE HOUSES", sub: "exist because of him", mood: "fact", t0: W("half", 0, "n02"), t1: T.s02 - 0.1, zone: "lower" });
  }
  // ---------- S02 who Mo is + the rules ----------
  {
    const s = T.s02; ENVK.push([s - 0.01, "night"], [s, "day"], [T.n04 - 0.01, "day"], [T.n04, "night"]);
    mo.show(s, T.s03).jump(s, MOS).faceTo(s, { x: 0, z: 1 }).pose(s, "give", 0).mood(s, "content", 0).pose(W("same", 0, "n03"), "relaxed", 0.3).mood(W("small", 0, "n03"), "tired", 0.4);
    shot(s, T.n04, [[301.5, 1.5, 0.7], [300, 1.38, -1.6], 36], [[301.35, 1.49, 0.5], [300, 1.38, -1.6], 34], { dof: 0.45 });
    card({ text: "MO", sub: "22 years of sandwiches", mood: "plain", t0: W("mo", 0, "n03"), t1: W("same", 0, "n03") - 0.1, zone: "top" });
    card({ text: "SAME SHOP. SAME APRON.", mood: "funny", t0: W("same", 0, "n03"), t1: E("n03") + 0.2, zone: "top" });
    // Tuesday night, locking up: he starts to glow
    mo.jump(T.n04, MO0).faceTo(T.n04, { x: 0, z: -1 }).pose(T.n04, "hold", 0).mood(T.n04, "tired", 0).faceTo(tGlow - 0.1, { x: 0.15, z: 1 }).pose(tGlow, "startle", 0.15).mood(tGlow, "surprised", 0.15).mood(T.n05, "starstruck", 0.4);
    on("main", tGlow - 0.05, T.n05, 0.3, 0, 0); on("main", T.n05, T.s03, 1, 0, 0);
    MO_SIDE(T.n04, T.n05, 0.4);
    AERIAL(T.n05, T.n06);
    // rules card over a soft aerial
    shot(T.n06, T.s03, [[0, 6, 18], [0, 1, 0], 44], [[0, 5.6, 16.5], [0, 1, 0], 44], { dof: 0.9 });
    window.__rules = { t0: T.n06 + 0.1, t1: E("n06") + 0.6, rowT: [W("one", 0, "n06"), W("two", 0, "n06"), W("three", 0, "n06")] };
  }
  // ---------- S03 the brightest thread → Theo; the flashback; study 1 ----------
  {
    const s = T.s03; FOCUS.push([s, "dimAll"]);
    mo.show(s, T.n08).jump(s, MO0).faceTo(s, { x: 0.5, z: 1 }).pose(s, "relaxed", 0).mood(s, "confused", 0);
    theo.show(s, T.n08).jump(s, THEO_N).faceTo(s, { x: -0.7, z: -1 }).pose(s, "relaxed", 0).mood(s, "content", 0);
    on("main", s, T.s05, 0.35, 0, 0); on("theo", s, T.n15, 1, 0, 0.3);
    shot(s, T.n08, [[-4.8, 2.4, -5.6], [-4.6, 1.3, -1.2], 46], [[-4.2, 2.2, -4.4], [-3.4, 1.3, 0.6], 42], { dof: 0.25 });
    // flashback: last spring, the shop, day (warm, a little faded)
    const fb = T.n08; ENVK.push([fb - 0.01, "night"], [fb, "day"]); grade(fb - 0.01, 1.0, 0.1); grade(fb, 0.75, 0.75);
    theo.show(fb, T.n10).jump(fb, CUS).faceTo(fb, { x: 0, z: -1 }).pose(fb, "hold", 0).mood(fb, "sad", 0).mood(T.mo_01 + 0.2, "surprised", 0.2).pose(W("island", 0, "mo_01"), "hold", 0.2).mood(W("island", 0, "mo_01") + 0.3, "hopeful", 0.4);
    mo.show(fb, T.n10).jump(fb, MOS).faceTo(fb, { x: 0, z: 1 }).pose(fb, "relaxed", 0).mood(fb, "content", 0).pose(T.mo_01 - 0.2, "give", 0.25).mood(T.mo_01, "happy", 0.2).pose(E("mo_01") + 0.2, "relaxed", 0.3).faceTo(T.n09 + 0.4, { x: 0.6, z: -0.6 });
    says(mo, "mo_01");
    HANDS.push([sandwich, "mo", T.mo_01 - 0.1, W("island", 0, "mo_01") + 0.1], [sandwich, "theo", W("island", 0, "mo_01") + 0.1, T.n10]);
    shot(fb, E("mo_01") + 0.3, [[301.9, 1.5, 3.1], [300, 1.25, 0.0], 40], [[301.75, 1.49, 2.85], [300, 1.25, 0.0], 38], { dof: 0.4 });
    shot(E("mo_01") + 0.3, T.n10, [[301.7, 1.45, 3.1], [300, 1.25, 1.2], 36], [[301.5, 1.44, 2.8], [300, 1.25, 1.2], 34], { dof: 0.5 });
    card({ text: "LAST SPRING", mood: "plain", t0: T.n08 + 0.1, t1: W("lonely", 0, "n08"), zone: "top" });
    // study 1 (back to night): Theo, the bright thread
    grade(T.n10 - 0.01, 0.75, 0.75); grade(T.n10, 1.0, 0.1); ENVK.push([T.n10 - 0.01, "day"], [T.n10, "night"]);
    mo.show(T.n10, T.s05).jump(T.n10, MO0).faceTo(T.n10, { x: 0.5, z: 1 }).pose(T.n10, "relaxed", 0).mood(T.n10, "content", 0);
    theo.jump(T.n10, THEO_N).faceTo(T.n10, { x: -0.7, z: -1 }).pose(T.n10, "relaxed", 0).mood(T.n10, "content", 0);
    theo.show(T.n10, T.s04);

    shot(T.n10, T.s04, [[-0.2, 1.7, 5.4], [-2.6, 1.3, 1.6], 38], [[-0.6, 1.65, 4.8], [-2.6, 1.3, 1.6], 36], { dof: 0.3 });
    card({ text: "IT MEANT MORE THAN THEY GUESSED", sub: "free hot chocolate, winter skating rink", mood: "fact", t0: W("givers", 0, "n10"), t1: E("n10") + 0.3, zone: "top" });
    src("Kumar & Epley (2023)", W("givers", 0, "n10"), E("n10") + 0.3);
    card({ text: "SMALL KINDNESS, BIG DEAL", mood: "title", t0: T.n11, t1: E("n11") + 0.5, zone: "top" });
  }
  // ---------- S04 the thread keeps going: Theo → Bea → her neighbour; study 2 ----------
  {
    const s = T.s04; on("chain", s, T.n15, 1, 0, 0.3);
    theo.show(s, T.n15).jump(s, THEO_N).faceTo(s, { x: 0.5, z: -1 }).mood(s, "content", 0);
    bea.show(s, T.n15).jump(s, BEA_N).faceTo(s, { x: 0, z: 1 }).pose(s, "relaxed", 0).mood(s, "content", 0);
    shot(s, W("morning", 0, "n13") - 0.1, [[-1.5, 5.5, 9.5], [3.5, 1.2, -4.5], 48], [[-0.5, 5.4, 9.0], [4.5, 1.2, -5.0], 47], { dof: 0.12 });
    // daytime insert: Theo greets everyone; then he helps Bea with the dropped trays (Ep5)
    const ti = W("morning", 0, "n13") - 0.1, tj = W("when", 0, "n13") - 0.1, tk2 = W("and", 0, "n13") - 0.1;
    ENVK.push([ti - 0.01, "night"], [ti, "day"], [tk2 - 0.01, "day"], [tk2, "night"]);
    theo.jump(ti, V(-1.6, 0, 1.2)).faceTo(ti, { x: 1, z: 0.3 }).pose(ti, "wave", 0.2).mood(ti, "happy", 0.2).bob(ti + 0.2);
    ana.show(ti, tj).jump(ti, V(0.4, 0, 1.8)).faceTo(ti, { x: -1, z: -0.2 }).pose(ti, "wave", 0.3).mood(ti, "happy", 0.2);
    shot(ti, tj, [[-0.6, 1.6, 5.6], [-0.6, 1.25, 1.5], 38], [[-0.8, 1.58, 5.2], [-0.6, 1.25, 1.5], 36], { dof: 0.35 });
    theo.jump(tj, V(10.4, 0, -7.4)).faceTo(tj, { x: -1, z: -0.4 }).pose(tj, "hold", 0).mood(tj, "content", 0);
    bea.jump(tj, V(8.6, 0, -8.2)).faceTo(tj, { x: 0.8, z: 0.4 }).pose(tj, "facepalm", 0).mood(tj, "embarrassed", 0).pose(tj + 0.8, "relaxed", 0.3).mood(tj + 0.8, "happy", 0.3);
    TRK.push([tj - 0.01, { on: 0, k: 0 }], [tj, { on: 1, k: 1 }], [tk2 - 0.01, { on: 1, k: 1 }], [tk2, { on: 0, k: 0 }]);
    HANDS.push([broom, "theo", tj, tk2]);
    shot(tj, tk2, [[9.6, 1.6, -4.4], [9.4, 1.0, -7.8], 40], [[9.5, 1.55, -4.9], [9.4, 1.0, -7.8], 38], { dof: 0.3 });
    // night: the thread runs on, Bea → the neighbour's house
    theo.jump(tk2, THEO_N).faceTo(tk2, { x: 0.5, z: -1 }).pose(tk2, "relaxed", 0); bea.jump(tk2, BEA_N).faceTo(tk2, { x: 0, z: 1 }).pose(tk2, "holdBoth", 0).mood(tk2, "content", 0);
    TRK.push([tk2 + 0.001, { on: 1, k: 0 }], [T.n15 - 0.01, { on: 1, k: 0 }], [T.n15, { on: 0, k: 0 }]);
    shot(tk2, T.n15, [[2.0, 7.5, 8.0], [9.0, 1.2, -10.0], 48], [[2.8, 7.8, 6.8], [11.5, 1.5, -13.0], 46], { dof: 0.1 });
    card({ text: "1 SANDWICH = 3 LIVES", mood: "title", t0: T.n14, t1: E("n14") + 0.5, zone: "top" });
    // study 2: the cascade, from above
    on("cascade", T.n15, T.s05, 1, 0.2, 0);
    AERIAL(T.n15, T.s05);
    card({ text: "GENEROSITY SPREAD", sub: "2 and even 3 steps away (lab game)", mood: "fact", t0: W("two", 0, "n15"), t1: E("n15") + 0.5, zone: "top" });
    src("Fowler & Christakis (2010)", W("two", 0, "n15"), E("n15") + 0.5);
  }
  // ---------- S05 midpoint: the thickest thread → Kai; the storm; the pull ----------
  {
    const s = T.s05; on("main", s, T.n17, 0.35, 0, 0); on("kai", s, T.n17, 1, 0, 0);
    mo.show(s, D).jump(s, MO0).faceTo(s, { x: 0.5, z: 1 }).pose(s, "relaxed", 0).mood(s, "confused", 0);
    kai.show(s, T.n17).jump(s, KAI_Q).faceTo(s, { x: 0, z: 1 }).pose(s, "relaxed", 0).mood(s, "content", 0);
    shot(s, T.n17, [[-3.2, 3.0, 2.0], [0.4, 1.0, 15.0], 44], [[-2.4, 2.6, 4.2], [0.6, 1.0, 15.2], 40], { dof: 0.2 });
    card({ text: "THE THICKEST THREAD", mood: "plain", t0: W("thickest", 0, "n16"), t1: E("n16") + 0.2, zone: "top" });
    // flashback: eleven years ago, a storm (cool, faded)
    const fb = T.n17; ENVK.push([fb - 0.01, "night"], [fb, "overcast"]); RAINK.push([fb - 0.01, 0], [fb, 1], [T.n18 - 0.01, 1], [T.n18, 0]); grade(fb - 0.01, 1.0, 0.1); grade(fb, 0.55, -0.5);
    kai.show(fb, T.n19).jump(fb, V(0.4, 0.12, 15.6)).faceTo(fb, { x: 0, z: 1 }).pose(fb, "holdBoth", 0).mood(fb, "sad", 0);
    shot(fb, W("waiting", 0, "n17") + 0.6, [[3.4, 1.5, 15.3], [0.4, 1.2, 15.7], 38], [[3.2, 1.48, 15.0], [0.4, 1.2, 15.7], 36], { dof: 0.45 });
    card({ text: "11 YEARS AGO", mood: "plain", t0: T.n17 + 0.1, t1: W("storm", 0, "n17") + 0.6, zone: "top" });
    // at the shop door in the rain
    const td = W("waiting", 0, "n17") + 0.6;
    kai.jump(td, V(-8.6, 0, -6.9)).faceTo(td, { x: -0.2, z: -1 }).pose(td, "holdBoth", 0).mood(td, "sad", 0).mood(W("come", 0, "mo_02"), "surprised", 0.3).mood(W("soup's", 0, "mo_02"), "hopeful", 0.4);
    mo.jump(td, V(-9.1, 0, -8.7)).faceTo(td, { x: 0.15, z: 1 }).pose(td, "relaxed", 0).mood(td, "content", 0).pose(W("come", 0, "mo_02"), "wave", 0.3).mood(W("come", 0, "mo_02"), "happy", 0.3);
    says(mo, "mo_02");
    shot(td, T.n18, [[-6.1, 1.5, -7.6], [-8.9, 1.2, -7.75], 38], [[-6.3, 1.49, -7.7], [-8.9, 1.2, -7.75], 36], { dof: 0.45 });
    // inside: soup; then he stayed and built half the island
    ENVK.push([T.n18 - 0.01, "overcast"], [T.n18, "night"]);
    kai.jump(T.n18, CUS).faceTo(T.n18, { x: 0, z: -1 }).pose(T.n18, "hold", 0).mood(T.n18, "hopeful", 0);
    mo.jump(T.n18, MOS).faceTo(T.n18, { x: 0, z: 1 }).pose(T.n18, "relaxed", 0).mood(T.n18, "happy", 0);
    HANDS.push([soup, "kai", T.n18, W("stayed", 0, "n18") + 0.3]);
    shot(T.n18, W("built", 0, "n18") - 0.15, [[303.3, 1.5, 0.5], [300, 1.22, -0.1], 40], [[303.0, 1.49, 0.4], [300, 1.22, -0.1], 38], { dof: 0.4 });
    card({ text: "HE STAYED", mood: "plain", t0: W("stayed", 0, "n18"), t1: W("built", 0, "n18") - 0.2, zone: "top" });
    const tb = W("built", 0, "n18") - 0.15; grade(tb - 0.01, 0.55, -0.5); grade(tb, 1.05, 0.35); ENVK.push([tb - 0.01, "night"], [tb, "golden"], [T.n19 - 0.01, "golden"], [T.n19, "night"]);
    kai.jump(tb, KAI_Y).faceTo(tb, { x: 0.6, z: -0.8 }).pose(tb, "proud", 0).mood(tb, "proud", 0);
    on("kaiSub", tb, T.s06, 1, 0.2, 0.4);
    AERIAL(tb, T.n19);
    card({ text: "KAI'S HOUSES: 7 OF 13", mood: "fact", t0: W("half", 0, "n18"), t1: T.n19 - 0.1, zone: "top" });
    // back to tonight: Mo pulls
    grade(T.n19 - 0.01, 1.05, 0.35); grade(T.n19, 1.0, 0.1); on("main", T.n19, T.s06, 0.35, 0, 0); on("kai", T.n19, T.s07, 1, 0, 0);
    kai.show(T.n19, tPull + 0.6).jump(T.n19, KAI_Q).faceTo(T.n19, { x: 0, z: 1 }).pose(T.n19, "relaxed", 0).mood(T.n19, "content", 0);
    mo.jump(T.n19, MO0).faceTo(T.n19, { x: 0.5, z: 1 }).pose(T.n19, "point", 0.2).mood(T.n19, "confused", 0).pose(tPull - 0.25, "hold", 0.15).bob(tPull, 0.18).mood(tPull, "surprised", 0.15);
    MO_SIDE(T.n19, tPull + 0.35);
    VANISH.push([0, 0], [T.n20 - 0.5, 0], [E("n20") - 0.2, 1], [tBack + 0.05, 1], [tBack + 1.4, 0]);
    AERIAL(tPull + 0.35, T.n20 - 0.6, { dof: 0.06 });
    shot(T.n20 - 0.6, T.mo_03 - 0.05, [[-9.5, 5.5, -4.5], [-24, 1.6, -12], 50], [[-10.2, 5.6, -4.8], [-24, 1.6, -12], 48], { dof: 0.08 });
    grade(tPull + 0.3, 1.0, 0.1); grade(tPull + 1.2, 0.5, -0.4); grade(tBack + 0.2, 0.5, -0.4); grade(tBack + 1.5, 1.0, 0.1);
    mo.mood(T.mo_03, "terrified", 0.15).pose(T.mo_03, "startle", 0.15); says(mo, "mo_03");
    shot(T.mo_03 - 0.05, T.n21, [[-6.9, 1.45, -8.0], [-9, 1.3, -8.55], 30], [[-7.2, 1.45, -8.0], [-9, 1.3, -8.55], 28], { dof: 0.5 });
    mo.pose(T.n21 + 0.1, "hold", 0.15).bob(tBack, 0.2).mood(tBack + 0.6, "worried", 0.4);
    AERIAL(T.n21, T.s06, { dof: 0.06 });
    card({ text: "GONE", mood: "sad", t0: W("gone", 0, "n20"), t1: E("n20") + 0.4, zone: "top" });
  }
  // ---------- S06 study 3: picture it gone ----------
  {
    const s = T.s06; on("main", s, T.n24, 0.3, 0.6, 0); on("main", T.n24, T.s07, 0.9, 0, 0);
    mo.faceTo(s, { x: 0.3, z: 1 }).pose(s, "relaxed", 0.3).mood(s, "worried", 0).mood(T.n23, "hopeful", 0.6).mood(T.n24, "content", 0.6);
    shot(s, T.n24, [[-6.0, 1.6, -4.6], [-9, 1.25, -8.5], 36], [[-6.5, 1.55, -5.4], [-9, 1.25, -8.5], 34], { dof: 0.35 });
    card({ text: "PICTURE IT NEVER HAPPENING", sub: "lifted mood more than remembering it", mood: "fact", t0: W("imagined", 0, "n22"), t1: W("most", 0, "n23") - 0.2, zone: "top" });
    card({ text: "MOST PEOPLE EXPECTED THE OPPOSITE", mood: "funny", t0: W("most", 0, "n23"), t1: E("n23") + 0.4, zone: "top" });
    src("Koo, Algoe, Wilson & Gilbert (2008)", W("imagined", 0, "n22"), E("n23") + 0.4);
    OVER(T.n24, T.s07, { dof: 0.1 });
  }
  // ---------- S07 dawn: the note; the thread that comes back; takeaway ----------
  {
    const s = T.s07; ENVK.push([s - 0.01, "night"], [s, "dawn"]); grade(s, 1.05, 0.4);
    on("main", s, E("n25") - 0.4, 0.3, 0, 1.6); on("kai", s, E("n25") - 0.4, 0.4, 0, 1.6);
    mo.jump(s, MO0).faceTo(s, { x: 0, z: -1 }).pose(s, "hold", 0).mood(s, "content", 0);
    MO_SIDE(s, T.theo_01 - 0.3, -0.2);
    const ti = T.theo_01 - 0.3; ENVK.push([ti - 0.01, "dawn"], [ti, "day"]);
    mo.jump(ti, MOS).faceTo(ti, { x: 0, z: 1 }).pose(ti, "relaxed", 0).mood(ti, "content", 0).mood(T.theo_01 + 0.3, "surprised", 0.2).pose(W("down", 0, "theo_01") + 0.2, "hold", 0.25).mood(T.n26, "hopeful", 0.4).mood(W("four", 0, "n26"), "crying", 0.5).mood(T.n27 + 0.6, "happy", 0.6);
    theo.show(ti, T.n28).jump(ti, V(300.55, 0, 2.05)).at(T.theo_01 + 0.45, CUS).faceTo(ti, { x: -0.4, z: -1 }).pose(ti, "relaxed", 0).mood(ti, "embarrassed", 0).pose(W("thank", 0, "theo_01"), "give", 0.3).mood(W("wrote", 0, "theo_01"), "hopeful", 0.3).pose(W("down", 0, "theo_01") + 0.3, "relaxed", 0.3).mood(T.n27, "happy", 0.4);
    says(theo, "theo_01");
    HANDS.push([note, "theo", W("thank", 0, "theo_01"), W("down", 0, "theo_01") + 0.25], [note, "mo", W("down", 0, "theo_01") + 0.25, T.n27 + 0.3]);
    shot(ti, E("theo_01") + 0.3, [[301.9, 1.5, 3.1], [300, 1.25, 0.0], 40], [[301.75, 1.49, 2.85], [300, 1.25, 0.0], 38], { dof: 0.4 });
    shot(E("theo_01") + 0.3, T.n27, [[301.4, 1.45, -3.0], [300, 1.35, -1.5], 30], [[301.3, 1.44, -2.85], [300, 1.35, -1.5], 28], { dof: 0.5 });
    card({ text: "3 LINES. READ 4 TIMES.", mood: "plain", t0: W("three", 0, "n26"), t1: E("n26") + 0.3, zone: "right", fixedZone: true, at: { x: 1480, y: 760 } });
    on("back", T.n27, T.n28, 1, 0, 0.2);
    shot(T.n27, T.n28, [[303.6, 1.6, 0.4], [300, 1.25, -0.15], 42], [[303.3, 1.58, 0.3], [300, 1.25, -0.15], 40], { dof: 0.3 });
    card({ text: "THIS ONE POINTED BACK", mood: "calm", t0: W("toward", 0, "n27"), t1: T.n28 - 0.1, zone: "top" });
    // n28: Nia on the quay, morning
    nia.show(T.n28 - 0.05, E("n28") + 0.8).jump(T.n28 - 0.05, NQ).faceTo(T.n28, { x: 0, z: 1 }).pose(T.n28, "explain", 0).mood(T.n28, "content", 0).pose(W("try", 0, "n28"), "hands", 0.3).mood(W("try", 0, "n28"), "hopeful", 0.3).pose(W("studies", 0, "n28"), "give", 0.3).mood(W("studies", 0, "n28"), "happy", 0.3);
    nia.rig.lips.push([T.n28, "n28"]); ENVK.push([T.n28 - 0.01, "day"], [T.n28, "golden"]);
    shot(T.n28 - 0.05, W("studies", 0, "n28") - 0.05, [rp(NQ, -0.8, 1.5, 4.8), rp(NQ, 0, 1.15, 0), 36], [rp(NQ, -0.6, 1.45, 4.1), rp(NQ, 0, 1.15, 0), 34], { dof: 0.35 });
    shot(W("studies", 0, "n28") - 0.05, E("n28") + 0.8, [rp(NQ, 1.3, 1.55, 5.6), rp(NQ, -0.6, 1.15, 0), 36], [rp(NQ, 1.1, 1.52, 5.1), rp(NQ, -0.6, 1.15, 0), 34], { dof: 0.35 });
    card({ text: "TELL ONE PERSON", sub: "what they did that mattered", mood: "calm", t0: W("try", 0, "n28"), t1: W("studies", 0, "n28") - 0.15, zone: "top" });
    card({ text: "THANK-YOU NOTES", sub: "felt better, less awkward than writers expected", mood: "calm", t0: W("studies", 0, "n28"), t1: E("n28") + 0.7, zone: "left", fixedZone: true, at: { x: 560, y: 300 } });
    src("Kumar & Epley (2018)", W("studies", 0, "n28"), E("n28") + 0.7);
  }
  // ---------- S08 close: morning island, faint threads between everyone ----------
  {
    const s = T.s08; ENVK.push([s - 0.01, "golden"], [s, "day"], [D, "golden"]); grade(s, 1.05, 0.35); grade(D, 1.08, 0.6);
    on("web", s, D + 1, 1, 0.5, 0);
    shot(s, D, [[10, 20, 22], [0, 0, -2], 46], [[16, 30, 30], [2, 0, -2], 44], { dof: 0.08, out: "io" });
  }

  // ======================= finalize characters =======================
  for (const id in CAST) { const a = CAST[id];
    a.tr.P.sort((p, q) => p[0] - q[0]); a.tr.P.forEach((k) => { const p = k[1]; if (p.x < 200 && Math.abs(p.y) < 0.01) k[1] = V(p.x, 0.07, p.z); });
    ["pose", "mood", "squash"].forEach((k) => a.rig[k].sort((p, q) => p[0] - q[0])); a.face.sort((p, q) => p[0] - q[0]);
    if (!a.vis.length) a.vis.push([0, 0]);
    const inVis = (t) => a.vis.some(([x, y]) => t >= x && t < y);
    a.b = W3.person({ id, P3: a.tr.P, face: a.face, pref: 1, vis: inVis, rig: Object.assign({}, a.look, { pose: a.rig.pose, mood: a.rig.mood, lips: a.rig.lips, squash: a.rig.squash, scale: a.look.scale || 1 }) }); }
  ENVK.sort((a, b) => a[0] - b[0]); TRK.sort((a, b) => a[0] - b[0]); RAINK.sort((a, b) => a[0] - b[0]); VANISH.sort((a, b) => a[0] - b[0]);
  const camAt = W3.keys(KEYS);
  const TY = SRType.create(hudSvg, { W: 1920, H: 1080, avoid: (t) => W3.faceRects(t, camAt) });
  CARDS.forEach((o) => TY.card(o)); window.__CARDS = TY.cards.map((c) => ({ t: c.t0, mood: c.mood }));
  const rulesCard = K5.rules(hudSvg, Object.assign({ lines: ["Every thread is a life you've touched.", "Brighter thread: it mattered more.", "Pull one, and that moment never happened."], fine: "", size: 40 }, window.__rules));
  const gradeF = K4.grade(document.getElementById("bg"), GK.sort((a, b) => a[0] - b[0]));
  const LF = { day: W3.litF("#FFE6A8", -5, 5, [1.0, 0.98, 0.94], 0.85), golden: W3.litF("#FFB060", -6, 4, [1.0, 0.9, 0.8], 0.95), night: W3.litF("#AFC2FF", 5, 5, [0.72, 0.76, 0.95], 0.8), lamp: W3.litF("#FFD592", 0, 6, [1.0, 0.9, 0.78], 0.85), rain: W3.litF("#C8D2E2", -3, 5, [0.8, 0.84, 0.9], 0.8),
    glow: W3.litF("#FFD27A", 2, 4, [1.08, 1.0, 0.86], 1.0) };
  const lin = (keys, t) => { if (!keys.length) return 0; if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const a = keys[i - 1], b = keys[i], u = (t - a[0]) / Math.max(1e-6, b[0] - a[0]); return lerp(a[1], b[1], u); } return keys[keys.length - 1][1]; };
  const step = (keys, t) => { let v = keys[0][1]; for (const k of keys) if (k[0] <= t) v = k[1]; return v; };

  // ======================= per-frame =======================
  const st = (keys, t) => SR.sampleTrack(keys, t, keys[0][1]);
  const rainG = el("g", { opacity: 0 }, hudSvg), RS = []; for (let i = 0; i < 140; i++) { const r1 = SR.mulberry32(500 + i); const a = r1(), b = r1(), c = r1(); RS.push({ l: el("line", { stroke: "#E4ECF8", "stroke-width": 1.6 + c * 1.6, "stroke-linecap": "round", opacity: 0.35 + 0.4 * c }, rainG), a, b, c }); }
  const hudFx = el("g", {}); hudSvg.insertBefore(hudFx, hudSvg.firstChild);
  const vign = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "url(#ep6vig)", opacity: 0 }, hudFx);
  { const defs = hudSvg.querySelector("defs") || el("defs", {}, hudSvg); const rg = el("radialGradient", { id: "ep6vig", cx: "50%", cy: "48%", r: "60%" }, defs); el("stop", { offset: "55%", "stop-color": "#0B0A12", "stop-opacity": 0 }, rg); el("stop", { offset: "100%", "stop-color": "#0B0A12", "stop-opacity": 0.7 }, rg); }
  const sparks = KAIH.map(() => W3.glow("#FFD27A", 2.2, 0, -50, 0)); sparks.forEach((g) => g.layers.set(1));
  const pins = KAIH.map(() => { const g = el("g", { opacity: 0 }, hudFx); el("circle", { cx: 0, cy: 0, r: 36, fill: "none", stroke: "#FFC94A", "stroke-width": 7 }, g); el("circle", { cx: 0, cy: 0, r: 36, fill: "#FFC94A", opacity: 0.18 }, g); return g; });   // "Kai built this one"
  const tl = gsap.timeline({ paused: true });
  function draw(t) {
    const c = camAt(t), cx = c.p[0], interior = cx > 250; const env = K.envAt(ENVK, t);
    applyEnv(env, interior ? [Math.round(cx / 100) * 100, 0, 0] : [0, 0, 0]);
    const ev = { night: interior ? 1 : env.night, boom: 0, bust: 0, oven2: 0, oven2Bow: 0, sink: 0 };
    town.update(t, ev); inner.update(t, ev); if (inner.setWindowSky) inner.setWindowSky(1); if (inner.setBills) inner.setBills(0);
    // Kai's houses: vanish while the thread is pulled (shrink into the ground with a spark), return when it's pushed back
    const vk = lin(VANISH, t);
    KAIH.forEach((hi, j) => { const h = town.houses[hi]; const u = clamp(vk * 1.6 - j * 0.09, 0, 1), e = ss(u); h.visible = e < 0.995; h.scale.set(1 - 0.25 * e, Math.max(0.001, 1 - e), 1 - 0.25 * e);
      const sp = sparks[j], hl = K.win(t, W("built", 0, "n18") + j * 0.18, T.n19, 0.3, 0.3) * (0.75 + 0.25 * Math.sin(t * 4 + j)), pk = Math.max(Math.sin(Math.PI * clamp(u, 0, 1)), hl); const [hx, hz] = HP[hi]; sp.position.set(hx, 1.6, hz); sp.material.opacity = interior ? 0 : pk * 0.9; sp.scale.setScalar(2 + 4 * pk); });
    // threads
    const kv = (set) => TW[set].reduce((m, [a, b, k, fi, fo]) => Math.max(m, k * K.win(t, a, b, Math.max(fi, 1e-3), Math.max(fo, 1e-3))), 0);
    for (const k in SETS) SETS[k].set(t, { k: interior && k !== "back" ? 0 : !interior && k === "back" ? 0 : kv(k), cam: c.p });
    const tr = st(TRK, t); trays.set(tr.on > 0.5 ? { pos: CAST.bea.b.pos(t), ry: 0, k: tr.k } : null);
    const rk = lin(RAINK, t); rain.update(t, interior ? 0 : rk);
    W3.frame(t, c, { lightFor: (b) => (interior ? LF.lamp : rk > 0.5 ? LF.rain : b === CAST.mo.b && kv("main") + kv("burst") > 0.3 ? LF.glow : env.night > 0.6 ? LF.night : env.sunK > 0.8 ? LF.golden : LF.day) });
    KAIH.forEach((hi, j) => { const a = K.win(t, W("built", 0, "n18") + j * 0.18, T.n19, 0.25, 0.3); pins[j].setAttribute("opacity", interior ? 0 : a.toFixed(3)); if (a > 0 && !interior) { const [hx, hz] = HP[hi], q = W3.proj(hx, 3.2, hz); const k = 1 + 0.12 * Math.sin(t * 5 + j) + 0.4 * (1 - clamp((t - (W("built", 0, "n18") + j * 0.18)) / 0.3, 0, 1)); pins[j].setAttribute("transform", `translate(${q.sx.toFixed(1)},${q.sy.toFixed(1)}) scale(${k.toFixed(3)})`); } });
    const hand = (g, who, on) => { const b = CAST[who].b, v = on && b.hand && b.outer.getAttribute("display") !== "none"; if (v) g.setAttribute("transform", `translate(${b.hand.x.toFixed(1)},${(b.hand.y - 6).toFixed(1)}) scale(${(b.k || 1).toFixed(3)})`); return v; };
    [sandwich, soup, note, broom].forEach((g) => { let v = false; for (const [gg, who, a, b] of HANDS) if (gg === g && t >= a && t < b) v = hand(g, who, true) || v; g.setAttribute("display", v ? "inline" : "none"); });
    if (rulesCard) rulesCard.update(t);
    TY.update(t); tally.update(t);
    gradeF.update(t);
    const rv = interior ? 0 : rk; rainG.setAttribute("opacity", rv.toFixed(3)); if (rv > 0.01) RS.forEach(({ l, a, b, c }) => { const sp = 1500 + c * 900, y = ((b * 1300 + t * sp) % 1300) - 120, x = a * 2100 - 90 + y * 0.12, L = 40 + c * 50; l.setAttribute("x1", x.toFixed(1)); l.setAttribute("y1", y.toFixed(1)); l.setAttribute("x2", (x + L * 0.12).toFixed(1)); l.setAttribute("y2", (y + L).toFixed(1)); });
    const vgk = Math.max(K.win(t, T.n17, T.n19, 0.3, 0.3), K.win(t, tPull + 0.3, tBack + 1.2, 0.4, 0.6) * 0.8, K.win(t, T.n08, T.n10, 0.3, 0.3) * 0.6);
    vign.setAttribute("opacity", vgk.toFixed(3));
  }
  if (window.__WANT_FOLEY) {
    const surfaceAt = (p) => (p.x > 250 ? "wood" : p.z > 14 ? "wood" : "stone");
    const events = W3.foleyScan({ camAt, D, fps: 60, surfaceAt });
    window.__FOLEY = { events, cards: TY.cards.map((c) => ({ t: c.t0, mood: c.mood, zone: c.zone })), burst: [0.45, tGlow], pull: [tPull, tBack], rain: [T.n17, T.n18] };
  }
  W3.compile();
  SR.drive(tl, D, draw);
  window.__timelines["main"] = tl;
  window.__EP4 = { W3, CAST, KEYS, A, camAt, TY }; window.__EP6 = window.__EP4;
})();
