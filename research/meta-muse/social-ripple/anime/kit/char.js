/* Anime characters for Social Ripple, drawn in our own ink-outline chibi style from each character's signature design
   traits (hair silhouette, eyes, outfit, marks). Not traced from official art.
   const C = CHAR({ I }); const h = C.draw(parent, "naruto" | "luffy" | "jinwoo", x, feetY, scale, at, { mood, glow, pose });
   h.setMood(t, m)  h.setGlow(t, bool)  h.update(t). Moods: neutral, smile, grin, serious, sad, shout. Poses: down, fist, point, cross. */
(function () {
  window.CHAR = function (K) {
    const { I } = K, el = I.el, INK = I.INKC;
    const SKIN = { naruto: "#F6CFA4", luffy: "#F7D3AE", jinwoo: "#FBE4CF" };
    function draw(p, name, x, y, s, at, o = {}) {
      const g = el("g", {}, p), r = 95 * s, cx = x, cy = y - 470 * s, skin = SKIN[name];
      const U = (u, v) => `${(cx + u * r).toFixed(1)},${(cy + v * r).toFixed(1)}`;            // head-unit coords
      const Bp = (u, v) => `${(x + u * s).toFixed(1)},${(y + v * s).toFixed(1)}`;             // body pixel coords (scaled)
      let k = 0; const nx = (d = 0.06) => at + (k += d);                                       // stagger the pop-in
      const F = (d, fill, o2 = {}) => I.fill(o2.p || g, el("path", { d, fill, stroke: o2.stroke ?? INK, "stroke-width": (o2.sw ?? 5) * s, "stroke-linejoin": "round", "stroke-linecap": "round", opacity: 0 }), o2.at ?? nx(), 0.18, { sound: o2.sound ?? false });
      const Ln = (d, color, w, o2 = {}) => I.fill(o2.p || g, el("path", { d, fill: "none", stroke: color, "stroke-width": w * s, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }), o2.at ?? nx(0.02), 0.15, { sound: false });
      const poly = (pts, f = U) => "M" + pts.map((q) => f(q[0], q[1])).join(" L") + " Z";
      const ring = (a0, a1, n, rin, rout, jit = 0, close = []) => { const pts = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180, rr = i % 2 ? rout + ((i * 37) % 7 - 3) / 3 * jit : rin; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return pts.concat(close); };
      // ---------- back hair ----------
      if (name === "naruto") F(poly(ring(150, 390, 22, 0.98, 1.72, 0.14, [[0.9, 0.05], [-0.9, 0.05]])), "#F7C531", { sw: 5, sound: "pop" });
      if (name === "luffy") F(poly(ring(150, 390, 18, 0.98, 1.2, 0.06, [[0.95, 0.1], [-0.95, 0.1]])), "#1B1A1F", { sw: 4, sound: "pop" });
      if (name === "jinwoo") F(poly(ring(140, 400, 26, 1.0, 1.17, 0.05, [[1.02, 0.45], [0.85, 0.2], [-0.85, 0.2], [-1.02, 0.45]])), "#17161C", { sw: 4, sound: "pop" });
      // ---------- legs + shoes ----------
      const pants = { naruto: "#F28C28", luffy: "#3D6FB0", jinwoo: "#1E1D24" }[name];
      if (name === "luffy") { F(`M${Bp(-62, -200)} L${Bp(62, -200)} L${Bp(70, -100)} L${Bp(8, -100)} L${Bp(0, -150)} L${Bp(-8, -100)} L${Bp(-70, -100)} Z`, pants);
        Ln(`M${Bp(-38, -100)} L${Bp(-40, -18)} M${Bp(38, -100)} L${Bp(40, -18)}`, INK, 30); Ln(`M${Bp(-38, -100)} L${Bp(-40, -18)} M${Bp(38, -100)} L${Bp(40, -18)}`, skin, 22);
        F(`M${Bp(-72, -112)} h${52 * s} v${18 * s} h${-52 * s} z M${Bp(20, -112)} h${52 * s} v${18 * s} h${-52 * s} z`, "#5C86C4", { sw: 4 }); }
      else { Ln(`M${Bp(-34, -200)} L${Bp(-40, -18)} M${Bp(34, -200)} L${Bp(40, -18)}`, INK, 44); Ln(`M${Bp(-34, -200)} L${Bp(-40, -18)} M${Bp(34, -200)} L${Bp(40, -18)}`, pants, 34); }
      const shoe = { naruto: "#2C3E73", luffy: "#8A5A2B", jinwoo: "#141318" }[name];
      F(`M${Bp(-72, 0)} q0,${-30 * s} ${32 * s},${-30 * s} q${26 * s},0 ${26 * s},${30 * s} z M${Bp(14, 0)} q0,${-30 * s} ${26 * s},${-30 * s} q${32 * s},0 ${32 * s},${30 * s} z`, shoe, { sw: 4 });
      // ---------- torso ----------
      if (name === "naruto") { F(`M${Bp(-80, -360)} Q${Bp(0, -375)} ${Bp(80, -360)} L${Bp(72, -185)} L${Bp(-72, -185)} Z`, "#F28C28", { sound: "swish" });
        F(`M${Bp(-80, -360)} Q${Bp(0, -375)} ${Bp(80, -360)} L${Bp(77, -300)} Q${Bp(0, -285)} ${Bp(-77, -300)} Z`, "#1D1B1A", { sw: 4 });
        Ln(`M${Bp(0, -350)} V${(y - 190 * s).toFixed(1)}`, "#1D1B1A", 5); F(`M${Bp(-6, -330)} h${12 * s} v${22 * s} h${-12 * s} z`, "#D9D9D9", { sw: 3 }); }
      if (name === "luffy") { F(`M${Bp(-74, -360)} Q${Bp(0, -372)} ${Bp(74, -360)} L${Bp(66, -200)} L${Bp(-66, -200)} Z`, skin);
        Ln(`M${Bp(-26, -320)} L${Bp(26, -268)} M${Bp(26, -320)} L${Bp(-26, -268)}`, "#C9786B", 6);
        F(`M${Bp(-74, -360)} L${Bp(-34, -362)} L${Bp(-42, -200)} L${Bp(-70, -200)} Z M${Bp(74, -360)} L${Bp(34, -362)} L${Bp(42, -200)} L${Bp(70, -200)} Z`, "#D8322A", { sound: "swish" });
        F(`M${Bp(-68, -222)} L${Bp(68, -222)} L${Bp(66, -196)} L${Bp(-66, -196)} Z`, "#F2C230", { sw: 4 }); }
      if (name === "jinwoo") { F(`M${Bp(-84, -362)} Q${Bp(0, -378)} ${Bp(84, -362)} L${Bp(118, -70)} L${Bp(-118, -70)} Z`, "#22212B", { sound: "swish" });
        F(`M${Bp(-22, -360)} L${Bp(22, -360)} L${Bp(14, -150)} L${Bp(-14, -150)} Z`, "#3A3946", { sw: 3 });
        F(`M${Bp(-70, -362)} L${Bp(-44, -415)} L${Bp(-20, -340)} Z M${Bp(70, -362)} L${Bp(44, -415)} L${Bp(20, -340)} Z`, "#22212B", { sw: 4 });
        Ln(`M${Bp(-24, -340)} L${Bp(-60, -80)} M${Bp(24, -340)} L${Bp(60, -80)}`, "#4A4A60", 4); }
      // ---------- arms (sleeve + hand) ----------
      const sleeve = { naruto: "#F28C28", luffy: skin, jinwoo: "#22212B" }[name];
      const poses = { down: [[-78, -345, -108, -268, -112, -195], [78, -345, 108, -268, 112, -195]], fist: [[-78, -345, -108, -268, -112, -195], [78, -345, 140, -390, 150, -470]],
        point: [[-78, -345, -108, -268, -112, -195], [78, -345, 150, -330, 225, -340]], cross: [[-78, -345, -40, -280, 50, -300], [78, -345, 40, -280, -50, -300]] };
      const arms = (o.armsCustom || poses[o.pose || "down"]);
      arms.forEach(([sx, sy, ex, ey, hx, hy]) => { const d = `M${Bp(sx, sy)} L${Bp(ex, ey)} L${Bp(hx, hy)}`; Ln(d, INK, 36); Ln(d, sleeve, 27); if (name === "naruto") Ln(`M${Bp(sx, sy)} L${Bp(sx + (ex - sx) * 0.45, sy + (ey - sy) * 0.45)}`, "#1D1B1A", 27);
        I.fill(g, el("circle", { cx: x + hx * s, cy: y + hy * s, r: 17 * s, fill: skin, stroke: INK, "stroke-width": 4 * s, opacity: 0 }), nx(0.02), 0.15, { sound: false }); });
      // ---------- neck, ears, face ----------
      F(`M${Bp(-16, -400)} h${32 * s} v${45 * s} h${-32 * s} z`, skin, { sw: 4 });
      F(`M${U(-0.86, -0.02)} q${-0.22 * r},${0.02 * r} ${-0.16 * r},${0.26 * r} q${0.06 * r},${0.14 * r} ${0.2 * r},${0.06 * r} z M${U(0.86, -0.02)} q${0.22 * r},${0.02 * r} ${0.16 * r},${0.26 * r} q${-0.06 * r},${0.14 * r} ${-0.2 * r},${0.06 * r} z`, skin, { sw: 4 });
      F(`M${U(-0.9, -0.15)} C${U(-0.95, -1.08)} ${U(0.95, -1.08)} ${U(0.9, -0.15)} C${U(0.88, 0.4)} ${U(0.5, 0.78)} ${U(0, 0.96)} C${U(-0.5, 0.78)} ${U(-0.88, 0.4)} ${U(-0.9, -0.15)} Z`, skin, { sw: 6, sound: "pop" });
      // ---------- eyes ----------
      const eyes = el("g", {}, g), glow = el("g", { opacity: 0 }, g), eyeC = { naruto: "#2F7FE0", luffy: "#1B1A1F", jinwoo: "#4B4658" }[name];
      for (const d of [-1, 1]) { const ex = d * 0.38, ey = 0.14;
        if (name === "jinwoo") { F(`M${U(ex - 0.22, ey + 0.02)} Q${U(ex, ey - 0.13)} ${U(ex + 0.22, ey - 0.03)} Q${U(ex, ey + 0.12)} ${U(ex - 0.22, ey + 0.02)} Z`, "#FFFFFF", { p: eyes, sw: 3 });
          I.fill(eyes, el("circle", { cx: cx + ex * r, cy: cy + (ey - 0.01) * r, r: 0.075 * r, fill: eyeC, opacity: 0 }), nx(0.02), 0.1, { sound: false });
          Ln(`M${U(ex - 0.25, ey + (d < 0 ? 0.0 : -0.06))} Q${U(ex, ey - 0.16)} ${U(ex + 0.25, ey + (d < 0 ? -0.06 : 0.0))}`, INK, 7, { p: eyes });
          Ln(`M${U(ex - d * 0.2, ey - 0.3 + (d < 0 ? 0.04 : 0))} L${U(ex + d * 0.22, ey - 0.28)}`, INK, 6, { p: eyes });
          I.fill(glow, el("ellipse", { cx: cx + ex * r, cy: cy + ey * r, rx: 0.3 * r, ry: 0.13 * r, fill: "#8C7BFF", opacity: 0 }), at, 0.1, { sound: false }).setAttribute("fill-opacity", 0.45);
          I.fill(glow, el("path", { d: `M${U(ex - 0.2, ey + 0.02)} Q${U(ex, ey - 0.11)} ${U(ex + 0.2, ey - 0.03)} Q${U(ex, ey + 0.09)} ${U(ex - 0.2, ey + 0.02)} Z`, fill: "#B9AEFF", stroke: "#5D4BE0", "stroke-width": 3 * s, opacity: 0 }), at, 0.1, { sound: false });
          el("path", { d: `M${U(ex - 0.25, ey + (d < 0 ? 0.0 : -0.06))} Q${U(ex, ey - 0.16)} ${U(ex + 0.25, ey + (d < 0 ? -0.06 : 0.0))} M${U(ex - d * 0.2, ey - 0.3 + (d < 0 ? 0.04 : 0))} L${U(ex + d * 0.22, ey - 0.28)}`, fill: "none", stroke: INK, "stroke-width": 6 * s, "stroke-linecap": "round" }, glow); }
        else { F(`M${U(ex, ey - 0.25)} C${U(ex + 0.22, ey - 0.25)} ${U(ex + 0.22, ey + 0.24)} ${U(ex, ey + 0.24)} C${U(ex - 0.22, ey + 0.24)} ${U(ex - 0.22, ey - 0.25)} ${U(ex, ey - 0.25)} Z`, "#FFFFFF", { p: eyes, sw: 3 });
          I.fill(eyes, el("ellipse", { cx: cx + ex * r, cy: cy + (ey + 0.03) * r, rx: 0.13 * r, ry: 0.18 * r, fill: eyeC, opacity: 0 }), nx(0.02), 0.1, { sound: false });
          I.fill(eyes, el("ellipse", { cx: cx + ex * r, cy: cy + (ey + 0.05) * r, rx: 0.065 * r, ry: 0.09 * r, fill: "#0E0E12", opacity: 0 }), nx(0.01), 0.1, { sound: false });
          I.fill(eyes, el("circle", { cx: cx + (ex - 0.05) * r, cy: cy + (ey - 0.05) * r, r: 0.045 * r, fill: "#FFFFFF", opacity: 0 }), nx(0.01), 0.1, { sound: false });
          Ln(`M${U(ex - 0.23, ey - 0.12)} Q${U(ex, ey - 0.33)} ${U(ex + 0.24, ey - 0.12)}`, INK, 7, { p: eyes });
          Ln(`M${U(ex - 0.2, ey - 0.42)} Q${U(ex, ey - 0.5)} ${U(ex + 0.2, ey - 0.44)}`, name === "naruto" ? "#C9962A" : INK, name === "naruto" ? 7 : 5, { p: eyes }); } }
      Ln(`M${U(0.02, 0.4)} l${-0.04 * r},${0.06 * r}`, "#B98A6A", 4);
      // ---------- mouths ----------
      const M = { neutral: [`M${U(-0.12, 0.66)} L${U(0.12, 0.66)}`, "none"], smile: [`M${U(-0.2, 0.6)} Q${U(0, 0.76)} ${U(0.2, 0.6)}`, "none"], serious: [`M${U(-0.1, 0.68)} L${U(0.12, 0.66)}`, "none"],
        sad: [`M${U(-0.16, 0.72)} Q${U(0, 0.6)} ${U(0.16, 0.72)}`, "none"], grin: [`M${U(-0.34, 0.54)} Q${U(0, 0.62)} ${U(0.34, 0.54)} Q${U(0, 0.98)} ${U(-0.34, 0.54)} Z`, "#7A2A2A"], shout: [`M${U(-0.16, 0.56)} Q${U(0, 0.52)} ${U(0.16, 0.56)} Q${U(0.14, 0.9)} ${U(0, 0.9)} Q${U(-0.14, 0.9)} ${U(-0.16, 0.56)} Z`, "#7A2A2A"] };
      const ms = {}; for (const m in M) ms[m] = el("path", { d: M[m][0], fill: M[m][1], stroke: INK, "stroke-width": 5 * s, "stroke-linecap": "round", "stroke-linejoin": "round", style: "display:none" }, g);
      ms.grinTeeth = el("path", { d: `M${U(-0.28, 0.57)} Q${U(0, 0.64)} ${U(0.28, 0.57)} L${U(0.25, 0.65)} Q${U(0, 0.71)} ${U(-0.25, 0.65)} Z`, fill: "#FFFFFF", style: "display:none" }, g);
      // ---------- marks ----------
      if (name === "naruto") for (const d of [-1, 1]) for (let i = 0; i < 3; i++) Ln(`M${U(d * 0.5, 0.36 + i * 0.11)} L${U(d * 0.82, 0.33 + i * 0.13)}`, "#5A3A22", 4);
      if (name === "luffy") Ln(`M${U(0.2, 0.42)} Q${U(0.38, 0.5)} ${U(0.56, 0.42)} M${U(0.3, 0.38)} l${0.03 * r},${0.12 * r} M${U(0.45, 0.38)} l${0.03 * r},${0.12 * r}`, "#8A4A3A", 3.5);
      // ---------- front hair ----------
      if (name === "naruto") F(poly([[-0.95, -0.42], [-0.78, -0.1], [-0.6, -0.4], [-0.38, -0.08], [-0.18, -0.4], [0.05, -0.12], [0.22, -0.42], [0.44, -0.1], [0.62, -0.42], [0.8, -0.12], [0.95, -0.42], [0.7, -0.85], [-0.7, -0.85]]), "#F7C531", { sw: 4 });
      if (name === "luffy") F(poly([[-0.95, -0.4], [-0.82, -0.12], [-0.62, -0.34], [-0.44, -0.16], [-0.22, -0.36], [0.0, -0.18], [0.2, -0.38], [0.4, -0.14], [0.62, -0.36], [0.84, -0.1], [0.95, -0.4], [0.7, -0.85], [-0.7, -0.85]]), "#1B1A1F", { sw: 4 });
      if (name === "jinwoo") { F(poly([[-1.0, -0.35], [-0.98, 0.32], [-0.82, 0.0], [-0.74, -0.2], [-0.56, 0.05], [-0.42, -0.3], [-0.24, -0.02], [-0.06, -0.42], [0.06, 0.04], [0.26, -0.36], [0.44, -0.04], [0.6, -0.32], [0.78, 0.02], [0.82, -0.18], [0.98, 0.34], [1.0, -0.35], [0.7, -0.92], [-0.7, -0.92]]), "#17161C", { sw: 4 });
        Ln(`M${U(-0.5, -0.7)} Q${U(-0.3, -0.5)} ${U(-0.32, -0.2)} M${U(0.3, -0.72)} Q${U(0.42, -0.45)} ${U(0.38, -0.2)}`, "#454B6E", 4); }
      // ---------- accessories ----------
      if (name === "naruto") { F(`M${U(-0.98, -0.62)} Q${U(0, -0.86)} ${U(0.98, -0.62)} L${U(0.96, -0.4)} Q${U(0, -0.64)} ${U(-0.96, -0.4)} Z`, "#2C3E73", { sw: 4 });
        F(`M${U(-0.34, -0.8)} L${U(0.34, -0.8)} L${U(0.32, -0.46)} L${U(-0.32, -0.46)} Z`, "#C9CED6", { sw: 4 });
        { const sp = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2.6, rr = 0.012 + i / 24 * 0.1; sp.push(U(Math.cos(a) * rr * 1.3, -0.63 + Math.sin(a) * rr)); }
          Ln(`M${sp.join(" L")} L${U(-0.2, -0.5)} M${U(-0.11, -0.53)} L${U(-0.2, -0.5)} L${U(-0.15, -0.6)}`, "#4A4F5A", 3.5); }
        Ln(`M${U(0.95, -0.55)} q${0.25 * r},${0.1 * r} ${0.4 * r},${0.45 * r} M${U(0.95, -0.48)} q${0.18 * r},${0.12 * r} ${0.3 * r},${0.5 * r}`, "#2C3E73", 9); }
      if (name === "luffy") { F(`M${U(-1.6, -0.62)} Q${U(0, -0.98)} ${U(1.6, -0.62)} Q${U(0, -0.22)} ${U(-1.6, -0.62)} Z`, "#E9C46A", { sw: 5, sound: "slap" });
        F(`M${U(-0.78, -0.62)} Q${U(-0.82, -1.5)} ${U(0, -1.52)} Q${U(0.82, -1.5)} ${U(0.78, -0.62)} Z`, "#E9C46A", { sw: 5 });
        F(`M${U(-0.8, -0.92)} Q${U(0, -1.02)} ${U(0.8, -0.92)} L${U(0.79, -0.66)} Q${U(0, -0.76)} ${U(-0.79, -0.66)} Z`, "#C62F2A", { sw: 4 });
        Ln(`M${U(-1.2, -0.56)} Q${U(-0.9, -0.5)} ${U(-0.6, -0.48)} M${U(0.6, -0.48)} Q${U(0.9, -0.5)} ${U(1.2, -0.56)} M${U(-0.4, -1.2)} q${0.4 * r},${-0.12 * r} ${0.8 * r},0`, "#B8913E", 3); }
      const keys = [[0, o.mood || "neutral", !!o.glow]];
      return { g, keys, setMood: (t0, m) => keys.push([t0, m, keys[keys.length - 1][2]]), setGlow: (t0, v) => keys.push([t0, keys[keys.length - 1][1], v]),
        update(t) { let kk = keys[0]; for (const q of keys) if (t >= q[0]) kk = q; const shown = t >= at + k;
          for (const m in M) ms[m].style.display = shown && m === kk[1] ? "inline" : "none"; ms.grinTeeth.style.display = shown && kk[1] === "grin" ? "inline" : "none";
          glow.setAttribute("opacity", kk[2] && shown ? 1 : 0); eyes.setAttribute("opacity", kk[2] && name === "jinwoo" ? 0 : 1);
          const blink = !kk[2] && (t * 1000 + x * 7) % 4100 < 110, ey = cy + 0.14 * r; eyes.setAttribute("transform", blink ? `translate(0,${ey}) scale(1,0.12) translate(0,${-ey})` : "");
          g.setAttribute("transform", `translate(0,${(Math.sin(t * 2.2 + x) * 3).toFixed(2)})`); } };
    }
    // the "System" window (our own design): a glowing blue panel with a header and rows
    function system(p, x, y, w, rows, at, o = {}) {
      const g = el("g", {}, p), h = 110 + rows.length * 78;
      I.fill(g, el("rect", { x: x - 14, y: y - 14, width: w + 28, height: h + 28, rx: 18, fill: "#3FA9F5", opacity: 0 }), at, 0.25, { sound: "swish" }).setAttribute("fill-opacity", 0.18);
      I.fill(g, el("rect", { x, y, width: w, height: h, rx: 12, fill: "#0E1B2E", stroke: "#7CCBFF", "stroke-width": 5, opacity: 0 }), at + 0.05, 0.25, { sound: false });
      I.fill(g, Object.assign(el("text", { x: x + w / 2, y: y + 68, "text-anchor": "middle", "font-family": "Anton", "font-size": 52, fill: "#BFE6FF", "letter-spacing": 4, opacity: 0 }), { textContent: o.title || "[ DAILY QUEST ]" }), at + 0.15, 0.2, { sound: false });
      const rowEls = rows.map((r, i) => { const t = el("text", { x: x + 40, y: y + 150 + i * 78, "font-family": "Patrick Hand", "font-size": 50, fill: "#E8F6FF", opacity: 0 }, g); t.textContent = r; I.fill(g, t, at + 0.3 + i * (o.rowGap ?? 0.25), 0.15, { sound: i ? false : "pop" }); return t; });
      return { g, rowEls };
    }
    return { draw, system };
  };
})();
