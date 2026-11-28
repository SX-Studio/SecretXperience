/* Shared drawing helpers for Social Ripple ink episodes. const L = LIB(K); every helper draws into a parent group p. */
(function () {
  window.LIB = function (K) {
    const { I, el, INKC, HI, RED, clamp, ease } = K, GREY = "#6B6359", BLUE = "#5B8DB8", GREEN = "#4E8A3A";
    const L = { GREY, BLUE, GREEN };
    L.tx = (p, str, x, y, size, at, dur = 0.6, o = {}) => I.text(p, str, x, y, size, at, dur, o);
    L.pop = (p, str, x, y, size, at, fill = INKC, font = "Caveat", sound = "pop", rot = 0, anchor = "middle") => I.fill(p, Object.assign(el("text", { x, y, "text-anchor": anchor, "font-family": font, "font-weight": font === "Caveat" ? 700 : 400, "font-size": size, fill, opacity: 0, transform: rot ? `rotate(${rot} ${x} ${y})` : "" }), { textContent: str }), at, 0.18, { pop: [x, y - size * 0.35], sound });
    L.box = (p, x, y, w, h, at, o = {}) => I.path(p, `M${x + 20},${y} h${w - 40} q20,0 20,20 v${h - 40} q0,20 -20,20 h${-(w - 40)} q-20,0 -20,-20 v${-(h - 40)} q0,-20 20,-20 z`, at, o.dur || 0.45, { w: o.w || 8, color: o.color, silent: o.silent });
    L.arrow = (p, x1, y1, x2, y2, at, o = {}) => { const a = Math.atan2(y2 - y1, x2 - x1), h = o.head || 34, c = o.color || INKC;
      const bx = (s) => (x2 - h * Math.cos(a + s)).toFixed(1), by = (s) => (y2 - h * Math.sin(a + s)).toFixed(1);
      return I.path(p, `M${x1},${y1} ${o.curve ? `Q${o.curve[0]},${o.curve[1]} ` : "L"}${x2},${y2} M${bx(0.5)},${by(0.5)} L${x2},${y2} L${bx(-0.5)},${by(-0.5)}`, at, o.dur || 0.35, { w: o.w || 8, color: c, silent: o.silent }); };
    L.heart = (cx, cy, s) => `M${cx},${cy + 0.9 * s} C${cx - 1.5 * s},${cy - 0.1 * s} ${cx - 0.7 * s},${cy - 1.15 * s} ${cx},${cy - 0.42 * s} C${cx + 0.7 * s},${cy - 1.15 * s} ${cx + 1.5 * s},${cy - 0.1 * s} ${cx},${cy + 0.9 * s} z`;
    L.rect = (p, x, y, w, h, at, fill, o = {}) => I.fill(p, el("rect", { x, y, width: w, height: h, rx: o.rx ?? 8, fill, stroke: o.stroke ?? INKC, "stroke-width": o.sw ?? 6, opacity: 0, transform: o.rot ? `rotate(${o.rot} ${x + w / 2} ${y + h / 2})` : "" }), at, o.dur || 0.2, { pop: [x + w / 2, y + h / 2], sound: o.sound ?? "swish" });
    L.sign = (p, txt, cx, cy, w, h, at, o = {}) => { L.rect(p, cx - w / 2, cy - h / 2, w, h, at, o.fill || HI, { rot: o.rot ?? -5, sound: "slap", sw: 7 });
      I.fill(p, Object.assign(el("text", { x: cx, y: cy + (o.size || 64) * 0.34, "text-anchor": "middle", "font-family": o.font || "Caveat", "font-weight": 700, "font-size": o.size || 64, fill: o.color || INKC, transform: `rotate(${o.rot ?? -5} ${cx} ${cy})` }), { textContent: txt }), at + 0.03, 0.2, { pop: [cx, cy], sound: false }); };
    L.stopwatch = (p, x, y, r, at) => { I.circle(p, x, y, r, at, 0.4, { w: 8 }); I.path(p, `M${x - 22},${y - r - 26} h44 M${x},${y - r - 26} v24`, at + 0.3, 0.2, { w: 8, silent: true });
      const hand = el("line", { x1: x, y1: y, x2: x, y2: y - r * 0.78, stroke: RED, "stroke-width": 8, "stroke-linecap": "round" }, p);
      return (t, a, b) => { const u = clamp((t - a) / (b - a), 0, 1), an = (u * 330 - 90) * Math.PI / 180; hand.setAttribute("opacity", t >= at + 0.3 ? 1 : 0); hand.setAttribute("x2", (x + Math.cos(an) * r * 0.78).toFixed(1)); hand.setAttribute("y2", (y + Math.sin(an) * r * 0.78).toFixed(1)); }; };
    L.bucket = (p, x, y, at) => { I.path(p, `M${x - 170},${y} L${x + 170},${y} L${x + 130},${y + 300} L${x - 130},${y + 300} Z`, at, 0.45, { w: 8 }); I.path(p, `M${x - 155},${y + 55} q40,-18 80,0 t80,0 t80,0 t70,0`, at + 0.3, 0.35, { w: 6, color: BLUE });
      [[x - 50, y + 30, 12], [x + 60, y + 22, -10], [x + 5, y + 110, 20]].forEach(([a, b, r], i) => I.path(p, `M${a - 26},${b - 26} h52 v52 h-52 z`, at + 0.45 + i * 0.1, 0.2, { w: 5, color: "#7FB2D6", silent: i > 0, attrs: { transform: `rotate(${r} ${a} ${b})` } })); };
    L.button = (p, cx, cy, at, txt) => { L.box(p, cx - 260, cy - 40, 520, 230, at); I.fill(p, el("ellipse", { cx, cy: cy + 40, rx: 170, ry: 60, fill: RED, stroke: INKC, "stroke-width": 7, opacity: 0 }), at + 0.35, 0.2, { pop: [cx, cy + 40] });
      I.fill(p, el("ellipse", { cx: cx - 60, cy: cy + 20, rx: 50, ry: 14, fill: "#FF8A7E", opacity: 0 }), at + 0.45, 0.2, { sound: false }); if (txt) L.pop(p, txt, cx, cy + 160, 56, at + 0.5, INKC, "Patrick Hand", false); };
    L.cursor = (p) => { const g = el("g", {}, p); el("path", { d: "M0,0 l0,92 l24,-21 l17,38 l17,-7 l-17,-37 l33,-2 z", fill: "#FFFDF6", stroke: INKC, "stroke-width": 6, "stroke-linejoin": "round" }, g); return g; };
    L.strip = (p, x, y, w, h, at, rot = 0, fill = "#F2D24B") => L.rect(p, x, y, w, h, at, fill, { rot, rx: 6 });
    L.envelope = (p, x, y, at, lb, col) => { I.path(p, `M${x},${y} h380 v260 h-380 z M${x},${y} l190,140 l190,-140`, at, 0.45, { w: 8 }); L.pop(p, lb, x + 190, y + 340, 60, at + 0.3, col, "Anton", false); };
    L.magnifier = (p, x, y, at) => { I.circle(p, x, y, 80, at, 0.35, { w: 9 }); I.path(p, `M${x + 57},${y + 57} l90,90`, at + 0.3, 0.2, { w: 14 }); };
    L.mirror = (p, x, y, w, h, at) => { I.path(p, `M${x},${y} h${w} v${h} h${-w} z`, at, 0.45); I.path(p, `M${x + 25},${y + 25} h${w - 50} v${h - 50} h${-(w - 50)} z`, at + 0.3, 0.3, { w: 3, attrs: { "stroke-dasharray": "2 14" }, silent: true }); };
    L.phone = (p, x, y, at) => { L.box(p, x, y, 260, 460, at, { w: 8 }); I.path(p, `M${x + 100},${y + 420} h60`, at + 0.3, 0.15, { w: 6, silent: true }); };
    L.thought = (p, x, y, w, h, at) => { I.path(p, `M${x - w / 2},${y} q0,${-h / 2} ${w / 2},${-h / 2} q${w / 2},0 ${w / 2},${h / 2} q0,${h / 2} ${-w / 2},${h / 2} q${-w / 2},0 ${-w / 2},${-h / 2} z`, at, 0.4, { w: 6 });
      I.circle(p, x - w / 2 + 10, y + h / 2 + 30, 16, at + 0.3, 0.15, { w: 5, silent: true }); I.circle(p, x - w / 2 - 20, y + h / 2 + 70, 10, at + 0.35, 0.12, { w: 5, silent: true }); };
    // growing bars: returns updater; spec [{x,y,len,thick,fill,at,horizontal}]
    L.bars = (p, specs) => { const rs = specs.map((s) => ({ s, r: el("rect", { x: s.x, y: s.y, width: 0, height: 0, fill: s.fill, stroke: INKC, "stroke-width": 6, opacity: 0 }, p) }));
      return (t) => rs.forEach(({ s, r }) => { const v = ease(clamp((t - s.at) / (s.dur || 0.7), 0, 1)); r.setAttribute("opacity", v > 0 ? 1 : 0);
        if (s.horizontal) { r.setAttribute("width", (s.len * v).toFixed(1)); r.setAttribute("height", s.thick); }
        else { r.setAttribute("width", s.thick); r.setAttribute("height", (s.len * v).toFixed(1)); r.setAttribute("y", (s.y - s.len * v).toFixed(1)); } }); };
    // a TRICK poster: "TRICK #n" then the name, word-timed
    L.trick = (n, on, nameLines) => ({ on, slashAt: nameLines[nameLines.length - 1].at, shakeAt: nameLines[nameLines.length - 1].at, lines: [{ txt: `TRICK #${n}`, x: 120, y: 260, size: 120, fill: "#9A958C", at: on[0] + 0.05 }].concat(nameLines.map((l, i) => Object.assign({ x: 120, y: 560 + i * 270, size: 250, fill: i === nameLines.length - 1 ? RED : "#F4EFE6", big: i === nameLines.length - 1 }, l))) });
    // Solo Leveling set pieces (our own drawings)
    L.statue = (p, x, y, s, at) => { const g = el("g", {}, p), S = (v) => v * s;
      I.fill(g, el("path", { d: `M${x - S(260)},${y} L${x - S(200)},${y - S(380)} Q${x},${y - S(440)} ${x + S(200)},${y - S(380)} L${x + S(260)},${y} Z`, fill: "#A9A39A", stroke: INKC, "stroke-width": 7, opacity: 0 }), at, 0.3, { sound: "slap" });
      I.fill(g, el("circle", { cx: x, cy: y - S(560), r: S(170), fill: "#B7B1A8", stroke: INKC, "stroke-width": 7, opacity: 0 }), at + 0.15, 0.3, { sound: false });
      I.path(g, `M${x - S(110)},${y - S(500)} Q${x},${y - S(420)} ${x + S(110)},${y - S(500)}`, at + 0.4, 0.3, { w: 8 });
      for (let i = -3; i <= 3; i++) I.path(g, `M${x + S(i * 28)},${y - S(492 - Math.abs(i) * 6)} l0,${S(26)}`, at + 0.6, 0.1, { w: 4, silent: true });
      I.path(g, `M${x - S(150)},${y - S(330)} q${S(-60)},${S(120)} ${S(-30)},${S(240)} M${x + S(150)},${y - S(330)} q${S(60)},${S(120)} ${S(30)},${S(240)}`, at + 0.3, 0.4, { w: 6, color: "#6B6359", silent: true });
      const eyes = el("g", { opacity: 0 }, g); [-1, 1].forEach((d) => { el("ellipse", { cx: x + d * S(65), cy: y - S(600), rx: S(38), ry: S(16), fill: "#FF3B2E", opacity: 0.35 }, eyes); el("ellipse", { cx: x + d * S(65), cy: y - S(600), rx: S(22), ry: S(9), fill: "#FF3B2E" }, eyes); });
      const plain = el("g", {}, g); [-1, 1].forEach((d) => el("path", { d: `M${x + d * S(40)},${y - S(600)} l${d * S(50)},0`, stroke: INKC, "stroke-width": 7, "stroke-linecap": "round" }, plain));
      return (t, onAt) => { const v = t >= onAt; eyes.setAttribute("opacity", v ? 1 : 0); plain.setAttribute("opacity", t >= at + 0.5 && !v ? 1 : 0); }; };
    L.centipede = (p, x, y, n, at, dir = 1) => { const g = el("g", {}, p); for (let i = 0; i < n; i++) { const cx = x + dir * i * 46, cy = y + Math.sin(i * 0.7) * 26;
        I.path(g, `M${cx},${cy + 18} l${-dir * 10},34 M${cx},${cy - 18} l${-dir * 10},-34`, at + i * 0.04, 0.1, { w: 5, color: "#5A2E1E", silent: true });
        I.fill(g, el("ellipse", { cx, cy, rx: 30, ry: 24, fill: i ? "#9C4A2A" : "#7A3420", stroke: INKC, "stroke-width": 5, opacity: 0 }), at + i * 0.04, 0.1, { sound: i ? false : "pop" }); }
      I.path(g, `M${x + dir * 18},${y - 14} l${dir * 30},-30 M${x + dir * 18},${y + 14} l${dir * 30},30`, at, 0.15, { w: 5, color: "#5A2E1E", silent: true }); return g; };
    L.dunes = (p, x0, x1, y, at) => { I.path(p, `M${x0},${y} q${(x1 - x0) / 6},-80 ${(x1 - x0) / 3},0 t${(x1 - x0) / 3},0 t${(x1 - x0) / 3},0`, at, 0.6, { w: 7, color: "#B08A4A" });
      I.path(p, `M${x0 + 60},${y + 70} q${(x1 - x0) / 5},-50 ${(x1 - x0) / 2.5},0 t${(x1 - x0) / 2.5},0`, at + 0.2, 0.5, { w: 5, color: "#C9A66B", silent: true }); };
    L.bed = (p, x, y, at) => { I.path(p, `M${x - 260},${y} v-160 M${x + 260},${y} v-110 M${x - 260},${y - 60} h520`, at, 0.4, { w: 8 }); L.rect(p, x - 250, y - 120, 500, 60, at + 0.2, "#FFFDF6", { rx: 12, sound: false }); L.rect(p, x - 240, y - 150, 120, 40, at + 0.3, "#E8EEF5", { rx: 16, sound: false }); };
    L.calendar = (p, x, y, cols, rows, cw, at, marks = []) => { I.path(p, `M${x},${y} h${cols * cw} v${rows * cw} h${-cols * cw} z`, at, 0.4, { w: 7 });
      for (let c = 1; c < cols; c++) I.path(p, `M${x + c * cw},${y} v${rows * cw}`, at + 0.2 + c * 0.02, 0.12, { w: 3, silent: true });
      for (let r = 1; r < rows; r++) I.path(p, `M${x},${y + r * cw} h${cols * cw}`, at + 0.25 + r * 0.02, 0.12, { w: 3, silent: true });
      marks.forEach(([i, t, col]) => { const c = i % cols, r = Math.floor(i / cols), a = x + c * cw + cw * 0.2, b = y + r * cw + cw * 0.2, w = cw * 0.6;
        I.path(p, `M${a},${b} l${w},${w} M${a + w},${b} l${-w},${w}`, t, 0.12, { w: 7, color: col || RED, silent: i % 3 > 0 }); }); };
    // ---- character-highlight helpers (long-form and Shorts)
    // name plate: black slanted plate with the character's name or epithet in yellow, optional handwritten sub line
    L.plate = (p, x, y, name, at, o = {}) => { const fs = o.size || 56, W2 = name.length * fs * 0.52 + 64, g = el("g", { opacity: 0 }, p); el("path", { d: `M${x - W2 / 2 + 12},${y - fs * 0.8} H${x + W2 / 2 + 14} L${x + W2 / 2 - 12},${y + fs * 0.42} H${x - W2 / 2 - 14} Z`, fill: "#0D0D0D", stroke: "#F2C230", "stroke-width": 5, "stroke-linejoin": "round" }, g);
      const e = el("text", { x, y, "text-anchor": "middle", "font-family": "Anton", "font-size": fs, fill: "#F2C230", "letter-spacing": 3 }, g); e.textContent = name;
      if (o.sub) { const s2 = el("text", { x, y: y + fs * 1.25, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": fs * 0.86, fill: INKC }, g); s2.textContent = o.sub; }
      I.fill(p, g, at, 0.15, { sound: "slap" }); return g; };
    // manga burst behind a character; returns an updater that turns it slowly
    L.burst = (p, cx, cy, r0, r1, at, o = {}) => { const n = o.n || 22, g = el("g", { opacity: 0 }, p), gi = el("g", {}, g); for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, w = (Math.PI / n) * (i % 2 ? 0.5 : 0.85), q = (r, d) => `${(cx + Math.cos(a + d) * r).toFixed(1)},${(cy + Math.sin(a + d) * r).toFixed(1)}`; el("path", { d: `M${q(r0, 0)} L${q(r1, -w / 2)} L${q(r1, w / 2)} Z`, fill: o.col || "#F2C230" }, gi); }
      I.fill(p, g, at, 0.2, { sound: false }); g.setAttribute("data-op", o.op ?? 0.34); return (t) => { gi.setAttribute("transform", `rotate(${(t * 6).toFixed(2)} ${cx} ${cy})`); gi.setAttribute("opacity", o.op ?? 0.34); }; };
    // flame-shaped energy aura behind a character; returns { g, update(t) }; visible between on and off
    L.aura = (p, cx, fy, w, h, col, on, off = 1e9) => { const g = el("g", { opacity: 0 }, p), fl = (ww, hh) => `M${cx - ww / 2},${fy} Q${cx - ww * 0.72},${fy - hh * 0.5} ${cx - ww * 0.26},${fy - hh * 0.74} Q${cx - ww * 0.3},${fy - hh * 0.95} ${cx},${fy - hh} Q${cx + ww * 0.3},${fy - hh * 0.95} ${cx + ww * 0.26},${fy - hh * 0.74} Q${cx + ww * 0.72},${fy - hh * 0.5} ${cx + ww / 2},${fy} Z`;
      el("path", { d: fl(w, h), fill: col, opacity: 0.42 }, g); el("path", { d: fl(w * 0.72, h * 0.86), fill: "#FFFFFF", opacity: 0.4 }, g);
      return { g, update: (t) => { const v = t >= on && t < off, k = clamp((t - on) / 0.25, 0, 1); g.setAttribute("opacity", v ? k : 0); if (v) g.setAttribute("transform", `translate(${cx},${fy}) scale(${(1 + 0.05 * Math.sin(t * 13)).toFixed(3)},${(0.9 + 0.1 * k + 0.07 * Math.sin(t * 17 + 1)).toFixed(3)}) translate(${-cx},${-fy})`); } }; };
    return L;
  };
})();
