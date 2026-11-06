/* Ep7 2D sets (Crumb Island, flat illustrated, warm palette). Each builder(back, front) draws into a back layer (behind the cast)
   and a front layer (counters, boat hull, window frames in front of the cast) and returns { update(t, mood) }. mood 0 grey .. 1 warm. */
(function () {
  const SR = window.SR, { el, clamp, lerp } = SR, K = window.K7, INK = "#1E1B22";
  const S = (window.SETS7 = {});
  const R = (p, x, y, w, h, fill, o = {}) => el("rect", Object.assign({ x, y, width: w, height: h, fill, stroke: o.stroke === undefined ? INK : o.stroke, "stroke-width": o.sw ?? 5, rx: o.rx || 0 }, o.a || {}), p);
  const P = (p, d, fill, o = {}) => el("path", Object.assign({ d, fill, stroke: o.stroke === undefined ? INK : o.stroke, "stroke-width": o.sw ?? 5, "stroke-linejoin": "round", "stroke-linecap": "round" }, o.a || {}), p);
  const C = (p, cx, cy, r, fill, o = {}) => el("circle", Object.assign({ cx, cy, r, fill, stroke: o.stroke === undefined ? INK : o.stroke, "stroke-width": o.sw ?? 5 }, o.a || {}), p);
  const sky = (p, top, bot, id) => { const gr = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, p.ownerSVGElement.querySelector("defs")); const a = el("stop", { offset: 0, "stop-color": top }, gr), b = el("stop", { offset: 1, "stop-color": bot }, gr);
    R(p, -600, -400, 3120, 1500, `url(#${id})`, { stroke: "none" }); return { a, b }; };
  const house = (p, x, w, h, wall, roof, seed) => { const g = el("g", {}, p), y = 820 - h; R(g, x, y, w, h, wall); P(g, `M${x - 14},${y + 4} L${x + w / 2},${y - 70} L${x + w + 14},${y + 4} Z`, roof);
    const rnd = SR.mulberry32(seed); const cols = Math.max(1, Math.floor(w / 110));
    for (let r = 0; r < Math.floor((h - 150) / 120) + 1; r++) for (let c = 0; c < cols; c++) { const wx = x + 30 + c * ((w - 60) / cols) + ((w - 60) / cols - 60) / 2, wy = y + 40 + r * 120;
      R(g, wx, wy, 60, 74, rnd() < 0.3 ? "#FFE7A0" : "#9FD3EA", { rx: 6, sw: 4 }); P(g, `M${wx + 30},${wy} L${wx + 30},${wy + 74} M${wx},${wy + 37} L${wx + 60},${wy + 37}`, "none", { sw: 3 });
      if (rnd() < 0.5) R(g, wx - 6, wy + 74, 72, 14, "#D8774A", { sw: 4, rx: 4 }); }
    R(g, x + w / 2 - 34, 820 - 130, 68, 130, SR.shade(roof, -0.2), { rx: 30 }); C(g, x + w / 2 + 18, 820 - 64, 4, "#FFC93C", { sw: 2 }); return g; };
  const cobbles = (p, y0, y1, base) => { R(p, -600, y0, 3120, y1 - y0 + 400, base, { stroke: "none" }); const rnd = SR.mulberry32(77);
    for (let i = 0; i < 260; i++) { const x = -600 + rnd() * 3120, y = y0 + 20 + rnd() * (y1 - y0 + 250); el("ellipse", { cx: x, cy: y, rx: 26 + rnd() * 18, ry: 9 + rnd() * 5, fill: SR.shade(base, -0.06 - rnd() * 0.06), opacity: 0.8 }, p); } };
  const bunting = (p, x0, x1, y, sag, seed) => { const g = el("g", {}, p); P(g, `M${x0},${y} Q${(x0 + x1) / 2},${y + sag * 2} ${x1},${y}`, "none", { sw: 3 }); const flags = [], cols = ["#E8634A", "#FFC93C", "#3FA7A0", "#6C5CE7", "#F2EDE4"];
    for (let i = 1; i < 18; i++) { const u = i / 18, x = lerp(x0, x1, u), yy = y + 4 * sag * u * (1 - u) * 2 * 0.5 * 2; const f = P(g, "M-16,0 L16,0 L0,34 Z", cols[(i + seed) % 5], { sw: 3 }); flags.push([f, x, yy, i]); }
    return (t) => flags.forEach(([f, x, yy, i]) => f.setAttribute("transform", `translate(${x},${yy}) rotate(${(Math.sin(t * 2.4 + i) * 7).toFixed(2)})`)); };
  const plant = (p, x, y, k = 1) => { const g = el("g", { transform: `translate(${x},${y}) scale(${k})` }, p); [[-30], [10], [40], [-60]].forEach(([a]) => P(g, `M0,0 q-10,-80 ${a},-150 q20,60 ${-a / 3},150`, "#5E9E5A", { sw: 4 }));
    P(g, "M-40,0 L-30,90 L30,90 L40,0 Z", "#D8774A"); return g; };

  // ---------------- SQUARE ----------------
  S.square = (back, front) => { const sk = sky(back, "#7EC8F2", "#DDF2FF", "sq-sky");
    R(back, -600, 520, 3120, 80, "#5FB2D8", { stroke: "none" });
    [[-560, 300, 330, "#F2C14E", "#C8553D"], [-250, 280, 400, "#9FD8C8", "#3A6F8F"], [40, 330, 360, "#F4A6A0", "#7A4E32"], [380, 300, 430, "#FFF1D6", "#2F6F73"], [1180, 320, 390, "#CDB6E8", "#C8553D"], [1510, 300, 350, "#F2C14E", "#3A6F8F"], [1820, 330, 420, "#9FD8C8", "#7A4E32"], [2160, 300, 360, "#F4A6A0", "#2F6F73"]]
      .forEach(([x, w, h, c, r], i) => house(back, x, w, h, c, r, i + 3));
    // café awning between
    const aw = el("g", {}, back); R(aw, 700, 470, 460, 350, "#FFF6E3"); for (let i = 0; i < 8; i++) P(aw, `M${700 + i * 57.5},440 L${757.5 + i * 57.5},440 L${757.5 + i * 57.5},500 Q${728 + i * 57.5},530 ${700 + i * 57.5},500 Z`, i % 2 ? "#FFFFFF" : "#E8634A", { sw: 4 });
    R(aw, 760, 560, 340, 160, "#9FD3EA", { rx: 8 }); el("text", { x: 930, y: 425, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 40, fill: INK }, aw).textContent = "CRUMB CAFÉ";
    cobbles(back, 820, 1080, "#E2CDA8"); R(back, -600, 812, 3120, 16, "#B99A72", { stroke: "none" });
    const fl1 = bunting(back, -500, 700, 300, 60, 0), fl2 = bunting(back, 1160, 2400, 290, 60, 2);
    // fountain
    const fo = el("g", {}, back); el("ellipse", { cx: 960, cy: 860, rx: 240, ry: 46, fill: "#9DB4C0", stroke: INK, "stroke-width": 5 }, fo); R(fo, 720, 860, 480, 60, "#B9C7CF", { a: { rx: 0 } }); el("ellipse", { cx: 960, cy: 920, rx: 240, ry: 40, fill: "#9DB4C0", stroke: INK, "stroke-width": 5, opacity: 0 }, fo);
    el("ellipse", { cx: 960, cy: 860, rx: 210, ry: 34, fill: "#7EC8F2", stroke: "none" }, fo); R(fo, 935, 720, 50, 140, "#B9C7CF", { rx: 10 }); el("ellipse", { cx: 960, cy: 720, rx: 80, ry: 18, fill: "#9DB4C0", stroke: INK, "stroke-width": 5 }, fo);
    const jets = [-1, 1].map(() => P(fo, "", "none", { stroke: "#BFE8FF", sw: 8, a: { opacity: 0.9 } }));
    [[-200], [2150]].forEach(([x]) => { R(back, x, 520, 16, 300, "#3B3446", { sw: 3 }); C(back, x + 8, 510, 26, "#FFE7A0", { sw: 4 }); });
    plant(front, -300, 940, 1.1); plant(front, 2230, 940, 1.1);
    return { sk, update(t, m = 1) { fl1(t); fl2(t); jets.forEach((j, i) => { const s = i ? 1 : -1, h = 70 + Math.sin(t * 3 + i) * 6; j.setAttribute("d", `M960,705 Q${960 + s * 70},${705 - h} ${960 + s * 150},850`); });
      sk.a.setAttribute("stop-color", K.mix("#8E9AAB", "#7EC8F2", m)); sk.b.setAttribute("stop-color", K.mix("#C9CED8", "#DDF2FF", m)); } }; };

  // ---------------- BEDROOM (morning) ----------------
  S.bedroom = (back, front) => { R(back, -600, -400, 3120, 1500, "#F3D9C4", { stroke: "none" }); R(back, -600, 820, 3120, 400, "#C99A6E", { stroke: "none" });
    const win = el("g", {}, back); const sg = sky(win, "#FFD9A0", "#FFF3D6", "bd-sky"); win.querySelector("rect").setAttribute("x", 1080); win.querySelector("rect").setAttribute("y", 200); win.querySelector("rect").setAttribute("width", 560); win.querySelector("rect").setAttribute("height", 440);
    const sun = C(win, 1460, 330, 60, "#FFD84A", { sw: 0, stroke: "none" }); R(win, 1080, 200, 560, 440, "none", { sw: 22, stroke: "#8E6440" }); P(win, "M1360,200 L1360,640 M1080,420 L1640,420", "none", { sw: 14, stroke: "#8E6440" });
    const rays = el("path", { d: "M1100,640 L700,1080 L1300,1080 L1640,640 Z", fill: "#FFF3C4", opacity: 0.45 }, back);
    R(back, 200, 300, 260, 340, "#9FD8C8", { rx: 6 }); C(back, 330, 430, 70, "#FFC93C", { sw: 5 }); el("text", { x: 330, y: 590, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 34, fill: INK }, back).textContent = "CRUMB IS.";
    // bed (front: blanket over legs)
    R(back, 360, 640, 70, 220, "#8E6440", { rx: 10 }); R(back, 380, 700, 760, 130, "#B07448", { rx: 14 }); R(back, 400, 640, 200, 90, "#FFFFFF", { rx: 30 });
    const bl = el("g", {}, front); P(bl, "M560,720 Q900,690 1160,720 L1170,840 Q860,880 540,840 Z", "#6C5CE7"); P(bl, "M600,760 Q860,740 1120,760", "none", { sw: 3, stroke: "#4E3FC0" });
    R(back, 1240, 690, 160, 150, "#8E6440", { rx: 8 }); R(back, 1270, 640, 60, 50, "#F2EDE4", { rx: 10 }); C(back, 1300, 630, 20, "#FFC93C", { sw: 4 });
    return { update(t, m = 1) { rays.setAttribute("opacity", (0.35 + 0.1 * Math.sin(t * 1.5)).toFixed(3)); } }; };

  // ---------------- STREET ----------------
  S.street = (back, front) => { const sk = sky(back, "#8FD3FF", "#E6F6FF", "st-sky");
    [[-560, 420, 520, "#F4A6A0", "#7A4E32"], [-120, 380, 460, "#FFF1D6", "#2F6F73"], [280, 440, 560, "#9FD8C8", "#C8553D"], [740, 400, 500, "#F2C14E", "#3A6F8F"], [1160, 420, 540, "#CDB6E8", "#7A4E32"], [1600, 380, 480, "#F4A6A0", "#2F6F73"], [2000, 440, 520, "#FFF1D6", "#C8553D"]]
      .forEach(([x, w, h, c, r], i) => house(back, x, w, h, c, r, 40 + i));
    R(back, -600, 820, 3120, 60, "#C9B79A", { stroke: "none" }); cobbles(back, 880, 1080, "#E2CDA8"); R(back, -600, 872, 3120, 12, "#9C8566", { stroke: "none" });
    R(back, 1500, 470, 18, 360, "#3B3446", { sw: 3 }); C(back, 1509, 460, 28, "#FFE7A0", { sw: 4 }); plant(back, 640, 830, 0.8); plant(back, 1880, 830, 0.8);
    return { update() {} }; };

  // ---------------- BAKERY ----------------
  S.bakery = (back, front) => { R(back, -600, -400, 3120, 1500, "#F6E3C6", { stroke: "none" });
    for (let i = 0; i < 40; i++) for (let j = 0; j < 4; j++) R(back, -600 + i * 80 + (j % 2) * 40, 560 + j * 40, 80, 40, "#FFFFFF", { sw: 2, stroke: "#E2CDA8" });
    [[200, 260], [200, 420]].forEach(([x, y]) => { R(back, x - 40, y, 1700, 22, "#8E6440", { sw: 4 }); for (let k = 0; k < 14; k++) { const lx = x + k * 120; el("ellipse", { cx: lx, cy: y - 26, rx: 46, ry: 26, fill: k % 3 ? "#E8B06A" : "#C98B5E", stroke: INK, "stroke-width": 4 }, back); P(back, `M${lx - 24},${y - 36} l14,14 M${lx - 4},${y - 40} l14,14 M${lx + 16},${y - 36} l12,12`, "none", { sw: 3 }); } });
    const board = el("g", {}, back); R(board, 1500, 470, 330, 260, "#2E3A34", { sw: 8, stroke: "#8E6440", rx: 6 });
    ["FRESH", "ROLLS", "TODAY!"].forEach((s, i) => el("text", { x: 1665, y: 540 + i * 70, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 56, fill: i === 2 ? "#FFC93C" : "#F4EEE2" }, board).textContent = s);
    R(back, -600, 900, 3120, 300, "#C99A6E", { stroke: "none" });
    // counter in front of Bea
    const c = el("g", {}, front); R(c, -100, 700, 1500, 380, "#C9875A"); R(c, -120, 680, 1540, 40, "#7A4E32", { rx: 10 }); R(c, 60, 740, 600, 200, "#DFF3FF", { rx: 10, a: { opacity: 0.85 } });
    for (let k = 0; k < 5; k++) el("ellipse", { cx: 130 + k * 115, cy: 900, rx: 46, ry: 24, fill: "#E8B06A", stroke: INK, "stroke-width": 4 }, c);
    for (let k = 0; k < 4; k++) el("ellipse", { cx: 180 + k * 120, cy: 830, rx: 40, ry: 22, fill: "#F2C14E", stroke: INK, "stroke-width": 4 }, c);
    const steam = [0, 1, 2].map((i) => P(front, "", "none", { stroke: "#FFFFFF", sw: 6, a: { opacity: 0.7 } }));
    return { update(t) { steam.forEach((s, i) => { const ph = (t * 0.5 + i / 3) % 1, x = 260 + i * 160, y = 760 - ph * 140; s.setAttribute("d", `M${x},${y} q14,-20 0,-40 q-14,-20 0,-40`); s.setAttribute("opacity", (Math.sin(ph * Math.PI) * 0.7).toFixed(3)); }); } }; };

  // ---------------- HARBOUR (drizzle) ----------------
  S.harbour = (back, front) => { const sk = sky(back, "#A9B4C2", "#DCE3EA", "hb-sky");
    P(back, "M1500,520 L1530,330 L1570,330 L1600,520 Z", "#F2EDE4"); R(back, 1520, 300, 60, 40, "#E8634A"); P(back, "M-600,560 Q-300,470 0,540 Q200,480 500,560 L500,600 L-600,600 Z", "#7FA88A", { sw: 4 });
    const sea = el("g", {}, back); R(sea, -600, 520, 3120, 700, "#4E8FB0", { stroke: "none" });
    const waves = [0, 1, 2, 3, 4].map((i) => P(sea, "", "none", { stroke: "#9FD3EA", sw: 5, a: { opacity: 0.7 } }));
    R(back, 1300, 760, 900, 40, "#8E6440"); for (let i = 0; i < 6; i++) R(back, 1330 + i * 150, 790, 26, 300, "#6B4A34", { sw: 4 });
    const boat = el("g", {}, front), hull = el("g", {}, boat); P(hull, "M180,780 L1180,780 Q1140,960 980,980 L340,980 Q200,960 180,780 Z", "#E8634A"); R(hull, 170, 760, 1020, 36, "#FFF6E3", { rx: 12 });
    el("text", { x: 680, y: 900, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 60, fill: "#FFF6E3" }, hull).textContent = "THE GIGGLING COD";
    const fg = el("g", {}, front), fw = [0, 1].map(() => P(fg, "", "#3E7FA0", { sw: 4 }));
    const drizzle = el("g", {}, front), dl = Array.from({ length: 60 }, () => el("line", { stroke: "#E6EEF6", "stroke-width": 3, opacity: 0.55 }, drizzle)), rr = SR.mulberry32(9).bind(null);
    const seeds = dl.map(() => [rr(), rr(), rr()]);
    return { boat, update(t) { const b = Math.sin(t * 1.6) * 8, r = Math.sin(t * 1.3) * 1.5; boat.setAttribute("transform", `translate(0,${b.toFixed(2)}) rotate(${r.toFixed(2)},680,860)`); boat.__bob = b;
      waves.forEach((w, i) => { const y = 600 + i * 90, ph = t * (0.6 + i * 0.1) * 60; let d = `M-600,${y}`; for (let x = -600; x <= 2520; x += 80) d += ` Q${x + 40},${y - 10 + Math.sin((x + ph) / 90) * 4} ${x + 80},${y}`; w.setAttribute("d", d); });
      fw.forEach((w, i) => { const y = 1000 + i * 40; let d = `M-600,${y}`; for (let x = -600; x <= 2520; x += 120) d += ` Q${x + 60},${y - 26 + Math.sin((x + t * 80 * (i ? -1 : 1)) / 70) * 10} ${x + 120},${y}`; d += " L2520,1300 L-600,1300 Z"; w.setAttribute("d", d); w.setAttribute("fill", i ? "#2F6F90" : "#3E7FA0"); });
      dl.forEach((l, i) => { const [a, bb, c] = seeds[i], y = ((bb * 1200 + t * (500 + c * 300)) % 1200) - 100, x = a * 2600 - 400 + y * 0.15; l.setAttribute("x1", x.toFixed(1)); l.setAttribute("y1", y.toFixed(1)); l.setAttribute("x2", (x + 5).toFixed(1)); l.setAttribute("y2", (y + 30).toFixed(1)); }); } }; };

  // ---------------- BUILDING SITE ----------------
  S.site = (back, front) => { const sk = sky(back, "#8E9AAB", "#C9CED8", "si-sky");
    const fr = el("g", {}, back); for (let i = 0; i < 6; i++) R(fr, 300 + i * 220, 160, 22, 680, "#C8553D", { sw: 4 }); for (let j = 0; j < 4; j++) R(fr, 290, 180 + j * 170, 1130, 22, "#C8553D", { sw: 4 });
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) P(fr, `M${322 + i * 220},${202 + j * 170} L${520 + i * 220},${350 + j * 170}`, "none", { sw: 4, stroke: "#8E3A2A" });
    R(back, -600, 830, 3120, 400, "#B9A07A", { stroke: "none" }); for (let i = 0; i < 4; i++) for (let j = 0; j < 6 - i; j++) R(back, 1500 + j * 70 + i * 35, 790 - i * 36, 70, 36, "#C8553D", { sw: 3 });
    [[200, 860], [1780, 880]].forEach(([x, y]) => { P(front, `M${x - 40},${y + 60} L${x},${y - 60} L${x + 40},${y + 60} Z`, "#FF8A2A"); R(front, x - 22, y - 10, 44, 16, "#FFFFFF", { sw: 2 }); });
    const mixer = el("g", {}, back); C(mixer, 1300, 760, 70, "#FFC93C"); R(mixer, 1230, 800, 140, 60, "#3B3446"); C(mixer, 1250, 870, 22, "#3B3446"); C(mixer, 1350, 870, 22, "#3B3446");
    return { update(t) { mixer.querySelector("circle").setAttribute("transform", `rotate(${(t * 40) % 360},1300,760)`); } }; };

  // ---------------- PARK BENCH (dusk) ----------------
  S.bench = (back, front) => { const sk = sky(back, "#E8A07A", "#F6D6B0", "bn-sky");
    C(back, 1400, 560, 90, "#FFD08A", { stroke: "none" }); R(back, -600, 600, 3120, 600, "#7FA88A", { stroke: "none" }); P(back, "M-600,640 Q200,560 900,630 Q1500,690 2520,600 L2520,700 L-600,700 Z", "#6F987A", { stroke: "none" });
    const tree = el("g", {}, back); R(tree, 280, 300, 60, 560, "#7A4E32"); C(tree, 310, 280, 200, "#5E9E5A"); C(tree, 160, 360, 130, "#6FAE6A"); C(tree, 470, 350, 140, "#6FAE6A");
    const bench = el("g", {}, back); R(bench, 620, 640, 700, 26, "#8E6440", { rx: 8 }); R(bench, 620, 680, 700, 26, "#8E6440", { rx: 8 }); R(bench, 600, 770, 740, 30, "#A97C52", { rx: 8 }); R(bench, 640, 800, 22, 90, "#3B3446"); R(bench, 1280, 800, 22, 90, "#3B3446");
    const lamp = el("g", {}, back); R(lamp, 1620, 360, 18, 520, "#3B3446"); C(lamp, 1629, 350, 30, "#FFE7A0");
    return { update() {} }; };

  // ---------------- CAFÉ (Ana, S06-S07) ----------------
  S.cafe = (back, front) => { const wall = R(back, -600, -400, 3120, 1300, "#E9D9BE", { stroke: "none" });
    R(back, -600, 760, 3120, 600, "#B98A5E", { stroke: "none" }); R(back, -600, 752, 3120, 16, "#8E6440", { stroke: "none" });
    for (let i = 0; i < 16; i++) el("line", { x1: -600 + i * 200, y1: 768, x2: -720 + i * 230, y2: 1300, stroke: "#A97C52", "stroke-width": 4 }, back);
    const win = el("g", { transform: "translate(1180,120)" }, back), skyR = R(win, 0, 0, 520, 400, "#8C98A8", { stroke: "none" }), sun = C(win, 380, 110, 54, "#FFD84A", { stroke: "none", a: { opacity: 0 } });
    const clouds = P(win, "M40,190 C20,190 20,160 46,160 C50,130 96,126 108,150 C120,124 170,130 168,160 C196,158 200,190 176,190 Z M250,120 C232,120 232,96 254,96 C258,72 296,70 306,92 C318,70 360,76 356,100 C380,100 382,120 362,120 Z", "#6E7686", { stroke: "none" });
    R(win, 0, 0, 520, 400, "none", { sw: 22, stroke: "#6B4A34" }); P(win, "M260,0 L260,400 M0,200 L520,200", "none", { sw: 14, stroke: "#6B4A34" }); R(win, -20, 400, 560, 26, "#8E6440", { rx: 6, stroke: "none" });
    R(back, 120, 470, 360, 300, "#C9875A", { rx: 10 }); R(back, 100, 450, 400, 34, "#7A4E32", { rx: 8 }); C(back, 200, 430, 22, "#F2EDE4", { sw: 4 }); C(back, 300, 430, 22, "#F2EDE4", { sw: 4 });
    const tb = el("g", {}, back); el("ellipse", { cx: 960, cy: 760, rx: 140, ry: 22, fill: "#8E6440", stroke: INK, "stroke-width": 5 }, tb); R(tb, 950, 760, 20, 130, "#3B3446"); R(tb, 910, 728, 34, 32, "#FFFFFF", { rx: 6, sw: 4 }); R(tb, 990, 728, 34, 32, "#FFFFFF", { rx: 6, sw: 4 });
    plant(back, 1840, 760, 1);
    return { update(t, m = 0) { skyR.setAttribute("fill", K.mix("#7E8898", "#8FD3FF", m)); clouds.setAttribute("opacity", (1 - m * 0.85).toFixed(3)); clouds.setAttribute("fill", K.mix("#5E6676", "#FFFFFF", m)); sun.setAttribute("opacity", K.sm(0.7, 1, m).toFixed(3)); wall.setAttribute("fill", K.mix("#C9C2B8", "#F2DDB8", m)); } }; };

  // ---------------- REFLECTION (window glass close-up) ----------------
  S.reflect = (back, front) => { R(back, -600, -400, 3120, 1500, "#6B4A34", { stroke: "none" });
    const glass = el("g", {}, back), sk = sky(glass, "#9FD3EA", "#E6F6FF", "rf-sky"); const gr = glass.querySelector("rect"); gr.setAttribute("x", 260); gr.setAttribute("y", 60); gr.setAttribute("width", 1400); gr.setAttribute("height", 960);
    [[240, 440, 500, "#F4A6A0"], [700, 380, 460, "#FFF1D6"], [1100, 460, 520, "#9FD8C8"]].forEach(([x, w, h, c]) => R(glass, x + 60, 1020 - h, w, h, c, { a: { opacity: 0.55 }, sw: 3 }));
    const sheen = el("g", {}, front); P(sheen, "M300,1020 L700,60 L820,60 L420,1020 Z", "#FFFFFF", { stroke: "none", a: { opacity: 0.16 } }); P(sheen, "M1300,1020 L1600,300 L1640,300 L1340,1020 Z", "#FFFFFF", { stroke: "none", a: { opacity: 0.12 } });
    R(front, 260, 60, 1400, 960, "none", { sw: 40, stroke: "#6B4A34" });
    return { update() {} }; };

  // ---------------- HOST (Nia's spot: island at golden hour) ----------------
  S.host = (back, front) => { const sk = sky(back, "#FFB37A", "#FFE3B8", "ho-sky");
    C(back, 1450, 600, 120, "#FFD84A", { stroke: "none", a: { opacity: 0.9 } }); R(back, -600, 620, 3120, 600, "#5FA0C8", { stroke: "none" });
    P(back, "M900,650 Q1100,480 1300,560 Q1500,470 1750,640 Z", "#7FA88A", { sw: 4 }); [1200, 1350, 1500].forEach((x, i) => R(back, x, 560 + i * 8, 46, 46, ["#F4A6A0", "#F2C14E", "#9FD8C8"][i], { sw: 3 }));
    const glitter = Array.from({ length: 16 }, (_, i) => el("rect", { x: 1300 + (i % 8) * 40 - 140, y: 680 + Math.floor(i / 8) * 40, width: 26, height: 5, rx: 2, fill: "#FFE7A0" }, back));
    R(back, -600, 860, 3120, 400, "#E2CDA8", { stroke: "none" }); plant(back, 1720, 870, 1.1);
    return { update(t) { glitter.forEach((g, i) => g.setAttribute("opacity", (0.3 + 0.7 * Math.abs(Math.sin(t * 1.4 + i))).toFixed(2))); } }; };

  // ---------------- CLASSROOM chalkboard (study 1: the guess vs reality) ----------------
  S.chalk = (back, front) => { R(back, -600, -400, 3120, 1500, "#F2E6D0", { stroke: "none" }); R(back, 160, 90, 1600, 860, "#2E4A3E", { sw: 14, stroke: "#8E6440", rx: 10 });
    const T = (x, y, s, fs, fill = "#F4EEE2", anchor = "middle") => { const e = el("text", { x, y, "text-anchor": anchor, "font-family": "Outfit", "font-weight": 900, "font-size": fs, fill }, back); e.textContent = s; return e; };
    T(960, 200, "HOW MANY CLASSMATES HAD A HARD TIME?", 54);
    const guess = el("g", {}, back), real = el("g", {}, back);
    const gB = R(guess, 480, 0, 300, 0, "#FFC93C", { sw: 6, stroke: "#F4EEE2" }), rB = R(real, 1140, 0, 300, 0, "#7EC8F2", { sw: 6, stroke: "#F4EEE2" });
    
    const low = el("g", {}, back); T(630, 0, "TOO LOW", 50, "#FF8A7A").setAttribute("id", "toolow"); low.appendChild(back.querySelector("#toolow"));
    const lonely = el("g", {}, back); T(960, 980, "", 1);
    return { update(t, m = 0, k = { g: 0, r: 0, low: 0 }) { const gh = 520 * 0.55 * K.back(k.g), rh = 520 * K.back(k.r);
      gB.setAttribute("y", 830 - gh); gB.setAttribute("height", Math.max(0, gh)); rB.setAttribute("y", 830 - rh); rB.setAttribute("height", Math.max(0, rh));
      const tl = low.querySelector("text"); tl.setAttribute("y", 830 - gh - 30); low.setAttribute("opacity", k.low.toFixed(3)); gB.setAttribute("opacity", 0); rB.setAttribute("opacity", 0); low.setAttribute("opacity", 0); } }; };

  // ---------------- HIDDEN (study 1A: 40% of bad moments hidden vs 13% of good) ----------------
  S.hidden = (back, front) => { R(back, -600, -400, 3120, 1500, "#2B2140", { stroke: "none" });
    const T = (x, y, s, fs, fill = "#FFFFFF") => { const e = el("text", { x, y, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": fs, fill }, back); e.textContent = s; return e; };
    T(500, 170, "BAD MOMENTS", 54, "#9FB4E8"); T(1420, 170, "GOOD MOMENTS", 54, "#FFD84A");
    const icons = [], ws = [];
    for (let side = 0; side < 2; side++) for (let i = 0; i < 10; i++) { const x = (side ? 1420 : 500) + ((i % 5) - 2) * 150, y = 340 + Math.floor(i / 5) * 190, w = K.weather(back, { seed: i + side * 10 }); w.g.setAttribute("transform", `translate(${x},${y})`); ws.push([w, side, i]); }
    const curtains = [0, 1].map((side) => { const g = el("g", {}, back); return g; });
    const cov = [0, 1].map((side) => R(curtains[side], 0, 0, 0, 420, "#4A3A6A", { sw: 0, stroke: "none", a: { opacity: 0.94 } }));
    const pct = [T(500, 820, "40% HIDDEN", 80, "#FFFFFF"), T(1420, 820, "13% HIDDEN", 80, "#FFFFFF")];
    return { update(t, m, k = { show: 0, h: 0 }) { ws.forEach(([w, side, i]) => w.set(side ? 0 : 3, t, 1.25, clamp(k.show * 3 - i * 0.12, 0, 1)));
      // the hidden share is covered left-to-right: 40% of the bad tiles, 13% of the good ones
      [0.4, 0.13].forEach((f, side) => { const x0 = (side ? 1420 : 500) - 375, W = 750 * f * 2 * K.sm(0, 1, k.h); const r = cov[side]; r.setAttribute("x", (x0 + 750 - W / 2 * 0 - 750 + 0).toFixed(1)); r.setAttribute("x", x0.toFixed(1)); r.setAttribute("y", 230); r.setAttribute("width", Math.max(0, Math.min(750, W / 2)).toFixed(1)); });
      pct.forEach((p) => p.setAttribute("opacity", K.sm(0.5, 1, k.h).toFixed(3))); } }; };

  // ---------------- FEED (phone: sunny posts) ----------------
  S.feed = (back, front) => { R(back, -600, -400, 3120, 1500, "#CDB6E8", { stroke: "none" });
    const ph = el("g", {}, back); R(ph, 700, 40, 520, 1000, "#1E1B22", { rx: 60, sw: 0 }); const scr = el("clipPath", { id: "feedclip" }, back.ownerSVGElement.querySelector("defs")); R(scr, 730, 100, 460, 880, "#000", { rx: 24, sw: 0 });
    const list = el("g", { "clip-path": "url(#feedclip)" }, ph); R(list, 730, 100, 460, 880, "#FFFFFF", { sw: 0 });
    const col = el("g", {}, list), posts = [["BEST DAY EVER!! ☀", "#FFD84A"], ["Living my best life", "#8FD3FF"], ["So blessed 🌴", "#9FD8C8"], ["Never been happier", "#F4A6A0"], ["Perfect morning ☕", "#FFE7A0"], ["Grateful for everything", "#CDB6E8"]];
    posts.forEach(([s, c], i) => { const y = 120 + i * 330; R(col, 750, y, 420, 240, c, { rx: 18, sw: 4 }); C(col, 960, y + 110, 48, "#FFD84A", { sw: 4 }); P(col, `M${930},${y + 116} q30,26 60,0`, "none", { sw: 5 });
      C(col, 775, y + 270, 18, "#E3AE85", { sw: 3 }); el("text", { x: 805, y: y + 280, "font-family": "Nunito", "font-weight": 900, "font-size": 28, fill: INK }, col).textContent = s; P(col, `M${1130},${y + 262} c-8,-10 -22,0 -11,10 l11,10 l11,-10 c11,-10 -3,-20 -11,-10 Z`, "#FF5A7A", { sw: 3 }); });
    return { update(t, m, k = { scroll: 0 }) { col.setAttribute("transform", `translate(0,${(-k.scroll * 1300).toFixed(1)})`); } }; };
})();
