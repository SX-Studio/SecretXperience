const D = T.D, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const world = el("g", {}, svg);
el("rect", { x: -200, y: -200, width: 2320, height: 1480, fill: "#24474A" }, world);
for (let i = 0; i < 40; i++) el("circle", { cx: (i * 397) % 1920, cy: (i * 233) % 1080, r: 3, fill: "rgba(255,255,255,0.25)" }, world);
const L = el("g", {}, world);
el("path", { d: "M760,980 L800,40 M1160,980 L1120,40", stroke: "#F4F1EA", "stroke-width": 16, "stroke-linecap": "round" }, L);
const names = EP.LEVELS;
for (let i = 0; i < 7; i++) { const y = 920 - i * 128, xl = 762 + (980 - y) * 0.04, xr = 1158 - (980 - y) * 0.04;
  el("rect", { x: xl, y: y - 10, width: xr - xl, height: 20, rx: 8, fill: i < 6 ? "#F4F1EA" : "#C9A227", stroke: PAL.ink, "stroke-width": 4 }, L);
  EP.txt(L, xl - 30, y, String(i + 1), 52, "#F4F1EA", { font: "Outfit", anchor: "end" });
  EP.txt(L, xr + 30, y, names[i], 40, i < 6 ? "#BFD8D2" : "#F2D28A", { font: "Outfit", anchor: "start" }); }
const lock = EP.Lock(world, { s: 0.9 });
const tL = W("n15", "locked"), tH = W("n15", "hold");
const note = el("g", { opacity: 0 }, world); el("rect", { x: -150, y: -70, width: 300, height: 140, fill: "#FFF6C7", stroke: PAL.ink, "stroke-width": 5 }, note); EP.txt(note, 0, -16, "BACK SOON", 44, PAL.ink, { font: "Outfit" }); EP.txt(note, 0, 36, "(promise)", 32, PAL.ink);
const cam = Camera(world, [[0, { x: 960, y: 600, z: 1.0 }], [tL, { x: 1060, y: 330, z: 1.3 }, "inOut"], [D, { x: 1060, y: 320, z: 1.35 }, "linear"]], { shake: [[tL, 0], [tL + 0.05, 6], [tL + 0.6, 0, "out"]] });
return (t) => {
  cam.update(t);
  const rattle = t > tL && t < tL + 0.7 ? Math.sin(t * 60) * 8 : 0;
  lock.update(t, 960 + rattle, 140, 1);
  const kn = clamp((t - tH) / 0.3, 0, 1); note.setAttribute("opacity", kn); note.setAttribute("transform", `translate(1500,60) rotate(${8 - 4 * kn}) scale(${0.6 + 0.4 * EASE.back(kn)})`);
};
