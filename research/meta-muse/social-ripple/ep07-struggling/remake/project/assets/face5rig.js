/* Face v5 for the video rig: human-like exaggerated cartoon faces built from BLENDABLE dials, so a character's expression can
   travel progressively through a story (worried -> wobbling -> relieved -> laughing) instead of snapping between icons.
   Loaded after sr-v3.js. Characters with build:"v5" use it automatically; their mood keys [t, name, dur, ease] blend every dial.
   Long durations (2-4 s, ease "inOut") give slow emotional drifts; short ones (0.2-0.4 s, "back") give reactions.
   Dials (L/R where a face can be asymmetric): eye open eoL/eoR (0 shut, 1 normal, 1.35 wide), lid drop ldL/ldR, lid angle la (+ angry, - sad),
   lower lid lb (squint / cheeks pushing up), closed-eye curve arcL/arcR (+1 happy n, -0.5 relaxed u), pupil size pup, gaze gx/gy,
   brows brL/brR raise + baL/baR angle, mouth: sm smile, asym smirk, mo open, rnd round, teeth top, tb bottom teeth, tg tongue, wob wobble,
   pk pucker, ch cheeks, bl blush, sw sweat, tr tears, sq head squash (+ wide, - tall). */
(function () {
  const SR = window.SR, { el, clamp, lerp } = SR, INK = "#1E1B22";
  const D0 = { eoL: 1, eoR: 1, ldL: 0, ldR: 0, la: 0, lb: 0, arcL: 0.8, arcR: 0.8, pup: 1, gx: 0, gy: 0, brL: 0, brR: 0, baL: 0, baR: 0,
    sm: 0.15, asym: 0, mo: 0, rnd: 0, teeth: 0, tb: 0, tg: 0, wob: 0, pk: 0, ch: 0, bl: 0, sw: 0, tr: 0, sq: 0 };
  const sym = (o) => { const r = Object.assign({}, o); if (o.eo != null) { r.eoL = r.eoR = o.eo; } if (o.ld != null) { r.ldL = r.ldR = o.ld; } if (o.arc != null) { r.arcL = r.arcR = o.arc; }
    if (o.br != null) { r.brL = r.brR = o.br; } if (o.ba != null) { r.baL = o.ba; r.baR = -o.ba; } ["eo", "ld", "arc", "br", "ba"].forEach((k) => delete r[k]); return Object.assign({}, D0, r); };
  // ba > 0: inner ends down (angry); ba < 0: inner ends up (sad / worried)
  const F = {
    neutral: {}, content: { sm: 0.45, ld: 0.1, ch: 0.25 }, happy: { sm: 0.8, mo: 0.28, teeth: 0.7, ch: 0.6, lb: 0.2, br: 3 },
    joy: { eo: 0, arc: 1, sm: 1, mo: 0.75, teeth: 1, tg: 0.6, ch: 1, br: 5, ba: -6, sq: 0.05 },
    laugh: { eo: 0, arc: 1, sm: 1, mo: 1, teeth: 1, tg: 0.9, ch: 1, br: 6, ba: -8, sq: 0.07 },
    grin: { sm: 1, mo: 0.42, teeth: 1, tb: 1, ch: 1, lb: 0.25, br: 4, ba: -4 },
    sad: { ld: 0.3, la: -1, sm: -0.6, gy: 0.4, br: 5, ba: -16 }, worried: { ld: 0.12, la: -0.8, sm: -0.3, wob: 0.9, br: 6, ba: -18, sw: 0.7 },
    tired: { ld: 0.58, sm: -0.2, br: -2, gy: 0.3 }, annoyed: { ld: 0.4, la: 0.6, sm: -0.35, asym: 0.2, br: -3, ba: 12 },
    angry: { ld: 0.38, la: 1, lb: 0.3, sm: -0.7, mo: 0.35, teeth: 1, tb: 1, br: -5, ba: 24, sq: 0.03 },
    shock: { eo: 1.35, pup: 0.62, mo: 1, rnd: 1, sm: -0.2, br: 11, ba: -6, sq: -0.1 }, surprised: { eo: 1.2, pup: 0.8, mo: 0.5, rnd: 0.85, br: 9, ba: -4 },
    closed: { eo: 0, arc: -0.4 }, smug: { ld: 0.45, sm: 0.7, asym: 0.9, ch: 0.5, brL: 1, brR: 8, baL: 6, baR: -12 },
    skeptic: { ldL: 0.48, sm: 0, asym: -0.35, brL: -3, brR: 10, baL: 14, baR: -8 },
    cheeky: { eoL: 0, arcL: 0.8, sm: 0.9, mo: 0.3, teeth: 0.8, tg: 0.8, ch: 1, brL: -2, brR: 7, baL: 10, baR: -6 },
    kiss: { eo: 0, arc: -0.45, pk: 1, sm: 0, bl: 1, br: 4, ba: -6 }, wail: { eo: 0, arc: -0.6, mo: 0.9, sm: -0.9, tg: 0.5, tr: 1, br: 5, ba: -20, sq: -0.06 },
    forced: { eo: 1.3, pup: 0.7, sm: 1, mo: 0.4, teeth: 1, tb: 1, sw: 1, br: 6, ba: -16, ch: 0.3 }, bliss: { eo: 0, arc: -0.5, sm: 0.9, mo: 0.35, tg: 0.6, ch: 1, bl: 1, br: 3, ba: -6 },
    hopeful: { eo: 1.12, sm: 0.5, br: 6, ba: -10, ch: 0.3, gy: -0.3 }, embarrassed: { ld: 0.2, gy: 0.5, gx: 0.5, sm: 0.25, wob: 0.35, bl: 1, sw: 0.7, br: 4, ba: -10 },
    determined: { ld: 0.3, la: 0.8, sm: -0.1, br: -3, ba: 16 }, starstruck: { eo: 1.25, sm: 1, mo: 0.7, teeth: 0.8, ch: 1, br: 8 },
    inlove: { eo: 0, arc: -0.5, sm: 0.9, bl: 1, ch: 0.6, br: 4, ba: -8 }, disgusted: { ld: 0.45, lb: 0.4, sm: -0.7, asym: -0.5, brL: -4, brR: 2, baL: 12, baR: -8 },
    deadpan: { ld: 0.45, sm: 0 }, proud: { ld: 0.32, sm: 0.85, ch: 0.6, br: 2, gy: -0.2 }, confused: { ldL: 0.3, sm: -0.2, asym: -0.4, wob: 0.3, brL: -2, brR: 10, baL: 6, baR: -10 },
    terrified: { eo: 1.35, pup: 0.55, mo: 0.75, sm: -0.6, teeth: 1, tb: 1, br: 11, ba: -14, sw: 1, sq: -0.06 }, crying: { ld: 0.3, la: -1, sm: -0.9, mo: 0.3, wob: 0.6, tr: 1, br: 6, ba: -20 },
    laughing: { eo: 0, arc: 1, sm: 1, mo: 1, teeth: 1, tg: 0.9, ch: 1, br: 6, ba: -8, sq: 0.07, tr: 0.12 }, exhausted: { ld: 0.65, sm: -0.35, mo: 0.15, br: -2, gy: 0.4 },
    furious: { ld: 0.42, la: 1, lb: 0.35, sm: -1, mo: 0.6, teeth: 1, tb: 1, br: -6, ba: 28, sq: 0.04 }, embarrassedSmile: { ld: 0.15, gy: 0.4, sm: 0.6, bl: 1, ch: 0.4 },
    relieved: { ld: 0.35, la: -0.4, sm: 0.6, ch: 0.5, br: 4, ba: -10, gy: -0.1 }, nervous: { eo: 1.1, sm: 0.35, wob: 0.6, sw: 0.8, br: 5, ba: -14, ch: 0.2 },
    touched: { ld: 0.2, la: -0.6, sm: 0.55, wob: 0.2, tr: 0.45, br: 6, ba: -16, bl: 0.6 }, sleepy: { eo: 0, arc: -0.3, sm: 0.1 }, dizzy: { eo: 1.1, pup: 0.5, sm: -0.2, mo: 0.35, wob: 0.6 },
  };
  const F5 = {}; for (const k in F) F5[k] = sym(F[k]);
  SR.F5 = F5; SR.F5of = (n) => F5[n] || F5.neutral;
  SR.Face5 = function (headG, before, o) {
    const LINE = o.ink ? "#F4EEE2" : INK, SKIN = o.ink ? INK : o.skin, id = o.id, G = el("g", { transform: "translate(7,0)" }); headG.insertBefore(G, before);
    const BG = el("g", { transform: "translate(7,0)" }, headG);   // brows sit ON TOP of the hair (cartoon convention), so they always read
    const P = (attrs) => el("path", Object.assign({ fill: "none", stroke: LINE, "stroke-width": 3.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, attrs), G);
    const cheekP = [-1, 1].map(() => el("ellipse", { rx: 7, ry: 4, fill: "#FF8FA3", opacity: 0 }, G)), cheekL = [-1, 1].map(() => P({ "stroke-width": 2.6, opacity: 0 }));
    const eyes = [0, 1].map((i) => { const g = el("g", {}, G), cp = el("clipPath", { id: `${id}-f5e${i}` }, g), ce = el("ellipse", {}, cp);
      const white = el("ellipse", { fill: "#FFFFFF" }, g), inner = el("g", { "clip-path": `url(#${id}-f5e${i})` }, g);
      const pupil = el("circle", { fill: INK }, inner), glint = el("circle", { fill: "#FFFFFF" }, inner);
      const lidT = el("path", { fill: SKIN, stroke: LINE, "stroke-width": 3 }, inner), lidB = el("path", { fill: SKIN, stroke: LINE, "stroke-width": 2.4 }, inner);
      const ring = el("ellipse", { fill: "none", stroke: LINE, "stroke-width": 3 }, g), shut = P({ "stroke-width": 4.2 });
      const halo = el("path", { d: "M-9,2 Q0,-4 9,1 Q0,-1 -9,4 Z", fill: SKIN, stroke: SKIN, "stroke-width": 7, "stroke-linejoin": "round" }, BG);   // skin halo: brows read even over dark hair
      const brow = el("path", { d: "M-9,2 Q0,-4 9,1 Q0,-1 -9,4 Z", fill: LINE, stroke: LINE, "stroke-width": 2.4, "stroke-linejoin": "round" }, BG);
      return { g, ce, halo, white, pupil, glint, lidT, lidB, ring, shut, brow }; });
    P({ d: "M3,2 q5,4 0,7 q-2,1 -4,0", "stroke-width": 3 });   // nose
    const mcp = el("clipPath", { id: `${id}-f5m` }, G), mclip = el("path", {}, mcp);
    const mouth = el("path", { fill: "#5A1F2A" }, G), mIn = el("g", { "clip-path": `url(#${id}-f5m)` }, G);
    const tongue = el("ellipse", { fill: "#FF7A8A" }, mIn), teethT = el("rect", { fill: "#FFFFFF" }, mIn), teethB = el("rect", { fill: "#FFFFFF" }, mIn), gap = el("path", { fill: "none", stroke: LINE, "stroke-width": 1.8, opacity: 0 }, mIn);
    const mLine = P({ "stroke-width": 3.6 }), wobP = P({ "stroke-width": 3.6, opacity: 0 }), pucker = el("path", { d: "M-2,14 q-7,3 -1,6 q-7,3 1,7 q6,1 5,-6 q2,-6 -5,-7 Z", fill: "#E2577A", stroke: LINE, "stroke-width": 3, opacity: 0 }, G);
    const sweat = el("path", { d: "M30,-26 q6,10 0,15 q-6,-5 0,-15 Z", fill: "#7EC8FF", stroke: LINE, "stroke-width": 2.6, opacity: 0 }, G);
    const tears = [-1, 1].map(() => el("path", { fill: "none", stroke: "#7EC8FF", "stroke-width": 6, "stroke-linecap": "round", opacity: 0 }, G));
    const f = (v) => (+v).toFixed(2);
    function update(t, D, VM, blink, look) {
      const lx = clamp((look ? look.x : 0) + D.gx, -1, 1), ly = clamp((look ? look.y : 0) + D.gy, -1, 1);
      // cheeks, blush
      cheekP.forEach((c, i) => { const s = i ? 1 : -1; c.setAttribute("cx", s * 18); c.setAttribute("cy", 9 - D.ch * 2); c.setAttribute("opacity", clamp(Math.max(D.ch * 0.45, D.bl * 0.75), 0, 0.8)); });
      cheekL.forEach((c, i) => { const s = i ? 1 : -1; c.setAttribute("d", `M${s * 24},${f(5 - D.ch * 2)} q${s * 4},4 ${s * 2},9`); c.setAttribute("opacity", clamp((D.ch - 0.3) * 1.6, 0, 1)); });
      eyes.forEach((E, i) => { const s = i ? 1 : -1, eo = Math.max(0, (i ? D.eoR : D.eoL) * blink), ld = i ? D.ldR : D.ldL, arc = i ? D.arcR : D.arcL;
        const x = s * 14, y = -6, rx = 8 + Math.max(0, eo - 1) * 7, ry = Math.max(0.6, 10 * Math.min(eo, 1) + Math.max(0, eo - 1) * 9);
        E.g.setAttribute("transform", `translate(${x},${y})`); const vis = eo > 0.16 ? 1 : 0;
        [E.white, E.ring, E.ce].forEach((n) => { n.setAttribute("rx", f(rx)); n.setAttribute("ry", f(ry)); }); E.g.setAttribute("opacity", vis);
        const pr = 4.6 * D.pup * (1 - 0.25 * Math.max(0, eo - 1)), px = 1 + lx * 3, py = 1 + ly * 3.5;
        E.pupil.setAttribute("r", f(pr)); E.pupil.setAttribute("cx", f(px)); E.pupil.setAttribute("cy", f(py)); E.glint.setAttribute("r", f(pr * 0.38)); E.glint.setAttribute("cx", f(px + 1.6)); E.glint.setAttribute("cy", f(py - 2.2));
        // upper lid: drop + angle (la>0 angry: inner end low; la<0 sad: outer end low)
        const top = -ry - 2, edge = -ry + ld * ry * 2 * 0.95, tilt = Math.abs(D.la) * 8, inX = -s * 10, outX = s * 10;
        const yIn = edge + (D.la > 0 ? tilt : 0), yOut = edge + (D.la < 0 ? tilt : 0), drop = ld > 0.02 || Math.abs(D.la) > 0.05;
        E.lidT.setAttribute("d", drop ? `M${inX},${top} L${outX},${top} L${outX},${f(yOut)} L${inX},${f(yIn)} Z` : "M0,0"); E.lidT.setAttribute("opacity", drop ? 1 : 0);
        const lb = D.lb, by = ry - lb * ry * 0.9;
        E.lidB.setAttribute("d", lb > 0.02 ? `M-12,${ry + 3} L12,${ry + 3} L12,${f(by + 2)} Q0,${f(by - 3)} -12,${f(by + 2)} Z` : "M0,0"); E.lidB.setAttribute("opacity", lb > 0.02 ? 1 : 0);
        E.shut.setAttribute("d", `M${x - 8},${f(y + 2 * arc)} Q${x},${f(y - 9 * arc)} ${x + 8},${f(y + 2 * arc)}`); E.shut.setAttribute("opacity", 1 - vis);
        const br = i ? D.brR : D.brL, ba = i ? D.baR : D.baL, byy = -20 - br - Math.max(0, eo - 1) * 8;
        E.brow.setAttribute("transform", `translate(${x},${f(byy)}) rotate(${f(ba)})`); E.halo.setAttribute("transform", E.brow.getAttribute("transform")); });
      // mouth: corners lift with smile, smirk lifts one side; opening grows a D shape (laugh) or an O (round)
      let mo = D.mo, rnd = D.rnd, tt = D.teeth, tb = D.tb, tg = D.tg, sm = D.sm, wob = D.wob, pk = D.pk;
      if (VM) { const op = (VM.top + VM.bot) / 14; mo = Math.max(mo * 0.35, op); rnd = Math.max(rnd * 0.5, VM.round); tt = Math.max(tt * 0.5, VM.tt * clamp(op * 2, 0, 1)); tb = Math.max(tb * 0.3, VM.tb * clamp(op * 2, 0, 1)); tg = Math.max(tg * 0.5, VM.tg * 0.8); sm *= 0.7; wob *= 0.25; pk *= 0.2; }
      const cy = 16, w = Math.max(4, 12 + Math.max(0, sm) * 4 + mo * 3 - rnd * 7 - pk * 6), lift = sm * 5, as = D.asym * 6;
      const Lx = -w, Rx = w, Ly = cy - lift + as * 0.2, Ry = cy - lift - as, mid = cy + sm * 3.2 * (1 - rnd);
      const topY = mid - mo * (3.5 + rnd * 5) - Math.max(0, sm) * mo * 2, botY = mid + mo * (10 + Math.max(0, sm) * 9 + rnd * 4);
      const k = lerp(0.5, 1.05, rnd), d = `M${f(Lx)},${f(Ly)} C${f(Lx * k * 0.6)},${f(topY)} ${f(Rx * k * 0.6)},${f(topY)} ${f(Rx)},${f(Ry)} C${f(Rx * k)},${f(botY)} ${f(Lx * k)},${f(botY)} ${f(Lx)},${f(Ly)} Z`;
      const open = mo > 0.06; mouth.setAttribute("d", d); mclip.setAttribute("d", d); mouth.setAttribute("opacity", open ? 1 : 0); mIn.setAttribute("opacity", open ? 1 : 0);
      const lineOp = clamp(1 - wob * 1.6, 0, 1) * (1 - clamp(pk * 2 - 0.6, 0, 1));
      mLine.setAttribute("d", open ? d : `M${f(Lx)},${f(Ly)} Q0,${f(mid + sm * 2.5)} ${f(Rx)},${f(Ry)}`); mLine.setAttribute("opacity", open ? 1 : lineOp);
      teethT.setAttribute("x", Lx); teethT.setAttribute("width", 2 * w); teethT.setAttribute("y", topY - 4); teethT.setAttribute("height", f(Math.max(0, tt * (4 + mo * 3.5))));
      teethB.setAttribute("x", Lx); teethB.setAttribute("width", 2 * w); teethB.setAttribute("y", f(botY - tb * (3 + mo * 3))); teethB.setAttribute("height", f(tb * 8));
      gap.setAttribute("d", tt > 0.5 && tb > 0.5 ? `M${-w * 0.45},${topY} L${-w * 0.45},${botY} M0,${topY} L0,${botY} M${w * 0.45},${topY} L${w * 0.45},${botY}` : ""); gap.setAttribute("opacity", tt > 0.5 && tb > 0.5 ? 1 : 0);
      tongue.setAttribute("cx", 0); tongue.setAttribute("cy", f(botY - 2)); tongue.setAttribute("rx", f(w * 0.55)); tongue.setAttribute("ry", f(3 + 4 * tg * mo)); tongue.setAttribute("opacity", clamp(tg * 1.5, 0, 1));
      wobP.setAttribute("d", `M-12,${f(cy + 5 - sm * 2)} q4,-5 8,0 q4,5 8,0 q4,-5 8,0`); wobP.setAttribute("opacity", open ? 0 : clamp(wob * 1.6 - 0.2, 0, 1));
      pucker.setAttribute("opacity", clamp(pk * 2 - 0.6, 0, 1));
      sweat.setAttribute("opacity", clamp(D.sw, 0, 1)); sweat.setAttribute("transform", `translate(0,${f(((t * 0.6) % 1) * 10 * D.sw)})`);
      tears.forEach((p, i) => { const s = i ? 1 : -1, L = D.tr; p.setAttribute("d", `M${s * 14 - 3},${-2} Q${s * 20},${f(-2 + 20 * L)} ${s * 22},${f(-2 + 42 * L)}`); p.setAttribute("opacity", clamp(D.tr * 1.8, 0, 0.92)); });
      return D.sq;
    }
    return { g: G, update };
  };
})();
