/* Ep7 remake (paper storybook): 13 scenes from SCENE-CARDS.md. Times come from the line clock (window.DT, window.SC). */
(function () {
  const { el, clamp, lerp } = SR, K = window.PK, SETS = window.SETS, T = window.DT, SC = window.SC, D = window.DUR;
  const S = (i) => T[i][0], E = (i) => T[i][0] + T[i][1], W = (i, s) => T[i][0] + s;
  const svg = document.getElementById("ov"), hud = document.getElementById("hud");
  // extra poses for this episode
  Object.assign(SR.PAPER_POSES, {
    thumbsUp: { shF: 62, elF: 96, shB: 4, elB: 8 }, thumbsHalf: { shF: 34, elF: 60, shB: 4, elB: 8 }, pointUp: { head: -6, shF: 150, elF: 8, shB: 4, elB: 8 },
    capTuck: { head: 6, shF: 128, elF: 148, shB: 6, elB: 10 }, hammerUp: { lean: -4, shF: 150, elF: 40, shB: 10, elB: 30 }, hammerDown: { lean: 6, shF: 70, elF: 20, shB: 10, elB: 30 },
    catch: { lean: 6, shF: 78, elF: 8, shB: 34, elB: 66 }, knock: { lean: 6, shF: 96, elF: 64, shB: 4, elB: 8 }, peace: { shF: 128, elF: 34, shB: 4, elB: 8 },
    carry: { shF: 40, elF: 66, shB: 36, elB: 66 }, phoneLook: { head: 12, lean: 3, shF: 30, elF: 96, shB: 6, elB: 8 },
  });
  // props: one "kit" per actor, children toggled by a per-actor track
  const B = SETS.box;
  const PROPS = {
    boxstack: (g) => { B(g, 0, 20, 150, 100, "MUM — KITCHEN"); B(g, 0, -80, 140, 90); B(g, 0, -170, 130, 90); },
    box: (g) => B(g, 0, 40, 130, 100), tray: (g) => { el("rect", { x: -80, y: -14, width: 160, height: 16, rx: 6, fill: "#E58A3A" }, g); [-46, 0, 46].forEach((x) => el("ellipse", { cx: x, cy: -26, rx: 22, ry: 13, fill: "#E8B06A" }, g)); },
    mug: (g) => { el("rect", { x: -16, y: -26, width: 32, height: 34, rx: 6, fill: "#FFFFFF" }, g); el("path", { d: "M-6,-34 q6,-10 0,-18 M6,-34 q6,-10 0,-18", fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: 0.7 }, g); },
    phone: (g) => { el("rect", { x: -14, y: -50, width: 30, height: 54, rx: 6, fill: "#1E1B22" }, g); el("rect", { x: -10, y: -45, width: 22, height: 40, rx: 3, fill: "#9FD3EA" }, g); },
    peace: (g) => { el("rect", { x: -14, y: -66, width: 12, height: 50, rx: 6, fill: "#E3AE85" }, g); el("rect", { x: 2, y: -70, width: 12, height: 54, rx: 6, fill: "#E3AE85" }, g); },
    hammer: (g) => { el("rect", { x: -6, y: -96, width: 12, height: 100, rx: 5, fill: "#9A6B45" }, g); el("rect", { x: -26, y: -116, width: 52, height: 26, rx: 6, fill: "#5C6378" }, g); },
    sandwich: (g) => { el("path", { d: "M-36,4 Q0,-30 36,4 Z", fill: "#E8B06A" }, g); el("rect", { x: -38, y: 4, width: 76, height: 8, rx: 4, fill: "#7DBA5A" }, g); el("rect", { x: -36, y: 12, width: 72, height: 12, rx: 6, fill: "#E8B06A" }, g); },
  };
  const baseProp = SR.buildProp; SR.buildProp = (g, kind) => { if (kind !== "kit") return baseProp ? baseProp(g, kind) : null; for (const [k, f] of Object.entries(PROPS)) { const c = el("g", { "data-k": k, display: "none" }, g); f(c); } return g; };
  // cast
  const LOOK = {
    you: { skin: "#E3AE85", shirt: "#6C5CE7", pants: "#2E3A5A", shoes: "#F2EDE4", hair: "#1E1B22", hairStyle: "short", seed: 51 },
    ana: { skin: "#9A6440", shirt: "#3FA7A0", pants: "#2E5A74", shoes: "#F2EDE4", hair: "#2A1A14", hairStyle: "bun", seed: 5, body: "slim" },
    mo: { skin: "#C98B5E", shirt: "#E8834A", pants: "#3A4A63", shoes: "#6B4A34", hair: "#3A2A22", hairStyle: "short", seed: 7, body: "round" },
    theo: { skin: "#F0C8A0", shirt: "#8A93A6", pants: "#3A4050", shoes: "#2E3440", hair: "#6A4A3A", hairStyle: "short", seed: 21, body: "lanky" },
    kai: { skin: "#B07448", shirt: "#FF8A2A", pants: "#3A4A63", shoes: "#7A5230", hair: "#E0B020", hairStyle: "cap", seed: 6, body: "broad" },
    bea: { skin: "#7A4A32", shirt: "#F2C14E", pants: "#6A4A8A", shoes: "#E86A8A", hair: "#1E1B22", hairStyle: "ponytail", seed: 4, body: "pear" },
    finn: { skin: "#F6D2B4", shirt: "#F4C430", pants: "#3A4A63", shoes: "#3B3446", hair: "#2E4A6A", hairStyle: "cap", seed: 11, body: "lanky" },
    nia: { skin: "#664030", shirt: "#E8634A", pants: "#2E3A5A", shoes: "#F2EDE4", hair: "#1E1B22", hairStyle: "afro", seed: 9, body: "slim" },
    str: { skin: "#E3AE85", shirt: "#4F7FB0", pants: "#5A4E44", shoes: "#3B3446", hair: "#6A4A3A", hairStyle: "short", seed: 77, body: "round" },
    cust: { skin: "#B07448", shirt: "#D85A8A", pants: "#3A4A63", shoes: "#3B3446", hair: "#1E1B22", hairStyle: "long", seed: 88, body: "avg" },
  };
  const X = (i) => { const r = SR.mulberry32(300 + i * 13), pk = (a) => a[Math.floor(r() * a.length)]; return { skin: pk(["#F6D2B4", "#E3AE85", "#C98B5E", "#B07448", "#7A4A32", "#9A6440"]), shirt: pk(["#E8834A", "#F2C14E", "#5E9E5A", "#D85A8A", "#4F7FB0", "#7B6BB0", "#2F9E8F"]), pants: pk(["#3A4A63", "#5A4E44", "#2E5A74", "#46524A"]), shoes: "#3B3446", hair: pk(["#1E1B22", "#6A4A3A", "#C79A5A", "#2A1A14"]), hairStyle: pk(["short", "curly", "ponytail", "long", "afro", "spiky", "bun"]), seed: 40 + i, body: pk(["avg", "round", "broad", "slim", "lanky", "pear"]) }; };
  const Dr = DIR.make(svg, D);
  // sets
  ["square", "bakeryFront", "lighthouse", "jetty", "bakeryIn", "site", "doorstep", "kitchen", "cafe", "cafeWindow", "street"].forEach((n) => Dr.set(n, SETS[n]));
  const A = {}; for (const n of Object.keys(LOOK)) A[n] = Dr.actor(n, Object.assign({ }, LOOK[n], { prop: { kind: "kit" } }));
  A.youR = Dr.actor("youR", Object.assign({}, LOOK.you, { opacity: [[0, 0.5]] }), { extra: true });
  const EXN = 12; for (let i = 0; i < EXN; i++) A["x" + i] = Dr.actor("x" + i, X(i), { extra: true, mood: ["grin", "happy", "content", "cheeky"][i % 4] });
  const PROPK = { you: [], ana: [], mo: [], theo: [], kai: [], bea: [], finn: [], cust: [], nia: [], str: [] };
  const prop = (n, t, k) => PROPK[n].push([t, k]);
  const M = (n, t, m, d = 0.35, e = "inOut") => A[n].mood.push([t, m, d, e]), Po = (n, t, p, d = 0.35, e = "back") => A[n].pose.push([t, p, d, e]);
  const Lk = (n, t, x, y) => A[n].look.push([t, { x, y }]), Hop = (n, t, h = 14) => A[n].hop.push([t, h]), Sq = (n, t, a = 0.1) => A[n].squash.push([t, a]), Lips = (n, id) => A[n].lips.push([S(id), id.split("#")[0]]);
  const shot = (t, set, cam, cast, k, tag) => Dr.shot({ t, set, cam, cast, k, tag });
  const C = (x, y, z, x2, y2, z2, e) => ({ x, y, z, x2, y2, z2, e }), Pp = (fx, fy, hd, f = 1, more = {}) => Object.assign({ fx, fy, hd, f }, more), Wd = (wx, wy, s, f = 1, more = {}) => Object.assign({ wx, wy, s, f }, more);
  // crowd helper: extras at world positions with small scale (wides)
  const crowd = (spots) => { const o = {}; spots.forEach(([i, wx, wy, s, f]) => { o["x" + i] = Wd(wx, wy, s, f ?? (wx < 960 ? 1 : -1)); }); return o; };

  // =================== SC01 "Fine." ===================
  const t01 = SC.SC01, tPop = W("mo_b", 0.25), tWide = E("mo_b") + 0.25;
  const sqCrowd = [[0, -60, 880, 0.42], [1, 230, 860, 0.4], [2, 480, 870, 0.44], [3, 1400, 865, 0.42], [4, 1660, 880, 0.44], [5, 1940, 870, 0.4], [6, 250, 1000, 0.55], [7, 1700, 1010, 0.55], [8, 760, 850, 0.36], [9, 1150, 850, 0.36]];
  shot(t01, "square", C(900, 560, 1.15, 900, 540, 1.22, "lin"), Object.assign({ you: Pp(0.27, 0.40, 0.30, 1), mo: Pp(0.70, 0.42, 0.17, -1) }, crowd(sqCrowd.slice(0, 6))), 1, "SC01 depth-two");
  Lips("mo", "mo_a"); Lips("mo", "mo_b"); M("mo", 0, "happy"); Po("mo", 0, "wave"); Po("mo", E("mo_a"), "relaxed", 0.4);
  M("you", 0, "content"); Po("you", E("mo_a") + 0.02, "thumbsUp", 0.22); Sq("you", E("mo_a") + 0.02, 0.06); M("you", E("mo_a") + 0.02, "grin", 0.2);
  Dr.weather("mo", [[0, 2.6]], tPop, 1.3); M("you", tPop + 0.08, "shock", 0.2, "back"); Po("you", tPop + 0.08, "flinch", 0.18); Po("you", tPop + 0.75, "relaxed", 0.45, "inOut"); Sq("mo", tPop, 0.06);
  shot(tWide, "square", C(600, 700, 1.5, 960, 540, 1.0, "out"), Object.assign({ you: Wd(560, 960, 0.62, 1), mo: Wd(1560, 950, 0.6, -1), ana: Wd(800, 880, 0.42, -1, { wx2: -250, walk: 1 }) }, crowd(sqCrowd)), 1, "SC01 crowd-reveal");
  // Ana crosses behind with her box stack (the plant)
  A.ana.keys.x.push(); prop("ana", tWide, "boxstack"); Po("ana", tWide, "carry", 0); M("ana", 0, "happy");
  const lvMix = [0, 1, 0, 4, 0, 1, 0, 2.6, 1, 0];
  sqCrowd.forEach(([i], j) => Dr.weather("x" + i, [[0, lvMix[j]]], tWide + 0.35 + j * 0.17, 1.1));
  Dr.weather("you", [[0, -1], [W("n26", 0.2), -1], [W("n26", 0.3), 1.3]], W("n26", 0.3), 1.2);
  shot(S("n01") + 1.4, "square", C(820, 520, 1.25, 820, 520, 1.32, "lin"), { you: Pp(0.36, 0.40, 0.27, 1), mo: Pp(0.82, 0.44, 0.15, -1) }, 1, "SC01 you-single");
  Lk("you", S("n01") + 1.4, 0.5, -0.2); M("you", S("n01") + 1.4, "surprised", 0.4);
  shot(S("n02") - 0.35, "square", C(700, 300, 1.6), { you: Pp(0.5, 0.50, 0.7, 1) }, 1, "SC01 discovery eyes"); Lk("you", S("n02") - 0.35, 0, -1); M("you", S("n02") - 0.35, "nervous", 0.3);
  const tPOV = S("n02") + 0.25; shot(tPOV, "square", C(600, 200, 1.4), {}, 1, "SC01 POV empty");

  // =================== SC02 the rules, tested ===================
  const t02 = SC.SC02;
  shot(t02, "square", C(960, 540, 1.0), crowd(sqCrowd), 0.85, "SC02 card bg");
  const tStr = S("str_01") - 0.35; shot(tStr, "square", C(1000, 560, 1.15), { you: Pp(0.24, 0.40, 0.28, 1), str: Pp(0.86, 0.43, 0.16, -1, { fx2: 0.62, d1: 0.4, e: "out", walk: 1 }) }, 1, "SC02 stranger");
  Lips("str", "str_01"); M("str", 0, "grin"); Po("str", S("str_01") + 0.5, "wave", 0.3); Hop("str", S("str_01") + 0.5, 22); Dr.weather("str", [[0, 4]], tStr + 0.2, 1.3);
  M("you", tStr, "content", 0.3); M("you", S("str_01") + 1.2, "skeptic", 0.5);
  shot(S("n06") - 0.1, "square", C(820, 520, 1.25), { you: Pp(0.40, 0.42, 0.30, 1), str: Pp(0.92, 0.44, 0.15, -1) }, 1, "SC02 deadpan"); M("you", S("n06"), "deadpan", 0.3); Lk("you", S("n06"), 0.7, -0.6);
  shot(S("n04") - 0.2, "square", C(960, 540, 1.0), crowd(sqCrowd), 0.85, "SC02 card 2 bg");
  const tTheo = S("theo_a") - 0.5; shot(tTheo, "square", C(980, 560, 1.2), { you: Pp(0.25, 0.40, 0.28, 1), theo: Pp(0.66, 0.42, 0.17, -1) }, 1, "SC02 theo");
  Po("you", tTheo + 0.1, "pointUp", 0.25); M("you", tTheo + 0.1, "surprised", 0.3); Dr.weather("theo", [[0, 2]], tTheo + 0.05, 1.2); Lips("theo", "theo_a"); Lk("theo", S("theo_a"), 0, -1); Po("theo", S("theo_a"), "shrug", 0.3); M("theo", S("theo_a"), "confused", 0.3); Po("you", E("theo_a") + 0.3, "relaxed", 0.5);
  shot(S("n05") - 0.2, "square", C(960, 540, 1.0), crowd(sqCrowd), 0.85, "SC02 card 3 bg");
  const tRefl = E("n05") + 0.35;   // the bakery window: no weather above YOU's reflection
  shot(tRefl, "bakeryFront", C(760, 540, 1.1), { you: Wd(110, 1000, 0.95, 1), youR: Wd(640, 760, 0.7, -1) }, null, "SC02 reflection");
  M("you", tRefl, "content", 0.4); Lk("you", tRefl, 0.6, -0.4); M("youR", 0, "content");
  const tPhone = tRefl + 1.2;   // phone insert covers the frame (overlay) until n07
  shot(S("n07") - 0.1, "square", C(700, 470, 1.3), { you: Pp(0.40, 0.52, 0.22, 1) }, 1, "SC02 small-you"); M("you", S("n07"), "sad", 0.8); Lk("you", S("n07"), 0, 0.5);

  // =================== SC03 the guess (lighthouse) ===================
  const t03 = SC.SC03; const town = []; for (let i = 0; i < 12; i++) town.push([i, -400 + i * 260 + (i % 2) * 80, 860 + (i % 3) * 18, 0.26 + (i % 3) * 0.02]);
  shot(t03, "lighthouse", C(960, 540, 1.0, 760, 600, 1.18, "lin"), { you: Wd(520, 880, 0.36, 1) }, null, "SC03 isolation"); M("you", t03, "smug", 0.5); Lk("you", t03, 0.6, 0.4);
  const tFingers = E("n08") + 0.1; shot(tFingers, "lighthouse", C(560, 520, 1.6), { you: Pp(0.42, 0.42, 0.30, 1) }, null, "SC03 two fingers"); Po("you", tFingers + 0.05, "peace", 0.25); prop("you", tFingers + 0.05, "peace"); M("you", tFingers, "smug", 0.3); Hop("you", tFingers, 8);
  const tPan = tFingers + 1.4; shot(tPan, "lighthouse", C(-100, 640, 1.25, 1900, 640, 1.25, "lin"), crowd(town), null, "SC03 crowd pan");
  const townLv = [0, 1, 0, 0, 2.6, 0, 1, 0, 1, 0, 3, 1];
  town.forEach(([i, wx], j) => Dr.weather("x" + i, [[0, townLv[j]]], tPan + 0.3 + (wx + 400) / 2400 * 3.0, 1.0, 0, t03));   // town layer (same extras, new people)
  const tReact = S("n09") - 0.25; shot(tReact, "lighthouse", C(560, 520, 1.6), { you: Pp(0.42, 0.42, 0.30, 1) }, null, "SC03 reaction");
  Po("you", tReact + 0.1, "relaxed", 1.2, "inOut"); prop("you", tReact + 0.8, null); M("you", tReact, "surprised", 0.5); M("you", tReact + 1.4, "touched", 1.4);
  shot(S("n10") - 0.15, "lighthouse", C(900, 560, 1.0, 1000, 580, 1.16, "lin"), Object.assign({ you: Wd(520, 880, 0.36, 1) }, crowd(town.slice(0, 8))), null, "SC03 town wide");
  shot(S("n11") - 0.1, "lighthouse", C(600, 500, 1.5), { you: Pp(0.44, 0.44, 0.28, 1) }, null, "SC03 button"); Lk("you", S("n11"), 0.8, 0.5); M("you", S("n11"), "confused", 0.4);

  // =================== SC04 the hat trick ===================
  const t04 = SC.SC04;
  shot(t04, "jetty", C(960, 540, 1.0), { finn: Wd(1260, 820, 0.62, -1), you: Wd(140, 820, 0.5, 1) }, null, "SC04 finn alone");
  M("finn", t04, "sad", 0.4); Dr.weather("finn", [[0, 2.2], [S("finn_a") - 0.2, 2.2], [S("finn_a") + 0.05, 0], [E("n12") + 1.0, 0], [E("n12") + 1.3, 2.2], [S("n14") + 2.0, 2.2], [S("n14") + 3.0, 1.2]], t04 + 0.1, 1.3);
  Po("you", t04 + 0.6, "wave", 0.3); Po("you", t04 + 1.6, "relaxed", 0.4);
  const tCust = S("finn_a") - 1.0; shot(tCust, "jetty", C(1150, 660, 1.3), { finn: Pp(0.64, 0.40, 0.20, -1), cust: Wd(380, 828, 0.86, 1, { wx2: 640, d1: 0.5, e: "out", walk: 1 }) }, null, "SC04 cap trick");
  Po("finn", S("finn_a") - 0.25, "capTuck", 0.18); Sq("finn", S("finn_a") - 0.1, 0.1); Po("finn", S("finn_a") + 0.35, "proud", 0.3); M("finn", S("finn_a") - 0.05, "grin", 0.2, "back"); Lips("finn", "finn_a"); M("cust", 0, "happy");
  const tBea = S("bea_01") - 0.6; shot(tBea, "bakeryIn", C(900, 560, 1.15), { bea: Wd(780, 900, 0.9, 1) }, null, "SC04 bea tuck");
  Dr.weather("bea", [[0, 1.6], [S("bea_01") - 0.05, 1.6], [S("bea_01") + 0.1, 0]], tBea + 0.05, 1.2); M("bea", tBea, "worried", 0.3); Po("bea", tBea + 0.25, "duck", 0.2); Po("bea", S("bea_01"), "hold", 0.25, "back"); prop("bea", S("bea_01"), "tray"); M("bea", S("bea_01"), "grin", 0.2); Lips("bea", "bea_01"); Hop("bea", S("bea_01"), 10);
  const tKai = E("bea_01") + 0.15; shot(tKai, "site", C(980, 620, 1.35), { kai: Pp(0.55, 0.42, 0.22, -1) }, null, "SC04 kai power-low");
  Dr.weather("kai", [[0, 4]], tKai + 0.05, 1.3); M("kai", tKai, "determined", 0.2); prop("kai", tKai, "hammer"); for (let i = 0; i < 8; i++) Po("kai", tKai + i * 0.42, i % 2 ? "hammerDown" : "hammerUp", 0.12, "out");
  const tRecog = tKai + 1.6; shot(tRecog, "jetty", C(700, 520, 1.5), { you: Pp(0.40, 0.42, 0.28, 1) }, null, "SC04 you recognise");
  Po("you", tRecog, "phoneLook", 0.3); prop("you", tRecog, "phone"); prop("you", S("n12") + 1.5, null); M("you", tRecog + 0.2, "worried", 0.6);
  shot(S("n12") - 0.1, "jetty", C(960, 540, 1.0), { finn: Wd(1260, 820, 0.62, -1), cust: Wd(600, 820, 0.5, -1, { wx2: -320, walk: 1 }), you: Wd(140, 820, 0.5, 1) }, null, "SC04 harbour wide");
  Po("you", S("n12"), "relaxed", 0.4); M("finn", E("n12") + 1.0, "sad", 0.8);
  shot(S("n13") - 0.1, "jetty", C(560, 520, 1.6), { you: Pp(0.40, 0.42, 0.28, 1) }, null, "SC04 button thunder"); Lk("you", E("n13") - 0.4, 1, 0); M("you", E("n13") - 0.4, "surprised", 0.3, "back");

  // =================== SC05 the fixer ===================
  const t05 = SC.SC05;
  shot(t05, "jetty", C(1100, 660, 1.25), { you: Pp(0.24, 0.42, 0.20, 1), finn: Pp(0.58, 0.40, 0.20, -1) }, null, "SC05 tea");
  prop("you", t05, "mug"); Po("you", t05 + 0.2, "give", 0.3); Hop("you", W("n14", 1.4), 14); M("you", t05, "hopeful", 0.3); M("finn", S("n14") + 2.0, "relieved", 1.0); prop("you", S("n14") + 2.2, null);
  const tTray = E("n14") + 0.35; shot(tTray, "square", C(960, 560, 1.15), { bea: Pp(0.29, 0.42, 0.20, 1), ana: Pp(0.95, 0.40, 0.21, -1, { fx2: 0.62, d1: 0.9, e: "out", walk: 1 }) }, 1, "SC05 the catch");
  prop("bea", tTray, "tray"); Po("bea", tTray, "hold", 0); Po("bea", tTray + 0.4, "startle", 0.15); prop("bea", tTray + 0.45, null); M("bea", tTray + 0.4, "shock", 0.15);
  prop("ana", tTray, "boxstack"); Po("ana", tTray, "carry", 0); Po("ana", tTray + 0.5, "catch", 0.15, "back"); M("ana", tTray, "happy", 0.2); Lips("bea", "bea_b"); M("bea", S("bea_b"), "laugh", 0.3); Hop("bea", S("bea_b"), 10);
  const tPeek = S("ana_a") - 0.4; shot(tPeek, "square", C(960, 560, 1.15), { you: Pp(0.26, 0.42, 0.22, 1, { fx2: 0.33, d1: 1.2, walk: 1 }), ana: Pp(0.66, 0.42, 0.21, -1, { fx2: 1.1, d0: 0.8, walk: 1 }) }, 1, "SC05 peek");
  prop("ana", tPeek, "boxstack"); Po("ana", tPeek, "carry", 0); Lips("ana", "ana_a"); Po("you", tPeek + 0.2, "give", 0.3); M("you", tPeek, "hopeful", 0.3);
  const tGone = E("ana_a") + 0.3; shot(tGone, "square", C(960, 540, 1.0), Object.assign({ ana: Wd(1500, 860, 0.38, 1, { wx2: 2300, walk: 1 }) }, crowd(sqCrowd.slice(0, 6))), 1, "SC05 gone");
  prop("ana", tGone, "boxstack"); Po("ana", tGone, "carry", 0);

  // =================== SC06 midpoint: the biggest storm ===================
  const t06 = SC.SC06, tTip = t06 + 1.5, tStorm = t06 + 2.3;
  shot(t06, "doorstep", C(960, 560, 1.1), { you: Pp(0.27, 0.42, 0.24, 1), ana: Pp(0.64, 0.42, 0.22, -1) }, { open: 0 }, "SC06 help");
  prop("ana", t06, "boxstack"); Po("ana", t06, "carry", 0); M("ana", t06, "happy", 0.2); Po("you", t06 + 0.5, "give", 0.3); M("you", t06, "hopeful", 0.3);
  shot(tTip, "doorstep", C(1180, 600, 1.4), { ana: Pp(0.55, 0.36, 0.24, -1) }, { open: 0 }, "SC06 tip"); prop("ana", tTip + 0.15, null); Po("ana", tTip + 0.15, "startle", 0.15); M("ana", tTip + 0.15, "shock", 0.15);
  shot(tStorm, "doorstep", C(1180, 700, 1.6, 1180, 560, 1.35, "out"), { ana: Pp(0.52, 0.62, 0.30, -1) }, { open: 0, flash: 0 }, "SC06 storm reveal");
  Dr.weather("ana", [[0, 4], [S("ana_d"), 4], [W("n22", 0.5), 4], [S("n20") + 1.0, 2.8], [SC.SC12, 2.4], [SC.SC13, 2.0]], tStorm + 0.15, 2.0, -10);
  M("ana", tStorm + 0.4, "forced", 0.5); Sq("ana", tStorm + 0.1, 0.12); Po("ana", tStorm + 0.4, "relaxed", 0.6);
  shot(tStorm + 1.6, "doorstep", C(1180, 520, 1.7, 1180, 500, 1.85, "lin"), { ana: Pp(0.52, 0.74, 0.30, -1) }, { open: 0 }, "SC06 hold");
  shot(S("ana_b") - 0.2, "doorstep", C(960, 560, 1.05), { you: Pp(0.22, 0.42, 0.22, 1), ana: Pp(0.60, 0.42, 0.21, -1, { fx2: 0.49, d0: 0.9, e: "inOut", walk: 1 }) }, (t) => ({ open: 1 - clamp((t - E("ana_b") - 0.2) / 0.5, 0, 1), pile: 1 }), "SC06 door closes");
  Lips("ana", "ana_b"); Po("ana", S("ana_b"), "wave", 0.25); M("ana", S("ana_b"), "forced", 0.2); M("you", S("ana_b"), "worried", 0.4);
  A.ana.vis.push(); const tDoorShut = E("ana_b") + 0.6;
  shot(tDoorShut, "doorstep", C(960, 520, 1.25), { you: Pp(0.10, 0.55, 0.42, 1) }, (t) => ({ open: 0, flash: (Math.floor(t * 5) % 4 === 0 ? 0.6 : 0) }), "SC06 window-watcher");

  // =================== SC07 the dilemma ===================
  const t07 = SC.SC07;
  shot(t07, "doorstep", C(860, 540, 1.35), { you: Pp(0.38, 0.42, 0.28, 1) }, { open: 0 }, "SC07 stare"); M("you", t07, "sad", 0.5);
  shot(S("theo_b") - 0.4, "doorstep", C(860, 560, 1.1), { theo: Pp(0.10, 0.43, 0.17, 1, { fx2: 0.24, d1: 0.6, walk: 1 }), you: Pp(0.48, 0.42, 0.22, 1) }, { open: 0 }, "SC07 theo");
  Lips("theo", "theo_b"); M("theo", S("theo_b"), "nervous", 0.3); Po("theo", S("theo_b"), "shrug", 0.3);
  shot(S("n17") - 0.2, "doorstep", C(860, 540, 1.45), { you: Pp(0.45, 0.42, 0.32, 1) }, { open: 0 }, "SC07 decide"); M("you", S("n17"), "worried", 0.3); M("you", S("n17") + 2.2, "determined", 1.2);
  const tWalk = E("n17") - 1.2; shot(tWalk, "doorstep", C(700, 560, 1.1, 900, 560, 1.1, "lin"), { theo: Pp(0.18, 0.43, 0.17, 1), you: Pp(0.36, 0.42, 0.22, 1, { fx2: 0.70, walk: 1 }) }, { open: 0 }, "SC07 crossing");
  const tKnock = SC.SC08 - 0.9; shot(tKnock, "doorstep", C(960, 470, 2.6), { you: Pp(0.18, 0.62, 0.55, 1) }, { open: 0 }, "SC07 knock"); Po("you", tKnock + 0.1, "knock", 0.15); Po("you", tKnock + 0.35, "relaxed", 0.12); Po("you", tKnock + 0.5, "knock", 0.15);

  // =================== SC08 asking once more ===================
  const t08 = SC.SC08;
  shot(t08, "doorstep", C(960, 540, 1.2), { ana: Pp(0.52, 0.42, 0.22, -1), you: Pp(0.14, 0.42, 0.30, 1) }, { open: 0.55 }, "SC08 barrier");
  Lips("ana", "ana_c"); M("ana", S("ana_c"), "forced", 0.2); Po("ana", S("ana_c"), "relaxed", 0.2);
  shot(S("n18") - 0.3, "kitchen", C(960, 540, 1.1), { you: Pp(0.05, 0.40, 0.52, 1), ana: Pp(0.66, 0.42, 0.22, -1) }, null, "SC08 confession-OTS");
  Po("you", S("n18"), "give", 0.4); M("you", S("n18"), "hopeful", 0.5); M("you", W("ana_d", 3.0), "sad", 1.0); M("you", S("n19"), "determined", 0.4);
  shot(S("ana_d") - 0.2, "kitchen", C(1180, 500, 1.5, 1220, 480, 1.75, "lin"), { you: Pp(-0.02, 0.40, 0.55, 1), ana: Pp(0.66, 0.42, 0.26, -1) }, null, "SC08 crack");
  Lips("ana", "ana_d"); M("ana", S("ana_d"), "nervous", 0.6); M("ana", W("ana_d", 2.2), "sad", 1.2); M("ana", W("ana_d", 4.4), "crying", 1.4); Po("ana", W("ana_d", 3.0), "slump", 1.4, "inOut"); Lk("ana", W("ana_d", 3), 0.2, 0.6);
  shot(S("n19") - 0.2, "kitchen", C(960, 560, 1.15), { you: Pp(0.40, 0.42, 0.22, 1, { fx2: 0.46, walk: 1 }), ana: Pp(0.64, 0.42, 0.22, -1) }, null, "SC08 closing-gap");
  Po("you", S("n19"), "point", 0.3); prop("ana", S("n19"), "phone"); Po("ana", S("n19"), "phoneLook", 0.3); Lk("ana", S("n19"), 0, 0); M("ana", S("n19"), "sad", 0.4);
  const tList = S("ana_e") - 0.1; Lips("ana", "ana_e");
  const tHover = E("ana_e") + 0.3; shot(tHover, "kitchen", C(1150, 520, 1.7), { ana: Pp(0.52, 0.60, 0.28, -1) }, null, "SC08 hover"); M("ana", tHover, "nervous", 0.4);

  // =================== SC09 the ask ===================
  const t09 = SC.SC09;
  shot(t09, "cafe", C(960, 540, 1.0), { mo: Wd(560, 820, 0.6, -1), theo: Wd(1240, 820, 0.58, -1), kai: Wd(1560, 830, 0.62, -1), ana: Wd(160, 830, 0.6, 1, { wx2: 330, walk: 1 }), you: Wd(20, 840, 0.62, 1, { wx2: 120, walk: 1 }) }, 0, "SC09 establish");
  prop("ana", t09, null); Po("ana", t09, "relaxed", 0); M("ana", t09, "nervous", 0.3); Po("you", t09 + 0.8, "give", 0.3); M("mo", t09, "content"); M("theo", t09, "content"); M("kai", t09, "content"); prop("kai", t09, null);
  shot(S("ana_03") - 0.3, "cafe", C(700, 520, 1.5), { ana: Pp(0.45, 0.58, 0.27, 1) }, 0, "SC09 brave"); Lips("ana", "ana_03"); M("ana", S("ana_03"), "nervous", 0.3);
  shot(S("theo_01") - 0.1, "cafe", C(1240, 520, 1.5), { theo: Pp(0.55, 0.42, 0.26, -1) }, 0.2, "SC09 theo yes"); Lips("theo", "theo_01"); M("theo", S("theo_01"), "happy", 0.2); Hop("theo", S("theo_01"), 10);
  shot(S("mo_01") - 0.1, "cafe", C(560, 520, 1.5), { mo: Pp(0.55, 0.42, 0.27, -1) }, 0.35, "SC09 mo yes"); Lips("mo", "mo_01"); M("mo", S("mo_01"), "grin", 0.2); Po("mo", S("mo_01"), "proud", 0.3);
  shot(S("kai_01") - 0.1, "cafe", C(1560, 500, 1.5), { kai: Pp(0.55, 0.44, 0.27, -1) }, 0.5, "SC09 kai yes"); Lips("kai", "kai_01"); M("kai", S("kai_01"), "content", 0.2); Po("kai", S("kai_01"), "point", 0.3);
  const tTicks = E("kai_01") + 0.15;
  shot(S("n22") + 1.4, "cafe", C(960, 540, 1.0, 960, 540, 1.05, "lin"), { mo: Wd(560, 820, 0.6, -1), theo: Wd(1240, 820, 0.58, -1), kai: Wd(1560, 830, 0.62, -1), ana: Wd(780, 830, 0.6, 1), you: Wd(330, 840, 0.62, 1) }, (t) => clamp((t - S("n20")) / 3, 0.5, 1), "SC09 wide soften");
  M("ana", S("n22") + 2, "touched", 1.4); M("ana", S("n20") + 1, "relieved", 1.2); M("you", S("n22") + 2, "happy", 1.0);
  shot(E("n20") + 0.2, "cafe", C(700, 520, 1.45), { ana: Pp(0.62, 0.42, 0.28, -1), you: Pp(0.14, 0.42, 0.30, 1) }, 1, "SC09 turn"); Lk("ana", E("n20") + 0.3, -0.6, 0);

  // =================== SC10 the question back ===================
  const t10 = SC.SC10;
  shot(Math.max(t10, S("ana_04") - 0.35), "cafe", C(700, 520, 1.3), { ana: Pp(0.92, 0.40, 0.42, -1), you: Pp(0.38, 0.42, 0.24, 1) }, 1, "SC10 OTS reversed");
  Lips("ana", "ana_04"); M("ana", S("ana_04"), "hopeful", 0.4); M("you", S("ana_04") + 0.6, "surprised", 0.3);
  const tThumb = E("ana_04") + 0.2; shot(tThumb, "cafe", C(640, 470, 2.0), { you: Pp(0.48, 0.40, 0.42, 1) }, 1, "SC10 thumb stops");
  Po("you", tThumb + 0.2, "thumbsHalf", 0.5, "inOut"); M("you", tThumb + 0.2, "forced", 0.3); M("you", tThumb + 1.0, "nervous", 0.6);
  const tFine = tThumb + 1.6;   // rule card fine print sharpens (overlay)
  const tReflB = tFine + 1.8; shot(tReflB, "cafeWindow", C(960, 520, 1.0, 960, 500, 1.12, "lin"), { youR: Wd(980, 1290, 1.8, -1) }, null, "SC10 reflection");
  Dr.weather("youR", [[0, 3.4], [W("n26", 0.6), 3.4], [W("n26", 1.6), 1.3]], tReflB + 0.8, 1.6); M("youR", tReflB, "nervous", 0.3); M("youR", W("n26", 2), "touched", 1.2);

  // =================== SC11 your weather ===================
  shot(S("n23") - 0.2, "cafe", C(960, 560, 1.15), { you: Pp(0.30, 0.42, 0.22, 1), ana: Pp(0.70, 0.42, 0.22, -1) }, 1, "SC11 booth");
  Po("you", S("n23") - 0.2, "sit", 0); Po("ana", S("n23") - 0.2, "sit", 0); M("you", S("n23"), "touched", 0.4); M("ana", S("n23"), "content", 0.4);
  const tRetype = S("n24") - 0.2;   // phone insert again (overlay)
  shot(E("n24") + 0.3, "cafe", C(960, 580, 1.4), { you: Pp(0.36, 0.44, 0.24, 1), ana: Pp(0.64, 0.44, 0.24, -1) }, 1, "SC11 sandwich");
  Po("you", E("n24") + 0.3, "sit", 0); Po("ana", E("n24") + 0.3, "sit", 0); Po("ana", E("n24") + 0.5, "give", 0.3); prop("ana", E("n24") + 0.5, "sandwich"); M("you", E("n24") + 0.9, "happy", 0.6); M("ana", E("n24") + 0.5, "happy", 0.6);

  // =================== SC12 Saturday ===================
  const t12 = SC.SC12;
  shot(t12, "street", C(960, 540, 1.0), { kai: Wd(1250, 860, 0.58, -1) }, (t) => ({ vanX: lerp(2300, 300, K.sm(t12, t12 + 1.4, t)), vanMoving: t < t12 + 1.4 }), "SC12 van");
  prop("kai", t12, null); Po("kai", t12 + 1.5, "wave", 0.3); M("kai", t12, "happy", 0.3);
  const tMont = t12 + 1.9; shot(tMont, "street", C(1320, 560, 1.15), { mo: Pp(0.33, 0.42, 0.18, 1), theo: Pp(0.55, 0.42, 0.19, 1), ana: Pp(0.78, 0.42, 0.19, -1) }, { vanX: 300 }, "SC12 montage 1");
  prop("mo", tMont, "tray"); Po("mo", tMont, "hold", 0); prop("theo", tMont, "box"); Po("theo", tMont, "carry", 0); prop("ana", tMont, null); Po("ana", tMont, "point", 0.3); M("ana", tMont, "happy", 0.3); M("theo", tMont, "happy", 0.3); M("mo", tMont, "grin", 0.3);
  const tLift = tMont + 2.0; shot(tLift, "street", C(1250, 560, 1.25), { you: Pp(0.40, 0.42, 0.22, 1), theo: Pp(0.62, 0.42, 0.21, -1) }, { vanX: 300 }, "SC12 lifted");
  prop("you", tLift, "box"); Po("you", tLift, "carry", 0); M("you", tLift, "tired", 0.3); prop("theo", tLift, null); Po("theo", tLift + 0.6, "carry", 0.25); prop("you", tLift + 0.75, null); prop("theo", tLift + 0.75, "box"); Po("you", tLift + 0.8, "relaxed", 0.3); M("you", tLift + 0.8, "relieved", 0.5); Hop("you", tLift + 1.0, 10);
  const tVan = S("n25") + 1.0; shot(tVan, "street", C(760, 600, 1.5), { kai: Pp(0.70, 0.42, 0.22, -1) }, { vanX: 300 }, "SC12 box in van"); prop("kai", tVan, "boxstack"); Po("kai", tVan, "carry", 0);

  // =================== SC13 takeaway + mirror ending ===================
  const t13 = SC.SC13;
  shot(t13, "square", C(900, 560, 1.15, 900, 540, 1.2, "lin"), Object.assign({ you: Pp(0.27, 0.40, 0.30, 1), mo: Pp(0.70, 0.42, 0.17, -1) }, crowd(sqCrowd.slice(0, 6))), 1, "SC13 mirror");
  Lips("mo", "mo_a#2"); M("mo", t13, "happy"); ["mo", "theo", "kai", "ana", "you"].forEach((n) => prop(n, t13, null)); Po("mo", t13, "wave", 0.2); Po("mo", E("mo_a#2"), "relaxed", 0.4); Po("you", W("mo_a#2", 0.6), "thumbsHalf", 0.4); Po("you", W("mo_a#2", 1.6), "leanIn", 0.6, "inOut"); M("you", W("mo_a#2", 1.4), "content", 0.6);
  const tNia = S("n28") - 0.4; shot(tNia, "square", C(1380, 520, 1.2, 1380, 470, 1.5, "lin"), { nia: Pp(0.5, 0.36, 0.25, 1) }, 0.9, "SC13 narrator-address");
  Lips("nia", "n28"); M("nia", tNia, "content"); M("nia", W("n28", 1.8), "hopeful", 0.8); M("nia", W("n28", 6.6), "hopeful", 0.8); M("nia", W("n28", 9.6), "happy", 0.6); Po("nia", W("n28", 2.2), "give", 0.4); Po("nia", W("n28", 4.6), "shrug", 0.4); Po("nia", W("n28", 6.4), "relaxed", 0.5); Po("nia", W("n28", 8.4), "hug", 0.6); Po("nia", W("n28", 10.6), "proud", 0.5);
  sqCrowd.forEach(([i], j) => Dr.weather("x" + i, [[0, lvMix[j]]], SC.SC13 - 1, 1.1, 0, SC.SC13));   // back in the square: the same crowd, same weather
  const tEnd = S("n29") - 0.3; const closer = sqCrowd.map(([i, wx, wy, s]) => { let x = 960 + (wx - 960) * 0.62; if (wy > 860 && x > 760 && x < 1180) x += x < 960 ? -260 : 260; return [i, x, wy, s]; });
  shot(tEnd, "square", C(960, 560, 1.12, 960, 540, 1.0, "lin"), Object.assign({ you: Wd(1240, 985, 0.6, 1), ana: Wd(1420, 985, 0.6, -1), mo: Wd(1660, 975, 0.58, -1) }, crowd(closer)), 1, "SC13 shared-view");
  Po("you", tEnd, "relaxed", 0); Po("ana", tEnd, "relaxed", 0); M("you", tEnd, "content", 0); M("ana", tEnd, "content", 0); M("you", tEnd + 2, "happy", 1.0); M("ana", tEnd + 2.2, "happy", 1.0); prop("ana", tEnd, null); prop("you", tEnd, null); prop("mo", tEnd, null);

  // overlays (screen space): rule card, phone, list, POV "?", cards
  const rules = SETS.ruleCard(hud), phone = SETS.phone(hud), list = SETS.list(hud);
  const pov = el("g", { opacity: 0, transform: "translate(950,470) scale(2.2) translate(-950,-470)" }, hud); el("path", { d: "M860,520 C800,520 800,460 860,460 C870,410 950,400 970,450 C1010,430 1060,470 1040,520 Z", fill: "none", stroke: "#3a2e2a", "stroke-width": 6, "stroke-dasharray": "14 12" }, pov); el("text", { x: 930, y: 505, "text-anchor": "middle", "font-family": "Fredoka", "font-weight": 700, "font-size": 70, fill: "#3a2e2a" }, pov).textContent = "?";
  const grade = el("rect", { x: 0, y: 0, width: 1920, height: 1080, style: "mix-blend-mode:multiply", "pointer-events": "none" }, svg);
  const flash = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#fff", opacity: 0, "pointer-events": "none" }, svg);
  const caps = K.captions(hud, window.CAPS || []); SR.paperGrain(svg);
  const tag = K.tag(svg, "YOU", { fs: 34 }), bubYou = K.bubble(hud, "Fine!", { fs: 72 });
  Dr.compile();
  // prop visibility tracks
  const propAt = (n, t) => { let k = null; for (const [t0, kk] of PROPK[n]) if (t >= t0) k = kk; return k; };
  const coldK = [[0, 0], [tPop, 0], [tPop + 0.3, 0.12], [SC.SC03, 0.05], [SC.SC05, 0.0], [tStorm - 0.1, 0.0], [tStorm + 0.3, 0.45], [SC.SC07, 0.35], [S("ana_d") + 3, 0.5], [S("n20"), 0.2], [SC.SC10, 0.15], [tReflB, 0.3], [W("n26", 1.6), 0.05], [SC.SC12, 0], [D, 0]];
  const shakes = [[tPop, 0.5], [tStorm + 0.15, 1.0]];
  // the line clock for UI overlays
  const typed = (t, t0) => { const a = "honestly this week's been—", f = "fine!", u = t - t0; if (u < 0) return ""; if (u < 1.3) return a.slice(0, Math.floor(u / 1.3 * a.length)); if (u < 2.1) return a.slice(0, Math.max(0, a.length - Math.floor((u - 1.3) / 0.8 * a.length))); return f.slice(0, Math.floor((u - 2.1) / 0.4 * f.length)); };
  const retyped = (t, t0) => { const a = "honestly this week's been rough.", u = t - t0; return a.slice(0, clamp(Math.floor(u / 1.6 * a.length), 0, a.length)); };
  function draw(t) {
    const shake = shakes.reduce((m, [t0, a]) => Math.max(m, t >= t0 ? Math.max(0, 1 - (t - t0) * 2.5) * a : 0), 0);
    const capOn = (window.CAPS || []).some((c) => t >= c.t && t < c.e);
    const { cam, shot: s } = Dr.draw(t, { shake, capOn });
    for (const n of Object.keys(PROPK)) { const a = Dr.actors[n]; if (!a || !a.c) continue; const pk = propAt(n, t), kit = a.c.g.querySelector("[data-k]") && a.c.g.querySelector("[data-k]").parentNode; if (kit) [...kit.children].forEach((c) => c.setAttribute("display", c.getAttribute("data-k") === pk ? "inline" : "none")); }
    // YOU tag: first appearances only (SC01-SC02), never over faces
    const ya = Dr.actors.you; const showTag = t < SC.SC03 && ya.c.g.getAttribute("display") !== "none" && !/eyes|POV/.test(s.tag || ""); tag.setAttribute("display", showTag ? "inline" : "none");
    if (showTag) { const [hx, hy] = Dr.toScreen(cam, ya.c.joints.headX, ya.c.joints.headY); tag.setAttribute("transform", `translate(${hx.toFixed(1)},${(hy - ya.c.joints.headR * cam.z - 40).toFixed(1)})`); }
    { const bk = K.win(t, E("mo_a") + 0.02, E("mo_b") + 0.3, 0.1, 0.2), ya2 = Dr.actors.you; bubYou.setAttribute("opacity", bk.toFixed(2));
      if (bk > 0) { const [hx, hy] = Dr.toScreen(cam, ya2.c.joints.headX, ya2.c.joints.headY), hr = ya2.c.joints.headR * cam.z; bubYou.setAttribute("transform", `translate(${(hx + hr * 0.7 + 120).toFixed(1)},${(hy - hr - 40).toFixed(1)}) scale(${K.back(Math.min(1, bk * 1.4)).toFixed(3)})`); } }
    // overlays
    const cardK = (a, b) => K.win(t, a, b, 0.2, 0.25);
    const r1 = cardK(S("n03") - 0.3, E("n03") + 0.2), r2 = cardK(S("n04") - 0.2, E("n04") + 0.2), r3 = cardK(S("n05") - 0.2, E("n05") + 0.3), rf = cardK(tFine, tFine + 1.8);
    const rop = Math.max(r1, r2, r3, rf); rules.set(rop, [clamp((t - S("n03") + 0.1) / 0.4, 0, 1), clamp((t - S("n04") + 0.1) / 0.4, 0, 1), clamp((t - S("n05") + 0.1) / 0.4, 0, 1)], K.sm(tFine + 0.3, tFine + 1.0, t), K.sm(tFine + 0.2, tFine + 1.2, t) * (rf > 0 ? 1 : 0));
    const ph1 = K.win(t, tPhone, S("n07") - 0.1, 0.15, 0.2), ph2 = K.win(t, tRetype, Math.min(E("n24") + 0.3, SC.SC12 - 0.25), 0.15, 0.2);
    if (ph1 > 0) phone.set(ph1, typed(t, tPhone + 0.2), K.sm(tPhone + 2.9, tPhone + 3.2, t)); else if (ph2 > 0) phone.set(ph2, retyped(t, tRetype + 0.2), K.sm(E("n24") - 0.3, E("n24"), t) * 0); else phone.set(0, "", 0);
    const l1 = K.win(t, tList, E("ana_e") + 0.2, 0.2, 0.2), l2 = K.win(t, tTicks, S("n22") + 1.4, 0.2, 0.2); list.set(Math.max(l1, l2), l1 > 0 ? (t - tList) / 1.6 * 20 : 20, l2 > 0 ? Math.min(3, (t - tTicks - 0.2) / 0.25) : 0);
    pov.setAttribute("opacity", (s.tag === "SC01 POV empty" ? K.sm(tPOV, tPOV + 0.3, t) : 0).toFixed(2));
    caps(t);
    grade.setAttribute("fill", K.mix("#FFFFFF", "#8FA2C8", SR.sampleTrack(coldK, t, 0))); flash.setAttribute("opacity", (Math.max(0, 1 - Math.abs(t - tStorm - 0.15) * 6) * 0.55 + Math.max(0, 1 - Math.abs(t - tPop) * 10) * 0.2).toFixed(2));
  }
  const tl = gsap.timeline({ paused: true }); SR.drive(tl, D, draw); window.__timelines["main"] = tl;
  window.__EP = { Dr, marks: { tPop, tWide, tPOV, tRefl, tPhone, tFingers, tPan, tCust, tBea, tKai, tTray, tTip, tStorm, tDoorShut, tKnock, tList, tHover, tTicks, tThumb, tFine, tReflB, tRetype, tLift, tVan, tEnd }, shots: Dr.shots.map((s) => [s.t, s.set, s.tag]) };
})();
