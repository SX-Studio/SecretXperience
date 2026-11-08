const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const tDoor = W("n05", "doors"), tCall = T.ms_you, tFile = W("n06", "everybody");
const world = el("g", {}, svg);
const bg = el("g", {}, world), walk = el("g", {}, world), hero = el("g", {}, world), front = el("g", {}, world), fx = el("g", {}, world), hud = el("g", {}, svg);
EP.hallway(svg, bg, G, { items: ["lockers", "door", "lockers", "poster", "lockers", "trophy", "lockers"], seed: 11 });
// a classroom door that swings shut in Nia's face (door sits at x≈1120 in the hallway layout -> draw our own)
const dX = 1500, door = Set.door(bg, dX, G, "#A8754F");
const okafor = Character(hero, EP.cast("okafor", { id: "s3-ok", x: [[0, dX + 40]], y: [[0, G + 4]], facing: [[0, -1]], opacity: [[0, 0], [tCall - 0.5, 0], [tCall - 0.2, 1]],
  pose: [[0, "relaxed", 0], [tCall, "point", 0.2], [T.ms_you_e + 0.3, "relaxed", 0.4]], mood: [[0, "neutral", 0], [tCall, "surprised", 0.2], [T.ms_you_e, "content", 0.3]], lips: [[tCall, "ms_you"]], noWalk: true }));
const crowd = Crowd(walk, { n: 8, seed: 31, x0: -400, x1: 2600, y: G - 6, dur: D, speed: [80, 140], scale: [0.86, 0.96], idp: "s3c" });
const niaX = [[0, 300], [tDoor - 1.4, 300], [tDoor - 0.1, 1330, "out"], [tCall + 0.4, 1330], [tFile, 1200, "inOut"]];
const nia = Character(hero, EP.cast("nia", { id: "s3-nia", x: niaX, y: [[0, G + 30]], prop: { kind: "bag" },
  opacity: [[0, 0.35], [tFile - 0.2, 0.35], [tFile + 0.3, 1]], facing: [[0, 1], [tCall + 0.4, 1], [tCall + 0.55, 1]],
  pose: [[0, "relaxed", 0], [tDoor + 0.05, "startle", 0.1], [tDoor + 0.6, "relaxed", 0.3], [tCall + 0.2, "point", 0.2], [T.ms_you_e + 0.4, "shrug", 0.3], [tFile + 0.5, "relaxed", 0.4]],
  mood: [[0, "worried", 0], [tDoor + 0.05, "shock", 0.1], [tDoor + 0.6, "sad", 0.3], [tCall, "surprised", 0.2], [tFile + 0.3, "content", 0.3]], squash: [[tDoor, 0], [tDoor + 0.08, 0.15], [tDoor + 0.3, 0]] }));
const card = EP.LevelCard(hud, { n: 1, name: "INVISIBLE", t0: T.n04, t1: T.n05 + 1.2 });
const ladder = EP.Ladder(hud, { hide: T.n05 + 2.2, level: [[0, 1]] });
const imp = FX.impact(fx, "#FFF6C7"), sweat = FX.sweat(fx), dust = FX.dust(fx);
const you = Bubble(fx, { text: "Uh… you! In the hoodie.", t0: tCall, t1: T.ms_you_e + 0.5, side: -1 });
const me = Bubble(fx, { text: "Me?", t0: T.ms_you_e + 0.1, t1: T.ms_you_e + 1.1, side: 1, size: 30 });
// the "file" gag: a manila folder slides in, stamped PENDING
const file = el("g", { opacity: 0 }, hud);
el("path", { d: "M-300,-200 h200 l30,-40 h370 v440 h-600 z", fill: "#E8C79B", stroke: PAL.ink, "stroke-width": 7 }, file);
EP.txt(file, 0, -100, "NEW KID", 54, PAL.ink, { font: "Outfit" });
EP.txt(file, 0, -20, "Name: ???", 40, PAL.ink);
EP.txt(file, 0, 40, "Vibe: ???", 40, PAL.ink);
const st = el("g", { opacity: 0 }, file); el("rect", { x: -200, y: 80, width: 400, height: 90, rx: 10, fill: "none", stroke: PAL.rude, "stroke-width": 8 }, st); EP.txt(st, 0, 126, "FILE PENDING", 50, PAL.rude, { font: "Outfit" });
const cam = Camera(world, [[0, { x: 520, y: 640, z: 1.35 }], [tDoor - 1.4, { x: 600, y: 640, z: 1.35 }, "linear"], [tDoor, { x: 1300, y: 640, z: 1.55 }, "inOut"], [tCall - 0.3, { x: 1360, y: 640, z: 1.6 }, "linear"], [tCall + 0.1, { x: 1420, y: 620, z: 1.5 }, "out"], [tFile, { x: 1300, y: 620, z: 1.45 }, "inOut"], [D, { x: 1240, y: 630, z: 1.4 }, "linear"]], { shake: [[tDoor, 0], [tDoor + 0.05, 9], [tDoor + 0.5, 0, "out"]] });
return (t) => {
  cam.update(t); crowd.update(t);
  door.open(t < tDoor - 1.6 ? 0.85 : clamp(0.85 - (t - (tDoor - 0.35)) / 0.3 * 0.85, 0, 0.85));
  const n = nia.update(t), o = okafor.update(t);
  imp.update(t, dX - 80, n.headY + 20, tDoor); sweat.update(t, n, t > tCall && t < tFile); dust.update(t, n, G + 30);
  you.update(t, { x: o.headX, y: o.headY }); me.update(t, { x: n.headX, y: n.headY });
  card.update(t); ladder.update(t);
  const k = clamp((t - tFile) / 0.4, 0, 1), ko = clamp((t - (D - 0.6)) / 0.4, 0, 1);
  file.setAttribute("opacity", k * (1 - ko)); file.setAttribute("transform", `translate(${1460 + 600 * (1 - EASE.out(k))},${470}) rotate(${4 - 4 * k}) scale(0.8)`);
  const ks = clamp((t - W("n06", "filed")) / 0.25, 0, 1); st.setAttribute("opacity", ks); st.setAttribute("transform", `rotate(-8) scale(${ks > 0 ? 1.8 - 0.8 * EASE.out(ks) : 1})`);
};
