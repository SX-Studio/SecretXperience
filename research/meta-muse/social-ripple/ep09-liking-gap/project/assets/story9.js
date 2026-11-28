/* Ep9 "What If You Could See What People Really Think of You?" (paper storybook).
   Numbers: RED above YOU = your guess of how much they liked talking to you; GREEN above them = the real score.
   Feelings map: sympathy (cringe replay) -> awe (2 vs 9) -> curiosity (tests) -> tension (Juno guesses low too) -> release (go back) -> warmth. */
(function () {
  const { el, clamp, lerp } = SR, K = window.PK, SETS = window.SETS, T = window.DT, SC = window.SC, D = window.DUR;
  const S = (i) => T[i][0], E = (i) => T[i][0] + T[i][1], W = (i, s) => T[i][0] + s;
  const svg = document.getElementById("ov"), hud = document.getElementById("hud");
  Object.assign(SR.PAPER_POSES, {
    sip: { head: -4, shF: 70, elF: 120, shB: 4, elB: 8 }, thumbsUp: { shF: 62, elF: 96, shB: 4, elB: 8 },
    cringe: { head: 14, lean: 6, shF: 130, elF: 140, shB: 120, elB: 140 }, run: { lean: 14, shF: 60, elF: 80, shB: -40, elB: 70 },
    lookSea: { head: -6, shF: 10, elF: 20, shB: 10, elB: 20 },
  });
  const PROPS = {
    mug: (g) => { el("rect", { x: -16, y: -26, width: 32, height: 34, rx: 6, fill: "#FFFFFF" }, g); el("path", { d: "M-6,-34 q6,-10 0,-18 M6,-34 q6,-10 0,-18", fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: 0.7 }, g); },
    tray: (g) => { el("rect", { x: -80, y: -14, width: 160, height: 16, rx: 6, fill: "#E58A3A" }, g); [-46, 0, 46].forEach((x) => el("ellipse", { cx: x, cy: -26, rx: 22, ry: 13, fill: "#E8B06A" }, g)); },
    rope: (g) => { el("circle", { cx: 0, cy: -10, r: 22, fill: "none", stroke: "#C9A46A", "stroke-width": 8 }, g); },
  };
  const baseProp = SR.buildProp; SR.buildProp = (g, kind) => { if (kind !== "kit") return baseProp ? baseProp(g, kind) : null; for (const [k, f] of Object.entries(PROPS)) { const c = el("g", { "data-k": k, display: "none" }, g); f(c); } return g; };
  const LOOK = {
    you: { skin: "#E3AE85", shirt: "#6C5CE7", pants: "#2E3A5A", shoes: "#F2EDE4", hair: "#1E1B22", hairStyle: "short", seed: 51 },
    juno: { skin: "#8A5A3C", shirt: "#E0A42E", pants: "#2E3A5A", shoes: "#F2EDE4", hair: "#2A1A14", hairStyle: "long", seed: 33, body: "slim" },
    mo: { skin: "#C98B5E", shirt: "#E8834A", pants: "#3A4A63", shoes: "#6B4A34", hair: "#3A2A22", hairStyle: "short", seed: 7, body: "round" },
    finn: { skin: "#F6D2B4", shirt: "#F4C430", pants: "#3A4A63", shoes: "#3B3446", hair: "#2E4A6A", hairStyle: "cap", seed: 11, body: "lanky" },
    kai: { skin: "#B07448", shirt: "#FF8A2A", pants: "#3A4A63", shoes: "#7A5230", hair: "#E0B020", hairStyle: "cap", seed: 6, body: "broad" },
    bea: { skin: "#7A4A32", shirt: "#F2C14E", pants: "#6A4A8A", shoes: "#E86A8A", hair: "#1E1B22", hairStyle: "ponytail", seed: 4, body: "pear" },
    nia: { skin: "#664030", shirt: "#E8634A", pants: "#2E3A5A", shoes: "#F2EDE4", hair: "#1E1B22", hairStyle: "afro", seed: 9, body: "slim" },
  };
  const X = (i) => { const r = SR.mulberry32(300 + i * 13), pk = (a) => a[Math.floor(r() * a.length)]; return { skin: pk(["#F6D2B4", "#E3AE85", "#C98B5E", "#B07448", "#7A4A32", "#9A6440"]), shirt: pk(["#E8834A", "#F2C14E", "#5E9E5A", "#D85A8A", "#4F7FB0", "#7B6BB0", "#2F9E8F"]), pants: pk(["#3A4A63", "#5A4E44", "#2E5A74", "#46524A"]), shoes: "#3B3446", hair: pk(["#1E1B22", "#6A4A3A", "#C79A5A", "#2A1A14"]), hairStyle: pk(["short", "curly", "ponytail", "afro", "spiky", "bun"]), seed: 40 + i, body: pk(["avg", "round", "broad", "slim", "lanky", "pear"]) }; };
  const Dr = DIR.make(svg, D);
  ["square", "jetty", "bakeryIn", "cafe", "street", "lighthouse"].forEach((n) => Dr.set(n, SETS[n]));
  const A = {}; for (const n of Object.keys(LOOK)) A[n] = Dr.actor(n, Object.assign({}, LOOK[n], { prop: { kind: "kit" } }));
  const EXN = 10; for (let i = 0; i < EXN; i++) A["x" + i] = Dr.actor("x" + i, X(i), { extra: true, mood: ["grin", "happy", "content", "cheeky"][i % 4] });
  const PROPK = {}; Object.keys(LOOK).forEach((n) => (PROPK[n] = []));
  const prop = (n, t, k) => PROPK[n].push([t, k]);
  const M = (n, t, m, d = 0.35, e = "inOut") => A[n].mood.push([t, m, d, e]), Po = (n, t, p, d = 0.35, e = "back") => A[n].pose.push([t, p, d, e]);
  const Lk = (n, t, x, y) => A[n].look.push([t, { x, y }]), Hop = (n, t, h = 14) => A[n].hop.push([t, h]), Lips = (n, id) => A[n].lips.push([S(id), id]);
  const shot = (t, set, cam, cast, k, tag) => Dr.shot({ t, set, cam, cast, k, tag });
  const C = (x, y, z, x2, y2, z2, e) => ({ x, y, z, x2, y2, z2, e }), Pp = (fx, fy, hd, f = 1, more = {}) => Object.assign({ fx, fy, hd, f }, more), Wd = (wx, wy, s, f = 1, more = {}) => Object.assign({ wx, wy, s, f }, more);
  const crowd = (spots) => { const o = {}; spots.forEach(([i, wx, wy, s, f]) => { o["x" + i] = Wd(wx, wy, s, f ?? (wx < 960 ? 1 : -1)); }); return o; };
  // numbers: NUM[name] = [[t, text, color]]; text null hides
  const RED = "#FF4D4D", GRN = "#5BFF8F", GOLD = "#FFD84A";
  const NUM = {}; const num = (n, t, v, c) => (NUM[n] = NUM[n] || []).push([t, v, c]);
  const bubbles = []; const say = (t0, t1, text, who = "you") => bubbles.push([t0, t1, text, who]);
  const sqCrowd = [[0, -60, 880, 0.42], [1, 230, 860, 0.4], [2, 480, 870, 0.44], [3, 1400, 865, 0.42], [4, 1660, 880, 0.44], [5, 1940, 870, 0.4], [6, 250, 1000, 0.55], [7, 1700, 1010, 0.55], [8, 760, 850, 0.36], [9, 1150, 850, 0.36]];

  // =================== SC01 cold open: the café goodbye (10:02 AM) ===================
  const t01 = SC.SC01, tBye = S("juno_c") - 1.7;
  shot(t01, "cafe", C(960, 560, 1.15, 960, 560, 1.22, "lin"), { you: Pp(0.30, 0.44, 0.22, 1), juno: Pp(0.68, 0.44, 0.22, -1) }, 0.6, "SC01 goodbye");
  Po("you", 0, "sit", 0); Po("juno", 0, "sit", 0); M("juno", 0, "laugh"); M("you", 0, "grin"); M("juno", 1.2, "happy", 0.3); M("you", 1.5, "happy", 0.3); Lk("you", 0, 0.6, 0); M("you", tBye - 0.6, "nervous", 0.3); prop("you", 0, "mug"); prop("juno", 0, "mug");
  say(tBye, S("juno_c") - 0.05, "Well… I'll let you go!");
  Lips("juno", "juno_c"); M("juno", S("juno_c"), "surprised", 0.2); M("juno", W("juno_c", 0.6), "forced", 0.3); Po("juno", W("juno_c", 0.5), "wave", 0.3);
  shot(S("n01") - 0.1, "square", C(960, 560, 1.0), Object.assign({ you: Wd(520, 960, 0.62, 1), mo: Wd(1500, 940, 0.56, -1) }, crowd(sqCrowd)), 1, "SC01 the power");
  Po("you", S("n01") - 0.1, "relaxed", 0); prop("you", S("n01") - 0.1, null); M("you", S("n01"), "content", 0.3); num("mo", W("n01", 1.5), "8/10", GRN); sqCrowd.forEach(([i], j) => num("x" + i, W("n01", 1.8) + j * 0.12, `${[7, 9, 8, 6, 9, 8, 10, 7, 8, 9][j]}/10`, GRN));
  shot(S("n02") - 0.1, "square", C(640, 520, 1.7), { you: Pp(0.45, 0.50, 0.36, 1) }, 1, "SC01 your guess"); Lk("you", S("n02"), 0, -1); M("you", S("n02"), "worried", 0.3); num("you", W("n02", 1.2), "?", RED);

  // =================== SC02 the replay ===================
  const t02 = SC.SC02, tTwo = W("n05", 0.9), tNine = W("n06", 0.9);
  shot(t02, "street", C(1000, 580, 1.25, 1250, 580, 1.25, "lin"), { you: Pp(0.25, 0.44, 0.24, 1, { fx2: 0.55, walk: 1 }) }, { vanX: -2000 }, "SC02 walking home");
  M("you", t02, "nervous", 0.3); num("you", t02, null);
  const rw = [W("n04", 0.0), W("n04", 0.85), W("n04", 1.75)];
  say(rw[0], E("n04") + 0.6, "\"You too!\"", "r1"); say(rw[1], E("n04") + 0.6, "*snort*", "r2"); say(rw[2], E("n04") + 0.6, "I'll let you go!", "r3");
  shot(S("n04") - 0.1, "street", C(1150, 520, 1.9), { you: Pp(0.40, 0.52, 0.40, 1) }, { vanX: -2000 }, "SC02 cringe");
  Po("you", rw[0], "cringe", 0.2); M("you", rw[0], "terrified", 0.2); Po("you", rw[1], "facepalm", 0.2); M("you", rw[1], "sad", 0.2); Po("you", rw[2], "cringe", 0.2); M("you", rw[2], "terrified", 0.2);
  shot(S("n05") - 0.1, "street", C(1150, 540, 1.6), { you: Pp(0.42, 0.50, 0.34, 1) }, { vanX: -2000 }, "SC02 two"); Po("you", S("n05"), "slump", 0.4); M("you", S("n05"), "sad", 0.3); num("you", tTwo, "2/10", RED);
  shot(S("n06") - 0.1, "cafe", C(1200, 520, 1.6), { juno: Pp(0.55, 0.46, 0.32, -1) }, 0.6, "SC02 nine"); Po("juno", S("n06") - 0.1, "sit", 0); prop("juno", S("n06") - 0.1, "mug"); M("juno", S("n06"), "happy", 0.3); num("juno", tNine, "9/10", GRN); Lk("juno", tNine, -0.8, 0);
  const tTitle0 = E("n06") + 1.0, tTitle1 = SC.SC03 - 0.05;
  shot(tTitle0, "square", C(960, 540, 1.0), crowd(sqCrowd), 0.85, "SC02 title bg");

  // =================== SC03 the test ===================
  const t03 = SC.SC03;
  shot(t03, "square", C(820, 520, 1.5), { you: Pp(0.40, 0.44, 0.32, 1) }, 1, "SC03 test"); M("you", t03, "skeptic", 0.3); Lk("you", t03, 0.8, 0); num("you", t03, null);
  const tMo = S("n08") - 0.1, tFinn = S("n09") - 0.1, tBea = S("n10") - 0.1;
  shot(tMo, "cafe", C(960, 560, 1.15), { you: Pp(0.32, 0.44, 0.22, 1), mo: Pp(0.68, 0.44, 0.22, -1) }, 0.8, "SC03 mo");
  Po("you", tMo, "relaxed", 0); prop("mo", tMo, "tray"); Po("mo", tMo, "hold", 0); M("mo", tMo, "happy"); num("you", W("n08", 0.9), "3/10", RED); Lips("mo", "mo_e"); Po("mo", S("mo_e"), "wave", 0.25); M("mo", S("mo_e"), "grin", 0.2); num("mo", E("mo_e") + 0.1, "8/10", GRN); M("you", E("mo_e") + 0.2, "surprised", 0.25);
  shot(tFinn, "jetty", C(1000, 640, 1.3), { you: Pp(0.36, 0.42, 0.20, 1), finn: Pp(0.66, 0.40, 0.20, -1) }, null, "SC03 finn");
  num("you", tFinn, null); num("you", W("n09", 0.9), "4/10", RED); Lips("finn", "finn_d"); M("finn", S("finn_d"), "laugh", 0.2); Po("finn", S("finn_d"), "cheer", 0.25); num("finn", E("finn_d") + 0.1, "9/10", GRN); M("you", E("finn_d") + 0.2, "surprised", 0.25);
  shot(tBea, "bakeryIn", C(900, 580, 1.15), { bea: Wd(1180, 900, 0.9, -1), you: Wd(560, 900, 0.9, 1) }, null, "SC03 bea");
  num("you", tBea, null); num("you", W("n10", 0.9), "2/10", RED); prop("bea", tBea, "tray"); Po("bea", tBea, "hold", 0); M("bea", tBea, "happy"); num("bea", W("n10", 1.6), "8/10", GRN); Hop("bea", W("n10", 1.6), 10); M("you", W("n10", 1.7), "shock", 0.2);
  const tKai = S("n28") - 0.1;
  shot(tKai, "street", C(1200, 580, 1.3), { you: Pp(0.34, 0.42, 0.22, 1), kai: Pp(0.66, 0.42, 0.22, -1) }, { vanX: -2000 }, "SC03 kai");
  num("you", tKai, null); num("you", W("n28", 0.8), "1/10", RED); M("kai", tKai, "happy"); Po("kai", W("n28", 1.2), "thumbsUp", 0.25); num("kai", W("n28", 1.4), "7/10", GRN); M("you", W("n28", 1.5), "shock", 0.2);
  shot(S("n11") - 0.1, "square", C(700, 520, 1.75), { you: Pp(0.46, 0.48, 0.36, 1) }, 1, "SC03 always low"); num("you", S("n11") - 0.1, null); M("you", S("n11"), "confused", 0.3); Po("you", S("n11"), "think", 0.3);

  // =================== SC04 the gap (fact lands after the tests) ===================
  const t04 = SC.SC04;
  shot(t04, "square", C(960, 560, 1.0, 960, 560, 1.07, "lin"), Object.assign({ you: Wd(560, 960, 0.6, 1), mo: Wd(1480, 950, 0.56, -1) }, crowd(sqCrowd)), 1, "SC04 everyone");
  num("you", t04, null); sqCrowd.forEach(([i], j) => { num("x" + i, t04 + 0.4 + j * 0.15, `${[3, 2, 4, 2, 3, 5, 2, 3, 4, 2][j]}/10`, RED); num("x" + i, W("n12", 5.0) + j * 0.1, `${[8, 9, 7, 8, 9, 8, 7, 9, 8, 10][j]}/10`, GRN); });
  num("mo", t04, null); M("you", W("n12", 5.0), "surprised", 0.4);
  shot(S("n13") - 0.1, "square", C(1150, 520, 1.6, 1150, 500, 1.75, "lin"), { you: Pp(0.42, 0.48, 0.34, 1) }, 1, "SC04 too wrapped up"); M("you", S("n13"), "relieved", 0.6); Po("you", S("n13"), "relaxed", 0.4);
  sqCrowd.forEach(([i]) => num("x" + i, S("n13"), null));

  // =================== SC05 the twist: Juno guesses low too (5:40 PM) ===================
  const t05 = SC.SC05;
  shot(t05, "lighthouse", C(960, 560, 1.0), { juno: Wd(1250, 880, 0.42, -1), you: Wd(250, 900, 0.44, 1) }, null, "SC05 juno at dusk");
  Po("juno", t05, "lookSea", 0); prop("juno", t05, null); prop("you", t05, null); M("juno", t05, "sad", 0.4); M("you", t05, "surprised", 0.3); num("juno", t05, null);
  shot(S("juno_d") - 0.3, "lighthouse", C(1150, 600, 1.55), { juno: Pp(0.55, 0.42, 0.28, -1) }, null, "SC05 muttering");
  Lips("juno", "juno_d"); Po("juno", S("juno_d"), "facepalm", 0.3); M("juno", S("juno_d"), "terrified", 0.3); num("juno", E("juno_d") + 0.2, "3/10", RED);
  const tSplit = S("n15") - 0.1;
  shot(tSplit, "lighthouse", C(960, 600, 1.2), { you: Pp(0.25, 0.42, 0.22, 1), juno: Pp(0.72, 0.42, 0.22, -1) }, null, "SC05 both low");
  Po("juno", tSplit, "slump", 0.3); M("juno", tSplit, "sad", 0.3); num("juno", tSplit, "3/10", RED); num("you", W("n15", 2.0), "9/10", GRN); M("you", W("n15", 2.0), "shock", 0.2);
  shot(S("n16") - 0.1, "lighthouse", C(960, 560, 1.0, 960, 540, 0.92, "lin"), { you: Wd(250, 900, 0.44, 1), juno: Wd(1250, 880, 0.42, -1, { wx2: 1750, d0: 1.5, walk: 1 }) }, null, "SC05 drifting apart");
  Po("juno", S("n16"), "relaxed", 0.4); M("juno", S("n16"), "sad", 0.3); M("you", S("n16"), "sad", 0.4); num("you", S("n16"), null); num("juno", S("n16"), null);

  const tFF = S("n26") - 0.15;
  shot(tFF, "square", C(960, 560, 1.0), Object.assign({ you: Wd(420, 960, 0.6, 1), juno: Wd(1500, 950, 0.58, -1) }, crowd(sqCrowd.slice(0, 6))), 1, "SC05 flash-forward");
  M("you", tFF, "forced", 0.2); M("juno", tFF, "forced", 0.2); Po("you", tFF + 0.5, "wave", 0.25); Po("juno", tFF + 0.6, "wave", 0.25); Po("you", tFF + 1.6, "relaxed", 0.3); Po("juno", tFF + 1.7, "relaxed", 0.3); Lk("you", tFF + 1.8, -1, 0.4); Lk("juno", tFF + 1.9, 1, 0.4); M("you", tFF + 2.0, "sad", 0.4); M("juno", tFF + 2.0, "sad", 0.4);
  // =================== SC06 the ending you chose (flashback) ===================
  const t06 = SC.SC06, tFB = S("n18") - 0.1;
  shot(tFB, "cafe", C(960, 560, 1.2), { you: Pp(0.30, 0.44, 0.22, 1), juno: Pp(0.68, 0.44, 0.22, -1) }, 0.6, "SC06 flashback");
  Po("you", tFB, "sit", 0); Po("juno", tFB, "sit", 0); prop("you", tFB, "mug"); prop("juno", tFB, "mug"); M("juno", tFB, "happy"); M("you", tFB, "nervous"); say(W("n18", 2.4), E("n18") + 0.5, "I'll let you go!");
  M("juno", W("n18", 2.6), "surprised", 0.2);
  shot(S("n20") - 0.1, "cafe", C(960, 540, 1.3), { you: Pp(0.30, 0.44, 0.24, 1), juno: Pp(0.70, 0.44, 0.24, -1) }, 0.6, "SC06 neither done"); M("juno", S("n20"), "sad", 0.3); M("you", W("n20", 1.4), "sad", 0.3);
  num("juno", S("n20") + 0.3, "wanted more", GOLD); num("you", W("n20", 1.4), "wanted more", GOLD);

  // =================== SC07 going back (6:05 PM) ===================
  const t07 = SC.SC07, tRun = t07, tAsk = t07 + 2.2;
  shot(tRun, "street", C(1100, 580, 1.15, 1500, 580, 1.15, "lin"), { you: Pp(0.10, 0.44, 0.24, 1, { fx2: 0.80, walk: 1, e: "lin" }) }, { vanX: -2000 }, "SC07 run");
  Po("you", tRun, "run", 0.2); prop("you", tRun, null); prop("juno", tRun, null); M("you", tRun, "determined", 0.2); num("you", tRun, null); num("juno", tRun, null);
  shot(tAsk, "lighthouse", C(960, 600, 1.2), { you: Pp(0.22, 0.42, 0.22, 1, { fx2: 0.40, d1: 1.6, walk: 1, e: "out" }), juno: Pp(0.72, 0.42, 0.22, -1) }, null, "SC07 ask");
  Po("you", tAsk, "relaxed", 0.3); M("you", tAsk, "hopeful", 0.3); M("juno", tAsk, "sad"); Po("juno", tAsk, "slump", 0); say(tAsk + 0.9, S("juno_e") - 0.1, "Hey — want to finish our chat?");
  M("juno", tAsk + 1.2, "surprised", 0.2); Po("juno", tAsk + 1.2, "relaxed", 0.3); Lips("juno", "juno_e"); M("juno", S("juno_e"), "joy", 0.25); M("you", S("juno_e") + 0.3, "happy", 0.3); Hop("juno", S("juno_e"), 12);
  shot(S("juno_f") - 0.2, "lighthouse", C(1100, 560, 1.5), { you: Pp(0.30, 0.44, 0.26, 1), juno: Pp(0.66, 0.44, 0.26, -1) }, null, "SC07 tomorrow");
  Lips("juno", "juno_f"); M("juno", S("juno_f"), "laugh", 0.2); M("you", W("juno_f", 0.5), "joy", 0.2); Po("you", E("juno_f") + 0.1, "thumbsUp", 0.2);
  const tTen = S("n21") - 0.05; num("you", tTen, "10/10", GRN); num("juno", tTen, "10/10", GRN); Hop("you", tTen, 10); Hop("juno", tTen + 0.08, 10);

  // =================== SC08 takeaway ===================
  const t08 = SC.SC08;
  shot(t08, "square", C(1380, 520, 1.2, 1380, 470, 1.45, "lin"), { nia: Pp(0.5, 0.36, 0.26, 1) }, 0.9, "SC08 nia"); num("you", t08, null); num("juno", t08, null);
  Lips("nia", "n22"); M("nia", t08, "content"); M("nia", W("n22", 2.0), "hopeful", 0.6); M("nia", W("n22", 8.0), "happy", 0.6); Po("nia", W("n22", 1.8), "give", 0.4); Po("nia", W("n22", 6.0), "relaxed", 0.5); Po("nia", W("n22", 9.0), "point", 0.4); Po("nia", W("n22", 12.0), "proud", 0.5);

  // =================== SC09 mirror ending (next morning) ===================
  const t09 = SC.SC09;
  shot(t09, "cafe", C(960, 560, 1.15, 960, 560, 1.25, "lin"), { you: Pp(0.30, 0.44, 0.22, 1), juno: Pp(0.68, 0.44, 0.22, -1) }, 1, "SC09 two hours");
  Po("you", t09, "sit", 0); Po("juno", t09, "sit", 0); prop("you", t09, "mug"); prop("juno", t09, "mug"); M("you", t09, "laughing", 0.2); M("juno", t09, "laugh", 0.2); Lk("you", t09, 0.6, 0); num("you", t09, null); num("juno", t09, null);
  const tY = E("n30") + 0.5;
  shot(tY, "cafe", C(960, 560, 1.15), { you: Pp(0.32, 0.44, 0.22, 1), mo: Pp(0.68, 0.44, 0.22, -1) }, 1, "SC09 you too");
  prop("you", tY, null); prop("juno", tY, null); Po("you", tY, "relaxed", 0); prop("mo", tY, "mug"); Po("mo", tY, "give", 0.2); M("mo", tY, "happy"); M("you", tY, "content"); say(tY + 0.4, tY + 1.6, "Enjoy your coffee!", "mo"); say(tY + 1.7, tY + 3.0, "You too!");
  M("you", tY + 1.9, "terrified", 0.15); Po("you", tY + 1.9, "cringe", 0.15); num("you", tY + 2.2, "2/10", RED); M("mo", tY + 2.1, "laugh", 0.2);
  M("you", tY + 3.2, "laughing", 0.3); Po("you", tY + 3.2, "relaxed", 0.4); num("you", tY + 3.4, null); num("mo", tY + 3.4, "9/10", GRN); prop("you", tY + 2.8, "mug"); prop("mo", tY + 2.8, null);
  const tEnd = S("n23") - 0.1;
  shot(tEnd, "square", C(960, 560, 1.12, 960, 540, 1.0, "lin"), Object.assign({ you: Wd(1380, 1010, 0.64, 1), juno: Wd(1600, 1010, 0.64, -1) }, crowd(sqCrowd.map(([i, wx, wy, s]) => [i, wx < 960 ? wx - 100 : (wy > 900 ? wx + 420 : wx + 300), wy, s]))), 1, "SC09 together");
  num("mo", tEnd, null); prop("you", tEnd, null); Po("you", tEnd, "relaxed", 0); M("you", tEnd, "happy", 0.4); M("juno", tEnd, "laugh", 0.4); Po("juno", tEnd + 0.4, "wave", 0.3);

  // ---------------- overlays ----------------
  SETS.neonDefs(svg); SETS.neonDefs(hud);
  const counters = SETS.counters(hud), clock = SETS.clock(hud);
  const title = K.card(hud, ["WHAT DO THEY", "REALLY THINK?"], { fs: 150, bg: "#120E14", fg: "#FFF6E3" });
  const bubEls = {}; for (const [, , txt, who] of bubbles) { const key = who + txt; if (!bubEls[key]) bubEls[key] = K.bubble(hud, txt, { fs: 60 }); }
  const grade = el("rect", { x: 0, y: 0, width: 1920, height: 1080, style: "mix-blend-mode:multiply", "pointer-events": "none" }, svg);
  const flash = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#fff", opacity: 0, "pointer-events": "none" }, svg);
  const caps = K.captions(hud, window.CAPS || []); SR.paperGrain(svg);
  const tag = K.tag(svg, "YOU", { fs: 34 });
  Dr.compile();
  const propAt = (n, t) => { let k = null; for (const [t0, kk] of PROPK[n] || []) if (t >= t0) k = kk; return k; };
  const numAt = (n, t) => { let v = null, c = GRN, tc = -9; for (const [t0, vv, cc] of NUM[n] || []) if (t >= t0) { if (vv !== v) tc = t0; v = vv; c = cc; } return [v, c, tc]; };
  const CLK = [[0.2, "10:02 AM"], [SC.SC02, "10:09 AM"], [tTitle0, null], [SC.SC03, "11:30 AM"], [SC.SC05, "5:40 PM"], [tFB, "10:02 AM"], [SC.SC07, "5:52 PM"], [SC.SC08, null], [SC.SC09, "9:00 AM"], [W("n30", 1.4), "11:04 AM"], [tY, null], [tEnd, null]];
  const clkAt = (t) => { let c = [null, 0]; for (const [t0, s] of CLK) if (t >= t0) c = [s, t0]; return c; };
  const gradeK = [[0, "#FFFFFF"], [SC.SC05, "#F6B48A"], [tFF, "#A9A9B2"], [tFB, "#E8D3B0"], [SC.SC07, "#F6B48A"], [S("juno_f") - 0.2, "#FFD7A8"], [SC.SC08, "#FFFFFF"]];
  const gradeAt = (t) => { let c = "#FFFFFF"; for (const [t0, cc] of gradeK) if (t >= t0) c = cc; return c; };
  const hideOv = (t) => t >= tTitle0 && t < SC.SC03 - 0.05;
  function draw(t) {
    const capOn = (window.CAPS || []).some((c) => t >= c.t && t < c.e);
    const { cam, shot: s } = Dr.draw(t, { shake: 0, capOn });
    for (const n of Object.keys(PROPK)) { const a = Dr.actors[n]; if (!a || !a.c) continue; const pk = propAt(n, t), first = a.c.g.querySelector("[data-k]"), kit = first && first.parentNode; if (kit) [...kit.children].forEach((c) => c.setAttribute("display", c.getAttribute("data-k") === pk ? "inline" : "none")); }
    counters.hideAll();
    if (!hideOv(t)) for (const n of Object.keys(NUM)) { const a = Dr.actors[n]; if (!a || a.c.g.getAttribute("display") === "none") continue; const [v, c, tc] = numAt(n, t); if (v == null) continue;
      const J = a.c.joints, [hx, hy] = Dr.toScreen(cam, J.headX, J.headY), hr = J.headR * cam.z; if (hx < -100 || hx > 2020 || hy - hr > 1000) continue;
      const hairExtra = { bun: 0.8, afro: 0.45, cap: 0.25, curly: 0.3, spiky: 0.3 }[(a.spec || {}).hairStyle] || 0.12, long = String(v).length > 5;
      counters.show(n, v, hx, hy - hr * (1 + hairExtra), hr * (long ? 0.55 : 0.9), clamp((t - tc) / 0.32, 0, 1), c, 1); }
    const ya = Dr.actors.you; const showTag = t < S("n01") && ya.c.g.getAttribute("display") !== "none"; tag.setAttribute("display", showTag ? "inline" : "none");
    if (showTag) { const [hx, hy] = Dr.toScreen(cam, ya.c.joints.headX, ya.c.joints.headY); tag.setAttribute("transform", `translate(${hx.toFixed(1)},${(hy - ya.c.joints.headR * cam.z - 40).toFixed(1)})`); }
    for (const [t0, t1, txt, who] of bubbles) { const b = bubEls[who + txt], k = K.win(t, t0, t1, 0.12, 0.2); if (k <= 0) { b.setAttribute("opacity", 0); continue; }
      let x, y; const spk = who === "mo" ? Dr.actors.mo : ya;
      if (who.startsWith("r")) { const i = +who[1] - 1; x = [1500, 1520, 1540][i]; y = [300, 470, 640][i]; } else { const J = spk.c.joints, [hx, hy] = Dr.toScreen(cam, J.headX, J.headY), hr = J.headR * cam.z; x = hx + (who === "mo" ? -1 : 1) * (hr * 0.7 + 150); y = hy - hr - 40; }
      b.setAttribute("opacity", k.toFixed(2)); b.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${K.back(Math.min(1, k * 1.4)).toFixed(3)})`); }
    { const [txt, t0] = clkAt(t); clock.set(txt && !hideOv(t) ? K.win(t, t0, t0 + 3.5, 0.3, 0.4) : 0, txt || "", t); }
    title.set(K.win(t, tTitle0, tTitle1, 0.08, 0.2), clamp((t - tTitle0) / 0.6, 0, 1));
    caps(t);
    grade.setAttribute("fill", gradeAt(t)); flash.setAttribute("opacity", (Math.max(0, 1 - Math.abs(t - tTen) * 6) * 0.35).toFixed(2));
  }
  const tl = gsap.timeline({ paused: true }); SR.drive(tl, D, draw); window.__timelines["main"] = tl;
  window.__EP = { Dr, marks: { tBye, tTwo, tNine, tTitle0, tTitle1, tMo, tFinn, tBea, tFB, tAsk, tTen, tEnd }, shots: Dr.shots.map((s) => [s.t, s.set, s.tag]) };
})();
