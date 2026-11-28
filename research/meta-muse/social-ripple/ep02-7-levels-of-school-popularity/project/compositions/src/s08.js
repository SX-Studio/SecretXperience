const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const tNo = W("n13", "there"), tNow = W("n13", "okay"), tWe = W("n14", "wears"), tSa = W("n14", "says"), tLi = W("n14", "likes"), tSt = W("n14", "status"), tWa = W("n14", "watch");
const world = el("g", {}, svg);
const bg = el("g", {}, world), back = el("g", {}, world), hero = el("g", {}, world), fx = el("g", {}, world), hud = el("g", {}, svg);
EP.hallway(svg, bg, G, { items: ["lockers", "trophy", "lockers", "poster", "lockers", "door", "lockers"], seed: 17 });
const jX = [[0, -150], [D - 1, 1500, "linear"]];
const jx = (t) => sampleTrack(jX, t, 0);
// onlookers against the lockers, heads follow Jordan
const look = EP.kids(back, { xs: [100, 330, 560, 900, 1150, 1380, 1650, 1900], y: G - 4, scale: 0.9, seed: 81, idp: "s8o", pose: "relaxed", quiet: true,
  facing: () => -1, turns: [[0.01, (i, x) => null]], spec: (i, x) => { const tp = (() => { for (let t = 0; t < D; t += 0.05) if (jx(t) > x - 60) return t; return D; })();
    return { facing: [[0, -1], [tp, -1], [tp + 0.25, 1]], mood: [[0, "surprised", 0], [tWa, "joy", 0.3]], pose: [[0, i % 3 ? "relaxed" : "phone", 0]], prop: i % 3 ? null : { kind: "phone" } }; } });
const jordan = Character(hero, EP.cast("jordan", { id: "s8-j", x: jX, y: [[0, G + 40]], pose: [[0, "proud", 0], [tLi, "point", 0.3], [tLi + 1.2, "proud", 0.3]], mood: [[0, "content", 0]], look: [[0, { x: 1, y: 0 }]] }));
const fanKid = Character(hero, EP.cast("dev", { id: "s8-fan", x: [[0, 120], [D - 1, 1770, "linear"]], y: [[0, G + 60]], facing: [[0, -1]], prop: { kind: "fan" }, pose: [[0, "hold", 0]], mood: [[0, "tired", 0]], scale: 0.9 }));
const camKid = Character(hero, EP.cast("theo", { id: "s8-cam", x: [[0, 2400], [tNow - 0.6, 2400], [tNow + 0.4, 1500, "out"], [D - 1, 2050, "linear"]], y: [[0, G + 70]], facing: [[0, -1]], prop: { kind: "phone" }, pose: [[0, "phoneUp", 0]], mood: [[0, "joy", 0]], scale: 0.92 }));
const shades = EP.Shades(fx), wind = FX.speedLines(fx, 6);
const tags = [["WEARS", tWe, 160, 1.0], ["SAYS", tSa, -210, 0.15], ["LIKES", tLi, 210, 0.3]].map(([s, t0, dx, dy]) => ({ tag: EP.Tag(fx, { t0, t1: tSt - 0.1, texts: [[0, s, "#2F3E5C"]], lift: 0 }), dx, dy }));
const eye = el("g", { opacity: 0 }, fx); el("path", { d: "M-46,0 Q0,-36 46,0 Q0,36 -46,0 Z", fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 5 }, eye); el("circle", { r: 14, fill: PAL.ink }, eye);
const cnt = EP.txt(eye, 64, 2, "", 46, PAL.ink, { font: "Outfit", anchor: "start", attrs: { stroke: "#FFF", "stroke-width": 10, "paint-order": "stroke" } });
const eq = el("g", { opacity: 0 }, hud); el("rect", { x: 560, y: 120, width: 800, height: 120, rx: 24, fill: PAL.ink }, eq); EP.txt(eq, 960, 182, "STATUS = HOW WATCHED YOU ARE", 50, "#FFFFFF", { font: "Outfit" });
// letterbox + REC overlay
const bars = el("g", {}, hud); const top = el("rect", { x: 0, y: 0, width: 1920, height: 0, fill: "#0E0D10" }, bars), bot = el("rect", { x: 0, y: 1080, width: 1920, height: 0, fill: "#0E0D10" }, bars);
const rec = el("g", { opacity: 0 }, hud); el("path", { d: "M120,180 v-60 h60 M1740,120 h60 v60 M1800,900 v60 h-60 M180,960 h-60 v-60", fill: "none", stroke: "#FFFFFF", "stroke-width": 8 }, rec);
el("circle", { cx: 200, cy: 230, r: 16, fill: PAL.rude }, rec); EP.txt(rec, 230, 231, "REC", 40, "#FFFFFF", { font: "Outfit", anchor: "start" });
const none = el("g", { opacity: 0 }, hud); EP.txt(none, 1560, 300, "(no camera)", 48, "#FFFFFF", { attrs: { stroke: "#0E0D10", "stroke-width": 10, "paint-order": "stroke" } });
const card = EP.LevelCard(hud, { n: 6, name: "MAIN CHARACTER", t0: T.n13, t1: T.n13 + 2.6, y: 200 });
const ladder = EP.Ladder(hud, { hide: T.n13 + 3.4, level: [[0, 5], [T.n13 + 0.2, 5], [T.n13 + 0.9, 6, "out"]] });
const cam = Camera(world, [[0, { x: 200, y: 650, z: 1.5 }], [tSt - 0.3, { x: jx(tSt - 0.3) + 60, y: 640, z: 1.5 }, "linear"], [tSt + 0.4, { x: jx(tSt + 0.4), y: 600, z: 1.2 }, "out"], [D, { x: jx(D) - 20, y: 600, z: 1.15 }, "linear"]]);
return (t) => {
  cam.update(t); look.update(t);
  const j = jordan.update(t), f = fanKid.update(t); camKid.update(t);
  shades.update(t, j, 1); wind.update(t, { x: j.x + 40, headY: j.headY - 10 }, -1, 0.6);
  tags.forEach((g) => g.tag.update(t, { x: j.x + g.dx, y: j.headY + 260 * g.dy - 20 }));
  const ke = clamp((t - tWa + 0.2) / 0.4, 0, 1); eye.setAttribute("opacity", ke); eye.setAttribute("transform", `translate(${j.headX - 60},${j.headY - 150}) scale(${EASE.back(ke)})`);
  cnt.textContent = Math.round(1248 * EASE.out(clamp((t - tWa + 0.2) / 1.6, 0, 1))).toLocaleString("en-US") + " watching";
  const kq = clamp((t - tSt) / 0.35, 0, 1); eq.setAttribute("opacity", kq * (1 - clamp((t - tWa - 1.8) / 0.4, 0, 1))); eq.setAttribute("transform", `translate(0,${-30 * (1 - kq)})`);
  const lb = 90 * clamp(t / 0.6, 0, 1) * (1 - clamp((t - tSt + 0.4) / 0.5, 0, 1)); top.setAttribute("height", lb); bot.setAttribute("y", 1080 - lb); bot.setAttribute("height", lb);
  rec.setAttribute("opacity", t > tNow && t < tSt - 0.3 ? 1 : 0);
  none.setAttribute("opacity", t > tNo && t < tNow ? 1 : 0);
  card.update(t); ladder.update(t);
};
