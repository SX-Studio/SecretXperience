/* Social Ripple ep4: "What 30 Days of Saying Hello Does to a Lonely Person" — the director's file.
   World = SR3D + Crumb Island (EP3 sets). Host = Nia. Devices = EP4K counter/meter/grade, EP4P gull/calendar/shield/soup. Words = SRType. */
(function () {
  const SR = window.SR, TH = window.THREE, T = window.T, K = window.EP3K, P4 = window.EP4P, K4 = window.EP4K; SR.SKIN = "#F1EBDD";
  const { el, clamp } = SR; const lerp = (a, b, k) => a + (b - a) * k;
  const W = (w, nth = 0, line) => { const v = K.W(w, nth, line); return v == null ? (line ? T[line] : 0) : v; };
  const E = (id) => T[id + "_e"], D = T.D;
  const W3 = SR3D.create({ canvas: document.getElementById("bg"), ov: document.getElementById("ov"), width: 1920, height: 1080, samples: 2, ndScale: 1, dofTaps: 14 });
  K.P.overcast = Object.assign({}, K.P.day, { top: "#5E6C80", mid: "#8E9AAA", hor: "#BCC3CC", gnd: "#45606E", fog: "#9AA6B4", sun: "#D8E0EA", sunI: 1.0, hS: "#C2CCDA", hG: "#525266", hI: 1.35, stars: 0, sunK: 0 });
  const applyEnv = K.lights(W3);
  const town = window.EP3.town(W3), inner = window.EP3.interiors(W3), props = window.EP3.props(W3), FX = SRFX.create(W3);
  const IA = inner.anchors || {}; const A = Object.assign({}, town.anchors || {}, IA.apt || {});
  (town.occ || []).concat(inner.occ || []).forEach((o) => W3.occ.push(o));
  const V = (x, y, z) => ({ x, y, z }), add = (a, dx = 0, dz = 0, dy = 0) => V(a.x + dx, (a.y || 0) + dy, a.z + dz);
  const hudSvg = document.getElementById("hud");

  // ======================= places =======================
  // bench frames: a = along the bench, f = toward the fountain (out of the seat). Sitters face f; cameras look from the side / 3-4 so the 2D rigs read as seated
  const BC = V(-3.54, 0, 3.54), FD = { x: 0.7071, z: -0.7071 }, AX = { x: 0.7071, z: 0.7071 };
  const bp = (a, f, y = 0) => [BC.x + AX.x * a + FD.x * f, y, BC.z + AX.z * a + FD.z * f], bv = (a, f) => V(BC.x + AX.x * a + FD.x * f, 0, BC.z + AX.z * a + FD.z * f);
  const FC = V(3.54, 0, 3.54), FF = { x: -0.7071, z: -0.7071 }, FA = { x: 0.7071, z: -0.7071 };
  const fp = (a, f, y = 0) => [FC.x + FA.x * a + FF.x * f, y, FC.z + FA.z * a + FF.z * f], fv = (a, f) => V(FC.x + FA.x * a + FF.x * f, 0, FC.z + FA.z * a + FF.z * f);
  const cp = (a, y, f) => bp(a, f, y), cfp = (a, y, f) => fp(a, f, y);   // camera points: (along, height, out)
  const TB = bv(0, 0.04), FB = fv(0, 0.04), AP = bv(0.95, 0.9), PE = bv(3.4, 1.7);   // Theo's seat, Finn's seat, Ana's hello spot, Ana's walk-past end
  const toC = (p) => { const l = Math.hypot(p.x, p.z); return { x: -p.x / l, z: -p.z / l }; };
  const MOD = A.moDoor || V(-9, 0, -9.9), ANAD = A.anaDoor || V(-11.7, 0, 12.65), FLAT = V(500, 0, 0);
  const HILL = V(-30, 6, -32), LD = V(-29.06, 6, -30.99), OUT = { x: 0.684, z: 0.73 };   // lighthouse door + outward direction
  const PIER = V(0, 0.45, 27.5);

  // ======================= tracks + cast =======================
  function Track(p0) { const P = [[0, p0]]; return { P, at(t, p, e) { P.push([t, p, e]); return this; }, jump(t, p) { P.push([t - 0.002, P[P.length - 1][1], "linear"]); P.push([t, p, "jump"]); return this; } }; }
  const CAST = {};
  function actor(id, look, p0, o = {}) { const tr = Track(p0), face = [[0, o.face || { x: 1, z: 0 }]], rig = { pose: [[0, o.pose || "relaxed", 0]], mood: [[0, o.mood || "content", 0]], lips: [], look: [[0, { x: 0, y: 0 }]], squash: [[0, 0]] }, vis = [];
    const a = { id, tr, face, rig, vis, look, show(t0, t1) { vis.push([t0, t1]); return a; }, pose(t, n, d = 0.25) { rig.pose.push([t, n, d]); return a; }, mood(t, n, d = 0.25) { rig.mood.push([t, n, d]); return a; },
      faceTo(t, dir) { face.push([t, dir]); return a; }, at(t, p, e) { tr.at(t, p, e); return a; }, jump(t, p) { tr.jump(t, p); return a; },
      nod(t, k = 0.1) { rig.squash.push([t - 0.01, 0], [t + 0.08, k], [t + 0.3, 0]); return a; } };
    CAST[id] = a; return a; }
  const says = (a, line) => a.rig.lips.push([T[line], line]);
  const theo = actor("theo", { color: "#8A93A6", outfit: "hoodie", hair: "short", hairColor: "#6A4A3A", pants: "#3A4050", seed: 21 }, TB, { face: toC(TB), pose: "sit", mood: "sad" });
  const ana = actor("ana", { color: "#3FA7A0", outfit: "tee", hair: "bun", hairColor: "#5A3A2A", pants: "#2E7A74", seed: 5 }, V(-8, 0, 7), { mood: "happy" });
  const mo = actor("mo", { color: "#E8834A", outfit: "apron", hair: "short", hairColor: "#3A2A22", pants: "#3A4A63", seed: 7 }, add(MOD, 0.4, 0.5), { face: { x: 0.3, z: 1 } });
  const finn = actor("finn", { color: "#F4C430", outfit: "coat", hair: "cap", hairColor: "#2E4A6A", pants: "#3A4A63", seed: 11 }, FB, { face: toC(FB), pose: "sit", mood: "sad" });
  const nia = actor("nia", { skin: "ink", color: "#E8634A", outfit: "jacket", hair: "curly", hairColor: "#1E1B22", pants: "#2E3A5A", scale: 1.04, seed: 9 }, V(0, 0, 2.7), { face: { x: 0, z: 1 } });
  const coms = [["c1", "#5A7FD8", "jacket", "short", null], ["c2", "#B05AC8", "dress", "long", "ink"], ["c3", "#7DBA5A", "shirt", "cap", null], ["c4", "#F2A23A", "tee", "ponytail", "ink"]].map(([id, color, outfit, hair, skin], i) =>
    actor(id, Object.assign({ color, outfit, hair, hairColor: "#2A1A12", pants: "#3A4A63", seed: 30 + i }, skin ? { skin } : {}), add(PIER, [-0.9, -0.35, 0.35, 0.9][i], [0, 0.2, -0.1, 0.15][i]), { face: { x: [1, -1, 1, -1][i] * 0.2, z: 1 }, mood: "neutral" }));

  // ======================= camera =======================
  const KEYS = [];
  function shot(t0, t1, A0, B0, o = {}) { if (KEYS.length && KEYS[KEYS.length - 1].t >= t0 - 0.002) KEYS[KEYS.length - 1].t = t0 - 0.003; KEYS.push(Object.assign({ t: t0, p: A0[0], l: A0[1], f: A0[2], e: o.in || "cut", dof: o.dof ?? 0.25, fn: o.fn ?? 50, ff: o.ff ?? 320 })); KEYS.push({ t: t1 - 0.001, p: B0[0], l: B0[1], f: B0[2], e: o.out || "lin", dof: o.dof2 ?? o.dof ?? 0.25, fn: o.fn ?? 50, ff: o.ff ?? 320 }); }
  const rp = (a, dx, dy, dz) => [a.x + dx, (a.y || 0) + dy, a.z + dz];

  // ======================= props =======================
  const gull = P4.gull(W3), cal = P4.calendar(W3), shield = P4.shield(W3);
  const CALP = A.calendar || V(FLAT.x - 1.65, 1.64, -2.48); cal.group.position.set(CALP.x, CALP.y, CALP.z + 0.05);
  const rings = []; const ring = (t0, at, col = "#FFC24A", size = 9, dur = 2.4) => { const r = props.makeRipple(col); W3.scene.add(r.group); rings.push({ r, t0, at, size, dur }); };
  const rain = FX.rain({ center: V(-4, 7, 2), size: V(34, 14, 34), n: 1400, speed: 11, len: 0.45 });
  const rainHill = FX.rain({ center: V(-28.5, 12, -29.5), size: V(14, 12, 14), n: 700, speed: 11, len: 0.45 });
  const soup = P4.soupIcon(hudSvg);

  // ======================= devices + words =======================
  const CK = [[0, 0, 0]], GK = [[0, 0.55, -0.6]], ENVK = [[0, "day"]], NIGHTW = [[0, 1]], RAINK = [[0, 0]], SHK = [[0, { k: 0, a: 0 }]], GULLK = [];
  const day = (t, d, h) => CK.push([t, d, h]), grade = (t, s, w) => GK.push([t, s, w]);
  let TY = null; const CARDS = []; const card = (o) => CARDS.push(o), src = (text, t0, t1) => CARDS.push({ text, t0, t1, zone: "source", mood: "plain" });

  // ============================================================================================
  //                                           SCENES
  // ============================================================================================
  // ---------- S01 hook ----------
  {
    const tM = W("moved", 0, "n01"), tL = W("longest", 0, "n01"), tG = W("seagull", 0, "n01");
    theo.show(0, T.s09).show(T.theo_03 - 0.4, D).mood(0, "sad");
    shot(0, tM - 0.05, [cp(5.5, 2.6, 2.3), cp(0, 0.4, 0.7), 38], [cp(4.6, 2.2, 2.0), cp(0, 0.4, 0.7), 36], { dof: 0.15 });
    shot(tM - 0.05, tL - 0.1, [cp(2.4, 1.2, 1.0), cp(0, 0.88, 0.2), 34], [cp(2.2, 1.18, 0.95), cp(0, 0.88, 0.2), 32], { dof: 0.5 });
    GULLK.push([0, null], [tL - 0.15, { x: bp(-0.6, 0)[0], y: 0.5, z: bp(-0.6, 0)[2], ry: 0.785, flap: 0 }]);
    shot(tL - 0.1, T.ana_01 - 0.25, [cp(2.4, 1.2, 1.2), cp(-0.3, 0.8, 0.2), 36], [cp(2.2, 1.18, 1.15), cp(-0.3, 0.8, 0.2), 34], { dof: 0.45 });
    card({ text: "LONGEST CHAT: 1 SEAGULL", mood: "funny", t0: tG, t1: T.ana_01 - 0.25, zone: "top" });
    // Ana walks past: "Morning!"
    ana.show(T.ana_01 - 1.2, T.n03 + 2.5).jump(T.ana_01 - 1.2, bv(-3.8, 1.7)).at(T.ana_01 + 1.6, PE).faceTo(T.ana_01 - 1.2, { x: 0.71, z: 0.71 }).pose(T.ana_01 - 0.1, "wave", 0.2).pose(E("ana_01") + 0.3, "relaxed", 0.3).mood(T.ana_01, "joy");
    says(ana, "ana_01");
    GULLK.push([T.ana_01 + 0.1, { x: bp(-0.6, 0)[0], y: 0.5, z: bp(-0.6, 0)[2], ry: 0.6, flap: 0, hop: 1 }], [T.ana_01 + 0.4, { x: bp(-1.2, 1.4)[0], y: 1.6, z: bp(-1.2, 1.4)[2], ry: -0.4, flap: 1 }], [T.ana_01 + 1.4, { x: bp(-4, 6)[0], y: 5, z: bp(-4, 6)[2], ry: -0.4, flap: 1 }], [T.ana_01 + 1.45, null]);
    shot(T.ana_01 - 0.25, T.n02 + 0.4, [cp(4.2, 1.6, 3.2), cp(0, 0.9, 0.4), 40], [cp(3.8, 1.6, 3.0), cp(0.3, 0.9, 0.6), 40], { dof: 0.2 });
    // promise
    shot(T.n02 + 0.4, T.n03 - 0.05, [rp(PE, -1.6, 1.4, 2.4), rp(PE, 0, 1.15, 0), 36], [rp(PE, -1.3, 1.4, 2.0), rp(PE, 0, 1.15, 0), 34], { dof: 0.4 });
    ana.faceTo(T.n02 + 0.3, { x: -0.6, z: 0.8 }).mood(T.n02 + 0.3, "hopeful").pose(W("starting", 0, "n02"), "hipsHands", 0.3);
    card({ text: "1 HELLO. EVERY DAY. 30 DAYS.", mood: "hype", t0: W("once", 0, "n02"), t1: T.n03 - 0.05, zone: "top" });
    // n03: rules, the calendar, the flash-forward
    const tK = W("keep", 0, "n03"), tB = W("because", 0, "n03");
    shot(T.n03 - 0.05, tK - 0.05, [cp(-6.5, 2.6, 4.2), cp(0, 0.8, 0.4), 40], [cp(-6.0, 2.4, 3.9), cp(0, 0.8, 0.4), 40], { dof: 0.1 });
    ana.at(T.n03, PE).at(T.n03 + 2.4, V(1.8, 0, 8.8)).faceTo(T.n03, { x: 0.3, z: 1 }).pose(T.n03, "relaxed", 0.3);
    shot(tK - 0.05, tB - 0.05, [rp(cal.group.position, 0.25, 0.1, 1.1), rp(cal.group.position, 0, 0, 0), 30], [rp(cal.group.position, 0.1, 0.05, 0.8), rp(cal.group.position, 0, 0, 0), 28], { dof: 0.6, fn: 20 });
    // flash-forward: day 30, golden, Theo standing mid-hello (cut before we see who to)
    const ff = tB - 0.05; theo.jump(ff, V(1.2, 0, 3.4)).faceTo(ff, { x: 1, z: 0.2 }).pose(ff, "wave", 0.15).mood(ff, "happy", 0.1);
    theo.jump(E("n03") + 0.3, TB).faceTo(E("n03") + 0.3, toC(TB)).pose(E("n03") + 0.3, "sit", 0).mood(E("n03") + 0.3, "sad", 0);
    shot(ff, E("n03") + 0.3, [rp(V(1.2, 0, 3.4), -1.5, 1.35, 1.8), rp(V(1.2, 0, 3.4), 0.2, 1.25, 0), 32], [rp(V(1.2, 0, 3.4), -1.15, 1.35, 1.35), rp(V(1.2, 0, 3.4), 0.2, 1.25, 0), 30], { dof: 0.7 });
    day(ff, 30, 30); day(E("n03") + 0.3, 0, 0);
    ENVK.push([ff - 0.01, "day"], [ff, "golden"], [E("n03") + 0.29, "golden"], [E("n03") + 0.3, "day"]);
    grade(ff - 0.01, 0.55, -0.6); grade(ff, 1.12, 0.65); grade(E("n03") + 0.29, 1.12, 0.65); grade(E("n03") + 0.3, 0.55, -0.55);
    window.__flash = [E("n03") + 0.05, E("n03") + 0.45];
    card({ text: "DAY 30: ???", mood: "question", t0: ff + 0.2, t1: E("n03") + 0.25, zone: "top" });
  }
  // ---------- S02 title ----------
  {
    shot(T.s02, T.s03, [[38, 30, 60], [0, 0, 0], 40], [[26, 22, 44], [-2, 0, 2], 40], { dof: 0 });
    card({ text: "30 DAYS OF HELLO", sub: "a story built on real research", mood: "title", t0: T.s02 + 0.15, t1: T.s03 - 0.1, zone: "center", size: 92 });
  }
  // ---------- S03 Nia: stakes + validation ----------
  {
    const tH = W("half", 0, "n04"), tN = W("nothing", 0, "n04"), tU = W("hunger", 0, "n04");
    nia.show(T.s03, E("n04") + 0.4).pose(T.s03, "relaxed").pose(T.n04 + 0.2, "explain", 0.3).pose(tN - 0.1, "hipsHands", 0.3).pose(tU - 0.1, "give", 0.3).mood(T.s03, "happy").mood(tN, "hopeful", 0.3).mood(tU, "content", 0.3);
    nia.lips = 1; nia.rig.lips.push([T.n04, "n04"]);
    shot(T.s03, tN - 0.05, [[0.9, 1.5, 7.6], [0, 1.15, 2.7], 38], [[0.7, 1.45, 6.6], [0, 1.15, 2.7], 36], { dof: 0.3 });
    shot(tN - 0.05, E("n04") + 0.4, [[-0.9, 1.4, 5.0], [0, 1.25, 2.7], 34], [[-0.7, 1.38, 4.4], [0, 1.25, 2.7], 32], { dof: 0.45 });
    card({ text: "NIA", sub: "your guide", mood: "plain", t0: T.n04 + 0.1, t1: tH - 0.15, zone: "left", size: 54 });
    card({ text: "ABOUT 1 IN 2 US ADULTS", sub: "say they experience loneliness", mood: "sad", t0: tH, t1: tN - 0.1, zone: "top" });
    src("US Surgeon General Advisory (2023)", tH, tN - 0.1);
    card({ text: "NOTHING IS BROKEN", mood: "calm", t0: tN, t1: tU - 0.1, zone: "top" });
    card({ text: "LONELINESS IS A SIGNAL", sub: "like hunger: you need people", mood: "calm", t0: tU, t1: E("n04") + 0.35, zone: "top" });
    grade(T.s03, 0.62, -0.45);
  }
  // ---------- S04 day 1 + the guarded brain ----------
  {
    day(T.n06, 1, 0); day(T.ana_02 + 0.3, 1, 1); grade(T.s04, 0.55, -0.6);
    ana.show(T.s04, E("n07") + 1.5).jump(T.s04, bv(-4.0, 1.7)).at(T.ana_02 - 0.2, AP).at(E("n07") - 0.4, AP).at(E("n07") + 1.4, bv(4.5, 2.2))
      .faceTo(T.s04, { x: 0.71, z: 0.71 }).faceTo(T.ana_02 - 0.25, { x: -1, z: -0.05 }).faceTo(E("n07") - 0.4, { x: 0.71, z: 0.71 })
      .pose(T.ana_02, "wave", 0.2).pose(E("ana_02") + 0.2, "relaxed", 0.3).mood(T.ana_02, "joy", 0.2).mood(W("nothing", 0, "n07"), "embarrassed", 0.3);
    says(ana, "ana_02");
    theo.look; theo.mood(T.s04, "sad").faceTo(T.s04, toC(TB));
    shot(T.s04, T.ana_02 - 0.2, [cp(5.6, 1.7, 1.6), cp(-0.5, 0.9, 0.3), 40], [cp(5.1, 1.65, 1.5), cp(-0.3, 0.9, 0.3), 40], { dof: 0.15 });
    shot(T.ana_02 - 0.2, T.n07 + 0.1, [cp(3.6, 1.6, 1.6), cp(0.45, 1.0, 0.6), 38], [cp(3.3, 1.58, 1.5), cp(0.45, 1.0, 0.6), 36], { dof: 0.4 });
    shot(T.n07 + 0.1, E("n07") + 0.3, [cp(-1.8, 1.0, 0.85), cp(0, 0.92, 0.1), 30], [cp(-1.65, 1.0, 0.8), cp(0, 0.92, 0.1), 28], { dof: 0.6 });
    // n08–n09: the shield
    const tA = W("alert", 0, "n08"), tS = W("smoke", 0, "n08"), tO = W("outside", 0, "n09"), tI = W("inside", 0, "n09");
    SHK.push([tA - 0.3, { k: 0, a: 0 }], [tA + 0.6, { k: 1, a: 0 }], [tS - 0.1, { k: 1, a: 0 }], [tS + 0.3, { k: 1, a: 1 }], [E("n08"), { k: 1, a: 1 }], [E("n08") + 0.4, { k: 1, a: 0.3 }], [E("n09"), { k: 1, a: 0.2 }], [E("n09") + 0.4, { k: 0, a: 0 }]);
    shot(E("n07") + 0.3, tO - 0.05, [cp(3.6, 1.45, 1.7), cp(0, 0.95, 0.1), 38], [cp(3.2, 1.42, 1.6), cp(0, 0.95, 0.1), 36], { dof: 0.35 });
    card({ text: "LONELY BRAIN: ON GUARD", sub: "extra alert to rejection", mood: "alert", t0: tA, t1: tO - 0.15, zone: "top" });
    src("Theory: Cacioppo & Hawkley (2009)", tA, tO - 0.15);
    shot(tO - 0.05, tI - 0.05, [cp(-6.5, 2.4, 4.2), cp(0, 0.8, 0.3), 42], [cp(-6.1, 2.3, 4.0), cp(0, 0.8, 0.3), 42], { dof: 0.1 });
    card({ text: "OUTSIDE: LOOKS COLD", mood: "sad", t0: tO, t1: tI - 0.1, zone: "top" });
    shot(tI - 0.05, E("n09") + 0.5, [cp(1.95, 1.1, 0.95), cp(0, 0.98, 0.12), 34], [cp(1.8, 1.1, 0.9), cp(0, 0.98, 0.12), 32], { dof: 0.6 });
    card({ text: "INSIDE: PROTECTION", mood: "calm", t0: tI, t1: E("n09") + 0.45, zone: "top" });
    theo.mood(tI, "worried", 0.4);
  }
  // ---------- S05 days 2–3, Mo's window ----------
  {
    const tNod = W("nod", 0, "n10");
    day(T.n10, 2, 1); day(tNod, 2, 2); grade(T.s05, 0.6, -0.45);
    ana.show(T.n10 - 0.1, E("n10") + 0.3).jump(T.n10 - 0.1, bv(-4.0, 1.7)).at(tNod + 0.2, bv(0.6, 1.6)).at(E("n10") + 0.4, bv(4.5, 1.8)).faceTo(T.n10, { x: 0.71, z: 0.71 }).pose(tNod - 0.4, "wave", 0.2).pose(tNod + 0.5, "relaxed", 0.3).mood(T.n10, "happy");
    theo.mood(T.n10, "neutral", 0.3).nod(tNod + 0.05, 0.12).mood(E("n10"), "sad", 0.5);
    shot(T.n10 - 0.1, E("n10") + 0.3, [cp(3.6, 1.25, 2.4), cp(0, 0.9, 0.6), 38], [cp(3.3, 1.25, 2.2), cp(0, 0.9, 0.6), 36], { dof: 0.35 });
    card({ text: "+1 NOD (TINY)", mood: "funny", t0: W("counting", 0, "n10"), t1: E("n10") + 0.3, zone: "top" });
    // day 3: Mo watching from his door with a sandwich
    day(T.n11, 3, 2); day(W("watching", 0, "n11"), 3, 3);
    mo.show(T.n11, E("n12") + 0.6).jump(T.n11, add(MOD, 0.6, 0.4)).faceTo(T.n11, { x: 0.55, z: 0.84 }).pose(T.n11, "hold", 0).mood(T.n11, "curious");
    shot(T.n11, T.mo_01 - 0.05, [rp(MOD, 2.6, 1.5, 3.4), rp(MOD, 0.5, 1.2, 0.3), 38], [rp(MOD, 2.3, 1.48, 3.0), rp(MOD, 0.5, 1.2, 0.3), 36], { dof: 0.35 });
    says(mo, "mo_01"); mo.mood(T.mo_01, "hopeful", 0.2).mood(W("didn't", 0, "mo_01"), "sad", 0.2).mood(W("okay", 0, "mo_01"), "determined", 0.25).pose(W("okay", 0, "mo_01"), "point", 0.25);
    shot(T.mo_01 - 0.05, E("mo_01") + 0.2, [rp(MOD, 1.6, 1.45, 2.0), rp(MOD, 0.6, 1.4, 0.4), 32], [rp(MOD, 1.45, 1.45, 1.8), rp(MOD, 0.6, 1.4, 0.4), 30], { dof: 0.5 });
    mo.pose(T.n12, "crossed", 0.3).mood(T.n12, "proud", 0.3);
    shot(E("mo_01") + 0.2, E("n12") + 0.6, [rp(MOD, 1.2, 1.4, 1.5), rp(MOD, 0.6, 1.35, 0.4), 30], [rp(MOD, 1.0, 1.42, 1.25), rp(MOD, 0.6, 1.38, 0.4), 28], { dof: 0.55 });
    card({ text: "MO IS INVESTED.", mood: "funny", t0: T.n12 + 0.1, t1: E("n12") + 0.55, zone: "top" });
  }
  // ---------- S06 the research, day 7 "hey" ----------
  {
    day(T.n13, 5, 4); grade(T.s06, 0.66, -0.32);
    ana.show(T.s06, E("n13") + 0.2).jump(T.s06, add(ANAD, 0.4, 0.9)).faceTo(T.s06, { x: 0.4, z: 1 }).pose(T.s06, "hold", 0).mood(T.s06, "worried");
    shot(T.s06, E("n13") + 0.2, [rp(ANAD, 1.6, 1.4, 3.6), rp(ANAD, 0.4, 1.15, 0.9), 36], [rp(ANAD, 1.3, 1.38, 3.1), rp(ANAD, 0.4, 1.15, 0.9), 34], { dof: 0.4 });
    card({ text: "WE EXPECT: AWKWARD", mood: "sad", t0: W("expect", 0, "n13"), t1: E("n13") + 0.15, zone: "top" });
    // commuters on the pier
    const tC = W("chat", 0, "n14"), tEn = W("enjoyed", 0, "n14"), tP = W("predicted", 0, "n14");
    coms.forEach((c, i) => { c.show(T.n14 - 0.05, E("n14") + 0.3).mood(T.n14, ["tired", "neutral", "tired", "neutral"][i]).faceTo(T.n14, { x: [1, -1, 1, -1][i] * 0.25, z: 1 }); });
    coms[1].faceTo(tC, { x: 1, z: 0.2 }).mood(tC + 0.2, "happy", 0.3).pose(tC + 0.1, "give", 0.3); coms[2].faceTo(tC + 0.15, { x: -1, z: 0.2 }).mood(tC + 0.35, "joy", 0.3);
    coms[0].faceTo(tEn, { x: 1, z: 0.3 }).mood(tEn + 0.2, "happy", 0.3); coms[3].faceTo(tEn + 0.1, { x: -1, z: 0.3 }).mood(tEn + 0.3, "happy", 0.3);
    shot(T.n14 - 0.05, tP - 0.05, [rp(PIER, 1.2, 1.55, 5.2), rp(PIER, 0, 1.1, 0), 40], [rp(PIER, 0.9, 1.5, 4.5), rp(PIER, 0, 1.1, 0), 38], { dof: 0.3 });
    card({ text: "TALKED TO A STRANGER", sub: "enjoyed the ride more", mood: "fact", t0: tEn, t1: tP - 0.1, zone: "top" });
    shot(tP - 0.05, E("n14") + 0.3, [rp(PIER, -2.4, 1.45, 4.4), rp(PIER, -1.5, 1.2, 0), 36], [rp(PIER, -2.2, 1.45, 4.0), rp(PIER, -1.5, 1.2, 0), 34], { dof: 0.4 });
    card({ text: "PREDICTED: THE OPPOSITE", mood: "question", t0: tP, t1: E("n14") - 0.35, zone: "left", fixedZone: true });
    src("Epley & Schroeder (2014)", tEn, E("n14") + 0.25);
    // Mo's hatch: a warm little chat
    day(T.n15, 6, 5); day(T.mo_02 + 0.3, 6, 6);
    const MH = add(MOD, 0.3, 0.4);
    mo.show(T.n15, E("ana_03") + 0.3).jump(T.n15, MH).faceTo(T.n15, { x: 0.5, z: 0.85 }).pose(T.n15, "relaxed", 0).mood(T.n15, "happy");
    ana.show(T.n15, E("ana_03") + 1.6).jump(T.n15, add(MH, 0.9, 1.25)).faceTo(T.n15, { x: -0.6, z: -0.8 }).pose(T.n15, "relaxed").mood(T.n15, "content");
    shot(T.n15, T.mo_02 - 0.05, [rp(MH, 3.2, 1.6, 3.0), rp(MH, 0.5, 1.15, 0.6), 38], [rp(MH, 2.9, 1.55, 2.6), rp(MH, 0.5, 1.15, 0.6), 36], { dof: 0.3 });
    card({ text: "A SHORT, WARM CHAT", sub: "better mood than rushing", mood: "fact", t0: W("short", 0, "n15"), t1: E("n15") + 0.1, zone: "top" });
    src("Sandstrom & Dunn (2014)", W("short", 0, "n15"), E("n15") + 0.1);
    says(mo, "mo_02"); mo.pose(T.mo_02, "give", 0.3).mood(T.mo_02, "joy", 0.2); says(ana, "ana_03"); ana.mood(T.ana_03, "joy", 0.2).pose(T.ana_03, "hipsHands", 0.3);
    shot(T.mo_02 - 0.05, E("ana_03") + 0.3, [rp(MH, 3.3, 1.5, 0.9), rp(MH, 0.45, 1.25, 0.6), 34], [rp(MH, 3.05, 1.5, 0.85), rp(MH, 0.45, 1.25, 0.6), 32], { dof: 0.4 });
    // "Theo sees that."
    theo.mood(T.n16, "curious", 0.4);
    shot(E("ana_03") + 0.3, W("seven", 0, "n16") - 0.05, [[-2.2, 1.45, 5.0], [-8.2, 1.1, -9.0], 34], [[-2.35, 1.42, 4.7], [-8.2, 1.1, -9.0], 32], { dof: 0.35, fn: 6 });
    // day 7: "...Hey."
    const t7 = W("seven", 0, "n16"); day(t7, 7, 6); day(T.theo_01, 7, 7);
    ana.jump(t7 - 0.05, bv(-4.0, 1.7)).at(T.theo_01 - 0.3, AP).at(E("theo_01") + 0.7, AP).at(E("n17") + 0.2, V(1.2, 0, 8.6))
      .faceTo(t7, { x: 0.71, z: 0.71 }).faceTo(T.theo_01 - 0.35, { x: -1, z: -0.05 }).faceTo(E("theo_01") + 0.7, { x: 0.5, z: 0.9 }).pose(T.theo_01 - 0.5, "wave", 0.2).pose(T.theo_01 + 0.1, "startle", 0.15).pose(E("theo_01") + 0.6, "relaxed", 0.4)
      .mood(t7, "happy").mood(T.theo_01 + 0.1, "starstruck", 0.15).mood(T.n17 + 0.2, "embarrassed", 0.3).mood(W("scream", 0, "n17"), "laughing", 0.2);
    ana.show(t7 - 0.05, E("n17") + 0.6); ana.rig.squash.push([W("scream", 0, "n17") - 0.01, 0], [W("scream", 0, "n17") + 0.1, 0.16], [W("scream", 0, "n17") + 0.4, 0]);
    theo.mood(T.theo_01 - 0.2, "neutral", 0.3).pose(T.theo_01, "sit", 0); says(theo, "theo_01");
    shot(t7 - 0.05, T.theo_01 - 0.1, [cp(5.6, 1.6, 1.8), cp(0, 0.9, 0.4), 40], [cp(5.2, 1.55, 1.7), cp(0, 0.9, 0.5), 40], { dof: 0.15 });
    shot(T.theo_01 - 0.1, E("theo_01") + 0.5, [cp(-2.05, 1.05, 0.85), cp(0, 0.96, 0.1), 32], [cp(-1.9, 1.05, 0.8), cp(0, 0.96, 0.1), 30], { dof: 0.6 });
    card({ text: "FIRST WORD!", mood: "hype", t0: E("theo_01") + 0.1, t1: E("theo_01") + 1.4, zone: "top" });
    shot(E("theo_01") + 0.5, E("n17") + 0.6, [[1.6, 1.4, 10.6], [0.5, 0.95, 5.6], 36], [[1.8, 1.4, 11.0], [1.0, 0.95, 6.6], 36], { dof: 0.3 });
    card({ text: "SHE IS FINE. TOTALLY FINE.", mood: "funny", t0: W("scream", 0, "n17"), t1: E("n17") + 0.55, zone: "top" });
  }
  // ---------- S07 days 10–14, doubt ----------
  {
    const t10 = W("ten", 0, "n18"), t12 = W("twelve", 0, "n18"), t14 = W("fourteen", 0, "n18");
    day(t10, 10, 10); day(t12, 12, 12); day(t14, 14, 14); grade(T.s07, 0.72, -0.2);
    const pass = (t0, t1, from, to) => { const dx = to.x - from.x, dz = to.z - from.z, dl = Math.hypot(dx, dz) || 1; ana.show(t0, t1).jump(t0, from).at(t1, to).faceTo(t0, { x: dx / dl, z: dz / dl }).pose(t0 + 0.2, "wave", 0.2).pose(t1 - 0.3, "relaxed", 0.2).mood(t0, "content"); };
    pass(t10 - 0.05, t12 - 0.05, bv(-4, 1.7), bv(4, 1.7)); pass(t12 - 0.05, t14 - 0.05, bv(4, 1.7), bv(-4, 1.7)); pass(t14 - 0.05, E("n18") + 0.2, bv(-4, 1.7), bv(0.9, 1.1));
    [t10, t12, t14].forEach((tt) => theo.nod(tt + 0.5, 0.06).mood(tt + 0.3, "neutral", 0.2));
    shot(t10 - 0.05, t12 - 0.05, [cp(3.0, 1.3, 1.8), cp(-0.3, 0.95, 0.6), 38], [cp(2.8, 1.3, 1.7), cp(-0.3, 0.95, 0.6), 38], { dof: 0.3 });
    shot(t12 - 0.05, t14 - 0.05, [cp(-3.0, 1.4, 1.8), cp(0, 0.95, 0.5), 36], [cp(-2.8, 1.4, 1.7), cp(0, 0.95, 0.5), 36], { dof: 0.3 });
    shot(t14 - 0.05, E("n18") + 0.2, [cp(3.2, 1.5, 2.2), cp(-0.3, 0.95, 0.6), 40], [cp(3.0, 1.5, 2.1), cp(-0.3, 0.95, 0.6), 40], { dof: 0.25 });
    ENVK.push([t14 - 0.06, "day"], [t14, "golden"]);
    // ana_04 on her doorstep, golden evening
    ana.show(E("n18") + 0.2, E("n19") + 0.3).jump(E("n18") + 0.2, add(ANAD, 0.3, 1.0)).faceTo(E("n18") + 0.2, { x: 0.3, z: 1 }).pose(E("n18") + 0.2, "slump", 0).mood(E("n18") + 0.2, "sad", 0);
    says(ana, "ana_04"); ana.mood(W("annoying", 0, "ana_04"), "embarrassed", 0.3).pose(W("annoying", 0, "ana_04"), "facepalm", 0.3).pose(E("ana_04") + 0.3, "slump", 0.4).mood(E("ana_04") + 0.4, "sad", 0.4);
    shot(E("n18") + 0.2, W("check", 0, "n19") - 0.05, [rp(ANAD, 1.5, 1.35, 3.2), rp(ANAD, 0.3, 1.1, 1.0), 34], [rp(ANAD, 1.2, 1.33, 2.6), rp(ANAD, 0.3, 1.1, 1.0), 32], { dof: 0.45 });
    card({ text: "\"THE ANNOYING HELLO LADY\"", mood: "funny", t0: W("annoying", 0, "ana_04"), t1: E("ana_04") + 0.3, zone: "top" });
    card({ text: "THIS IS WHERE MOST OF US QUIT", mood: "sad", t0: W("quit", 0, "n19") - 0.3, t1: W("check", 0, "n19") - 0.1, zone: "top" });
    // to the lighthouse at night
    const tc = W("check", 0, "n19"); ENVK.push([tc - 0.01, "golden"], [tc, "night"]); day(W("fifteen", 0, "n19"), 15, 15);
    shot(tc - 0.05, E("n19") + 0.6, [[-14, 9, -12], [-29.5, 8.5, -31.5], 40], [[-17, 8.5, -16], [-29.5, 8.5, -31.5], 38], { dof: 0.1 });
  }
  // ---------- S08 midpoint twist: Theo's room ----------
  {
    const tcStart = T.s08; grade(tcStart, 0.82, 0.15);
    const seat = V(FLAT.x - 0.45, 0, -1.25);
    theo.jump(tcStart, seat).faceTo(tcStart, { x: -0.6, z: -0.8 }).pose(tcStart, "sit", 0).mood(tcStart, "content", 0);
    window.__calDays = [T.n20 + 0.2, E("n20") + 0.1];
    shot(tcStart, T.theo_02 - 0.05, [rp(cal.group.position, 0.35, 0.1, 1.3), rp(cal.group.position, 0, 0, 0), 32], [rp(cal.group.position, 0.15, 0.05, 0.85), rp(cal.group.position, 0, 0, 0), 30], { dof: 0.5, fn: 20 });
    card({ text: "EVERY HELLO. CIRCLED.", mood: "calm", t0: W("circled", 0, "n20") - 0.2, t1: T.theo_02 - 0.1, zone: "lower", fixedZone: true });
    says(theo, "theo_02"); theo.mood(T.theo_02, "hopeful", 0.3).faceTo(T.theo_02, { x: 0.2, z: 1 });
    shot(T.theo_02 - 0.05, T.n21 + 0.1, [rp(seat, 0.6, 1.25, 1.9), rp(seat, 0, 1.05, 0), 32], [rp(seat, 0.5, 1.22, 1.6), rp(seat, 0, 1.05, 0), 30], { dof: 0.55 });
    // the liking gap
    const tAn = W("ana", 0, "n21"), tTh = W("theo", 0, "n21"), tLg = W("liking", 0, "n21");
    ana.show(tAn - 0.1, tTh - 0.05).jump(tAn - 0.1, add(ANAD, 0.3, 1.0)).faceTo(tAn - 0.1, { x: 0.3, z: 1 }).pose(tAn - 0.1, "slump", 0).mood(tAn - 0.1, "worried", 0);
    ENVK.push([tAn - 0.11, "night"]);
    shot(tAn - 0.1, tTh - 0.05, [rp(ANAD, 1.3, 1.35, 2.8), rp(ANAD, 0.3, 1.15, 1.0), 34], [rp(ANAD, 1.1, 1.33, 2.4), rp(ANAD, 0.3, 1.15, 1.0), 32], { dof: 0.45 });
    card({ text: "ANA THINKS: \"I'M ANNOYING\"", mood: "sad", t0: tAn + 0.1, t1: tTh - 0.1, zone: "top" });
    shot(tTh - 0.05, tLg - 0.05, [rp(seat, -0.2, 1.35, 2.9), rp(seat, -0.9, 1.05, 0), 32], [rp(seat, -0.15, 1.33, 2.6), rp(seat, -0.9, 1.05, 0), 30], { dof: 0.5 });
    theo.mood(tTh, "joy", 0.3);
    card({ text: "THEO THINKS: \"BEST PART OF MY DAY\"", mood: "calm", t0: tTh + 0.1, t1: tLg - 0.1, zone: "left", fixedZone: true });
    shot(tLg - 0.05, E("n21") + 0.3, [rp(FLAT, 1.6, 1.7, 2.6), rp(FLAT, -1.75, 1.2, -1.2), 40], [rp(FLAT, 1.3, 1.65, 2.2), rp(FLAT, -1.75, 1.2, -1.2), 38], { dof: 0.3 });
    card({ text: "THE LIKING GAP", sub: "we underestimate how much people like us", mood: "title", t0: tLg, t1: E("n21") + 0.3, zone: "left", fixedZone: true });
    src("Boothby, Cooney, Sandstrom & Clark (2018)", tLg, E("n21") + 0.3);
    // n22: the stuck door, light under it
    ENVK.push([T.n22 - 0.1, "night"]);
    shot(E("n21") + 0.3, E("n22") + 0.8, [rp(LD, 3.2, 1.2, 3.4), rp(LD, 0, 1.0, 0), 34], [rp(LD, 2.6, 1.15, 2.8), rp(LD, 0, 1.0, 0), 32], { dof: 0.35 });
    window.__doorGlow = [E("n21") + 0.3, E("n22") + 0.8];
  }
  // ---------- S09 rain, the empty bench, the soup ----------
  {
    const t17 = W("seventeen", 0, "n23"); day(T.n23, 16, 15); day(t17, 17, 15); grade(T.s09, 0.58, -0.5);
    ENVK.push([T.s09 - 0.01, "night"], [T.s09, "overcast"]); RAINK.push([T.s09 - 0.01, 0], [T.s09, 1]);
    theo.jump(T.s09, V(-60, 0, -60));  // gone from the bench (hidden until the door)
    shot(T.s09, t17 - 0.05, [[-9, 3.2, 12], [-3.4, 0.6, 3.4], 42], [[-8.2, 3.0, 11], [-3.4, 0.6, 3.4], 42], { dof: 0.1 });
    card({ text: "DAY 16: EMPTY", mood: "sad", t0: W("empty", 0, "n23"), t1: t17 - 0.1, zone: "top" });
    ana.show(t17 - 0.05, E("mo_03") + 0.3).jump(t17 - 0.05, V(-6.2, 0, 2.4)).at(T.ana_05 - 0.3, V(-2.7, 0, 4.4)).faceTo(t17, { x: 1, z: 0.4 }).faceTo(T.ana_05 - 0.4, { x: -0.6, z: -0.6 }).mood(t17, "worried").pose(t17, "relaxed");
    shot(t17 - 0.05, T.ana_05 - 0.05, [rp(TB, 2.4, 1.4, -2.2), rp(TB, 0.4, 0.9, 0.4), 38], [rp(TB, 2.1, 1.35, -1.9), rp(TB, 0.4, 0.9, 0.4), 36], { dof: 0.3 });
    says(ana, "ana_05"); ana.mood(W("miss", 0, "ana_05"), "surprised", 0.25).mood(E("ana_05") + 0.2, "hopeful", 0.4).faceTo(T.ana_05 + 0.2, { x: 0.3, z: 1 });
    shot(T.ana_05 - 0.05, E("n24") + 0.3, [rp(V(-2.7, 0, 4.4), 0.6, 1.35, 1.9), rp(V(-2.7, 0, 4.4), 0, 1.3, 0), 30], [rp(V(-2.7, 0, 4.4), 0.5, 1.33, 1.6), rp(V(-2.7, 0, 4.4), 0, 1.3, 0), 28], { dof: 0.6 });
    card({ text: "THE HELLOS HELPED ANA TOO", mood: "calm", t0: W("best", 0, "n24"), t1: E("n24") + 0.25, zone: "top" });
    // n25 + Mo's soup
    const MH = add(MOD, 0.3, 0.4), AH = add(MH, 0.9, 1.25);
    ana.jump(T.n25 - 0.1, AH).faceTo(T.n25, { x: -0.6, z: -0.8 }).pose(T.n25, "hold", 0).mood(T.n25, "worried", 0);
    mo.show(T.n25 - 0.1, E("mo_03") + 0.3).jump(T.n25 - 0.1, MH).faceTo(T.n25, { x: 0.5, z: 0.85 }).mood(T.n25, "content").pose(T.n25, "relaxed");
    shot(T.n25 - 0.1, T.mo_03 - 0.05, [rp(MH, 3.0, 1.6, 2.8), rp(MH, 0.5, 1.15, 0.6), 38], [rp(MH, 2.7, 1.55, 2.4), rp(MH, 0.5, 1.15, 0.6), 36], { dof: 0.3 });
    card({ text: "REACHING OUT", sub: "is appreciated more than we expect", mood: "calm", t0: W("appreciate", 0, "n25") - 0.2, t1: T.mo_03 - 0.1, zone: "top" });
    src("Liu, Rim, Min & Min (2023)", W("appreciate", 0, "n25") - 0.2, T.mo_03 - 0.1);
    says(mo, "mo_03"); mo.pose(T.mo_03, "give", 0.25).mood(T.mo_03, "joy", 0.2);
    shot(T.mo_03 - 0.05, E("mo_03") + 0.3, [rp(MH, 1.8, 1.45, 2.0), rp(MH, 0.45, 1.3, 0.6), 32], [rp(MH, 1.65, 1.45, 1.8), rp(MH, 0.45, 1.3, 0.6), 30], { dof: 0.45 });
    window.__soup = [W("soup", 0, "mo_03"), E("ana_06") + 0.6];
    // the lighthouse door
    const AL = V(LD.x + OUT.x * 1.25, 6, LD.z + OUT.z * 1.25), TL = V(LD.x + OUT.x * 0.25, 6, LD.z + OUT.z * 0.25);
    ana.show(E("mo_03") + 0.3, E("ana_06") + 0.8).jump(E("mo_03") + 0.3, V(AL.x + OUT.x * 2.2, 6, AL.z + OUT.z * 2.2)).at(T.theo_03 - 0.5, AL).faceTo(E("mo_03") + 0.3, { x: -OUT.x, z: -OUT.z }).pose(E("mo_03") + 0.3, "hold", 0).mood(E("mo_03") + 0.3, "hopeful");
    theo.jump(T.theo_03 - 0.4, TL).faceTo(T.theo_03 - 0.4, OUT).pose(T.theo_03 - 0.4, "relaxed", 0).mood(T.theo_03 - 0.4, "tired", 0).mood(T.theo_03 + 0.3, "surprised", 0.3);
    says(theo, "theo_03"); says(ana, "ana_06"); ana.mood(T.ana_06, "happy", 0.3).pose(T.ana_06, "give", 0.3); theo.mood(E("ana_06") - 0.2, "hopeful", 0.4);
    shot(E("mo_03") + 0.3, T.theo_03 - 0.05, [rp(LD, 4.4, 1.6, 4.6), rp(LD, 0, 1.0, 0), 38], [rp(LD, 3.6, 1.5, 3.8), rp(LD, 0, 1.0, 0), 36], { dof: 0.25 });
    window.__knock = [T.theo_03 - 0.9, T.theo_03 - 0.6];
    shot(T.theo_03 - 0.05, E("ana_06") + 0.8, [rp(LD, 2.6, 1.3, 0.6), rp(LD, 0.4, 1.1, 0.5), 32], [rp(LD, 2.35, 1.3, 0.55), rp(LD, 0.4, 1.1, 0.5), 30], { dof: 0.45 });
    day(T.ana_06 + 0.2, 17, 16);
    RAINK.push([E("ana_06") - 0.6, 1], [E("ana_06") + 0.8, 0]); ENVK.push([E("ana_06") - 0.6, "overcast"], [E("ana_06") + 0.8, "golden"]); grade(E("ana_06") - 0.6, 0.6, -0.45); grade(E("ana_06") + 0.8, 0.9, 0.3);
  }
  // ---------- S10 montage, the hours, Nia's takeaways ----------
  {
    const s = T.s10; grade(s, 0.98, 0.45); ENVK.push([s - 0.01, "golden"], [s, "golden"]);
    const tq = W("question", 0, "n26"), tg = W("seagull", 0, "n26"), tl = W("laugh", 0, "n26");
    day(s, 20, 19); day(tq, 22, 21); day(tg, 25, 24); day(tl, 28, 27);
    const AS = bv(0.45, 0.04), TS = bv(-0.42, 0.04);
    theo.jump(s, TS).faceTo(s, FD).pose(s, "sit", 0).mood(s, "content", 0).pose(tg, "shrug", 0.3).pose(tg + 1.2, "sit", 0.3).mood(tl, "laughing", 0.3).mood(E("n26") + 0.4, "happy", 0.4);
    ana.show(s, E("n27") + 0.5).jump(s, AS).faceTo(s, FD).pose(s, "sit", 0).mood(s, "happy", 0).mood(tq, "curious", 0.3).mood(tl, "laughing", 0.3).mood(E("n26") + 0.4, "happy", 0.4);
    GULLK.push([tg - 0.4, null], [tg - 0.39, { x: bp(-0.3, 1.1)[0], y: 0, z: bp(-0.3, 1.1)[2], ry: 2.4, flap: 0, hop: 1 }], [tl, { x: bp(0.2, 1.0)[0], y: 0, z: bp(0.2, 1.0)[2], ry: 2.0, flap: 0, hop: 1 }], [E("n27") + 0.5, null]);
    shot(s, tg - 0.05, [cp(1.9, 1.35, 3.3), cp(0, 0.95, 0.2), 40], [cp(1.7, 1.33, 3.0), cp(0, 0.95, 0.2), 38], { dof: 0.3 });
    shot(tg - 0.05, tl - 0.05, [cp(-2.6, 1.3, 2.8), cp(0, 0.85, 0.6), 36], [cp(-2.3, 1.28, 2.5), cp(0, 0.85, 0.6), 34], { dof: 0.45 });
    shot(tl - 0.05, T.n27 + 0.2, [cp(1.6, 1.25, 2.6), cp(0, 0.95, 0.15), 34], [cp(1.45, 1.25, 2.4), cp(0, 0.95, 0.15), 32], { dof: 0.45 });
    window.__meter = [s + 0.4, E("n27") + 0.4, [[s + 0.4, 10], [E("n26"), 95], [W("three", 0, "n27"), 180]]];
    const tf = W("fifty", 0, "n27"), tfr = W("friendship", 0, "n27");
    shot(T.n27 + 0.2, E("n27") + 0.5, [cp(-6.8, 2.2, 4.6), cp(0, 0.8, 0.3), 42], [cp(-6.2, 2.0, 4.3), cp(0, 0.8, 0.3), 40], { dof: 0.15 });
    card({ text: "~50 HOURS TOGETHER", sub: "to become casual friends (one estimate)", mood: "fact", t0: tf, t1: tfr - 0.15, zone: "top" });
    src("Hall (2019)", tf, tfr - 0.15);
    card({ text: "FRIENDSHIP = HOURS, STACKED UP", mood: "calm", t0: tfr, t1: E("n27") + 0.45, zone: "lower", fixedZone: true });
    // Nia on the quay at sunset (day 29)
    day(T.n29, 29, 28); ENVK.push([T.n29 - 0.01, "golden"], [T.n29, "dusk"], [E("n30"), "dusk"]);
    const NQ = V(0.6, 0.12, 15.2);
    nia.show(T.n29 - 0.05, E("n30") + 0.8).jump(T.n29 - 0.05, NQ).faceTo(T.n29, { x: 0, z: 1 }).pose(T.n29, "explain", 0).mood(T.n29, "content", 0).pose(W("probably", 0, "n29"), "point", 0.3).mood(W("probably", 0, "n29"), "happy", 0.3)
      .pose(T.n30, "hands", 0.3).mood(T.n30, "hopeful", 0.3).pose(W("one", 0, "n30"), "give", 0.3).mood(W("one", 0, "n30"), "content", 0.3);
    nia.rig.lips.push([T.n29, "n29"], [T.n30, "n30"]);
    shot(T.n29 - 0.05, T.n30 - 0.05, [rp(NQ, -0.8, 1.5, 4.8), rp(NQ, 0, 1.15, 0), 36], [rp(NQ, -0.6, 1.45, 4.1), rp(NQ, 0, 1.15, 0), 34], { dof: 0.35 });
    card({ text: "THE 2ND HELLO MATTERS MOST", mood: "calm", t0: W("second", 0, "n29"), t1: W("probably", 0, "n29") - 0.1, zone: "top" });
    card({ text: "THEY LIKE YOU MORE THAN YOU THINK", mood: "calm", t0: W("probably", 0, "n29"), t1: E("n29") + 0.3, zone: "top" });
    shot(T.n30 - 0.05, E("n30") + 0.8, [rp(NQ, 0.9, 1.4, 3.4), rp(NQ, 0, 1.25, 0), 32], [rp(NQ, 0.7, 1.38, 2.9), rp(NQ, 0, 1.25, 0), 30], { dof: 0.45 });
    card({ text: "THE GUARD ISN'T A FLAW", mood: "calm", t0: W("flaw", 0, "n30") - 0.3, t1: W("one", 0, "n30") - 0.1, zone: "top" });
    card({ text: "ONE WORD BACK IS ENOUGH", mood: "calm", t0: W("one", 0, "n30"), t1: E("n30") + 0.75, zone: "top" });
  }
  // ---------- S11 day 30 payoff + breathing end ----------
  {
    const s = T.s11; day(T.n31, 30, 29); grade(s, 1.05, 0.3); ENVK.push([s - 0.01, "dusk"], [s, "day"]);
    const tIsnt = W("isn't", 0, "n31"), tAc = W("across", 0, "n32");
    theo.jump(s, V(1.4, 0, 1.6)).faceTo(s, { x: 0.6, z: 0.5 }).pose(s, "relaxed", 0).mood(s, "content", 0).at(T.theo_04 - 0.6, fv(0.1, 0.95)).faceTo(T.theo_04 - 0.6, { x: 0.7, z: 0.7 });
    finn.show(s, D).jump(s, FB).faceTo(s, toC(FB)).pose(s, "sit", 0).mood(s, "sad", 0);
    ana.show(s, D).jump(s, V(-6.2, 0, 2.4)).at(tIsnt - 0.2, V(-2.6, 0, 4.6)).faceTo(s, { x: 1, z: 0.4 }).mood(s, "happy").pose(tIsnt - 0.5, "wave", 0.2).pose(tIsnt + 0.1, "relaxed", 0.3).mood(tIsnt, "confused", 0.3).faceTo(tAc, { x: 1, z: -0.1 });
    shot(s, tAc - 0.05, [[-0.5, 1.7, 9.2], [-3.5, 0.9, 3.8], 40], [[-0.8, 1.65, 8.6], [-3.2, 0.9, 3.9], 40], { dof: 0.15 });
    card({ text: "THE BENCH IS EMPTY?!", mood: "question", t0: tIsnt + 0.1, t1: tAc - 0.15, zone: "top" });
    shot(tAc - 0.05, T.theo_04 - 0.05, [[-2.4, 1.9, 9.0], [0.6, 0.9, 3.2], 40], [[0.6, 1.7, 8.8], [2.8, 0.9, 3.2], 38], { in: "cut", dof: 0.2, out: "io" });
    says(theo, "theo_04"); theo.pose(T.theo_04 - 0.1, "wave", 0.2).mood(T.theo_04, "happy", 0.2).pose(E("theo_04") + 0.2, "relaxed", 0.3);
    finn.faceTo(T.theo_04, { x: -0.7, z: -0.7 }).mood(T.theo_04 + 0.2, "surprised", 0.2).mood(E("theo_04") + 0.4, "joy", 0.3);
    day(T.theo_04 + 0.4, 30, 30);
    shot(T.theo_04 - 0.05, E("theo_04") + 0.9, [cfp(2.6, 1.3, 1.4), cfp(0, 1.0, 0.55), 32], [cfp(2.35, 1.25, 1.3), cfp(0, 1.0, 0.55), 30], { dof: 0.5 });
    ring(T.theo_04 + 0.3, V(3.0, 0.05, 3.1), "#FFC24A", 10, 2.6);
    // n33: callback to day 1, then Ana + Mo
    const tAgo = W("ago", 0, "n33"), tTd = W("today", 0, "n33");
    window.__day1 = [tAgo - 0.5, tTd - 0.05];
    shot(tAgo - 0.5, tTd - 0.05, [cp(1.75, 1.05, 0.8), cp(0, 0.95, 0.1), 30], [cp(1.65, 1.05, 0.75), cp(0, 0.95, 0.1), 29], { dof: 0.6 });
    theo.jump(tAgo - 0.5, TB).faceTo(tAgo - 0.5, FD).pose(tAgo - 0.5, "sit", 0).mood(tAgo - 0.5, "sad", 0).jump(tTd - 0.05, fv(0.1, 0.95)).faceTo(tTd - 0.05, { x: 0.7, z: 0.7 }).pose(tTd - 0.05, "relaxed", 0).mood(tTd - 0.05, "happy", 0);
    mo.show(tTd - 0.05, D).jump(tTd - 0.05, add(MOD, 0.6, 0.4)).faceTo(tTd, { x: 0.55, z: 0.84 }).pose(tTd, "wave", 0.2).mood(tTd, "laughing", 0.2);
    ana.mood(tTd, "proud", 0.3).faceTo(tTd, { x: 0.9, z: -0.2 });
    shot(tTd - 0.05, E("n33") + 0.6, [[-5.2, 1.5, 7.4], [-2.6, 1.15, 4.6], 36], [[-4.9, 1.5, 7.0], [-2.6, 1.15, 4.6], 34], { dof: 0.35 });
    card({ text: "HE'S SOMEBODY'S DAY ONE", mood: "calm", t0: tTd + 0.2, t1: E("n33") + 0.55, zone: "top" });
    // n34 + breathing end: crane up, hellos rippling out across the island
    shot(E("n33") + 0.6, D, [[1.5, 2.2, 10.5], [0.6, 1.0, 3.2], 40], [[10, 34, 46], [0, 0, 0], 42], { in: "cut", dof: 0.1, out: "io" });
    [[T.n34 + 0.6, V(3.0, 0.05, 3.1)], [T.n34 + 1.6, V(-9, 0.05, -9)], [T.n34 + 2.4, V(9, 0.05, -9.5)], [T.n34 + 3.1, V(-11.5, 0.05, 11.5)], [T.n34 + 3.8, V(0.5, 0.5, 20)], [T.n34 + 4.4, V(12.5, 0.05, 2.5)]].forEach(([t0, at], i) => ring(t0, at, i % 2 ? "#FF9A6A" : "#FFC24A", 14, 3.2));
    ENVK.push([E("n33") + 0.5, "day"], [D, "golden"]); grade(E("n33") + 0.5, 1.05, 0.35); grade(D, 1.08, 0.6);
    window.__end = [D - 1.4, D];
  }

  // ======================= finalize characters =======================
  for (const id in CAST) { const a = CAST[id];
    a.tr.P.sort((p, q) => p[0] - q[0]); a.tr.P.forEach((k) => { const p = k[1]; if (p.x < 200 && Math.abs(p.y) < 0.01) k[1] = V(p.x, 0.07, p.z); });
    ["pose", "mood", "squash"].forEach((k) => a.rig[k].sort((p, q) => p[0] - q[0])); a.face.sort((p, q) => p[0] - q[0]);
    if (!a.vis.length) a.vis.push([0, 0]);
    const inVis = (t) => a.vis.some(([x, y]) => t >= x && t < y);
    a.b = W3.person({ id, P3: a.tr.P, face: a.face, pref: 1, vis: inVis, rig: Object.assign({}, a.look, { pose: a.rig.pose, mood: a.rig.mood, lips: a.rig.lips, squash: a.rig.squash, scale: a.look.scale || 1 }) }); }
  // theo is visible across scenes by default unless a scene hides him: keep him on the bench whenever no window is set
  ENVK.sort((a, b) => a[0] - b[0]); SHK.sort((a, b) => a[0] - b[0]); RAINK.sort((a, b) => a[0] - b[0]);
  ["theo", "finn"].forEach((id) => (CAST[id].b.noClip = true));
  const camAt = W3.keys(KEYS);
  TY = SRType.create(hudSvg, { W: 1920, H: 1080, avoid: (t) => W3.faceRects(t, camAt) });
  CARDS.forEach((o) => TY.card(o));
  window.__CARDS = TY.cards.map((c) => ({ t: c.t0, mood: c.mood }));
  const counter = K4.counter(hudSvg, CK.sort((a, b) => a[0] - b[0]));
  const meter = window.__meter ? K4.meter(hudSvg, window.__meter[2], window.__meter[0], window.__meter[1], { full: 3000 }) : null;
  const gradeF = K4.grade(document.getElementById("bg"), GK.sort((a, b) => a[0] - b[0]));
  const LF = { day: W3.litF("#FFE6A8", -5, 5, [1.0, 0.98, 0.94], 0.85), golden: W3.litF("#FFB060", -6, 4, [1.0, 0.9, 0.8], 0.95), night: W3.litF("#AFC2FF", 5, 5, [0.72, 0.76, 0.95], 0.8), lamp: W3.litF("#FFD592", 0, 6, [1.0, 0.9, 0.78], 0.85), rain: W3.litF("#C8D2E2", -3, 5, [0.8, 0.84, 0.9], 0.8) };

  // ======================= per-frame =======================
  const st = (keys, t) => SR.sampleTrack(keys, t, keys[0][1]);
  // screen-space rain layer (reads clearly through DOF): slanted streaks, pure function of t
  const rainG = el("g", { opacity: 0 }, hudSvg), RS = []; for (let i = 0; i < 140; i++) { const r1 = SR.mulberry32(500 + i); const a = r1(), b = r1(), c = r1(); RS.push({ l: el("line", { stroke: "#E4ECF8", "stroke-width": 1.6 + c * 1.6, "stroke-linecap": "round", opacity: 0.35 + 0.4 * c }, rainG), a, b, c }); }
  const flash = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#FFFFFF", opacity: 0 }, hudSvg);
  const tl = gsap.timeline({ paused: true });
  GULLK.sort((a, b) => a[0] - b[0]);
  function gullAt(t) { let k = null, n = null; for (let i = 0; i < GULLK.length; i++) { if (GULLK[i][0] <= t) { k = GULLK[i]; n = GULLK[i + 1]; } } if (!k || !k[1]) return null; if (!n || !n[1]) return k[1];
    const u = clamp((t - k[0]) / Math.max(0.001, n[0] - k[0]), 0, 1), a = k[1], b = n[1]; return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u), ry: lerp(a.ry, b.ry, u), flap: Math.max(a.flap, b.flap), hop: a.hop || 0 }; }
  function draw(t) {
    const c = camAt(t), cx = c.p[0], interior = cx > 250; const env = K.envAt(ENVK, t);
    applyEnv(env, interior ? [Math.round(cx / 100) * 100, 0, 0] : [0, 0, 0]);
    const ev = { night: interior ? 1 : env.night, boom: 0, bust: 0, oven2: 0, oven2Bow: 0, sink: 0 };
    town.update(t, ev); inner.update(t, ev); if (inner.setWindowSky) inner.setWindowSky(1); if (inner.setBills) inner.setBills(0);
    // theo default: on his bench (scenes jump him elsewhere); hide during S09 rain until the door
    const rk = st(RAINK, t); rain.update(t, interior ? 0 : rk); rainHill.update(t, interior ? 0 : rk);
    // calendar: circles appear 1→15 during n20, then the note
    const cd = window.__calDays; let circ = 0, today = 1, note = "";
    if (t >= T.s08 - 0.1) { circ = cd ? Math.round(clamp((t - cd[0]) / (cd[1] - cd[0]), 0, 1) * 15) : 15; today = 15; if (t > T.theo_02) note = "she said my name!"; }
    cal.set(Array.from({ length: circ }, (_, i) => i + 1), today, note);
    gull.update(t, gullAt(t));
    const sh = st(SHK, t); shield.update(t, sh.k, sh.a, TB);
    rings.forEach(({ r, t0, at, size, dur }) => { const k = clamp((t - t0) / dur, 0, 1); r.group.visible = k > 0 && k < 1; r.group.position.set(at.x, at.y + 0.03, at.z); r.group.scale.setScalar(0.5 + k * size); r.update(k); });
    CAST.ana.b.noClip = t > T.s10 && t < T.s11;
    const golden = env.sunK > 0.8 && !interior;
    W3.frame(t, c, { lightFor: () => (interior ? LF.lamp : rk > 0.5 ? LF.rain : env.night > 0.6 ? LF.night : golden ? LF.golden : LF.day) });
    // soup in Ana's hand
    const sp = window.__soup, ab = CAST.ana.b; const sOn = sp && t > sp[0] && t < sp[1] && ab && ab.hand && ab.outer.getAttribute("display") !== "none";
    soup.setAttribute("display", sOn ? "inline" : "none"); if (sOn) { soup.setAttribute("transform", `translate(${ab.hand.x.toFixed(1)},${(ab.hand.y - 10).toFixed(1)}) scale(${(ab.k || 1).toFixed(3)})`); soup.steam.forEach((s, i) => s.setAttribute("opacity", 0.4 + 0.4 * Math.sin(t * 4 + i * 2))); }
    const rv = interior ? 0 : rk; rainG.setAttribute("opacity", rv.toFixed(3)); if (rv > 0.01) RS.forEach(({ l, a, b, c }) => { const sp = 1500 + c * 900, y = ((b * 1300 + t * sp) % 1300) - 120, x = a * 2100 - 90 + y * 0.12, L = 40 + c * 50; l.setAttribute("x1", x.toFixed(1)); l.setAttribute("y1", y.toFixed(1)); l.setAttribute("x2", (x + L * 0.12).toFixed(1)); l.setAttribute("y2", (y + L).toFixed(1)); });
    TY.update(t); counter.update(t); if (t > D - 3) counter.g.setAttribute("opacity", clamp((D - 0.5 - t) / 2.5, 0, 1)); if (meter) meter.update(t);
    // grade: day-1 callback drains colour; flash-forward whiteout
    gradeF.update(t); const d1 = window.__day1; if (d1 && t > d1[0] && t < d1[1]) document.getElementById("bg").style.filter = "saturate(0.45) brightness(0.92) hue-rotate(-8deg)";
    const fl = window.__flash; flash.setAttribute("opacity", fl ? (t > fl[0] && t < fl[1] ? Math.sin(Math.PI * (t - fl[0]) / (fl[1] - fl[0])) : 0) : 0);
  }
  // foley export (tools/foley_scan.cjs sets __WANT_FOLEY): footsteps by surface + scripted sounds + card moods
  if (window.__WANT_FOLEY) {
    const surfaceAt = (p) => (p.x > 250 ? "wood" : p.y > 3 ? "grass" : p.z > 16.2 ? "wood" : (p.x < -8.5 && p.z > 8) ? "grass" : "stone");
    const events = W3.foleyScan({ camAt, D, fps: 60, surfaceAt });
    (window.__knock || []).forEach((t) => events.push({ t, kind: "knock", pan: 0.1, gain: -6 }));
    window.__FOLEY = { events, cards: TY.cards.map((c) => ({ t: c.t0, mood: c.mood, zone: c.zone })), soup: window.__soup || null };
  }
  W3.compile();
  SR.drive(tl, D, draw);
  window.__timelines["main"] = tl;
  window.__EP4 = { W3, CAST, KEYS, A, camAt, TY };
})();
