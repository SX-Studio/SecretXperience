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
    return L;
  };
})();
