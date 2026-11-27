/* Social Ripple original cast — rigged 2D characters (our own designs).
   const C = CAST(I);  const kai = C.make(parent, "kai", x, feetY, scale, appearAt);
   kai.key(t, pose, dur)      blend to a named pose (or a partial pose object) starting at t over dur
   kai.move(t, x, dur)        walk/slide the root to x (legs cycle while moving)
   kai.face(t, expr)          expression: neutral | smile | grin | talk | sad | strain | wow | determined | tired
   kai.say(lineId)            mouth moves with the narration words of that line (uses window.WORDS / window.DT)
   kai.update(t)
   Poses: stand, wave, fist, point, think, slump, pushUp, pushDown, flat, pockets, cheer, look */
(function () {
  window.CAST = function (I) {
    const el = I.el, INK = I.INKC, NS = "http://www.w3.org/2000/svg";
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const D = {
      nia: { skin: "#A8714E", hair: "#2B1D16", hairStyle: "puff", top: "#E0A030", top2: "#FFF6E6", pants: "#5B3A2A", shoe: "#3A2A22", eye: "#4A2E1E", glasses: true, notebook: true, lash: true },
      kai: { skin: "#F2C9A0", hair: "#5A3520", hairStyle: "swoop", top: "#2F8F8A", top2: "#25706C", pants: "#2D3142", shoe: "#F4F4F0", eye: "#C07A2A", brows: "thick", torn: true, wristband: true, hood: true },
      mo: { skin: "#E8C7A8", hair: "#1E2235", hairStyle: "shag", top: "#6E7280", top2: "#5C606C", pants: "#3B3E48", shoe: "#2A2A30", eye: "#6F8FAF", scarf: "#A68FD6", phones: true, tired: true, coat: true },
      rue: { skin: "#F6D2B4", hair: "#C8442E", hairStyle: "bob", top: "#F2C230", top2: "#E0A81E", pants: "#3D6FB0", shoe: "#C8442E", eye: "#3E8E5A", freckles: true, straps: true, bandage: true, clips: true },
    };
    const POSES = {
      stand: { root: 0, lift: 0, side: 0, torso: 0, head: 0, aL: 10, eL: -6, aR: -10, eR: 6, lL: 4, kL: 0, lR: -4, kR: 0 },
      wave: { aR: -150, eR: 25 }, fist: { aR: -168, eR: 12, head: -4 }, cheer: { aL: 160, eL: 20, aR: -160, eR: -20 },
      point: { aR: -95, eR: 0, head: -6 }, think: { aR: -150, eR: -150, head: 8 }, look: { head: -12, torso: -3 },
      slump: { torso: 6, head: 22, aL: 4, eL: 0, aR: -4, eR: 0, lift: 6 },
      pockets: { aL: 18, eL: -40, aR: -18, eR: 40, head: 4 },
      pushUp: { root: 62, lift: -40, side: 0, torso: 0, head: -58, aL: -80, eL: 0, aR: -80, eR: 0, lL: 0, kL: 0, lR: 0, kR: 0, plant: 1 },
      pushDown: { root: 77, lift: -18, side: 0, torso: 0, head: -73, aL: -80, eL: 0, aR: -80, eR: 0, lL: 0, kL: 0, lR: 0, kR: 0, plant: 1 },
      flat: { root: 90, lift: 0, side: -46, torso: 0, head: -60, aL: -170, eL: 0, aR: -170, eR: 0, lL: 0, kL: 0, lR: 0, kR: 0, plant: 0 },
    };
    const JOINTS = ["root", "lift", "side", "torso", "head", "aL", "eL", "aR", "eR", "lL", "kL", "lR", "kR", "plant"];
    function make(parent, name, x, y, s, at) {
      const c = D[name], G = (p, a = {}) => el("g", a, p);
      const root = G(parent, { opacity: 0 }), body = G(root);
      const limb = (p, px, py, L, w, col, end) => { const g = G(p); const seg = G(g); el("path", { d: `M0,0 L0,${L}`, stroke: INK, "stroke-width": w + 8, "stroke-linecap": "round" }, seg);
        el("path", { d: `M0,0 L0,${L}`, stroke: col, "stroke-width": w, "stroke-linecap": "round" }, seg); const j = G(g); return { g, j, px, py, L }; };
      // ---- legs (hip at 0,0; feet at y=+170)
      const legs = [-1, 1].map((d) => { const th = limb(body, d * 24, 0, 80, 30, c.pants); const sh = limb(th.j, 0, 80, 78, 26, c.pants);
        const shoe = el("ellipse", { cx: d * 6, cy: 86, rx: 28, ry: 15, fill: c.shoe, stroke: INK, "stroke-width": 5 }, sh.j); return { th, sh, d, shoe }; });
      // ---- torso group (pivot at hip)
      const torso = G(body);
      if (c.hood) el("path", { d: "M-46,-150 Q0,-120 46,-150 Q30,-110 0,-108 Q-30,-110 -46,-150 Z", fill: c.top2, stroke: INK, "stroke-width": 5 }, torso);
      const tFront = c.coat ? el("path", { d: "M-60,-130 Q-64,-146 -42,-148 L42,-148 Q64,-146 60,-130 L74,40 L-74,40 Z", fill: c.top, stroke: INK, "stroke-width": 6 }, torso)
        : el("path", { d: "M-58,-128 Q-60,-146 -40,-148 L40,-148 Q60,-146 58,-128 L52,8 L-52,8 Z", fill: c.top, stroke: INK, "stroke-width": 6 }, torso);
      const tSide = el("path", { d: c.coat ? "M-36,-130 Q-38,-148 -18,-150 L22,-150 Q42,-146 40,-128 L52,40 L-46,40 Z" : "M-34,-128 Q-36,-148 -16,-150 L22,-150 Q42,-146 40,-126 L36,8 L-34,8 Z", fill: c.top, stroke: INK, "stroke-width": 6, style: "display:none" }, torso);
      const n0 = torso.childNodes.length;
      if (name === "kai") { el("path", { d: "M-34,-30 h68 l-6,30 h-56 z", fill: c.top2, stroke: INK, "stroke-width": 4 }, torso); el("path", { d: "M-12,-138 v40 M12,-138 v34", stroke: "#F4F4F0", "stroke-width": 4, "stroke-linecap": "round" }, torso); }
      if (name === "nia") { el("path", { d: "M-22,-146 L0,-96 L22,-146 Z", fill: c.top2, stroke: INK, "stroke-width": 4 }, torso); el("path", { d: "M0,-96 V6", stroke: "#B07A20", "stroke-width": 4 }, torso); [-70, -40, -10].forEach((yy) => el("circle", { cx: 8, cy: yy, r: 4, fill: "#7A4A10" }, torso)); }
      if (name === "mo") { el("path", { d: "M0,-140 V38", stroke: "#4A4D58", "stroke-width": 4 }, torso); el("path", { d: "M-52,-20 h30 M22,-20 h30", stroke: "#4A4D58", "stroke-width": 5 }, torso); }
      if (name === "rue") { el("path", { d: "M-40,-146 L-30,6 M40,-146 L30,6", stroke: "#3A2A3A", "stroke-width": 10, "stroke-linecap": "round" }, torso); el("path", { d: "M-58,-70 H58", stroke: "#FFF6E6", "stroke-width": 6 }, torso); }
      const det = el("g", {}); Array.from(torso.childNodes).slice(n0).forEach((nd) => det.appendChild(nd)); torso.appendChild(det);
      // ---- arms (shoulders at ±50,-128)
      const sleeve = c.top;
      const arms = [-1, 1].map((d) => { const ua = limb(torso, d * 50, -128, 72, 26, sleeve); const fa = limb(ua.j, 0, 72, 68, 24, (c.torn && d > 0) ? c.skin : sleeve);
        if (c.torn && d > 0) el("path", { d: "M-14,4 l6,8 l6,-6 l6,8 l6,-6", fill: "none", stroke: INK, "stroke-width": 4 }, fa.g);
        const hand = el("circle", { cx: 0, cy: 74, r: 16, fill: c.skin, stroke: INK, "stroke-width": 5 }, fa.j);
        if (c.wristband && d < 0) { el("rect", { x: -15, y: 52, width: 30, height: 14, rx: 3, fill: "#D8322A", stroke: INK, "stroke-width": 3 }, fa.j); el("path", { d: "M-8,55 v8 M-3,55 v8 M2,55 v8", stroke: "#FFF", "stroke-width": 2 }, fa.j); }
        if (c.bandage && d > 0) el("rect", { x: -10, y: 66, width: 20, height: 8, rx: 2, fill: "#FFF6E6", stroke: INK, "stroke-width": 2.5 }, fa.j);
        if (c.notebook && d < 0) el("rect", { x: -26, y: 60, width: 44, height: 56, rx: 4, fill: "#D8322A", stroke: INK, "stroke-width": 4, transform: "rotate(-12 0 80)" }, fa.j);
        return { ua, fa, d }; });
      // ---- head group (pivot at neck 0,-140)
      const headG = G(torso), r = 82, U = (u, v) => `${(u * r).toFixed(1)},${(-228 + v * r).toFixed(1)}`;
      el("path", { d: "M-14,-150 h28 v20 h-28 z", fill: c.skin, stroke: INK, "stroke-width": 4 }, headG);
      const P = (d, fill, sw = 5, p = headG) => el("path", { d, fill, stroke: INK, "stroke-width": sw, "stroke-linejoin": "round", "stroke-linecap": "round" }, p);
      const ring = (a0, a1, n, rin, rout, jit) => { const pts = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180, rr = i % 2 ? rout + (((i * 37) % 7) - 3) / 3 * jit : rin; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return pts; };
      const poly = (pts) => "M" + pts.map((q) => U(q[0], q[1])).join(" L") + " Z";
      // back hair
      if (c.hairStyle === "puff") { [[-0.7, -0.55, 0.42], [0, -0.85, 0.5], [0.7, -0.55, 0.42], [-0.95, 0.0, 0.34], [0.95, 0.0, 0.34], [0, -1.45, 0.48]].forEach(([u, v, rr]) => el("circle", { cx: u * r, cy: -228 + v * r, r: rr * r, fill: c.hair, stroke: INK, "stroke-width": 5 }, headG)); }
      if (c.hairStyle === "swoop") P(poly(ring(160, 380, 16, 0.98, 1.2, 0.05).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5);
      if (c.hairStyle === "shag") P(poly(ring(150, 390, 22, 1.0, 1.16, 0.04).concat([[1.0, 0.5], [0.85, 0.3], [-0.85, 0.3], [-1.0, 0.5]])), c.hair, 5);
      if (c.hairStyle === "bob") P(poly([[-1.08, 0.55], [-1.1, -0.3], [-0.7, -1.02], [0, -1.12], [0.7, -1.02], [1.1, -0.3], [1.08, 0.55], [0.7, 0.62], [-0.7, 0.62]]), c.hair, 5);
      if (c.scarf) { el("path", { d: "M-70,-150 Q0,-110 70,-150 Q78,-128 60,-118 Q0,-96 -60,-118 Q-78,-128 -70,-150 Z", fill: c.scarf, stroke: INK, "stroke-width": 5 }, torso); }
      // ears + face
      P(`M${U(-0.86, -0.02)} q${-0.22 * r},${0.02 * r} ${-0.16 * r},${0.26 * r} q${0.06 * r},${0.14 * r} ${0.2 * r},${0.06 * r} z`, c.skin, 4);
      const earR = P(`M${U(0.86, -0.02)} q${0.22 * r},${0.02 * r} ${0.16 * r},${0.26 * r} q${-0.06 * r},${0.14 * r} ${-0.2 * r},${0.06 * r} z`, c.skin, 4);
      P(`M${U(-0.9, -0.15)} C${U(-0.95, -1.08)} ${U(0.95, -1.08)} ${U(0.9, -0.15)} C${U(0.88, 0.42)} ${U(0.5, 0.8)} ${U(0, 0.96)} C${U(-0.5, 0.8)} ${U(-0.88, 0.42)} ${U(-0.9, -0.15)} Z`, c.skin, 6);
      if (c.phones) { el("path", { d: "M-58,-150 Q0,-196 58,-150", fill: "none", stroke: "#1E1E24", "stroke-width": 9 }, torso); [-1, 1].forEach((dd) => el("ellipse", { cx: dd * 58, cy: -146, rx: 20, ry: 15, fill: "#2A2A33", stroke: INK, "stroke-width": 4 }, torso)); }
      const f0 = headG.childNodes.length;
      if (c.freckles) [-1, 1].forEach((dd) => [[0.5, 0.42], [0.6, 0.5], [0.42, 0.52]].forEach(([u, v]) => el("circle", { cx: dd * u * r, cy: -228 + v * r, r: 2.6, fill: "#B0603A" }, headG)));
      el("ellipse", { cx: -0.55 * r, cy: -228 + 0.48 * r, rx: 13, ry: 7, fill: "#F08A80", opacity: 0.35 }, headG); el("ellipse", { cx: 0.55 * r, cy: -228 + 0.48 * r, rx: 13, ry: 7, fill: "#F08A80", opacity: 0.35 }, headG);
      // eyes: open set + closed-happy set + tired lids
      const eyesOpen = G(headG), eyesHappy = G(headG, { style: "display:none" }), lids = G(headG, { style: "display:none" });
      for (const d of [-1, 1]) { const ex = d * 0.38, ey = 0.14;
        P(`M${U(ex, ey - 0.25)} C${U(ex + 0.21, ey - 0.25)} ${U(ex + 0.21, ey + 0.23)} ${U(ex, ey + 0.23)} C${U(ex - 0.21, ey + 0.23)} ${U(ex - 0.21, ey - 0.25)} ${U(ex, ey - 0.25)} Z`, "#FFFFFF", 3, eyesOpen);
        el("ellipse", { cx: ex * r, cy: -228 + (ey + 0.03) * r, rx: 0.13 * r, ry: 0.17 * r, fill: c.eye }, eyesOpen); el("ellipse", { cx: ex * r, cy: -228 + (ey + 0.05) * r, rx: 0.065 * r, ry: 0.09 * r, fill: "#0E0E12" }, eyesOpen);
        el("circle", { cx: (ex - 0.05) * r, cy: -228 + (ey - 0.05) * r, r: 0.045 * r, fill: "#FFFFFF" }, eyesOpen);
        P(`M${U(ex - 0.23, ey - 0.12)} Q${U(ex, ey - 0.33)} ${U(ex + 0.24, ey - 0.12)}`, "none", c.lash ? 8 : 6, eyesOpen);
        if (c.lash) P(`M${U(ex + d * 0.22, ey - 0.16)} l${d * 10},-8`, "none", 5, eyesOpen);
        P(`M${U(ex - 0.2, ey + 0.02)} Q${U(ex, ey - 0.2)} ${U(ex + 0.2, ey + 0.02)}`, "none", 6, eyesHappy);
        P(`M${U(ex - 0.22, ey - 0.03)} L${U(ex + 0.22, ey - 0.03)} L${U(ex + 0.2, ey - 0.25)} L${U(ex - 0.2, ey - 0.25)} Z`, c.skin, 0, lids); P(`M${U(ex - 0.23, ey - 0.03)} L${U(ex + 0.23, ey - 0.03)}`, "none", 6, lids); }
      const browG = G(headG); const brows = [-1, 1].map((d) => P(`M${U(d * 0.2, -0.3)} L${U(d * 0.56, -0.36)}`, "none", c.brows === "thick" ? 9 : 6, browG));
      el("path", { d: `M${U(0.02, 0.4)} l-3,5`, stroke: "#A06A4A", "stroke-width": 4, "stroke-linecap": "round" }, headG);
      // mouths
      const MO = { neutral: [`M${U(-0.12, 0.66)} L${U(0.12, 0.66)}`, "none"], smile: [`M${U(-0.22, 0.6)} Q${U(0, 0.78)} ${U(0.22, 0.6)}`, "none"], sad: [`M${U(-0.16, 0.72)} Q${U(0, 0.6)} ${U(0.16, 0.72)}`, "none"],
        determined: [`M${U(-0.14, 0.68)} L${U(0.14, 0.64)}`, "none"], strain: [`M${U(-0.26, 0.6)} h${0.52 * r} v${0.12 * r} h${-0.52 * r} z`, "#FFFFFF"], wow: [`M${U(0, 0.56)} a${0.1 * r},${0.13 * r} 0 1,0 0.1,0 z`, "#7A2A2A"],
        grin: [`M${U(-0.32, 0.55)} Q${U(0, 0.62)} ${U(0.32, 0.55)} Q${U(0, 0.98)} ${U(-0.32, 0.55)} Z`, "#7A2A2A"] };
      const mouths = {}; for (const m in MO) mouths[m] = el("path", { d: MO[m][0], fill: MO[m][1], stroke: INK, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round", style: "display:none" }, headG);
      const talk = el("path", { d: "", fill: "#7A2A2A", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round", style: "display:none" }, headG);
      const faceG = el("g", {}); Array.from(headG.childNodes).slice(f0).forEach((nd) => faceG.appendChild(nd)); headG.appendChild(faceG);
      // front hair
      if (c.hairStyle === "swoop") P(poly([[-0.96, -0.36], [-0.86, -0.08], [-0.62, -0.34], [-0.4, -0.16], [-0.2, -0.38], [0.1, -0.2], [0.45, -0.42], [0.75, -0.26], [0.98, -0.02], [0.96, -0.42], [0.7, -0.92], [-0.7, -0.9]]), c.hair, 5);
      if (c.hairStyle === "shag") P(poly([[-1.0, -0.36], [-0.96, 0.2], [-0.8, -0.1], [-0.6, 0.0], [-0.44, -0.28], [-0.2, -0.02], [0.0, -0.3], [0.2, 0.12], [0.34, -0.1], [0.5, 0.28], [0.62, 0.0], [0.82, 0.34], [1.0, -0.36], [0.7, -0.92], [-0.7, -0.92]]), c.hair, 5);
      if (c.hairStyle === "bob") P(poly([[-1.04, -0.3], [-0.9, -0.16], [-0.5, -0.34], [-0.1, -0.22], [0.3, -0.36], [0.7, -0.2], [1.04, -0.3], [0.7, -0.95], [-0.7, -0.95]]), c.hair, 5);
      if (c.hairStyle === "puff") P(poly([[-0.92, -0.3], [-0.7, -0.44], [-0.4, -0.36], [-0.1, -0.5], [0.2, -0.38], [0.5, -0.48], [0.8, -0.34], [0.92, -0.3], [0.7, -0.9], [-0.7, -0.9]]), c.hair, 5);
      if (c.clips) [[-0.62, -0.42], [-0.44, -0.5]].forEach(([u, v]) => el("rect", { x: u * r - 14, y: -228 + v * r - 4, width: 28, height: 8, rx: 3, fill: "#F2C230", stroke: INK, "stroke-width": 3, transform: `rotate(-20 ${u * r} ${-228 + v * r})` }, headG));
      const glassG = G(headG);
      if (c.glasses) { [-1, 1].forEach((d) => el("circle", { cx: d * 0.38 * r, cy: -228 + 0.14 * r, r: 0.27 * r, fill: "#FFFFFF", "fill-opacity": 0.12, stroke: "#3A2A22", "stroke-width": 6 }, glassG)); el("path", { d: `M${U(-0.11, 0.1)} Q${U(0, 0.04)} ${U(0.11, 0.1)}`, fill: "none", stroke: "#3A2A22", "stroke-width": 6 }, glassG); }
      // ---------- animation state ----------
      const keys = [{ t: -1, p: Object.assign({}, POSES.stand), dur: 0 }], moves = [{ t: -1, x, dur: 0 }], faces = [[-1, "neutral"]], talks = [], views = [[-1, "front", 1]]; let curView = "";
      const h = { root, name, at, x, y, s,
        key(t, pose, dur = 0.35) { keys.push({ t, p: typeof pose === "string" ? POSES[pose] : pose, dur }); return h; },
        move(t, nx, dur = 1) { moves.push({ t, x: nx, dur }); return h; },
        face(t, e) { faces.push([t, e]); return h; },
        view(t, v, dir = 1) { views.push([t, v, dir]); return h; },
        say(id) { const st = window.DT[id][0]; window.WORDS[id].forEach((w) => talks.push([st + w.start, st + w.end])); return h; } };
      const poseAt = (t) => { let cur = Object.assign({}, POSES.stand); for (const k of keys) { if (t < k.t) break; const u = k.dur ? ease(clamp((t - k.t) / k.dur, 0, 1)) : 1, next = Object.assign({}, cur, k.p); for (const j of JOINTS) cur[j] = (cur[j] ?? 0) + ((next[j] ?? 0) - (cur[j] ?? 0)) * u; } return cur; };
      const xAt = (t) => { let px = moves[0].x, walking = 0; for (const m of moves) { if (t < m.t) break; const u = clamp((t - m.t) / m.dur, 0, 1); if (u < 1) walking = 1; px = px + (m.x - px) * u; } return [px, walking]; };
      const rot = (g, px, py, a) => g.setAttribute("transform", `translate(${px},${py}) rotate(${a.toFixed(2)})`);
      h.update = (t) => {
        const vis = t >= at; root.setAttribute("opacity", vis ? 1 : 0); if (!vis) return; const pop = clamp((t - at) / 0.35, 0, 1), sc = s * (0.6 + 0.4 * (1 + 1.7 * Math.pow(pop - 1, 3) + 0.7 * Math.pow(pop - 1, 2)));
        let vw = views[0]; for (const q of views) if (t >= q[0]) vw = q; const side = vw[1] === "side", dir = vw[2];
        if (curView !== vw[1] + dir) { curView = vw[1] + dir; tFront.style.display = side ? "none" : "inline"; tSide.style.display = side ? "inline" : "none"; det.style.display = side ? "none" : "inline";
          earR.style.display = side ? "none" : "inline"; const ft = side ? `translate(${0.3 * r},0) translate(0,-228) scale(0.86,1) translate(0,228)` : ""; faceG.setAttribute("transform", ft); glassG.setAttribute("transform", ft);
          body.setAttribute("transform", dir < 0 ? "scale(-1,1)" : ""); legs.forEach((lg) => { lg.th.px = side ? lg.d * 6 : lg.d * 24; lg.shoe.setAttribute("cx", side ? 16 : lg.d * 6); });
          arms.forEach((a) => { a.ua.px = side ? 0 : a.d * 50; }); const far = arms[1].ua.g; if (side) torso.insertBefore(far, torso.firstChild); else torso.insertBefore(far, headG); }
        const p = poseAt(t), [px, walking] = xAt(t), wk = walking ? Math.sin(t * 11) : 0, breath = Math.sin(t * 2.4 + x) * 1.5;
        const lift = p.lift + (walking ? -Math.abs(Math.cos(t * 11)) * 6 : 0);
        root.setAttribute("transform", `translate(${px.toFixed(1)},${(y - 170 * s).toFixed(1)}) scale(${sc.toFixed(3)}) rotate(${p.root.toFixed(2)},0,170) translate(${(p.side || 0).toFixed(1)},${lift.toFixed(1)})`);
        rot(torso, 0, 0, p.torso + (walking ? wk * 2 : 0)); torso.firstChild && torso.setAttribute("transform", `rotate(${(p.torso + (walking ? wk * 2 : 0)).toFixed(2)}) translate(0,${breath.toFixed(2)})`);
        legs.forEach(({ th, sh, d }, i) => { const sw = walking ? (i ? -wk : wk) * 24 : 0; rot(th.g, th.px, th.py, (i ? p.lR : p.lL) + sw); rot(sh.g, 0, 80, (i ? p.kR : p.kL) + (walking ? Math.max(0, (i ? wk : -wk)) * 30 : 0)); });
        // arms; "plant" = hands reach the floor (two-bone IK in torso space)
        const th = (p.root + p.torso) * Math.PI / 180, pl = clamp(p.plant || 0, 0, 1);
        arms.forEach(({ ua, fa, d }, i) => { let a = i ? p.aR : p.aL, e = i ? p.eR : p.eL; if (walking && !pl && Math.abs(a) < 40) a += (i ? wk : -wk) * 18;
          let spx = ua.px;
          if (pl > 0.01) { // hands planted: fixed palm on the floor under the up-position shoulder; elbows fold back toward the feet
            const th0 = (p.root + p.torso) * Math.PI / 180, tA = th0 * 180 / Math.PI, ly = -128 + lift - 170, sxo = (p.side || 0) + (i ? 6 : -6);
            const Xs = sxo * Math.cos(th0) - ly * Math.sin(th0), Ys = sxo * Math.sin(th0) + ly * Math.cos(th0) + 170;
            const pu = POSES.pushUp, thU = pu.root * Math.PI / 180, Hx = -(-128 + pu.lift - 170) * Math.sin(thU) - 18, Hy = 154;
            const L1 = 72, L2 = 74, dx = Hx - Xs, dy = Hy - Ys, R = clamp(Math.hypot(dx, dy), 20, L1 + L2 - 0.5), phi = Math.atan2(dy, dx);
            const al = Math.acos(clamp((L1 * L1 + R * R - L2 * L2) / (2 * L1 * R), -1, 1));
            let best = null; for (const sg of [1, -1]) { const ex = Xs + L1 * Math.cos(phi + sg * al), ey = Ys + L1 * Math.sin(phi + sg * al); if (!best || ex < best[0]) best = [ex, ey]; }
            const A1 = Math.atan2(best[1] - Ys, best[0] - Xs) * 180 / Math.PI - 90, A2 = Math.atan2(Hy - best[1], Hx - best[0]) * 180 / Math.PI - 90;
            const ia = A1 - tA, ie = A2 - A1; a = a + (ia - a) * pl; e = e + (ie - e) * pl; spx = ua.px * (1 - pl) + (i ? 6 : -6) * pl; }
          rot(ua.g, spx, ua.py, a + (i ? -breath * 0.6 : breath * 0.6)); rot(fa.g, 0, 72, e); });
        rot(headG, 0, 0, p.head + (talks.some(([a, b]) => t >= a && t < b) ? Math.sin(t * 9) * 2 : 0)); headG.setAttribute("transform", `rotate(${(p.head).toFixed(2)},0,-140)`);
        // face
        let e = faces[0][1]; for (const [tt, ee] of faces) if (t >= tt) e = ee;
        const speaking = talks.find(([a, b]) => t >= a && t < b); for (const m in mouths) mouths[m].style.display = !speaking && m === e ? "inline" : "none";
        if (speaking) { const o = 0.35 + 0.65 * Math.abs(Math.sin((t - speaking[0]) * 17)); talk.setAttribute("d", `M${U(-0.18, 0.6)} Q${U(0, 0.56)} ${U(0.18, 0.6)} Q${U(0.16, 0.6 + 0.3 * o)} ${U(0, 0.62 + 0.3 * o)} Q${U(-0.16, 0.6 + 0.3 * o)} ${U(-0.18, 0.6)} Z`); talk.style.display = "inline"; } else talk.style.display = "none";
        const happy = e === "grin" || e === "smile" && false, tired = e === "tired" || (c.tired && e !== "wow" && e !== "grin");
        const blink = (t * 1000 + x * 13) % 3900 < 120;
        eyesOpen.style.display = happy || blink ? "none" : "inline"; eyesHappy.style.display = happy || blink ? "inline" : "none"; lids.style.display = tired && !happy && !blink ? "inline" : "none";
        const bt = { sad: [10, 6], strain: [-12, 8], determined: [-14, 4], wow: [6, -10], tired: [4, 2], grin: [0, -6], smile: [0, -4], talk: [0, 0], neutral: [0, 0] }[e] || [0, 0];
        brows.forEach((b, i) => b.setAttribute("transform", `translate(0,${bt[1]}) rotate(${(i ? -1 : 1) * bt[0]} ${(i ? 1 : -1) * 0.38 * r} ${-228 - 0.33 * r})`));
      };
      return h;
    }
    return { make, POSES, designs: D };
  };
})();
