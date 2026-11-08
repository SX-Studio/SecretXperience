/* v5 demo: the "ask twice" beat (Ep7 S06) with v5 bodies, blendable faces drifting through the story, acted voices, inner weather + scene grade */
(function () {
  const { el, clamp, lerp, sampleTrack } = SR, T = window.DT, D = window.DUR, S = (id) => T[id][0], E = (id) => T[id][0] + T[id][1];
  const svg = document.getElementById("ov"); TS.defs(svg);
  const sm = (a, b, t) => { const u = clamp((t - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  // ---- set: a small island café corner, window to the sky ----
  const world = el("g", {}, svg), set = el("g", {}, world);
  const wall = el("rect", { x: -400, y: -200, width: 2720, height: 1100, fill: "#E9D9BE" }, set);
  el("rect", { x: -400, y: 760, width: 2720, height: 600, fill: "#B98A5E" }, set); el("rect", { x: -400, y: 752, width: 2720, height: 16, fill: "#8E6440" }, set);
  for (let i = 0; i < 14; i++) el("line", { x1: -400 + i * 200, y1: 768, x2: -520 + i * 230, y2: 1300, stroke: "#A97C52", "stroke-width": 4 }, set);
  const win = el("g", { transform: "translate(1180,120)" }, set), sky = el("rect", { x: 0, y: 0, width: 520, height: 400, fill: "#8C98A8" }, win);
  const sun = el("circle", { cx: 380, cy: 110, r: 54, fill: "#FFD84A", opacity: 0 }, win);
  const clouds = el("path", { d: "M40,190 C20,190 20,160 46,160 C50,130 96,126 108,150 C120,124 170,130 168,160 C196,158 200,190 176,190 Z M250,120 C232,120 232,96 254,96 C258,72 296,70 306,92 C318,70 360,76 356,100 C380,100 382,120 362,120 Z", fill: "#6E7686" }, win);
  el("rect", { x: 0, y: 0, width: 520, height: 400, fill: "none", stroke: "#6B4A34", "stroke-width": 22 }, win); el("path", { d: "M260,0 L260,400 M0,200 L520,200", stroke: "#6B4A34", "stroke-width": 14 }, win);
  el("rect", { x: -20, y: 400, width: 560, height: 26, rx: 6, fill: "#8E6440" }, win);
  // plant + counter for depth
  el("rect", { x: 120, y: 470, width: 360, height: 300, rx: 10, fill: "#C9875A", stroke: "#1E1B22", "stroke-width": 5 }, set); el("rect", { x: 100, y: 450, width: 400, height: 34, rx: 8, fill: "#7A4E32", stroke: "#1E1B22", "stroke-width": 5 }, set);
  el("path", { d: "M1760,760 L1800,640 L1880,640 L1920,760 Z", fill: "#D8774A", stroke: "#1E1B22", "stroke-width": 5 }, set);
  [[1840, 640, -30], [1840, 640, 10], [1840, 640, 40], [1840, 640, -60]].forEach(([x, y, a]) => el("path", { d: `M${x},${y} q-10,-80 ${a},-150 q20,60 ${-a / 3},150`, fill: "#5E9E5A", stroke: "#1E1B22", "stroke-width": 4 }, set));
  // ---- cast (v5) ----
  const C = (k, o) => SR.Character(world, Object.assign({}, CAST5[k], { id: k, scale: 2.05, noWalk: false, look: [[0, { x: 0, y: 0 }]] }, o));
  const tF = S("theo_01") - 0.9, tM = S("mo_01") - 0.6, tK = S("kai_01") - 0.6;
  const theo = C("theo", { x: [[0, -400], [tF, -400], [tF + 0.9, 330, "out"]], y: [[0, 880]], facing: [[0, 1]], pose: [[0, "relaxed", 0], [S("theo_01"), "give", 0.3], [E("theo_01") + 0.6, "relaxed", 0.4]], mood: [[0, "happy", 0]], lips: [[S("theo_01"), "theo_01"]] });
  const mo = C("mo", { x: [[0, -500], [tM, -500], [tM + 0.8, 120, "out"]], y: [[0, 900]], facing: [[0, 1]], pose: [[0, "relaxed", 0], [S("mo_01"), "proud", 0.3]], mood: [[0, "grin", 0]], lips: [[S("mo_01"), "mo_01"]] });
  const kai = C("kai", { x: [[0, -500], [tK, -500], [tK + 0.8, 520, "out"]], y: [[0, 860]], facing: [[0, 1]], pose: [[0, "relaxed", 0], [S("kai_01"), "proud", 0.3], [E("kai_01") + 0.3, "relaxed", 0.4]], mood: [[0, "content", 0]], lips: [[S("kai_01"), "kai_01"]] });
  const you = C("you", { x: [[0, 760]], y: [[0, 900]], facing: [[0, 1]], pose: [[0, "relaxed", 0], [S("n20"), "give", 0.4], [E("n20"), "relaxed", 0.5], [S("n21"), "give", 0.4], [E("n21"), "relaxed", 0.5]],
    mood: [[0, "hopeful", 0], [S("ana_02") + 2, "worried", 1.5, "inOut"], [S("n21"), "hopeful", 0.8, "inOut"], [S("theo_01"), "happy", 1, "inOut"], [S("ana_04"), "touched", 1.2, "inOut"]] });
  // Ana's emotional arc: ONE mood track, blended progressively along the dialogue
  const anaMood = [[0, "forced", 0], [S("n20") + 0.4, "nervous", 1.8, "inOut"], [S("ana_02"), "worried", 1.2, "inOut"], [S("ana_02") + 2.4, "sad", 1.6, "inOut"], [S("ana_02") + 4.2, "crying", 1.8, "inOut"],
    [S("n21") + 0.3, "sad", 1.4, "inOut"], [S("ana_03"), "nervous", 1.0, "inOut"], [S("theo_01") + 0.2, "surprised", 0.35, "back"], [E("theo_01") + 0.1, "touched", 1.6, "inOut"], [E("kai_01"), "relieved", 1.2, "inOut"], [S("ana_04") + 0.4, "laughing", 0.9, "inOut"], [E("ana_04") + 0.2, "bliss", 1.2, "inOut"]];
  const ana = C("ana", { x: [[0, 1180]], y: [[0, 900]], facing: [[0, -1]], mood: anaMood, lips: ["ana_01", "ana_02", "ana_03", "ana_04"].map((i) => [S(i), i]),
    pose: [[0, "wave", 0], [E("ana_01") + 0.3, "relaxed", 0.6], [S("ana_02") + 3, "slump", 2, "inOut"], [S("ana_03"), "relaxed", 0.8, "inOut"], [S("theo_01"), "startle", 0.3], [E("theo_01") + 0.4, "relaxed", 0.8, "inOut"], [S("ana_04"), "hug", 0.7, "inOut"]],
    look: [[0, { x: 0, y: 0 }], [S("ana_02") + 3, { x: 0.2, y: 0.6 }], [S("ana_03"), { x: 0, y: 0 }], [S("theo_01"), { x: 0.6, y: -0.1 }]] });
  const cast = [mo, theo, kai, you, ana];
  // ---- inner weather over Ana: storm -> rain -> cloud -> sun (weather level w: 0 storm .. 3 sun) ----
  const wK = [[0, 0], [S("ana_03"), 0], [E("ana_03") + 0.2, 1], [E("theo_01") + 0.5, 1.6], [E("mo_01") + 0.3, 2.2], [E("kai_01") + 0.2, 3]];
  const wx = el("g", {}, world), WX = ["storm", "rain", "cloud", "sun"].map((k) => { const g = el("g", {}, wx); TS.prop(g, k, 0, 0, 1.25); return g; });
  const youTag = el("g", {}, world); el("rect", { x: -58, y: -30, width: 116, height: 52, rx: 14, fill: "#6C5CE7", stroke: "#1E1B22", "stroke-width": 5 }, youTag);
  el("text", { x: 0, y: 10, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 32, fill: "#fff" }, youTag).textContent = "YOU";
  // scene grade follows the emotion (cold storm light -> warm gold) + window sky
  const grade = el("rect", { x: 0, y: 0, width: 1920, height: 1080, style: "mix-blend-mode:multiply", "pointer-events": "none" }, svg);
  const glow = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "url(#warm)", opacity: 0, style: "mix-blend-mode:screen" }, svg);
  const g0 = el("radialGradient", { id: "warm", cx: "62%", cy: "35%", r: "70%" }, svg.querySelector("defs")); el("stop", { offset: 0, "stop-color": "#FFD27A", "stop-opacity": 0.55 }, g0); el("stop", { offset: 1, "stop-color": "#FFD27A", "stop-opacity": 0 }, g0);
  const mixC = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join(""); };
  // ---- camera: fast cuts (new shot every 2-4 s), slow push on the long beat ----
  const SH = { two: [980, 600, 1.3], wide: [860, 560, 0.92], ana: [1180, 360, 2.3], anaT: [1180, 380, 2.6], you: [800, 420, 2.0], grp: [700, 520, 1.25] };
  const shots = [[0, "two"], [S("ana_01") - 0.05, "ana"], [S("n20"), "you"], [S("n20") + 1.4, "two"], [S("ana_02") - 0.05, "ana", "anaT"], [S("n21"), "two"], [S("ana_03") - 0.05, "ana"], [S("theo_01") - 0.95, "wide"], [S("mo_01") - 0.05, "grp"], [S("kai_01") - 0.05, "wide"], [E("kai_01") + 0.1, "ana", "anaT"], [E("ana_04") + 0.6, "wide"]];
  let CUR = "two";
  function cam(t) { let i = 0; while (i + 1 < shots.length && t >= shots[i + 1][0]) i++; CUR = shots[i][1]; const [t0, a, b] = shots[i], t1 = i + 1 < shots.length ? shots[i + 1][0] : D, A = SH[a], B = SH[b || a], k = b ? sm(t0, t1, t) : 0;
    const cx = lerp(A[0], B[0], k), cy = lerp(A[1], B[1], k), z = lerp(A[2], B[2], k) * (1 + 0.012 * (t - t0)); return `translate(960,540) scale(${z.toFixed(4)}) translate(${(-cx).toFixed(1)},${(-cy).toFixed(1)})`; }
  function draw(t) {
    world.setAttribute("transform", cam(t));
    let anaR = null; cast.forEach((c) => { const r = c.update(t); if (c === ana) anaR = r; if (c === you) { youTag.setAttribute("transform", `translate(${r.headX.toFixed(1)},${(r.headY - 150).toFixed(1)})`); youTag.setAttribute("opacity", CUR === "ana" ? 0 : 1); } });
    const w = sampleTrack(wK, t, 0), bob = Math.sin(t * 2.2) * 6;
    wx.setAttribute("transform", `translate(${anaR.headX.toFixed(1)},${(anaR.headY - 175 + bob).toFixed(1)})`);
    WX.forEach((g, i) => g.setAttribute("opacity", clamp(1 - Math.abs(w - i), 0, 1).toFixed(3)));
    const warm = clamp(w / 3, 0, 1), low = sm(S("ana_02") + 1, S("ana_02") + 5, t) * (1 - sm(S("ana_03"), E("kai_01"), t));
    grade.setAttribute("fill", mixC("#FFFFFF", "#9FB0D0", 0.55 * (1 - warm) + 0.35 * low)); glow.setAttribute("opacity", (sm(E("theo_01"), E("kai_01") + 1, t)).toFixed(3));
    sky.setAttribute("fill", mixC("#7E8898", "#8FD3FF", warm)); clouds.setAttribute("opacity", (1 - warm * 0.85).toFixed(3)); clouds.setAttribute("fill", mixC("#5E6676", "#FFFFFF", warm)); sun.setAttribute("opacity", sm(2.2, 3, w).toFixed(3));
    wall.setAttribute("fill", mixC("#C9C2B8", "#F2DDB8", warm));
  }
  const tl = gsap.timeline({ paused: true }); SR.drive(tl, D, draw); window.__timelines["main"] = tl;
})();
