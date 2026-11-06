/* Paper style test: Ep7 cold open rebuilt with "something every second". Line clock in window.DT = {id:[start,dur]}, window.DUR. */
(function () {
  const { el, clamp, lerp } = SR, K = window.PK, T = window.DT, D = window.DUR, S = (i) => T[i][0], E = (i) => T[i][0] + T[i][1];
  const svg = document.getElementById("ov"); const svgDefs = el("defs", {}, svg);
  const skyG = el("g", {}, svg), midG = el("g", {}, svg), world = el("g", {}, svg), back = el("g", {}, world), walkers = el("g", {}, world), chars = el("g", {}, world), wx = el("g", {}, world), frontG = el("g", {}, svg), front = el("g", {}, frontG);
  const set = K.square(back, front, { sky: skyG, mid: midG }); const birds = K.birds(skyG, 4);
  const ANA = { skin: "#9A6440", shirt: "#3FA7A0", pants: "#2E5A74", shoes: "#F2EDE4", hair: "#2A1A14", hairStyle: "bun", seed: 5, body: "slim" }, YOU = { skin: "#E3AE85", shirt: "#6C5CE7", pants: "#2E3A5A", shoes: "#F2EDE4", hair: "#1E1B22", hairStyle: "short", seed: 51 };
  const X = (i) => { const r = SR.mulberry32(100 + i * 7), pk = (a) => a[Math.floor(r() * a.length)]; return { skin: pk(["#F6D2B4", "#E3AE85", "#C98B5E", "#B07448", "#7A4A32"]), shirt: pk(["#E8834A", "#F2C14E", "#5E9E5A", "#D85A8A", "#4F7FB0", "#7B6BB0"]), pants: pk(["#3A4A63", "#5A4E44", "#2E5A74"]), shoes: "#3B3446", hair: pk(["#1E1B22", "#6A4A3A", "#C79A5A"]), hairStyle: pk(["short", "curly", "ponytail", "long", "afro", "spiky", "cap"]), seed: 30 + i, body: pk(["avg", "round", "broad", "slim", "lanky"]) }; };
  const stranger = { skin: "#E3AE85", shirt: "#4F7FB0", pants: "#5A4E44", shoes: "#3B3446", hair: "#6A4A3A", hairStyle: "short", seed: 77, body: "round" };
  const tStormAna = S("ana_01") + 0.72, tCrowd = S("n01"), tCard = S("n02") + T.n02[1] - 0.15, tStr = S("str_01") - 0.9, tCrumble = S("c1") - 0.1, tLift = S("c3") + 0.15, tTitle = S("c4") - 0.15;
  // cast
  const ana = SR.Paper(chars, Object.assign({}, ANA, { scale: 1.9, x: [[0, 1180]], y: [[0, 960]], facing: [[0, -1]], noWalk: true, lips: [[S("ana_01"), "ana_01"]],
    mood: [[0, "grin", 0], [tStormAna + 0.1, "forced", 0.5], [tCrumble, "nervous", 1.0], [tCrumble + 1.0, "sad", 1.0], [tCrumble + 2.0, "crying", 1.2], [tLift + 0.2, "surprised", 0.3, "back"], [tLift + 0.8, "relieved", 1.0], [tLift + 1.5, "happy", 0.8]],
    pose: [[0, "wave", 0], [E("ana_01") + 0.4, "relaxed", 0.6], [tCrumble + 0.6, "slump", 1.6], [tLift + 0.3, "relaxed", 0.8]], squash: [[tStormAna, 0.14], [tCrumble + 2.0, 0.08]], hop: [[0.15, 14], [tLift + 1.5, 16]], look: [[0, { x: 0, y: 0 }], [tCrumble + 1, { x: 0.3, y: 0.6 }], [tLift + 0.2, { x: 0, y: -0.2 }]] }));
  const you = SR.Paper(chars, Object.assign({}, YOU, { scale: 1.9, x: [[0, 700], [tLift - 0.5, 700], [tLift + 0.2, 830, "out"]], y: [[0, 960]], facing: [[0, 1]], noWalk: true,
    mood: [[0, "happy", 0], [tStormAna + 0.15, "shock", 0.25, "back"], [tStormAna + 1.0, "worried", 0.8], [tStr + 1.2, "skeptic", 0.5], [S("n06"), "deadpan", 0.4], [tCrumble + 0.8, "worried", 1.0], [tLift, "hopeful", 0.6], [tLift + 1.2, "happy", 0.8]],
    pose: [[0, "relaxed", 0], [tStormAna + 0.15, "flinch", 0.18, "back"], [tStormAna + 1.2, "relaxed", 0.8], [S("n06"), "crossed", 0.4], [E("n06") + 0.2, "relaxed", 0.5], [tCrumble + 1.0, "leanIn", 1.0], [tLift - 0.2, "give", 0.5]], squash: [[tStormAna + 0.1, 0.12]], hop: [[tLift + 1.3, 18]], look: [[0, { x: 0.2, y: 0 }]] }));
  const crowd = [[-120, 1.5], [220, 1.55], [470, 1.45], [1500, 1.5], [1760, 1.55], [2020, 1.45], [60, 1.9], [2150, 1.9]].map(([x, k], i) => SR.Paper(chars, Object.assign({}, X(i), { scale: k, x: [[0, x]], y: [[0, i > 5 ? 1040 : 950]], facing: [[0, x < 960 ? 1 : -1]], noWalk: true, mood: [[0, ["grin", "happy", "cheeky", "content"][i % 4], 0]],
    pose: [0, 1, 2, 3, 4, 5, 6, 7].map((j) => [j * 2.4 + (i * 0.7) % 2.4, ["wave", "relaxed", "proud", "hipsHands", "cheer", "relaxed", "wave", "think"][(i + j) % 8], 0.35, "back"]),
    squash: [[tCrowd + 0.5 + i * 0.22, 0.1]], hop: [[0.6 + i * 0.9, 10], [9 + i * 0.5, 8]] })));
  const bgWalk = [[-300, 2300, 0.9, 1], [2300, -300, 1.0, -1]].map(([a, b, k, f], i) => SR.Paper(walkers, Object.assign({}, X(20 + i), { scale: k, x: [[0, a], [D, b, "lin"]], y: [[0, 860]], facing: [[0, f]], mood: [[0, "content", 0]], pose: [[0, "relaxed", 0]] })));
  const str = SR.Paper(chars, Object.assign({}, stranger, { scale: 1.9, x: [[0, 2300], [tStr, 2300], [tStr + 1.1, 1240, "out"], [E("n06") - 0.3, 1240], [E("n06") + 1.1, 2400, "in"]], y: [[0, 960]], facing: [[0, -1], [E("n06") - 0.2, 1]], lips: [[S("str_01"), "str_01"]], mood: [[0, "grin", 0], [S("str_01") + 1.0, "forced", 0.4]], hop: [[S("str_01") + 0.3, 22]], squash: [[tStr + 0.9, 0.1]], pose: [[0, "relaxed", 0], [S("str_01") + 0.3, "wave", 0.3], [E("str_01") + 0.2, "relaxed", 0.5]] }));
  // weather
  const W = []; const wxOn = (c, lv, pop, k, dy = 0) => { const w = K.weather(wx, W.length + 1); W.push({ w, c, lv, pop, k, dy }); return w; };
  wxOn(ana, [[0, 4], [tLift + 0.2, 4], [tLift + 1.6, 2.2], [tTitle, 1.4]], tStormAna, 1.5, -20); wxOn(str, [[0, 4]], tStr + 0.9, 1.3);
  crowd.forEach((c, i) => wxOn(c, [[0, [4, 3, 1, 4, 2, 4, 3, 1][i]]], tCrowd + 0.5 + i * 0.22, 1.1));
  wxOn(you, [[0, 1.3]], tTitle + 0.2, 1.2);
  const youTag = K.tag(world, "YOU", { fs: 34 }), bub = K.bubble(world, "Doing great!", { fs: 36 });
  // cards + grade
  const card1 = K.card(svg, ["THEY'RE", "NOT."], { fs: 190 }), title = K.card(svg, ["WHAT IF YOU COULD SEE", "EVERYONE'S", "INNER WEATHER?"], { fs: 110, bg: "#2B2140", fg: "#FFE3A0" });
  const grade = el("rect", { x: 0, y: 0, width: 1920, height: 1080, style: "mix-blend-mode:multiply", "pointer-events": "none" }, svg), flash = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#fff", opacity: 0, "pointer-events": "none" }, svg);
  const titleWx = [0, 1, 2, 3].map((i) => K.weather(svg, 40 + i));
  const caps = K.captions(svg, window.CAPS || []); const qTag = K.tag(svg, "WHO'S ACTUALLY FINE?", { fs: 54, bg: "#FFD84A", fg: "#1a1512" }); const tQ = tCrowd + 1.9;
  const grain = SR.paperGrain(svg);
  // camera: snap zooms + pushes; "something every second"
  const F = (c, z, dy = 0, dx = 0) => ({ who: c, z, dy, dx });
  const shots = [[0, F(ana, 2.4, 20, -20), F(ana, 2.7, 10, -20)], [tStormAna + 0.12, F(ana, 1.5, -40, -10)], [tStormAna + 0.75, F(you, 2.6, 20, 30)], [tCrowd + 0.3, [960, 600, 0.95], [960, 580, 1.05]], [tCrowd + 1.9, [300, 500, 1.4], [420, 500, 1.32], "lin"], [tCrowd + 3.0, [1650, 500, 1.4], [1560, 500, 1.32], "lin"], [tCrowd + 4.0, [960, 620, 1.0]],
    [tCard + 0.9, [1050, 620, 1.2]], [S("str_01") + 0.2, F(str, 2.1, -60, -20)], [S("str_01") + 1.5, F(str, 1.8, -140, -30), F(str, 2.0, -140, -30)], [S("n06"), F(you, 2.8, 20, 40)], [tCrumble, F(ana, 1.8, -110, -10), F(ana, 2.4, -60, -10)], [tLift - 0.3, [990, 540, 1.08]], [tLift + 1.3, [990, 540, 1.08], [990, 520, 1.16]]];
  const cam = K.camera(shots, D); const res = (c) => Array.isArray(c) ? c : [c.who.joints.headX + (c.dx || 0), c.who.joints.headY + (c.dy || 0), c.z];
  const coldK = [[0, 0.05], [tStormAna, 0.05], [tStormAna + 0.3, 0.35], [tCrowd + 1, 0.3], [tCrumble, 0.35], [tCrumble + 2, 0.6], [tLift + 0.6, 0.6], [tLift + 1.8, 0.0], [D, 0]];
  function draw(t) {
    bgWalk.forEach((c) => c.update(t));
    [you, ana, str, ...crowd].forEach((c) => { const on = !(c === str && (t < tStr - 0.1 || t > E("n06") + 1.2)); c.g.setAttribute("display", on ? "inline" : "none"); if (on) c.update(t); });
    const shake = Math.max(0, 1 - (t - tStormAna) * 2.5) * (t >= tStormAna ? 1 : 0) + Math.max(0, 1 - (t - tCrumble - 2.0) * 3) * (t >= tCrumble + 2.0 ? 0.4 : 0);
    const C = cam.at(t, res, shake); skyG.setAttribute("transform", C.tf(0.25)); midG.setAttribute("transform", C.tf(0.65)); world.setAttribute("transform", C.tf(1)); frontG.setAttribute("transform", C.tf(1.18)); birds(t); set.update(t, 1 - 0.7 * K.sm(tCrumble, tCrumble + 2, t) * (1 - K.sm(tLift + 0.6, tLift + 1.8, t)));
    W.forEach((o) => { const J = o.c.joints, on = o.c.g.getAttribute("display") !== "none"; o.w.g.setAttribute("display", on ? "inline" : "none"); if (!on) return; const pop = clamp((t - o.pop) / 0.4, 0, 1), lv = SR.sampleTrack(o.lv, t, o.lv[0][1]);
      o.w.g.setAttribute("transform", `translate(${J.headX.toFixed(1)},${(J.headY - J.headR - 110 * o.k + o.dy + Math.sin(t * 2.1 + o.pop) * 4).toFixed(1)})`); o.w.set(lv, t, o.k, pop); });
    const cur = cam.cur(); const anaClose = cur[1] && cur[1].who === ana; youTag.setAttribute("display", anaClose ? "none" : "inline"); youTag.setAttribute("transform", `translate(${you.joints.headX.toFixed(1)},${(you.joints.headY - you.joints.headR - 40).toFixed(1)})`);
    const bk = K.win(t, S("str_01") + 0.9, E("str_01") + 0.3, 0.15, 0.2); bub.setAttribute("opacity", bk.toFixed(2)); bub.setAttribute("transform", `translate(${(str.joints.headX - 230).toFixed(1)},${(str.joints.headY - 60).toFixed(1)}) scale(${K.back(bk).toFixed(3)})`);
    caps(t); const qk = K.win(t, tQ, tCard - 0.05, 0.12, 0.15); qTag.setAttribute("opacity", qk.toFixed(2)); qTag.setAttribute("transform", `translate(960,120) scale(${(0.6 + 0.4 * K.back(clamp((t - tQ) / 0.3, 0, 1))).toFixed(3)}) rotate(-3)`);
    card1.set(K.win(t, tCard, tCard + 0.95, 0.04, 0.12), clamp((t - tCard) / 0.5, 0, 1)); title.set(K.win(t, tTitle, D, 0.15, 0.4), clamp((t - tTitle) / 0.8, 0, 1));
    { const tk = K.win(t, tTitle + 0.3, D, 0.2, 0.4); titleWx.forEach((w, i) => { const ang = t * 0.9 + i * Math.PI / 2, x = 960 + Math.cos(ang) * 640, y = 540 + Math.sin(ang) * 330; w.g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})`); w.set([0, 2, 4, 1][i], t, 1.7, clamp((t - tTitle - 0.3 - i * 0.12) / 0.4, 0, 1) * tk); }); }
    grade.setAttribute("fill", K.mix("#FFFFFF", "#8FA2C8", SR.sampleTrack(coldK, t, 0))); flash.setAttribute("opacity", (Math.max(0, 1 - Math.abs(t - tStormAna) * 8) * 0.5).toFixed(2));
    if (window.__QA) { const iss = []; [you, ana, str].forEach((c) => { if (c.g.getAttribute("display") !== "none") c.check(960).forEach((m) => iss.push(`${t.toFixed(2)} ${c.spec.seed}: ${m}`)); }); window.__QA.push(...iss); }
  }
  const tl = gsap.timeline({ paused: true }); SR.drive(tl, D, draw); window.__timelines["main"] = tl; window.__SCENE = { draw, ana, you, str, crowd, shots, marks: { tStormAna, tCrowd, tCard, tStr, tCrumble, tLift, tTitle } };
})();
