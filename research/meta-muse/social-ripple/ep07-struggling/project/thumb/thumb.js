/* Ep7 thumbnails (v5 cast). window.VAR = "A" (YOU sees it) | "B" (Ana, "I'M FINE!") */
(function () {
  const svg = document.getElementById("art"), { el } = SR, K = window.K7, V = window.VAR; TS.defs(svg);
  const d = svg.querySelector("defs"), rg = el("radialGradient", { id: "bg", cx: V === "A" ? "58%" : "40%", cy: "42%", r: "75%" }, d);
  el("stop", { offset: 0, "stop-color": V === "A" ? "#FF8FB8" : "#8FB8FF" }, rg); el("stop", { offset: 0.55, "stop-color": V === "A" ? "#7B4BD8" : "#5A4BC8" }, rg); el("stop", { offset: 1, "stop-color": "#24124A" }, rg);
  el("rect", { width: 1280, height: 720, fill: "url(#bg)" }, svg);
  // crowd = the topic: translucent, all smiling, weather tells the truth
  const crowd = el("g", { opacity: 0.62 }, svg), says = ["I'm fine!", "Great!", "All good!", "Fine!", "Doing great!", "I'm good!"];
  const spots = V === "A" ? [[40, 600, 2.4, 4], [1210, 640, 2.4, 3], [860, 620, 2.2, 4], [1040, 700, 2.5, 4], [300, 620, 2.1, 2], [690, 720, 2.3, 3]]
    : [[800, 580, 2.4, 4], [980, 520, 2.2, 3], [1160, 590, 2.5, 4], [1260, 480, 2.0, 0], [640, 520, 2.1, 2]];
  const moods = ["grin", "happy", "forced", "grin", "happy", "content"];
  spots.forEach(([x, y, k, lv], i) => { const c = SR.Character(crowd, Object.assign({}, K.extra(60 + i), { scale: k, x: [[0, x]], y: [[0, y + 300]], facing: [[0, x < 640 ? 1 : -1]], noWalk: true, pose: [[0, i % 2 ? "wave" : "relaxed", 0]], mood: [[0, moods[i], 0]], look: [[0, { x: 0, y: 0 }]] }));
    const r = c.update(0.4), w = K.weather(crowd, { seed: i + 3 }); w.set(lv, 0.3 + i * 0.11, (V === "A" ? 1.7 : 1.25) * k / 2, 1); w.g.setAttribute("transform", `translate(${r.headX},${r.headY - (V === "A" ? 95 : 75) * k - 30})`);
    if (i < 2) { const b = el("g", { transform: `translate(${r.headX + (x < 640 ? 70 : -70)},${r.headY - 40})` }, crowd); el("rect", { x: -84, y: -30, width: 168, height: 56, rx: 18, fill: "#FFFFFF", stroke: "#1E1B22", "stroke-width": 4 }, b);
      el("text", { y: 9, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 30, fill: "#1E1B22" }, b).textContent = says[i]; } });
  // hero (solid, rim light)
  const heroG = el("g", { filter: "url(#rim)" }, svg);
  if (V === "A") { const c = SR.Character(heroG, Object.assign({}, CAST5.you, { scale: 4.7, x: [[0, 540]], y: [[0, 1440]], facing: [[0, 1]], noWalk: true, pose: [[0, "startle", 0]], mood: [[0, "shock", 0]], look: [[0, { x: 0.6, y: -0.6 }]] })); const rr = c.update(0.4);
    const tag = K.tag(svg, "YOU", { fs: 44 }); tag.setAttribute("transform", `translate(${rr.headX - 30},${rr.headY - 215})`); }
  else { const c = SR.Character(heroG, Object.assign({}, CAST5.ana, { scale: 4.8, x: [[0, 420]], y: [[0, 1430]], facing: [[0, 1]], noWalk: true, pose: [[0, "wave", 0]], mood: [[0, "forced", 0]], look: [[0, { x: 0, y: 0 }]] })); const r = c.update(0.4);
    const w = K.weather(svg, { seed: 2 }); w.set(4, 0.35, 2.3, 1); w.g.setAttribute("transform", `translate(${r.headX - 10},${r.headY - 275})`); }
  // first-person text, no box
  const txt = (x, y, parts, fs, anchor = "start") => { const t = el("text", { x, y, "text-anchor": anchor, "font-family": "Outfit", "font-weight": 900, "font-size": fs, stroke: "#1E1B22", "stroke-width": fs * 0.16, "paint-order": "stroke", "letter-spacing": 1, filter: "drop-shadow(0 8px 0 rgba(0,0,0,0.45))" }, svg);
    parts.forEach(([s, c]) => { const sp = el("tspan", { fill: c }, t); sp.textContent = s; }); return t; };
  if (V === "A") { txt(1250, 130, [["THEY SAID ", "#FFFFFF"]], 92, "end"); txt(1250, 240, [["FINE.", "#FFD84A"]], 120, "end"); }
  else { txt(1240, 150, [["I'M ", "#FFFFFF"], ["FINE!", "#FFD84A"]], 132, "end"); }
  // counter (premise as interface)
  const cg = el("g", { transform: V === "A" ? "translate(1040,660)" : "translate(1040,660)" }, svg); el("rect", { x: -200, y: -40, width: 400, height: 80, rx: 18, fill: "#2B2140", stroke: "#FFC94A", "stroke-width": 6 }, cg);
  el("text", { x: 0, y: 14, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 38, fill: "#FFE3A0" }, cg).textContent = "STORMS SEEN: 47";
})();
