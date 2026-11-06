/* Social Ripple engine v2 — loaded after sr-engine.js (v1). Replaces SR.Character and SR.Crowd with
   fuller cut-out cartoon characters, and adds SR.Scene2 (layered, lit 2D sets), SR.FX (dust, speed lines,
   sweat, sparkles, hearts, impact) and SR.Life (birds, clouds, leaves, steam). Everything is a pure
   function of timeline time, so renders stay deterministic. */
(function () {
  const SR = window.SR;
  // v4 emotion set (Ifverse-level faces): every mood also carries face-FX dials (tears, sweat, star/heart/spiral eyes, anger mark, tremble...)
  Object.assign(SR.MOODS, {
    crying:     { open: 1, lid: 0.3, slant: -1, size: 0.95, look: 0.5, happy: 0, smile: -0.9, mouth: 1, mopen: 0.35, tears: 1, tremble: 0.25 },
    laughing:   { open: 1, lid: 0, slant: 0, size: 1, look: 0, happy: 1, smile: 1, mouth: 1, mopen: 1, tears: 0.45, tremble: 0.5, blushK: 0.3 },
    terrified:  { open: 1, lid: 0, slant: -0.9, size: 1.35, look: -0.2, happy: 0, smile: -0.6, mouth: 1, mopen: 0.75, sweat: 1, tremble: 1 },
    starstruck: { open: 1, lid: 0, slant: -0.2, size: 1.2, look: 0, happy: 0, smile: 1, mouth: 1, mopen: 0.7, star: 1, blushK: 0.4 },
    inlove:     { open: 1, lid: 0, slant: -0.3, size: 1.15, look: 0, happy: 0, smile: 0.9, mouth: 1, mopen: 0.2, heart: 1, blushK: 0.7 },
    determined: { open: 1, lid: 0.28, slant: 0.75, size: 1, look: 0, happy: 0, smile: -0.1, mouth: 1, mopen: 0, brow: 0.7, shine: 0.6 },
    confused:   { open: 1, lid: 0.1, slant: -0.2, size: 1.05, look: -0.4, happy: 0, smile: -0.25, mouth: 0.9, mopen: 0.1, smug: 0.8, qmark: 1 },
    embarrassed:{ open: 1, lid: 0.2, slant: -0.4, size: 0.95, look: 0.6, happy: 0, smile: 0.25, mouth: 0.9, mopen: 0, sweat: 1, blushK: 1 },
    exhausted:  { open: 1, lid: 0.68, slant: -0.2, size: 0.95, look: 0.5, happy: 0, smile: -0.35, mouth: 0.8, mopen: 0.15, circles: 1 },
    furious:    { open: 1, lid: 0.5, slant: 1, size: 1, look: 0, happy: 0, smile: -1, mouth: 1, mopen: 0.7, brow: 1, anger: 1, red: 1, tremble: 0.7 },
    dizzy:      { open: 1, lid: 0, slant: 0, size: 1.1, look: 0, happy: 0, smile: -0.2, mouth: 1, mopen: 0.35, spiral: 1 },
    sleepy:     { open: 0, lid: 0, slant: 0, size: 1, look: 0, happy: 0, smile: 0.1, mouth: 0.6, mopen: 0.15, zzz: 1 },
    hopeful:    { open: 1, lid: 0, slant: -0.4, size: 1.12, look: -0.3, happy: 0, smile: 0.55, mouth: 1, mopen: 0.1, shine: 1 },
    proud:      { open: 1, lid: 0.35, slant: 0.1, size: 1, look: -0.2, happy: 0, smile: 0.85, mouth: 1, mopen: 0, smug: 1 },
    disgusted:  { open: 1, lid: 0.42, slant: 0.45, size: 0.95, look: 0.3, happy: 0, smile: -0.7, mouth: 1, mopen: 0.25, red: 0.15 },
  });
  Object.assign(SR.MOODS, { smug: { open: 1, lid: 0.35, slant: 0.15, size: 1, look: 0, happy: 0, smile: 0.7, mouth: 0.9, mopen: 0, brow: 0, smug: 1 }, deadpan: { open: 1, lid: 0.45, slant: 0, size: 1, look: 0, happy: 0, smile: 0, mouth: 0.7, mopen: 0, brow: 0 } });
  const { el, PAL, EASE, clamp, lerp, sampleTrack, POSES, MOODS, mulberry32, hash } = SR;
  for (const k in MOODS) { if (MOODS[k].smug == null) MOODS[k].smug = 0; }
  const INK = PAL.ink;
  const shade = (hex, k) => { // k<0 darker, k>0 lighter
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = (c) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
    return "#" + [f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("");
  };
  let UID = 0;

  // viseme mouth shapes (rig units; mouth centre x=7, y=17): w half-width, top/bot opening above/below the lip line,
  // round 0..1 (pucker), tt/tb upper/lower teeth, tg tongue, tup tongue raised, tip tongue between teeth, press lips pressed, lip lower-lip drop
  const VIS = {
    X: { w: 8.5, top: 0, bot: 0, round: 0, tt: 0, tb: 0, tg: 0, tup: 0, tip: 0, press: 0, lip: 0 },
    P: { w: 7.6, top: 0, bot: 0, round: 0.1, tt: 0, tb: 0, tg: 0, tup: 0, tip: 0, press: 1, lip: 0.4 },
    A: { w: 10, top: 4.2, bot: 10.5, round: 0.15, tt: 1, tb: 0.25, tg: 0.75, tup: 0, tip: 0, press: 0, lip: 1.2 },
    E: { w: 12, top: 2.6, bot: 5, round: 0, tt: 1, tb: 0.9, tg: 0.2, tup: 0, tip: 0, press: 0, lip: 0.6 },
    O: { w: 6.6, top: 4, bot: 8, round: 1, tt: 0.35, tb: 0, tg: 0.35, tup: 0, tip: 0, press: 0, lip: 1 },
    U: { w: 4.6, top: 2.2, bot: 3.6, round: 1, tt: 0, tb: 0, tg: 0, tup: 0, tip: 0, press: 0, lip: 0.6 },
    F: { w: 9.5, top: 1.4, bot: 2.2, round: 0, tt: 1, tb: 0, tg: 0, tup: 0, tip: 0, press: 0.3, lip: -0.6 },
    L: { w: 9.2, top: 3, bot: 6.5, round: 0.1, tt: 1, tb: 0.4, tg: 1, tup: 1, tip: 0, press: 0, lip: 0.8 },
    T: { w: 9.6, top: 2.2, bot: 3.8, round: 0, tt: 1, tb: 0.8, tg: 0.4, tup: 0.5, tip: 1, press: 0, lip: 0.5 },
    C: { w: 10.2, top: 1.9, bot: 3.6, round: 0.05, tt: 1, tb: 1, tg: 0.15, tup: 0, tip: 0, press: 0, lip: 0.4 },
    R: { w: 7.4, top: 2.4, bot: 4.2, round: 0.6, tt: 0.7, tb: 0.2, tg: 0.3, tup: 0.2, tip: 0, press: 0, lip: 0.6 },
  };
  // ================= CHARACTER v2 =================
  // spec adds: outfit ('hoodie'|'tee'|'shirt'|'jacket'|'apron'|'dress'|'coat'), pants colour, shoes colour,
  //            skin ('ink' default — the channel's silhouette heads), blush (auto by mood), talk: [[t0,t1],...]
  function Character(parent, spec) {
    const s = Object.assign({ scale: 1, color: PAL.terracotta, pants: "#3A4A63", shoes: INK, hair: "none", hairColor: "#2A2228", outfit: "hoodie", seed: 3 }, spec);
    const id = (s.id || "c") + "-" + (UID++);
    const g = el("g", { id: s.id }, parent);
    const body = el("g", {}, g);
    const LEG1 = 56, LEG2 = 54, ARM1 = 48, ARM2 = 46, TORSO = 94, HEADR = 41, NECK = 9, ANK = 10;
    const OUT = 4.2;                                    // outline width
    const SKIN0 = s.skin !== undefined ? s.skin : (SR.SKIN || null), SKIN = SKIN0 === "ink" ? null : SKIN0, FEAT = SKIN ? INK : "#FFFFFF";
    const dark = shade(s.color, -0.22), light = shade(s.color, 0.18), pantsD = shade(s.pants, -0.25);
    const shadow = el("ellipse", { cx: 0, cy: 2, rx: 50, ry: 9, fill: "rgba(31,26,44,0.34)" }, body); const shadowCore = el("ellipse", { cx: 0, cy: 2, rx: 30, ry: 5, fill: "rgba(31,26,44,0.3)" }, body);
    // wings (butterfly costume)
    let wingG = null;
    if (s.wings) {
      wingG = el("g", {}, body);
      const W = (sx, c) => { el("path", { d: `M0,0 C${40 * sx},-80 ${110 * sx},-70 ${96 * sx},-14 C${86 * sx},14 ${30 * sx},14 0,0 Z`, fill: c, stroke: INK, "stroke-width": OUT, "stroke-linejoin": "round" }, wingG);
        el("path", { d: `M0,6 C${50 * sx},16 ${80 * sx},44 ${56 * sx},72 C${30 * sx},86 ${8 * sx},48 0,6 Z`, fill: c, stroke: INK, "stroke-width": OUT, "stroke-linejoin": "round" }, wingG);
        el("circle", { cx: 62 * sx, cy: -28, r: 9, fill: INK, opacity: 0.85 }, wingG); };
      W(-1, "#E09A2C"); W(1, PAL.kind);
    }
    const THIN = !!s.thin, TW = s.thinW || 5.5;
    const tube = (parentG, w, col) => THIN ? ({ o: el("path", { fill: "none", stroke: INK, "stroke-width": TW, "stroke-linecap": "round", "stroke-linejoin": "round" }, parentG), f: el("path", { fill: "none", stroke: INK, "stroke-width": TW, "stroke-linecap": "round", "stroke-linejoin": "round" }, parentG) }) : ({ o: el("path", { fill: "none", stroke: INK, "stroke-width": w + OUT * 2, "stroke-linecap": "round", "stroke-linejoin": "round" }, parentG), f: el("path", { fill: "none", stroke: col, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" }, parentG) });
    const backG = el("g", {}, body);
    const legB = tube(backG, 17, pantsD);
    const shoeB = el("path", { fill: shade(s.shoes, -0.1), stroke: INK, "stroke-width": OUT, "stroke-linejoin": "round" }, backG);
    const sleeveB = tube(backG, 17, dark);
    const foreBo = SKIN && !THIN ? el("path", { fill: "none", stroke: INK, "stroke-width": 12 + OUT * 2, "stroke-linecap": "round" }, backG) : null;
    const foreB = el("path", { fill: "none", stroke: THIN ? INK : (SKIN || INK), "stroke-width": THIN ? TW : 12, "stroke-linecap": "round" }, backG);
    const handB = el("path", SKIN && !THIN ? { fill: SKIN, stroke: INK, "stroke-width": 3.4, "stroke-linejoin": "round" } : { fill: INK }, backG);
    const legF = tube(body, 17, s.pants);
    const shoeF = el("path", { fill: s.shoes, stroke: INK, "stroke-width": OUT, "stroke-linejoin": "round" }, body);
    const soleF = el("path", { fill: "none", stroke: "#EDE6DA", "stroke-width": 3, "stroke-linecap": "round" }, body);
    const neckO = SKIN ? el("path", { fill: "none", stroke: INK, "stroke-width": 15 + OUT * 2, "stroke-linecap": "round" }, body) : null;
    const neck = el("path", { fill: "none", stroke: SKIN || INK, "stroke-width": 15, "stroke-linecap": "round" }, body);
    // torso (garment) with clipped cel-shade and details
    const torsoG = el("g", {}, body);
    const torsoClipId = id + "-tc";
    const clipP = el("path", {}, el("clipPath", { id: torsoClipId }, torsoG));
    const torso = el("path", { fill: s.color }, torsoG);
    const inner = el("g", { "clip-path": `url(#${torsoClipId})` }, torsoG);
    const shadeP = el("path", { fill: dark, opacity: 0.85 }, inner);
    const hiP = el("path", { fill: light, opacity: 0.7 }, inner);
    const detail = el("g", { fill: "none", stroke: dark, "stroke-width": 3.2, "stroke-linecap": "round" }, inner);
    const torsoOut = el("path", { fill: "none", stroke: INK, "stroke-width": OUT, "stroke-linejoin": "round" }, torsoG);
    const headG = el("g", {}, body);
    const hairBack = el("path", { fill: s.hairColor, stroke: INK, "stroke-width": 3 }, headG);
    const head = el("circle", SKIN ? { r: HEADR, fill: SKIN, stroke: INK, "stroke-width": OUT } : { r: HEADR, fill: INK, stroke: s.inkOutline || "#EDE6DA", "stroke-width": 2.6 }, headG);
    const redTint = el("circle", { r: HEADR - 1.5, fill: "#E8574A", opacity: 0 }, headG);
    const spec_ = el("path", { d: "", fill: "none", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round", opacity: 0.2 }, headG);
    const blush = [el("ellipse", { rx: 9, ry: 5, fill: "#E9778A", opacity: 0 }, headG), el("ellipse", { rx: 9, ry: 5, fill: "#E9778A", opacity: 0 }, headG)];
    const hairFront = el("path", { fill: s.hairColor, stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }, headG);
    const hairHi = el("path", { fill: "none", stroke: shade(s.hairColor, 0.35), "stroke-width": 3, "stroke-linecap": "round", opacity: 0.8 }, headG);
    if (s.wings) el("path", { d: "M-10,-36 Q-20,-66 -34,-74 M10,-36 Q22,-66 36,-72", fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, headG);
    const eyes = [0, 1].map((i) => {
      const eg = el("g", {}, headG);
      const white = el("ellipse", SKIN ? { rx: 9.5, ry: 11.5, fill: "#FFFFFF", stroke: INK, "stroke-width": 2.2 } : { rx: 9.5, ry: 11.5, fill: "#FFFFFF" }, eg);
      const cp = el("clipPath", { id: `${id}-e${i}` }, eg); const clipE = el("ellipse", { rx: 10, ry: 12 }, cp);
      const pupil = el("circle", { r: 4.9, fill: INK, "clip-path": `url(#${id}-e${i})` }, eg);
      const glint = el("circle", { r: 1.6, fill: "#FFFFFF", "clip-path": `url(#${id}-e${i})` }, eg);
      const lid = el("path", { fill: SKIN || INK, "clip-path": `url(#${id}-e${i})` }, eg);
      const arc = el("path", { fill: "none", stroke: FEAT, "stroke-width": 4.6, "stroke-linecap": "round" }, eg);
      const brow = el("path", { fill: "none", stroke: FEAT, "stroke-width": 4.2, "stroke-linecap": "round" }, eg);
      return { eg, white, clipE, pupil, glint, lid, arc, brow };
    });
    const mouth = el("path", { fill: SKIN ? "#5A2A2E" : "#FFFFFF", stroke: FEAT, "stroke-width": 3.4, "stroke-linecap": "round", "stroke-linejoin": "round" }, headG);
    const tongue = el("ellipse", { rx: 5, ry: 3, fill: "#E9778A", opacity: 0 }, headG);
    // talking mouth (viseme lip-sync): cavity, clipped teeth + tongue, lip outline, lower-lip accent
    const vmG = el("g", { opacity: 0 }, headG), vmCp = el("clipPath", { id: `${id}-vm` }, vmG), vmClip = el("path", {}, vmCp);
    const LIPC = SKIN ? "#C9706E" : "#B8565E", LIPD = SKIN ? "#6E2E34" : "#E7A0A2";
    const vmLips = el("path", { fill: LIPC, stroke: SKIN ? INK : "none", "stroke-width": 1.6, "stroke-linejoin": "round" }, vmG);
    const vmCav = el("path", { fill: "#3A1019" }, vmG), vmClipG = el("g", { "clip-path": `url(#${id}-vm)` }, vmG);
    const vmTongue = el("ellipse", { fill: "#E46F84" }, vmClipG), vmTT = el("rect", { fill: "#FFFFFF" }, vmClipG), vmTB = el("rect", { fill: "#F4F1EA" }, vmClipG);
    const vmLip = el("path", { fill: "none", stroke: "#2A0C12", "stroke-width": 1.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, vmG);
    const vmLow = el("path", { fill: "none", stroke: LIPD, "stroke-width": 1.6, "stroke-linecap": "round", opacity: 0.85 }, vmG);
    const vmTip = el("ellipse", { fill: "#E46F84", stroke: FEAT, "stroke-width": 1.2, opacity: 0 }, vmG);
    const FXG = el("g", {}, headG), TEAR = "#7EC8E3";
    const fx = { tears: [0, 1].map(() => el("path", { fill: TEAR, stroke: INK, "stroke-width": 2, opacity: 0 }, FXG)), drops: [0, 1].map(() => el("path", { d: "M0,-6 Q5,2 0,5 Q-5,2 0,-6 Z", fill: TEAR, stroke: INK, "stroke-width": 1.6, opacity: 0 }, FXG)),
      sweat: el("path", { d: "M0,-9 Q7,2 0,7 Q-7,2 0,-9 Z", fill: TEAR, stroke: INK, "stroke-width": 2, opacity: 0 }, FXG),
      stars: [0, 1].map(() => el("path", { d: "M0,-9 L2.6,-2.8 9,-2.8 3.9,1.2 5.8,7.6 0,3.8 -5.8,7.6 -3.9,1.2 -9,-2.8 -2.6,-2.8 Z", fill: "#FFD24A", stroke: INK, "stroke-width": 1.6, opacity: 0 }, FXG)),
      hearts: [0, 1].map(() => el("path", { d: "M0,7 C-12,-1 -9,-12 0,-5 C9,-12 12,-1 0,7 Z", fill: "#E8475A", stroke: INK, "stroke-width": 1.6, opacity: 0 }, FXG)),
      spirals: [0, 1].map(() => el("path", { d: "M0,0 m0,-1 a1,1 0 1,1 -2,1 a3,3 0 1,1 6,0 a5,5 0 1,1 -10,0 a7,7 0 1,1 14,0", fill: "none", stroke: FEAT === "#FFFFFF" ? "#FFFFFF" : INK, "stroke-width": 2, opacity: 0 }, FXG)),
      circles: [0, 1].map(() => el("path", { fill: "none", stroke: "#8A6A9A", "stroke-width": 2.6, "stroke-linecap": "round", opacity: 0 }, FXG)),
      anger: el("path", { d: "M-9,-3 L-3,-3 L-3,-9 M3,-9 L3,-3 L9,-3 M9,3 L3,3 L3,9 M-3,9 L-3,3 L-9,3", fill: "none", stroke: "#E8323A", "stroke-width": 3.4, "stroke-linecap": "round", opacity: 0 }, FXG),
      shines: [0, 1].map(() => el("path", { d: "M0,-4 L1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1 Z", fill: "#FFFFFF", opacity: 0 }, FXG)),
      q: el("text", { "font-family": "Outfit, Nunito, sans-serif", "font-weight": 900, "font-size": 30, fill: "#FFD24A", stroke: INK, "stroke-width": 2.4, "paint-order": "stroke", "text-anchor": "middle", opacity: 0 }, FXG),
      zs: [0, 1, 2].map(() => el("text", { "font-family": "Outfit, Nunito, sans-serif", "font-weight": 900, "font-size": 18, fill: "#FFFFFF", stroke: INK, "stroke-width": 2.2, "paint-order": "stroke", opacity: 0 }, FXG)) };
    fx.q.textContent = "?"; fx.zs.forEach((z) => (z.textContent = "z"));
    const glasses = s.glasses ? el("g", {}, headG) : null;
    if (glasses) { el("circle", { cx: -13, cy: -4, r: 13.5, fill: "rgba(255,255,255,0.06)", stroke: FEAT, "stroke-width": 2.8 }, glasses); el("circle", { cx: 13, cy: -4, r: 13.5, fill: "rgba(255,255,255,0.06)", stroke: FEAT, "stroke-width": 2.8 }, glasses); el("path", { d: "M-1,-6 L1,-6", stroke: "#FFFFFF", "stroke-width": 2.8 }, glasses); }
    const frontG = el("g", {}, body);
    const sleeveF = tube(frontG, 17, s.color);
    const foreFo = SKIN && !THIN ? el("path", { fill: "none", stroke: INK, "stroke-width": 12 + OUT * 2, "stroke-linecap": "round" }, frontG) : null;
    const foreF = el("path", { fill: "none", stroke: THIN ? INK : (SKIN || INK), "stroke-width": THIN ? TW : 12, "stroke-linecap": "round" }, frontG);
    const handF = el("path", SKIN && !THIN ? { fill: SKIN, stroke: INK, "stroke-width": 3.4, "stroke-linejoin": "round" } : { fill: INK }, frontG);
    const propG = el("g", {}, frontG);
    let prop = null;

    function hairPaths() {
      switch (s.hair) {
        case "ponytail": return [`M-28,-14 Q-70,-6 -58,40 Q-50,56 -40,44 Q-44,16 -24,8 Z`, `M-41,-6 Q-38,-48 0,-48 Q40,-48 42,-6 Q22,-30 -8,-26 Q-28,-22 -41,-6 Z`, "M-20,-38 Q0,-44 20,-38"];
        case "bun": return [`M-14,-52 a17,17 0 1,0 34,0 a17,17 0 1,0 -34,0`, `M-41,-6 Q-38,-48 0,-48 Q40,-48 42,-6 Q0,-28 -41,-6 Z`, "M-18,-40 Q0,-45 18,-40"];
        case "short": return ["", `M-42,-2 Q-42,-48 0,-48 Q44,-48 42,-6 Q30,-22 10,-26 Q-16,-30 -42,-2 Z`, "M-16,-40 Q2,-46 20,-38"];
        case "curly": return ["", "M-45,2 q-8,-16 4,-26 q-2,-18 16,-20 q9,-14 25,-7 q16,-7 25,7 q18,4 16,22 q9,12 2,25 q-18,-20 -88,-1 z", "M-14,-40 q8,-6 16,0"];
        case "cap": return ["", `M-42,-10 Q-38,-50 2,-50 Q40,-48 43,-10 Z M34,-14 L72,-6 Q60,0 38,-2 Z`, "M-24,-38 Q0,-46 24,-38"];
        case "long": return [`M-43,-4 Q-52,56 -34,70 L34,70 Q52,56 43,-4 Z`, `M-42,-4 Q-38,-48 0,-48 Q38,-48 42,-4 Q16,-30 -42,-4 Z`, "M-14,-40 Q4,-46 22,-40"];
        case "spiky": return ["", "M-42,-4 L-38,-34 L-26,-30 L-20,-54 L-6,-38 L4,-58 L14,-38 L28,-52 L30,-30 L42,-30 L42,-4 Q0,-24 -42,-4 Z", ""];
        case "afro": return [`M-50,6 a50,46 0 1,1 100,0 Q50,-6 42,-2 Q0,-30 -42,-2 Q-50,-6 -50,6 Z`, "", ""];
        default: return ["", "", ""];
      }
    }
    const xs = s.x || [[0, 0]];
    const T_END = Math.max(30, xs[xs.length - 1][0] + 5);
    const dist = [];
    { let d = 0, px = sampleTrack(xs, 0, 0), py = sampleTrack(s.y, 0, 900); for (let i = 0; i <= T_END * 60; i++) { const xv = sampleTrack(xs, i / 60, 0), yv = sampleTrack(s.y, i / 60, 900); d += Math.hypot(xv - px, (yv - py) * 1.6); px = xv; py = yv; dist.push(d); } }
    const distAt = (t) => { const i = clamp(t * 60, 0, dist.length - 1); const i0 = Math.floor(i); return lerp(dist[i0], dist[Math.min(dist.length - 1, i0 + 1)], i - i0); };
    const speedAt = (t) => Math.abs(distAt(t + 0.05) - distAt(t - 0.05)) / 0.1;
    const BASE = { lean: 0, head: 0, crouch: 0, shF: -8, elF: 10, shB: 8, elB: 10, hipF: 4, knF: 0, hipB: -4, knB: 0, armOut: 10 };
    const poseOf = (n) => Object.assign({}, BASE, POSES[n] || {});
    const FXD = { tears: 0, sweat: 0, star: 0, heart: 0, spiral: 0, anger: 0, red: 0, tremble: 0, circles: 0, zzz: 0, qmark: 0, shine: 0, blushK: 0, smug: 0, brow: 0 };
    const moodOf = (n) => Object.assign({}, FXD, MOODS[n] || MOODS.neutral);
    function blend(keys, t, defName, table) {
      if (!keys || !keys.length) return table(defName);
      let cur = table(keys[0][1]);
      for (const [t0, name, dur, ez] of keys) {
        if (t < t0) break;
        const target = table(name), d = dur ?? 0.35, k = d <= 0 ? 1 : clamp((t - t0) / d, 0, 1), kk = (EASE[ez || "back"] || EASE.back)(k);
        const o = {}; for (const key in target) o[key] = lerp(cur[key] ?? target[key], target[key], kk); cur = o;
      }
      return cur;
    }
    const limb = (x0, y0, a1, l1, a2, l2) => { const r1 = (a1 * Math.PI) / 180, r2 = ((a1 + a2) * Math.PI) / 180; const x1 = x0 + Math.sin(r1) * l1, y1 = y0 + Math.cos(r1) * l1; return [x1, y1, x1 + Math.sin(r2) * l2, y1 + Math.cos(r2) * l2]; };
    const mitten = (hx, hy, ang) => { // a mitten hand pointing along ang (deg, 0 = down)
      if (THIN) return `M${hx - 6},${hy} a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0 Z`;
      const r = (ang * Math.PI) / 180, ux = Math.sin(r), uy = Math.cos(r), px = -uy, py = ux;
      const cx = hx + ux * 4, cy = hy + uy * 4;
      return `M${cx + ux * 11},${cy + uy * 11} Q${cx + ux * 12 + px * 10},${cy + uy * 12 + py * 10} ${cx + px * 10},${cy + py * 10} Q${cx - ux * 8 + px * 8},${cy - uy * 8 + py * 8} ${cx - ux * 9},${cy - uy * 9} Q${cx - ux * 6 - px * 9},${cy - uy * 6 - py * 9} ${cx - px * 9},${cy - py * 9} L${cx - px * 14 + ux * 2},${cy - py * 14 + uy * 2} Q${cx - px * 16 + ux * 7},${cy - py * 16 + uy * 7} ${cx - px * 9 + ux * 6},${cy - py * 9 + uy * 6} Q${cx + ux * 12 - px * 9},${cy + uy * 12 - py * 9} ${cx + ux * 11},${cy + uy * 11} Z`;
    };
    const shoe = (fx, fy, toe) => THIN ? `M${fx - 6 * toe},${fy + 4} Q${fx - 6 * toe},${fy - 7} ${fx + 4 * toe},${fy - 7} Q${fx + 13 * toe},${fy - 6} ${fx + 13 * toe},${fy + 4} Z` : `M${fx - 9 * toe},${fy - 12} Q${fx + 4 * toe},${fy - 16} ${fx + 16 * toe},${fy - 6} Q${fx + 24 * toe},${fy} ${fx + 18 * toe},${fy + 4} L${fx - 12 * toe},${fy + 4} Q${fx - 16 * toe},${fy - 4} ${fx - 9 * toe},${fy - 12} Z`;

    function update(t) {
      const boil = Math.floor(t * 12), jit = (k) => (hash(boil * 31 + k, s.seed) - 0.5) * 1.2;
      const x = sampleTrack(xs, t, 0), y = sampleTrack(s.y, t, 900), facing = sampleTrack(s.facing, t, 1) >= 0 ? 1 : -1;
      const sc = sampleTrack(s.scaleT, t, s.scale), vis = sampleTrack(s.opacity, t, 1);
      const P = blend(s.pose, t, "stand", poseOf), M = blend(s.mood, t, "neutral", moodOf), look = sampleTrack(s.look, t, { x: 0, y: 0 });
      const spd = speedAt(t), run = s.walk === "run", w = clamp(spd / ((run ? 260 : 120) * sc), 0, 1) * (s.noWalk ? 0 : 1);
      const stride = (run ? 271 : 193) * sc, ph = (distAt(t) / stride) * Math.PI * 2, amp = run ? 38 : 26, sw = Math.sin(ph);
      P.hipF += amp * sw * w; P.hipB -= amp * sw * w;
      P.knF -= (run ? 70 : 36) * Math.max(0, Math.cos(ph)) * w; P.knB -= (run ? 70 : 36) * Math.max(0, -Math.cos(ph)) * w;
      P.shF -= (run ? 40 : 22) * sw * w; P.shB += (run ? 40 : 22) * sw * w; P.elF += (run ? 70 : 20) * w; P.elB += (run ? 70 : 20) * w;
      P.lean += (run ? 14 : 3) * w;
      const bob = -Math.abs(Math.cos(ph)) * (run ? 10 : 5) * w;
      const breath = Math.sin(t * 2 * Math.PI / 3.4 + s.seed) * 1.8 * (1 - w);
      let squash = 0;
      if (s.mood) for (const [t0] of s.mood) { const k = (t - t0) / 0.28; if (k > 0 && k < 1) squash += Math.sin(k * Math.PI) * 0.035; }
      if (s.squash) for (const [t0, a] of s.squash) { const k = (t - t0) / 0.32; if (k > 0 && k < 1) squash += Math.sin(k * Math.PI) * a; }
      const hipY = -(LEG1 + LEG2 + ANK) + P.crouch + bob, leanR = (P.lean * Math.PI) / 180;
      const P2 = (px, py) => { const dy = py - hipY; return [px * Math.cos(leanR) - dy * Math.sin(leanR), hipY + px * Math.sin(leanR) + dy * Math.cos(leanR)]; };
      const nyU = hipY - TORSO + breath;
      // legs + shoes
      const [kxF, kyF, axF, ayF] = limb(5, hipY, P.hipF, LEG1, P.knF, LEG2);
      const [kxB, kyB, axB, ayB] = limb(-5, hipY, P.hipB, LEG1, P.knB, LEG2);
      const legD = (hx, kx, ky, ax, ay, k0) => `M${hx},${hipY} L${kx + jit(k0)},${ky + jit(k0 + 1)} L${ax},${ay}`;
      const dF = legD(5, kxF, kyF, axF, ayF, 1), dB = legD(-5, kxB, kyB, axB, ayB, 3);
      legF.o.setAttribute("d", dF); legF.f.setAttribute("d", dF); legB.o.setAttribute("d", dB); legB.f.setAttribute("d", dB);
      shoeF.setAttribute("d", shoe(axF, ayF + ANK, 1)); shoeB.setAttribute("d", shoe(axB, ayB + ANK, 1));
      soleF.setAttribute("d", `M${axF - 11},${ayF + ANK + 2} L${axF + 16},${ayF + ANK + 2}`);
      // torso: a bean, narrower at the waist; dress flares
      const botY = s.outfit === "dress" ? hipY + 52 : hipY + 14, hb = s.outfit === "dress" ? 48 : 30;
      const pts = [[-16, nyU - 3], [16, nyU - 3], [31, nyU + 12], [30, nyU + 46], [hb, botY], [-hb, botY], [-30, nyU + 46], [-31, nyU + 12]].map(([a, b]) => P2(a, b));
      const torsoD = `M${pts[0]} L${pts[1]} Q${P2(30, nyU - 1)} ${pts[2]} Q${P2(34, nyU + 30)} ${pts[3]} Q${P2(26, (nyU + botY) / 2 + 20)} ${pts[4][0] + jit(5) * 0.4},${pts[4][1]} Q${P2(0, botY + 8)} ${pts[5]} Q${P2(-26, (nyU + botY) / 2 + 20)} ${pts[6]} Q${P2(-34, nyU + 30)} ${pts[7]} Q${P2(-30, nyU - 1)} ${pts[0]} Z`;
      torso.setAttribute("d", torsoD); torsoOut.setAttribute("d", torsoD); clipP.setAttribute("d", torsoD);
      const sh = [[-40, nyU - 10], [-12, nyU - 10], [-20, botY + 20], [-60, botY + 20]].map(([a, b]) => P2(a, b));
      shadeP.setAttribute("d", `M${sh[0]} L${sh[1]} Q${P2(-4, (nyU + botY) / 2)} ${sh[2]} L${sh[3]} Z`);
      const hi = [[10, nyU + 6], [24, nyU + 8], [26, nyU + 40], [16, nyU + 44]].map(([a, b]) => P2(a, b));
      hiP.setAttribute("d", `M${hi[0]} L${hi[1]} L${hi[2]} L${hi[3]} Z`);
      // outfit details
      const D2 = (a, b) => P2(a, b).join(",");
      let det = "";
      if (s.outfit === "hoodie") det = `M${D2(-18, nyU + 4)} Q${D2(0, nyU + 18)} ${D2(18, nyU + 4)} M${D2(-6, nyU + 12)} L${D2(-7, nyU + 34)} M${D2(6, nyU + 12)} L${D2(7, nyU + 34)} M${D2(-20, botY - 30)} L${D2(20, botY - 30)} L${D2(24, botY - 8)} L${D2(-24, botY - 8)} Z`;
      else if (s.outfit === "shirt") det = `M${D2(-14, nyU)} L${D2(0, nyU + 18)} L${D2(14, nyU)} M${D2(0, nyU + 18)} L${D2(0, botY - 4)} M${D2(-1, nyU + 34)} l2,0 M${D2(-1, nyU + 54)} l2,0 M${D2(-1, nyU + 74)} l2,0`;
      else if (s.outfit === "jacket") det = `M${D2(0, nyU + 4)} L${D2(0, botY - 2)} M${D2(-16, nyU)} L${D2(-6, nyU + 30)} M${D2(16, nyU)} L${D2(6, nyU + 30)} M${D2(-24, botY - 26)} l10,0 M${D2(14, botY - 26)} l10,0`;
      else if (s.outfit === "apron") det = `M${D2(-22, nyU + 26)} L${D2(22, nyU + 26)} L${D2(24, botY + 2)} L${D2(-24, botY + 2)} Z M${D2(-22, nyU + 26)} L${D2(-30, nyU + 8)} M${D2(22, nyU + 26)} L${D2(30, nyU + 8)} M${D2(-10, botY - 24)} L${D2(10, botY - 24)}`;
      else if (s.outfit === "tee") det = `M${D2(-14, nyU)} Q${D2(0, nyU + 12)} ${D2(14, nyU)}`;
      else if (s.outfit === "coat") det = `M${D2(-4, nyU + 4)} L${D2(-4, botY)} M${D2(-12, nyU + 30)} l3,0 M${D2(-12, nyU + 56)} l3,0 M${D2(-16, nyU)} L${D2(-2, nyU + 24)} L${D2(14, nyU)}`;
      else if (s.outfit === "dress") det = `M${D2(-24, nyU + 50)} Q${D2(0, nyU + 58)} ${D2(24, nyU + 50)}`;
      detail.innerHTML = ""; if (det) el("path", { d: det, fill: s.outfit === "apron" ? "rgba(255,255,255,0.75)" : "none" }, detail);
      // arms
      const [shX, shY] = P2(18, nyU + 14), [shXb, shYb] = P2(-18, nyU + 14), out = P.armOut;
      const [exF, eyF, hxF, hyF] = limb(shX, shY, P.shF + out * 0.2 + P.lean, ARM1, P.elF, ARM2);
      const [exB, eyB, hxB, hyB] = limb(shXb, shYb, P.shB - out * 0.2 + P.lean, ARM1, P.elB, ARM2);
      const cuff = (ex, ey, hx, hy) => [ex + (hx - ex) * 0.35, ey + (hy - ey) * 0.35];
      const [cfx, cfy] = cuff(exF, eyF, hxF, hyF), [cbx, cby] = cuff(exB, eyB, hxB, hyB);
      const sF = `M${shX},${shY} L${exF + jit(6)},${eyF + jit(7)} L${cfx},${cfy}`, sB = `M${shXb},${shYb} L${exB + jit(8)},${eyB + jit(9)} L${cbx},${cby}`;
      sleeveF.o.setAttribute("d", sF); sleeveF.f.setAttribute("d", sF); sleeveB.o.setAttribute("d", sB); sleeveB.f.setAttribute("d", sB);
      foreF.setAttribute("d", `M${cfx},${cfy} L${hxF},${hyF}`); foreB.setAttribute("d", `M${cbx},${cby} L${hxB},${hyB}`); if (foreFo) { foreFo.setAttribute("d", foreF.getAttribute("d")); foreBo.setAttribute("d", foreB.getAttribute("d")); }
      handF.setAttribute("d", mitten(hxF, hyF, P.shF + P.elF + P.lean)); handB.setAttribute("d", mitten(hxB, hyB, P.shB + P.elB + P.lean));
      const [nx0, ny0] = P2(0, nyU + 2), [hX, hY] = P2(0, nyU - NECK - HEADR + 4);
      neck.setAttribute("d", `M${nx0},${ny0} L${hX},${hY + HEADR - 6}`); if (neckO) neckO.setAttribute("d", neck.getAttribute("d"));
      // head
      const headLag = Math.sin(t * 2 * Math.PI / 3.4 + s.seed + 0.6) * 1.2;
      const trm = (M.tremble || 0) * 1.6, tjx = trm * Math.sin(t * 61 + s.seed), tjy = trm * Math.cos(t * 53 + s.seed * 2);
      headG.setAttribute("transform", `translate(${hX + tjx},${hY + headLag + tjy}) rotate(${P.head * 0.6 + (s.hair === "ponytail" ? 0 : 0)}) scale(${1 + squash * 0.4},${1 - squash * 0.7})`);
      const [hb2, hf2, hh2] = hairPaths();
      const sway = Math.sin(t * 5 + s.seed) * 4 * (0.4 + w) + spd * 0.01;
      hairBack.setAttribute("d", hb2); hairBack.setAttribute("transform", s.hair === "ponytail" ? `rotate(${sway},-28,-6)` : "");
      hairFront.setAttribute("d", hf2); hairHi.setAttribute("d", hh2);
      spec_.setAttribute("d", `M${-HEADR * 0.62},${-HEADR * 0.38} A${HEADR * 0.74},${HEADR * 0.74} 0 0 1 ${-HEADR * 0.2},${-HEADR * 0.7}`);
      const blinkPhase = (t + s.seed * 1.37) % 3.8, blink = blinkPhase < 0.1 ? 1 - Math.sin((blinkPhase / 0.1) * Math.PI) : 1;
      const dart = (hash(Math.floor((t + s.seed) / 1.9), s.seed + 5) - 0.5) * 0.5;
      const open = M.open * blink;
      eyes.forEach((E, i) => {
        const side = i === 0 ? -1 : 1, ex = side * 14 + 7, ey = -5, sz = M.size * 1.04;
        E.eg.setAttribute("transform", `translate(${ex},${ey}) scale(${sz})`);
        E.white.setAttribute("ry", Math.max(0.8, 11.5 * open)); E.clipE.setAttribute("ry", Math.max(0.8, 12 * open));
        E.white.setAttribute("opacity", 1 - M.happy);
        const px = clamp(look.x + dart, -1, 1) * 4.2 + 1.5, py = clamp(look.y + M.look, -1, 1) * 4.6;
        E.pupil.setAttribute("cx", px); E.pupil.setAttribute("cy", py * open); E.pupil.setAttribute("opacity", (1 - M.happy) * (open > 0.25 ? 1 : 0));
        E.glint.setAttribute("cx", px + 1.8); E.glint.setAttribute("cy", py * open - 2); E.glint.setAttribute("opacity", (1 - M.happy) * (open > 0.4 ? 1 : 0));
        const lidY = -11.5 + 23 * M.lid, sl = M.slant * 7 * (i === 0 ? -1 : 1);
        E.lid.setAttribute("d", `M-14,-16 L14,-16 L14,${lidY - sl} L-14,${lidY + sl} Z`); E.lid.setAttribute("opacity", 1 - M.happy);
        E.arc.setAttribute("d", "M-8,3 Q0,-8 8,3"); E.arc.setAttribute("opacity", M.happy);
        { const lift = Math.min((M.size - 1) * 26, 10) + (M.happy * 2)   /* capped: exaggerated eye sizes kept brows flying off the head */ + ((M.smug || 0) * (i === 1 ? 7 : -3)), tilt = (M.slant + (M.brow || 0) * 0.6) * 5 * (i === 0 ? 1 : -1), by = Math.max((-19 - lift) * sz, -40) / sz;   /* keep brows on the forehead at exaggerated eye sizes (unchanged for normal moods) */
          E.brow.setAttribute("d", `M-9,${by - tilt} Q0,${by - 3 - Math.max(0, -M.slant) * 2} 9,${by + tilt}`); E.brow.setAttribute("opacity", 0.95); }
      });
      const bl = clamp(M.smile, 0, 1) * 0.55 + (s.blush || 0);
      blush.forEach((b, i) => { b.setAttribute("cx", (i ? 24 : -14) + 7); b.setAttribute("cy", 12); b.setAttribute("opacity", clamp(bl + (M.blushK || 0) * 0.75, 0, 1)); });
      redTint.setAttribute("opacity", clamp(M.red || 0, 0, 1) * (0.32 + 0.08 * Math.sin(t * 9)));
      { const EX = [-7, 21], EY = -5, hideP = Math.max(M.star || 0, M.heart || 0, M.spiral || 0);
        if (hideP > 0.5) eyes.forEach((E) => { E.pupil.setAttribute("opacity", 0); E.glint.setAttribute("opacity", 0); });
        fx.tears.forEach((p, i) => { const k = clamp(M.tears || 0, 0, 1), x0 = EX[i] + (i ? 4 : -4), L = 34 * k, wv = Math.sin(t * 7 + i * 2) * 2.5;
          p.setAttribute("d", `M${x0 - 3.5},${EY + 9} Q${x0 - 5 + wv},${EY + 9 + L * 0.55} ${x0 - 2},${EY + 9 + L} L${x0 + 3},${EY + 9 + L} Q${x0 + 5 + wv},${EY + 9 + L * 0.55} ${x0 + 3.5},${EY + 9} Z`); p.setAttribute("opacity", k > 0.05 ? 1 : 0); });
        fx.drops.forEach((d, i) => { const k = clamp(M.tears || 0, 0, 1), ph = ((t * 1.4 + i * 0.5) % 1); d.setAttribute("opacity", k > 0.4 ? (1 - ph) : 0); d.setAttribute("transform", `translate(${EX[i] + (i ? 6 : -6)},${EY + 44 + ph * 30})`); });
        { const k = clamp(M.sweat || 0, 0, 1), ph = (t * 0.7) % 1; fx.sweat.setAttribute("opacity", k > 0.05 ? k * (ph < 0.85 ? 1 : (1 - ph) / 0.15) : 0); fx.sweat.setAttribute("transform", `translate(${40},${-24 + ph * 18}) scale(${0.8 + 0.3 * k})`); }
        fx.stars.forEach((p, i) => { const k = clamp(M.star || 0, 0, 1); p.setAttribute("opacity", k > 0.3 ? 1 : 0); p.setAttribute("transform", `translate(${EX[i]},${EY}) scale(${k * (1.05 + 0.15 * Math.sin(t * 9 + i))}) rotate(${Math.sin(t * 3) * 10})`); });
        fx.hearts.forEach((p, i) => { const k = clamp(M.heart || 0, 0, 1); p.setAttribute("opacity", k > 0.3 ? 1 : 0); p.setAttribute("transform", `translate(${EX[i]},${EY}) scale(${k * (1 + 0.18 * Math.abs(Math.sin(t * 6)))})`); });
        fx.spirals.forEach((p, i) => { const k = clamp(M.spiral || 0, 0, 1); p.setAttribute("opacity", k > 0.3 ? 1 : 0); p.setAttribute("transform", `translate(${EX[i]},${EY}) rotate(${t * 360 * (i ? 1 : -1)}) scale(${k * 0.9})`); });
        fx.circles.forEach((p, i) => { const k = clamp(M.circles || 0, 0, 1); p.setAttribute("d", `M${EX[i] - 8},${EY + 13} Q${EX[i]},${EY + 18} ${EX[i] + 8},${EY + 13}`); p.setAttribute("opacity", k * 0.9); });
        { const k = clamp(M.anger || 0, 0, 1); fx.anger.setAttribute("opacity", k > 0.1 ? 1 : 0); fx.anger.setAttribute("transform", `translate(30,-34) scale(${k * (1 + 0.2 * Math.abs(Math.sin(t * 8)))})`); }
        fx.shines.forEach((p, i) => { const k = clamp(M.shine || 0, 0, 1); p.setAttribute("opacity", k * (0.75 + 0.25 * Math.sin(t * 5 + i))); p.setAttribute("transform", `translate(${EX[i] - 3},${EY - 5}) scale(${0.8 + 0.4 * k})`); });
        { const k = clamp(M.qmark || 0, 0, 1); fx.q.setAttribute("opacity", k > 0.2 ? 1 : 0); fx.q.setAttribute("transform", `translate(${34},${-52 + Math.sin(t * 4) * 3}) rotate(${Math.sin(t * 5) * 14}) scale(${k})`); }
        fx.zs.forEach((z, i) => { const k = clamp(M.zzz || 0, 0, 1), ph = ((t * 0.5 + i / 3) % 1); z.setAttribute("opacity", k > 0.2 ? Math.sin(ph * Math.PI) : 0); z.setAttribute("transform", `translate(${30 + ph * 24 + Math.sin(ph * 6) * 4},${-36 - ph * 40}) scale(${0.7 + ph * 0.8})`); }); }
      // mouth + talking
      let talkOpen = 0;
      if (s.lips && window.SR_LIPS) for (const [a, cid] of s.lips) { const L = window.SR_LIPS[cid]; if (!L) continue; const i = Math.floor((t - a) * L.fps); if (i >= 0 && i < L.env.length) talkOpen = Math.max(talkOpen, L.env[i]); }
      if (s.talk) for (const [a, b2] of s.talk) if (t >= a && t < b2) { talkOpen = 0.25 + 0.75 * Math.abs(Math.sin((t - a) * 17 + hash(Math.floor(t * 9), s.seed) * 2)); }
      // viseme lip-sync (SR_LIPS[id].vis): real mouth shapes, energy-scaled, eased between phonemes
      let VM = null;
      if (s.lips && window.SR_LIPS) for (const [a, cid] of s.lips) { const L = window.SR_LIPS[cid]; if (!L || !L.vis) continue; const tl = t - a, last = L.vis[L.vis.length - 1][0];
        if (tl < -0.05 || tl > last + 0.12) continue; let i = 0; while (i + 1 < L.vis.length && L.vis[i + 1][0] <= tl) i++;
        const cur = VIS[L.vis[i][1]] || VIS.X, nx = L.vis[i + 1], nxt = nx ? (VIS[nx[1]] || VIS.X) : VIS.X, gap = nx ? nx[0] - L.vis[i][0] : 1;
        const lead = Math.min(0.075, gap * 0.6), u = nx ? EASE.inOut(clamp((tl - (nx[0] - lead)) / lead, 0, 1)) : 0;
        VM = {}; for (const k in VIS.X) VM[k] = lerp(cur[k], nxt[k], u);
        const fi = Math.floor(tl * L.fps), en = fi >= 0 && fi < L.env.length ? L.env[fi] : 0, g = clamp(0.55 + 0.65 * en, 0.5, 1.15); VM.top *= g; VM.bot *= g; }
      const mo = VM ? 0 : Math.max(M.mopen, talkOpen);
      const mw = 9 + mo * 2.5, cy = 17, curve = M.smile * 7, op = mo * 10;
      mouth.setAttribute("d", `M${7 - mw},${cy} Q7,${cy + curve} ${7 + mw},${cy} Q7,${cy + curve + op} ${7 - mw},${cy} Z`);
      mouth.setAttribute("opacity", VM ? 0 : clamp(Math.max(M.mouth, talkOpen > 0 ? 1 : 0), 0, 1));
      tongue.setAttribute("cx", 7); tongue.setAttribute("cy", cy + curve * 0.5 + op * 0.55); tongue.setAttribute("opacity", !VM && op > 6 ? 0.9 : 0);
      vmG.setAttribute("opacity", VM ? 1 : 0);
      if (VM) { const MS = 1.3, cx = 7, w = VM.w * MS, sm = clamp(M.smile, -0.6, 1), cyc = cy + 1 - sm * 2.6, Ty = cy + 1 - VM.top * MS, By = cy + 1 + VM.bot * MS, kk = lerp(0.32, 0.04, VM.round), open = VM.top + VM.bot;
        const shape = (lx, rx, ty, by, k) => { const ww = (rx - lx) / 2, c = (lx + rx) / 2; return `M${lx.toFixed(2)},${cyc.toFixed(2)} C${(lx + k * ww).toFixed(2)},${ty.toFixed(2)} ${(c - 0.45 * ww).toFixed(2)},${ty.toFixed(2)} ${c.toFixed(2)},${(ty + 1.1).toFixed(2)} C${(c + 0.45 * ww).toFixed(2)},${ty.toFixed(2)} ${(rx - k * ww).toFixed(2)},${ty.toFixed(2)} ${rx.toFixed(2)},${cyc.toFixed(2)} C${(rx - k * 0.8 * ww).toFixed(2)},${(by + 0.6).toFixed(2)} ${(lx + k * 0.8 * ww).toFixed(2)},${(by + 0.6).toFixed(2)} ${lx.toFixed(2)},${cyc.toFixed(2)} Z`; };
        const Lx = cx - w, Rx = cx + w, closed = open < 1.2, d = shape(Lx, Rx, Ty, By, kk);
        const lipT = 3.2 + 0.4 * VM.round, lipB = 4.2 + 0.5 * VM.round + 0.6 * VM.press;
        vmLips.setAttribute("d", shape(Lx - 1.8 - VM.round * 1.2, Rx + 1.8 + VM.round * 1.2, Ty - lipT, By + lipB, Math.max(kk, 0.12)));
        vmClip.setAttribute("d", d); vmCav.setAttribute("d", d); vmCav.setAttribute("opacity", closed ? 0 : 1); vmClipG.setAttribute("opacity", closed ? 0 : 1);
        vmLip.setAttribute("d", closed ? `M${Lx.toFixed(2)},${cyc.toFixed(2)} Q${cx},${(cyc + 1.2 + sm * 1.6).toFixed(2)} ${Rx.toFixed(2)},${cyc.toFixed(2)}` : d); vmLip.setAttribute("stroke-width", (1.6 + VM.press * 0.8).toFixed(2));
        vmTT.setAttribute("x", Lx); vmTT.setAttribute("width", 2 * w); vmTT.setAttribute("y", Ty - 3); vmTT.setAttribute("height", Math.max(0, 3 + VM.tt * 2.6));
        vmTB.setAttribute("x", Lx); vmTB.setAttribute("width", 2 * w); vmTB.setAttribute("y", By - VM.tb * 2.0); vmTB.setAttribute("height", Math.max(0, VM.tb * 2.0 + 3));
        vmTongue.setAttribute("cx", cx); vmTongue.setAttribute("rx", w * 0.55); vmTongue.setAttribute("ry", 3.4 + VM.tg * 1.6); vmTongue.setAttribute("cy", lerp(By - 1, Ty + 4, VM.tup)); vmTongue.setAttribute("opacity", clamp(VM.tg, 0, 1));
        vmTip.setAttribute("cx", cx); vmTip.setAttribute("cy", (Ty + By) / 2 + 0.6); vmTip.setAttribute("rx", 4.4); vmTip.setAttribute("ry", 2.3); vmTip.setAttribute("opacity", VM.tip > 0.5 ? 1 : 0);
        const ly = By + lipB * 0.42 + VM.lip * 0.25; vmLow.setAttribute("d", `M${(cx - 0.3 * w).toFixed(2)},${ly.toFixed(2)} Q${cx},${(ly + 0.9).toFixed(2)} ${(cx + 0.3 * w).toFixed(2)},${ly.toFixed(2)}`); }
      if (glasses) glasses.setAttribute("transform", "translate(7,-1)");
      if (wingG) { const [wx, wy] = P2(0, nyU + 34); const fl = 0.75 + 0.25 * Math.abs(Math.cos(t * Math.PI * (s.flap || 1.6))); wingG.setAttribute("transform", `translate(${wx},${wy}) scale(${fl},1)`); }
      if (s.prop && s.prop.kind) {
        if (!prop) prop = SR.buildProp ? SR.buildProp(propG, s.prop.kind) : null;
        propG.setAttribute("transform", `translate(${hxF},${hyF}) rotate(${s.prop.rot || 0})`); propG.setAttribute("opacity", sampleTrack(s.prop.show, t, 1));
      }
      const idleB = (1 - w) * 0.016 * Math.sin(t * 2.3 + s.seed * 1.7);   // idle breathing: never a frozen frame
      g.setAttribute("transform", `translate(${x},${y}) scale(${sc * facing},${sc * (1 - squash * 0.5 + idleB)})`);
      g.setAttribute("opacity", vis);
      shadow.setAttribute("rx", 50 - Math.abs(bob) * 1.2);
      // step events: a footfall each half cycle (for dust puffs)
      const stepK = Math.floor((distAt(t) / stride) * 2);
      return { x, y, headX: x + hX * sc * facing, headY: y + hY * sc, handX: x + hxF * sc * facing, handY: y + hyF * sc, walk: w, step: stepK, footX: x + (stepK % 2 ? axB : axF) * sc * facing };
    }
    return { g, update, spec: s, hair: [hairBack, hairFront] };
  }

  const CROWD_COLS = [PAL.slate, PAL.sage, PAL.plum, PAL.navy, PAL.forest, "#8A7F72", "#B07A63", "#5E7C99", "#9A8AB0", "#7B9E87", "#C2A27A"];
  const HAIRS = ["none", "short", "ponytail", "bun", "curly", "cap", "long", "spiky", "afro"];
  const HAIRCOL = ["#2A2228", "#2A2228", "#5B3A29", "#8A5A35", "#C79A5A", "#3B2B22", "#7A7068"];
  const OUTFITS = ["hoodie", "tee", "shirt", "jacket", "coat", "tee"];
  const PANTS = ["#3A4A63", "#2F3A4A", "#5A4E44", "#6B6F7A", "#46524A"];
  function Crowd(parent, spec) {
    const s = Object.assign({ n: 12, seed: 11, x0: -200, x1: 2120, y: 900, ySpread: 0, dur: 30, speed: [70, 120], scale: [0.82, 1.0], stand: 0 }, spec);
    const R = mulberry32(s.seed); const people = [];
    for (let i = 0; i < s.n; i++) {
      const dir = s.dir || (R() < 0.5 ? 1 : -1), sp = s.speed[0] + R() * (s.speed[1] - s.speed[0]), standing = R() < s.stand;
      const startX = s.x0 + R() * (s.x1 - s.x0), sc = s.scale[0] + R() * (s.scale[1] - s.scale[0]);
      people.push(Character(parent, {
        id: `${s.idp || "crowd"}-${i}`, color: CROWD_COLS[Math.floor(R() * CROWD_COLS.length)], hair: HAIRS[Math.floor(R() * HAIRS.length)], hairColor: HAIRCOL[Math.floor(R() * HAIRCOL.length)],
        outfit: OUTFITS[Math.floor(R() * OUTFITS.length)], pants: PANTS[Math.floor(R() * PANTS.length)], seed: Math.floor(R() * 1000), scale: sc,
        x: [[0, startX], [s.dur, standing ? startX : startX + dir * sp * s.dur, "linear"]], y: [[0, s.y + (R() - 0.5) * s.ySpread]], facing: [[0, dir]],
        pose: [[0, standing ? (R() < 0.5 ? "phone" : "relaxed") : "relaxed", 0]], mood: [[0, ["neutral", "content", "tired"][Math.floor(R() * 3)], 0]],
        prop: standing && R() < 0.6 ? { kind: "phone" } : (R() < 0.25 ? { kind: "bag" } : null), glasses: R() < 0.2,
      }));
    }
    people.sort((a, b) => a.spec.scale - b.spec.scale).forEach((p) => parent.appendChild(p.g));
    return { people, update: (t) => people.forEach((p) => p.update(t)) };
  }

  // ================= SCENE KIT v2: layered, lit sets =================
  const defsOf = (svg) => svg.querySelector("defs") || el("defs", {}, svg);
  const Scene2 = {
    // soft vertical gradient sky with an optional sun halo
    sky(svg, g, kind = "morning", W = 1920, H = 1080, sun = null) {
      const C = { morning: ["#F3B98F", "#F9DCC0", "#FCEBDD"], noon: ["#9FCFE3", "#C9E6EF", "#EAF4F2"], evening: ["#E7876A", "#F2B38A", "#F8D5B0"], night: ["#1F2A44", "#34405E", "#4A5676"], rain: ["#93A2B0", "#B4C0CA", "#CCD5DB"] }[kind];
      const id = "sk" + (UID++), defs = defsOf(svg);
      const lg = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      el("stop", { offset: "0", "stop-color": C[0] }, lg); el("stop", { offset: "0.55", "stop-color": C[1] }, lg); el("stop", { offset: "1", "stop-color": C[2] }, lg);
      el("rect", { x: -W, y: -H, width: W * 3, height: H * 3, fill: `url(#${id})` }, g);
      if (sun) {
        const rid = "sh" + (UID++); const rg = el("radialGradient", { id: rid }, defs);
        el("stop", { offset: "0", "stop-color": sun.color || "#FFF1CF", "stop-opacity": 0.9 }, rg); el("stop", { offset: "0.35", "stop-color": sun.color || "#FFF1CF", "stop-opacity": 0.35 }, rg); el("stop", { offset: "1", "stop-color": sun.color || "#FFF1CF", "stop-opacity": 0 }, rg);
        el("circle", { cx: sun.x, cy: sun.y, r: (sun.r || 80) * 3.2, fill: `url(#${rid})` }, g);
        el("circle", { cx: sun.x, cy: sun.y, r: sun.r || 80, fill: sun.core || "#FFF4D6" }, g);
      }
    },
    // a facade with cornice, framed windows (some lit, curtains, plants), ground shadow; atmospheric fade for far layers
    building(g, x, w, h, groundY, color, o = {}) {
      const R = mulberry32(o.seed || Math.floor(x * 7 + w));
      const bg = el("g", {}, g), top = groundY - h;
      el("rect", { x: x + 10, y: top + 10, width: w, height: h, fill: "rgba(30,27,34,0.10)" }, bg);
      el("rect", { x, y: top, width: w, height: h, fill: color, stroke: o.far ? "none" : shade(color, -0.35), "stroke-width": o.far ? 0 : 3 }, bg);
      el("rect", { x: x - 8, y: top - 14, width: w + 16, height: 18, fill: shade(color, -0.18), stroke: o.far ? "none" : shade(color, -0.4), "stroke-width": 2 }, bg);
      el("rect", { x, y: top + 4, width: w, height: 10, fill: shade(color, 0.12) }, bg);
      for (let k = 0; k < (o.far ? 0 : 1); k++) el("rect", { x, y: groundY - 26, width: w, height: 26, fill: shade(color, -0.22) }, bg);
      const cols = o.cols || Math.max(2, Math.floor(w / 105)), rows = o.rows || Math.max(1, Math.floor((h - 150) / 120));
      const ww = 50, wh = 66, gx = (w - cols * ww) / (cols + 1);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const wx = x + gx + c * (ww + gx), wy = top + 46 + r * 120, lit = R() < (o.lit ?? 0.18);
        el("rect", { x: wx - 4, y: wy - 4, width: ww + 8, height: wh + 8, fill: shade(color, 0.3) }, bg);
        el("rect", { x: wx, y: wy, width: ww, height: wh, fill: lit ? "#FFE3A3" : (o.glass || "#BFD6DC"), stroke: shade(color, -0.45), "stroke-width": 2.5 }, bg);
        if (!o.far) {
          el("path", { d: `M${wx + 6},${wy + wh - 8} L${wx + ww * 0.55},${wy + 6}`, stroke: "rgba(255,255,255,0.55)", "stroke-width": 4, "stroke-linecap": "round" }, bg);
          el("line", { x1: wx + ww / 2, y1: wy, x2: wx + ww / 2, y2: wy + wh, stroke: shade(color, -0.45), "stroke-width": 2 }, bg);
          const rr = R();
          if (rr < 0.22) el("path", { d: `M${wx + 2},${wy + 2} L${wx + 16},${wy + 2} Q${wx + 10},${wy + 34} ${wx + 2},${wy + wh - 2} Z`, fill: ["#E9C46A", "#D98C8C", "#9DB49A"][Math.floor(R() * 3)], opacity: 0.9 }, bg);
          else if (rr < 0.36) { el("rect", { x: wx + 8, y: wy + wh - 14, width: 34, height: 12, fill: PAL.wood }, bg); el("circle", { cx: wx + 25, cy: wy + wh - 22, r: 12, fill: PAL.forest }, bg); }
        }
        el("rect", { x: wx - 7, y: wy + wh + 2, width: ww + 14, height: 7, fill: shade(color, 0.22), stroke: o.far ? "none" : shade(color, -0.4), "stroke-width": 1.5 }, bg);
      }
      if (!o.far && R() < 0.6) { const ax = x + 20 + R() * (w - 80); el("rect", { x: ax, y: top - 40, width: 46, height: 28, fill: "#A9A9A9", stroke: INK, "stroke-width": 2 }, bg); el("rect", { x: ax + 6, y: top - 36, width: 34, height: 4, fill: "#8A8A8A" }, bg); }
      if (o.far) el("rect", { x: x - 10, y: top - 16, width: w + 20, height: h + 16, fill: o.haze || "#F6E2CF", opacity: o.hazeK ?? 0.42 }, bg);
      return bg;
    },
    street(g, groundY, x0 = -1000, x1 = 3200) {
      const W = x1 - x0;
      el("rect", { x: x0, y: groundY, width: W, height: 74, fill: "#D8CDBE" }, g);
      for (let i = x0; i < x1; i += 120) el("rect", { x: i, y: groundY, width: 3, height: 74, fill: "rgba(0,0,0,0.07)" }, g);
      el("rect", { x: x0, y: groundY + 36, width: W, height: 2, fill: "rgba(0,0,0,0.05)" }, g);
      el("rect", { x: x0, y: groundY + 74, width: W, height: 14, fill: "#B9AEA2" }, g);
      el("rect", { x: x0, y: groundY + 86, width: W, height: 3, fill: "rgba(0,0,0,0.12)" }, g);
      el("rect", { x: x0, y: groundY + 89, width: W, height: 600, fill: "#6F6B68" }, g);
      el("rect", { x: x0, y: groundY + 89, width: W, height: 36, fill: "rgba(0,0,0,0.10)" }, g);
      for (let i = x0; i < x1; i += 240) el("rect", { x: i + 60, y: groundY + 190, width: 120, height: 10, rx: 3, fill: "#EAE3D6" }, g);
      const R = mulberry32(77); for (let i = 0; i < W / 40; i++) el("rect", { x: x0 + R() * W, y: groundY + 120 + R() * 300, width: 14 + R() * 30, height: 2, fill: "rgba(255,255,255,0.05)" }, g);
    },
    // props
    hydrant(g, x, y) { const h = el("g", { transform: `translate(${x},${y})` }, g); el("rect", { x: -14, y: -50, width: 28, height: 50, rx: 6, fill: "#C8452F", stroke: INK, "stroke-width": 3 }, h); el("rect", { x: -20, y: -36, width: 40, height: 10, rx: 4, fill: "#C8452F", stroke: INK, "stroke-width": 3 }, h); el("path", { d: "M-12,-50 Q0,-66 12,-50 Z", fill: "#A9382A", stroke: INK, "stroke-width": 3 }, h); el("rect", { x: -6, y: -44, width: 4, height: 30, fill: "rgba(255,255,255,0.35)" }, h); },
    bin(g, x, y) { const b = el("g", { transform: `translate(${x},${y})` }, g); el("path", { d: "M-24,-70 L24,-70 L20,0 L-20,0 Z", fill: "#4E6E58", stroke: INK, "stroke-width": 3 }, b); el("rect", { x: -28, y: -78, width: 56, height: 10, rx: 4, fill: "#3E5A47", stroke: INK, "stroke-width": 3 }, b); for (const dx of [-10, 0, 10]) el("line", { x1: dx, y1: -62, x2: dx * 0.85, y2: -8, stroke: "rgba(0,0,0,0.2)", "stroke-width": 3 }, b); },
    planter(g, x, y, s = 1) { const p = el("g", { transform: `translate(${x},${y}) scale(${s})` }, g); el("path", { d: "M-26,-36 L26,-36 L20,0 L-20,0 Z", fill: "#B0714F", stroke: INK, "stroke-width": 3 }, p); for (const [dx, dy, r, c] of [[-14, -54, 18, "#4E8A5A"], [10, -60, 20, "#5E9C66"], [0, -76, 16, "#6FAE77"]]) el("circle", { cx: dx, cy: dy, r, fill: c, stroke: INK, "stroke-width": 3 }, p); },
    bike(g, x, y) { const b = el("g", { transform: `translate(${x},${y})`, fill: "none", stroke: INK, "stroke-width": 4 }, g); el("circle", { cx: -36, cy: -24, r: 24 }, b); el("circle", { cx: 36, cy: -24, r: 24 }, b); el("path", { d: "M-36,-24 L-6,-24 L12,-56 L-18,-56 Z M12,-56 L36,-24 M12,-56 L8,-70 M-18,-56 L-22,-66", stroke: "#2F6F8F" }, b); el("path", { d: "M-30,-68 L-14,-68", "stroke-width": 6 }, b); },
    lamp(g, x, groundY) { const l = el("g", {}, g); el("rect", { x: x - 6, y: groundY - 330, width: 12, height: 330, fill: INK }, l); el("rect", { x: x - 12, y: groundY - 16, width: 24, height: 16, fill: INK }, l); el("path", { d: `M${x},${groundY - 330} q44,-34 76,0`, fill: "none", stroke: INK, "stroke-width": 8 }, l); el("path", { d: `M${x + 56},${groundY - 332} l40,0 l-7,24 l-26,0 z`, fill: INK }, l); el("rect", { x: x + 63, y: groundY - 310, width: 26, height: 5, fill: "#FFE3A3" }, l); },
    tree(g, x, groundY, s = 1, color = "#5E8F5F") { const t = el("g", {}, g); el("path", { d: `M${x - 10 * s},${groundY} L${x - 7 * s},${groundY - 150 * s} L${x + 7 * s},${groundY - 150 * s} L${x + 10 * s},${groundY} Z`, fill: "#8A5E3F", stroke: INK, "stroke-width": 3 }, t); for (const [dx, dy, r, k] of [[-48, -168, 52, -0.12], [50, -172, 56, -0.08], [0, -214, 72, 0], [-20, -238, 40, 0.12], [26, -228, 36, 0.1]]) el("circle", { cx: x + dx * s, cy: groundY + dy * s, r: r * s, fill: shade(color, k), stroke: INK, "stroke-width": 3 }, t); el("circle", { cx: x - 20 * s, cy: groundY - 236 * s, r: 14 * s, fill: shade(color, 0.3), opacity: 0.6 }, t); return t; },
    awningShop(g, x, w, groundY, color, sign, awning = PAL.teal) {
      const sg = el("g", {}, g);
      el("rect", { x, y: groundY - 320, width: w, height: 320, fill: color, stroke: shade(color, -0.4), "stroke-width": 3 }, sg);
      el("rect", { x: x + 30, y: groundY - 230, width: w - 180, height: 190, fill: "#BFD6DC", stroke: INK, "stroke-width": 5 }, sg);
      el("rect", { x: x + 30, y: groundY - 230, width: w - 180, height: 190, fill: "url(#none)", opacity: 0 }, sg);
      el("path", { d: `M${x + 50},${groundY - 60} L${x + 160},${groundY - 220} M${x + 110},${groundY - 60} L${x + 210},${groundY - 200}`, stroke: "rgba(255,255,255,0.5)", "stroke-width": 10, "stroke-linecap": "round" }, sg);
      el("rect", { x: x + 30, y: groundY - 40, width: w - 180, height: 12, fill: shade(color, -0.2) }, sg);
      el("rect", { x: x + w - 130, y: groundY - 240, width: 96, height: 240, fill: "#8E5E3E", stroke: INK, "stroke-width": 5 }, sg);
      el("rect", { x: x + w - 116, y: groundY - 222, width: 68, height: 100, fill: "#BFD6DC", stroke: INK, "stroke-width": 3 }, sg);
      el("circle", { cx: x + w - 50, cy: groundY - 110, r: 6, fill: "#E3B23C", stroke: INK, "stroke-width": 2 }, sg);
      const n = Math.max(4, Math.floor(w / 64));
      for (let i = 0; i < n; i++) el("path", { d: `M${x - 10 + i * ((w + 20) / n)},${groundY - 320} l${(w + 20) / n},0 l0,46 q${-(w + 20) / n / 2},22 ${-(w + 20) / n},0 Z`, fill: i % 2 ? "#FFFFFF" : awning, stroke: INK, "stroke-width": 3 }, sg);
      el("rect", { x: x - 10, y: groundY - 324, width: w + 20, height: 8, fill: shade(awning, -0.3) }, sg);
      if (sign) { const sw = Math.max(240, sign.length * 22 + 60); el("rect", { x: x + w / 2 - sw / 2, y: groundY - 404, width: sw, height: 60, rx: 10, fill: INK }, sg); el("rect", { x: x + w / 2 - sw / 2 + 6, y: groundY - 398, width: sw - 12, height: 48, rx: 7, fill: "none", stroke: "#E3B23C", "stroke-width": 2 }, sg); const tx = el("text", { x: x + w / 2, y: groundY - 373, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "Nunito", "font-weight": 900, "font-size": 30, fill: "#FBF4EA", "letter-spacing": "2" }, sg); tx.textContent = sign; }
      return sg;
    },
    // interior: wainscot wall, framed art, shelf, warm light pools
    interior(svg, g, groundY = 900, o = {}) {
      const wall = o.wall || "#EADBC6", floor = o.floor || "#B98E6A";
      el("rect", { x: -800, y: -400, width: 3600, height: groundY + 400, fill: wall }, g);
      el("rect", { x: -800, y: groundY - 240, width: 3600, height: 240, fill: shade(wall, -0.08) }, g);
      el("rect", { x: -800, y: groundY - 246, width: 3600, height: 10, fill: shade(wall, -0.25) }, g);
      for (let i = -800; i < 2800; i += 70) el("rect", { x: i, y: groundY - 236, width: 3, height: 236, fill: "rgba(0,0,0,0.05)" }, g);
      el("rect", { x: -800, y: groundY, width: 3600, height: 700, fill: floor }, g);
      for (let i = -800; i < 2800; i += 110) el("rect", { x: i, y: groundY, width: 3, height: 700, fill: "rgba(0,0,0,0.07)" }, g);
      el("rect", { x: -800, y: groundY, width: 3600, height: 30, fill: "rgba(0,0,0,0.12)" }, g);
      const defs = defsOf(svg);
      (o.lights || [420, 960, 1500]).forEach((lx) => {
        const rid = "lp" + (UID++); const rg = el("radialGradient", { id: rid }, defs);
        el("stop", { offset: "0", "stop-color": "#FFE7B8", "stop-opacity": 0.55 }, rg); el("stop", { offset: "1", "stop-color": "#FFE7B8", "stop-opacity": 0 }, rg);
        el("ellipse", { cx: lx, cy: 300, rx: 300, ry: 260, fill: `url(#${rid})` }, g);
        el("path", { d: `M${lx},-400 L${lx},170`, stroke: INK, "stroke-width": 3 }, g);
        el("path", { d: `M${lx - 46},214 Q${lx},150 ${lx + 46},214 Z`, fill: PAL.mustard, stroke: INK, "stroke-width": 4 }, g);
        el("ellipse", { cx: lx, cy: 216, rx: 14, ry: 6, fill: "#FFF1C9" }, g);
      });
      (o.frames || []).forEach(([fx, fy, fw, fh, c]) => { el("rect", { x: fx, y: fy, width: fw, height: fh, fill: "#FBF7EE", stroke: INK, "stroke-width": 5 }, g); el("rect", { x: fx + 12, y: fy + 12, width: fw - 24, height: fh - 24, fill: c || PAL.sage }, g); el("circle", { cx: fx + fw * 0.65, cy: fy + fh * 0.4, r: Math.min(fw, fh) * 0.14, fill: "#F2D28A" }, g); el("path", { d: `M${fx + 12},${fy + fh - 12} L${fx + fw * 0.4},${fy + fh * 0.5} L${fx + fw - 12},${fy + fh - 12} Z`, fill: shade(c || PAL.sage, -0.25) }, g); });
      if (o.shelf) { const [sx, sy, sw] = o.shelf; el("rect", { x: sx, y: sy, width: sw, height: 12, fill: PAL.wood, stroke: INK, "stroke-width": 3 }, g); const R = mulberry32(5); for (let i = 0; i < sw / 44; i++) { const cx = sx + 20 + i * 44, cc = ["#FBF7EE", "#E9C46A", "#9DB49A", "#D98C8C"][Math.floor(R() * 4)]; el("path", { d: `M${cx - 12},${sy - 30} L${cx + 12},${sy - 30} L${cx + 10},${sy} L${cx - 10},${sy} Z`, fill: cc, stroke: INK, "stroke-width": 2.5 }, g); } }
    },
    vignette(svg, g, k = 0.22, W = 1920, H = 1080) { const defs = defsOf(svg), rid = "vg" + (UID++); const rg = el("radialGradient", { id: rid, cx: "50%", cy: "50%", r: "75%" }, defs); el("stop", { offset: "0.6", "stop-color": "#1E1B22", "stop-opacity": 0 }, rg); el("stop", { offset: "1", "stop-color": "#1E1B22", "stop-opacity": k }, rg); el("rect", { x: 0, y: 0, width: W, height: H, fill: `url(#${rid})`, "pointer-events": "none" }, g); },
  };

  // ================= FX =================
  const FX = {
    // dust puffs at footfalls: call per frame with the character's update() result
    dust(parent, n = 6) {
      const pool = []; for (let i = 0; i < n; i++) pool.push(el("circle", { r: 0, fill: "#E9E2D6", stroke: "rgba(30,27,34,0.25)", "stroke-width": 2, opacity: 0 }, parent));
      const steps = []; let last = -1;
      return { update(t, c, groundY) { if (c.walk > 0.3 && c.step !== last) { steps.push({ t, x: c.footX, y: groundY }); last = c.step; } pool.forEach((p, i) => { const s = steps[steps.length - 1 - Math.floor(i / 2)]; if (!s) return p.setAttribute("opacity", 0); const k = clamp((t - s.t) / 0.45, 0, 1); p.setAttribute("cx", s.x + (i % 2 ? 1 : -1) * (6 + k * 16)); p.setAttribute("cy", s.y - 4 - k * 8); p.setAttribute("r", 4 + k * 9); p.setAttribute("opacity", k > 0 && k < 1 ? (1 - k) * 0.8 : 0); }); } };
    },
    speedLines(parent, n = 7) { const L = []; for (let i = 0; i < n; i++) L.push(el("line", { stroke: "rgba(30,27,34,0.35)", "stroke-width": 4, "stroke-linecap": "round", opacity: 0 }, parent)); return { update(t, c, dir, k) { L.forEach((l, i) => { const yy = c.headY + 20 + i * 22, len = 60 + 50 * hash(i + Math.floor(t * 10), 3); l.setAttribute("x1", c.x - dir * (60 + i * 6)); l.setAttribute("x2", c.x - dir * (60 + i * 6 + len)); l.setAttribute("y1", yy); l.setAttribute("y2", yy); l.setAttribute("opacity", k * 0.9); }); } }; },
    sweat(parent) { const g = el("g", {}, parent); const d = [0, 1].map(() => el("path", { d: "M0,-14 Q8,0 0,6 Q-8,0 0,-14 Z", fill: "#7EC8E3", stroke: INK, "stroke-width": 2 }, g)); return { update(t, c, on) { d.forEach((p, i) => { const k = ((t * 1.6 + i * 0.5) % 1); p.setAttribute("transform", `translate(${c.headX + (i ? 44 : -40)},${c.headY - 30 + k * 40}) scale(${on ? 1 : 0})`); p.setAttribute("opacity", on ? 1 - k : 0); }); } }; },
    sparkles(parent, color = PAL.kind, n = 8) { const S = []; for (let i = 0; i < n; i++) S.push(el("path", { d: "M0,-12 L3,-3 L12,0 L3,3 L0,12 L-3,3 L-12,0 L-3,-3 Z", fill: color, stroke: INK, "stroke-width": 1.5, opacity: 0 }, parent)); return { update(t, cx, cy, t0, rad = 90) { S.forEach((s, i) => { const k = clamp((t - t0 - i * 0.04) / 0.8, 0, 1), a = (i / n) * Math.PI * 2 + 0.4; s.setAttribute("transform", `translate(${cx + Math.cos(a) * rad * EASE.out(k)},${cy + Math.sin(a) * rad * EASE.out(k)}) rotate(${k * 90}) scale(${Math.sin(k * Math.PI)})`); s.setAttribute("opacity", k > 0 && k < 1 ? 1 : 0); }); } }; },
    hearts(parent, n = 4) { const H = []; for (let i = 0; i < n; i++) H.push(el("path", { d: "M0,8 C-14,-2 -12,-16 0,-8 C12,-16 14,-2 0,8 Z", fill: "#E9778A", stroke: INK, "stroke-width": 2, opacity: 0 }, parent)); return { update(t, cx, cy, t0) { H.forEach((h, i) => { const k = clamp((t - t0 - i * 0.18) / 1.2, 0, 1); h.setAttribute("transform", `translate(${cx + Math.sin(k * 6 + i) * 14 + (i - 1.5) * 18},${cy - k * 90}) scale(${1.3 * Math.sin(Math.min(1, k * 2) * Math.PI / 2)})`); h.setAttribute("opacity", k > 0 && k < 1 ? 1 - k * 0.7 : 0); }); } }; },
    impact(parent, color = "#FFFFFF") { const g = el("g", { opacity: 0 }, parent); let d = ""; for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI * 2, r = i % 2 ? 26 : 60; d += (i ? "L" : "M") + Math.cos(a) * r + "," + Math.sin(a) * r; } el("path", { d: d + "Z", fill: color, stroke: INK, "stroke-width": 4 }, g); return { update(t, x, y, t0) { const k = clamp((t - t0) / 0.35, 0, 1); g.setAttribute("opacity", k > 0 && k < 1 ? 1 : 0); g.setAttribute("transform", `translate(${x},${y}) scale(${EASE.back(Math.min(1, k * 2)) * (1 - k * 0.3)}) rotate(${k * 20})`); } }; },
    anger(parent) { const g = el("path", { d: "M-10,-2 L-2,-2 L-2,-10 M2,-10 L2,-2 L10,-2 M10,2 L2,2 L2,10 M-2,10 L-2,2 L-10,2", fill: "none", stroke: PAL.rude, "stroke-width": 4, "stroke-linecap": "round", opacity: 0 }, parent); return { update(t, c, on) { const p = 1 + 0.15 * Math.sin(t * 14); g.setAttribute("transform", `translate(${c.headX + 30},${c.headY - 34}) scale(${on ? p : 0})`); g.setAttribute("opacity", on ? 1 : 0); } }; },
  };

  // ================= LIFE: ambient motion =================
  const Life = {
    clouds(parent, n = 5, y0 = 80, y1 = 300, W = 1920, seed = 3) { const R = mulberry32(seed), C = []; for (let i = 0; i < n; i++) { const c = el("g", { opacity: 0.85 }, parent); const s = 0.6 + R() * 0.8; for (const [dx, dy, r] of [[0, 0, 40], [40, -14, 52], [90, 0, 40], [44, 12, 44]]) el("circle", { cx: dx * s, cy: dy * s, r: r * s, fill: "#FFFFFF" }, c); C.push({ c, x: R() * W, y: y0 + R() * (y1 - y0), v: 6 + R() * 12 }); } return { update(t) { C.forEach((k) => k.c.setAttribute("transform", `translate(${((k.x + k.v * t) % (W + 400)) - 200},${k.y})`)); } }; },
    birds(parent, n = 4, seed = 9) { const R = mulberry32(seed), B = []; for (let i = 0; i < n; i++) { const b = el("path", { fill: "none", stroke: INK, "stroke-width": 3.5, "stroke-linecap": "round" }, parent); B.push({ b, x0: -100 - R() * 600, y: 120 + R() * 200, v: 90 + R() * 60, ph: R() * 6 }); } return { update(t) { B.forEach((k) => { const f = Math.sin(t * 12 + k.ph) * 8, x = k.x0 + k.v * t, y = k.y + Math.sin(t * 1.5 + k.ph) * 10; k.b.setAttribute("d", `M${x - 14},${y + f} Q${x - 7},${y - 4} ${x},${y} Q${x + 7},${y - 4} ${x + 14},${y + f}`); }); } }; },
    leaves(parent, x0, x1, yTop, groundY, n = 8, seed = 4) { const R = mulberry32(seed), L = []; for (let i = 0; i < n; i++) { const l = el("ellipse", { rx: 8, ry: 4, fill: ["#D98C3E", "#C9A227", "#9DB49A"][i % 3], stroke: INK, "stroke-width": 1.5 }, parent); L.push({ l, x: x0 + R() * (x1 - x0), ph: R() * 10, sp: 40 + R() * 40 }); } return { update(t) { L.forEach((k) => { const life = (t * k.sp / (groundY - yTop) + k.ph) % 1, y = yTop + life * (groundY - yTop); k.l.setAttribute("transform", `translate(${k.x + Math.sin(t * 2 + k.ph) * 30},${y}) rotate(${Math.sin(t * 3 + k.ph) * 60})`); k.l.setAttribute("opacity", life < 0.95 ? 1 : 0); }); } }; },
    steam(parent, x, y, n = 3) { const S = []; for (let i = 0; i < n; i++) S.push(el("path", { fill: "none", stroke: "rgba(255,255,255,0.75)", "stroke-width": 4, "stroke-linecap": "round" }, parent)); return { update(t, ax = x, ay = y) { S.forEach((p, i) => { const k = ((t * 0.6 + i / n) % 1); const yy = ay - k * 60; p.setAttribute("d", `M${ax + (i - 1) * 8},${yy} q8,-10 0,-20 q-8,-10 0,-20`); p.setAttribute("opacity", Math.sin(k * Math.PI) * 0.9); }); } }; },
    traffic(parent, laneY, n = 3, seed = 6, W = 1920) { const R = mulberry32(seed), Cs = []; const cols = ["#C9A227", "#5E7C99", "#B8453F", "#4E6E58", "#9A8AB0"]; for (let i = 0; i < n; i++) { const g = el("g", {}, parent); SR.Set.car(g, 0, 0, cols[Math.floor(R() * cols.length)], 1); Cs.push({ g, x0: -400 - R() * 1500, v: 260 + R() * 160, s: 0.55 + R() * 0.15, dir: R() < 0.5 ? 1 : -1 }); } return { update(t) { Cs.forEach((c) => { const span = W + 900, x = ((c.x0 + c.v * t) % span + span) % span - 400; c.g.setAttribute("transform", `translate(${c.dir > 0 ? x : W - x},${laneY}) scale(${c.dir * c.s},${c.s})`); }); } }; },
  };

  SR.Character = Character; SR.Crowd = Crowd; SR.Scene2 = Scene2; SR.FX = FX; SR.Life = Life; SR.shade = shade; SR.v2 = true;
})();
