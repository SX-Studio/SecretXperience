/* Social Ripple engine: stick-figure rig, sets and ripple device, all drawn as SVG
   from timeline time alone (seek-safe). Load once in index.html; scenes use window.SR. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const PAL = {
    ink: "#1E1B22", paper: "#FBF4EA", white: "#FFFFFF",
    rude: "#E2412F", kind: "#F2B33D", calm: "#5DA9A6",
    terracotta: "#D9785B", sage: "#9DB49A", slate: "#6F8299", sand: "#E8C79B", plum: "#8C5E78",
    teal: "#3F7F87", mustard: "#D9A441", rose: "#D98C8C", navy: "#2F3E5C", forest: "#4E6E58",
    street: "#77736F", walk: "#CFC6BA", curb: "#B3AAA0", glass: "#BFD8DE", wood: "#A8754F",
  };
  const SKY = {
    morning: ["#F7D3B5", "#FBE6D2"], noon: ["#CDE4EC", "#E6F1F4"], evening: ["#EFA27C", "#F6C79F"],
    night: ["#27324A", "#3A4763"], indoor: ["#EFE3D3", "#E6D5C0"], rain: ["#AEB8C2", "#C9D1D8"],
  };

  // ---------- helpers ----------
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const smooth = (k) => k * k * (3 - 2 * k);
  const EASE = {
    linear: (k) => k,
    inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    out: (k) => 1 - Math.pow(1 - k, 3),
    in: (k) => k * k * k,
    back: (k) => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    smooth,
  };
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(n, seed) { return mulberry32((n * 2654435761) ^ (seed || 7))(); }

  // Keyframe track: [[t, value, ease?], ...]; values are numbers or objects of numbers.
  function sampleTrack(keys, t, def) {
    if (!keys || !keys.length) return def;
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, ez] = keys[i];
      const [t0, v0] = keys[i - 1];
      if (t < t1) {
        const k = (EASE[ez || "inOut"] || EASE.inOut)((t - t0) / Math.max(1e-6, t1 - t0));
        if (typeof v0 === "number") return lerp(v0, v1, k);
        const o = {};
        for (const key in v1) o[key] = lerp(v0[key] ?? v1[key], v1[key], k);
        return o;
      }
    }
    return keys[keys.length - 1][1];
  }

  // ---------- poses (degrees; 0 = straight down, + = toward facing) ----------
  const BASE = { lean: 0, head: 0, crouch: 0, shF: -8, elF: 10, shB: 8, elB: 10, hipF: 4, knF: 0, hipB: -4, knB: 0, armOut: 10 };
  const POSES = {
    stand: {},
    relaxed: { shF: -4, elF: 6, shB: 4, elB: 6 },
    slump: { lean: 14, head: 16, crouch: 6, shF: 4, elF: 4, shB: 2, elB: 4, armOut: 4 },
    proud: { lean: -6, head: -8, shF: -14, elF: 0, shB: 14, elB: 0, armOut: 16 },
    phone: { head: 14, lean: 4, shF: 30, elF: 95, shB: 6, elB: 8 },
    phoneUp: { head: 4, shF: 50, elF: 100, shB: 6, elB: 8 },
    hold: { shF: 32, elF: 70, shB: 6, elB: 10 },
    holdBoth: { shF: 34, elF: 70, shB: 30, elB: 70 },
    give: { lean: 6, shF: 70, elF: 15, shB: 6, elB: 10 },
    point: { shF: 88, elF: 2, shB: 4, elB: 8 },
    wave: { shF: 150, elF: 25, shB: 6, elB: 8, head: -4 },
    shrug: { shF: 40, elF: 110, shB: -40, elB: -110, head: 6, armOut: 30 },
    hipsHands: { shF: 32, elF: -120, shB: -32, elB: 120, armOut: 26 },
    crossed: { shF: 40, elF: 100, shB: 36, elB: 104, armOut: 0 },
    startle: { lean: -12, head: -10, shF: 60, elF: 60, shB: -50, elB: -60, crouch: 4, armOut: 34 },
    shout: { lean: 14, head: -6, shF: 28, elF: 40, shB: -20, elB: -30, armOut: 24 },
    facepalm: { head: 18, lean: 6, shF: 120, elF: 150, shB: 6, elB: 8 },
    sit: { crouch: 62, hipF: 88, knF: -88, hipB: 84, knB: -86, shF: 20, elF: 50, shB: 16, elB: 46 },
    sitSlump: { crouch: 64, lean: 16, head: 20, hipF: 88, knF: -88, hipB: 84, knB: -86, shF: 30, elF: 20, shB: 26, elB: 20 },
    sitPhone: { crouch: 62, head: 16, hipF: 88, knF: -88, hipB: 84, knB: -86, shF: 30, elF: 95, shB: 10, elB: 30 },
    hug: { lean: 8, shF: 85, elF: 60, shB: 80, elB: 60, armOut: 0 },
    drive: { crouch: 50, hipF: 80, knF: -60, hipB: 78, knB: -62, shF: 75, elF: 25, shB: 70, elB: 25 },
    honk: { crouch: 50, lean: 10, hipF: 80, knF: -60, hipB: 78, knB: -62, shF: 60, elF: 40, shB: 70, elB: 25, head: -6 },
    kneel: { crouch: 40, hipF: 80, knF: -80, hipB: -20, knB: -100, shF: 40, elF: 30, shB: 10, elB: 20, lean: 10 },
  };
  function poseOf(name) { return Object.assign({}, BASE, POSES[name] || {}); }

  // ---------- moods: eye + mouth parameters ----------
  const MOODS = {
    neutral: { open: 1, lid: 0, slant: 0, size: 1, look: 0, happy: 0, smile: 0, mouth: 0, mopen: 0, brow: 0 },
    content: { open: 1, lid: 0.1, slant: 0, size: 1, look: 0, happy: 0, smile: 0.5, mouth: 0.8, mopen: 0, brow: 0 },
    happy: { open: 1, lid: 0, slant: 0, size: 1, look: 0, happy: 1, smile: 1, mouth: 1, mopen: 0.2, brow: 0 },
    joy: { open: 1, lid: 0, slant: 0, size: 1.05, look: 0, happy: 1, smile: 1, mouth: 1, mopen: 0.8, brow: 0 },
    sad: { open: 1, lid: 0.35, slant: -0.8, size: 0.95, look: 0.7, happy: 0, smile: -0.7, mouth: 0.8, mopen: 0, brow: 0 },
    tired: { open: 1, lid: 0.55, slant: 0, size: 1, look: 0.4, happy: 0, smile: -0.2, mouth: 0.6, mopen: 0, brow: 0 },
    annoyed: { open: 1, lid: 0.4, slant: 0.6, size: 1, look: 0, happy: 0, smile: -0.5, mouth: 0.8, mopen: 0, brow: 0 },
    angry: { open: 1, lid: 0.45, slant: 1, size: 1, look: 0, happy: 0, smile: -0.9, mouth: 1, mopen: 0.5, brow: 1 },
    shock: { open: 1, lid: 0, slant: 0, size: 1.3, look: 0, happy: 0, smile: 0, mouth: 1, mopen: 1, brow: 0 },
    worried: { open: 1, lid: 0.2, slant: -0.6, size: 1.05, look: 0.2, happy: 0, smile: -0.4, mouth: 0.8, mopen: 0.2, brow: 0 },
    surprised: { open: 1, lid: 0, slant: -0.2, size: 1.2, look: 0, happy: 0, smile: 0.2, mouth: 0.8, mopen: 0.6, brow: 0 },
    closed: { open: 0, lid: 0, slant: 0, size: 1, look: 0, happy: 0, smile: 0.2, mouth: 0.5, mopen: 0, brow: 0 },
  };

  // ---------- character ----------
  // spec: { id, color, pants, hair: 'none'|'ponytail'|'bun'|'cap'|'short'|'curly', hairColor, glasses, dress,
  //         scale, x:[[t,x,ease]], y:[[t,y]], facing:[[t,±1]], pose:[[t,'name',dur]], mood:[[t,'name',dur]],
  //         look:[[t,lx,ly]] (pupil offset -1..1), walk:'walk'|'run', prop:{kind, from, to}, seed }
  function Character(parent, spec) {
    const s = Object.assign({ scale: 1, color: PAL.terracotta, pants: PAL.ink, hair: "none", hairColor: PAL.ink, seed: 3 }, spec);
    const g = el("g", { id: s.id }, parent);
    const body = el("g", {}, g);
    const S = 1;
    // geometry
    const LEG1 = 64, LEG2 = 60, ARM1 = 54, ARM2 = 50, TORSO = 96, HEADR = 36, NECK = 10;
    const strokeW = 10;
    const shadow = el("ellipse", { cx: 0, cy: 2, rx: 46, ry: 8, fill: "rgba(30,27,34,0.16)" }, body);
    const legB = el("path", { fill: "none", stroke: s.pants, "stroke-width": strokeW + 1, "stroke-linecap": "round", "stroke-linejoin": "round" }, body);
    const armB = el("path", { fill: "none", stroke: PAL.ink, "stroke-width": strokeW - 1, "stroke-linecap": "round", "stroke-linejoin": "round" }, body);
    const sleeveB = el("path", { fill: "none", stroke: s.color, "stroke-width": strokeW + 7, "stroke-linecap": "round" }, body);
    const legF = el("path", { fill: "none", stroke: s.pants, "stroke-width": strokeW + 1, "stroke-linecap": "round", "stroke-linejoin": "round" }, body);
    const shoeB = el("ellipse", { rx: 11, ry: 6, fill: PAL.ink }, body);
    const shoeF = el("ellipse", { rx: 11, ry: 6, fill: PAL.ink }, body);
    const torso = el("path", { fill: s.color, stroke: "none" }, body);
    const torsoShade = el("path", { fill: "rgba(0,0,0,0.10)" }, body);
    const headG = el("g", {}, body);
    const hairBack = el("path", { fill: s.hairColor }, headG);
    const head = el("circle", { r: HEADR, fill: PAL.ink }, headG);
    const hairFront = el("path", { fill: s.hairColor }, headG);
    const eyes = [0, 1].map(() => {
      const eg = el("g", {}, headG);
      const white = el("ellipse", { rx: 9, ry: 11, fill: PAL.white }, eg);
      const pupil = el("circle", { r: 4.6, fill: PAL.ink }, eg);
      const lid = el("path", { fill: PAL.ink }, eg);
      const arc = el("path", { fill: "none", stroke: PAL.white, "stroke-width": 4.5, "stroke-linecap": "round" }, eg);
      return { eg, white, pupil, lid, arc };
    });
    const mouth = el("path", { fill: PAL.white, stroke: PAL.white, "stroke-width": 3.4, "stroke-linecap": "round", "stroke-linejoin": "round" }, headG);
    const glasses = s.glasses ? el("g", {}, headG) : null;
    if (glasses) { el("circle", { cx: -13, cy: -4, r: 13, fill: "none", stroke: PAL.white, "stroke-width": 2.6 }, glasses); el("circle", { cx: 13, cy: -4, r: 13, fill: "none", stroke: PAL.white, "stroke-width": 2.6 }, glasses); el("path", { d: "M-1,-5 L1,-5", stroke: PAL.white, "stroke-width": 2.6 }, glasses); }
    const sleeveF = el("path", { fill: "none", stroke: s.color, "stroke-width": strokeW + 7, "stroke-linecap": "round" }, body);
    const armF = el("path", { fill: "none", stroke: PAL.ink, "stroke-width": strokeW - 1, "stroke-linecap": "round", "stroke-linejoin": "round" }, body);
    const handF = el("circle", { r: 7.5, fill: PAL.ink }, body);
    const handB = el("circle", { r: 7.5, fill: PAL.ink }, body);
    const propG = el("g", {}, body);
    let prop = null;

    // hair shapes (local head coords, head centred at 0,0, facing right)
    function hairPaths(facing) {
      const f = facing;
      switch (s.hair) {
        case "ponytail": return [`M${-30 * f},-6 Q${-62 * f},4 ${-52 * f},40 Q${-40 * f},14 ${-24 * f},10 Z`, `M-36,-6 Q-30,-40 0,-40 Q32,-40 36,-6 Q10,-26 -36,-6 Z`];
        case "bun": return [`M${-6 * f},-46 m-14,0 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0`, `M-36,-6 Q-30,-40 0,-40 Q32,-40 36,-6 Q0,-24 -36,-6 Z`];
        case "short": return ["", `M-37,-2 Q-36,-42 0,-42 Q40,-42 37,-4 Q${18 * f},-24 -37,-2 Z`];
        case "curly": return ["", "M-40,0 q-6,-14 4,-22 q-2,-16 14,-18 q8,-12 22,-6 q14,-6 22,6 q16,4 14,20 q8,10 2,22 q-16,-18 -78,-2 z"];
        case "cap": return ["", `M-38,-8 Q-34,-44 2,-44 Q36,-42 38,-8 Z M${30 * f},-12 L${62 * f},-6 L${36 * f},-2 Z`];
        case "long": return [`M-38,-4 Q-46,48 -30,62 L30,62 Q46,48 38,-4 Z`, `M-37,-4 Q-34,-42 0,-42 Q34,-42 37,-4 Q${16 * f},-26 -37,-4 Z`];
        default: return ["", ""];
      }
    }

    // walk cycle: precompute cumulative distance along x track (60 Hz), seek-safe
    const xs = s.x || [[0, 0]];
    const T_END = Math.max(30, xs[xs.length - 1][0] + 5);
    const dist = [];
    { let d = 0, px = sampleTrack(xs, 0, 0); for (let i = 0; i <= T_END * 60; i++) { const xv = sampleTrack(xs, i / 60, 0); d += Math.abs(xv - px); px = xv; dist.push(d); } }
    function distAt(t) { const i = clamp(t * 60, 0, dist.length - 1); const i0 = Math.floor(i); return lerp(dist[i0], dist[Math.min(dist.length - 1, i0 + 1)], i - i0); }
    function speedAt(t) { return Math.abs(distAt(t + 0.05) - distAt(t - 0.05)) / 0.1; }

    function trackName(keys, t, defName, table) {
      // keys: [[t, name, dur]] -> blended param object
      if (!keys || !keys.length) return table(defName);
      let cur = table(keys[0][1]);
      for (let i = 0; i < keys.length; i++) {
        const [t0, name, dur, ez] = keys[i];
        if (t < t0) break;
        const prev = cur;
        const target = table(name);
        const d = dur ?? 0.35;
        const k = d <= 0 ? 1 : clamp((t - t0) / d, 0, 1);
        const kk = (EASE[ez || "back"] || EASE.back)(k);
        const o = {};
        for (const key in target) o[key] = lerp(prev[key] ?? target[key], target[key], kk);
        cur = o;
      }
      return cur;
    }
    const moodTable = (n) => Object.assign({}, MOODS[n] || MOODS.neutral);

    function limb(x0, y0, a1, l1, a2, l2) {
      const r1 = (a1 * Math.PI) / 180, r2 = ((a1 + a2) * Math.PI) / 180;
      const x1 = x0 + Math.sin(r1) * l1, y1 = y0 + Math.cos(r1) * l1;
      const x2 = x1 + Math.sin(r2) * l2, y2 = y1 + Math.cos(r2) * l2;
      return [x1, y1, x2, y2];
    }

    function update(t) {
      const boil = Math.floor(t * 12);
      const jit = (k) => (hash(boil * 31 + k, s.seed) - 0.5) * 1.1;
      const x = sampleTrack(xs, t, 0);
      const y = sampleTrack(s.y, t, 900);
      const facing = sampleTrack(s.facing, t, 1) >= 0 ? 1 : -1;
      const sc = sampleTrack(s.scaleT, t, s.scale);
      const vis = sampleTrack(s.opacity, t, 1);
      const P = trackName(s.pose, t, "stand", poseOf);
      const M = trackName(s.mood, t, "neutral", moodTable);
      const look = sampleTrack(s.look, t, { x: 0, y: 0 });
      // walking overlay
      const spd = speedAt(t);
      const run = s.walk === "run";
      const w = clamp(spd / (run ? 260 : 120), 0, 1) * (s.noWalk ? 0 : 1);
      const stride = run ? 260 : 190;
      const ph = (distAt(t) / stride) * Math.PI * 2;
      const amp = run ? 38 : 26;
      const sw = Math.sin(ph);
      P.hipF += amp * sw * w; P.hipB += -amp * sw * w;
      P.knF += -(run ? 70 : 34) * Math.max(0, Math.cos(ph)) * w;
      P.knB += -(run ? 70 : 34) * Math.max(0, -Math.cos(ph)) * w;
      P.shF += -(run ? 40 : 22) * sw * w; P.shB += (run ? 40 : 22) * sw * w;
      P.elF += (run ? 70 : 18) * w; P.elB += (run ? 70 : 18) * w;
      P.lean += (run ? 14 : 3) * w;
      const bob = -Math.abs(Math.cos(ph)) * (run ? 10 : 5) * w;
      // idle breath (acting, per character phase)
      const breath = Math.sin(t * 2 * Math.PI / 3.4 + s.seed) * 1.6 * (1 - w);
      // squash on mood takes
      let squash = 0;
      if (s.mood) for (const [t0, , d] of s.mood) { const k = (t - t0) / 0.28; if (k > 0 && k < 1) squash += Math.sin(k * Math.PI) * 0.035; }
      if (s.squash) for (const [t0, amt] of s.squash) { const k = (t - t0) / 0.32; if (k > 0 && k < 1) squash += Math.sin(k * Math.PI) * amt; }

      const hipY = -(LEG1 + LEG2) + P.crouch + bob;
      const leanR = (P.lean * Math.PI) / 180;
            // legs from hips at ±9
      const hx = 9;
      const [kxF, kyF, fxF, fyF] = limb(hx * 0.4, hipY, P.hipF, LEG1, P.knF, LEG2);
      const [kxB, kyB, fxB, fyB] = limb(-hx * 0.4, hipY, P.hipB, LEG1, P.knB, LEG2);
      legF.setAttribute("d", `M${hx * 0.4},${hipY} L${kxF + jit(1)},${kyF + jit(2)} L${fxF},${fyF}`);
      legB.setAttribute("d", `M${-hx * 0.4},${hipY} L${kxB + jit(3)},${kyB + jit(4)} L${fxB},${fyB}`);
      shoeF.setAttribute("cx", fxF + 5); shoeF.setAttribute("cy", fyF + 1);
      shoeB.setAttribute("cx", fxB + 5); shoeB.setAttribute("cy", fyB + 1);
      // torso as garment block, built upright then rotated about the hip by the lean
      const P2 = (px, py) => { const dy = py - hipY; return [px * Math.cos(leanR) - dy * Math.sin(leanR), hipY + px * Math.sin(leanR) + dy * Math.cos(leanR)]; };
      const nyU = hipY - TORSO + breath;               // neck height (upright)
      const botY = s.dress ? hipY + 46 : hipY + 10, botW = s.dress ? 44 : 27;
      const pts = [[-12, nyU - 2], [12, nyU - 2], [25, nyU + 10], [27, nyU + 40], [botW, botY], [-botW, botY], [-27, nyU + 40], [-25, nyU + 10]].map(([a, b]) => P2(a, b));
      torso.setAttribute("d", `M${pts[0]} L${pts[1]} Q${P2(24, nyU)} ${pts[2]} L${pts[3]} L${pts[4][0] + jit(5) * 0.4},${pts[4][1]} Q${P2(0, botY + 7)} ${pts[5]} L${pts[6]} L${pts[7]} Q${P2(-24, nyU)} ${pts[0]} Z`);
      const sh = [[-25, nyU + 10], [-27, nyU + 40], [-botW, botY], [-botW + 12, botY + 2], [-14, nyU + 20]].map(([a, b]) => P2(a, b));
      torsoShade.setAttribute("d", `M${sh[0]} L${sh[1]} L${sh[2]} L${sh[3]} L${sh[4]} Z`);
      const [neckX, neckY2] = P2(0, nyU);
      // arms from shoulders
      const [shX, shY] = P2(17, nyU + 14);
      const [shXb, shYb] = P2(-17, nyU + 14);
      const out = P.armOut;
      const [exF, eyF, hxF, hyF] = limb(shX, shY, P.shF + out * 0.2 + P.lean, ARM1, P.elF, ARM2);
      const [exB, eyB, hxB, hyB] = limb(shXb, shYb, P.shB - out * 0.2 + P.lean, ARM1, P.elB, ARM2);
      armF.setAttribute("d", `M${exF},${eyF} L${hxF + jit(6)},${hyF + jit(7)}`);
      armB.setAttribute("d", `M${exB},${eyB} L${hxB + jit(8)},${hyB + jit(9)}`);
      sleeveF.setAttribute("d", `M${shX},${shY} L${exF},${eyF}`);
      sleeveB.setAttribute("d", `M${shXb},${shYb} L${exB},${eyB}`);
      handF.setAttribute("cx", hxF); handF.setAttribute("cy", hyF);
      handB.setAttribute("cx", hxB); handB.setAttribute("cy", hyB);
      // head
      const [hX, hY] = P2(0, nyU - NECK - HEADR + 6);
      headG.setAttribute("transform", `translate(${hX},${hY}) rotate(${P.head * 0.6}) scale(${1 + squash * 0.4},${1 - squash * 0.7})`);
      const [hb, hf] = hairPaths(1);
      hairBack.setAttribute("d", hb); hairFront.setAttribute("d", hf);
      // eyes (3/4 view: shifted toward facing)
      const blinkPhase = (t + s.seed * 1.37) % 3.8;
      const blink = blinkPhase < 0.1 ? 1 - Math.sin((blinkPhase / 0.1) * Math.PI) : 1;
      const open = M.open * blink;
      eyes.forEach((E, i) => {
        const side = i === 0 ? -1 : 1;
        const ex = side * 13 + 7, ey = -4;
        const sz = M.size;
        E.eg.setAttribute("transform", `translate(${ex},${ey}) scale(${sz})`);
        E.white.setAttribute("ry", Math.max(0.8, 11 * open));
        E.white.setAttribute("opacity", 1 - M.happy);
        const px = clamp(look.x, -1, 1) * 4 + 1.5, py = clamp(look.y + M.look, -1, 1) * 4.5;
        E.pupil.setAttribute("cx", px); E.pupil.setAttribute("cy", py * open);
        E.pupil.setAttribute("r", (4.6 / Math.max(1, sz * 0.9)) * (open > 0.25 ? 1 : 0));
        E.pupil.setAttribute("opacity", 1 - M.happy);
        // lid: covers top part; slant + = angry (inner side lower), - = sad (outer lower)
        const lidY = -11 + 22 * M.lid;
        const sl = M.slant * 7 * (i === 0 ? -1 : 1); // inner edge is toward centre
        E.lid.setAttribute("d", `M-14,-16 L14,-16 L14,${lidY - sl} L-14,${lidY + sl} Z`);
        E.lid.setAttribute("opacity", 1 - M.happy);
        E.arc.setAttribute("d", "M-8,3 Q0,-8 8,3");
        E.arc.setAttribute("opacity", M.happy);
      });
      // mouth (white on ink head)
      const mw = 9 + M.mopen * 2, cy = 16, curve = M.smile * 7, op = M.mopen * 9;
      mouth.setAttribute("d", `M${7 - mw},${cy} Q7,${cy + curve} ${7 + mw},${cy} Q7,${cy + curve + op} ${7 - mw},${cy} Z`);
      mouth.setAttribute("opacity", clamp(M.mouth, 0, 1));
      if (glasses) glasses.setAttribute("transform", "translate(7,0)");
      // prop in front hand
      if (s.prop) {
        const pk = sampleTrack(s.prop.show, t, 1);
        if (!prop) prop = buildProp(propG, s.prop.kind);
        propG.setAttribute("transform", `translate(${hxF},${hyF}) rotate(${(P.shF + P.elF) * -0.0 + (s.prop.rot || 0)})`);
        propG.setAttribute("opacity", pk);
      }
      const sy = 1 - squash * 0.5;
      g.setAttribute("transform", `translate(${x},${y}) scale(${sc * facing},${sc * sy})`);
      g.setAttribute("opacity", vis);
      shadow.setAttribute("rx", 46 - Math.abs(bob) * 1.2);
      return { x, y, headX: x + hX * sc * facing, headY: y + hY * sc, handX: x + hxF * sc * facing, handY: y + hyF * sc };
    }
    return { g, update, spec: s };
  }

  function buildProp(g, kind) {
    switch (kind) {
      case "phone":
        el("rect", { x: -9, y: -30, width: 18, height: 32, rx: 4, fill: "#2B2B33" }, g);
        el("rect", { x: -6.5, y: -27, width: 13, height: 25, rx: 2, fill: "#9FD3E0" }, g);
        break;
      case "cup":
        el("path", { d: "M-11,-26 L11,-26 L8,4 L-8,4 Z", fill: PAL.white, stroke: PAL.ink, "stroke-width": 2 }, g);
        el("rect", { x: -11, y: -16, width: 22, height: 8, fill: PAL.kind }, g);
        el("rect", { x: -12, y: -30, width: 24, height: 5, rx: 2, fill: PAL.ink }, g);
        break;
      case "umbrella":
        el("path", { d: "M0,0 L0,-120", stroke: PAL.ink, "stroke-width": 4 }, g);
        el("path", { d: "M-80,-110 Q0,-190 80,-110 Q60,-122 40,-110 Q20,-124 0,-110 Q-20,-124 -40,-110 Q-60,-122 -80,-110 Z", fill: PAL.kind, stroke: PAL.ink, "stroke-width": 3 }, g);
        break;
      case "bag":
        el("rect", { x: -16, y: 0, width: 32, height: 34, rx: 4, fill: PAL.wood, stroke: PAL.ink, "stroke-width": 2 }, g);
        el("path", { d: "M-8,0 Q0,-14 8,0", fill: "none", stroke: PAL.ink, "stroke-width": 3 }, g);
        break;
      case "note":
        el("rect", { x: -16, y: -22, width: 32, height: 24, rx: 2, fill: "#FFF6C7", stroke: PAL.ink, "stroke-width": 2 }, g);
        el("path", { d: "M-10,-14 L10,-14 M-10,-8 L6,-8", stroke: PAL.ink, "stroke-width": 2 }, g);
        break;
    }
    return g;
  }

  // ---------- sets ----------
  const Set = {
    sky(g, kind, W = 1920, H = 1080) {
      const [a, b] = SKY[kind] || SKY.noon;
      el("rect", { x: 0, y: 0, width: W, height: H, fill: b }, g);
      el("rect", { x: 0, y: 0, width: W, height: H * 0.42, fill: a }, g);
    },
    sun(g, x, y, r = 70, color = "#FFE3B0") { el("circle", { cx: x, cy: y, r, fill: color }, g); },
    building(g, x, w, h, groundY, color, opts = {}) {
      const bg = el("g", {}, g);
      el("rect", { x, y: groundY - h, width: w, height: h, fill: color }, bg);
      el("rect", { x, y: groundY - h, width: w, height: 14, fill: "rgba(0,0,0,0.12)" }, bg);
      const cols = opts.cols || Math.max(2, Math.floor(w / 110)), rows = opts.rows || Math.max(1, Math.floor((h - 160) / 130));
      const ww = 52, wh = 66, gx = (w - cols * ww) / (cols + 1);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const wx = x + gx + c * (ww + gx), wy = groundY - h + 50 + r * 130;
        el("rect", { x: wx, y: wy, width: ww, height: wh, fill: opts.lit && hash(r * 7 + c, 11) > 0.45 ? "#FFD98A" : PAL.glass, stroke: "rgba(0,0,0,0.18)", "stroke-width": 3 }, bg);
        el("rect", { x: wx, y: wy + wh - 6, width: ww, height: 6, fill: "rgba(0,0,0,0.12)" }, bg);
      }
      return bg;
    },
    shopfront(g, x, w, groundY, color, sign, opts = {}) {
      const sg = el("g", {}, g);
      el("rect", { x, y: groundY - 300, width: w, height: 300, fill: color }, sg);
      el("rect", { x: x + 30, y: groundY - 220, width: w - 170, height: 170, fill: PAL.glass, stroke: PAL.ink, "stroke-width": 4 }, sg);
      el("rect", { x: x + w - 120, y: groundY - 230, width: 90, height: 230, fill: PAL.wood, stroke: PAL.ink, "stroke-width": 4 }, sg);
      el("circle", { cx: x + w - 44, cy: groundY - 110, r: 5, fill: PAL.ink }, sg);
      // awning
      const aw = el("g", {}, sg);
      const n = Math.floor(w / 60);
      for (let i = 0; i < n; i++) el("path", { d: `M${x + i * (w / n)},${groundY - 300} l${w / n},0 l0,40 q${-w / n / 2},18 ${-w / n},0 Z`, fill: i % 2 ? PAL.white : (opts.awning || PAL.rude) }, aw);
      if (sign) {
        el("rect", { x: x + w / 2 - 120, y: groundY - 370, width: 240, height: 56, rx: 8, fill: PAL.ink }, sg);
        const tx = el("text", { x: x + w / 2, y: groundY - 332, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 900, "font-size": 30, fill: PAL.paper, "letter-spacing": "2" }, sg);
        tx.textContent = sign;
      }
      return sg;
    },
    street(g, groundY, W = 1920) {
      el("rect", { x: 0, y: groundY, width: W, height: 70, fill: PAL.walk }, g);
      el("rect", { x: 0, y: groundY + 70, width: W, height: 12, fill: PAL.curb }, g);
      el("rect", { x: 0, y: groundY + 82, width: W, height: 400, fill: PAL.street }, g);
      for (let i = 0; i < W; i += 220) el("rect", { x: i + 40, y: groundY + 170, width: 110, height: 10, fill: "#E9E2D6" }, g);
      for (let i = 0; i < W; i += 160) el("rect", { x: i, y: groundY, width: 3, height: 70, fill: "rgba(0,0,0,0.08)" }, g);
    },
    floor(g, groundY, color = "#C9B49A", W = 1920, wall = "#E9D9C3") {
      el("rect", { x: 0, y: 0, width: W, height: groundY, fill: wall }, g);
      el("rect", { x: 0, y: groundY, width: W, height: 1080 - groundY, fill: color }, g);
      el("rect", { x: 0, y: groundY - 18, width: W, height: 18, fill: "rgba(0,0,0,0.08)" }, g);
    },
    lamp(g, x, groundY) {
      el("rect", { x: x - 5, y: groundY - 320, width: 10, height: 320, fill: PAL.ink }, g);
      el("path", { d: `M${x},${groundY - 320} q40,-30 70,0`, fill: "none", stroke: PAL.ink, "stroke-width": 8 }, g);
      el("path", { d: `M${x + 52},${groundY - 322} l36,0 l-6,22 l-24,0 z`, fill: PAL.ink }, g);
    },
    tree(g, x, groundY, s = 1, color = PAL.forest) {
      el("rect", { x: x - 9 * s, y: groundY - 150 * s, width: 18 * s, height: 150 * s, fill: PAL.wood }, g);
      el("circle", { cx: x, cy: groundY - 200 * s, r: 80 * s, fill: color }, g);
      el("circle", { cx: x - 50 * s, cy: groundY - 160 * s, r: 50 * s, fill: color }, g);
      el("circle", { cx: x + 52 * s, cy: groundY - 165 * s, r: 55 * s, fill: color }, g);
    },
    car(g, x, groundY, color = PAL.slate, facing = 1, opts = {}) {
      const cg = el("g", { transform: `translate(${x},${groundY}) scale(${facing},1)` }, g);
      el("path", { d: "M-170,-30 L-170,-80 Q-160,-96 -120,-100 L-80,-150 Q-70,-160 -40,-160 L70,-160 Q96,-160 110,-140 L140,-100 Q176,-96 180,-70 L180,-30 Z", fill: color, stroke: PAL.ink, "stroke-width": 5, "stroke-linejoin": "round" }, cg);
      el("path", { d: "M-66,-142 L-36,-142 L-36,-102 L-100,-102 Z", fill: PAL.glass, stroke: PAL.ink, "stroke-width": 4 }, cg);
      el("path", { d: "M-24,-142 L64,-142 Q80,-142 90,-130 L110,-102 L-24,-102 Z", fill: PAL.glass, stroke: PAL.ink, "stroke-width": 4 }, cg);
      for (const wx of [-100, 110]) { el("circle", { cx: wx, cy: -28, r: 34, fill: PAL.ink }, cg); el("circle", { cx: wx, cy: -28, r: 14, fill: "#9A9590" }, cg); }
      el("rect", { x: 168, y: -84, width: 14, height: 14, rx: 3, fill: "#FFE08A" }, cg);
      return cg;
    },
    counter(g, x, w, groundY, color = PAL.wood) {
      el("rect", { x, y: groundY - 170, width: w, height: 170, fill: color, stroke: PAL.ink, "stroke-width": 5 }, g);
      el("rect", { x: x - 12, y: groundY - 186, width: w + 24, height: 20, fill: "#E8DCCB", stroke: PAL.ink, "stroke-width": 5 }, g);
    },
    window(g, x, y, w, h, sky = "#CDE4EC") {
      el("rect", { x, y, width: w, height: h, fill: sky, stroke: PAL.ink, "stroke-width": 6 }, g);
      el("path", { d: `M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h / 2} L${x + w},${y + h / 2}`, stroke: PAL.ink, "stroke-width": 5 }, g);
    },
    table(g, x, w, groundY) {
      el("rect", { x, y: groundY - 120, width: w, height: 16, rx: 4, fill: PAL.wood, stroke: PAL.ink, "stroke-width": 4 }, g);
      el("rect", { x: x + 16, y: groundY - 104, width: 12, height: 104, fill: PAL.ink }, g);
      el("rect", { x: x + w - 28, y: groundY - 104, width: 12, height: 104, fill: PAL.ink }, g);
    },
    bench(g, x, w, groundY) {
      el("rect", { x, y: groundY - 70, width: w, height: 14, rx: 4, fill: PAL.wood, stroke: PAL.ink, "stroke-width": 4 }, g);
      el("rect", { x, y: groundY - 140, width: w, height: 12, rx: 4, fill: PAL.wood, stroke: PAL.ink, "stroke-width": 4 }, g);
      for (const lx of [x + 20, x + w - 30]) el("rect", { x: lx, y: groundY - 140, width: 10, height: 140, fill: PAL.ink }, g);
    },
    grain(g, id = "srgrain", amount = 0.06, W = 1920, H = 1080) {
      const f = el("filter", { id, x: 0, y: 0, width: "100%", height: "100%" }, el("defs", {}, g));
      el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.9", numOctaves: "2", seed: "4", result: "n" }, f);
      el("feColorMatrix", { type: "matrix", values: `0 0 0 0 0.12  0 0 0 0 0.1  0 0 0 0 0.13  0 0 0 ${amount * 3} 0` }, f);
      el("rect", { x: 0, y: 0, width: W, height: H, filter: `url(#${id})`, "pointer-events": "none" }, g);
    },
  };

  // ---------- ripple device ----------
  // rings expanding from a point; a thread travelling from A to B. Flat ink strokes, no glow.
  function Ripple(parent, spec) {
    const s = Object.assign({ color: PAL.rude, rings: 3, maxR: 260, dur: 1.4, width: 7 }, spec);
    const g = el("g", {}, parent);
    const rings = [];
    for (let i = 0; i < s.rings; i++) rings.push(el("circle", { fill: "none", stroke: s.color, "stroke-width": s.width }, g));
    const thread = el("path", { fill: "none", stroke: s.color, "stroke-width": s.width - 1, "stroke-linecap": "round", "stroke-dasharray": "0 99999" }, g);
    const dot = el("circle", { r: 11, fill: s.color }, g);
    function update(t, pA, pB) {
      const k0 = (t - s.t) / s.dur;
      rings.forEach((r, i) => {
        const k = clamp(k0 - i * 0.18, 0, 1);
        const vis = k > 0 && k < 1;
        r.setAttribute("cx", pA.x); r.setAttribute("cy", pA.y);
        r.setAttribute("r", EASE.out(k) * s.maxR);
        r.setAttribute("opacity", vis ? (1 - k) * 0.95 : 0);
        r.setAttribute("stroke-width", s.width * (1 - k * 0.6));
      });
      if (pB && s.tThread != null) {
        const kt = clamp((t - s.tThread) / (s.threadDur || 1.0), 0, 1);
        const kOut = clamp((t - (s.tThread + (s.threadDur || 1.0) + (s.threadHold || 0.6))) / 0.4, 0, 1);
        const mx = (pA.x + pB.x) / 2, my = Math.min(pA.y, pB.y) - (s.arc ?? 160);
        const d = `M${pA.x},${pA.y} Q${mx},${my} ${pB.x},${pB.y}`;
        thread.setAttribute("d", d);
        const len = thread.getTotalLength ? thread.getTotalLength() : 1000;
        const kk = EASE.inOut(kt);
        thread.setAttribute("stroke-dasharray", `${len * kk} ${len}`);
        thread.setAttribute("opacity", kt > 0 ? 1 - kOut : 0);
        const pt = thread.getPointAtLength ? thread.getPointAtLength(len * kk) : { x: pB.x, y: pB.y };
        dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
        dot.setAttribute("opacity", kt > 0 && kt < 1 ? 1 : 0);
      } else { thread.setAttribute("opacity", 0); dot.setAttribute("opacity", 0); }
    }
    return { g, update, spec: s };
  }

  // ---------- scene driver ----------
  // Builds one proxy tween so every frame is draw(t) — seek-safe in HyperFrames.
  function drive(tl, duration, draw) {
    const proxy = { t: 0 };
    tl.fromTo(proxy, { t: 0 }, { t: duration, duration, ease: "none", onUpdate: () => draw(proxy.t) }, 0);
    draw(0);
  }

  window.SR = { PAL, SKY, el, EASE, clamp, lerp, sampleTrack, Character, Set, Ripple, drive, POSES, MOODS, hash };
})();
