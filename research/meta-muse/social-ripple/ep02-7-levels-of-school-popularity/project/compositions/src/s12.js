const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const world = el("g", {}, svg);
const bg = el("g", {}, world), backK = el("g", {}, world), backT = el("g", {}, world), chairL = el("g", {}, world), kidsL = el("g", {}, world), tabL = el("g", {}, world), walkL = el("g", {}, world), fx = el("g", {}, world), hud = el("g", {}, svg);
EP.cafeteria(svg, bg, G, { time: "12:04", menu: "Taco Wednesday", menuX: 1700, clockX: 2250 });
const BY = G - 140; const bTabs = [-500, 1600]; const bxs = []; bTabs.forEach((x) => { for (let i = 0; i < 4; i++) bxs.push(x + 90 + i * 180); });
const tLeave = T.n22 + 0.6, tDev = T.dev_joke, tLaugh = T.dev_joke_e + 0.05, tWho = T.n25, tFwd = W("n25", "forwarded"), tLau = W("n25", "laughed"), tStd = W("n25", "stood"), tLaw = W("n25", "law"), tEl = W("n25", "election"), tAll = W("n25", "everybody", 0, 0.9);
// back row: Priya's table (left) + others (forwarders: phones)
const back = EP.kids(backK, { xs: bxs, y: BY, scale: 0.8, seed: 121, idp: "s12b", dur: D, spec: (i) => (i === 1 ? EP.cast("priya", { scale: 0.8, pose: [[0, "sitPhone", 0]], prop: { kind: "phone" }, mood: [[0, "content", 0], [tWho, "worried", 0.3]], talk: [] }) : (i % 2 ? { pose: [[0, "sitPhone", 0]], prop: { kind: "phone" } } : { mood: [[0, "content", 0], [tLaugh, "joy", 0.2]] })) });
bTabs.forEach((x, i) => EP.table(backT, x, 1000, BY, 0.8, 120 + i));
// Jordan's top table (front left) with chairs; 5 kids leave one by one
const JX = [200, 360, 520, 680, 840, 1000], jI = 2;
const leaveT = (i) => tLeave + [0, 0.5, 9, 0.95, 1.35, 1.7][i];
const chairs = JX.map((x) => EP.chair(chairL, x - 12, G + 40, 1.0, "#C9A227"));
const top = JX.map((x, i) => i === jI ? Character(kidsL, EP.cast("jordan", { id: "s12-j", x: [[0, x]], y: [[0, G + 40]], noWalk: true, pose: [[0, "sit", 0], [leaveT(4), "sitSlump", 0.6]], mood: [[0, "content", 0], [leaveT(0), "surprised", 0.2], [leaveT(3), "sad", 0.5], [tDev + 0.1, "shock", 0.15], [tLaugh + 0.8, "sad", 0.4]], look: [[0, { x: 0.5, y: 0 }], [leaveT(4), { x: 0, y: 0.8 }]] }))
  : Character(kidsL, { id: "s12-t" + i, color: ["#9DB49A", "#D98C8C", "", "#6F8299", "#E8C79B", "#4F7FB0"][i], outfit: ["tee", "hoodie", "", "jacket", "shirt", "tee"][i], hair: ["long", "cap", "", "curly", "ponytail", "short"][i], hairColor: "#3B2B22", seed: 400 + i, scale: 0.98,
      x: [[0, x], [leaveT(i) + 0.3, x], [leaveT(i) + 2.6, i < jI ? -500 : 2500, "in"]], y: [[0, G + 40], [leaveT(i), G + 40], [leaveT(i) + 0.3, G + 90]], facing: [[0, i < jI ? 1 : -1], [leaveT(i), i < jI ? 1 : -1], [leaveT(i) + 0.15, i < jI ? -1 : 1]],
      pose: [[0, "sit", 0], [leaveT(i), "relaxed", 0.25]], mood: [[0, "content", 0], [leaveT(i) - 0.3, "annoyed", 0.2]] }));
// put leavers on the walk layer after they stand so they pass in front of the table
EP.table(tabL, 120, 1000, G + 40, 1, 125, { top: "#F2D28A", trays: true });
const crown = el("g", {}, tabL); el("rect", { x: 490, y: G - 66, width: 260, height: 48, rx: 10, fill: "#C9A227", stroke: PAL.ink, "stroke-width": 4 }, crown); EP.txt(crown, 620, G - 41, "TOP TABLE", 30, "#FFFFFF", { font: "Outfit" });
// Dev's table (front right)
const devT = EP.kids(kidsL, { xs: [1420, 1580, 1920, 2080], y: G + 40, scale: 0.98, seed: 131, idp: "s12d", quiet: true, facing: (i, x) => (x < 1750 ? 1 : -1), spec: (i) => ({ mood: [[0, "content", 0], [tLaugh + i * 0.07, "joy", 0.15], [tLaugh + 2.5, "happy", 0.5]], squash: [[tLaugh, 0], [tLaugh + 0.15, 0.1], [tLaugh + 0.4, 0], [tLaugh + 0.6, 0.08], [tLaugh + 0.85, 0]] }) });
const dev = Character(kidsL, EP.cast("dev", { id: "s12-dev", x: [[0, 1750]], y: [[0, G + 10]], noWalk: true, pose: [[0, "sit", 0], [tDev - 0.3, "shout", 0.2], [T.dev_joke_e + 0.3, "proud", 0.3]], mood: [[0, "content", 0], [tDev - 0.3, "joy", 0.2]], lips: [[tDev, "dev_joke"]] }));
EP.table(tabL, 1320, 1000, G + 40, 1, 132);
const aura = EP.Aura(fx, { t0: W("n23", "minus") - 0.1, t1: T.dev_joke - 0.2, from: 0, to: -1000, dur: 1.2 });
const jtag = EP.Tag(fx, { t0: W("n23", "level") - 0.1, t1: T.n24 - 0.2, texts: [[0, "LV 6", "#2F3E5C"], [W("n23", "two"), "LV 2", "#6B6F7A"]], lift: 150 });
const dtag = EP.Tag(fx, { t0: T.n24 + 0.2, t1: T.n25 + 1.0, texts: [[0, "LV 3", "#6B6F7A"], [W("n24", "five"), "LV 5", PAL.rude]], lift: 190 });
const ptag = EP.Tag(fx, { t0: W("n25", "priya") - 0.1, t1: tFwd - 0.2, texts: [[0, "POSTED IT", "#8C5E78"]], lift: 140 });
const joke = Bubble(fx, { text: "Fake it till you make it, bro!", t0: tDev, t1: T.dev_joke_e + 0.6, side: -1 });
const haha = [0, 1].map(() => { const g = el("g", { opacity: 0 }, fx); EP.txt(g, 0, 0, "HA HA HA", 52, PAL.rude, { font: "Outfit", attrs: { stroke: "#FFF", "stroke-width": 10, "paint-order": "stroke" } }); return g; });
// ballots ✓ over voters
const ballot = () => { const g = el("g", { opacity: 0 }, fx); el("rect", { x: -26, y: -32, width: 52, height: 64, rx: 6, fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 4 }, g); el("path", { d: "M-12,0 L-2,12 L14,-14", fill: "none", stroke: PAL.rude, "stroke-width": 6, "stroke-linecap": "round" }, g); return g; };
const voters = []; // [getHead(), t0]
back.people.forEach((p, i) => { if (i % 2 && i !== 1) voters.push([p, tFwd + 0.1 * i]); });
devT.people.forEach((p, i) => voters.push([p, tLau + 0.1 * i]));
top.forEach((p, i) => { if (i !== jI) voters.push([p, tStd + 0.08 * i, true]); });
const B = voters.map(() => ballot());
const law = el("g", { opacity: 0 }, hud); el("path", { d: "M-230,-170 Q0,-230 230,-170 V170 H-230 Z", fill: "#B9B2A6", stroke: PAL.ink, "stroke-width": 7 }, law); EP.txt(law, 0, -70, "LAW OF", 64, PAL.ink, { font: "Outfit" }); EP.txt(law, 0, 10, "NATURE", 64, PAL.ink, { font: "Outfit" });
const crack = el("path", { d: "M-20,-200 L20,-80 L-30,0 L30,90 L-10,170", fill: "none", stroke: PAL.ink, "stroke-width": 8, opacity: 0 }, law);
const box = el("g", { opacity: 0 }, hud); el("rect", { x: -200, y: -120, width: 400, height: 260, rx: 16, fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 7 }, box); el("rect", { x: -110, y: -134, width: 220, height: 20, rx: 8, fill: PAL.ink }, box); EP.txt(box, 0, 30, "VOTE", 90, PAL.rude, { font: "Outfit" });
const ladder = EP.Ladder(hud, { show: [[0, 0], [W("n23", "level") - 0.4, 0], [W("n23", "level"), 1, "out"], [T.dev_joke - 0.4, 1], [T.dev_joke, 0]], level: [[0, 6], [W("n23", "two") - 0.6, 6], [W("n23", "two") + 0.2, 2, "inOut"]] });
const cam = Camera(world, [[0, { x: 1100, y: 640, z: 1.05 }], [T.n22_e, { x: 900, y: 660, z: 1.1 }, "inOut"], [T.n23, { x: 640, y: 680, z: 1.45 }, "inOut"], [tDev - 0.4, { x: 680, y: 680, z: 1.5 }, "linear"], [tDev, { x: 1700, y: 660, z: 1.4 }, "inOut"], [T.n24_e, { x: 1650, y: 660, z: 1.4 }, "linear"],
  [tWho + 0.8, { x: 300, y: 560, z: 1.45 }, "inOut"], [tFwd - 0.2, { x: 300, y: 560, z: 1.45 }, "linear"], [tFwd + 0.3, { x: 960, y: 620, z: 0.95 }, "inOut"], [D, { x: 960, y: 620, z: 0.9 }, "linear"]]);
return (t) => {
  cam.update(t); const bp = back.update(t); const tp = top.map((p) => p.update(t)); const dp = devT.update(t); const d = dev.update(t);
  chairs.forEach((c, i) => { const k = i === jI ? 0 : clamp((t - leaveT(i)) / 0.25, 0, 1); c.set((i < jI ? -1 : 1) * -30 * k, (i < jI ? -1 : 1) * 8 * k); });
  top.forEach((p, i) => { if (i !== jI && t > leaveT(i) + 0.2 && p.g.parentNode !== walkL) walkL.appendChild(p.g); if (i !== jI && t <= leaveT(i) + 0.2 && p.g.parentNode !== kidsL) kidsL.insertBefore(p.g, kidsL.firstChild); });
  const j = tp[jI]; aura.update(t, j.headX + 160, j.headY - 160); jtag.update(t, { x: j.headX, y: j.headY }); dtag.update(t, { x: d.headX, y: d.headY }); ptag.update(t, { x: bp[1].headX, y: bp[1].headY });
  joke.update(t, { x: d.headX, y: d.headY });
  haha.forEach((h, i) => { const k = clamp((t - tLaugh - i * 0.3) / 1.3, 0, 1); h.setAttribute("opacity", k > 0 && k < 1 ? 1 - k * 0.5 : 0); h.setAttribute("transform", `translate(${[1440, 2080][i]},${G - 260 - k * 70}) rotate(${[-8, 8][i]})`); });
  voters.forEach(([p, t0, gone], i) => { const c = gone ? { headX: sampleTrack(p.spec.x, t0, 0), headY: G - 160 } : p.update(t); const k = clamp((t - t0) / 0.3, 0, 1); const all = clamp((t - tAll) / 0.3, 0, 1);
    B[i].setAttribute("opacity", Math.max(k * (1 - clamp((t - tLaw + 0.2) / 0.3, 0, 1)), all)); B[i].setAttribute("transform", `translate(${c.headX},${c.headY - 110}) scale(${EASE.back(Math.max(k, all)) * 1.1})`); });
  const kl = clamp((t - tLaw) / 0.3, 0, 1), kc = clamp((t - W("n25", "nature") - 0.25) / 0.2, 0, 1), ke = clamp((t - tEl) / 0.3, 0, 1);
  law.setAttribute("opacity", kl * (1 - ke)); law.setAttribute("transform", `translate(960,470) scale(${0.6 + 0.4 * EASE.back(kl)}) rotate(${kc * 6})`); crack.setAttribute("opacity", kc);
  box.setAttribute("opacity", ke * (1 - clamp((t - D + 0.6) / 0.4, 0, 1))); box.setAttribute("transform", `translate(960,440) scale(${EASE.back(ke)})`);
  ladder.update(t);
};
