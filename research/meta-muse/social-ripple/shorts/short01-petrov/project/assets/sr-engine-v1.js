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
    driveWave: { crouch: 50, hipF: 80, knF: -60, hipB: 78, knB: -62, shF: 150, elF: 25, shB: 70, elB: 25, head: -4 },
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
    let wingG = null;
    if (s.wings) {
      wingG = el("g", {}, body);
      const W = (sx, c) => { el("path", { d: `M0,0 C${40 * sx},-80 ${110 * sx},-70 ${96 * sx},-14 C${86 * sx},14 ${30 * sx},14 0,0 Z`, fill: c, stroke: PAL.ink, "stroke-width": 4, "stroke-linejoin": "round" }, wingG);
        el("path", { d: `M0,6 C${50 * sx},16 ${80 * sx},44 ${56 * sx},72 C${30 * sx},86 ${8 * sx},48 0,6 Z`, fill: c, stroke: PAL.ink, "stroke-width": 4, "stroke-linejoin": "round" }, wingG);
        el("circle", { cx: 62 * sx, cy: -28, r: 9, fill: PAL.ink, opacity: 0.85 }, wingG); };
      W(-1, "#E09A2C"); W(1, PAL.kind);
    }
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
    if (s.wings) el("path", { d: "M-10,-32 Q-20,-62 -34,-70 M10,-32 Q22,-62 36,-68", fill: "none", stroke: PAL.ink, "stroke-width": 4, "stroke-linecap": "round" }, headG);
    const eyes = [0, 1].map((i) => {
      const eg = el("g", {}, headG);
      const white = el("ellipse", { rx: 9, ry: 11, fill: PAL.white }, eg);
      const cp = el("clipPath", { id: `${s.id}-eyeclip${i}` }, eg);
      const clipE = el("ellipse", { rx: 9.6, ry: 11.6 }, cp);
      const pupil = el("circle", { r: 4.6, fill: PAL.ink, "clip-path": `url(#${s.id}-eyeclip${i})` }, eg);
      const lid = el("path", { fill: PAL.ink, "clip-path": `url(#${s.id}-eyeclip${i})` }, eg);
      const arc = el("path", { fill: "none", stroke: PAL.white, "stroke-width": 4.5, "stroke-linecap": "round" }, eg);
      return { eg, white, pupil, lid, arc, clipE };
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
    { let d = 0, px = sampleTrack(xs, 0, 0), py = sampleTrack(s.y, 0, 900); for (let i = 0; i <= T_END * 60; i++) { const xv = sampleTrack(xs, i / 60, 0), yv = sampleTrack(s.y, i / 60, 900); d += Math.hypot(xv - px, (yv - py) * 1.6); px = xv; py = yv; dist.push(d); } }
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
      const stride = (run ? 305 : 218) * sc;
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
        E.white.setAttribute("ry", Math.max(0.8, 11 * open)); E.clipE.setAttribute("ry", Math.max(0.8, 11.6 * open));
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
      if (s.prop && s.prop.kind) {
        const pk = sampleTrack(s.prop.show, t, 1);
        if (!prop) prop = buildProp(propG, s.prop.kind);
        propG.setAttribute("transform", `translate(${hxF},${hyF}) rotate(${(P.shF + P.elF) * -0.0 + (s.prop.rot || 0)})`);
        propG.setAttribute("opacity", pk);
      }
      if (wingG) { const [wx, wy] = P2(0, nyU + 34); const fl = 0.75 + 0.25 * Math.abs(Math.cos(t * Math.PI * (s.flap || 1.6))); wingG.setAttribute("transform", `translate(${wx},${wy}) scale(${fl},1)`); }
      const sy = 1 - squash * 0.5;
      g.setAttribute("transform", `translate(${x},${y}) scale(${sc * facing},${sc * sy})`);
      g.setAttribute("opacity", vis);
      shadow.setAttribute("rx", 46 - Math.abs(bob) * 1.2);
      return { x, y, headX: x + hX * sc * facing, headY: y + hY * sc, handX: x + hxF * sc * facing, handY: y + hyF * sc };
    }
    return { g, update, spec: s, hair: [hairBack, hairFront] };
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
        const sw = Math.max(240, sign.length * 21 + 50);
        el("rect", { x: x + w / 2 - sw / 2, y: groundY - 370, width: sw, height: 56, rx: 8, fill: PAL.ink }, sg);
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
      const W1 = "M-66,-142 L-36,-142 L-36,-102 L-100,-102 Z", W2 = "M-24,-142 L64,-142 Q80,-142 90,-130 L110,-102 L-24,-102 Z";
      el("path", { d: "M-170,-30 L-170,-80 Q-160,-96 -120,-100 L-80,-150 Q-70,-160 -40,-160 L70,-160 Q96,-160 110,-140 L140,-100 Q176,-96 180,-70 L180,-30 Z" + (opts.holes ? " " + W1 + " " + W2 : ""), "fill-rule": "evenodd", fill: color, stroke: PAL.ink, "stroke-width": 5, "stroke-linejoin": "round" }, cg);
      el("path", { d: W1, fill: PAL.glass, "fill-opacity": opts.holes ? 0.28 : 1, stroke: PAL.ink, "stroke-width": 4 }, cg);
      el("path", { d: W2, fill: PAL.glass, "fill-opacity": opts.holes ? 0.28 : 1, stroke: PAL.ink, "stroke-width": 4 }, cg);
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

    crosswalk(g, x, groundY, w = 420, n = 7) {
      for (let i = 0; i < n; i++) el("rect", { x: x + i * (w / n), y: groundY + 92, width: (w / n) * 0.55, height: 300, fill: "#EDE6DA" }, g);
    },
    trafficLight(g, x, groundY, state = "red") {
      const tg = el("g", {}, g);
      el("rect", { x: x - 6, y: groundY - 330, width: 12, height: 330, fill: PAL.ink }, tg);
      el("rect", { x: x - 26, y: groundY - 450, width: 52, height: 130, rx: 10, fill: PAL.ink }, tg);
      const lamps = ["#E2412F", "#F2B33D", "#5DBB63"].map((c, i) => el("circle", { cx: x, cy: groundY - 425 + i * 40, r: 14, fill: c }, tg));
      return { g: tg, set: (st) => lamps.forEach((l, i) => l.setAttribute("opacity", ["red", "amber", "green"][i] === st ? 1 : 0.22)) };
    },
    clockSign(g, x, y, text = "7:42") {
      const cg = el("g", {}, g);
      el("rect", { x: x - 92, y: y - 44, width: 184, height: 88, rx: 12, fill: PAL.ink, stroke: "#3A3540", "stroke-width": 6 }, cg);
      const t = el("text", { x, y: y + 2, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "Space Mono", "font-weight": 700, "font-size": 54, fill: "#FF6B4A" }, cg);
      t.textContent = text; return { g: cg, text: t };
    },
    cafeInterior(g, groundY = 900, W = 1920) {
      Set.floor(g, groundY, "#B98E6A", W, "#EADBC6");
      for (let i = 0; i < W; i += 90) el("rect", { x: i, y: groundY, width: 4, height: 1080 - groundY, fill: "rgba(0,0,0,0.06)" }, g);
      el("rect", { x: 0, y: groundY - 380, width: W, height: 8, fill: "rgba(0,0,0,0.06)" }, g);
      // pendant lamps
      for (const lx of [420, 900, 1380]) { el("path", { d: `M${lx},0 L${lx},150`, stroke: PAL.ink, "stroke-width": 3 }, g); el("path", { d: `M${lx - 40},190 Q${lx},130 ${lx + 40},190 Z`, fill: PAL.mustard, stroke: PAL.ink, "stroke-width": 4 }, g); }
    },
    chalkboard(g, x, y, w, h) {
      const cg = el("g", {}, g);
      el("rect", { x: x - 14, y: y - 14, width: w + 28, height: h + 28, rx: 6, fill: PAL.wood, stroke: PAL.ink, "stroke-width": 5 }, cg);
      el("rect", { x, y, width: w, height: h, fill: "#2F3B36" }, cg);
      return cg;
    },
    espressoMachine(g, x, groundY) {
      const eg = el("g", {}, g); const y = groundY - 186;
      el("rect", { x: x - 90, y: y - 150, width: 180, height: 150, rx: 10, fill: "#C8CDD0", stroke: PAL.ink, "stroke-width": 5 }, eg);
      el("rect", { x: x - 90, y: y - 162, width: 180, height: 16, rx: 4, fill: "#9AA1A6", stroke: PAL.ink, "stroke-width": 4 }, eg);
      for (const dx of [-40, 40]) { el("rect", { x: x + dx - 14, y: y - 60, width: 28, height: 26, fill: PAL.ink }, eg); el("circle", { cx: x + dx, cy: y - 110, r: 12, fill: PAL.ink }, eg); }
      return eg;
    },
    stage(g, groundY = 760, W = 1920) {
      el("rect", { x: 0, y: 0, width: W, height: 1080, fill: "#3B2F3F" }, g);
      el("rect", { x: 260, y: 120, width: W - 520, height: groundY - 120, fill: "#F1D9A8" }, g);
      el("path", { d: `M200,90 L${W - 200},90 L${W - 200},160 Q${W / 2},230 200,160 Z`, fill: "#A63A3A", stroke: PAL.ink, "stroke-width": 5 }, g);
      el("path", { d: `M120,90 L330,90 Q300,${groundY / 2} 330,${groundY + 20} L120,${groundY + 20} Z`, fill: "#B8453F", stroke: PAL.ink, "stroke-width": 5 }, g);
      el("path", { d: `M${W - 120},90 L${W - 330},90 Q${W - 300},${groundY / 2} ${W - 330},${groundY + 20} L${W - 120},${groundY + 20} Z`, fill: "#B8453F", stroke: PAL.ink, "stroke-width": 5 }, g);
      el("rect", { x: 160, y: groundY, width: W - 320, height: 40, fill: PAL.wood, stroke: PAL.ink, "stroke-width": 5 }, g);
      el("rect", { x: 0, y: groundY + 40, width: W, height: 1080 - groundY - 40, fill: "#4A3B4D" }, g);
      // painted cardboard flowers on stage
      for (const fx of [420, 560, 1360, 1500]) { el("path", { d: `M${fx},${groundY} L${fx},${groundY - 120}`, stroke: PAL.forest, "stroke-width": 8 }, g); el("circle", { cx: fx, cy: groundY - 130, r: 30, fill: PAL.rose, stroke: PAL.ink, "stroke-width": 4 }, g); el("circle", { cx: fx, cy: groundY - 130, r: 10, fill: PAL.kind }, g); }
    },
    audienceRows(g, rows = 3, y0 = 900, W = 1920, seed = 5) {
      const R = mulberry32(seed); const heads = [];
      for (let r = 0; r < rows; r++) {
        const y = y0 + r * 70, sc = 1 + r * 0.18;
        for (let x = 40 + (r % 2) * 50; x < W; x += 100 * sc) {
          const c = CROWD_COLS[Math.floor(R() * CROWD_COLS.length)];
          el("path", { d: `M${x - 44 * sc},${y + 90 * sc} Q${x - 46 * sc},${y + 10 * sc} ${x},${y + 8 * sc} Q${x + 46 * sc},${y + 10 * sc} ${x + 44 * sc},${y + 90 * sc} Z`, fill: c }, g);
          const h = el("circle", { cx: x, cy: y - 22 * sc, r: 34 * sc, fill: PAL.ink }, g);
          heads.push({ x, y: y - 22 * sc, el: h });
        }
      }
      return heads;
    },
    door(g, x, groundY, color = PAL.wood) {
      const dg = el("g", {}, g);
      el("rect", { x: x - 70, y: groundY - 250, width: 140, height: 250, fill: "#5A4A40", stroke: PAL.ink, "stroke-width": 5 }, dg);
      const leaf = el("g", {}, dg);
      el("rect", { x: x - 66, y: groundY - 246, width: 132, height: 246, fill: color, stroke: PAL.ink, "stroke-width": 4 }, leaf);
      el("rect", { x: x - 44, y: groundY - 220, width: 88, height: 110, fill: PAL.glass, stroke: PAL.ink, "stroke-width": 4 }, leaf);
      el("circle", { cx: x + 46, cy: groundY - 120, r: 7, fill: PAL.ink }, leaf);
      return { g: dg, leaf, open: (k) => leaf.setAttribute("transform", `translate(${x - 66},0) scale(${1 - 0.72 * k},1) translate(${-(x - 66)},0)`) };
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


  // ---------- the butterfly: the channel's recurring mark (hidden in every film) ----------
  // spec: { x:[[t,x]], y:[[t,y]], scale, flap (Hz), color, rot }
  function Butterfly(parent, spec) {
    const s = Object.assign({ scale: 1, flap: 3.2, color: PAL.kind, rot: -12 }, spec);
    const g = el("g", {}, parent);
    const wingsB = el("g", {}, g), wingsF = el("g", {}, g);
    const wing = (gg, sx, shade) => {
      el("path", { d: `M0,0 C${18 * sx},-34 ${46 * sx},-30 ${40 * sx},-6 C${36 * sx},6 ${14 * sx},6 0,0 Z`, fill: shade, stroke: PAL.ink, "stroke-width": 3, "stroke-linejoin": "round" }, gg);
      el("path", { d: `M0,2 C${22 * sx},6 ${34 * sx},18 ${24 * sx},30 C${14 * sx},36 ${4 * sx},20 0,2 Z`, fill: shade, stroke: PAL.ink, "stroke-width": 3, "stroke-linejoin": "round" }, gg);
      el("circle", { cx: 26 * sx, cy: -12, r: 4.5, fill: PAL.ink, opacity: 0.85 }, gg);
    };
    wing(wingsB, -1, "#E09A2C"); wing(wingsF, 1, s.color);
    el("path", { d: "M0,-14 L0,26", stroke: PAL.ink, "stroke-width": 6, "stroke-linecap": "round" }, g);
    el("path", { d: "M0,-14 Q-6,-30 -12,-34 M0,-14 Q6,-30 12,-34", fill: "none", stroke: PAL.ink, "stroke-width": 2.5, "stroke-linecap": "round" }, g);
    function update(t) {
      const x = sampleTrack(s.x, t, 0), y = sampleTrack(s.y, t, 0);
      const f = s.flap ? Math.abs(Math.cos(t * Math.PI * s.flap)) : 1;
      const k = 0.25 + 0.75 * f;
      wingsF.setAttribute("transform", `scale(${k},1)`);
      wingsB.setAttribute("transform", `scale(${k * 0.92},1)`);
      g.setAttribute("transform", `translate(${x},${y}) rotate(${sampleTrack(s.rotT, t, s.rot)}) scale(${s.scale})`);
      g.setAttribute("opacity", sampleTrack(s.opacity, t, 1));
    }
    update(0);
    return { g, update };
  }


  // ---------- camera: a world group framed by keyed {x,y,z,r} (world point at screen centre) ----------
  function Camera(world, keys, opts = {}) {
    const W = opts.w || 1920, H = opts.h || 1080;
    function update(t) {
      const c = sampleTrack(keys, t, { x: W / 2, y: H / 2, z: 1, r: 0 });
      let sx = 0, sy = 0;
      if (opts.shake) { const a = sampleTrack(opts.shake, t, 0); sx = a * (Math.sin(t * 23.1) + Math.sin(t * 37.7) * 0.5); sy = a * (Math.cos(t * 19.3) + Math.sin(t * 41.9) * 0.5); }
      world.setAttribute("transform", `translate(${W / 2 + sx},${H / 2 + sy}) rotate(${c.r || 0}) scale(${c.z}) translate(${-c.x},${-c.y})`);
      return c;
    }
    return { update };
  }

  // ---------- speech bubble that follows an anchor (e.g. a head); pops in, fades out ----------
  // spec: { text, t0, t1, side: 1 (bubble to the right of the anchor) | -1, size, shout, color }
  function Bubble(parent, spec) {
    const s = Object.assign({ side: 1, size: 34, color: PAL.white, ink: PAL.ink }, spec);
    const g = el("g", { opacity: 0 }, parent);
    const inner = el("g", {}, g);
    const body = el("path", { fill: s.color, stroke: s.shout ? PAL.rude : PAL.ink, "stroke-width": s.shout ? 6 : 4, "stroke-linejoin": "round" }, inner);
    const tx = el("text", { "font-family": "Nunito", "font-weight": 900, "font-size": s.size, fill: s.ink, "text-anchor": "middle", "dominant-baseline": "central" }, inner);
    tx.textContent = s.text;
    let w = s.text.length * s.size * 0.56 + 44;
    try { const bb = tx.getComputedTextLength(); if (bb > 0) w = bb + 48; } catch (e) {}
    const h = s.size + 34, r = 22;
    function shape() {
      const x0 = s.side > 0 ? 18 : -18 - w, y0 = -h - 46;
      const tailX = s.side > 0 ? x0 + 34 : x0 + w - 34;
      if (s.shout) {
        let d = ""; const n = 18;
        for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2; const rr = i % 2 ? 1.0 : 1.16; d += (i ? "L" : "M") + (x0 + w / 2 + Math.cos(a) * (w / 2 + 14) * rr) + "," + (y0 + h / 2 + Math.sin(a) * (h / 2 + 16) * rr); }
        return d + "Z";
      }
      return `M${x0 + r},${y0} H${x0 + w - r} Q${x0 + w},${y0} ${x0 + w},${y0 + r} V${y0 + h - r} Q${x0 + w},${y0 + h} ${x0 + w - r},${y0 + h} H${tailX + 14} L${s.side > 0 ? tailX - 26 : tailX + 26},${y0 + h + 34} L${tailX - 6},${y0 + h} H${x0 + r} Q${x0},${y0 + h} ${x0},${y0 + h - r} V${y0 + r} Q${x0},${y0} ${x0 + r},${y0} Z`;
    }
    body.setAttribute("d", shape());
    const x0 = s.side > 0 ? 18 : -18 - w, y0 = -h - 46;
    tx.setAttribute("x", x0 + w / 2); tx.setAttribute("y", y0 + h / 2 + 1);
    function update(t, anchor) {
      const kin = clamp((t - s.t0) / 0.22, 0, 1), kout = clamp((t - s.t1) / 0.2, 0, 1);
      const vis = t >= s.t0 && t < s.t1 + 0.2;
      g.setAttribute("opacity", vis ? 1 - kout : 0);
      const sc = EASE.back(kin) * (1 - 0.1 * kout);
      const ox = s.side > 0 ? 18 : -18;
      g.setAttribute("transform", `translate(${anchor.x},${anchor.y}) translate(${ox},-46) scale(${Math.max(0.001, sc)}) translate(${-ox},46)`);
    }
    return { g, update };
  }

  // ---------- degree badge ("1°") that pops above a head ----------
  function Badge(parent, spec) {
    const s = Object.assign({ color: PAL.rude, r: 34 }, spec);
    const g = el("g", { opacity: 0 }, parent);
    el("circle", { r: s.r, fill: s.color, stroke: PAL.ink, "stroke-width": 4 }, g);
    const tx = el("text", { "font-family": "Outfit", "font-weight": 900, "font-size": s.r * 1.05, fill: PAL.white, "text-anchor": "middle", "dominant-baseline": "central", x: 2, y: 1 }, g);
    tx.textContent = s.text;
    function update(t, anchor) {
      const k = clamp((t - s.t0) / 0.3, 0, 1), ko = s.t1 ? clamp((t - s.t1) / 0.25, 0, 1) : 0;
      g.setAttribute("opacity", t >= s.t0 ? 1 - ko : 0);
      g.setAttribute("transform", `translate(${anchor.x},${anchor.y - (s.lift || 92)}) scale(${Math.max(0.001, EASE.back(k))})`);
    }
    return { g, update };
  }

  // ---------- crowd: many walkers/standers in muted colours (never the ripple red or gold) ----------
  const CROWD_COLS = [PAL.slate, PAL.sage, PAL.plum, PAL.navy, PAL.forest, "#8A7F72", "#B07A63", "#5E7C99", "#9A8AB0", "#7B9E87", "#C2A27A"];
  const HAIRS = ["none", "short", "ponytail", "bun", "curly", "cap", "long", "none", "short"];
  function Crowd(parent, spec) {
    const s = Object.assign({ n: 12, seed: 11, x0: -200, x1: 2120, y: 900, ySpread: 0, dur: 30, speed: [70, 120], scale: [0.82, 1.0], stand: 0 }, spec);
    const R = mulberry32(s.seed); const people = [];
    for (let i = 0; i < s.n; i++) {
      const dir0 = R() < 0.5 ? 1 : -1, dir = s.dir || dir0, sp = s.speed[0] + R() * (s.speed[1] - s.speed[0]);
      const standing = R() < s.stand;
      const startX = s.x0 + R() * (s.x1 - s.x0);
      const endX = standing ? startX : startX + dir * sp * s.dur;
      const sc = s.scale[0] + R() * (s.scale[1] - s.scale[0]);
      people.push(Character(parent, {
        id: `${s.idp || "crowd"}-${i}`, color: CROWD_COLS[Math.floor(R() * CROWD_COLS.length)], hair: HAIRS[Math.floor(R() * HAIRS.length)],
        hairColor: R() < 0.7 ? PAL.ink : ["#6B4A35", "#B7884F", "#8E8A86"][Math.floor(R() * 3)], seed: Math.floor(R() * 1000),
        scale: sc, x: [[0, startX], [s.dur, endX, "linear"]], y: [[0, s.y + (R() - 0.5) * s.ySpread]], facing: [[0, dir]],
        pose: [[0, standing ? (R() < 0.5 ? "phone" : "relaxed") : "relaxed", 0]], mood: [[0, ["neutral", "content", "tired"][Math.floor(R() * 3)], 0]],
        prop: standing && R() < 0.6 ? { kind: "phone" } : (R() < 0.25 ? { kind: "bag" } : null), glasses: R() < 0.2,
      }));
    }
    people.sort((a, b) => a.spec.scale - b.spec.scale).forEach((p) => parent.appendChild(p.g));
    return { people, update: (t) => people.forEach((p) => p.update(t)) };
  }

  // clipPath helper: returns url(#id)
  function clip(parent, id, d) { const cp = el("clipPath", { id }, parent); el("path", { d }, cp); return `url(#${id})`; }

  // ---------- scene driver ----------
  // Builds one proxy tween so every frame is draw(t) — seek-safe in HyperFrames.
  function drive(tl, duration, draw) {
    const proxy = { t: 0 };
    tl.fromTo(proxy, { t: 0 }, { t: duration, duration, ease: "none", onUpdate: () => draw(proxy.t) }, 0);
    draw(0);
  }

  window.SR = { buildProp, PAL, SKY, el, EASE, clamp, lerp, sampleTrack, mulberry32, Character, Set, Ripple, Butterfly, Camera, Bubble, Badge, Crowd, clip, drive, POSES, MOODS, hash };
})();
