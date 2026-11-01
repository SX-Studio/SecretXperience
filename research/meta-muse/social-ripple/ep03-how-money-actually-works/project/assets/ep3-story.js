/* Social Ripple ep3: "How Money Actually Works, Explained With One Sandwich" — the director's file.
   World = SR3D engine + EP3.town / EP3.interiors / EP3.props (agent-built sets). Characters = SR v3 rig billboards. */
(function () {
  const SR = window.SR, TH = window.THREE, T = window.T, K = window.EP3K; SR.SKIN = "#F1EBDD";
  const { el, clamp, EASE } = SR; const lerp = (a, b, k) => a + (b - a) * k, sst = (k) => k * k * k * (k * (k * 6 - 15) + 10);
  const W = (w, nth = 0, line) => { const v = K.W(w, nth, line); return v == null ? (line ? T[line] : 0) : v; };
  const E = (id) => T[id + "_e"], D = T.D;
  const W3 = SR3D.create({ canvas: document.getElementById("bg"), ov: document.getElementById("ov"), width: 1920, height: 1080 });
  const applyEnv = K.lights(W3);
  const town = window.EP3.town(W3), inner = window.EP3.interiors(W3), props = window.EP3.props(W3);
  const IA = inner.anchors || {}; const A = Object.assign({}, town.anchors || {}, IA.apt || {}, IA.bank || {}, IA.shop || {}, (props.yap && props.yap.anchors) || {});
  A.bankCustomer = (IA.bank || {}).customerSpot; A.shopCustomer = (IA.shop || {}).customerSpot; A.screen = (IA.bank || {}).screen; A.menu = (IA.shop || {}).menu;
  (town.occ || []).concat(inner.occ || []).forEach((o) => W3.occ.push(o));
  const V = (x, y, z) => ({ x, y, z }), at = (a, dx = 0, dz = 0) => V(a.x + dx, a.y || 0, a.z + dz);
  const hud = K.hud(document.getElementById("hud")), H = hud;

  // ======================= tracks =======================
  function Track(p0) { const P = [[0, p0]]; return { P, last: () => P[P.length - 1][1], at(t, p, e) { P.push([t, p, e]); return this; }, hold(t) { P.push([t, P[P.length - 1][1], "linear"]); return this; },
    jump(t, p) { P.push([t - 0.002, P[P.length - 1][1], "linear"]); P.push([t, p, "jump"]); return this; } }; }
  const CAST = {};
  function actor(id, look, p0, o = {}) { const tr = Track(p0), face = [[0, o.face || { x: 1, z: 0 }]], rig = { pose: [[0, o.pose || "relaxed", 0]], mood: [[0, o.mood || "content", 0]], talk: [], look: [[0, { x: 0, y: 0 }]] }, vis = [];
    const a = { id, tr, face, rig, vis, look, o, show(t0, t1) { vis.push([t0, t1]); return a; }, pose(t, n, d = 0.25) { rig.pose.push([t, n, d]); return a; }, mood(t, n, d = 0.25) { rig.mood.push([t, n, d]); return a; },
      talk(t0, t1) { rig.talk.push([t0, t1]); return a; }, faceTo(t, dir) { face.push([t, dir]); return a; }, at(t, p, e) { tr.at(t, p, e); return a; }, jump(t, p) { tr.jump(t, p); return a; }, hold(t) { tr.hold(t); return a; } };
    CAST[id] = a; return a; }
  // voice-line talk helper: mouth moves while a character's line plays
  const says = (a, line) => a.talk(T[line], E(line));

  // ======================= cast =======================
  const SHOP = V(300, 0, 0), BANK = V(400, 0, 0), FLAT = V(500, 0, 0);
  const mo = actor("mo", { color: "#E8834A", outfit: "apron", hair: "short", hairColor: "#3A2A22", pants: "#3A4A63" }, V(300, 0, -1.6), { face: { x: 0, z: 1 } });
  const bee = actor("bee", { color: "#F2C14E", outfit: "apron", hair: "ponytail", hairColor: "#9A4A2A", pants: "#6A4A8A" }, V(8.4, 0, -8.6), { face: { x: 0, z: 1 } });
  const finn = actor("finn", { color: "#F4C430", outfit: "coat", hair: "cap", hairColor: "#2E4A6A", pants: "#3A4A63" }, V(2.4, 0, 5.4), { face: { x: -1, z: 0 } });
  const ana = actor("ana", { color: "#3FA7A0", outfit: "tee", hair: "bun", hairColor: "#5A3A2A", pants: "#2E7A74" }, V(300, 0, 3.0), { face: { x: 0, z: -1 }, mood: "tired" });
  const penny = actor("penny", { color: "#2E3E6A", outfit: "jacket", hair: "short", hairColor: "#8A8A9A", pants: "#2A3050", glasses: true }, V(400, 0, -1.75), { face: { x: 0, z: 1 } });
  const kai = actor("kai", { color: "#FF8A2A", outfit: "jacket", hair: "cap", hairColor: "#E0B020", pants: "#3A4A63" }, V(-12.2, 0, 3.4), { face: { x: 1, z: 0 } });
  const waiter = actor("waiter", { color: "#F4F0EA", outfit: "shirt", hair: "curly", hairColor: "#2A1A12", pants: "#2A2A3A" }, V(9.8, 0, 4.2), { face: { x: -1, z: 0 } });
  const kid = actor("kid", { color: "#8EC3E8", outfit: "tee", hair: "spiky", hairColor: "#3A2A22", pants: "#3A4A63", scale: 0.68 }, V(-12, 0, 4.4));
  const partner = actor("partner", { color: "#C7B3E6", outfit: "dress", hair: "long", hairColor: "#2A1A12", pants: "#5A3A6A" }, V(-12.6, 0, 4.2));

  // ======================= camera =======================
  const KEYS = []; let lastEnd = 0;
  // a shot: from A to B (creeping), entered by "cut" (default) or a glide ("io") from the previous shot
  function shot(t0, t1, A0, B0, o = {}) { if (KEYS.length && KEYS[KEYS.length - 1].t >= t0 - 0.002) KEYS[KEYS.length - 1].t = t0 - 0.003; KEYS.push(Object.assign({ t: t0, p: A0[0], l: A0[1], f: A0[2], e: o.in || "cut", dof: o.dof ?? 0.25, fn: o.fn ?? 50, ff: o.ff ?? 320 })); KEYS.push({ t: t1 - 0.001, p: B0[0], l: B0[1], f: B0[2], e: o.out || "lin", dof: o.dof2 ?? o.dof ?? 0.25, fn: o.fn ?? 50, ff: o.ff ?? 320 }); lastEnd = t1; }
  const rel = (a, dx, dy, dz) => [a.x + dx, (a.y || 0) + dy, a.z + dz];

  // ======================= props =======================
  const bill = props.makeBill({}); W3.scene.add(bill.group);
  const sandwich = props.makeSandwich(); W3.scene.add(sandwich.group);
  const sandwich2 = props.makeSandwich(); W3.scene.add(sandwich2.group);
  const stamp = props.makeStamp ? props.makeStamp() : null; if (stamp) W3.scene.add(stamp.group);
  const piggy = props.makePiggy ? props.makePiggy() : null; if (piggy) W3.scene.add(piggy.group);
  const burst = props.makeCoinBurst ? props.makeCoinBurst(24, 5) : null; if (burst) W3.scene.add(burst.group);
  const ring = props.makeRipple ? props.makeRipple("#FFC24A") : null; if (ring) W3.scene.add(ring.group);
  const ringR = props.makeRipple ? props.makeRipple("#FF6A5A") : null; if (ringR) W3.scene.add(ringR.group);
  const B = {}; (town.buildings || []).forEach((b) => (B[b.name] = b));
  const bpos = (name, fb) => { const b = Object.values(B).find((x) => x.name.toLowerCase().includes(name)); return b ? V(b.x, 0, b.z) : fb; };
  const P_MO = bpos("mo", V(-9, 0, -12)), P_BEE = bpos("bea", V(9, 0, -12)), P_BANK = bpos("bank", V(0, 0, -14)), P_CRAB = bpos("crab", V(13, 0, 3)), P_KAI = bpos("kai", V(-13, 0, 3)), P_ANA = bpos("ana", V(-14, 0, 12));
  const P_BOAT = V(3, 0, 28);
  // arcs: [from, to, h]
  const mkArc = (a, b, h, col) => { const r = props.makeArc(a, b, { h, color: col || "#FFC24A", r: 0.22 }); r.setProgress(0, 0); r.setOpacity(0); if (r.group) W3.scene.add(r.group); else if (r.mesh) W3.scene.add(r.mesh); return r; };
  const loop4 = [mkArc(V(P_MO.x, 4, P_MO.z), V(P_BEE.x, 4, P_BEE.z), 7), mkArc(V(P_BEE.x, 4, P_BEE.z), V(P_BOAT.x, 2, P_BOAT.z), 9), mkArc(V(P_BOAT.x, 2, P_BOAT.z), V(P_MO.x, 4, P_MO.z), 11)];
  const mkArcL = (a, b, h) => { const r = props.makeArc(a, b, { h, color: "#FFC24A", bead: false, halo: false, r: 0.16 }); r.setProgress(0, 0); r.setOpacity(0); return r; };
  const others = []; const R = SR.mulberry32(77); const hs = (town.buildings || []).map((b) => V(b.x, b.roofY || 4, b.z)); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; hs.push(V(Math.cos(a) * 24, 3, Math.sin(a) * 24)); }
  for (let i = 0; i < 26; i++) { const a = hs[Math.floor(R() * hs.length)], b = hs[Math.floor(R() * hs.length)]; if (a === b) continue; others.push({ arc: mkArcL(a, b, 5 + R() * 9), d: R() }); }
  const redArcs = [P_MO, P_BEE, P_BOAT, P_CRAB, P_KAI, P_ANA].map((p) => mkArc(V(p.x, 3, p.z), V(P_BANK.x, 5, P_BANK.z), 8, "#FF6A5A"));

  // ======================= HUD elements (declared here, timed in scenes) =======================
  const HUDS = [];
  const card = (o) => { const c = H.card(o); HUDS.push(c); return c; }, source = (o) => { const c = H.source(o); HUDS.push(c); return c; };
  const thinks = []; const think = (o, who) => { const c = H.think(o); thinks.push([c, who]); return c; };
  const sayB = []; const say = (who, o) => { const b = H.say(o); sayB.push([b, who]); return b; };

  // ============================================================================================
  //                                           SCENES
  // ============================================================================================
  const ENVK = [[0, "day"]]; const BOOM = [[0, 0]], BUST = [[0, 0]], OVEN2 = [[0, 0]], PRICE = [[0, 10]], NIGHTW = [[0, 0]];
  const billKeys = []; // [t, {x,y,z,s,ry,rx,op}]
  const BK = (t, x, y, z, s = 1, ry = 0, rx = 0, e) => billKeys.push([t, { x, y, z, s, ry, rx }, e]);

  // ---------- S01 cold open: the bill (shop interior), then the island ----------
  {
    const s = T.s01, a0 = T.n01;
    ana.show(0, T.n02 - 0.05).at(0.01, V(300.1, 0, 1.25)).faceTo(0, { x: 0, z: -1 }).pose(0, "give", 0).mood(0, "tired", 0);
    mo.show(0, T.n02 - 0.05).at(0.01, V(300, 0, -1.55)).pose(0, "relaxed", 0).mood(0, "content", 0).mood(W("nobody", 0, "n01"), "happy", 0.3);
    BK(0, 300.05, 1.3, 0.5, 5, 1.25, -0.1); BK(W("four", 0, "n01"), 300.05, 1.32, 0.48, 5.2, 1.05, -0.05); BK(E("n01"), 300.0, 1.25, 0.45, 2.2, 0.6, 0);
    shot(s, W("four", 0, "n01") - 0.2, [rel(SHOP, 1.25, 1.42, 0.62), rel(SHOP, 0.05, 1.3, 0.5), 34], [rel(SHOP, 1.0, 1.38, 0.58), rel(SHOP, 0.05, 1.31, 0.49), 32], { dof: 0.75 });
    shot(W("four", 0, "n01") + 0.5, T.n02 - 0.05, [rel(SHOP, 2.9, 1.6, 2.4), rel(SHOP, 0, 1.25, -0.2), 40], [rel(SHOP, 2.6, 1.58, 2.1), rel(SHOP, 0, 1.25, -0.2), 38], { in: "io", dof: 0.3 });
    const four = [["sandwich", 0], ["bread", 1], ["fish", 2], ["sandwich", 3]].map(([ic, i]) => { const g = el("g", { display: "none" }, document.getElementById("hud")); el("circle", { r: 62, fill: "#FFF6E4", stroke: "#1E1B22", "stroke-width": 6 }, g); H.icon[ic](el("g", { transform: "scale(1.1)" }, g)); return { g, i }; });
    HUDS.push({ update(t) { four.forEach(({ g, i }) => H.pop(g, t, W("four", 0, "n01") + 0.25 + i * 0.22, W("nobody", 0, "n01") - 0.1, 560 + i * 270, 190)); } });
    // n02: crane up to the island, flash-forward boom then bust, back to day
    shot(T.n02, E("n02") + 0.2, [rel(P_MO, 2, 1.7, 7), rel(P_MO, 0, 1.6, 0), 42], [[45, 42, 62], [0, 0, 2], 40], { dof: 0, out: "io" });
    ENVK.push([T.n02 - 0.01, "day"], [W("richer", 0, "n02"), "golden"], [W("almost", 0, "n02") - 0.2, "golden"], [W("broke", 0, "n02"), "night"], [W("same", 0, "n02") + 0.1, "night"], [W("same", 1, "n02"), "day"]);
    BOOM.push([W("richer", 0, "n02") - 0.3, 0], [W("richer", 0, "n02") + 0.4, 1], [W("broke", 0, "n02") - 0.3, 1], [W("broke", 0, "n02"), 0]);
    BUST.push([W("broke", 0, "n02") - 0.2, 0], [W("broke", 0, "n02") + 0.2, 1], [W("same", 1, "n02") - 0.2, 1], [W("same", 1, "n02") + 0.2, 0]);
    // n03 → title: the hero sandwich on the fountain rim
    const fz = (A.fountain ? A.fountain.z : 0);
    shot(T.n03 - 0.2, T.s03, [[1.6, 2.6, fz + 5.5], [0, 0.9, fz + 1.75], 36], [[0.7, 1.05, fz + 3.0], [0, 0.82, fz + 1.75], 30], { in: "io", dof: 0.6 });
    const tc = card({ text: "HOW MONEY ACTUALLY WORKS", sub: "explained with one sandwich", w: 1180, h: 220, size: 84, subSize: 40, y: 230, t0: T.s02 - 0.1, t1: T.s03 - 0.05 }); tc.g.setAttribute("data-title", "1");
  }
  // ---------- S03 Crumb Island, barter ----------
  {
    shot(T.s03, W("this", 0, "n05") - 0.05, [[10, 3.4, 78], [0, 3, 10], 40], [[4.5, 2.4, 34], [0, 2.2, 0], 40], { dof: 0.05, out: "lin" });
    card({ text: "CRUMB ISLAND", sub: "pop. 200 · 1 bank · 1 legendary sandwich shop", w: 900, y: 170, t0: W("crumb", 0, "n04"), t1: E("n04") + 0.2 });
    // the three meet near the fountain
    mo.jump(T.s03, V(-7.6, 0, -8.2)).show(T.s03, T.s04 + 3).faceTo(T.s03, { x: 0, z: 1 }).mood(T.s03, "happy");
    bee.show(T.s03, T.s04 + 3).at(T.s03, V(8.0, 0, -8.2)).faceTo(T.s03, { x: 0, z: 1 });
    finn.show(T.s03, T.s04 + 3).at(T.s03, V(3.0, 0, 9.5)).faceTo(T.s03, { x: -1, z: -0.5 });
    const tMo = W("this", 0, "n05"), tBee = W("bread", 0, "n05"), tFinn = W("fish", 0, "n05"), tWant = W("just", 0, "n05");
    shot(tMo, tBee - 0.35, [rel(V(-7.6, 0, -8.2), 2.2, 1.55, 4.2), rel(V(-7.6, 0, -8.2), -0.2, 1.15, 0), 36], [rel(V(-7.6, 0, -8.2), 1.9, 1.55, 3.7), rel(V(-7.6, 0, -8.2), -0.2, 1.15, 0), 36], { in: "io", dof: 0.35 });
    shot(tBee + 0.15, tFinn - 0.3, [rel(V(8.0, 0, -8.2), -2.2, 1.55, 4.2), rel(V(8.0, 0, -8.2), 0.2, 1.15, 0), 36], [rel(V(8.0, 0, -8.2), -1.9, 1.55, 3.8), rel(V(8.0, 0, -8.2), 0.2, 1.15, 0), 36], { in: "io", dof: 0.35 });
    finn.at(tFinn - 0.3, V(3.0, 0, 9.5)).at(E("n05"), V(1.2, 0, 3.3));
    shot(tFinn + 0.2, E("n05"), [[6.0, 1.6, 12.5], [2.4, 1.1, 7.0], 38], [[4.6, 1.55, 9.8], [1.8, 1.1, 5.0], 38], { in: "io", dof: 0.3 });
    think({ t0: tBee - 0.3, t1: W("luck", 0, "n06"), draw: H.icon.bread }, mo); think({ t0: tFinn - 0.3, t1: W("luck", 0, "n06"), draw: H.icon.fish }, bee); think({ t0: tWant, t1: W("luck", 0, "n06"), draw: H.icon.sandwich }, finn);
    mo.at(tBee, V(-7.6, 0, -8.2)).at(T.mo_01 - 0.3, V(-2.7, 0, -2.6)); bee.at(tFinn, V(8.0, 0, -8.2)).at(T.mo_01 - 0.2, V(2.9, 0, -2.6)); mo.faceTo(T.mo_01 - 1, { x: 1, z: 0 }); bee.faceTo(T.mo_01 - 1, { x: -1, z: 0 });
    shot(T.mo_01 - 0.3, E("finn_01") + 0.3, [[0.2, 2.3, 7.4], [0, 1.0, -2.0], 46], [[0.1, 2.1, 6.6], [0, 1.0, -2.0], 45], { in: "io", dof: 0.1 });
    says(mo, "mo_01"); mo.pose(T.mo_01, "give").pose(E("mo_01"), "relaxed"); says(bee, "bea_01"); bee.pose(T.bea_01, "crossed").mood(T.bea_01, "annoyed"); says(finn, "finn_01"); finn.pose(T.finn_01, "shrug").mood(T.finn_01, "deadpan").faceTo(T.finn_01, { x: 0, z: -1 });
    say(mo, { text: "Bread, please?", t0: T.mo_01 + 0.1, t1: E("mo_01"), side: 1 }); say(bee, { text: "I want fish.", t0: T.bea_01, t1: E("bea_01"), side: -1 }); say(finn, { text: "I want a sandwich.", t0: T.finn_01, t1: E("finn_01") + 0.2, side: 1 });
    // n06 top-down: the loop that never closes
    shot(T.n06 - 0.3, W("money", 0, "n07") - 0.3, [[0.2, 12.5, 1.6], [0, 0, -0.2], 52], [[0.15, 11.2, 1.4], [0, 0, -0.2], 52], { in: "io", dof: 0 });
    card({ text: "DOUBLE COINCIDENCE OF WANTS", sub: "both of you must want what the other has, right now", w: 1100, y: 130, t0: W("double", 0, "n06"), t1: W("good", 0, "n06") + 0.6 });
    [mo, bee, finn].forEach((c) => c.pose(W("luck", 0, "n06"), "slump", 0.2).mood(W("luck", 0, "n06"), "sad", 0.2).pose(W("honestly", 0, "n06"), "relaxed", 0.4).mood(W("honestly", 0, "n06"), "content", 0.4));
    card({ text: "No pure-barter town has ever been found", sub: "a thought experiment, not history", w: 1020, y: 930, size: 44, t0: W("historians", 0, "n06"), t1: W("handy", 0, "n06") + 0.4 });
    source({ text: "Anthropology: Humphrey (1985); Graeber, Debt (2011)", t0: W("historians", 0, "n06"), t1: E("n06") });
    // n07 the bill floats down; everyone agrees
    shot(W("money", 0, "n07") - 0.3, E("n07") + 0.5, [[0.1, 2.3, 8.0], [0, 2.3, 1.2], 42], [[0.1, 2.4, 7.0], [0, 2.5, 1.2], 40], { in: "io", dof: 0.2 });
    BK(W("money", 0, "n07") - 0.3, 0, 7, 1.2, 0, 0, 0); BK(W("money", 0, "n07"), 0, 4.6, 1.2, 6, 0.3, 0.2); BK(W("trick", 0, "n07"), 0, 2.7, 1.2, 6, -0.2, 0.1); BK(E("n07") + 0.4, 0, 2.7, 1.2, 6, 0.4, 0.1);
    [mo, bee, finn].forEach((c, i) => c.mood(W("money", 0, "n07"), "surprised", 0.3).faceTo(W("money", 0, "n07"), { x: [1, -1, -0.2][i], z: [0.3, 0.3, -1][i] }).mood(W("everyone", 1, "n07") + i * 0.12, "happy", 0.2));
    [mo, bee, finn].forEach((c, i) => c.rig.squash = (c.rig.squash || [[0, 0]]).concat([[W("agrees", 0, "n07") - 0.05 + i * 0.1, 0], [W("agrees", 0, "n07") + 0.05 + i * 0.1, 0.14], [W("agrees", 0, "n07") + 0.3 + i * 0.1, 0]]));
    card({ text: "EVERYONE. AGREES.", w: 760, y: 140, size: 72, t0: W("everyone", 1, "n07"), t1: E("n07") + 0.4 });
  }
  // ---------- S04 Yap ----------
  {
    const Y = A.raft || V(600, 0, -12), beach = A.beach || V(600, 0, 0), c1 = A.cam1 || V(604, 1.7, 8), c1L = A.cam1Look || V(600, 1.2, 20), cw = A.camWide || V(617, 8.5, 42), cwL = A.camWideLook || V(600, 1, 2);
    BK(T.s04, 0, 2.7, 1.2, 6, 0.4, 0.1); BK(W("yap", 0, "n08") - 0.2, 0, 2.7, 1.2, 6, 1.6, 0.1);
    shot(T.s04, W("yap", 0, "n08") - 0.1, [[0.3, 2.75, 2.6], [0, 2.7, 1.2], 34], [[0.2, 2.72, 2.25], [0, 2.7, 1.2], 32], { in: "io", dof: 0.5 });
    shot(W("yap", 0, "n08"), W("visitor", 0, "n08") - 0.1, [[cw.x, cw.y, cw.z], [cwL.x, cwL.y, cwL.z], 40], [[cw.x - 4, cw.y - 2, cw.z - 8], [cwL.x, cwL.y, cwL.z], 38], { dof: 0.05, fn: 80, ff: 600 });
    card({ text: "YAP · MICRONESIA", w: 640, y: 140, size: 58, t0: W("yap", 0, "n08") + 0.2, t1: W("visitor", 0, "n08") });
    const sinkA = W("sank", 0, "n08") - 0.2, sinkB = W("generations", 0, "n08");
    shot(W("visitor", 0, "n08"), W("family", 0, "n08") - 0.1, [[c1.x, c1.y + 0.3, c1.z], [c1L.x, c1L.y, c1L.z], 34], [[c1.x + 0.5, c1.y + 0.2, c1.z + 1.5], [c1L.x, c1L.y - 0.4, c1L.z], 32], { in: "io", dof: 0.15 });
    card({ text: "told to a visitor, early 1900s", w: 700, y: 950, size: 38, t0: W("visitor", 0, "n08") + 0.2, t1: W("sank", 0, "n08") });
    const sb = A.stoneBig || V(beach.x - 3, 0, beach.z - 6); shot(W("family", 0, "n08"), W("nobody", 0, "n09") + 0.3, [[sb.x + 3.5, 1.6, sb.z + 6], [sb.x, 1.6, sb.z], 38], [[sb.x + 2.8, 1.55, sb.z + 5], [sb.x, 1.6, sb.z], 36], { dof: 0.25 });
    window.__yapSink = [sinkA, sinkB];
    shot(W("nobody", 0, "n09") + 0.3, W("money", 0, "n09") - 0.2, [[Y.x + 4, 2.4, Y.z + 6], [Y.x, -0.3, Y.z], 38], [[Y.x + 3, 2.0, Y.z + 4.5], [Y.x, -0.3, Y.z], 36], { dof: 0.2 });
    shot(W("money", 0, "n09"), T.s05 + 0.6, [[30, 34, 46], [0, 0, 0], 42], [[24, 40, 40], [0, 0, 0], 44], { dof: 0, fn: 80, ff: 600 });
    card({ text: "money = a story we all believe", w: 900, y: 140, size: 56, t0: W("story", 0, "n09"), t1: E("n09") + 0.3 });
    window.__ring = [W("ripples", 0, "n09") - 0.2, 0];
  }
  // ---------- S05 the ten dollars goes round ----------
  {
    const tA = W("ana", 0, "n10"), tTen = W("ten", 1, "n10");
    shot(T.n10 - 0.05, tA - 0.05, [[P_MO.x + 6, 9, P_MO.z + 16], [P_MO.x, 2, P_MO.z], 40], [[P_MO.x + 3, 4, P_MO.z + 9], [P_MO.x, 2, P_MO.z], 38], { in: "io", dof: 0 });
    mo.jump(T.s05, V(300, 0, -1.55)).show(T.s05, W("bee", 0, "n11") - 0.1).faceTo(T.s05, { x: 0, z: 1 }).mood(T.s05, "content").pose(T.s05, "relaxed");
    ana.jump(T.s05, V(300.4, 0, 3.4)).show(T.s05, W("bee", 0, "n11") - 0.1).faceTo(T.s05, { x: 0, z: -1 }).mood(T.s05, "tired").pose(T.s05, "relaxed").at(tA + 1.2, V(300.15, 0, 1.25), "inOut");
    shot(tA, W("bee", 0, "n11") - 0.1, [rel(SHOP, 3.0, 1.65, 3.6), rel(SHOP, 0, 1.15, 0.2), 40], [rel(SHOP, 2.7, 1.6, 2.6), rel(SHOP, 0.05, 1.2, -0.2), 38], { dof: 0.3 });
    card({ text: "ANA · NURSE · 12-HOUR NIGHT SHIFT", w: 860, y: 140, size: 44, t0: tA + 0.2, t1: tTen });
    ana.pose(tTen - 0.4, "give", 0.25).pose(tTen + 0.6, "hold", 0.3); mo.pose(tTen + 0.1, "give", 0.2).pose(tTen + 0.7, "relaxed", 0.3).mood(tTen + 0.3, "happy");
    BK(tTen - 0.6, 300.25, 1.2, 0.95, 1.6, 0.2, 0); BK(tTen + 0.35, 300.0, 1.35, -0.3, 1.6, -0.4, 0.1); BK(tTen + 0.7, 299.6, 1.1, -0.35, 0.0, 0, 0);
    card({ text: "+$10", w: 230, h: 110, x: 760, y: 360, size: 64, color: "#2E8A4A", t0: tTen + 0.5, t1: tTen + 1.8 });
    says(ana, "ana_01"); ana.mood(T.ana_01, "joy", 0.2);
    // n11: Mo → Bee (bakery), Bee → Finn (harbour), Finn → Mo (shop)
    const t1 = W("bee", 0, "n11"), t2 = W("finn", 0, "n11"), t3 = W("and", 0, "n11");
    const pb = V(P_BEE.x - 0.9, 0, P_BEE.z + 3.2);
    mo.jump(t1 - 0.05, V(pb.x - 1.1, 0, pb.z)).show(t1 - 0.05, t2).faceTo(t1, { x: 1, z: 0 }).pose(t1, "give", 0.2);
    bee.jump(t1 - 0.05, V(pb.x + 0.2, 0, pb.z - 0.1)).show(t1 - 0.05, t3).faceTo(t1, { x: -1, z: 0 }).pose(t1 + 0.4, "hold", 0.2).mood(t1, "happy");
    shot(t1 - 0.05, t2 - 0.1, [[pb.x - 0.4, 1.5, pb.z + 3.8], [pb.x - 0.5, 1.2, pb.z], 38], [[pb.x - 0.3, 1.45, pb.z + 3.3], [pb.x - 0.5, 1.2, pb.z], 37], { dof: 0.35 });
    BK(t1 - 0.05, pb.x - 0.75, 1.2, pb.z + 0.1, 1.5, 0.2, 0); BK(t1 + 0.6, pb.x - 0.1, 1.25, pb.z, 1.5, -0.3, 0);
    const pq = V(1.6, 0, 16.8);
    bee.jump(t2 - 0.05, V(pq.x - 1.0, 0, pq.z)).faceTo(t2, { x: 1, z: 0 }).pose(t2, "give", 0.2);
    finn.jump(t2 - 0.05, V(pq.x + 0.3, 0, pq.z)).show(t2 - 0.05, t2 + 30).faceTo(t2, { x: -1, z: 0 }).pose(t2 + 0.4, "hold", 0.2).mood(t2, "happy");
    shot(t2 - 0.05, t3 - 0.1, [[pq.x - 0.2, 1.6, pq.z + 4.2], [pq.x - 0.3, 1.1, pq.z], 38], [[pq.x - 0.1, 1.5, pq.z + 3.6], [pq.x - 0.3, 1.1, pq.z], 37], { dof: 0.35 });
    BK(t2 - 0.05, pq.x - 0.65, 1.2, pq.z + 0.1, 1.5, 0.2, 0); BK(t2 + 0.6, pq.x + 0.05, 1.25, pq.z, 1.5, -0.3, 0);
    mo.jump(t3 - 0.05, V(300, 0, -1.55)).show(t3 - 0.05, E("finn_02") + 0.6).faceTo(t3, { x: 0, z: 1 }).pose(t3, "relaxed");
    finn.jump(t3 - 0.05, V(300.4, 0, 3.4)).faceTo(t3, { x: 0, z: -1 }).at(W("buys", 0, "n11") - 0.2, V(300.1, 0, 1.25), "inOut").mood(t3, "tired").pose(W("sandwich", 0, "n11") - 0.3, "give", 0.2).mood(W("sandwich", 0, "n11"), "happy");
    shot(t3 - 0.05, E("finn_02") + 0.4, [rel(SHOP, -3.0, 1.65, 3.4), rel(SHOP, 0.1, 1.15, 0.2), 40], [rel(SHOP, -2.6, 1.6, 2.5), rel(SHOP, 0.1, 1.2, -0.2), 38], { dof: 0.3 });
    BK(W("sandwich", 0, "n11") - 0.4, 300.2, 1.2, 0.95, 1.6, 0.2, 0); BK(W("sandwich", 0, "n11") + 0.4, 300.0, 1.35, -0.3, 1.6, -0.4, 0.1); BK(W("sandwich", 0, "n11") + 0.7, 299.6, 1.1, -0.35, 0, 0, 0);
    says(finn, "finn_02"); finn.mood(T.finn_02, "joy", 0.2);
    // n12–n13: aerial ripple map
    shot(T.n12 - 0.2, E("n13") + 0.2, [[26, 30, 34], [0, 0, 2], 42], [[-18, 34, 36], [0, 0, 2], 42], { dof: 0, fn: 80, ff: 600 });
    window.__loop = [T.n12, W("forty", 0, "n12")];
    const cnt = card({ text: "1 bill · 4 sales · $40 of stuff", w: 900, y: 140, size: 54, t0: W("forty", 0, "n12") - 0.3, t1: W("here's", 0, "n12") });
    card({ text: "YOUR SPENDING = SOMEONE'S INCOME", w: 1240, y: 140, size: 64, t0: W("spending", 0, "n12") - 0.1, t1: E("n12") + 0.3 });
    card({ text: "“One person's spending is another person's income.”", sub: "— Ray Dalio", w: 1500, y: 140, size: 50, t0: W("one", 0, "n13"), t1: W("every", 0, "n13") + 0.4 });
    source({ text: "Ray Dalio, How The Economic Machine Works (2013)", t0: W("ray", 0, "n13"), t1: E("n13") });
    window.__many = [W("every", 0, "n13"), E("n13")];
    // n14: money that doesn't exist yet
    mo.jump(T.n14 - 0.05, V(301.6, 0, -1.9)).show(T.n14 - 0.05, T.n16 - 0.05).faceTo(T.n14, { x: 1, z: -0.5 }).mood(T.n14, "worried").pose(T.n14, "relaxed");
    shot(T.n14 - 0.05, T.n15 + 2.0, [rel(SHOP, 0.2, 1.5, 2.6), rel(SHOP, 2.2, 1.0, -2.6), 40], [rel(SHOP, 0.6, 1.45, 1.9), rel(SHOP, 2.4, 1.0, -2.7), 38], { dof: 0.3 });
  }
  // ---------- S06 the bank makes money ----------
  {
    think({ t0: T.n15 + 0.2, t1: E("n15") - 0.3, draw: H.icon.oven, r: 76 }, mo);
    mo.mood(W("dream", 0, "n15"), "happy").mood(W("costs", 0, "n15"), "worried").mood(W("sixty-two", 0, "n15"), "sad", 0.2).pose(W("sixty-two", 0, "n15"), "shrug", 0.2);
    card({ text: "NEW OVEN: $1,000", w: 640, y: 150, size: 62, t0: W("costs", 0, "n15"), t1: E("n15") + 0.3 }); card({ text: "MO HAS: $62", w: 480, y: 290, size: 58, color: "#C8553D", t0: W("sixty-two", 0, "n15"), t1: E("n15") + 0.3 });
    shot(W("mo", 1, "n15"), E("n15") + 0.2, [rel(SHOP, 0.9, 1.5, 1.0), rel(SHOP, 1.6, 1.25, -1.9), 36], [rel(SHOP, 1.1, 1.45, 0.4), rel(SHOP, 1.6, 1.25, -1.9), 34], { in: "io", dof: 0.4 });
    // n16 bank exterior: Mo walks up the steps
    const bd = A.bankDoor || V(0, 0, -10.2);
    mo.jump(T.n16 - 0.05, V(bd.x - 0.6, 0, bd.z + 5.5)).show(T.n16 - 0.05, T.s07).faceTo(T.n16, { x: 0, z: -1 }).mood(T.n16, "worried").pose(T.n16, "relaxed").at(E("n16"), V(bd.x - 0.2, 0, bd.z + 1.0), "inOut");
    shot(T.n16 - 0.05, E("n16") + 0.2, [[bd.x + 2.5, 0.6, bd.z + 9.5], [bd.x, 3.2, bd.z - 2], 44], [[bd.x + 2.0, 0.7, bd.z + 7.5], [bd.x, 3.4, bd.z - 2], 42], { dof: 0.05 });
    // penny_01 interior: approved + stamp
    penny.show(T.penny_01 - 0.1, T.s07).mood(T.penny_01, "content").pose(T.penny_01, "relaxed");
    mo.jump(T.penny_01 - 0.1, A.bankCustomer ? V(A.bankCustomer.x - 0.35, 0, A.bankCustomer.z + 0.25) : V(400.35, 0, 0.75)).faceTo(T.penny_01, { x: 0, z: -1 }).mood(T.penny_01, "worried").mood(W("approved", 0, "penny_01") + 0.1, "joy", 0.2);
    says(penny, "penny_01"); penny.pose(W("approved", 0, "penny_01") - 0.15, "point", 0.12).pose(E("penny_01") + 0.3, "relaxed", 0.3);
    shot(T.penny_01 - 0.1, E("penny_01") + 0.3, [rel(BANK, -1.6, 1.5, 3.2), rel(BANK, 0.1, 1.1, -1.0), 38], [rel(BANK, -1.3, 1.45, 2.7), rel(BANK, 0.1, 1.1, -1.0), 37], { dof: 0.3 });
    window.__stamp = W("approved", 0, "penny_01");
    card({ text: "APPROVED", w: 520, y: 170, size: 80, color: "#C8553D", t0: W("approved", 0, "penny_01") + 0.05, t1: E("penny_01") + 0.3 });
    // n17: the myth — vault
    const vlt = A.vault || V(402.8, 1.45, -2.8); shot(T.n17 - 0.1, W("it's", 0, "n17") - 0.1, [[vlt.x - 3.4, 1.7, vlt.z + 4.6], [vlt.x, vlt.y, vlt.z], 40], [[vlt.x - 2.6, 1.65, vlt.z + 3.6], [vlt.x, vlt.y, vlt.z], 38], { in: "io", dof: 0.2 });
    window.__vault = [W("savings", 0, "n17") - 0.6, W("it's", 0, "n17")];
    card({ text: "MYTH: the bank lends out someone's savings", w: 1180, y: 150, size: 50, t0: W("probably", 0, "n17"), t1: W("it's", 0, "n17") + 0.8 });
    // n18: typing a thousand into existence
    shot(T.n18 - 0.1, W("mister", 0, "n18") - 0.1, [rel(BANK, -0.9, 1.6, 2.2), rel(BANK, 0, 1.2, -1.0), 40], [rel(BANK, -0.7, 1.55, 1.9), rel(BANK, 0, 1.2, -1.0), 38], { dof: 0.3 });
    card({ text: "“Whenever a bank makes a loan, it simultaneously creates a matching deposit…”", w: 1700, y: 140, size: 42, t0: W("whenever", 0, "n18"), t1: W("mister", 0, "n18") + 0.3 });
    source({ text: "Bank of England Quarterly Bulletin 2014 Q1 · McLeay, Radia & Thomas", w: 860, t0: W("bank", 0, "n18"), t1: E("n18") });
    const scr = A.screen || V(400.4, 1.05, -0.9);
    shot(W("mister", 0, "n18"), E("n18") + 0.2, [[scr.x + 0.75, scr.y + 0.18, scr.z + 1.4], [scr.x, scr.y, scr.z], 34], [[scr.x + 0.5, scr.y + 0.12, scr.z + 0.92], [scr.x, scr.y, scr.z], 30], { dof: 0.6 });
    window.__type = [W("types", 0, "n18"), W("thousand", 1, "n18")];
    card({ text: "+$1,000 (new money)", w: 640, y: 160, size: 58, color: "#2E8A4A", t0: W("thousand", 1, "n18") - 0.1, t1: E("n18") + 0.4 });
    says(mo, "mo_02"); mo.mood(T.mo_02, "shock", 0.15);
    shot(T.mo_02 - 0.05, E("mo_02") + 0.1, [rel(BANK, -0.2, 1.5, 2.6), rel(BANK, 0.35, 1.45, 0.75), 32], [rel(BANK, -0.1, 1.48, 2.3), rel(BANK, 0.35, 1.45, 0.75), 30], { dof: 0.5 });
    says(penny, "penny_02"); penny.mood(T.penny_02, "smug", 0.2);
    shot(T.penny_02 - 0.05, E("penny_02") + 0.2, [rel(BANK, 0.7, 1.5, 0.9), rel(BANK, 0, 1.45, -1.75), 32], [rel(BANK, 0.6, 1.48, 0.6), rel(BANK, 0, 1.45, -1.75), 30], { dof: 0.5 });
    // n19: diagram over a wide of the bank
    shot(T.n19 - 0.2, E("n19") + 0.5, [rel(BANK, 3.0, 2.4, 4.6), rel(BANK, 0, 1.2, -1.2), 42], [rel(BANK, 2.4, 2.1, 3.8), rel(BANK, 0, 1.2, -1.2), 40], { dof: 0.15 });
    card({ text: "97% of UK money = bank deposits", sub: "not cash (Dec 2013 figure)", w: 1000, y: 150, size: 58, t0: W("ninety-seven", 0, "n19") - 0.1, t1: W("not", 0, "n19") });
    card({ text: "NOT PRINTED. LENT.", w: 760, y: 150, size: 70, t0: W("not", 0, "n19"), t1: W("banks", 0, "n19") });
    card({ text: "Limits: profits · rules · interest rates", w: 1080, y: 150, size: 54, t0: W("banks", 0, "n19"), t1: W("when", 0, "n19") });
    card({ text: "BORROW → money created", w: 820, y: 150, size: 60, color: "#2E8A4A", t0: W("borrowing", 0, "n19") - 0.1, t1: E("n19") + 0.4 });
    card({ text: "REPAY → money deleted", w: 820, y: 300, size: 60, color: "#C8553D", t0: W("repaying", 0, "n19") - 0.1, t1: E("n19") + 0.4 });
  }
  // ---------- S07 the boom ----------
  {
    const t0 = T.s07, tKai = W("kai", 0, "n20"), tBoots = W("boots", 0, "n20"), tCrab = W("crab", 0, "n20");
    kai.show(t0, T.s08).jump(t0, V(302.0, 0, -1.4)).faceTo(t0, { x: 0, z: -1 }).pose(t0, "hipsHands").mood(t0, "happy");
    mo.jump(t0, V(299.6, 0, -1.5)).show(t0, tBoots - 0.1).faceTo(t0, { x: 1, z: 0 }).mood(t0, "joy");
    OVEN2.push([tKai, 0], [tKai + 1.0, 1]);
    shot(t0, tBoots - 0.1, [rel(SHOP, 0.6, 1.55, 3.2), rel(SHOP, 1.6, 1.1, -2.2), 40], [rel(SHOP, 1.0, 1.5, 2.6), rel(SHOP, 1.8, 1.1, -2.4), 38], { dof: 0.25 });
    BK(tKai + 0.9, 300.3, 1.3, -1.4, 1.4, 0.2, 0); BK(tKai + 1.6, 301.6, 1.3, -1.4, 1.4, -0.3, 0); BK(tKai + 1.9, 301.9, 1.1, -1.4, 0, 0, 0);
    // boots + family walk to the Crab Shack
    const cd = A.crabDoor || V(10.6, 0, 3);
    kai.jump(tBoots - 0.1, V(cd.x - 9, 0, cd.z + 2.5)).faceTo(tBoots, { x: 1, z: 0 }).pose(tBoots, "relaxed").mood(tBoots, "joy").at(W("waiter", 0, "n21"), V(cd.x - 1.6, 0, cd.z + 0.6), "linear");
    partner.show(tBoots - 0.1, T.s08).jump(tBoots - 0.1, V(cd.x - 9.8, 0, cd.z + 3.0)).faceTo(tBoots, { x: 1, z: 0 }).mood(tBoots, "happy").at(W("waiter", 0, "n21"), V(cd.x - 2.3, 0, cd.z + 1.1), "linear");
    kid.show(tBoots - 0.1, T.s08).jump(tBoots - 0.1, V(cd.x - 9.2, 0, cd.z + 3.6)).faceTo(tBoots, { x: 1, z: 0 }).mood(tBoots, "joy").at(W("waiter", 0, "n21"), V(cd.x - 1.9, 0, cd.z + 1.6), "linear");
    shot(tBoots - 0.1, W("waiter", 0, "n21") - 0.1, [[cd.x - 9, 1.0, cd.z + 7.5], [cd.x - 8, 0.7, cd.z + 2.6], 40], [[cd.x - 4, 1.4, cd.z + 7.0], [cd.x - 2, 1.0, cd.z + 1.2], 42], { dof: 0.2 });
    card({ text: "NEW BOOTS!", w: 460, y: 170, size: 62, t0: tBoots, t1: tCrab });
    // n21 Crab Shack busy, waiter hired, buys sandwiches
    waiter.show(W("waiter", 0, "n21") - 0.1, T.s08).jump(W("waiter", 0, "n21") - 0.1, V(cd.x - 0.6, 0, cd.z - 1.2)).faceTo(W("waiter", 0, "n21"), { x: -1, z: 0 }).mood(W("waiter", 0, "n21"), "joy").pose(W("hires", 0, "n21"), "wave", 0.2);
    shot(W("waiter", 0, "n21") - 0.1, W("waiter", 1, "n21") - 0.1, [[cd.x - 6.5, 1.7, cd.z + 2.5], [cd.x, 1.3, cd.z - 0.5], 40], [[cd.x - 5.6, 1.65, cd.z + 2.0], [cd.x, 1.3, cd.z - 0.5], 38], { dof: 0.25 });
    card({ text: "NOW HIRING → HIRED!", w: 700, y: 170, size: 58, t0: W("hires", 0, "n21"), t1: W("waiter", 1, "n21") });
    const md = A.moDoor || V(-9, 0, -10);
    waiter.jump(W("waiter", 1, "n21") - 0.1, V(md.x + 3.2, 0, md.z + 3.0)).faceTo(W("waiter", 1, "n21"), { x: -1, z: -0.5 }).at(W("mo", 0, "n21"), V(md.x + 0.6, 0, md.z + 1.0), "inOut").pose(W("mo", 0, "n21"), "give");
    mo.show(W("waiter", 1, "n21") - 0.1, T.n22).jump(W("waiter", 1, "n21") - 0.1, V(md.x - 0.4, 0, md.z + 1.0)).faceTo(W("waiter", 1, "n21"), { x: 1, z: 0.3 }).mood(W("waiter", 1, "n21"), "joy").pose(W("mo", 0, "n21") + 0.2, "give");
    shot(W("waiter", 1, "n21") - 0.1, E("n21") + 0.1, [[md.x + 1.5, 1.6, md.z + 6.5], [md.x, 1.3, md.z + 0.8], 40], [[md.x + 3.5, 3.5, md.z + 9.5], [md.x + 6, 1.3, md.z + 0.5], 44], { dof: 0.15 });
    window.__busy = [W("mo", 0, "n21"), E("n21")];
    // n22–n23 aerial boom + queue at the bank
    shot(T.n22 - 0.15, W("so", 0, "n22") - 0.1, [[30, 26, 30], [0, 0, 0], 44], [[22, 22, 34], [0, 0, 0], 42], { dof: 0, fn: 80, ff: 600 });
    BOOM.push([T.n22, 0], [W("borrows", 0, "n23"), 0.6], [W("booming", 0, "n23"), 1]);
    ENVK.push([T.n22, "day"], [W("booming", 0, "n23"), "golden"]);
    const bd2 = A.bankDoor || V(0, 0, -10.2), q = [bee, finn, kai, waiter, partner];
    q.forEach((c, i) => c.show(W("so", 0, "n22") - 0.1, E("n22") + 0.2).jump(W("so", 0, "n22") - 0.1, V(bd2.x + 4 + i * 1.3, 0, bd2.z + 6 + i * 0.4)).faceTo(W("so", 0, "n22"), { x: -1, z: -1 }).at(E("n22") + 0.2, V(bd2.x + 1 + i * 0.9, 0, bd2.z + 2.5 + i * 0.5), "linear").mood(W("so", 0, "n22"), "joy"));
    shot(W("so", 0, "n22") - 0.1, E("n22") + 0.2, [[bd2.x + 1.5, 1.4, bd2.z + 11], [bd2.x + 3, 1.2, bd2.z + 3], 40], [[bd2.x + 1.2, 1.5, bd2.z + 10], [bd2.x + 2, 1.4, bd2.z + 2], 40], { in: "io", dof: 0.2 });
    card({ text: "BIGGER BAKERY", w: 560, y: 170, size: 60, t0: W("bee", 0, "n23"), t1: W("finn", 0, "n23") });
    card({ text: "FASTER BOAT", w: 520, y: 170, size: 60, t0: W("finn", 0, "n23"), t1: W("everybody's", 0, "n23") });
    const pbk = V(P_BEE.x - 0.5, 0, P_BEE.z + 3.4);
    bee.show(T.n23 - 0.1, W("finn", 0, "n23")).jump(T.n23 - 0.1, pbk).faceTo(T.n23, { x: 0, z: 1 }).mood(T.n23, "joy").pose(T.n23 + 0.3, "wave");
    shot(T.n23 - 0.1, W("finn", 0, "n23") - 0.05, [[pbk.x - 2, 1.8, pbk.z + 6.5], [pbk.x, 2.2, pbk.z - 2], 42], [[pbk.x - 1.6, 1.7, pbk.z + 5.6], [pbk.x, 2.2, pbk.z - 2], 42], { dof: 0.1 });
    finn.show(W("finn", 0, "n23") - 0.05, W("everybody's", 0, "n23")).jump(W("finn", 0, "n23") - 0.05, V(1.4, 0.45, 26)).faceTo(W("finn", 0, "n23"), { x: 1, z: 0 }).mood(W("finn", 0, "n23"), "joy").pose(W("finn", 0, "n23") + 0.2, "wave");
    shot(W("finn", 0, "n23") - 0.05, W("everybody's", 0, "n23") - 0.05, [[-3, 2.0, 32], [2, 0.8, 27], 42], [[-2.4, 1.9, 31], [2, 0.8, 27], 42], { dof: 0.1 });
    shot(W("everybody's", 0, "n23") - 0.05, E("n23") + 0.3, [[8, 6, 18], [0, 1.5, -2], 44], [[4, 5, 15], [0, 2, -3], 42], { dof: 0, fn: 60, ff: 500 });
    card({ text: "CRUMB ISLAND IS BOOMING", w: 980, y: 150, size: 66, t0: W("booming", 0, "n23") - 0.3, t1: E("n23") + 0.4 });
    // n24 prices climb (shop menu + A-frame)
    PRICE.push([W("prices", 0, "n24"), 10], [W("twelve", 0, "n24"), 12], [W("fourteen", 0, "n24"), 14]);
    mo.show(T.n24 - 0.1, E("n25") + 0.3).jump(T.n24 - 0.1, V(300, 0, -1.55)).faceTo(T.n24, { x: 0, z: 1 }).mood(T.n24, "content").mood(W("fourteen", 0, "n24"), "worried");
    shot(T.n24 - 0.1, W("ten-dollar", 0, "n24") - 0.05, [rel(SHOP, 2.2, 1.7, 3.6), rel(SHOP, 0, 1.3, -1.5), 40], [rel(SHOP, 1.8, 1.65, 3.0), rel(SHOP, 0, 1.4, -1.5), 38], { dof: 0.2 });
    const menu = A.menu || V(300, 2.2, -3.4);
    shot(W("ten-dollar", 0, "n24") - 0.05, E("n24") + 0.2, [[menu.x + 0.3, menu.y - 0.2, menu.z + 3.0], [menu.x, menu.y, menu.z], 34], [[menu.x + 0.2, menu.y - 0.1, menu.z + 2.2], [menu.x, menu.y, menu.z], 30], { dof: 0.4 });
    card({ text: "$10 → $12 → $14", w: 640, y: 960, size: 64, color: "#C8553D", t0: W("twelve", 0, "n24"), t1: E("n24") + 0.3 });
    // n25 due date + dusk
    shot(T.n25 - 0.1, E("n25") + 0.9, [rel(SHOP, 0.2, 1.5, 2.0), rel(SHOP, 0, 1.3, -1.6), 36], [rel(SHOP, 0.15, 1.45, 1.5), rel(SHOP, 0, 1.3, -1.6), 34], { dof: 0.4 });
    card({ text: "REPAYMENT DUE", sub: "every loan has a date on it", w: 700, y: 170, size: 66, color: "#C8553D", t0: W("date", 0, "n25") - 0.2, t1: E("n25") + 0.8 });
    ENVK.push([T.n24 - 0.2, "golden"], [E("n25") + 0.9, "dusk"]);
  }
  // ---------- S08 the bust (night) ----------
  {
    ENVK.push([T.s08 + 0.4, "night"]); BOOM.push([T.s08, 1], [W("disappears", 0, "n26"), 0.2], [W("backwards", 0, "n28"), 0]); BUST.push([W("waiter", 0, "n27") - 0.3, 0], [W("go", 0, "n27"), 1]);
    const bd = A.bankDoor || V(0, 0, -10.2), tM = W("mo", 0, "n26"), tB = W("bee", 0, "n26"), tF = W("finn", 0, "n26");
    shot(T.s08, tM - 0.05, [[bd.x + 7, 3.0, bd.z + 16], [bd.x, 3, bd.z - 2], 42], [[bd.x + 5.5, 2.6, bd.z + 13], [bd.x, 3, bd.z - 2], 40], { dof: 0.05 });
    [[mo, tM], [bee, tB], [finn, tF]].forEach(([c, tt], i) => c.show(tt - 0.1, W("flows", 0, "n26") + 0.6).jump(tt - 0.1, V(bd.x - 2 + i * 2, 0, bd.z + 7)).faceTo(tt, { x: 0, z: -1 }).mood(tt, "worried").pose(tt, "relaxed").at(tt + 2.6, V(bd.x - 0.8 + i * 0.8, 0, bd.z + 1.6), "inOut"));
    shot(tM - 0.05, W("flows", 0, "n26") - 0.1, [[bd.x + 2.8, 1.5, bd.z + 12], [bd.x, 1.6, bd.z + 3], 40], [[bd.x + 2.2, 1.6, bd.z + 9.5], [bd.x, 1.6, bd.z + 2], 40], { dof: 0.2 });
    shot(W("flows", 0, "n26") - 0.1, E("n26") + 0.3, [[18, 28, 30], [0, 0, -4], 42], [[14, 26, 26], [0, 0, -4], 42], { dof: 0, fn: 80, ff: 600 });
    window.__red = [W("flows", 0, "n26"), W("disappears", 0, "n26")];
    // n27 chain reaction
    const ky = A.kaiYard || V(-13, 0, 3), cd = A.crabDoor || V(10.6, 0, 3), md = A.moDoor || V(-9, 0, -10);
    kai.show(T.n27 + 1, W("crab", 0, "n27") + 0.8).jump(T.n27 + 1, V(ky.x + 1.2, 0, ky.z + 0.5)).faceTo(T.n27 + 1, { x: 1, z: 0.3 }).mood(T.n27 + 1, "sad").pose(T.n27 + 1, "slump");
    shot(W("mo", 0, "n27") - 0.1, W("crab", 0, "n27") + 0.6, [[ky.x + 5.2, 1.5, ky.z + 3.2], [ky.x + 1.2, 1.1, ky.z + 0.5], 38], [[ky.x + 4.6, 1.45, ky.z + 2.6], [ky.x + 1.2, 1.1, ky.z + 0.5], 36], { dof: 0.3 });
    card({ text: "KAI: −$", w: 340, y: 170, size: 60, color: "#C8553D", t0: W("earns", 0, "n27"), t1: W("crab", 0, "n27") + 0.5 });
    waiter.show(W("crab", 0, "n27") + 0.6, E("n27") + 0.6).jump(W("crab", 0, "n27") + 0.6, V(cd.x - 0.8, 0, cd.z)).faceTo(W("crab", 0, "n27") + 0.6, { x: -1, z: 0.2 }).mood(W("crab", 0, "n27") + 0.6, "sad").pose(W("crab", 0, "n27") + 0.6, "holdBoth").at(W("waiter", 1, "n27"), V(cd.x - 3.5, 0, cd.z + 1.0), "inOut");
    shot(W("crab", 0, "n27") + 0.6, W("waiter", 1, "n27") - 0.1, [[cd.x - 5.5, 1.6, cd.z + 3.5], [cd.x - 1, 1.2, cd.z], 40], [[cd.x - 5.0, 1.55, cd.z + 3.0], [cd.x - 1.5, 1.2, cd.z], 38], { dof: 0.25 });
    mo.show(W("waiter", 1, "n27") - 0.1, E("n27") + 0.6).jump(W("waiter", 1, "n27") - 0.1, V(md.x - 0.3, 0, md.z + 1.0)).faceTo(W("waiter", 1, "n27"), { x: 1, z: 0.3 }).mood(W("waiter", 1, "n27"), "sad").pose(W("waiter", 1, "n27"), "slump");
    waiter.jump(W("waiter", 1, "n27") - 0.1, V(md.x + 5, 0, md.z + 3.0)).faceTo(W("waiter", 1, "n27"), { x: -1, z: 0 }).at(E("n27") + 0.6, V(md.x - 4, 0, md.z + 3.2), "linear");
    shot(W("waiter", 1, "n27") - 0.1, E("n27") + 0.6, [[md.x + 1.2, 1.55, md.z + 7.5], [md.x, 1.2, md.z + 1.5], 40], [[md.x + 0.4, 1.5, md.z + 7.0], [md.x, 1.2, md.z + 1.5], 40], { dof: 0.25 });
    // n28–n29 aerial night, paradox + cycle diagram
    shot(T.n28 - 0.1, E("n29") + 0.9, [[-26, 30, 30], [0, 0, 0], 42], [[-32, 36, 18], [0, 0, 0], 44], { dof: 0, fn: 80, ff: 600 });
    window.__redRing = W("backwards", 0, "n28");
    card({ text: "PARADOX OF THRIFT", sub: "everyone saving at once → everyone's income shrinks", w: 1100, y: 160, size: 68, t0: W("paradox", 0, "n28") - 0.4, t1: E("n28") + 0.3 });
    source({ text: "Keynes · St. Louis Fed explainer (2012)", t0: W("paradox", 0, "n28") - 0.4, t1: E("n28") + 0.3 });
    window.__cycle = [T.n29, E("n29") + 0.9];
    source({ text: "Debt-cycle lengths: Ray Dalio's estimate", t0: W("estimate", 0, "n29"), t1: E("n29") + 0.6 });
  }
  // ---------- S09 the Lens (Ana's flat, night → dawn) ----------
  {
    const F = FLAT, as = A.anaSpot || V(500.5, 0, -1.2);
    ana.show(T.s09, E("n38") + 0.6).jump(T.s09, as).faceTo(T.s09, { x: -1, z: 0.4 }).mood(T.s09, "worried").pose(T.s09, "slump");
    shot(T.s09, W("hours", 0, "n30") - 0.1, [rel(F, 2.4, 1.8, 3.8), rel(F, 0, 1.0, -0.8), 40], [rel(F, 2.0, 1.7, 3.2), rel(F, 0, 1.0, -0.8), 38], { dof: 0.3 });
    card({ text: "SHIFTS: MON · TUE · WED · THU", sub: "hours cut", w: 760, y: 170, size: 46, t0: W("hours", 0, "n30"), t1: W("rent", 0, "n30") });
    card({ text: "RENT DUE", w: 420, y: 170, size: 66, color: "#C8553D", t0: W("rent", 0, "n30"), t1: E("n30") + 0.2 });
    shot(W("hours", 0, "n30") - 0.1, E("n30") + 0.3, [rel(F, 1.0, 1.4, 2.0), rel(F, 0.4, 0.9, -0.7), 36], [rel(F, 0.8, 1.35, 1.6), rel(F, 0.4, 0.9, -0.7), 34], { dof: 0.45 });
    // n31 tunnel
    shot(T.n31 - 0.2, E("n32") + 0.3, [rel(as, 1.3, 1.5, 1.8), rel(as, 0, 1.45, 0), 34], [rel(as, 0.7, 1.5, 1.0), rel(as, 0, 1.45, 0), 28], { dof: 0.9 });
    window.__tunnel = [W("car", 0, "n31"), E("n32")];
    source({ text: "Mani et al., Science (2013) · replications mixed: O'Donnell et al. (2021)", w: 900, t0: W("study", 0, "n31"), t1: E("n31") });
    card({ text: "71% of US adults", sub: "say money is a significant source of stress", w: 980, y: 170, size: 70, t0: W("seventy-one", 0, "n32") - 0.2, t1: E("n32") + 0.3 });
    source({ text: "APA, Stress in America (2026)", t0: W("seventy-one", 0, "n32") - 0.2, t1: E("n32") + 0.3 });
    // n33 → lenses
    shot(T.n33 - 0.1, E("n38") + 0.6, [rel(as, 1.6, 1.55, 2.6), rel(as, 0, 1.4, 0), 36], [rel(as, 1.3, 1.5, 2.2), rel(as, 0, 1.4, 0), 35], { dof: 0.35 });
    window.__lens = { red: [T.ana_02 - 0.3, W("through", 1, "n34") - 0.1], gold: [W("through", 1, "n34") - 0.1, E("ana_03") + 0.4] };
    says(ana, "ana_02"); ana.mood(T.ana_02, "sad").pose(T.ana_02, "facepalm", 0.3); says(ana, "ana_03"); ana.mood(T.ana_03, "content", 0.4).pose(T.ana_03, "relaxed", 0.4).mood(W("okay", 0, "ana_03"), "neutral").mood(W("do", 0, "ana_03"), "content");
    card({ text: "RED LENS: “It's all my fault.”", w: 900, y: 150, size: 54, color: "#C8553D", t0: T.ana_02, t1: W("through", 1, "n34") - 0.1 });
    card({ text: "GOLD LENS: “What can I actually do?”", w: 1000, y: 150, size: 54, color: "#B8860B", t0: W("through", 1, "n34"), t1: E("ana_03") + 0.4 });
    card({ text: "Money stress is real.", sub: "real problems deserve real action", w: 860, y: 170, size: 60, t0: T.n35, t1: E("n35") + 0.2 });
    card({ text: "1 · CAN I CHANGE IT?", w: 760, y: 150, size: 64, color: "#2E8A4A", t0: W("one", 0, "n36"), t1: E("penny_03") });
    ana.pose(W("call", 0, "n36"), "phoneUp", 0.3).mood(W("call", 0, "n36"), "worried");
    penny.show(T.penny_03 - 0.1, E("penny_03") + 0.2).pose(T.penny_03, "phoneUp", 0).mood(T.penny_03, "happy"); says(penny, "penny_03");
    shot(T.penny_03 - 0.1, E("penny_03") + 0.2, [rel(BANK, -0.8, 1.5, 1.4), rel(BANK, 0, 1.45, -1.75), 34], [rel(BANK, -0.6, 1.48, 1.1), rel(BANK, 0, 1.45, -1.75), 33], { dof: 0.45 });
    ana.mood(E("penny_03"), "content").pose(T.n37, "relaxed", 0.4);
    shot(T.n37 - 0.1, E("n38") + 0.6, [rel(as, -1.2, 1.6, 2.8), rel(as, 0.2, 1.3, -0.4), 38], [rel(as, -1.0, 1.55, 2.4), rel(as, 0.2, 1.3, -0.4), 36], { dof: 0.3 });
    card({ text: "2 · CAN I REFRAME IT?", w: 780, y: 150, size: 64, color: "#B8860B", t0: W("two", 0, "n37"), t1: W("study", 0, "n37") });
    card({ text: "Out of your control → reframing helped", sub: "In your control → reframing alone went with more depression", w: 1300, y: 160, size: 50, t0: W("study", 0, "n37"), t1: E("n37") + 0.3 });
    source({ text: "Troy, Shallcross & Mauss, Psychological Science (2013), n = 170", w: 820, t0: W("study", 0, "n37"), t1: E("n37") });
    card({ text: "CHANGE what you can · REFRAME what you can't", w: 1400, y: 160, size: 58, t0: W("change", 0, "n38") - 0.1, t1: E("n38") + 0.6 });
    NIGHTW.push([T.s09, 1], [W("change", 0, "n38"), 1], [E("n38") + 0.5, 0]);
    ana.mood(W("change", 0, "n38"), "happy", 0.6);
  }
  // ---------- S10 somebody goes first ----------
  {
    ENVK.push([T.s10 - 0.6, "night"], [T.s10 + 0.4, "dawn"], [W("forward", 0, "n40"), "day"], [T.n43, "day"], [E("n43"), "golden"]);
    BUST.push([T.s10, 1], [W("first", 0, "n39"), 0]); PRICE.push([W("settle", 0, "n39") - 0.1, 14], [W("settle", 0, "n39") + 0.2, 11]); BOOM.push([W("forward", 0, "n40"), 0], [W("all", 0, "n41"), 0.5]);
    shot(T.s10, W("somebody", 0, "n39") - 0.1, [[-34, 18, 40], [0, 0, 0], 42], [[-28, 16, 34], [0, 0, -2], 42], { dof: 0, fn: 80, ff: 600 });
    const md = A.moDoor || V(-9, 0, -10), pb = V(P_BEE.x - 0.9, 0, P_BEE.z + 3.2), pq = V(1.6, 0, 16.8);
    mo.show(W("somebody", 0, "n39") - 0.1, W("bee", 0, "n40") + 2.2).jump(W("somebody", 0, "n39") - 0.1, V(md.x, 0, md.z + 0.6)).faceTo(W("somebody", 0, "n39"), { x: 0.4, z: 1 }).mood(W("somebody", 0, "n39"), "content").pose(W("somebody", 0, "n39"), "relaxed").at(E("n39") + 0.2, V(md.x + 0.4, 0, md.z + 2.4), "inOut");
    shot(W("somebody", 0, "n39") - 0.1, E("n39") + 0.3, [[md.x + 1.5, 1.4, md.z + 7.0], [md.x, 1.3, md.z + 1], 40], [[md.x + 1.2, 1.4, md.z + 6.0], [md.x, 1.3, md.z + 1], 38], { dof: 0.25 });
    mo.jump(T.n40 - 0.05, V(pb.x - 1.1, 0, pb.z)).faceTo(T.n40, { x: 1, z: 0 }).pose(T.n40 + 0.3, "give").mood(T.n40, "happy");
    bee.show(T.n40 - 0.05, W("finn", 0, "n40") + 1.5).jump(T.n40 - 0.05, V(pb.x + 0.2, 0, pb.z - 0.1)).faceTo(T.n40, { x: -1, z: 0 }).mood(T.n40, "joy");
    shot(T.n40 - 0.05, W("bee", 1, "n40") - 0.05, [[pb.x - 0.4, 1.5, pb.z + 3.8], [pb.x - 0.5, 1.2, pb.z], 38], [[pb.x - 0.3, 1.45, pb.z + 3.3], [pb.x - 0.5, 1.2, pb.z], 37], { dof: 0.3 });
    bee.jump(W("bee", 1, "n40") - 0.05, V(pq.x - 1.0, 0, pq.z)).faceTo(W("bee", 1, "n40"), { x: 1, z: 0 }).pose(W("bee", 1, "n40") + 0.2, "give");
    finn.show(W("bee", 1, "n40") - 0.05, E("n40") + 0.5).jump(W("bee", 1, "n40") - 0.05, V(pq.x + 0.3, 0, pq.z)).faceTo(W("bee", 1, "n40"), { x: -1, z: 0 }).mood(W("bee", 1, "n40"), "joy");
    shot(W("bee", 1, "n40") - 0.05, W("finn", 0, "n40") - 0.05, [[pq.x - 0.2, 1.6, pq.z + 4.2], [pq.x - 0.3, 1.1, pq.z], 38], [[pq.x - 0.1, 1.5, pq.z + 3.6], [pq.x - 0.3, 1.1, pq.z], 37], { dof: 0.3 });
    mo.jump(W("finn", 0, "n40") - 0.05, V(md.x - 0.3, 0, md.z + 1.2)).faceTo(W("finn", 0, "n40"), { x: 1, z: 0.3 }).mood(W("finn", 0, "n40"), "joy").pose(W("finn", 0, "n40") + 0.3, "give");
    finn.jump(W("finn", 0, "n40") - 0.05, V(md.x + 1.0, 0, md.z + 1.6)).faceTo(W("finn", 0, "n40"), { x: -1, z: -0.3 }).mood(W("finn", 0, "n40"), "joy");
    shot(W("finn", 0, "n40") - 0.05, W("ripple", 0, "n40") - 0.05, [[md.x + 1.0, 1.55, md.z + 6.0], [md.x + 0.3, 1.2, md.z + 1.3], 38], [[md.x + 0.8, 1.5, md.z + 5.4], [md.x + 0.3, 1.2, md.z + 1.3], 37], { dof: 0.3 });
    shot(W("ripple", 0, "n40") - 0.05, E("n41") + 0.3, [[20, 22, 30], [0, 0, 0], 42], [[38, 46, 52], [0, 0, 0], 44], { in: "io", dof: 0, fn: 80, ff: 700 });
    window.__forward = [W("ripple", 0, "n40") - 0.3, E("n41")];
    card({ text: "ALL OF US, RIPPLING INTO EACH OTHER", w: 1260, y: 150, size: 60, t0: W("all", 0, "n41"), t1: E("n41") + 0.3 });
    // n42 Ana at Mo's (exterior)
    ana.show(T.n42 - 0.1, E("n42") + 0.5).jump(T.n42 - 0.1, V(md.x + 3.2, 0, md.z + 3.4)).faceTo(T.n42, { x: -1, z: -0.5 }).mood(T.n42, "content").pose(T.n42, "relaxed").at(W("vote", 0, "n42"), V(md.x + 0.9, 0, md.z + 1.6), "inOut").mood(W("vote", 0, "n42"), "happy");
    mo.show(T.n42 - 0.1, E("n42") + 0.5).jump(T.n42 - 0.1, V(md.x - 0.4, 0, md.z + 1.1)).faceTo(T.n42, { x: 1, z: 0.3 }).mood(T.n42, "joy").pose(W("vote", 0, "n42"), "wave", 0.2);
    say(mo, { text: "Ana! The usual?", t0: W("vote", 0, "n42") + 0.1, t1: W("and", 0, "n42"), side: 1 });
    shot(T.n42 - 0.1, E("n42") + 0.5, [[md.x + 2.8, 1.55, md.z + 7.4], [md.x + 0.6, 1.25, md.z + 1.4], 40], [[md.x + 2.1, 1.5, md.z + 6.2], [md.x + 0.5, 1.25, md.z + 1.4], 38], { dof: 0.3 });
    card({ text: "CAN I CHANGE IT?  ·  CAN I REFRAME IT?", w: 1200, y: 150, size: 54, t0: W("ask", 0, "n42"), t1: E("n42") + 0.5 });
    // n43 A/B at the harbour, golden
    shot(T.n43 - 0.1, E("n43") + 0.6, [[-6, 4.5, 44], [1, 1, 16], 42], [[-4, 3.6, 38], [1, 1, 14], 40], { dof: 0, fn: 60, ff: 600 });
    window.__ab = [W("a", 0, "n43"), E("n43") + 0.6];
    // n44 → push into Mo's door, end card
    shot(T.n44 - 0.1, D, [[md.x + 3, 1.7, md.z + 9], [md.x, 1.3, md.z], 40], [[md.x + 0.4, 1.4, md.z + 2.2], [md.x, 1.2, md.z - 1], 38], { in: "io", dof: 0.1 });
    card({ text: "SOCIAL RIPPLE", sub: "how we shape each other", w: 760, y: 470, size: 84, t0: E("n44") + 0.6, t1: D + 1 });
  }

  // ======================= extra HUD set-pieces =======================
  {
    const hs = document.getElementById("hud");
    // debt-cycle wave (n29)
    const cyc = el("g", { display: "none" }, hs); el("rect", { x: 360, y: 640, width: 1200, height: 300, rx: 28, fill: "#120C22", opacity: 0.8 }, cyc);
    let d = "M420,860"; for (let x = 0; x <= 1080; x += 10) d += ` L${420 + x},${800 - Math.sin((x / 1080) * Math.PI * 4 - 0.6) * 90 - x * 0.05}`;
    const wave = el("path", { d, fill: "none", stroke: "#FFC24A", "stroke-width": 10, "stroke-linecap": "round", "stroke-dasharray": 3000, "stroke-dashoffset": 3000 }, cyc);
    const labs = [["BORROW", 520, 700], ["BOOM", 700, 668], ["PAY BACK", 940, 880], ["BUST", 1130, 910], ["5–8 YEARS", 1340, 690]].map(([s, x, y], i) => { const t = H.T(cyc, x, y, s, 34, i === 4 ? "#9FD8C2" : "#FFF6E4"); t.setAttribute("opacity", 0); return t; });
    HUDS.push({ update(t) { const w = window.__cycle; if (!w) return; const k = K.win(t, w[0], w[1], 0.3, 0.3); cyc.setAttribute("display", k > 0 ? "inline" : "none"); cyc.setAttribute("opacity", k); const pr = clamp((t - w[0]) / 3.2, 0, 1); wave.setAttribute("stroke-dashoffset", 3000 * (1 - pr)); labs.forEach((l, i) => l.setAttribute("opacity", clamp((t - w[0] - 0.3 - i * 0.7) / 0.3, 0, 1))); } });
    // worry swirl (n32): bills orbit the frame centre
    const sw = el("g", { display: "none" }, hs); const papers = ["RENT DUE", "OVERDUE", "ELECTRIC", "CARD", "PHONE", "FINAL NOTICE"].map((s, i) => { const g = el("g", {}, sw); el("rect", { x: -110, y: -60, width: 220, height: 120, rx: 10, fill: "#FFF6E4", stroke: "#1E1B22", "stroke-width": 5 }, g); H.T(g, 0, 0, s, 30, "#C8553D"); return g; });
    HUDS.push({ update(t) { const a = W("worry", 0, "n32"), b = W("quiet", 0, "n32") + 0.4; const k = K.win(t, a, b, 0.4, 0.4); sw.setAttribute("display", k > 0 ? "inline" : "none"); sw.setAttribute("opacity", k);
      papers.forEach((g, i) => { const an = t * 0.9 + i * (Math.PI * 2 / papers.length), r = 420 + 40 * Math.sin(t * 2 + i); g.setAttribute("transform", `translate(${960 + Math.cos(an) * r * 1.4},${520 + Math.sin(an) * r * 0.7}) rotate(${Math.sin(t * 3 + i) * 20}) scale(${0.8 + 0.2 * k})`); }); } });
    // A/B question (n43)
    const ab = el("g", { display: "none" }, hs);
    [[560, "A", "SAVE EVERY COIN", "coin"], [1360, "B", "KEEP BUYING SANDWICHES", "sandwich"]].forEach(([x, L, s, ic], i) => { const g = el("g", { "data-ab": i }, ab); el("rect", { x: x - 340, y: 330, width: 680, height: 380, rx: 34, fill: "#FFF6E4", stroke: "#1E1B22", "stroke-width": 8 }, g);
      el("circle", { cx: x, cy: 430, r: 62, fill: i ? "#FFC24A" : "#9FD8C2", stroke: "#1E1B22", "stroke-width": 6 }, g); H.T(g, x, 434, L, 70, "#1E1B22"); H.icon[ic](el("g", { transform: `translate(${x},${560}) scale(1.5)` }, g)); H.T(g, x, 660, s, 44, "#1E1B22"); });
    HUDS.push({ update(t) { const w = window.__ab; if (!w) return; const a = W("a", 0, "n43"), b = W("b", 0, "n43"); ab.setAttribute("display", t > a - 0.2 && t < w[1] + 0.3 ? "inline" : "none");
      [...ab.children].forEach((g, i) => { const t0 = i ? b : a, k = clamp((t - t0 + 0.1) / 0.3, 0, 1), o = 1 - clamp((t - w[1]) / 0.3, 0, 1); const x = i ? 1360 : 560; g.setAttribute("opacity", Math.min(1, k * 2) * o); g.setAttribute("transform", `translate(${x},520) scale(${0.7 + 0.3 * EASE.back(k)}) translate(${-x},-520)`); }); } });
  }
  // ======================= finalize characters =======================
  for (const id in CAST) { const a = CAST[id];
    a.tr.P.sort((p, q) => p[0] - q[0]); a.tr.P.forEach((k) => { const p = k[1]; if (p.x < 200 && Math.abs(p.y) < 0.01) k[1] = V(p.x, 0.07, p.z); }); ["pose", "mood"].forEach((k) => a.rig[k].sort((p, q) => p[0] - q[0])); a.face.sort((p, q) => p[0] - q[0]);
    const inVis = (t) => a.vis.some(([x, y]) => t >= x && t < y);
    a.b = W3.person({ id, P3: a.tr.P, face: a.face, pref: 1, vis: inVis, rig: Object.assign({}, a.look, { pose: a.rig.pose, mood: a.rig.mood, talk: a.rig.talk, squash: a.rig.squash || [[0, 0]], scale: a.look.scale || 1 }) }); }
  const camAt = W3.keys(KEYS);
  // lit filters per mood of light
  const LF = { day: W3.litF("#FFE6A8", -5, 5, [1.0, 0.98, 0.94], 0.85), golden: W3.litF("#FFB060", -6, 4, [1.0, 0.9, 0.8], 0.95), night: W3.litF("#AFC2FF", 5, 5, [0.72, 0.76, 0.95], 0.8), lamp: W3.litF("#FFD592", 0, 6, [1.0, 0.9, 0.78], 0.85), red: W3.litF("#FF7A6A", 5, 4, [1.0, 0.72, 0.72], 0.9), gold: W3.litF("#FFD27A", -5, 4, [1.05, 0.98, 0.84], 0.95) };

  // ======================= per-frame =======================
  const st = (keys, t) => SR.sampleTrack(keys, t, keys[0][1]);
  const gm = document.getElementById("gm"), vig = document.getElementById("vig");
  const lensR = el("circle", { cx: 960, cy: 520, r: 470, fill: "none", stroke: "#C8553D", "stroke-width": 26, opacity: 0 }, document.getElementById("hud"));
  const tl = gsap.timeline({ paused: true });
  function draw(t) {
    const c = camAt(t); const cx = c.p[0];
    const interior = cx > 250; const env = K.envAt(ENVK, t);
    const center = cx > 250 ? [Math.round(cx / 100) * 100, 0, 0] : [0, 0, 0]; applyEnv(env, center);
    const ev = { night: interior ? (cx > 450 && cx < 550 ? st(NIGHTW, t) : env.night) : env.night, boom: st(BOOM, t), bust: st(BUST, t), oven2: st(OVEN2, t), oven2Bow: t > T.s08 ? 1 : 0, sink: 0 };
    if (window.__yapSink) ev.sink = clamp((t - window.__yapSink[0]) / (window.__yapSink[1] - window.__yapSink[0]), 0, 1);
    town.update(t, ev); inner.update(t, ev); if (props.yap) { props.yap.update(t, ev); if (props.yap.group) props.yap.group.visible = cx > 550 && cx < 700; }
    const pr = Math.round(st(PRICE, t)); if (pr !== draw.pr) { draw.pr = pr; if (town.setPrice) town.setPrice(pr); if (inner.setPrice) inner.setPrice(pr); }
    if (inner.setWindowSky) inner.setWindowSky(st(NIGHTW, t)); if (inner.setBills) inner.setBills(t > T.s09 - 1 && t < T.s10 ? 1 : 0.3);
    if (inner.setVault && window.__vault) inner.setVault(clamp((t - window.__vault[0]) / 0.8, 0, 1) * (1 - clamp((t - window.__vault[1]) / 0.6, 0, 1)));
    if (inner.setScreen && window.__type) { const k = clamp((t - window.__type[0]) / (window.__type[1] - window.__type[0] + 0.3), 0, 1); const lines = ["ACCOUNT: MO", k < 0.5 ? "BALANCE:  $62.00" : k < 1 ? "BALANCE:  $" + (62 + Math.round(1000 * EASE.inOut((k - 0.5) * 2))).toLocaleString("en-US") + ".00" : "BALANCE:  $1,062.00", k >= 1 ? "NEW LOAN: $1,000.00" : "", ""];
      const key = lines.join("|"); if (key !== draw.scr) { draw.scr = key; inner.setScreen(lines); } }
    if (inner.setDrawer) inner.setDrawer(0);
    // bill
    if (billKeys.length) { billKeys.sort((a, b) => a[0] - b[0]); const b = st(billKeys, t); bill.group.position.set(b.x, b.y, b.z); bill.group.scale.setScalar(Math.max(0.0001, b.s)); bill.group.rotation.set(b.rx, b.ry + Math.sin(t * 1.3) * 0.08, Math.sin(t * 1.7) * 0.05); bill.group.visible = b.s > 0.01; if (bill.update) bill.update(t, { flutter: 1 }); }
    // sandwiches: hero on the fountain (n03/title), in hands later
    const fz = A.fountain ? A.fountain.z : 0;
    sandwich.group.visible = t > T.n03 - 0.3 && t < T.s03; sandwich.group.position.set(0, 0.66, fz + 1.75); sandwich.group.scale.setScalar(2.4); sandwich.group.rotation.set(0, t * 0.6, 0);
    sandwich2.group.visible = false;
    // arcs: the 4-step loop, the many, the red, the forward
    const loopK = window.__loop ? clamp((t - window.__loop[0]) / (window.__loop[1] - window.__loop[0]), 0, 1) : 0, loopVis = t > T.n12 - 0.3 && t < E("n13") + 0.3;
    loop4.forEach((a, i) => { const k = clamp(loopK * 3 - i, 0, 1); a.setProgress(0, k); a.setOpacity(loopVis ? 1 : 0); });
    const many = window.__many, fwd = window.__forward, busy = window.__busy;
    others.forEach((o, i) => { let k = 0; if (many && t > many[0] && t < many[1] + 0.3) k = clamp((t - many[0] - o.d * 3) / 0.9, 0, 1); if (t > T.n22 - 0.2 && t < E("n23") + 0.3) k = clamp((t - T.n22 - o.d * 4) / 0.9, 0, 1); if (fwd && t > fwd[0] && t < fwd[1] + 0.3) k = clamp((t - fwd[0] - o.d * 5) / 0.9, 0, 1);
      const head = ((t * 0.45 + o.d) % 1); o.arc.setProgress(0, k); o.arc.setOpacity(k > 0 ? 0.9 : 0); });
    const red = window.__red; redArcs.forEach((a, i) => { let k = 0, op = 0; if (red && t > red[0] - 0.2 && t < E("n26") + 0.3) { k = clamp((t - red[0] - i * 0.25) / 1.0, 0, 1); op = 1 - clamp((t - red[1]) / 0.8, 0, 1); } if (t > T.n28 && t < E("n29") + 0.5) { k = 1; op = 0.55 + 0.25 * Math.sin(t * 3 + i); } a.setProgress(Math.max(0, k - 0.35), k); a.setOpacity(op); });
    if (ring) { const r0 = window.__ring ? window.__ring[0] : 1e9, k = clamp((t - r0) / 2.2, 0, 1); ring.group.visible = k > 0 && k < 1; ring.group.position.set(0, 0.2, fz); ring.group.scale.setScalar(1 + k * 30); ring.update(k); }
    if (ringR) { const r0 = window.__redRing || 1e9, k = clamp((t - r0) / 2.4, 0, 1); ringR.group.visible = k > 0 && k < 1; ringR.group.position.set(0, 0.2, 0); ringR.group.scale.setScalar(1 + k * 30); ringR.update(k); }
    if (stamp) { const s0 = window.__stamp || 1e9, k = clamp((t - s0 + 0.35) / 0.35, 0, 1); stamp.group.visible = t > s0 - 0.6 && t < T.n17; stamp.group.position.set(400.25, 0.79, -0.6); if (stamp.update) stamp.update(clamp((t - s0 + 0.3) / 0.9, 0, 1)); }
    if (burst) { const k = clamp((t - W("thousand", 1, "n18")) / 1.4, 0, 1); burst.group.visible = k > 0 && k < 1; burst.group.position.set(400.4, 1.2, -0.6); burst.update(k); }
    if (piggy) { piggy.group.visible = !!window.__ab && t > window.__ab[0] - 0.3 && t < window.__ab[1]; piggy.group.position.set(-0.6, 0.45, 17.6); piggy.group.scale.setScalar(2.2); piggy.group.rotation.y = 0.5 + Math.sin(t) * 0.1; }
    // shake on the stamp
    let sh = [0, 0]; if (window.__stamp) { const k = (t - window.__stamp) / 0.2; if (k > 0 && k < 1) { const a = 0.025 * (1 - k); sh = [a * (Math.sin(t * 91) > 0 ? 1 : -1), a * (Math.cos(t * 77) > 0 ? 1 : -1)]; } }
    const golden = env.sunK > 0.8 && !interior;
    W3.frame(t, c, { shake: sh, lightFor: (b) => { if (window.__lens && t > window.__lens.red[0] && t < window.__lens.red[1]) return LF.red; if (window.__lens && t > window.__lens.gold[0] && t < window.__lens.gold[1]) return LF.gold;
      if (interior) return LF.lamp; if (env.night > 0.6) return LF.night; if (golden) return LF.golden; return LF.day; } });
    // screen-space bubbles that follow characters
    thinks.forEach(([h, who]) => h.update(t, who.b && who.b.head && who.b.outer.getAttribute("display") !== "none" ? who.b.head : null));
    sayB.forEach(([b, who]) => b.update(t, who.b && who.b.head ? { x: who.b.head.x, y: who.b.head.y - 40 } : { x: 960, y: 400 }));
    HUDS.forEach((h) => h.update(t));
    // grade: lens colours, tunnel vignette
    let gcol = "#FFFFFF"; if (window.__lens) { const r = K.win(t, window.__lens.red[0], window.__lens.red[1], 0.3, 0.2), g = K.win(t, window.__lens.gold[0], window.__lens.gold[1], 0.2, 0.5); if (r > 0) gcol = new TH.Color("#FFFFFF").lerp(new TH.Color("#FF9A8A"), r).getStyle(); if (g > 0) gcol = new TH.Color("#FFFFFF").lerp(new TH.Color("#FFE2A0"), g).getStyle();
      lensR.setAttribute("opacity", Math.max(r, g)); lensR.setAttribute("stroke", g > r ? "#E8B020" : "#C8553D"); }
    gm.style.background = gcol;
    const tun = window.__tunnel ? K.win(t, window.__tunnel[0], window.__tunnel[1], 1.2, 0.8) : 0; vig.style.opacity = (0.55 + tun * 0.45).toFixed(3); vig.style.transform = `scale(${(1 - tun * 0.18).toFixed(3)})`;
  }
  W3.compile();
  SR.drive(tl, D, draw);
  window.__timelines["main"] = tl;
  window.__EP3 = { W3, CAST, KEYS, A };
})();
