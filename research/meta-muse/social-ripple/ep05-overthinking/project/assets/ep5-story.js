/* Social Ripple ep5: "The Psychology of Overthinking What People Think of You" — the director's file.
   Crumb Island (EP3 sets). Lead: Bea (ink). Host: Nia. Devices: EP4K counter (/7), EP5K thought bubbles + rules card, EP5P trays/broom/sandwich. */
(function () {
  const SR = window.SR, TH = window.THREE, T = window.T, K = window.EP3K, K4 = window.EP4K, K5 = window.EP5K, P5 = window.EP5P; SR.SKIN = "#F1EBDD";
  const { el, clamp } = SR; const lerp = (a, b, k) => a + (b - a) * k;
  const W = (w, nth = 0, line) => { const v = K.W(w, nth, line); return v == null ? (line ? T[line] : 0) : v; };
  const E = (id) => T[id + "_e"], D = T.D;
  const W3 = SR3D.create({ canvas: document.getElementById("bg"), ov: document.getElementById("ov"), width: 1920, height: 1080, samples: 2, ndScale: 1, dofTaps: 14 });
  const applyEnv = K.lights(W3);
  const town = window.EP3.town(W3), inner = window.EP3.interiors(W3), props = window.EP3.props(W3);
  const IA = inner.anchors || {}; const A = Object.assign({}, town.anchors || {}, IA.apt || {});
  (town.occ || []).concat(inner.occ || []).forEach((o) => W3.occ.push(o));
  const V = (x, y, z) => ({ x, y, z }), add = (a, dx = 0, dz = 0, dy = 0) => V(a.x + dx, (a.y || 0) + dy, a.z + dz);
  const rp = (a, dx, dy, dz) => [a.x + dx, (a.y || 0) + dy, a.z + dz];
  const hudSvg = document.getElementById("hud");

  // ======================= places =======================
  const BD = A.beaDoor || V(9, 0, -9.9);                       // bakery door (front faces +z, toward the square)
  const BEA0 = V(9, 0, -8.55), MUMP = V(9.1, 0, -7.35), CUST = V(9.1, 0, -7.55);
  const CROWD = [V(7.2, 0, -6.4), V(8.3, 0, -5.9), V(9.5, 0, -5.7), V(10.6, 0, -6.0), V(11.6, 0, -6.6), V(6.3, 0, -7.2)];
  const FLAT = V(500, 0, 0), SEAT = V(FLAT.x - 0.45, 0, -1.25), NQ = V(0.6, 0.12, 15.2), QB = V(-1.2, 0.12, 15.6);

  // ======================= cast =======================
  function Track(p0) { const P = [[0, p0]]; return { P, at(t, p, e) { P.push([t, p, e]); return this; }, jump(t, p) { P.push([t - 0.002, P[P.length - 1][1], "linear"]); P.push([t, p, "jump"]); return this; } }; }
  const CAST = {};
  function actor(id, look, p0, o = {}) { const tr = Track(p0), face = [[0, o.face || { x: 0, z: 1 }]], rig = { pose: [[0, o.pose || "relaxed", 0]], mood: [[0, o.mood || "content", 0]], lips: [], squash: [[0, 0]] }, vis = [];
    const a = { id, tr, face, rig, vis, look, show(t0, t1) { vis.push([t0, t1]); return a; }, pose(t, n, d = 0.25) { rig.pose.push([t, n, d]); return a; }, mood(t, n, d = 0.25) { rig.mood.push([t, n, d]); return a; },
      faceTo(t, dir) { face.push([t, dir]); return a; }, at(t, p, e) { tr.at(t, p, e); return a; }, jump(t, p) { tr.jump(t, p); return a; }, bob(t, k = 0.12) { rig.squash.push([t - 0.01, 0], [t + 0.08, k], [t + 0.35, 0]); return a; } };
    CAST[id] = a; return a; }
  const says = (a, line) => a.rig.lips.push([T[line], line]);
  const bea = actor("bea", { skin: "ink", color: "#F2C14E", outfit: "apron", hair: "ponytail", hairColor: "#1E1B22", pants: "#6A4A8A", seed: 4 }, BEA0, { face: { x: 0, z: 1 }, mood: "worried" });
  const mum = actor("mum", { skin: "ink", color: "#B07FC0", outfit: "coat", hair: "bun", hairColor: "#9A9AA6", pants: "#4A3A5A", scale: 0.97, seed: 14 }, MUMP, { face: { x: 0, z: -1 } });
  const kai = actor("kai", { color: "#FF8A2A", outfit: "jacket", hair: "cap", hairColor: "#E0B020", pants: "#3A4A63", seed: 6 }, CROWD[0], { face: { x: 0.2, z: -1 } });
  const ana = actor("ana", { color: "#3FA7A0", outfit: "tee", hair: "bun", hairColor: "#5A3A2A", pants: "#2E7A74", seed: 5 }, CROWD[1], { face: { x: 0.1, z: -1 } });
  const theo = actor("theo", { color: "#8A93A6", outfit: "hoodie", hair: "short", hairColor: "#6A4A3A", pants: "#3A4050", seed: 21 }, CROWD[2], { face: { x: -0.1, z: -1 } });
  const finn = actor("finn", { color: "#F4C430", outfit: "coat", hair: "cap", hairColor: "#2E4A6A", pants: "#3A4A63", seed: 11 }, CROWD[3], { face: { x: -0.2, z: -1 } });
  const cust1 = actor("cust1", { color: "#5A7FD8", outfit: "shirt", hair: "short", hairColor: "#3A2A22", pants: "#2A3050", seed: 31 }, CROWD[4], { face: { x: -0.4, z: -1 } });
  const cust2 = actor("cust2", { skin: "ink", color: "#E05A8A", outfit: "dress", hair: "long", hairColor: "#1E1B22", pants: "#4A3A5A", seed: 32 }, CROWD[5], { face: { x: 0.5, z: -1 } });
  const mo = actor("mo", { color: "#E8834A", outfit: "apron", hair: "short", hairColor: "#3A2A22", pants: "#3A4A63", seed: 7 }, V(4.8, 0, -6.6), { face: { x: 1, z: 0 } });
  const nia = actor("nia", { skin: "ink", color: "#E8634A", outfit: "jacket", hair: "curly", hairColor: "#1E1B22", pants: "#2E3A5A", scale: 1.04, seed: 9 }, NQ, { face: { x: 0, z: 1 } });
  const crowd = [kai, ana, theo, finn, cust1, cust2];

  // ======================= camera =======================
  const KEYS = [];
  function shot(t0, t1, A0, B0, o = {}) { if (KEYS.length && KEYS[KEYS.length - 1].t >= t0 - 0.002) KEYS[KEYS.length - 1].t = t0 - 0.003; KEYS.push(Object.assign({ t: t0, p: A0[0], l: A0[1], f: A0[2], e: o.in || "cut", dof: o.dof ?? 0.25, fn: o.fn ?? 50, ff: o.ff ?? 320 })); KEYS.push({ t: t1 - 0.001, p: B0[0], l: B0[1], f: B0[2], e: o.out || "lin", dof: o.dof2 ?? o.dof ?? 0.25, fn: o.fn ?? 50, ff: o.ff ?? 320 }); }

  // ======================= props + devices =======================
  const trays = P5.trays(W3, 3), broom = P5.broomIcon(hudSvg), sandwich = P5.sandwichIcon(hudSvg);
  const TRK = [[0, { on: 0, k: 0 }]];                        // tray state keys: on (visible), k (crash progress)
  const CK = [[0, 0, 0]], GK = [[0, 1.0, 0.1]], ENVK = [[0, "day"]];
  const day = (t, d, h) => CK.push([t, d, h]), grade = (t, s, w) => GK.push([t, s, w]);
  const CARDS = [], card = (o) => CARDS.push(o), src = (text, t0, t1) => CARDS.push({ text, t0, t1, zone: "source", mood: "plain" });
  const THOUGHTS = [], thought = (o) => THOUGHTS.push(o);
  const FREEZE = []; // [t0,t1] windows where the scene is "frozen" (desaturated, crowd still)

  // ============================================================================================
  //                                           SCENES
  // ============================================================================================
  // ---------- S01 cold open: the crash, frozen mid-air ----------
  {
    const tf = 0.9;  // freeze moment
    bea.show(0, T.s02).jump(0.001, V(9, 0, -9.3)).at(0.55, BEA0).faceTo(0, { x: 0, z: 1 }).pose(0, "holdBoth", 0).mood(0, "content", 0).pose(0.62, "startle", 0.12).mood(0.6, "terrified", 0.12);
    crowd.forEach((c, i) => c.show(0, T.s02).mood(0, "neutral", 0).mood(0.75, "surprised", 0.12).faceTo(0.7, { x: (9 - CROWD[i].x) * 0.3, z: -1 }));
    TRK.push([0.55, { on: 1, k: 0 }], [tf, { on: 1, k: 0.36 }], [T.s02 - 0.01, { on: 1, k: 0.36 }], [T.s02, { on: 0, k: 0 }]);
    FREEZE.push([tf, T.s02]); day(tf, 3, 0); day(T.s02, 0, 0);
    shot(0, tf, [[11.2, 1.45, -7.2], [9.0, 1.1, -8.6], 38], [[11.0, 1.45, -7.35], [9.0, 1.1, -8.6], 36], { dof: 0.3 });
    shot(tf, T.n02, [[12.6, 1.7, -4.4], [9.0, 1.2, -7.8], 42], [[12.2, 1.65, -4.8], [9.0, 1.2, -7.8], 40], { dof: 0.2 });   // slow drift around the frozen moment
    shot(T.n02, T.s02, [[9.0, 2.2, -2.6], [9.0, 1.2, -8.0], 44], [[9.0, 2.0, -3.6], [9.0, 1.2, -8.0], 42], { dof: 0.15 });
    window.__rewind = [E("n02") - 0.2, T.s02 + 0.1];
  }
  // ---------- S02 Bea + the rules ----------
  {
    const s = T.s02; ENVK.push([s, "dawn"], [T.n04, "day"]);
    bea.show(s, T.s03).jump(s, V(9, 0, -9.0)).faceTo(s, { x: 0, z: 1 }).pose(s, "holdBoth", 0).mood(s, "content", 0).mood(W("replays", 0, "n03"), "embarrassed", 0.3).mood(T.n04, "sleepy", 0.2).mood(W("hear", 0, "n04"), "surprised", 0.2);
    TRK.push([s, { on: 1, k: 0 }], [T.n04 - 0.05, { on: 1, k: 0 }], [T.n04, { on: 0, k: 0 }]);
    shot(s, T.n04, [[10.3, 1.5, -6.6], [9.75, 1.2, -9.0], 36], [[10.0, 1.45, -7.0], [9.75, 1.2, -9.0], 34], { dof: 0.4 });
    card({ text: "BEA", sub: "best cinnamon buns on Crumb Island", mood: "plain", t0: W("bea", 0, "n03"), t1: W("replays", 0, "n03") - 0.1, zone: "right", fixedZone: true });
    card({ text: "REPLAYS: EVERYTHING", sub: "most nights", mood: "funny", t0: W("replays", 0, "n03"), t1: E("n03") + 0.2, zone: "right", fixedZone: true });
    // morning: Bea at her window, hearing for the first time
    shot(T.n04, T.n05, [[9.6, 1.6, -6.0], [9.0, 1.3, -9.4], 34], [[9.4, 1.55, -6.6], [9.0, 1.3, -9.4], 32], { dof: 0.5 });
    // rules card (wide, softly blurred square behind)
    shot(T.n05, T.s03, [[0, 6, 18], [0, 1, 0], 44], [[0, 5.6, 16.5], [0, 1, 0], 44], { dof: 0.9 });
    window.__rules = { t0: T.n05 + 0.1, t1: E("n05") + 0.6, rowT: [W("one", 0, "n05"), W("two", 0, "n05"), W("three", 0, "n05")] };
  }
  // ---------- S03 day 1: two thoughts, both about the buns ----------
  {
    const s = T.s03; day(T.n06, 1, 0); day(T.mo_t1 + 0.2, 1, 1); day(T.finn_t1 + 0.2, 1, 2);
    bea.show(s, T.s04).jump(s, V(9, 0, -9.0)).faceTo(s, { x: 0, z: 1 }).pose(s, "crossed", 0).mood(s, "worried", 0).pose(T.mo_t1 - 0.4, "relaxed", 0.3).mood(T.mo_t1, "surprised", 0.2).mood(T.n07, "confused", 0.3).mood(T.n08, "hopeful", 0.4);
    mo.show(T.mo_t1 - 1.6, E("mo_t1") + 1.2).jump(T.mo_t1 - 1.6, V(6.2, 0, -6.6)).at(E("mo_t1") + 1.2, V(10.8, 0, -6.4)).faceTo(T.mo_t1 - 1.6, { x: 1, z: 0 }).mood(T.mo_t1, "happy", 0.2);
    finn.show(T.finn_t1 - 1.4, E("finn_t1") + 1.0).jump(T.finn_t1 - 1.4, V(11.8, 0, -6.3)).at(E("finn_t1") + 1.0, V(7.6, 0, -6.6)).faceTo(T.finn_t1 - 1.4, { x: -1, z: 0 }).mood(T.finn_t1, "starstruck", 0.2);
    thought({ text: "Ooh. Cinnamon.", who: mo, t0: T.mo_t1 - 0.05, t1: E("mo_t1") + 0.5, side: 1 }); thought({ text: "Those buns look incredible.", who: finn, t0: T.finn_t1 - 0.05, t1: E("finn_t1") + 0.5, side: -1 });
    shot(s, T.n07, [[9.0, 1.7, -2.4], [9.0, 1.15, -7.8], 42], [[9.0, 1.65, -2.9], [9.0, 1.15, -7.8], 40], { dof: 0.2 });
    card({ text: "THOUGHTS ABOUT BEA: 0", sub: "about her buns: 2", mood: "funny", t0: W("both", 0, "n07"), t1: E("n07") + 0.2, zone: "top" });
    shot(T.n07, T.n08, [[10.2, 1.5, -6.9], [9.0, 1.25, -9.0], 34], [[10.0, 1.48, -7.2], [9.0, 1.25, -9.0], 32], { dof: 0.45 });
    // spotlight effect: Bea alone in a spotlight cone, the street dims
    shot(T.n08, T.s04, [[9.0, 2.0, -4.6], [9.0, 1.2, -9.0], 38], [[9.0, 1.9, -5.2], [9.0, 1.2, -9.0], 36], { dof: 0.3 });
    window.__spot = [T.n08 + 0.2, E("n08") + 0.4];
    card({ text: "THE SPOTLIGHT EFFECT", mood: "title", t0: W("spotlight", 0, "n08"), t1: W("study", 0, "n08") - 0.1, zone: "top" });
    card({ text: "GUESSED: 46%   ACTUAL: 23%", sub: "people who remembered the embarrassing T-shirt", mood: "fact", t0: W("guessed", 0, "n08"), t1: E("n08") + 0.35, zone: "top" });
    src("Gilovich, Medvec & Savitsky (2000), Study 1", W("guessed", 0, "n08"), E("n08") + 0.35);
  }
  // ---------- S04 day 2: "you too" ----------
  {
    const s = T.s04; day(s, 2, 2);
    bea.show(s, T.s05).jump(s, V(9, 0, -9.0)).faceTo(s, { x: 0, z: 1 }).pose(s, "give", 0).mood(s, "happy", 0);
    cust1.show(s, E("n11") + 0.4).jump(s, CUST).faceTo(s, { x: 0, z: -1 }).mood(s, "happy", 0).pose(s, "relaxed", 0);
    says(cust1, "cust1"); says(bea, "bea_01"); bea.mood(W("wait", 0, "bea_01"), "embarrassed", 0.15).pose(W("wait", 0, "bea_01"), "facepalm", 0.2).bob(W("wait", 0, "bea_01"), 0.1);
    cust1.mood(T.bea_01 + 0.3, "neutral", 0.3).faceTo(E("bea_01") + 0.2, { x: 0.3, z: 1 }).at(E("bea_01") + 0.3, CUST).at(E("n11"), V(9.6, 0, -4.4));
    shot(s, E("bea_01") + 0.3, [[12.6, 1.55, -8.25], [9.05, 1.25, -8.25], 34], [[12.3, 1.53, -8.25], [9.05, 1.25, -8.25], 32], { dof: 0.4 });
    // the replay loop: Bea at night, replaying; the critic bubble
    shot(E("bea_01") + 0.3, T.n10, [[FLAT.x + 0.6, 1.25, 1.6], [SEAT.x, 1.0, SEAT.z], 32], [[FLAT.x + 0.5, 1.22, 1.35], [SEAT.x, 1.0, SEAT.z], 30], { dof: 0.5 });
    bea.jump(E("bea_01") + 0.3, SEAT).faceTo(E("bea_01") + 0.3, { x: -0.6, z: -0.8 }).pose(E("bea_01") + 0.3, "sit", 0).mood(E("bea_01") + 0.3, "exhausted", 0).jump(T.n10, V(9, 0, -9.0)).pose(T.n10, "relaxed", 0).faceTo(T.n10, { x: 0, z: 1 });
    ENVK.push([E("bea_01") + 0.29, "day"], [E("bea_01") + 0.3, "night"], [T.n10 - 0.01, "night"], [T.n10, "day"]);
    card({ text: "REPLAYED: 40×", mood: "funny", t0: W("forty", 0, "n09") - 0.2, t1: T.bea_c1 - 0.05, zone: "top" });
    thought({ text: "He thinks you're so weird.", who: bea, t0: T.bea_c1 - 0.05, t1: E("bea_c1") + 0.5, style: "critic", side: 1 });
    // what he actually thought: nothing (empty bubble)
    shot(T.n10, E("n11") + 0.3, [[9.2, 1.5, -2.6], [9.4, 1.2, -5.0], 36], [[9.3, 1.48, -2.9], [9.5, 1.2, -5.0], 34], { dof: 0.35 });
    thought({ text: "...", who: cust1, t0: W("nothing", 0, "n11"), t1: E("n11") + 0.3, side: 1 });
    card({ text: "HIS THOUGHTS ABOUT BEA: NONE", mood: "funny", t0: W("forgotten", 0, "n11"), t1: E("n11") + 0.25, zone: "top" });
    shot(E("n11") + 0.3, T.s05, [[10.2, 1.5, -6.9], [9.0, 1.25, -9.0], 34], [[10.0, 1.48, -7.2], [9.0, 1.25, -9.0], 32], { dof: 0.45 });
    card({ text: "ILLUSION OF TRANSPARENCY", sub: "your nerves show less than you think", mood: "fact", t0: W("illusion", 0, "n12"), t1: E("n12") + 0.4, zone: "top" });
    src("Gilovich, Savitsky & Medvec (1998)", W("illusion", 0, "n12"), E("n12") + 0.4);
    bea.mood(T.n12, "hopeful", 0.4);
  }
  // ---------- S05 day 3: the crash unfreezes ----------
  {
    const s = T.s05, tu = T.n13 + 0.9; day(s, 3, 2);
    bea.show(s, T.s06).jump(s, BEA0).faceTo(s, { x: 0, z: 1 }).pose(s, "startle", 0).mood(s, "terrified", 0).mood(tu + 0.9, "embarrassed", 0.3).pose(tu + 0.9, "facepalm", 0.3).pose(T.n14, "relaxed", 0.4).mood(T.n15, "laughing", 0.3);
    crowd.forEach((c, i) => c.show(s, T.s06).jump(s, CROWD[i]).faceTo(s, { x: (9 - CROWD[i].x) * 0.3, z: -1 }).mood(s, "surprised", 0));
    kai.mood(T.kai_t1, "laughing", 0.2); ana.mood(T.ana_t1, "worried", 0.2); theo.mood(T.theo_t1, "determined", 0.2);
    TRK.push([s - 0.01, { on: 0, k: 0 }], [s, { on: 1, k: 0.36 }], [tu, { on: 1, k: 0.36 }], [tu + 0.9, { on: 1, k: 1 }], [T.s06 - 0.01, { on: 1, k: 1 }], [T.s06, { on: 0, k: 0 }]);
    FREEZE.push([s, tu]);
    shot(s, tu + 1.0, [[12.6, 1.7, -4.4], [9.0, 1.2, -7.8], 42], [[12.3, 1.65, -4.7], [9.0, 1.2, -7.8], 40], { dof: 0.2 });
    day(T.kai_t1 + 0.2, 3, 3); day(T.ana_t1 + 0.2, 3, 4); day(T.theo_t1 + 0.2, 3, 5);
    thought({ text: "Oof. That happens to me all the time.", who: kai, t0: T.kai_t1 - 0.05, t1: E("theo_t1") + 1.0, side: -1 });
    thought({ text: "Is she okay?", who: ana, t0: T.ana_t1 - 0.05, t1: E("theo_t1") + 1.0, side: -1, scale: 0.9 });
    thought({ text: "I should help.", who: theo, t0: T.theo_t1 - 0.05, t1: E("theo_t1") + 1.0, side: 1, scale: 0.9 });
    shot(tu + 1.0, T.n14, [[9.0, 2.6, -2.4], [9.0, 1.1, -7.0], 44], [[9.0, 2.5, -2.8], [9.0, 1.1, -7.0], 42], { dof: 0.15 });
    card({ text: "THEY JUDGE LESS HARSHLY", sub: "than we expect them to", mood: "fact", t0: W("harshly", 0, "n14") - 0.3, t1: E("n14") + 0.3, zone: "lower", fixedZone: true });
    src("Savitsky, Epley & Gilovich (2001)", W("harshly", 0, "n14") - 0.3, E("n14") + 0.3);
    shot(T.n14, T.n15, [[9.0, 5.6, 1.4], [9.0, 0.1, -6.2], 40], [[9.0, 5.3, 0.8], [9.0, 0.1, -6.2], 40], { dof: 0.1 });
    // n15: Theo + broom, Mo + sandwich (nobody knows why)
    theo.at(T.n15 - 0.2, CROWD[2]).at(W("broom", 0, "n15"), V(9.6, 0, -7.6)).faceTo(T.n15, { x: -0.5, z: -1 }).pose(W("broom", 0, "n15"), "hold", 0.2).mood(T.n15, "content", 0.3);
    mo.show(T.n15 - 0.3, T.s06).jump(T.n15 - 0.3, V(6.0, 0, -7.0)).at(W("sandwich", 0, "n15"), V(8.1, 0, -7.7)).faceTo(T.n15 - 0.3, { x: 1, z: -0.3 }).pose(W("sandwich", 0, "n15"), "give", 0.2).mood(T.n15, "proud", 0.3);
    shot(T.n15, T.s06, [[9.4, 3.8, -1.4], [9.0, 0.15, -6.6], 40], [[9.4, 3.6, -1.8], [9.0, 0.15, -6.6], 38], { dof: 0.2 });
    window.__broom = [W("broom", 0, "n15"), T.s06]; window.__sand = [W("sandwich", 0, "n15"), T.s06];
    card({ text: "WHY THE SANDWICH, MO?", mood: "question", t0: W("nobody", 0, "n15"), t1: T.s06 - 0.1, zone: "lower", fixedZone: true });
  }
  // ---------- S06 day 4 midpoint: Mum ----------
  {
    const s = T.s06; day(s, 4, 5); day(T.mum_t1 + 0.3, 4, 6); grade(s, 0.95, 0.15);
    bea.show(s, T.s07).jump(s, V(9, 0, -8.55)).faceTo(s, { x: 0, z: 1 }).pose(s, "relaxed", 0).mood(s, "worried", 0).mood(T.n18, "worried", 0.2).mood(T.mum_t1 + 0.6, "surprised", 0.25).mood(E("mum_t1") + 0.4, "crying", 0.6);
    mum.show(s, T.s07).jump(s, V(11.0, 0, -5.4)).at(T.n17, MUMP).faceTo(s, { x: -0.6, z: -1 }).faceTo(T.n17, { x: 0, z: -1 }).mood(s, "content", 0).pose(T.n18, "relaxed", 0).mood(T.mum_t1, "hopeful", 0.3);
    shot(s, T.n17, [[12.8, 1.7, -3.2], [9.6, 1.1, -6.8], 40], [[12.4, 1.65, -3.6], [9.6, 1.1, -6.8], 38], { dof: 0.2 });
    shot(T.n17, T.n18, [[10.8, 1.55, -6.0], [9.05, 1.25, -8.4], 34], [[10.6, 1.53, -6.2], [9.05, 1.25, -8.4], 32], { dof: 0.45 });
    shot(T.n18, E("mum_t1") + 1.6, [[7.6, 1.5, -6.0], [9.1, 1.25, -7.3], 32], [[7.8, 1.49, -6.3], [9.1, 1.25, -7.3], 30], { dof: 0.5 });
    thought({ text: "I'm so proud of her. I've just never known how to say it.", who: mum, t0: T.mum_t1 - 0.05, t1: E("mum_t1") + 1.5, side: -1 });
    window.__silence = [T.n18 + 0.3, T.mum_t1];
  }
  // ---------- S07 days 5-6 ----------
  {
    const s = T.s07; day(s, 5, 6); day(T.cust2_t1 + 0.2, 5, 7); grade(s, 1.0, 0.1);
    bea.show(s, T.s08).jump(s, V(9, 0, -9.0)).faceTo(s, { x: 0, z: 1 }).pose(s, "give", 0).mood(s, "happy", 0).mood(T.cust2_t1 + 0.3, "sad", 0.25).pose(T.n20, "relaxed", 0.3).mood(W("buns", 0, "n20"), "determined", 0.4);
    cust2.show(s, E("n20")).jump(s, CUST).faceTo(s, { x: 0, z: -1 }).mood(s, "neutral", 0).pose(s, "relaxed", 0);
    shot(s, T.cust2_t1 + 0.2, [[12.6, 1.55, -8.25], [9.05, 1.25, -8.25], 34], [[12.3, 1.53, -8.25], [9.05, 1.25, -8.25], 32], { dof: 0.4 });
    thought({ text: "The buns are a bit dry today.", who: cust2, t0: T.cust2_t1 - 0.05, t1: E("cust2_t1") + 0.8, side: 1 });
    shot(T.cust2_t1 + 0.2, T.n21, [[10.2, 1.5, -6.9], [9.0, 1.25, -9.0], 34], [[10.0, 1.48, -7.2], [9.0, 1.25, -9.0], 32], { dof: 0.45 });
    card({ text: "ABOUT THE BUNS.", sub: "not about Bea", mood: "calm", t0: W("buns", 0, "n20"), t1: E("n20") + 0.3, zone: "top" });
    // day 6: the quay at golden hour, a hug
    day(T.n21, 6, 7); ENVK.push([T.n21 - 0.01, "day"], [T.n21, "golden"]); grade(T.n21, 1.05, 0.5);
    bea.jump(T.n21, add(QB, 0.5, 0)).faceTo(T.n21, { x: -1, z: 0.2 }).pose(T.n21, "relaxed", 0).mood(T.n21, "worried", 0).pose(W("missed", 0, "n21"), "hug", 0.4).mood(W("missed", 0, "n21"), "hopeful", 0.4);
    mum.show(T.n21, T.s08).jump(T.n21, add(QB, -0.45, 0)).faceTo(T.n21, { x: 1, z: 0.2 }).mood(T.n21, "content", 0).pose(W("missed", 0, "n21") + 0.15, "hug", 0.4).mood(W("missed", 0, "n21") + 0.2, "joy", 0.3);
    shot(T.n21, T.s08, [[QB.x, 1.55, QB.z + 4.2], [QB.x, 1.15, QB.z], 38], [[QB.x + 0.3, 1.5, QB.z + 3.6], [QB.x, 1.15, QB.z], 36], { dof: 0.35 });
    card({ text: "THE BEAUTIFUL MESS EFFECT", sub: "we judge our own vulnerability harshest", mood: "calm", t0: W("researchers", 0, "n22"), t1: E("n22") + 0.5, zone: "top" });
    src("Bruk, Scholl & Bless (2018)", W("researchers", 0, "n22"), E("n22") + 0.5);
  }
  // ---------- S08 day 7: the fine print ----------
  {
    const s = T.s08; day(s, 7, 7); ENVK.push([s - 0.01, "golden"], [s, "night"]);
    bea.show(s, T.n27).jump(s, SEAT).faceTo(s, { x: -0.6, z: -0.8 }).pose(s, "sit", 0).mood(s, "content", 0).mood(T.n24, "confused", 0.3).mood(T.n25 + 0.5, "surprised", 0.3).mood(T.bea_c2, "sad", 0.3).mood(T.bea_c4, "crying", 0.4).mood(T.n26 + 0.8, "hopeful", 0.8);
    shot(s, T.n24, [[FLAT.x + 1.4, 1.6, 2.4], [SEAT.x, 1.0, SEAT.z], 38], [[FLAT.x + 1.2, 1.55, 2.0], [SEAT.x, 1.0, SEAT.z], 36], { dof: 0.3 });
    window.__reveal = [T.n24, E("n25") + 1.1];
    shot(T.n24, E("n25") + 1.1, [[0, 6, 18], [0, 1, 0], 44], [[0, 5.8, 17.2], [0, 1, 0], 44], { dof: 0.9 });
    // her own count: the tally rolls up from 7 into the thousands
    const r0 = T.n25 + 0.4; for (let i = 0; i <= 14; i++) day(r0 + i * 0.09, 7, Math.round(7 + Math.pow(i / 14, 2.2) * 3405));
    shot(E("n25") + 1.1, T.n27, [[FLAT.x + 0.55, 1.25, 1.5], [SEAT.x, 1.05, SEAT.z], 32], [[FLAT.x + 0.45, 1.22, 1.25], [SEAT.x, 1.05, SEAT.z], 30], { dof: 0.5 });
    [["They're laughing at you.", "bea_c2", 1], ["You always mess things up.", "bea_c3", -1], ["Why are you like this?", "bea_c4", 1]].forEach(([tx, id, sd], i) =>
      thought({ text: tx, who: bea, t0: T[id] - 0.05, t1: E("bea_c4") + 0.6, style: "critic", side: sd, scale: 0.92, lift: i }));
    grade(T.bea_c2 - 0.3, 1.0, 0.1); grade(T.bea_c2, 0.55, -0.6); grade(E("bea_c4") + 0.5, 0.55, -0.6); grade(T.n26 + 1.0, 0.95, 0.2);
    window.__critic = [T.bea_c2 - 0.1, E("bea_c4") + 0.8];
    card({ text: "THE HARSHEST VOICE", sub: "was her own", mood: "sad", t0: W("harshest", 0, "n26"), t1: E("n26") + 0.5, zone: "top" });
    // n27: Nia on the quay, lamp-lit
    nia.show(T.n27 - 0.05, E("n27") + 0.8).jump(T.n27 - 0.05, NQ).faceTo(T.n27, { x: 0, z: 1 }).pose(T.n27, "explain", 0).mood(T.n27, "content", 0).pose(W("answering", 0, "n27"), "hands", 0.3).mood(W("answering", 0, "n27"), "hopeful", 0.3).pose(W("experiments", 0, "n27"), "give", 0.3).mood(W("experiments", 0, "n27"), "happy", 0.3);
    nia.rig.lips.push([T.n27, "n27"]); ENVK.push([T.n27 - 0.01, "night"], [T.n27, "dusk"]);
    shot(T.n27 - 0.05, W("experiments", 0, "n27") - 0.05, [rp(NQ, -0.8, 1.5, 4.8), rp(NQ, 0, 1.15, 0), 36], [rp(NQ, -0.6, 1.45, 4.1), rp(NQ, 0, 1.15, 0), 34], { dof: 0.35 });
    shot(W("experiments", 0, "n27") - 0.05, E("n27") + 0.8, [rp(NQ, 1.3, 1.55, 5.6), rp(NQ, -0.6, 1.15, 0), 36], [rp(NQ, 1.1, 1.52, 5.1), rp(NQ, -0.6, 1.15, 0), 34], { dof: 0.35 });
    card({ text: "ANSWER IT LIKE A FRIEND WOULD", mood: "calm", t0: W("answering", 0, "n27"), t1: W("experiments", 0, "n27") - 0.15, zone: "top" });
    card({ text: "KINDNESS TO YOURSELF", sub: "raised motivation to improve (lab experiments)", mood: "calm", t0: W("experiments", 0, "n27"), t1: E("n27") + 0.7, zone: "left", fixedZone: true });
    src("Breines & Chen (2012)", W("experiments", 0, "n27"), E("n27") + 0.7);
  }
  // ---------- S09 day 8: that's okay ----------
  {
    const s = T.s09; day(s, 8, 0); ENVK.push([s - 0.01, "dusk"], [s, "day"], [D, "golden"]); grade(s, 1.05, 0.35); grade(D, 1.08, 0.6);
    bea.show(s, D).jump(s, V(9, 0, -9.3)).at(T.bea_02 - 0.4, BEA0).faceTo(s, { x: 0, z: 1 }).pose(s, "holdBoth", 0).mood(s, "content", 0).bob(T.bea_02 - 0.1, 0.16).mood(T.bea_02, "surprised", 0.15).mood(W("okay", 0, "bea_02"), "laughing", 0.3).mood(E("bea_02") + 0.6, "happy", 0.4);
    says(bea, "bea_02"); TRK.push([s - 0.01, { on: 0, k: 0 }], [s, { on: 1, k: 0 }], [D, { on: 1, k: 0 }]);
    ana.show(s, D).jump(s, V(7.4, 0, -6.2)).faceTo(s, { x: 0.6, z: -1 }).mood(s, "happy", 0).pose(T.n29, "wave", 0.3); theo.show(s, D).jump(s, V(10.7, 0, -6.0)).faceTo(s, { x: -0.6, z: -1 }).mood(s, "happy", 0);
    shot(s, E("bea_02") + 0.4, [[9.0, 1.5, -4.6], [9.0, 1.15, -8.4], 38], [[9.0, 1.48, -5.0], [9.0, 1.15, -8.4], 36], { dof: 0.3 });
    shot(E("bea_02") + 0.4, D, [[9.0, 1.8, -4.2], [9.0, 1.1, -8.4], 38], [[16, 30, 30], [4, 0, -4], 42], { in: "cut", dof: 0.1, out: "io" });
  }

  // ======================= finalize characters =======================
  for (const id in CAST) { const a = CAST[id];
    a.tr.P.sort((p, q) => p[0] - q[0]); a.tr.P.forEach((k) => { const p = k[1]; if (p.x < 200 && Math.abs(p.y) < 0.01) k[1] = V(p.x, 0.07, p.z); });
    ["pose", "mood", "squash"].forEach((k) => a.rig[k].sort((p, q) => p[0] - q[0])); a.face.sort((p, q) => p[0] - q[0]);
    if (!a.vis.length) a.vis.push([0, 0]);
    const inVis = (t) => a.vis.some(([x, y]) => t >= x && t < y);
    a.b = W3.person({ id, P3: a.tr.P, face: a.face, pref: 1, vis: inVis, rig: Object.assign({}, a.look, { pose: a.rig.pose, mood: a.rig.mood, lips: a.rig.lips, squash: a.rig.squash, scale: a.look.scale || 1 }) }); }
  ["bea", "mum"].forEach((id) => (CAST[id].b.noClip = true));
  ENVK.sort((a, b) => a[0] - b[0]); TRK.sort((a, b) => a[0] - b[0]);
  const camAt = W3.keys(KEYS);
  const TY = SRType.create(hudSvg, { W: 1920, H: 1080, avoid: (t) => W3.faceRects(t, camAt) });
  CARDS.forEach((o) => TY.card(o)); window.__CARDS = TY.cards.map((c) => ({ t: c.t0, mood: c.mood }));
  const thoughtsU = THOUGHTS.map((o) => K5.thought(hudSvg, o));
  const rulesCard = window.__rules ? K5.rules(hudSvg, Object.assign({ lines: ["If someone thinks about you, you hear it.", "It lasts seven days."], fine: "*Every thought about you. Including your own.", reveal: window.__reveal }, window.__rules)) : null;
  const counter = K4.counter(hudSvg, CK.sort((a, b) => a[0] - b[0]), { of: 7, label: "HEARD" });
  const gradeF = K4.grade(document.getElementById("bg"), GK.sort((a, b) => a[0] - b[0]));
  const LF = { day: W3.litF("#FFE6A8", -5, 5, [1.0, 0.98, 0.94], 0.85), golden: W3.litF("#FFB060", -6, 4, [1.0, 0.9, 0.8], 0.95), night: W3.litF("#AFC2FF", 5, 5, [0.72, 0.76, 0.95], 0.8), lamp: W3.litF("#FFD592", 0, 6, [1.0, 0.9, 0.78], 0.85), spot: W3.litF("#FFF4D8", 0, 8, [1.08, 1.04, 0.98], 1.0) };

  // ======================= per-frame =======================
  const st = (keys, t) => SR.sampleTrack(keys, t, keys[0][1]);
  const hudFx = el("g", {}); hudSvg.insertBefore(hudFx, hudSvg.firstChild);
  const spotV = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "url(#ep5spot)", opacity: 0 }, hudFx);
  { const defs = hudSvg.querySelector("defs") || el("defs", {}, hudSvg); const rg = el("radialGradient", { id: "ep5spot", cx: "50%", cy: "48%", r: "45%" }, defs); el("stop", { offset: "35%", "stop-color": "#0B0A12", "stop-opacity": 0 }, rg); el("stop", { offset: "100%", "stop-color": "#0B0A12", "stop-opacity": 0.85 }, rg); }
  const rewindG = el("g", { opacity: 0 }, hudFx); for (let i = 0; i < 9; i++) el("rect", { x: 0, y: i * 120 + 20, width: 1920, height: 8, fill: "#FFFFFF", opacity: 0.35 }, rewindG);
  const rewindTxt = el("text", { x: 1840, y: 1010, "text-anchor": "end", "font-family": "Outfit", "font-weight": 900, "font-size": 64, fill: "#FFFFFF", opacity: 0.9 }, rewindG); rewindTxt.textContent = "◀◀ MONDAY";
  const tl = gsap.timeline({ paused: true });
  function draw(t) {
    const c = camAt(t), cx = c.p[0], interior = cx > 250; const env = K.envAt(ENVK, t);
    applyEnv(env, interior ? [Math.round(cx / 100) * 100, 0, 0] : [0, 0, 0]);
    const ev = { night: interior ? 1 : env.night, boom: 0, bust: 0, oven2: 0, oven2Bow: 0, sink: 0 };
    town.update(t, ev); inner.update(t, ev); if (inner.setWindowSky) inner.setWindowSky(1); if (inner.setBills) inner.setBills(0);
    const tr = st(TRK, t); trays.set(tr.on > 0.5 ? { pos: CAST.bea.b.pos(t), ry: 0, k: tr.k } : null);
    const spot = window.__spot && t > window.__spot[0] && t < window.__spot[1];
    W3.frame(t, c, { lightFor: (b) => (spot && b === CAST.bea.b ? LF.spot : interior ? LF.lamp : env.night > 0.6 ? LF.night : env.sunK > 0.8 ? LF.golden : LF.day) });
    // hand icons
    const hand = (g, who, win) => { const b = CAST[who].b, on = win && t > win[0] && t < win[1] && b.hand && b.outer.getAttribute("display") !== "none"; g.setAttribute("display", on ? "inline" : "none"); if (on) g.setAttribute("transform", `translate(${b.hand.x.toFixed(1)},${(b.hand.y - 6).toFixed(1)}) scale(${(b.k || 1).toFixed(3)})`); };
    hand(broom, "theo", window.__broom); hand(sandwich, "mo", window.__sand);
    thoughtsU.forEach((u) => u.update(t)); if (rulesCard) rulesCard.update(t);
    TY.update(t); counter.update(t); if (t > D - 3) counter.g.setAttribute("opacity", clamp((D - 0.5 - t) / 2.5, 0, 1));
    // looks: freeze (desaturated, cool), spotlight vignette, critic tint, rewind streaks
    gradeF.update(t); const bg = document.getElementById("bg");
    const fz = FREEZE.some(([a, b]) => t >= a && t < b); if (fz) bg.style.filter = "saturate(0.35) brightness(0.95) contrast(1.05)";
    const sv = window.__spot ? K.win(t, window.__spot[0], window.__spot[1], 0.5, 0.5) : 0, cr = window.__critic ? K.win(t, window.__critic[0], window.__critic[1], 0.4, 0.8) : 0;
    spotV.setAttribute("opacity", Math.max(sv * 0.9, cr * 0.95).toFixed(3));
    const rw = window.__rewind ? K.win(t, window.__rewind[0], window.__rewind[1], 0.15, 0.2) : 0; rewindG.setAttribute("opacity", rw.toFixed(3)); if (rw > 0) rewindG.setAttribute("transform", `translate(0,${((t * 900) % 120).toFixed(1)})`);
  }
  if (window.__WANT_FOLEY) {
    const surfaceAt = (p) => (p.x > 250 ? "wood" : p.z > 14 ? "wood" : "stone");
    const events = W3.foleyScan({ camAt, D, fps: 60, surfaceAt });
    window.__FOLEY = { events, cards: TY.cards.map((c) => ({ t: c.t0, mood: c.mood, zone: c.zone })), crash: [0.62, T.n13 + 0.9], freeze: [0.9, T.s02] };
  }
  W3.compile();
  SR.drive(tl, D, draw);
  window.__timelines["main"] = tl;
  window.__EP4 = { W3, CAST, KEYS, A, camAt, TY }; window.__EP5 = window.__EP4;
})();
