/* Paper cut-out storybook rig (art direction #2). Layered paper shapes, no outlines, soft drop shadows between layers, big readable faces.
   SR.Paper(parent, spec) -> { g, update(t), joints, check() }  spec: skin, shirt, pants, shoes, hair, hairStyle, seed, scale, x/y/facing/opacity tracks,
   pose [[t,name,dur,ease]], mood [[t,name,dur,ease]] (names from SR.F5 dials), look [[t,{x,y}]], lips [[t0,id]], talk, prop.
   Faces use the blendable expression dials (face5rig.js F5 table) rendered as paper. Everything is a pure function of t. */
(function () {
  const SR = window.SR, { el, clamp, lerp, sampleTrack, EASE, hash, mulberry32 } = SR;
  const mix = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); k = clamp(k, 0, 1); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join(""); };
  const dark = (h, k = 0.22) => mix(h, "#2a1a10", k), light = (h, k = 0.25) => mix(h, "#ffffff", k);
  let UID = 0, DEFS = null;
  function defs(svg) { if (DEFS && DEFS.ownerSVGElement === svg) return DEFS; DEFS = svg.querySelector("defs") || el("defs", {}, svg);
    if (!svg.querySelector("#pshadow")) { const mk = (id, dy, sd, op) => { const f = el("filter", { id, x: "-20%", y: "-20%", width: "140%", height: "150%" }, DEFS); el("feDropShadow", { dx: 0, dy, stdDeviation: sd, "flood-color": "#2a1a10", "flood-opacity": op }, f); };
      mk("pshadow", 5, 1.6, 0.22); mk("pshadow2", 3, 1.0, 0.25); mk("pshadowL", 9, 3, 0.2);
      const pf = el("filter", { id: "pgrain", x: 0, y: 0, width: "100%", height: "100%" }, DEFS); el("feTurbulence", { type: "fractalNoise", baseFrequency: 0.9, numOctaves: 3, seed: 7, result: "n" }, pf); el("feColorMatrix", { in: "n", type: "saturate", values: 0, result: "g" }, pf);
      const ct = el("feComponentTransfer", { in: "g" }, pf); el("feFuncA", { type: "table", tableValues: "0 0.16" }, ct); }
    return DEFS; }
  SR.paperGrain = (svg) => { defs(svg); return el("rect", { x: 0, y: 0, width: 1920, height: 1080, filter: "url(#pgrain)", style: "mix-blend-mode:multiply", "pointer-events": "none" }, svg); };
  // poses tuned for these proportions (angles in degrees from "down"; + = forward). Front arm: shF/elF, back arm: shB/elB, legs hipF/knF/hipB/knB
  const BASE = { lean: 0, head: 0, crouch: 0, shF: -6, elF: 10, shB: 6, elB: 10, hipF: 3, knF: 0, hipB: -3, knB: 0, armOut: 8 };
  const POSES = SR.PAPER_POSES = {
    stand: {}, relaxed: { shF: -4, elF: 8, shB: 4, elB: 8 }, slump: { lean: 12, head: 14, crouch: 6, shF: 6, elF: 6, shB: 4, elB: 6 },
    proud: { lean: -5, head: -6, shF: -16, elF: 4, shB: 16, elB: 4, armOut: 14 }, hold: { shF: 34, elF: 70, shB: 6, elB: 10 }, holdBoth: { shF: 40, elF: 66, shB: 36, elB: 66 },
    give: { lean: 5, shF: 66, elF: 22, shB: 6, elB: 10 }, point: { shF: 86, elF: 4, shB: 4, elB: 8 }, wave: { shF: 118, elF: 58, shB: 6, elB: 8, head: -3 },
    shrug: { shF: 36, elF: 104, shB: -36, elB: -104, head: 5, armOut: 26 }, hipsHands: { shF: 30, elF: -112, shB: -30, elB: 112, armOut: 22 }, crossed: { shF: 38, elF: 98, shB: 34, elB: 102, armOut: 0 },
    startle: { lean: -10, head: -8, shF: 56, elF: 56, shB: -46, elB: -56, crouch: 3, armOut: 30 }, shout: { lean: 12, head: -5, shF: 26, elF: 38, shB: -18, elB: -28, armOut: 20 },
    facepalm: { head: 16, lean: 5, shF: 112, elF: 142, shB: 6, elB: 8 }, hug: { lean: 7, shF: 66, elF: 70, shB: 58, elB: 64, armOut: 0 }, phone: { head: 12, lean: 3, shF: 28, elF: 96, shB: 6, elB: 8 },
    sit: { crouch: 1, hipF: 88, knF: -88, hipB: 84, knB: -86, shF: 20, elF: 50, shB: 16, elB: 46 }, sitSlump: { crouch: 1, lean: 14, head: 18, hipF: 88, knF: -88, hipB: 84, knB: -86, shF: 28, elF: 24, shB: 24, elB: 22 },
    think: { head: 8, shF: 40, elF: 118, shB: 6, elB: 10 }, cheer: { lean: -6, head: -8, shF: 138, elF: 6, shB: -138, elB: -6, armOut: 34 },
  };
  const FXD = { tears: 0 };
  function Paper(parent, spec) {
    const s = Object.assign({ scale: 1, skin: "#E3AE85", shirt: "#6C5CE7", pants: "#2E3A5A", shoes: "#3B3446", hair: "#1E1B22", hairStyle: "short", seed: 1, body: "avg" }, spec);
    const svg = parent.ownerSVGElement || parent; defs(svg); const id = "p" + (UID++);
    const g = el("g", {}, parent), L = (dy = 1) => el("g", { filter: dy === 2 ? "url(#pshadow2)" : "url(#pshadowL)" }, g);
    // proportions (storybook: big head, short legs)
    const BT = { avg: [1, 1], round: [1.25, 0.95], broad: [1.2, 1.04], slim: [0.88, 1.02], pear: [1.0, 0.95], lanky: [0.9, 1.14] }[s.body] || [1, 1];
    const HR = 92, L1 = 56 * BT[1], L2 = 50 * BT[1], A1 = 68, A2 = 60, TORSO = 150, BW = 78 * BT[0], HIPW = 66 * BT[0], LEGW = 40, ARMW = 34, FOREW = 30;
    const SK = s.skin, SKd = dark(SK, 0.18), SH = s.shirt, SHd = dark(SH, 0.22), PT = s.pants, PTd = dark(PT, 0.2);
    // layers back -> front
    const armB = L(), legB = L(), legF = L(), body = L(), neckG = L(2), headL = L(), faceL = el("g", {}, g), hairL = L(2), armF = L(), propG = el("g", {}, g);
    const cap = (p, col, w) => el("path", { fill: "none", stroke: col, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" }, p);
    const aB = { up: cap(armB, SHd, ARMW), fore: cap(armB, SKd, FOREW), hand: el("path", { fill: SKd }, armB) }, aF = { up: cap(armF, SH, ARMW), fore: cap(armF, SK, FOREW), hand: el("path", { fill: SK }, armF) };
    const lB = { thigh: cap(legB, PTd, LEGW), shin: cap(legB, PTd, LEGW - 4), shoe: el("path", { fill: dark(s.shoes, 0.15) }, legB) }, lF = { thigh: cap(legF, PT, LEGW), shin: cap(legF, PT, LEGW - 4), shoe: el("path", { fill: s.shoes }, legF) };
    const torso = el("path", { fill: SH }, body), torsoShade = el("path", { fill: SHd, opacity: 0.35 }, body), collar = el("path", { fill: light(SH, 0.35) }, body);
    const neck = el("rect", { width: 34, height: 40, rx: 12, fill: SKd }, neckG);
    const head = el("circle", { r: HR, fill: SK }, headL), hairBack = el("path", { fill: s.hair }, headL);
    const hairFront = el("path", { fill: s.hair }, hairL), hairHi = el("path", { fill: light(s.hair, 0.3), opacity: 0.6 }, hairL);
    // ---- face (paper) ----
    const F = el("g", {}, faceL), cheeks = [-1, 1].map((d) => el("circle", { cx: d * 48, cy: 30, r: 15, fill: "#F28C8C", opacity: 0 }, F));
    const eyes = [0, 1].map((i) => { const eg = el("g", {}, F), cp = el("clipPath", { id: `${id}e${i}` }, eg), ce = el("ellipse", {}, cp), white = el("ellipse", { fill: "#FFFFFF" }, eg), inner = el("g", { "clip-path": `url(#${id}e${i})` }, eg);
      const iris = el("circle", { fill: "#2a1a10" }, inner), glint = el("circle", { fill: "#fff" }, inner), lidT = el("path", { fill: SK }, inner), lidB = el("path", { fill: SK }, inner);
      const shut = el("path", { fill: "none", stroke: "#2a1a10", "stroke-width": 6, "stroke-linecap": "round" }, F), brow = el("rect", { x: -22, y: -6, width: 44, height: 12, rx: 6, fill: dark(s.hair, 0.1) }, F);
      return { eg, ce, white, iris, glint, lidT, lidB, shut, brow }; });
    const nose = el("ellipse", { cx: 4, cy: 14, rx: 7, ry: 5, fill: SKd, opacity: 0.8 }, F);
    const mcp = el("clipPath", { id: `${id}m` }, F), mclip = el("path", {}, mcp), mouth = el("path", { fill: "#5A1F2A" }, F), mIn = el("g", { "clip-path": `url(#${id}m)` }, F);
    const tongue = el("ellipse", { fill: "#FF7A8A" }, mIn), teethT = el("rect", { fill: "#fff" }, mIn), teethB = el("rect", { fill: "#fff" }, mIn);
    const mLine = el("path", { fill: "none", stroke: "#2a1a10", "stroke-width": 6, "stroke-linecap": "round" }, F), wob = el("path", { fill: "none", stroke: "#2a1a10", "stroke-width": 6, "stroke-linecap": "round", opacity: 0 }, F);
    const pucker = el("circle", { cy: 44, r: 11, fill: "#E2577A", opacity: 0 }, F), sweat = el("path", { d: "M0,-14 q9,14 0,22 q-9,-8 0,-22 Z", fill: "#7EC8FF", opacity: 0 }, F);
    const tears = [-1, 1].map(() => el("path", { fill: "#7EC8FF", opacity: 0 }, F));
    // ---- motion helpers ----
    const xs = s.x || [[0, 0]], T_END = Math.max(30, xs[xs.length - 1][0] + 5), dist = [];
    { let d = 0, px = sampleTrack(xs, 0, 0); for (let i = 0; i <= T_END * 60; i++) { const xv = sampleTrack(xs, i / 60, 0); d += Math.abs(xv - px); px = xv; dist.push(d); } }
    const distAt = (t) => { const i = clamp(t * 60, 0, dist.length - 1), i0 = Math.floor(i); return lerp(dist[i0], dist[Math.min(dist.length - 1, i0 + 1)], i - i0); };
    const speedAt = (t) => Math.abs(distAt(t + 0.05) - distAt(t - 0.05)) / 0.1;
    const poseOf = (n) => Object.assign({}, BASE, POSES[n] || {}), moodOf = (n) => Object.assign({}, FXD, SR.F5of(n));
    function blend(keys, t, defName, table) { if (!keys || !keys.length) return table(defName); let cur = table(keys[0][1]);
      for (const [t0, name, dur, ez] of keys) { if (t < t0) break; const target = table(name), d = dur ?? 0.35, k = d <= 0 ? 1 : clamp((t - t0) / d, 0, 1), kk = (EASE[ez || "inOut"] || EASE.inOut)(k); const o = {}; for (const key in target) o[key] = lerp(cur[key] ?? target[key], target[key], kk); cur = o; } return cur; }
    const limb = (x0, y0, a1, l1, a2, l2) => { const r1 = a1 * Math.PI / 180, r2 = (a1 + a2) * Math.PI / 180, x1 = x0 + Math.sin(r1) * l1, y1 = y0 + Math.cos(r1) * l1; return [x1, y1, x1 + Math.sin(r2) * l2, y1 + Math.cos(r2) * l2]; };
    const f = (v) => (+v).toFixed(1);
    const handPath = (x, y, ang, k = 1) => `M${x},${y} m${f(-12 * k)},${f(-6 * k)} c${f(-9 * k)},${f(9 * k)} ${f(-9 * k)},${f(26 * k)} 0,${f(34 * k)} c${f(9 * k)},${f(8 * k)} ${f(24 * k)},${f(6 * k)} ${f(28 * k)},${f(-6 * k)} c${f(3 * k)},${f(-9 * k)} ${f(2 * k)},${f(-16 * k)} ${f(-2 * k)},${f(-22 * k)} l${f(10 * k)},${f(-6 * k)} c${f(8 * k)},${f(-8 * k)} ${f(2 * k)},${f(-18 * k)} ${f(-8 * k)},${f(-12 * k)} l${f(-10 * k)},${f(6 * k)} c${f(-6 * k)},${f(-6 * k)} ${f(-14 * k)},${f(-4 * k)} ${f(-18 * k)},0 Z`;
    const hairPaths = () => { switch (s.hairStyle) {
      case "bun": return [`M-92,-20 C-92,-112 92,-112 92,-20 Q60,-74 20,-66 Q-30,-86 -92,-20 Z`, "", `M-40,-124 a40,40 0 1 0 80,0 a40,40 0 1 0 -80,0 Z`, "M-64,-70 Q-16,-98 36,-80"];
      case "short": return [`M-92,-20 C-92,-112 92,-112 92,-20 Q84,-52 68,-76 Q40,-50 8,-82 Q-30,-48 -60,-80 Q-84,-48 -92,-20 Z`, "", "", "M-60,-78 Q-10,-100 40,-80"];
      case "curly": return [`M-100,-10 Q-112,-62 -70,-78 Q-60,-122 -10,-112 Q30,-132 60,-102 Q106,-92 100,-42 Q112,-12 92,-2 Q60,-66 10,-60 Q-40,-76 -100,-10 Z`, "", `M-100,-10 Q-112,-62 -70,-78 Q-60,-122 -10,-112 Q30,-132 60,-102 Q106,-92 100,-42 Q112,-12 92,-2 L92,10 L-100,10 Z`, ""];
      case "ponytail": return [`M-92,-20 C-92,-112 92,-112 92,-20 Q40,-82 -20,-68 Q-60,-78 -92,-20 Z`, `M-60,-40 Q-150,-20 -130,80 Q-110,110 -90,80 Q-100,10 -50,-10 Z`, "", "M-60,-78 Q0,-100 50,-80"];
      case "long": return [`M-92,-20 C-92,-112 92,-112 92,-20 Q30,-80 -40,-64 Q-80,-72 -92,-20 Z`, `M-98,-20 Q-120,80 -90,150 L90,150 Q120,80 98,-20 Z`, "", "M-50,-80 Q0,-100 50,-80"];
      case "cap": return [`M-100,-40 A100,100 0 0 1 100,-40 L100,-28 L-100,-28 Z M60,-34 L150,-20 L140,-2 L60,-14 Z`, "", "", ""];
      case "afro": return [`M-110,10 a110,104 0 1 1 220,0 Q100,-40 80,-30 Q0,-80 -80,-30 Q-100,-40 -110,10 Z`, "", "", ""];
      case "spiky": return [`M-92,-30 L-86,-90 L-58,-70 L-40,-130 L-10,-80 L14,-144 L38,-80 L62,-124 L76,-70 L92,-86 L92,-30 Q0,-62 -92,-30 Z`, "", "", ""];
      default: return ["", "", "", ""]; } };
    let joints = {}, VISM = null;
    function update(t) {
      const x = sampleTrack(xs, t, 0), y = sampleTrack(s.y, t, 900), facing = sampleTrack(s.facing, t, 1) >= 0 ? 1 : -1, sc = sampleTrack(s.scaleT, t, s.scale), vis = sampleTrack(s.opacity, t, 1);
      const P = blend(s.pose, t, "stand", poseOf), D = blend(s.mood, t, "neutral", moodOf), look = sampleTrack(s.look, t, { x: 0, y: 0 });
      const spd = speedAt(t), w = clamp(spd / (150 * sc), 0, 1) * (s.noWalk ? 0 : 1), stride = 150 * sc, ph = (distAt(t) / stride) * Math.PI * 2, sw = Math.sin(ph);
      P.hipF += 28 * sw * w; P.hipB -= 28 * sw * w; P.knF -= 40 * Math.max(0, Math.cos(ph)) * w; P.knB -= 40 * Math.max(0, -Math.cos(ph)) * w; P.shF -= 22 * sw * w; P.shB += 22 * sw * w; P.elF += 16 * w; P.elB += 16 * w; P.lean += 3 * w;
      const bob = -Math.abs(Math.cos(ph)) * 5 * w, breath = Math.sin(t * 2 * Math.PI / 3.6 + s.seed) * 2 * (1 - w);
      let squash = 0; if (s.mood) for (const [t0] of s.mood) { const k = (t - t0) / 0.3; if (k > 0 && k < 1) squash += Math.sin(k * Math.PI) * 0.04; }
      const sitting = P.hipF > 60, hipY = -(L1 + L2 + 10) + (sitting ? L1 + 4 : 0) + P.crouch + bob, leanR = P.lean * Math.PI / 180;
      const P2 = (px, py) => { const dy = py - hipY; return [px * Math.cos(leanR) - dy * Math.sin(leanR), hipY + px * Math.sin(leanR) + dy * Math.cos(leanR)]; };
      const nyU = hipY - TORSO + breath;
      // legs
      const [kxF, kyF, axF, ayF] = limb(10, hipY, P.hipF, L1, P.knF, L2), [kxB, kyB, axB, ayB] = limb(-10, hipY, P.hipB, L1, P.knB, L2);
      const leg = (Lg, hx, kx, ky, ax, ay) => { Lg.thigh.setAttribute("d", `M${hx},${hipY} L${f(kx)},${f(ky)}`); Lg.shin.setAttribute("d", `M${f(kx)},${f(ky)} L${f(ax)},${f(ay)}`); const fy = ay + 10; Lg.shoe.setAttribute("d", `M${f(ax - 24)},${f(fy - 8)} Q${f(ax - 26)},${f(fy - 30)} ${f(ax - 4)},${f(fy - 30)} Q${f(ax + 18)},${f(fy - 30)} ${f(ax + 30)},${f(fy - 14)} Q${f(ax + 38)},${f(fy + 2)} ${f(ax + 24)},${f(fy + 2)} L${f(ax - 20)},${f(fy + 2)} Q${f(ax - 28)},${f(fy + 2)} ${f(ax - 24)},${f(fy - 8)} Z`); };
      leg(lF, 10, kxF, kyF, axF, ayF); leg(lB, -10, kxB, kyB, axB, ayB);
      // torso: paper shape, shoulders > hips, a lighter collar and a shade band on the back side
      const T = [[-BW, nyU], [BW, nyU], [HIPW, hipY + 10], [-HIPW, hipY + 10]].map(([a, b]) => P2(a, b));
      torso.setAttribute("d", `M${f(T[0][0])},${f(T[0][1])} Q${f(P2(0, nyU - 26)[0])},${f(P2(0, nyU - 26)[1])} ${f(T[1][0])},${f(T[1][1])} Q${f(P2(BW + 8, (nyU + hipY) / 2)[0])},${f(P2(BW + 8, (nyU + hipY) / 2)[1])} ${f(T[2][0])},${f(T[2][1])} Q${f(P2(0, hipY + 22)[0])},${f(P2(0, hipY + 22)[1])} ${f(T[3][0])},${f(T[3][1])} Q${f(P2(-BW - 8, (nyU + hipY) / 2)[0])},${f(P2(-BW - 8, (nyU + hipY) / 2)[1])} ${f(T[0][0])},${f(T[0][1])} Z`);
      const S1 = P2(-BW, nyU), S2 = P2(-BW * 0.45, nyU - 8), S3 = P2(-HIPW * 0.4, hipY + 10), S4 = P2(-HIPW, hipY + 10); torsoShade.setAttribute("d", `M${f(S1[0])},${f(S1[1])} L${f(S2[0])},${f(S2[1])} L${f(S3[0])},${f(S3[1])} L${f(S4[0])},${f(S4[1])} Z`);
      const C1 = P2(-30, nyU - 8), C2 = P2(30, nyU - 8), C3 = P2(0, nyU + 20); collar.setAttribute("d", `M${f(C1[0])},${f(C1[1])} Q${f(P2(0, nyU - 22)[0])},${f(P2(0, nyU - 22)[1])} ${f(C2[0])},${f(C2[1])} L${f(C3[0])},${f(C3[1])} Z`);
      // arms
      const out = P.armOut, [shx, shy] = P2(BW - 16, nyU + 14), [sbx, sby] = P2(-BW + 16, nyU + 14);
      const [exF, eyF, hxF, hyF] = limb(shx, shy, P.shF + out * 0.2 + P.lean, A1, P.elF, A2), [exB, eyB, hxB, hyB] = limb(sbx, sby, P.shB - out * 0.2 + P.lean, A1, P.elB, A2);
      const arm = (A, sx, sy, ex, ey, hx, hy, ang) => { A.up.setAttribute("d", `M${f(sx)},${f(sy)} L${f(ex)},${f(ey)}`); A.fore.setAttribute("d", `M${f(ex)},${f(ey)} L${f(hx)},${f(hy)}`); A.hand.setAttribute("d", handPath(0, 0, 0, 1.05)); A.hand.setAttribute("transform", `translate(${f(hx)},${f(hy)}) rotate(${f(-ang)})`); };
      arm(aF, shx, shy, exF, eyF, hxF, hyF, P.shF + P.elF + P.lean); arm(aB, sbx, sby, exB, eyB, hxB, hyB, P.shB + P.elB + P.lean);
      // neck + head
      const [nx, ny] = P2(0, nyU - 4); neck.setAttribute("x", f(nx - 17)); neck.setAttribute("y", f(ny - 36)); const [hX, hY] = P2(0, nyU - 30 - HR + 6);
      const trm = 0, tilt = P.head * 0.5 + Math.sin(t * 1.1 + s.seed) * 1.2;
      const headTf = `translate(${f(hX)},${f(hY)}) rotate(${f(tilt)}) scale(${f(1 + squash + D.sq)},${f(1 - squash - D.sq)})`; headL.setAttribute("transform", headTf); faceL.setAttribute("transform", headTf); hairL.setAttribute("transform", headTf);
      const [hf, hb, hextra, hh] = hairPaths(); hairFront.setAttribute("d", hf + " " + hextra); hairBack.setAttribute("d", hb); hairHi.setAttribute("d", hh ? hh + " l0,0" : ""); hairHi.setAttribute("stroke", light(s.hair, 0.3)); hairHi.setAttribute("stroke-width", 8); hairHi.setAttribute("fill", "none"); hairHi.setAttribute("stroke-linecap", "round");
      // ---- face from dials ----
      const blink = ((t + s.seed * 1.37) % 3.9) < 0.1 ? 1 - Math.sin((((t + s.seed * 1.37) % 3.9) / 0.1) * Math.PI) : 1, dart = (hash(Math.floor((t + s.seed) / 1.9), s.seed + 5) - 0.5) * 0.4;
      F.setAttribute("transform", `translate(${f(facing * 6)},0)`);
      const lx = clamp(look.x + D.gx + dart, -1, 1), ly = clamp(look.y + D.gy, -1, 1);
      cheeks.forEach((c) => c.setAttribute("opacity", clamp(Math.max(D.ch * 0.5, D.bl * 0.85), 0, 0.9).toFixed(2)));
      eyes.forEach((E, i) => { const d = i ? 1 : -1, eo = Math.max(0, (i ? D.eoR : D.eoL) * blink), ld = i ? D.ldR : D.ldL, arc = i ? D.arcR : D.arcL, ex = d * 36, ey = -8;
        const rx = 22 + Math.max(0, eo - 1) * 14, ry = Math.max(1, 26 * Math.min(eo, 1) + Math.max(0, eo - 1) * 22), vis = eo > 0.14 ? 1 : 0;
        E.eg.setAttribute("transform", `translate(${ex},${ey})`); E.eg.setAttribute("opacity", vis); [E.white, E.ce].forEach((n) => { n.setAttribute("rx", f(rx)); n.setAttribute("ry", f(ry)); });
        const pr = 12 * D.pup * (1 - 0.2 * Math.max(0, eo - 1)), px = 2 + lx * 8, py = 2 + ly * 9; E.iris.setAttribute("r", f(pr)); E.iris.setAttribute("cx", f(px)); E.iris.setAttribute("cy", f(py)); E.glint.setAttribute("r", f(pr * 0.36)); E.glint.setAttribute("cx", f(px - 4)); E.glint.setAttribute("cy", f(py - 5));
        const top = -ry - 4, edge = -ry + ld * ry * 1.9, tl = Math.abs(D.la) * 14, inX = -d * 26, outX = d * 26, yIn = edge + (D.la > 0 ? tl : 0), yOut = edge + (D.la < 0 ? tl : 0), drop = ld > 0.02 || Math.abs(D.la) > 0.05;
        E.lidT.setAttribute("d", drop ? `M${inX},${top} L${outX},${top} L${outX},${f(yOut)} L${inX},${f(yIn)} Z` : "M0,0"); E.lidT.setAttribute("opacity", drop ? 1 : 0);
        const by = ry - D.lb * ry * 0.9; E.lidB.setAttribute("d", D.lb > 0.02 ? `M-30,${ry + 6} L30,${ry + 6} L30,${f(by + 4)} Q0,${f(by - 6)} -30,${f(by + 4)} Z` : "M0,0"); E.lidB.setAttribute("opacity", D.lb > 0.02 ? 1 : 0);
        E.shut.setAttribute("d", `M${ex - 22},${f(ey + 6 * arc)} Q${ex},${f(ey - 22 * arc)} ${ex + 22},${f(ey + 6 * arc)}`); E.shut.setAttribute("opacity", 1 - vis);
        const br = i ? D.brR : D.brL, ba = i ? D.baR : D.baL; E.brow.setAttribute("transform", `translate(${ex},${f(-52 - br * 1.6 - Math.max(0, eo - 1) * 16)}) rotate(${f(ba)})`); });
      // mouth
      let mo = D.mo, rnd = D.rnd, tt = D.teeth, tb = D.tb, tg = D.tg, sm = D.sm, wb = D.wob, pk = D.pk;
      if (VISM) { const op = (VISM.top + VISM.bot) / 14; mo = Math.max(mo * 0.35, op); rnd = Math.max(rnd * 0.5, VISM.round); tt = Math.max(tt * 0.5, VISM.tt * clamp(op * 2, 0, 1)); tb = Math.max(tb * 0.3, VISM.tb * clamp(op * 2, 0, 1)); tg = Math.max(tg * 0.5, VISM.tg * 0.8); sm *= 0.7; wb *= 0.25; pk *= 0.2; }
      const cy = 44, mw = Math.max(10, 30 + Math.max(0, sm) * 10 + mo * 8 - rnd * 16 - pk * 14), lift = sm * 12, as = D.asym * 14;
      const Lx = -mw, Rx = mw, Ly = cy - lift + as * 0.2, Ry = cy - lift - as, mid = cy + sm * 8 * (1 - rnd), topY = mid - mo * (8 + rnd * 12) - Math.max(0, sm) * mo * 5, botY = mid + mo * (24 + Math.max(0, sm) * 20 + rnd * 10), k = lerp(0.5, 1.05, rnd);
      const d = `M${f(Lx)},${f(Ly)} C${f(Lx * k * 0.6)},${f(topY)} ${f(Rx * k * 0.6)},${f(topY)} ${f(Rx)},${f(Ry)} C${f(Rx * k)},${f(botY)} ${f(Lx * k)},${f(botY)} ${f(Lx)},${f(Ly)} Z`, open = mo > 0.06;
      mouth.setAttribute("d", d); mclip.setAttribute("d", d); mouth.setAttribute("opacity", open ? 1 : 0); mIn.setAttribute("opacity", open ? 1 : 0);
      mLine.setAttribute("d", `M${f(Lx)},${f(Ly)} Q0,${f(mid + sm * 6)} ${f(Rx)},${f(Ry)}`); mLine.setAttribute("opacity", open ? 0 : clamp(1 - wb * 1.6, 0, 1) * (1 - clamp(pk * 2 - 0.6, 0, 1)));
      teethT.setAttribute("x", Lx); teethT.setAttribute("width", 2 * mw); teethT.setAttribute("y", f(topY - 6)); teethT.setAttribute("height", f(Math.max(0, tt * (8 + mo * 8)))); teethB.setAttribute("x", Lx); teethB.setAttribute("width", 2 * mw); teethB.setAttribute("y", f(botY - tb * (6 + mo * 6))); teethB.setAttribute("height", f(tb * 16));
      tongue.setAttribute("cx", 0); tongue.setAttribute("cy", f(botY - 4)); tongue.setAttribute("rx", f(mw * 0.55)); tongue.setAttribute("ry", f(6 + 10 * tg * mo)); tongue.setAttribute("opacity", clamp(tg * 1.5, 0, 1));
      wob.setAttribute("d", `M-28,${f(cy + 10 - sm * 4)} q9,-11 18,0 q9,11 18,0 q9,-11 18,0`); wob.setAttribute("opacity", open ? 0 : clamp(wb * 1.6 - 0.2, 0, 1)); pucker.setAttribute("opacity", clamp(pk * 2 - 0.6, 0, 1));
      sweat.setAttribute("opacity", clamp(D.sw, 0, 1)); sweat.setAttribute("transform", `translate(${f(facing * 74)},${f(-50 + ((t * 0.6) % 1) * 16 * D.sw)})`);
      tears.forEach((p, i) => { const dd = i ? 1 : -1, Lt = D.tr; p.setAttribute("d", `M${dd * 36 - 8},10 Q${dd * 36 - 12},${f(10 + 40 * Lt)} ${dd * 36},${f(14 + 70 * Lt)} Q${dd * 36 + 12},${f(10 + 40 * Lt)} ${dd * 36 + 8},10 Z`); p.setAttribute("opacity", clamp(Lt * 1.8, 0, 0.95).toFixed(2)); });
      // lips (viseme) for the next frame's mouth
      VISM = null;
      if (s.lips && window.SR_LIPS) for (const [a, cid] of s.lips) { const Lp = window.SR_LIPS[cid]; if (!Lp || !Lp.vis) continue; const tl = t - a, last = Lp.vis[Lp.vis.length - 1][0]; if (tl < -0.05 || tl > last + 0.12) continue;
        let i = 0; while (i + 1 < Lp.vis.length && Lp.vis[i + 1][0] <= tl) i++; const VIS = SR.VIS5; const cur = VIS[Lp.vis[i][1]] || VIS.X, nx = Lp.vis[i + 1], nxt = nx ? (VIS[nx[1]] || VIS.X) : VIS.X, gap = nx ? nx[0] - Lp.vis[i][0] : 1, lead = Math.min(0.075, gap * 0.6), u = nx ? EASE.inOut(clamp((tl - (nx[0] - lead)) / lead, 0, 1)) : 0;
        VISM = {}; for (const kk in VIS.X) VISM[kk] = lerp(cur[kk], nxt[kk], u); const fi = Math.floor(tl * Lp.fps), en = fi >= 0 && fi < Lp.env.length ? Lp.env[fi] : 0, gg = clamp(0.55 + 0.65 * en, 0.5, 1.15); VISM.top *= gg; VISM.bot *= gg; }
      if (s.prop && s.prop.kind) { propG.setAttribute("transform", `translate(${f(hxF)},${f(hyF)})`); if (!propG.firstChild && SR.buildProp) SR.buildProp(propG, s.prop.kind); propG.setAttribute("opacity", sampleTrack(s.prop.show, t, 1)); }
      const idle = (1 - w) * 0.012 * Math.sin(t * 2.3 + s.seed * 1.7);
      g.setAttribute("transform", `translate(${f(x)},${f(y)}) scale(${f(sc * facing)},${f(sc * (1 - squash * 0.5 + idle))})`); g.setAttribute("opacity", vis);
      joints = { x, y, sc, facing, sitting, headX: x + hX * sc * facing, headY: y + hY * sc, headR: HR * sc, handF: [x + hxF * sc * facing, y + hyF * sc], handB: [x + hxB * sc * facing, y + hyB * sc], elbowF: P.elF, elbowB: P.elB, kneeF: P.knF, kneeB: P.knB,
        footF: [x + axF * sc * facing, y + (ayF + 12) * sc], footB: [x + axB * sc * facing, y + (ayB + 12) * sc], hipY: y + hipY * sc, walk: w, step: Math.floor((distAt(t) / stride) * 2) };
      return joints;
    }
    // ---- correctness checks (run after update) ----
    function check(ground) { const J = joints, out = [], inHead = (p) => Math.hypot(p[0] - J.headX, p[1] - J.headY) < J.headR * 0.95;
      if (inHead(J.handF)) out.push("front hand inside head"); if (inHead(J.handB)) out.push("back hand inside head");
      if (J.elbowF < -8 && !/shrug|hipsHands|startle|shout|cheer/.test(cur(s.pose))) out.push("front elbow bends backward"); if (J.kneeF > 6 || J.kneeB > 6) out.push("knee bends forward");
      if (ground != null && !J.sitting && J.walk < 0.2 && Math.abs(J.footF[1] - ground) > 9 * J.sc) out.push(`feet not on ground (${Math.round(J.footF[1] - ground)}px)`);
      return out; }
    const cur = (keys) => { if (!keys) return "stand"; let n = keys[0][1]; for (const k of keys) if (k[0] <= lastT) n = k[1]; return n; }; let lastT = 0; const upd = (t) => { lastT = t; return update(t); };
    return { g, update: upd, check, spec: s, get joints() { return joints; } };
  }
  // viseme table (same codes as the engine's lip-sync files)
  SR.VIS5 = { X: { w: 8.5, top: 0, bot: 0, round: 0, tt: 0, tb: 0, tg: 0 }, P: { w: 7.6, top: 0, bot: 0, round: 0.1, tt: 0, tb: 0, tg: 0 }, A: { w: 10, top: 4.2, bot: 10.5, round: 0.15, tt: 1, tb: 0.25, tg: 0.75 }, E: { w: 12, top: 2.6, bot: 5, round: 0, tt: 1, tb: 0.9, tg: 0.2 },
    O: { w: 6.6, top: 4, bot: 8, round: 1, tt: 0.35, tb: 0, tg: 0.35 }, U: { w: 4.6, top: 2.2, bot: 3.6, round: 1, tt: 0, tb: 0, tg: 0 }, F: { w: 9.5, top: 1.4, bot: 2.2, round: 0, tt: 1, tb: 0, tg: 0 }, L: { w: 9.2, top: 3, bot: 6.5, round: 0.1, tt: 1, tb: 0.4, tg: 1 },
    T: { w: 9.6, top: 2.2, bot: 3.8, round: 0, tt: 1, tb: 0.8, tg: 0.4 }, C: { w: 10.2, top: 1.9, bot: 3.6, round: 0.05, tt: 1, tb: 1, tg: 0.15 }, R: { w: 7.4, top: 2.4, bot: 4.2, round: 0.6, tt: 0.7, tb: 0.2, tg: 0.3 } };
  SR.Paper = Paper;
})();
