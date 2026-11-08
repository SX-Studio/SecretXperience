const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const world = el("g", {}, svg);
const bg = el("g", {}, world), walk = el("g", {}, world), hero = el("g", {}, world), fx = el("g", {}, world), hud = el("g", {}, svg);
EP.hallway(svg, bg, G, { items: ["lockers", "poster", "lockers", "door", "lockers", "trophy"], seed: 23, posters: [["SPIRIT WEEK", "#F2C14E"], ["ASSEMBLY · FRIDAY 9AM", "#CDE4EC"]] });
const crowd = Crowd(walk, { n: 10, seed: 44, x0: -600, x1: 2800, y: G - 6, dur: D, speed: [70, 130], scale: [0.86, 0.96], idp: "s4c" });
const tS = W("n07", "sneezed"), tQ = W("n07", "side");
// Eli: tiny kid, giant backpack
const eli = Character(hero, { id: "s4-eli", color: "#A5B86A", outfit: "hoodie", hair: "short", hairColor: "#8A5A35", glasses: true, pants: "#3A4A63", seed: 92, scale: 0.9,
  x: [[0, 200], [D, 1500, "linear"]], y: [[0, G + 30]], pose: [[0, "relaxed", 0], [tS, "startle", 0.06], [tS + 0.5, "relaxed", 0.3]],
  mood: [[0, "content", 0], [tS - 0.35, "closed", 0.15], [tS, "shock", 0.06], [tS + 0.6, "content", 0.3], [tQ, "joy", 0.3]], squash: [[tS - 0.3, 0], [tS - 0.05, -0.1], [tS + 0.05, 0.15], [tS + 0.3, 0]] });
const pack = el("g", {}, hero); hero.insertBefore(pack, eli.g);
el("rect", { x: -60, y: -70, width: 120, height: 150, rx: 26, fill: "#E58A3A", stroke: PAL.ink, "stroke-width": 6 }, pack);
el("rect", { x: -44, y: 10, width: 88, height: 50, rx: 12, fill: "#C96F2A", stroke: PAL.ink, "stroke-width": 4 }, pack);
el("path", { d: "M-60,-30 h120", stroke: PAL.ink, "stroke-width": 4 }, pack);
const tag = EP.Tag(fx, { t0: W("n07", "level", 0, 0.05) + 0.6, t1: D, texts: [[0, "NPC", "#6B6F7A"], [W("n07", "backpack"), "BACKPACK KID", "#E58A3A"], [tS, "SNEEZE KID", "#8C5E78"], [tQ, "SIDE QUEST", "#C9A227"]], lift: 175 });
const quest = el("g", { opacity: 0 }, fx); el("path", { d: "M-16,-80 h32 l-8,60 h-16 z", fill: "#F2C14E", stroke: PAL.ink, "stroke-width": 5 }, quest); el("circle", { cx: 0, cy: 0, r: 12, fill: "#F2C14E", stroke: PAL.ink, "stroke-width": 5 }, quest);
const achoo = el("g", { opacity: 0 }, fx); EP.txt(achoo, 0, 0, "ACHOO!", 64, PAL.ink, { font: "Outfit", attrs: { stroke: "#FFFFFF", "stroke-width": 12, "paint-order": "stroke" } });
const card = EP.LevelCard(hud, { n: 2, name: "THE NPC", t0: T.n07, t1: W("n07", "people") + 1.4 });
const ladder = EP.Ladder(hud, { hide: W("n07", "people") + 2.2, level: [[0, 1], [T.n07 + 0.2, 1], [T.n07 + 0.9, 2, "out"]] });
// NPC dialogue box, video-game style
const box = el("g", { opacity: 0 }, hud);
el("rect", { x: 460, y: 860, width: 1000, height: 150, rx: 14, fill: "#1E1B22", stroke: "#F4F1EA", "stroke-width": 6 }, box);
EP.txt(box, 500, 910, "ELI", 34, "#F2C14E", { font: "Outfit", anchor: "start" });
const line = EP.txt(box, 500, 962, "", 38, "#F4F1EA", { anchor: "start", weight: 800 });
const say = "Nice weather in the hallway today.";
const cam = Camera(world, [[0, { x: 560, y: 640, z: 1.4 }], [D, { x: 1320, y: 640, z: 1.45 }, "linear"]], { shake: [[tS, 0], [tS + 0.04, 7], [tS + 0.4, 0, "out"]] });
return (t) => {
  cam.update(t); crowd.update(t);
  const e = eli.update(t);
  pack.setAttribute("transform", `translate(${e.x - 46},${e.headY + 112}) rotate(${-6 + Math.sin(t * 9) * 2})`);
  tag.update(t, { x: e.headX, y: e.headY + 40 });
  const kq = clamp((t - tQ) / 0.3, 0, 1); quest.setAttribute("opacity", kq); quest.setAttribute("transform", `translate(${e.headX},${e.headY - 230 + Math.sin(t * 5) * 8}) scale(${EASE.back(kq)})`);
  const ka = clamp((t - tS) / 0.7, 0, 1); achoo.setAttribute("opacity", ka > 0 && ka < 1 ? 1 : 0); achoo.setAttribute("transform", `translate(${e.headX + 120},${e.headY - 30}) scale(${0.6 + 0.6 * EASE.out(ka)}) rotate(-8)`);
  card.update(t); ladder.update(t);
  const tb = W("n07", "you're") - 0.2, kb = clamp((t - tb) / 0.3, 0, 1); box.setAttribute("opacity", kb * (1 - clamp((t - tS + 0.2) / 0.3, 0, 1)));
  line.textContent = say.slice(0, Math.floor(clamp((t - tb) / 1.4, 0, 1) * say.length));
};
