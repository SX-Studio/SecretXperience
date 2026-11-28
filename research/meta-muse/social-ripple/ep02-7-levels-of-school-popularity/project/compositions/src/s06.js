const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const world = el("g", {}, svg);
const bg = el("g", {}, world), hero = el("g", {}, world), fx = el("g", {}, world), hud = el("g", {}, svg);
EP.hallway(svg, bg, G, { items: ["lockers", "lockers", "poster", "lockers"], seed: 5 });
Set.bench(bg, 260, 420, G + 10);
const a1 = W("priya_add", "adding", 0) , a2 = W("priya_add", "adding", 1), a3 = W("priya_add", "not");
const priya = Character(hero, EP.cast("priya", { id: "s6-pr", x: [[0, 470]], y: [[0, G + 10]], noWalk: true, prop: { kind: "phone" },
  pose: [[0, "sitPhone", 0]], mood: [[0, "content", 0], [a3, "annoyed", 0.15], [a3 + 0.8, "content", 0.3], [T.n11, "happy", 0.3]], lips: [[T.priya_add, "priya_add"]], look: [[0, { x: 0.4, y: 0.6 }]] }));
const tS = W("n10", "screenshot"), tL = W("n10", "left"), tI = W("n11", "information");
const phone = EP.Phone(hud, { x: 1380, y: 560, s: 0.88, title: "grade 9 🔥 (148)", msgs: [
  [T.n10 + 0.6, "*", "Priya created the group"], [W("n10", "decides"), "Priya", "welcome 2 the chat!!", "#9A8AB0"],
  [a1, "*", "Priya added Theo"], [a2, "*", "Priya added Marcus"], [a3, "*", "Priya removed Kyle 💀"],
  [tL, "Kyle", "hello?? can u add me back", "#6F8299"], [tL + 0.7, "*", "Seen by 147"],
  [tS, "#", "screenshot_9pm.png"], [tS + 0.6, "*", "9:00 PM"], [tI - 0.3, "Theo", "WAIT WHAT 😭", "#E58A3A"], [tI, "Marcus", "who sent this", "#4E8A5A"] ] });
const tap = el("circle", { r: 26, fill: "rgba(255,255,255,0.6)", stroke: PAL.ink, "stroke-width": 4, opacity: 0 }, hud);
const info = [0, 1, 2, 3, 4, 5].map((i) => { const g = el("g", { opacity: 0 }, fx); el("rect", { x: -26, y: -18, width: 52, height: 36, rx: 6, fill: ["#FFF6C7", "#CDE4EC", "#F7C6D0"][i % 3], stroke: PAL.ink, "stroke-width": 4 }, g); el("path", { d: "M-26,-18 L0,4 L26,-18", fill: "none", stroke: PAL.ink, "stroke-width": 3 }, g); return g; });
const intel = el("g", { opacity: 0 }, fx); EP.txt(intel, 0, 0, "INTEL: 100%", 44, PAL.ink, { font: "Outfit", attrs: { stroke: "#CDE4EC", "stroke-width": 14, "paint-order": "stroke" } });
const card = EP.LevelCard(hud, { n: 4, name: "GROUP CHAT ADMIN", t0: T.n10, t1: T.n10 + 2.6, x: 820 });
const ladder = EP.Ladder(hud, { hide: T.n10 + 3.4, level: [[0, 3], [T.n10 + 0.2, 3], [T.n10 + 0.9, 4, "out"]] });
const cam = Camera(world, [[0, { x: 760, y: 700, z: 1.5 }], [D, { x: 700, y: 690, z: 1.65 }, "linear"]]);
return (t) => {
  cam.update(t); const p = priya.update(t);
  const sh = [a1, a2, a3].some((x) => t > x && t < x + 0.25) ? 1 : 0;
  phone.update(t, { shake: t > tI && t < tI + 0.6 ? 1 : 0, dy: 20 * Math.sin(t * 1.3) });
  const tp = [a1, a2, a3].find((x) => t > x - 0.05 && t < x + 0.35); tap.setAttribute("opacity", tp ? 1 - (t - tp) / 0.4 : 0); tap.setAttribute("cx", 1500); tap.setAttribute("cy", 940); tap.setAttribute("r", tp ? 18 + (t - tp) * 60 : 0);
  info.forEach((g, i) => { const k = clamp((t - tI - i * 0.12) / 0.8, 0, 1); const sx = 1100 + i * 40, sy = 300 + (i % 3) * 120; g.setAttribute("opacity", k > 0 && k < 1 ? 1 : 0); g.setAttribute("transform", `translate(${sx + (p.headX - sx) * k},${sy + (p.headY - sy) * k - Math.sin(k * Math.PI) * 120}) scale(${1 - 0.5 * k})`); });
  const ki = clamp((t - tI - 0.8) / 0.3, 0, 1); intel.setAttribute("opacity", ki); intel.setAttribute("transform", `translate(${p.headX},${p.headY - 140}) scale(${EASE.back(ki)})`);
  card.update(t); ladder.update(t);
};
