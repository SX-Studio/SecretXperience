/* Ep7 director: "What If You Could See How Much Everyone Was Secretly Struggling?"  v5 cast, 2D sets, fast cuts, progressive moods.
   Line clock: window.DT[id] = [start, dur]; window.SC[scene] = scene start. */
(function () {
  const { el, clamp, lerp } = SR, K = window.K7, SETS = window.SETS7, T = window.DT, D = window.DUR, SC = window.SC;
  const S = (id) => T[id][0], E = (id) => T[id][0] + T[id][1], W = (id, s) => T[id][0] + s;
  const svg = document.getElementById("ov"), hud = document.getElementById("hud"); TS.defs(svg);
  const world = el("g", {}, svg);
  // ---------------- sets ----------------
  const SET = {}, setMood = {};
  ["square", "bedroom", "street", "bakery", "harbour", "site", "bench", "chalk", "hidden", "feed", "cafe", "reflect", "host"].forEach((k) => {
    const g = el("g", { display: "none" }, world), back = el("g", {}, g), chars = el("g", {}, g), wx = el("g", {}, g), front = el("g", {}, g);
    SET[k] = Object.assign({ g, chars, wx, front }, SETS[k](back, front)); });
  // ---------------- cast ----------------
  const ALL = [];   // [character, setKey]
  const mk = (setKey, look, o, parent) => { const c = SR.Character(parent || SET[setKey].chars, Object.assign({}, look, { scale: 2, noWalk: false, look: [[0, { x: 0, y: 0 }]] }, o)); c.setKey = setKey; ALL.push(c); return c; };
  const C5 = CAST5, X = (i) => K.extra(i);
  const stranger = { build: "v5", body: "round", skin: "#E3AE85", color: "#4F7FB0", outfit: "shirt", hair: "short", hairColor: "#6A4A3A", pants: "#5A4E44", shoes: "#3B3446", seed: 77 };
  const WXS = [];   // weather icons: {c, set, lv:[[t,lv]], pop:t0, k, dy}
  const wxOn = (c, lv, pop, k = 1.05, dy = 0) => { const w = K.weather(SET[c.setKey].wx, { seed: WXS.length + 1 }); WXS.push({ w, c, lv: typeof lv === "number" ? [[0, lv]] : lv, pop, k, dy }); return w; };

  // ===== S01 / S08 / S05: the square =====
  const sqPos = [[-60, 870, 1.55], [250, 860, 1.5], [560, 870, 1.6], [1360, 860, 1.5], [1660, 870, 1.55], [1960, 860, 1.5], [90, 1010, 1.95], [420, 1030, 2.0], [1500, 1030, 2.0], [1830, 1010, 1.95]];
  const sqMood = ["grin", "happy", "content", "happy", "grin", "content", "happy", "grin", "content", "happy"], sqPose = ["wave", "relaxed", "proud", "relaxed", "wave", "hipsHands", "relaxed", "proud", "relaxed", "wave"];
  const sqLv = [4, null, 3, 1, null, 4, 2, null, 3, 1], tStorm = W("n02", 1.15);
  // crowd until S05; for the close (S08) the same people regroup closer together
  const tClose = SC.S08 + T.n28[1] + 0.6;
  const sq = sqPos.map(([x, y, k], i) => { const x2 = 960 + (x - 960) * 0.62 + (i % 2 ? 30 : -30);
    const c = mk("square", X(i), { scale: k, x: [[0, x], [tClose - 0.01, x], [tClose, x2]], y: [[0, y]], facing: [[0, x < 960 ? 1 : -1]], mood: [[0, sqMood[i], 0], [tClose, i % 3 ? "content" : "happy", 0]], pose: [[0, sqPose[i], 0], [tClose, i % 2 ? "relaxed" : "hug", 0]] });
    if (sqLv[i] != null) wxOn(c, [[0, sqLv[i]], [tClose, Math.max(1, sqLv[i] - 1.5)]], tStorm + i * 0.07, 1.0 * (k / 1.8)); else wxOn(c, 0, S("n07") + 0.3 + i * 0.05, k / 1.8);
    return c; });
  // Ana in the square (S05) + YOU
  const anaSqMood = [[0, "happy", 0], [W("n18", 0.7), "forced", 1.2, "inOut"]];
  const anaSq = mk("square", C5.ana, { x: [[0, 1250]], y: [[0, 940]], scale: 2.1, facing: [[0, -1]], mood: anaSqMood, pose: [[0, "wave", 0], [W("n17", 4.0), "holdBoth", 0.3], [S("n18"), "relaxed", 0.6]], prop: { kind: "box", show: [[0, 0], [W("n17", 4.0), 1], [S("n18"), 0]] } });
  const anaStorm = wxOn(anaSq, 4, W("n18", 0.62), 2.1, -10); anaStorm.long = 1;
  const moSq = mk("square", C5.mo, { x: [[0, 1580]], y: [[0, 950]], scale: 2.0, facing: [[0, -1]], mood: [[0, "grin", 0]], pose: [[0, "proud", 0]] });
  const youSq = mk("square", C5.you, { x: [[0, 520]], y: [[0, 960]], scale: 2.15, facing: [[0, 1]], mood: [[0, "curious" in SR.F5 ? "curious" : "hopeful", 0], [W("n18", 0.7), "worried", 1.5, "inOut"], [tClose, "touched", 0.1]], pose: [[0, "relaxed", 0]] });
  // the close: YOU + Ana + friends in the middle, standing close
  const anaEnd = mk("square", C5.ana, { x: [[0, 1060]], y: [[0, 990]], scale: 2.1, facing: [[0, -1]], mood: [[0, "relieved", 0], [tClose + 2, "happy", 1.5, "inOut"]], pose: [[0, "relaxed", 0], [tClose + 1.5, "hug", 1.2, "inOut"]] });
  const youEnd = mk("square", C5.you, { x: [[0, 840]], y: [[0, 990]], scale: 2.15, facing: [[0, 1]], mood: [[0, "content", 0], [tClose + 2.2, "happy", 1.5, "inOut"]], pose: [[0, "relaxed", 0], [tClose + 1.7, "hug", 1.2, "inOut"]] });
  wxOn(anaEnd, 1.3, tClose + 0.2, 1.1); wxOn(youEnd, 1.2, tClose + 0.35, 1.1);
  const vis = (c, a, b) => { c.__vis = [a, b]; };
  [anaSq, moSq, youSq].forEach((c) => vis(c, SC.S05, SC.S06)); [anaEnd, youEnd].forEach((c) => vis(c, tClose, 9999));
  // ===== S02: bedroom =====
  const youBed = mk("bedroom", C5.you, { x: [[0, 760]], y: [[0, 812]], facing: [[0, 1]], mood: [[0, "sleepy", 0], [W("n03", 0.9), "surprised", 0.35, "back"], [W("n03", 1.9), "shock", 0.3]], pose: [[0, "sitSlump", 0], [W("n03", 0.8), "sit", 0.5]], look: [[0, { x: 0, y: 0 }], [W("n03", 1.2), { x: 0.9, y: -0.3 }]] });
  // ===== street: sun/cloud/rain/storm row + stranger + YOU =====
  const stRow = [[340, 0, "happy"], [760, 1, "content"], [1180, 3, "grin"], [1600, 4, "grin"]].map(([x, lv, m], i) => { const c = mk("street", X(20 + i), { x: [[0, x]], y: [[0, 960]], facing: [[0, i < 2 ? 1 : -1]], mood: [[0, m, 0]], pose: [[0, i === 3 ? "wave" : "relaxed", 0]] }); wxOn(c, lv, W("n03", 3.0) + i * 0.15, 1.1); return c; });
  stRow.forEach((c) => vis(c, SC.S02, S("str_01") - 0.2));
  const youSt = mk("street", C5.you, { x: [[0, 520]], y: [[0, 960]], facing: [[0, 1]], mood: [[0, "hopeful", 0], [W("str_01", 1.0), "skeptic", 0.5, "inOut"], [S("n13"), "confused", 0.4, "inOut"], [E("n13"), "surprised", 0.4], [W("n15", 1.4), "worried", 0.8, "inOut"]], pose: [[0, "relaxed", 0], [S("str_01") + 0.6, "wave", 0.3], [E("str_01"), "relaxed", 0.4]], look: [[0, { x: 0, y: 0 }], [S("n06"), { x: 0.6, y: -0.8 }], [E("n06"), { x: 0, y: 0 }]] });
  vis(youSt, S("str_01") - 0.2, SC.S05);
  const strG = mk("street", stranger, { x: [[0, 2200], [S("str_01") - 0.2, 2200], [S("str_01") + 1.0, 1180, "out"], [E("n06") - 1.0, 1180], [E("n06") + 1.2, 2300, "in"]], y: [[0, 960]], facing: [[0, -1], [E("n06") - 0.9, 1]],
    mood: [[0, "grin", 0], [S("str_01") + 0.9, "forced", 0.4]], pose: [[0, "relaxed", 0], [S("str_01") + 0.9, "wave", 0.3], [E("str_01") + 0.3, "relaxed", 0.4]], lips: [[S("str_01"), "str_01"]] });
  wxOn(strG, 4, S("str_01") - 0.2, 1.15); vis(strG, S("str_01") - 0.2, SC.S03);
  // S04 street: Theo hides his storm behind a sun on a stick; phone people
  const theoSt = mk("street", C5.theo, { x: [[0, 1250]], y: [[0, 960]], facing: [[0, -1]], mood: [[0, "worried", 0], [W("n14", 1.0), "forced", 0.5]], pose: [[0, "relaxed", 0], [W("n14", 0.9), "wave", 0.35, "back"]] });
  const theoW = wxOn(theoSt, 4, SC.S04 + 0.6, 1.1); vis(theoSt, SC.S04, W("n14", 2.7));
  const sunStick = el("g", {}, SET.street.wx); el("line", { x1: 0, y1: 0, x2: 0, y2: 110, stroke: "#8E6440", "stroke-width": 10 }, sunStick); const ss = K.weather(sunStick); ss.g.setAttribute("transform", "scale(1.6)");
  const phoners = [[360, 3], [960, 2], [1560, 4]].map(([x, lv], i) => { const c = mk("street", X(40 + i), { x: [[0, x]], y: [[0, 960]], facing: [[0, i ? -1 : 1]], mood: [[0, "content", 0]], pose: [[0, "phoneUp", 0]] }); wxOn(c, lv, W("n15", 1.35) + i * 0.12, 1.0); vis(c, W("n15", 1.2), SC.S05); return c; });
  vis(youSt, S("str_01") - 0.2, W("n15", 1.2));
  // ===== S03: bakery / harbour / site / bench =====
  const bea = mk("bakery", C5.bea, { x: [[0, 780]], y: [[0, 935]], facing: [[0, 1]], mood: [[0, "grin", 0], [W("n08", 3.7), "forced", 1.2, "inOut"], [E("n08") - 0.3, "grin", 0.6, "inOut"]], pose: [[0, "give", 0], [E("bea_01"), "relaxed", 0.5]], lips: [[S("bea_01"), "bea_01"]] });
  wxOn(bea, 1.1, W("n08", 3.0), 1.1);
  const bobG = el("g", {}, SET.harbour.chars);
  const finn = mk("harbour", C5.finn, { x: [[0, 640]], y: [[0, 930]], facing: [[0, 1]], mood: [[0, "grin", 0], [W("finn_01", 3.1), "laughing", 0.25, "back"], [E("finn_01") + 0.6, "grin", 0.8, "inOut"]], pose: [[0, "proud", 0], [W("finn_01", 1.4), "shrug", 0.35], [W("finn_01", 3.1), "hipsHands", 0.3]], lips: [[S("finn_01"), "finn_01"]] }, bobG);
  wxOn(finn, 2, W("n09", 2.95), 1.1);
  const kai = mk("site", C5.kai, { x: [[0, 980]], y: [[0, 980]], facing: [[0, -1]], mood: [[0, "content", 0], [W("n10", 2.0), "deadpan", 0.8, "inOut"]], pose: [[0, "proud", 0]], lips: [[S("kai_02"), "kai_02"]] });
  wxOn(kai, 4, W("n10", 2.65), 1.15);
  const youSite = mk("site", C5.you, { x: [[0, 430]], y: [[0, 990]], facing: [[0, 1]], mood: [[0, "hopeful", 0], [W("n10", 2.8), "worried", 0.5]], pose: [[0, "relaxed", 0]] });
  const youBench = mk("bench", C5.you, { x: [[0, 930]], y: [[0, 880]], facing: [[0, 1]], mood: [[0, "sad", 0], [W("n11", 1.2), "tired", 1.2, "inOut"]], pose: [[0, "sitSlump", 0]], look: [[0, { x: 0, y: 0.5 }]] });
  // S05 flashback: Ana says hello to Theo on the bench
  const theoBench = mk("bench", C5.theo, { x: [[0, 1060]], y: [[0, 880]], facing: [[0, -1]], mood: [[0, "sad", 0], [W("n17", 1.4), "surprised", 0.4], [W("n17", 2.4), "content", 0.8, "inOut"]], pose: [[0, "sit", 0]] });
  const anaBench = mk("bench", C5.ana, { x: [[0, 560]], y: [[0, 960]], facing: [[0, 1]], mood: [[0, "happy", 0]], pose: [[0, "wave", 0]] });
  vis(youBench, SC.S03, SC.S04); [theoBench, anaBench].forEach((c) => vis(c, SC.S05, SC.S06));
  // S03 study: a class of 10; their guess (4 clouds) vs reality (6) — in-world instead of a chart
  const tG = W("n12", 1.6), tR = W("n12", 4.4);
  const studs = Array.from({ length: 10 }, (_, i) => { const row = i < 5 ? 0 : 1, x = 560 + (i % 5) * 200 + (row ? 100 : 0) - 60, y = row ? 1010 : 880;
    const c = mk("chalk", X(70 + i), { scale: row ? 1.45 : 1.25, x: [[0, x]], y: [[0, y]], facing: [[0, i % 2 ? -1 : 1]], mood: [[0, ["content", "happy", "grin"][i % 3], 0]], pose: [[0, "relaxed", 0]] });
    const cloudy = [1, 3, 6, 8, 0, 9].indexOf(i); if (cloudy >= 0) wxOn(c, 2.6, (cloudy < 4 ? tG : tR) + (cloudy % 4) * 0.12, row ? 0.85 : 0.75); return c; });
  // ===== S06-S07: café =====
  const tF = S("theo_01") - 0.9, tM = S("mo_01") - 0.6, tK = S("kai_01") - 0.6;
  const theoC = mk("cafe", C5.theo, { x: [[0, -400], [tF, -400], [tF + 1.2, 330, "out"]], y: [[0, 880]], facing: [[0, 1]], pose: [[0, "relaxed", 0], [S("theo_01"), "give", 0.3], [E("theo_01") + 0.6, "relaxed", 0.4]], mood: [[0, "happy", 0]], lips: [[S("theo_01"), "theo_01"]] });
  const moC = mk("cafe", C5.mo, { x: [[0, -500], [tM, -500], [tM + 1.1, 120, "out"]], y: [[0, 900]], facing: [[0, 1]], pose: [[0, "relaxed", 0], [S("mo_01"), "proud", 0.3]], mood: [[0, "grin", 0]], lips: [[S("mo_01"), "mo_01"]] });
  const kaiC = mk("cafe", C5.kai, { x: [[0, -500], [tK, -500], [tK + 1.1, 540, "out"]], y: [[0, 860]], facing: [[0, 1]], pose: [[0, "relaxed", 0], [S("kai_01"), "proud", 0.3], [E("kai_01") + 0.3, "relaxed", 0.4]], mood: [[0, "content", 0]], lips: [[S("kai_01"), "kai_01"]] });
  const youC = mk("cafe", C5.you, { x: [[0, 760]], y: [[0, 900]], facing: [[0, 1]], pose: [[0, "relaxed", 0], [S("n20"), "give", 0.4], [E("n20"), "relaxed", 0.5], [S("n21"), "give", 0.4], [E("n21"), "relaxed", 0.5]],
    mood: [[0, "hopeful", 0], [W("ana_02", 2), "worried", 1.5, "inOut"], [S("n21"), "hopeful", 0.8, "inOut"], [S("theo_01"), "happy", 1, "inOut"], [S("ana_04"), "surprised", 0.4], [W("ana_04", 1.6), "touched", 1.5, "inOut"], [S("n27"), "relieved", 1.2, "inOut"]] });
  const anaMood = [[0, "forced", 0], [W("n20", 0.4), "nervous", 1.8, "inOut"], [S("ana_02"), "worried", 1.2, "inOut"], [W("ana_02", 2.4), "sad", 1.6, "inOut"], [W("ana_02", 4.2), "crying", 1.8, "inOut"],
    [W("n21", 0.3), "sad", 1.4, "inOut"], [S("ana_03"), "nervous", 1.0, "inOut"], [W("theo_01", 0.2), "surprised", 0.35, "back"], [E("theo_01") + 0.1, "touched", 1.6, "inOut"], [E("kai_01"), "relieved", 1.2, "inOut"], [S("n23"), "happy", 1.6, "inOut"],
    [S("n24"), "content", 1.0, "inOut"], [S("ana_04"), "hopeful", 0.8, "inOut"], [S("n27"), "happy", 1.2, "inOut"]];
  const anaC = mk("cafe", C5.ana, { x: [[0, 1180]], y: [[0, 900]], facing: [[0, -1]], mood: anaMood, lips: ["ana_01", "ana_02", "ana_03", "ana_04"].map((i) => [S(i), i]),
    pose: [[0, "wave", 0], [E("ana_01") + 0.3, "relaxed", 0.6], [W("ana_02", 3), "slump", 2, "inOut"], [S("ana_03"), "relaxed", 0.8, "inOut"], [S("theo_01"), "startle", 0.3], [E("theo_01") + 0.4, "relaxed", 0.8, "inOut"], [S("n23"), "hug", 0.9, "inOut"], [S("n24"), "relaxed", 0.8, "inOut"], [S("ana_04"), "give", 0.5]],
    look: [[0, { x: 0, y: 0 }], [W("ana_02", 3), { x: 0.2, y: 0.6 }], [S("ana_03"), { x: 0, y: 0 }], [S("theo_01"), { x: 0.6, y: -0.1 }], [S("n24"), { x: 0, y: 0 }]] });
  const anaLv = [[0, 4], [S("ana_03"), 4], [E("ana_03") + 0.2, 3.6], [E("theo_01") + 0.5, 3.1], [E("mo_01") + 0.3, 2.6], [E("kai_01") + 0.2, 2.2], [S("n23"), 2.2], [W("n23", 1.6), 1.3]];
  wxOn(anaC, anaLv, SC.S06 + 0.2, 1.35);
  const youCW = wxOn(youC, 1.2, S("n27") + 0.2, 1.2);
  const anaCW = WXS[WXS.length - 2].w; anaCW.long = 1;
  // ===== S07: the reflection =====
  const youRef = mk("reflect", C5.you, { x: [[0, 980]], y: [[0, 1330]], scale: 3.2, facing: [[0, -1]], opacity: [[0, 0], [W("n25", 0.4), 0], [W("n25", 1.3), 0.78]], mood: [[0, "surprised", 0], [W("n26", 1.0), "touched", 2.0, "inOut"], [E("n26"), "relieved", 1.0]], pose: [[0, "relaxed", 0]] });
  wxOn(youRef, 1.25, W("n25", 1.4), 2.0, 20);
  // ===== S08: Nia =====
  const nia = mk("host", C5.nia, { x: [[0, 880]], y: [[0, 1180]], scale: 2.7, facing: [[0, 1]], lips: [[S("n28"), "n28"]], mood: [[0, "content", 0], [W("n28", 1.8), "hopeful", 0.8, "inOut"], [W("n28", 6.7), "touched", 1.0, "inOut"], [W("n28", 9.7), "happy", 0.8, "inOut"]],
    pose: [[0, "relaxed", 0], [W("n28", 2.2), "give", 0.4], [W("n28", 4.6), "shrug", 0.4], [W("n28", 6.4), "relaxed", 0.5], [W("n28", 8.5), "hug", 0.6], [W("n28", 10.0), "proud", 0.5]] });

  // ---------------- camera shots: [t, set, cam, cam2?]  cam = [cx, cy, z] or {who, z, dy} ----------------
  const F = (c, z, dy = 0, dx = 0) => ({ who: c, z, dy, dx });
  const SH = [
    [0, "square", [960, 560, 1.0], [960, 580, 1.08]], [W("n01", 1.1), "square", F(sq[2], 2.2, -40)], [S("n02"), "square", [960, 560, 1.0], [960, 520, 1.12]], [W("n02", 1.9), "square", F(sq[0 + 5], 2.3, -60)],
    [SC.S02, "bedroom", [900, 540, 1.25], [930, 520, 1.4]], [W("n03", 2.15), "street", [960, 520, 1.0]], [W("n04", 0), "street", F(stRow[0], 2.1, -120)], [W("n04", 1.8), "street", F(stRow[1], 2.1, -120)], [W("n04", 2.45), "street", F(stRow[2], 2.1, -120)], [W("n04", 2.85), "street", F(stRow[3], 2.1, -120)], [W("n04", 4.4), "street", F(stRow[3], 2.2, -40), F(stRow[3], 3.0, -20)],
    [SC.S02 + 0, null], [S("n05"), "street", [960, 540, 1.0]],
    [S("str_01") - 0.2, "street", [1000, 540, 1.05]], [W("str_01", 0.9), "street", F(strG, 2.1, -110)], [S("n06"), "street", F(youSt, 2.3, -60)], [W("n06", 0.8), "street", [1100, 540, 1.1]],
    [SC.S03, "square", F(sq[3], 1.9, -60)], [W("n07", 0.7), "square", F(sq[7], 2.0, -60)], [W("n07", 1.4), "square", F(sq[9], 2.0, -60)],
    [S("bea_01") - 0.1, "bakery", [860, 560, 1.05], [860, 520, 1.25]], [W("n08", 3.6), "bakery", F(bea, 2.1, -110)],
    [S("finn_01") - 0.1, "harbour", [800, 560, 1.0], [760, 520, 1.25]], [W("finn_01", 3.0), "harbour", F(finn, 2.2, -60)], [S("n09"), "harbour", [900, 540, 1.0], [900, 520, 1.1]],
    [S("kai_02") - 0.1, "site", [720, 560, 1.05]], [S("n10"), "site", F(kai, 1.6, -60), F(kai, 2.1, -110)],
    [S("n11"), "bench", [960, 560, 1.0], [960, 520, 1.35]], [S("n12"), "chalk", [960, 560, 1.0], [960, 600, 1.1]],
    [SC.S04, "street", F(youSt, 2.3, -50)], [S("n14"), "street", F(theoSt, 1.9, -90)], [W("n14", 2.7), "hidden", [960, 540, 1.0]], [S("n15"), "feed", [960, 540, 1.0], [960, 460, 1.25]], [W("n15", 1.2), "street", [960, 540, 1.0]],
    [SC.S05, "square", [800, 600, 1.15]], [S("n17"), "bench", [800, 580, 1.2], [800, 560, 1.32]], [W("n17", 3.9), "square", [1400, 600, 1.5]],
    [S("n18"), "square", F(anaSq, 1.75, -170), F(anaSq, 1.45, -190)],
    [SC.S06, "cafe", [980, 600, 1.3]], [S("ana_01") - 0.05, "cafe", F(anaC, 2.3, -40)], [S("n20"), "cafe", F(youC, 2.0, -40)], [W("n20", 1.4), "cafe", [980, 600, 1.3]], [S("ana_02") - 0.05, "cafe", F(anaC, 2.3, -40), F(anaC, 2.65, -20)],
    [S("n21"), "cafe", [980, 600, 1.3]], [S("ana_03") - 0.05, "cafe", F(anaC, 2.3, -40)], [S("theo_01") - 0.95, "cafe", [860, 560, 0.92]], [S("mo_01") - 0.05, "cafe", [700, 520, 1.25]], [S("kai_01") - 0.05, "cafe", [860, 560, 0.92]],
    [S("n22"), "cafe", [860, 560, 0.92]], [S("n23"), "cafe", F(anaC, 2.0, -60), F(anaC, 2.3, -60)],
    [SC.S07, "cafe", [980, 600, 1.3]], [S("ana_04") - 0.05, "cafe", F(anaC, 2.4, -40)], [S("n25"), "reflect", [960, 560, 1.0], [960, 500, 1.15]], [S("n26"), "reflect", [960, 470, 1.25], [960, 440, 1.45]], [S("n27"), "cafe", [980, 560, 1.35], [980, 540, 1.45]],
    [SC.S08, "host", F(nia, 1.3, 200, 80), F(nia, 1.45, 190, 60)], [S("n29") - 0.1, "square", [960, 580, 1.25], [960, 560, 1.0]],
  ].filter((s) => s[1]).sort((a, b) => a[0] - b[0]);
  let CUR = SH[0];
  function camAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1][0]) i++; CUR = SH[i]; const t0 = SH[i][0], t1 = i + 1 < SH.length ? SH[i + 1][0] : D;
    const res = (c) => { if (Array.isArray(c)) return c; const r = c.who.__r || { headX: 960, headY: 400 }; return [r.headX + (c.dx || 0), r.headY + (c.dy || 0), c.z]; };
    const A = res(SH[i][2]), B = SH[i][3] ? res(SH[i][3]) : A, k = K.sm(t0, t1, t) * (SH[i][3] ? 1 : 0); const z = lerp(A[2], B[2], k) * (1 + 0.01 * (t - t0));
    return { set: SH[i][1], tf: `translate(960,540) scale(${z.toFixed(4)}) translate(${(-lerp(A[0], B[0], k)).toFixed(1)},${(-lerp(A[1], B[1], k)).toFixed(1)})` }; }

  // ---------------- HUD ----------------
  const counter = K.counter(hud, "CLOUDS SEEN");
  const cntKeys = [[SC.S03, 4], [W("n07", 0.7), 6], [W("n07", 1.4), 8], [W("n08", 3.05), 9], [W("n09", 3.0), 10], [W("n10", 2.7), 11], [E("n10") + 0.2, 11]];
  const rules = K.rules(hud), src1 = K.source(hud, "Jordan et al. (2011), Personality and Social Psychology Bulletin"), src2 = K.source(hud, "Flynn & Lake (2008), Journal of Personality and Social Psychology");
  const link = el("g", {}, hud); el("rect", { x: 400, y: 930, width: 1120, height: 96, rx: 20, fill: "rgba(30,27,34,0.85)" }, link);
  el("text", { x: 960, y: 997, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 48, fill: "#FFE3A0" }, link).textContent = "LOWER GUESS → LONELIER  (a link, not proof)"; link.querySelector("text").setAttribute("y", 995);
  const lblG = K.tag(hud, "THEIR GUESS", { fs: 46, bg: "#FFC93C", fg: "#1E1B22" }), lblR = K.tag(hud, "REALITY: MORE", { fs: 46, bg: "#7EC8F2", fg: "#1E1B22" }); lblG.setAttribute("transform", "translate(560,330)"); lblR.setAttribute("transform", "translate(1360,330)");
  const day = K.tag(hud, "30 DAYS OF HELLO", { fs: 40, bg: "#FFC93C", fg: "#1E1B22" }); day.setAttribute("transform", "translate(960,90)");
  const youTag = K.tag(world, "YOU", { fs: 32 });
  // ask infographic (n22): guessed ~20 asks vs needed ~10
  const ask = el("g", {}, hud); el("rect", { x: 260, y: 170, width: 1400, height: 700, rx: 34, fill: "#FFF6E3", stroke: "#1E1B22", "stroke-width": 8 }, ask);
  const askT = (x, y, s, fs, fill = "#1E1B22") => { const e = el("text", { x, y, "font-family": "Outfit", "font-weight": 900, "font-size": fs, fill }, ask); e.textContent = s; return e; };
  askT(320, 270, "ASKS NEEDED TO GET 5 YESES", 50); askT(320, 400, "THEY GUESSED", 40, "#C8553D"); askT(320, 640, "IT TOOK", 40, "#2F6F73"); el("rect", { x: 260, y: 170, width: 1400, height: 700, rx: 34, fill: "none" }, ask);
  const heads = []; for (let r = 0; r < 2; r++) for (let i = 0; i < (r ? 10 : 20); i++) { const g = el("g", { transform: `translate(${680 + i * 46},${r ? 640 : 400})` }, ask); el("circle", { cy: -26, r: 15, fill: r ? "#3FA7A0" : "#E8834A", stroke: "#1E1B22", "stroke-width": 3 }, g); el("path", { d: "M-18,16 Q-18,-6 0,-6 Q18,-6 18,16 Z", fill: r ? "#3FA7A0" : "#E8834A", stroke: "#1E1B22", "stroke-width": 3 }, g); heads.push([g, r, i]); }
  const n20 = askT(320, 480, "~20", 64, "#C8553D"), n10 = askT(320, 720, "~10", 64, "#2F6F73");
  // grade + vignette
  const grade = el("rect", { x: 0, y: 0, width: 1920, height: 1080, style: "mix-blend-mode:multiply", "pointer-events": "none" }, svg);
  const glow = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "url(#warm7)", opacity: 0, style: "mix-blend-mode:screen" }, svg);
  const g0 = el("radialGradient", { id: "warm7", cx: "60%", cy: "35%", r: "75%" }, svg.querySelector("defs")); el("stop", { offset: 0, "stop-color": "#FFD27A", "stop-opacity": 0.5 }, g0); el("stop", { offset: 1, "stop-color": "#FFD27A", "stop-opacity": 0 }, g0);
  const vign = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "url(#vig7)", "pointer-events": "none" }, svg);
  const v0 = el("radialGradient", { id: "vig7", cx: "50%", cy: "50%", r: "72%" }, svg.querySelector("defs")); el("stop", { offset: 0.6, "stop-color": "#140E1E", "stop-opacity": 0 }, v0); el("stop", { offset: 1, "stop-color": "#140E1E", "stop-opacity": 0.55 }, v0);
  const flash = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#FFFFFF", opacity: 0, "pointer-events": "none" }, svg);
  // grade: amount of cold (0 neutral .. 1 storm-blue) and warmth
  const coldK = [[0, 0.1], [tStorm, 0.1], [tStorm + 0.4, 0.35], [SC.S02, 0.0], [SC.S03, 0.12], [SC.S04, 0.15], [S("n18"), 0.15], [W("n18", 0.7), 0.6], [SC.S06, 0.45], [W("ana_02", 4), 0.6], [S("ana_03"), 0.45], [E("kai_01"), 0.15], [S("n23"), 0.05], [SC.S07, 0.05], [SC.S08, 0], [D, 0]];
  const warmK = [[0, 0], [E("kai_01") - 1, 0], [E("kai_01") + 1, 0.8], [SC.S07, 0.5], [S("n27"), 0.9], [SC.S08, 0.4], [tClose, 0.4], [tClose + 3, 0.9], [D, 0.9]];
  const roomMood = [[0, 0], [S("ana_03"), 0], [E("kai_01") + 0.5, 0.8], [S("n23"), 1], [D, 1]];

  function draw(t) {
    // pass 1: update every character on the active set (we need positions for the follow-cam)
    const cam0 = camAt(t), active = cam0.set;
    for (const k in SET) SET[k].g.setAttribute("display", k === active ? "inline" : "none");
    ALL.forEach((c) => { const on = c.setKey === active && (!c.__vis || (t >= c.__vis[0] && t < c.__vis[1])); c.g.setAttribute("display", on ? "inline" : "none"); if (on) c.__r = c.update(t); });
    const cam = camAt(t); world.setAttribute("transform", cam.tf);
    SET[active].update(t, active === "cafe" ? K.track(roomMood, t) : active === "square" ? 1 - 0.6 * K.sm(W("n18", 0.6), W("n18", 1.6), t) * (1 - K.sm(SC.S06 - 0.1, SC.S06, t)) : 1,
      active === "chalk" ? { g: K.sm(W("n12", 1.5), W("n12", 2.3), t), r: K.sm(W("n12", 4.2), W("n12", 5.0), t), low: K.sm(W("n12", 5.6), W("n12", 6.0), t) }
        : active === "hidden" ? { show: K.sm(W("n14", 2.8), W("n14", 3.8), t), h: K.sm(W("n14", 5.2), W("n14", 6.0), t) } : active === "feed" ? { scroll: K.sm(S("n15"), W("n15", 1.2), t) } : undefined);
    if (active === "harbour") bobG.setAttribute("transform", `translate(0,${(SET.harbour.boat.__bob || 0).toFixed(2)})`);
    // weather icons
    WXS.forEach((o) => { const on = o.c.setKey === active && o.c.g.getAttribute("display") !== "none"; o.w.g.setAttribute("display", on ? "inline" : "none"); if (!on) return;
      const r = o.c.__r, sc = (o.c.spec.scale || 2), pop = clamp((t - o.pop) / 0.45, 0, 1), lv = K.track(o.lv, t);
      if (o.w.long) o.w.setLong(clamp((t - o.pop - 0.3) / 0.6, 0, 1), t, o.k);
      o.w.g.setAttribute("transform", `translate(${r.headX.toFixed(1)},${(r.headY - 108 * sc / 2 * 1.0 - 70 * o.k + o.dy + Math.sin(t * 2.1 + o.pop) * 4).toFixed(1)})`); o.w.set(lv, t, o.k, pop); });
    // Theo's sun on a stick (covers the storm)
    { const on = active === "street" && t > W("n14", 0.9) && t < W("n14", 2.7); sunStick.setAttribute("display", on ? "inline" : "none");
      if (on) { const r = theoSt.__r; sunStick.setAttribute("transform", `translate(${r.handX.toFixed(1)},${(r.handY - 160).toFixed(1)})`); ss.set(0, t, 1.6, clamp((t - W("n14", 1.0)) / 0.4, 0, 1)); } }
    // YOU tag
    { const youOn = ALL.find((c) => C5.you === undefined ? false : c.setKey === active && c.spec.color === C5.you.color && c.g.getAttribute("display") !== "none" && c !== youRef);
      youTag.setAttribute("display", youOn && !(cam.set === "cafe" && CUR[2].who === anaC) ? "inline" : "none"); if (youOn) youTag.setAttribute("transform", `translate(${youOn.__r.headX.toFixed(1)},${(youOn.__r.headY - 130 * (youOn.spec.scale || 2) / 2).toFixed(1)})`); }
    // HUD
    const cn = Math.round(K.track(cntKeys, t)), cop = 0; counter.set(cn, cop, Math.max(0, 1 - Math.min(...cntKeys.map(([k]) => Math.abs(t - k) * 5))));
    rules.set(K.win(t, S("n05"), E("n05") + 0.3, 0.35, 0.35), [W("n05", 1.0), W("n05", 3.3), W("n05", 4.6)].map((a) => clamp((t - a) / 0.4, 0, 1)));
    src1.setAttribute("opacity", Math.max(K.win(t, S("n12"), E("n12") + 0.3), K.win(t, W("n14", 2.7), E("n14") + 0.3)).toFixed(3));
    src2.setAttribute("opacity", K.win(t, S("n22"), E("n22") + 0.3).toFixed(3));
    link.setAttribute("opacity", K.win(t, W("n12", 6.6), E("n12") + 1.0).toFixed(3)); lblG.setAttribute("opacity", K.win(t, tG - 0.1, E("n12") + 0.4).toFixed(3)); lblR.setAttribute("opacity", K.win(t, tR - 0.1, E("n12") + 0.4).toFixed(3)); day.setAttribute("opacity", K.win(t, S("n17"), W("n17", 3.9)).toFixed(3));
    { const a = K.win(t, S("n22"), E("n22") + 0.2, 0.35, 0.35); ask.setAttribute("opacity", a.toFixed(3)); heads.forEach(([g, r, i]) => { const t0 = r ? W("n22", 6.3) + i * 0.05 : W("n22", 2.9) + i * 0.04; g.setAttribute("opacity", clamp((t - t0) / 0.2, 0, 1).toFixed(2)); });
      n20.setAttribute("opacity", K.sm(W("n22", 3.9), W("n22", 4.2), t).toFixed(2)); n10.setAttribute("opacity", K.sm(W("n22", 7.0), W("n22", 7.3), t).toFixed(2)); }
    // grade
    const cold = K.track(coldK, t), warm = K.track(warmK, t); grade.setAttribute("fill", K.mix("#FFFFFF", "#8FA2C8", cold)); glow.setAttribute("opacity", (warm * 0.8).toFixed(3));
    vign.setAttribute("opacity", (0.6 + 0.4 * cold).toFixed(3));
    flash.setAttribute("opacity", (Math.max(0, 1 - Math.abs(t - W("n18", 0.65)) * 6) * 0.35 + (t > SC.S05 && t < SC.S06 && cam.set === "bench" ? 0 : 0)).toFixed(3));
  }
  // footsteps for the mix: sample every walking character on its active set
  if (window.__WANT_FOLEY) { const ev = []; const last = new Map();
    for (let f = 0; f < D * 60; f++) { const t = f / 60, set = camAt(t).set; ALL.forEach((c) => { if (c.setKey !== set) return; const r = c.update(t); const p = last.get(c); if (p != null && r.step !== p && r.walk > 0.2) ev.push({ t, set, x: r.footX }); last.set(c, r.step); }); }
    window.__FOLEY = ev; }
  const tl = gsap.timeline({ paused: true }); SR.drive(tl, D, draw); window.__timelines["main"] = tl;
  window.__EP7 = { SH, camAt, ALL };
})();
