/* Ep8 "What If You Could See Who Is Lying to You?" (paper storybook). Times come from the line clock (window.DT, window.SC).
   One mystery carries the episode: why has Pip told 37 lies by breakfast? Lie counters glow above heads (red = lies, green = 0, gold = kind lies). */
(function () {
  const { el, clamp, lerp } = SR, K = window.PK, SETS = window.SETS, T = window.DT, SC = window.SC, D = window.DUR;
  const S = (i) => T[i][0], E = (i) => T[i][0] + T[i][1], W = (i, s) => T[i][0] + s;
  const svg = document.getElementById("ov"), hud = document.getElementById("hud");
  // extra poses for this episode
  Object.assign(SR.PAPER_POSES, {
    thumbsUp: { shF: 62, elF: 96, shB: 4, elB: 8 }, sip: { head: -4, shF: 70, elF: 120, shB: 4, elB: 8 }, phoneLook: { head: 12, lean: 3, shF: 30, elF: 96, shB: 6, elB: 8 },
    whisper: { head: 10, lean: 10, shF: 96, elF: 120, shB: 6, elB: 10 }, hideBag: { lean: -3, shF: 8, elF: 10, shB: -30, elB: 40 }, show: { shF: 40, elF: 60, shB: 4, elB: 8 },
  });
  // props kit, toggled per actor
  const B = SETS.box;
  const PROPS = {
    mug: (g) => { el("rect", { x: -16, y: -26, width: 32, height: 34, rx: 6, fill: "#FFFFFF" }, g); el("path", { d: "M-6,-34 q6,-10 0,-18 M6,-34 q6,-10 0,-18", fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: 0.7 }, g); },
    phone: (g) => { el("rect", { x: -14, y: -50, width: 30, height: 54, rx: 6, fill: "#1E1B22" }, g); el("rect", { x: -10, y: -45, width: 22, height: 40, rx: 3, fill: "#9FD3EA" }, g); },
    fish: (g) => { el("ellipse", { cx: 0, cy: -10, rx: 14, ry: 7, fill: "#9FB6C8" }, g); el("path", { d: "M12,-10 l12,-8 l0,16 Z", fill: "#7E97AB" }, g); el("circle", { cx: -7, cy: -12, r: 2, fill: "#1E1B22" }, g); },
    bag: (g) => { el("rect", { x: -34, y: -10, width: 68, height: 70, rx: 6, fill: "#F2C14E" }, g); el("path", { d: "M-18,-10 q18,-34 36,0", fill: "none", stroke: "#B8862C", "stroke-width": 6 }, g); el("text", { x: 0, y: 34, "text-anchor": "middle", "font-family": "Fredoka", "font-weight": 700, "font-size": 18, fill: "#C8553D" }, g).textContent = "PARTY"; },
    tray: (g) => { el("rect", { x: -80, y: -14, width: 160, height: 16, rx: 6, fill: "#E58A3A" }, g); [-46, 0, 46].forEach((x) => el("ellipse", { cx: x, cy: -26, rx: 22, ry: 13, fill: "#E8B06A" }, g)); },
  };
  const baseProp = SR.buildProp; SR.buildProp = (g, kind) => { if (kind !== "kit") return baseProp ? baseProp(g, kind) : null; for (const [k, f] of Object.entries(PROPS)) { const c = el("g", { "data-k": k, display: "none" }, g); f(c); } return g; };
  // cast
  const LOOK = {
    you: { skin: "#E3AE85", shirt: "#6C5CE7", pants: "#2E3A5A", shoes: "#F2EDE4", hair: "#1E1B22", hairStyle: "short", seed: 51 },
    pip: { skin: "#F6D2B4", shirt: "#E86A8A", pants: "#3A4A63", shoes: "#F2EDE4", hair: "#C8553D", hairStyle: "long", seed: 64, body: "slim" },
    ana: { skin: "#9A6440", shirt: "#3FA7A0", pants: "#2E5A74", shoes: "#F2EDE4", hair: "#2A1A14", hairStyle: "bun", seed: 5, body: "slim" },
    mo: { skin: "#C98B5E", shirt: "#E8834A", pants: "#3A4A63", shoes: "#6B4A34", hair: "#3A2A22", hairStyle: "short", seed: 7, body: "round" },
    theo: { skin: "#F0C8A0", shirt: "#8A93A6", pants: "#3A4050", shoes: "#2E3440", hair: "#6A4A3A", hairStyle: "short", seed: 21, body: "lanky" },
    kai: { skin: "#B07448", shirt: "#FF8A2A", pants: "#3A4A63", shoes: "#7A5230", hair: "#E0B020", hairStyle: "cap", seed: 6, body: "broad" },
    bea: { skin: "#7A4A32", shirt: "#F2C14E", pants: "#6A4A8A", shoes: "#E86A8A", hair: "#1E1B22", hairStyle: "ponytail", seed: 4, body: "pear" },
    finn: { skin: "#F6D2B4", shirt: "#F4C430", pants: "#3A4A63", shoes: "#3B3446", hair: "#2E4A6A", hairStyle: "cap", seed: 11, body: "lanky" },
    nia: { skin: "#664030", shirt: "#E8634A", pants: "#2E3A5A", shoes: "#F2EDE4", hair: "#1E1B22", hairStyle: "afro", seed: 9, body: "slim" },
  };
  const X = (i) => { const r = SR.mulberry32(300 + i * 13), pk = (a) => a[Math.floor(r() * a.length)]; return { skin: pk(["#F6D2B4", "#E3AE85", "#C98B5E", "#B07448", "#7A4A32", "#9A6440"]), shirt: pk(["#E8834A", "#F2C14E", "#5E9E5A", "#D85A8A", "#4F7FB0", "#7B6BB0", "#2F9E8F"]), pants: pk(["#3A4A63", "#5A4E44", "#2E5A74", "#46524A"]), shoes: "#3B3446", hair: pk(["#1E1B22", "#6A4A3A", "#C79A5A", "#2A1A14"]), hairStyle: pk(["short", "curly", "ponytail", "afro", "spiky", "bun"]), seed: 40 + i, body: pk(["avg", "round", "broad", "slim", "lanky", "pear"]) }; };
  const Dr = DIR.make(svg, D);
  ["square", "jetty", "bakeryIn", "bakeryFront", "street", "cafeParty", "windowNight"].forEach((n) => Dr.set(n, SETS[n]));
  const A = {}; for (const n of Object.keys(LOOK)) A[n] = Dr.actor(n, Object.assign({}, LOOK[n], { prop: { kind: "kit" } }));
  A.youR = Dr.actor("youR", Object.assign({}, LOOK.you, { opacity: [[0, 0.5]] }), { extra: true });
  const EXN = 10; for (let i = 0; i < EXN; i++) A["x" + i] = Dr.actor("x" + i, X(i), { extra: true, mood: ["grin", "happy", "content", "cheeky"][i % 4] });
  const PROPK = {}; Object.keys(LOOK).forEach((n) => (PROPK[n] = []));
  const prop = (n, t, k) => PROPK[n].push([t, k]);
  const M = (n, t, m, d = 0.35, e = "inOut") => A[n].mood.push([t, m, d, e]), Po = (n, t, p, d = 0.35, e = "back") => A[n].pose.push([t, p, d, e]);
  const Lk = (n, t, x, y) => A[n].look.push([t, { x, y }]), Hop = (n, t, h = 14) => A[n].hop.push([t, h]), Sq = (n, t, a = 0.1) => A[n].squash.push([t, a]), Lips = (n, id) => A[n].lips.push([S(id), id]);
  const shot = (t, set, cam, cast, k, tag) => Dr.shot({ t, set, cam, cast, k, tag });
  const C = (x, y, z, x2, y2, z2, e) => ({ x, y, z, x2, y2, z2, e }), Pp = (fx, fy, hd, f = 1, more = {}) => Object.assign({ fx, fy, hd, f }, more), Wd = (wx, wy, s, f = 1, more = {}) => Object.assign({ wx, wy, s, f }, more);
  const crowd = (spots) => { const o = {}; spots.forEach(([i, wx, wy, s, f]) => { o["x" + i] = Wd(wx, wy, s, f ?? (wx < 960 ? 1 : -1)); }); return o; };
  // lie counters: NUM[name] = [[t, value], ...]; value null = hidden
  const NUM = {}; const num = (n, t, v) => (NUM[n] = NUM[n] || []).push([t, v]);
  const sqCrowd = [[0, -60, 880, 0.42], [1, 230, 860, 0.4], [2, 480, 870, 0.44], [3, 1400, 865, 0.42], [4, 1660, 880, 0.44], [5, 1940, 870, 0.4], [6, 250, 1000, 0.55], [7, 1700, 1010, 0.55], [8, 760, 850, 0.36], [9, 1150, 850, 0.36]];
  const bubbles = [];   // YOU's speech bubbles: [t0, t1, text, who]
  const say = (t0, t1, text, who = "you") => bubbles.push([t0, t1, text, who]);

  // =================== SC01 cold open: 7:30 AM ===================
  const tMo1 = W("mo_c", 1.25), tPipIn = W("n03", 1.75), tSlam = E("pip_a") + 0.15;
  shot(0, "square", C(900, 560, 1.15, 900, 540, 1.22, "lin"), Object.assign({ you: Pp(0.27, 0.40, 0.30, 1), mo: Pp(0.70, 0.42, 0.18, -1) }, crowd(sqCrowd.slice(0, 6))), 1, "SC01 coffee");
  Lips("mo", "mo_c"); M("mo", 0, "happy"); Po("mo", 0, "give", 0); prop("mo", 0, "mug"); prop("mo", W("mo_c", 1.6), null); prop("you", W("mo_c", 1.6), "mug"); Po("you", W("mo_c", 1.6), "sip", 0.3); Po("mo", W("mo_c", 1.7), "proud", 0.4);
  num("mo", tMo1, 1); M("you", 0, "content"); M("you", E("mo_c") + 0.1, "grin", 0.25); Hop("you", E("mo_c") + 0.15, 8);
  say(E("mo_c") + 0.15, S("n01") + 0.9, "Mmm! Best ever!");
  const tWide1 = S("n01") + 0.6;
  shot(tWide1, "square", C(960, 560, 1.0, 960, 540, 1.04, "lin"), Object.assign({ you: Wd(560, 960, 0.62, 1), mo: Wd(1560, 950, 0.6, -1) }, crowd(sqCrowd)), 1, "SC01 everyone");
  const crowdVals = [0, 0, 1, 0, 2, 0, 0, 1, 0, 0]; sqCrowd.forEach(([i], j) => num("x" + i, tWide1 + 0.9 + j * 0.16, crowdVals[j])); Lk("you", tWide1, 0.5, -0.3); M("you", tWide1, "surprised", 0.3); prop("you", tWide1, "mug"); Po("you", tWide1, "hold", 0);
  shot(S("n02") - 0.1, "square", C(1150, 520, 1.6), { mo: Pp(0.55, 0.44, 0.28, -1) }, 1, "SC01 mo-cu"); M("mo", S("n02"), "cheeky", 0.3); Po("mo", S("n02"), "shrug", 0.3);
  shot(S("n03") - 0.1, "square", C(960, 560, 1.0), Object.assign({ you: Wd(560, 960, 0.62, 1), mo: Wd(1560, 950, 0.6, -1) }, crowd(sqCrowd)), 1, "SC01 tiny numbers");
  shot(tPipIn, "square", C(980, 560, 1.2), { you: Pp(0.24, 0.40, 0.28, 1), pip: Pp(1.08, 0.42, 0.20, -1, { fx2: 0.66, d1: 0.6, e: "out", walk: 1 }) }, 1, "SC01 pip enters");
  Lips("pip", "pip_a"); M("pip", tPipIn, "grin"); Po("pip", S("pip_a"), "wave", 0.25); Hop("pip", S("pip_a") + 0.1, 14); M("you", tPipIn + 0.2, "skeptic", 0.4);
  num("pip", tSlam, 37); M("you", tSlam + 0.05, "shock", 0.15, "back"); Po("you", tSlam + 0.05, "flinch", 0.15); Po("you", tSlam + 0.7, "hold", 0.4, "inOut");
  shot(S("n04") - 0.1, "square", C(820, 520, 1.6), { you: Pp(0.42, 0.44, 0.34, 1) }, 1, "SC01 you-37"); M("you", S("n04"), "shock", 0.2); Lk("you", S("n04"), 0.8, -0.2);
  shot(S("n05") - 0.1, "square", C(700, 470, 1.9), { you: Pp(0.48, 0.58, 0.40, 1) }, 1, "SC01 own-number"); Lk("you", W("n05", 1.4), 0, -1); M("you", W("n05", 1.4), "nervous", 0.4);

  // =================== SC02 title + rules ===================
  const t02 = SC.SC02, tTitle0 = t02, tTitle1 = S("n06") - 0.25;
  shot(t02, "square", C(960, 540, 1.0), crowd(sqCrowd), 0.85, "SC02 card bg");

  // =================== SC03 an honest island: 8:10 AM ===================
  const t03 = SC.SC03, zw = (k) => { const wd = (window.N9 || []); return wd[k] != null ? S("n09") + wd[k] : W("n09", 0.9 + k * 0.6); };
  const tZ1 = W("n09", 1.45), tZ2 = W("n09", 2.05), tZ3 = W("n09", 2.65);
  shot(t03, "jetty", C(1100, 600, 1.35), { finn: Pp(0.58, 0.40, 0.22, -1) }, null, "SC03 finn zero"); M("finn", t03, "content"); Po("finn", t03, "relaxed", 0); num("finn", t03 + 0.3, 0);
  shot(tZ1 - 0.1, "bakeryIn", C(900, 560, 1.15), { bea: Wd(780, 900, 0.9, 1) }, null, "SC03 bea zero"); prop("bea", tZ1 - 0.1, "tray"); Po("bea", tZ1 - 0.1, "hold", 0); M("bea", tZ1, "happy"); num("bea", tZ1, 0);
  shot(tZ2 - 0.1, "street", C(1300, 560, 1.25), { theo: Pp(0.5, 0.42, 0.22, 1) }, { vanX: -2000 }, "SC03 theo zero"); M("theo", tZ2, "content"); num("theo", tZ2, 0);
  shot(tZ3 - 0.1, "square", C(960, 560, 1.25), { ana: Pp(0.55, 0.42, 0.22, -1) }, 1, "SC03 ana zero"); M("ana", tZ3, "happy"); num("ana", tZ3, 0);
  const tText = E("n09") + 0.05;
  shot(tText, "square", C(760, 520, 1.6), { you: Pp(0.42, 0.44, 0.32, 1) }, 1, "SC03 texting"); prop("you", tText, "phone"); Po("you", tText, "phoneLook", 0.2); M("you", tText, "content", 0.3); say(tText + 0.25, tText + 1.9, "On my way!");
  shot(S("n10") + 1.2, "square", C(960, 560, 1.0, 960, 560, 1.06, "lin"), Object.assign({ you: Wd(560, 960, 0.62, 1), ana: Wd(1240, 930, 0.5, -1) }, crowd(sqCrowd)), 1, "SC03 honest square");
  sqCrowd.forEach(([i], j) => num("x" + i, S("n10") + 1.3 + j * 0.1, 0)); prop("you", S("n10") + 1.2, null); Po("you", S("n10") + 1.2, "relaxed", 0); M("you", S("n10") + 2.5, "relieved", 0.6);
  shot(S("n11") - 0.1, "square", C(820, 520, 1.5), { you: Pp(0.34, 0.44, 0.30, 1), pip: Pp(0.82, 0.44, 0.12, -1) }, 1, "SC03 who"); Lk("you", S("n11"), 1, 0); M("you", S("n11"), "skeptic", 0.4); Po("pip", S("n11"), "wave", 0.3);

  // =================== SC04 Pip's morning: 10:15 AM ===================
  const t04 = SC.SC04;
  shot(t04, "bakeryIn", C(900, 580, 1.15), { bea: Wd(700, 900, 0.9, 1), pip: Wd(1220, 900, 0.9, -1) }, null, "SC04 haircut"); prop("bea", t04, null); Po("bea", t04, "relaxed", 0); M("bea", t04, "content");
  Lips("pip", "pip_b"); M("pip", S("pip_b"), "grin", 0.2); Po("pip", S("pip_b"), "give", 0.25); num("pip", t04, 37); num("pip", E("pip_b") + 0.1, 38); M("bea", W("pip_b", 1.2), "confused", 0.3); Po("bea", W("pip_b", 1.4), "think", 0.3); M("bea", E("pip_b") + 0.3, "happy", 0.4); num("bea", t04, 0);
  const tFish = E("pip_b") + 0.9;
  shot(tFish, "jetty", C(1050, 640, 1.3), { finn: Pp(0.42, 0.40, 0.20, 1), pip: Pp(0.70, 0.40, 0.20, -1) }, null, "SC04 fish");
  prop("finn", tFish, "fish"); Po("finn", tFish, "show", 0.2); M("finn", tFish, "proud"); Lips("pip", "pip_c"); M("pip", S("pip_c"), "laugh", 0.2); Po("pip", S("pip_c"), "cheer", 0.25); num("pip", E("pip_c") + 0.1, 39); num("finn", tFish, 0); M("finn", E("pip_c") - 0.2, "confused", 0.3);
  const tPhone = E("pip_c") + 1.0;
  shot(tPhone, "bakeryFront", C(760, 540, 1.1), { pip: Wd(560, 1000, 0.95, 1) }, null, "SC04 phone"); prop("pip", tPhone, "phone"); Po("pip", tPhone, "phone", 0.2); Lips("pip", "pip_d"); M("pip", tPhone, "forced", 0.2); num("pip", E("pip_d") + 0.1, 40);
  shot(S("n12") - 0.1, "square", C(960, 560, 1.0, 1250, 560, 1.25, "inOut"), Object.assign({ pip: Wd(1420, 930, 0.5, -1), you: Wd(300, 960, 0.6, 1) }, crowd(sqCrowd.slice(0, 8))), 1, "SC04 prolific"); prop("pip", S("n12"), null); Po("pip", S("n12"), "wave", 0.3); M("pip", S("n12"), "grin", 0.3); num("pip", S("n12"), 40);
  sqCrowd.slice(0, 8).forEach(([i], j) => num("x" + i, S("n12") - 0.1, [0, 0, 1, 0, 0, 0, 1, 0][j]));
  shot(S("n13") - 0.1, "square", C(700, 520, 1.7), { you: Pp(0.45, 0.46, 0.36, 1) }, 1, "SC04 determined"); M("you", W("n13", 2.0), "determined", 0.4); Lk("you", W("n13", 2.0), 0.7, 0);

  // =================== SC05 everyone's in on it: 2:40 PM ===================
  const t05 = SC.SC05;
  shot(t05, "cafeParty", C(760, 540, 1.25), { you: Pp(0.08, 0.42, 0.40, 1), mo: Pp(0.52, 0.44, 0.22, -1), pip: Pp(0.70, 0.44, 0.22, -1) }, { m: 1 }, "SC05 whisper");
  Po("pip", t05, "whisper", 0.2); Po("mo", t05, "leanIn", 0.3); M("mo", t05 + 0.4, "surprised", 0.2); M("mo", t05 + 0.9, "cheeky", 0.3); num("mo", t05, 1); num("mo", t05 + 0.7, 2); num("mo", t05 + 1.2, 3); num("pip", t05, 51); M("you", t05, "skeptic", 0.2); prop("you", t05, null); Po("you", t05, "relaxed", 0);
  shot(S("ana_f") - 0.3, "square", C(980, 560, 1.2), { you: Pp(0.25, 0.40, 0.28, 1), ana: Pp(0.66, 0.42, 0.18, -1) }, 1, "SC05 ana");
  Lips("ana", "ana_f"); M("ana", S("ana_f"), "forced", 0.2); Po("ana", S("ana_f"), "shrug", 0.3); num("ana", S("ana_f") - 0.3, 0); num("ana", E("ana_f") + 0.1, 1); M("you", E("ana_f") + 0.15, "sad", 0.4);
  say(E("ana_f") + 0.5, E("ana_f") + 2.0, "I'm not mad.");
  shot(S("theo_c") - 0.3, "street", C(1200, 580, 1.3), { theo: Pp(0.55, 0.42, 0.24, -1), you: Pp(0.15, 0.42, 0.26, 1) }, { vanX: -2000 }, "SC05 theo");
  Lips("theo", "theo_c"); prop("theo", S("theo_c") - 0.3, "bag"); Po("theo", S("theo_c") - 0.3, "hideBag", 0); M("theo", S("theo_c"), "nervous", 0.2); num("theo", S("theo_c") - 0.3, 0); num("theo", E("theo_c") + 0.1, 1); M("you", S("theo_c"), "skeptic", 0.3);
  const tMont = S("n14") - 0.1;
  shot(tMont, "square", C(960, 600, 1.15, 960, 560, 1.32, "lin"), Object.assign({ you: Wd(960, 980, 0.58, 1), mo: Wd(1560, 930, 0.5, -1), ana: Wd(560, 930, 0.5, 1), theo: Wd(1300, 920, 0.48, -1), kai: Wd(300, 950, 0.52, 1), bea: Wd(1760, 960, 0.52, -1), pip: Wd(1960, 930, 0.48, -1) }, crowd(sqCrowd.slice(8))), 1, "SC05 everyone lying");
  prop("theo", tMont, null); Po("theo", tMont, "relaxed", 0); ["mo", "ana", "theo", "kai", "bea", "pip"].forEach((n) => M(n, tMont, "forced", 0.2));
  num("mo", tMont, 3); num("ana", tMont, 1); num("theo", tMont, 1); num("kai", tMont, 0); num("bea", tMont, 0); num("pip", tMont, 52); num("kai", tMont + 1.0, 1); num("bea", tMont + 1.6, 1); num("mo", tMont + 2.2, 4); num("pip", tMont + 2.8, 55); num("ana", tMont + 3.4, 2);
  M("you", tMont, "worried", 0.3); for (let i = 0; i < 4; i++) Lk("you", tMont + i * 0.9, i % 2 ? -0.8 : 0.8, 0); M("you", tMont + 3.0, "sad", 0.6);
  const tCoin = S("n15") - 0.15;

  // =================== SC06 the confrontation: 6:58 PM ===================
  const t06 = SC.SC06, tLights = S("sur_all") - 0.12;
  shot(t06, "square", C(960, 560, 1.2), { you: Pp(0.05, 0.42, 0.26, 1, { fx2: 0.30, d1: 1.6, e: "out", walk: 1 }), pip: Pp(0.66, 0.42, 0.22, -1) }, 0.6, "SC06 door");
  num("pip", t06, 63); M("pip", t06, "nervous", 0.2); M("you", t06, "determined", 0.2); Po("you", t06 + 1.2, "point", 0.25); say(t06 + 1.3, S("pip_e") - 0.1, "63?! What are you hiding?"); M("pip", t06 + 1.5, "forced", 0.3);
  shot(S("pip_e") - 0.1, "square", C(1200, 520, 1.6), { pip: Pp(0.55, 0.44, 0.30, -1) }, 0.6, "SC06 caught"); Lips("pip", "pip_e"); M("pip", S("pip_e"), "nervous", 0.3); Po("pip", W("pip_e", 1.2), "give", 0.3);
  shot(E("pip_e") + 0.3, "cafeParty", C(960, 560, 1.0), { you: Pp(0.30, 0.42, 0.22, 1, { fx2: 0.40, walk: 1 }) }, (t) => ({ m: 0.1, party: t >= tLights ? 1 : 0, dark: t < tLights ? 0.88 : Math.max(0, 0.88 - (t - tLights) * 6) }), "SC06 dark");
  M("you", E("pip_e") + 0.3, "nervous", 0.2);
  const party = { you: Wd(400, 960, 0.62, 1), mo: Wd(1560, 930, 0.52, -1), ana: Wd(760, 920, 0.5, -1), theo: Wd(1180, 910, 0.5, -1), kai: Wd(1380, 930, 0.52, -1), bea: Wd(1740, 950, 0.52, -1), finn: Wd(980, 900, 0.48, -1), pip: Wd(620, 950, 0.52, 1) };
  shot(tLights, "cafeParty", C(960, 560, 1.0, 960, 560, 1.05, "lin"), party, { m: 0.3, party: 1, dark: 0 }, "SC06 surprise");
  ["mo", "ana", "theo", "kai", "bea", "finn", "pip"].forEach((n, i) => { Po(n, tLights, "cheer", 0.15); M(n, tLights, "laugh", 0.15); Hop(n, tLights + i * 0.05, 18); });
  M("you", tLights + 0.05, "shock", 0.12, "back"); Po("you", tLights + 0.05, "startle", 0.12); Po("you", tLights + 1.4, "relaxed", 0.6, "inOut"); M("you", S("n16"), "touched", 0.8);
  const PARTYN = { mo: 4, ana: 2, theo: 3, kai: 2, bea: 1, finn: 1, pip: 63 }; for (const [n, v] of Object.entries(PARTYN)) num(n, tLights + 0.3, v);
  shot(S("n16") + 0.2, "cafeParty", C(560, 500, 1.7), { you: Pp(0.48, 0.46, 0.34, 1) }, { m: 0.3, party: 1, dark: 0 }, "SC06 touched");
  shot(S("n17") - 0.1, "cafeParty", C(960, 560, 1.0, 1000, 540, 1.12, "lin"), party, { m: 0.3, party: 1, dark: 0 }, "SC06 kind lies"); ["mo", "ana", "theo", "kai", "bea", "finn", "pip"].forEach((n) => { Po(n, S("n17"), "relaxed", 0.5, "inOut"); M(n, S("n17"), "happy", 0.5); }); M("you", S("n17"), "happy", 0.6);
  shot(S("pip_f") - 0.15, "cafeParty", C(700, 520, 1.6), { pip: Pp(0.50, 0.44, 0.30, 1) }, { m: 0.3, party: 1, dark: 0 }, "SC06 terrible liar"); Lips("pip", "pip_f"); M("pip", S("pip_f"), "cheeky", 0.2); Po("pip", S("pip_f"), "shrug", 0.3); num("pip", E("pip_f") + 0.15, 64);
  shot(S("n18") - 0.1, "cafeParty", C(960, 560, 1.05), party, { m: 0.3, party: 1, dark: 0 }, "SC06 bad lie days"); M("pip", S("n18"), "laugh", 0.3); Hop("pip", S("n18") + 0.2, 12); M("you", S("n18"), "laughing", 0.3); Po("you", S("n18"), "hug", 0.4);

  // =================== SC07 the mirror: 11:59 PM ===================
  const t07 = SC.SC07, tTwelve = W("n19", 2.02), tReset = E("n22") + 0.9;
  shot(t07, "windowNight", C(960, 520, 1.0, 960, 500, 1.1, "lin"), { youR: Wd(980, 1290, 1.8, -1) }, null, "SC07 reflection");
  M("youR", t07, "content", 0.3); M("youR", tTwelve + 0.05, "shock", 0.15, "back"); num("youR", tTwelve, 12); M("youR", S("n21"), "nervous", 0.5); M("youR", S("n22") + 1.2, "relieved", 0.8); num("youR", tReset, 0);
  const n20w = [W("n20", 0.0), W("n20", 0.62), W("n20", 1.26)];
  say(n20w[0], E("n22"), "Best ever!", "r1"); say(n20w[1], E("n22"), "On my way!", "r2"); say(n20w[2], E("n22"), "I'm not mad.", "r3");

  // =================== SC08 takeaway ===================
  const t08 = SC.SC08, tNia = t08;
  shot(tNia, "square", C(1380, 520, 1.2, 1380, 470, 1.45, "lin"), { nia: Pp(0.5, 0.36, 0.26, 1) }, 0.9, "SC08 nia");
  Lips("nia", "n23"); M("nia", tNia, "content"); M("nia", W("n23", 2.0), "hopeful", 0.6); M("nia", W("n23", 9.0), "happy", 0.6); Po("nia", W("n23", 1.8), "give", 0.4); Po("nia", W("n23", 6.0), "shrug", 0.4); Po("nia", W("n23", 10.5), "relaxed", 0.5); Po("nia", W("n23", 13.0), "point", 0.4); Po("nia", W("n23", 15.5), "proud", 0.5);

  // =================== SC09 mirror ending: 7:30 AM ===================
  const t09 = SC.SC09;
  shot(t09, "square", C(900, 560, 1.15, 900, 540, 1.2, "lin"), Object.assign({ you: Pp(0.27, 0.40, 0.30, 1), mo: Pp(0.70, 0.42, 0.18, -1) }, crowd(sqCrowd.slice(0, 6))), 1, "SC09 coffee again");
  Lips("mo", "mo_d"); ["mo", "pip"].forEach((n) => prop(n, t09, null)); M("mo", t09, "happy"); Po("mo", t09, "give", 0.2); prop("mo", t09, "mug"); prop("mo", W("mo_d", 2.0), null); prop("you", W("mo_d", 2.0), "mug"); Po("you", W("mo_d", 2.0), "sip", 0.3);
  M("mo", W("mo_d", 1.0), "cheeky", 0.3); num("mo", t09, 0); M("you", E("mo_d") + 0.1, "laughing", 0.2); Hop("you", E("mo_d") + 0.15, 10); say(E("mo_d") + 0.35, S("n24") - 0.15, "Honestly? It's great.");
  const tEnd = S("n24") - 0.1; const closer = sqCrowd.map(([i, wx, wy, s]) => { let x = 960 + (wx - 960) * 0.62; if (wy > 860 && x > 760 && x < 1180) x += x < 960 ? -260 : 260; return [i, x, wy, s]; });
  shot(tEnd, "square", C(960, 560, 1.12, 960, 540, 1.0, "lin"), Object.assign({ you: Wd(1240, 985, 0.6, 1), mo: Wd(1500, 975, 0.58, -1), pip: Wd(1700, 975, 0.56, -1) }, crowd(closer)), 1, "SC09 all honest");
  sqCrowd.forEach(([i]) => num("x" + i, tEnd, 0)); num("mo", tEnd, 0); num("pip", tEnd, 0); Po("pip", tEnd + 0.4, "wave", 0.3); M("pip", tEnd, "happy"); prop("you", tEnd, null); Po("you", tEnd, "relaxed", 0); M("you", tEnd, "happy", 0.4);
  // midnight reset: every counter goes to 0 (no one is on screen between, so only the reflection shows it)
  // ---------------- overlays ----------------
  SETS.neonDefs(svg); SETS.neonDefs(hud);
  const counters = SETS.counters(hud), clock = SETS.clock(hud), coin = SETS.coin(hud);
  const rules = SETS.rules(hud, ["It counts every lie, big or small.", "It resets at midnight.", "Nobody else can see it."], "*even the little ones.");
  const title = K.card(hud, ["WHO IS", "LYING TO YOU?"], { fs: 150, bg: "#120E14", fg: "#FFF6E3" });
  const bubEls = {}; for (const [, , txt, who] of bubbles) { const key = who + txt; if (!bubEls[key]) bubEls[key] = K.bubble(hud, txt, { fs: 64 }); }
  const grade = el("rect", { x: 0, y: 0, width: 1920, height: 1080, style: "mix-blend-mode:multiply", "pointer-events": "none" }, svg);
  const flash = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#fff", opacity: 0, "pointer-events": "none" }, svg);
  const caps = K.captions(hud, window.CAPS || []); SR.paperGrain(svg);
  const tag = K.tag(svg, "YOU", { fs: 34 });
  Dr.compile();
  const propAt = (n, t) => { let k = null; for (const [t0, kk] of PROPK[n] || []) if (t >= t0) k = kk; return k; };
  const numAt = (n, t) => { let v = null, tc = -9; for (const [t0, vv] of NUM[n] || []) if (t >= t0) { if (vv !== v) tc = t0; v = vv; } return [v, tc]; };
  const CLK = [[0.2, "7:30 AM"], [S("n04") - 0.1, "7:31 AM"], [tTitle0, null], [SC.SC03, "8:10 AM"], [SC.SC04, "10:15 AM"], [SC.SC05, "2:40 PM"], [tCoin, null], [E("n15") + 0.7, "2:41 PM"], [SC.SC06, "6:58 PM"], [tLights, "7:00 PM"], [SC.SC07, "11:59 PM"], [tReset, "12:00 AM"], [SC.SC08, null], [SC.SC09, "7:30 AM"], [S("n24"), null]];
  const clkAt = (t) => { let c = [null, 0]; for (const [t0, s] of CLK) if (t >= t0) c = [s, t0]; return c; };
  // colour grade: dusk at SC06 door, cool in the "everyone's lying" montage, deep night at SC07
  const gradeK = [[0, "#FFFFFF"], [tMont, "#FFFFFF"], [tMont + 1.5, "#C9D2E6"], [SC.SC06 - 0.01, "#C9D2E6"], [SC.SC06, "#F6B48A"], [E("pip_e") + 0.3, "#8E8AA8"], [tLights, "#FFF1D6"], [SC.SC07, "#9EA6C8"], [tReset + 0.5, "#B7BED8"], [SC.SC08, "#FFFFFF"]];
  const gradeAt = (t) => { let c = "#FFFFFF"; for (const [t0, cc] of gradeK) if (t >= t0) c = cc; return c; };
  const shakes = [[tSlam, 0.6], [tLights, 0.5]];
  const hideOverlayFor = (t) => (t >= tTitle0 && t < SC.SC03 - 0.05) || (t >= tCoin && t < E("n15") + 0.6);
  function draw(t) {
    const shake = shakes.reduce((m, [t0, a]) => Math.max(m, t >= t0 ? Math.max(0, 1 - (t - t0) * 2.5) * a : 0), 0);
    const capOn = (window.CAPS || []).some((c) => t >= c.t && t < c.e);
    const { cam, shot: s } = Dr.draw(t, { shake, capOn });
    for (const n of Object.keys(PROPK)) { const a = Dr.actors[n]; if (!a || !a.c) continue; const pk = propAt(n, t), first = a.c.g.querySelector("[data-k]"), kit = first && first.parentNode; if (kit) [...kit.children].forEach((c) => c.setAttribute("display", c.getAttribute("data-k") === pk ? "inline" : "none")); }
    // lie counters
    counters.hideAll(); const hideOv = hideOverlayFor(t);
    if (!hideOv) for (const n of Object.keys(NUM)) { const a = Dr.actors[n]; if (!a || a.c.g.getAttribute("display") === "none") continue; const [v, tc] = numAt(n, t); if (v == null) continue;
      const J = a.c.joints, [hx, hy] = Dr.toScreen(cam, J.headX, J.headY), hr = J.headR * cam.z; if (hx < -100 || hx > 2020 || hy - hr > 1000) continue;
      const kind = s.tag && /SC06 (kind lies|terrible liar|bad lie days|touched)/.test(s.tag); const color = v === 0 ? "#5BFF8F" : kind ? "#FFD84A" : "#FF4D4D";
      const hairExtra = { bun: 0.8, afro: 0.45, cap: 0.25, curly: 0.3, spiky: 0.3 }[(a.spec || {}).hairStyle] || 0.12; const big = n === "pip" && t >= tSlam && t < tSlam + 0.5;
      counters.show(n, v, hx, hy - hr * (1 + hairExtra), hr * (big ? 1.3 : 1), clamp((t - tc) / 0.32, 0, 1), color, 1); }
    // YOU tag: the opening only
    const ya = Dr.actors.you; const showTag = t < S("n01") && ya.c.g.getAttribute("display") !== "none"; tag.setAttribute("display", showTag ? "inline" : "none");
    if (showTag) { const [hx, hy] = Dr.toScreen(cam, ya.c.joints.headX, ya.c.joints.headY); tag.setAttribute("transform", `translate(${hx.toFixed(1)},${(hy - ya.c.joints.headR * cam.z - 40).toFixed(1)})`); }
    // YOU's speech bubbles (YOU never speaks aloud); r1-r3 are the mirror flashback, stacked beside the reflection
    for (const [t0, t1, txt, who] of bubbles) { const b = bubEls[who + txt], k = K.win(t, t0, t1, 0.12, 0.2); if (k <= 0) { if (t < t0 || t > t1 + 0.25) b.setAttribute("opacity", 0); continue; }
      let x, y; if (who.startsWith("r")) { const i = +who[1] - 1; x = [520, 540, 560][i]; y = [300, 470, 640][i]; } else { const J = ya.c.joints, [hx, hy] = Dr.toScreen(cam, J.headX, J.headY), hr = J.headR * cam.z; x = hx + hr * 0.7 + 130; y = hy - hr - 40; }
      b.setAttribute("opacity", k.toFixed(2)); b.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${K.back(Math.min(1, k * 1.4)).toFixed(3)})`); }
    // clock header
    { const [txt, t0] = clkAt(t); const vis = txt && !hideOv; clock.set(vis ? K.win(t, t0, t0 + 3.5, 0.3, 0.4) : 0, txt || "", t); }
    // title, rules, coin
    title.set(K.win(t, tTitle0, tTitle1, 0.08, 0.2), clamp((t - tTitle0) / 0.6, 0, 1));
    rules.set(K.win(t, S("n06") - 0.2, SC.SC03 - 0.1, 0.2, 0.25), [clamp((t - S("n06") + 0.1) / 0.4, 0, 1), clamp((t - S("n07") + 0.1) / 0.4, 0, 1), clamp((t - S("n08") + 0.1) / 0.4, 0, 1)], K.sm(E("n08") - 0.2, E("n08") + 0.3, t));
    coin.set(K.win(t, tCoin, E("n15") + 0.6, 0.12, 0.2), t, tCoin);
    caps(t);
    grade.setAttribute("fill", gradeAt(t)); flash.setAttribute("opacity", (Math.max(0, 1 - Math.abs(t - tLights) * 5) * 0.7 + Math.max(0, 1 - Math.abs(t - tSlam) * 10) * 0.25).toFixed(2));
  }
  const tl = gsap.timeline({ paused: true }); SR.drive(tl, D, draw); window.__timelines["main"] = tl;
  window.__EP = { Dr, marks: { tMo1, tPipIn, tSlam, tWide1, tZ1, tZ2, tZ3, tText, tFish, tPhone, tMont, tCoin, tLights, tTwelve, tReset, tEnd, tTitle0, tTitle1 }, shots: Dr.shots.map((s) => [s.t, s.set, s.tag]) };
})();
