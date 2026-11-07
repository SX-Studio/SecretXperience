/* Ep7 remake sets (paper storybook). Each builder(L) gets layers { sky, mid, back, front } (all inside the camera) and returns { update(t, k) }.
   World units: 1920x1080 at camera z=1; ground line ~y 820-960. Horizon HZ per set is returned for depth placement (feet on ground plane). */
(function () {
  const SR = window.SR, { el, clamp, lerp } = SR, K = window.PK, S = (window.SETS = {});
  const R = (p, x, y, w, h, fill, rx = 0, o = {}) => el("rect", Object.assign({ x, y, width: w, height: h, fill, rx }, o), p);
  const P = (p, d, fill, o = {}) => el("path", Object.assign({ d, fill }, o), p);
  const C = (p, cx, cy, r, fill, o = {}) => el("circle", Object.assign({ cx, cy, r, fill }, o), p);
  const Lg = (p, big) => el("g", { filter: big ? "url(#pshadowL)" : "url(#pshadow)" }, p);
  const T = (p, x, y, s, fs, fill = "#3a2e2a", o = {}) => { const e = el("text", Object.assign({ x, y, "text-anchor": "middle", "font-family": "Fredoka", "font-weight": 700, "font-size": fs, fill }, o), p); e.textContent = s; return e; };
  const sky = (p, a = "#BFE3F2") => R(p, -1200, -800, 4320, 2000, a);
  const clouds = (p, seed, n = 9, y0 = 30, y1 = 320) => { const r = SR.mulberry32(seed), shapes = ["M0,40 C-50,40 -50,-20 0,-20 C10,-70 90,-80 110,-30 C150,-50 200,0 170,40 Z", "M0,30 C-40,30 -40,-10 0,-10 C20,-50 80,-50 90,-10 C130,-20 140,30 110,30 Z", "M0,24 C-30,24 -30,0 0,0 C10,-30 60,-30 70,0 C100,0 100,24 80,24 Z"];
    const cs = Array.from({ length: n }, (_, i) => { const g = Lg(p); g.setAttribute("opacity", (0.75 + r() * 0.25).toFixed(2)); P(g, shapes[i % 3], "#FFFFFF"); return [g, -800 + r() * 3500, y0 + r() * (y1 - y0), 0.35 + r() * 1.0, 5 + r() * 12]; });
    return (t) => cs.forEach(([g, x, y, k, sp]) => g.setAttribute("transform", `translate(${(x + ((t * sp) % 600) - 150).toFixed(1)},${y.toFixed(1)}) scale(${k.toFixed(2)})`)); };
  const house = (p, x, w, h, wall, roof, i, base = 820) => { const g = Lg(p, true); R(g, x, base - h, w, h, wall, 6); P(g, `M${x - 16},${base - h + 6} L${x + w / 2},${base - h - 80} L${x + w + 16},${base - h + 6} Z`, roof);
    const nc = Math.max(1, Math.floor(w / 110)), cw = (w - 52) / nc; for (let r = 0; r < Math.floor((h - 120) / 110) + 1; r++) for (let c = 0; c < nc; c++) R(g, x + 26 + c * cw + (cw - 56) / 2, base - h + 40 + r * 110, 56, 66, (r + c + i) % 3 ? "#9FD3EA" : "#FFE7A0", 8);
    R(g, x + w / 2 - 30, base - 120, 60, 120, "#8E6440", 26); return g; };
  const ground = (p, y, col, seed) => { const g = Lg(p, true); R(g, -1200, y, 4320, 900, col); const r = SR.mulberry32(seed); for (let i = 0; i < 140; i++) el("ellipse", { cx: -1200 + r() * 4320, cy: y + 30 + r() * 380, rx: 28 + r() * 20, ry: 9 + r() * 5, fill: SR.shade ? SR.shade(col, -0.06) : col, opacity: 0.55 }, g); return g; };
  const plant = (p, x, y, k = 1) => { const g = Lg(p); g.setAttribute("transform", `translate(${x},${y}) scale(${k})`); [-30, 10, 40, -60].forEach((a) => P(g, `M0,0 q-10,-80 ${a},-150 q20,60 ${-a / 3},150`, "#5E9E5A")); P(g, "M-40,0 L-30,90 L30,90 L40,0 Z", "#D8774A"); return g; };
  const box = (p, x, y, w = 120, h = 90, label = "") => { const g = Lg(p); R(g, x - w / 2, y - h, w, h, "#C9875A", 6); R(g, x - w / 2, y - h, w, 16, "#B77748", 4); R(g, x - 8, y - h, 16, h, "#D9A273", 2); if (label) T(g, x, y - h / 2 + 8, label, 18, "#3a2e2a"); return g; };
  S.box = box;

  // ---------- square: reuse paper-sets K.square ----------
  S.square = (L) => { const s = K.square(L.back, L.front, { sky: L.sky, mid: L.mid }); return { HZ: 600, update: (t, k) => s.update(t, k) }; };

  // ---------- bakery front with a big window (reflection) ----------
  S.bakeryFront = (L) => { sky(L.sky); const cl = clouds(L.sky, 21, 6);
    [[-700, 360, 420, "#F4A6A0", "#7A4E32"], [1500, 380, 450, "#CDB6E8", "#2F6F73"], [1900, 300, 380, "#9FD8C8", "#C8553D"]].forEach((h, i) => house(L.mid, ...h, i + 5));
    const shop = Lg(L.back, true); R(shop, -320, 180, 1800, 640, "#F6E3C6", 6); for (let i = 0; i < 12; i++) P(shop, `M${-320 + i * 150},150 L${-170 + i * 150},150 L${-170 + i * 150},230 Q${-245 + i * 150},270 ${-320 + i * 150},230 Z`, i % 2 ? "#FFFFFF" : "#F2C14E");
    T(shop, 580, 130, "BEA'S BAKERY", 64);
    const glass = Lg(L.back); R(glass, 120, 300, 1000, 470, "#BFE3F2", 12); const sheen = el("g", {}, L.back); P(sheen, "M200,770 L460,300 L560,300 L300,770 Z", "#FFFFFF", { opacity: 0.22 }); P(sheen, "M820,770 L1020,300 L1060,300 L860,770 Z", "#FFFFFF", { opacity: 0.16 });
    R(L.back, 120, 300, 1000, 470, "none", 12, { stroke: "#8E6440", "stroke-width": 24 }); for (let k = 0; k < 6; k++) el("ellipse", { cx: 220 + k * 160, cy: 740, rx: 60, ry: 30, fill: "#E8B06A" }, L.back);
    const reflG = el("g", { opacity: 0.0 }, L.back);   // a YOU silhouette reflection lives here (story sets opacity)
    ground(L.back, 820, "#E2CDA8", 7); plant(L.front, 1460, 900, 1);
    return { HZ: 560, reflG, update: (t) => cl(t) }; };

  // ---------- lighthouse steps above the town ----------
  S.lighthouse = (L) => { sky(L.sky, "#CFE8F2"); const cl = clouds(L.sky, 33, 8, 20, 260);
    const sea = Lg(L.sky); R(sea, -1200, 520, 4320, 600, "#7EC0DA");
    const town = el("g", { transform: "translate(0,40) scale(0.55)" }, L.mid); const pal = [["#F2C14E", "#C8553D"], ["#9FD8C8", "#3A6F8F"], ["#F4A6A0", "#7A4E32"], ["#FFF1D6", "#2F6F73"], ["#CDB6E8", "#C8553D"]];
    for (let i = 0; i < 14; i++) { const [w, r] = pal[i % 5]; house(town, -900 + i * 330, 260 + (i % 3) * 30, 300 + ((i * 53) % 160), w, r, i, 1500); }
    const hill = Lg(L.mid, true); P(hill, "M-1200,900 Q-200,760 700,860 Q1400,940 3100,800 L3100,1400 L-1200,1400 Z", "#9CC48A");
    const lh = Lg(L.back, true); P(lh, "M1560,880 L1600,300 L1720,300 L1760,880 Z", "#FFF6E3"); R(lh, 1580, 420, 160, 50, "#E8634A"); R(lh, 1570, 600, 180, 50, "#E8634A"); P(lh, "M1580,300 L1660,220 L1740,300 Z", "#3A6F8F"); C(lh, 1660, 270, 22, "#FFE27A");
    const steps = Lg(L.back, true); for (let i = 0; i < 9; i++) R(steps, 380 + i * 120, 880 - i * 4, 130, 26, i % 2 ? "#B9A07A" : "#C9B08A", 4); R(steps, -1200, 900, 4320, 600, "#A9C98F");
    const rail = el("g", {}, L.front); R(rail, -200, 860, 1500, 12, "#6B4A34", 6); for (let i = 0; i < 9; i++) R(rail, -180 + i * 180, 860, 12, 120, "#6B4A34", 6);
    return { HZ: 520, update: (t) => cl(t) }; };

  // ---------- jetty + Finn's boat ----------
  S.jetty = (L) => { sky(L.sky, "#C2CCD8"); const cl = clouds(L.sky, 44, 7);
    const far = Lg(L.mid); P(far, "M-1200,600 Q-400,500 300,580 Q900,520 1500,590 L1500,640 L-1200,640 Z", "#8FB4A0");
    const sea = el("g", {}, L.back); R(sea, -1200, 600, 4320, 800, "#4E8FB0"); const waves = [0, 1, 2, 3, 4].map(() => P(sea, "", "none", { stroke: "#9FD3EA", "stroke-width": 5, opacity: 0.7 }));
    const jetty = Lg(L.back, true); R(jetty, -400, 800, 1200, 40, "#8E6440", 6); for (let i = 0; i < 7; i++) R(jetty, -380 + i * 180, 830, 26, 300, "#6B4A34", 6);
    const boatG = el("g", {}, L.front), hull = Lg(boatG, true); P(hull, "M820,820 L1700,820 Q1660,980 1520,1000 L960,1000 Q840,980 820,820 Z", "#E8634A"); R(hull, 810, 800, 900, 32, "#FFF6E3", 12); T(hull, 1260, 940, "THE GIGGLING COD", 54, "#FFF6E3");
    const fw = Lg(L.front); const fwave = P(fw, "", "#3E7FA0");
    return { HZ: 600, boatG, update(t) { const b = Math.sin(t * 1.6) * 8; boatG.setAttribute("transform", `translate(0,${b.toFixed(1)}) rotate(${(Math.sin(t * 1.3) * 1.2).toFixed(2)},1260,900)`); boatG.__bob = b;
      waves.forEach((w, i) => { const y = 650 + i * 80, ph = t * (0.6 + i * 0.1) * 60; let d = `M-1200,${y}`; for (let x = -1200; x <= 3100; x += 80) d += ` Q${x + 40},${(y - 10 + Math.sin((x + ph) / 90) * 4).toFixed(1)} ${x + 80},${y}`; w.setAttribute("d", d); });
      let d = "M-1200,1010"; for (let x = -1200; x <= 3100; x += 120) d += ` Q${x + 60},${(984 + Math.sin((x + t * 80) / 70) * 10).toFixed(1)} ${x + 120},1010`; fwave.setAttribute("d", d + " L3100,1400 L-1200,1400 Z"); cl(t); } }; };

  // ---------- bakery counter (interior) ----------
  S.bakeryIn = (L) => { R(L.sky, -1200, -800, 4320, 2000, "#F6E3C6"); for (let i = 0; i < 40; i++) for (let j = 0; j < 4; j++) R(L.mid, -1200 + i * 80 + (j % 2) * 40, 560 + j * 40, 80, 40, "#FFFFFF", 0, { stroke: "#E2CDA8", "stroke-width": 2 });
    [[260], [430]].forEach(([y]) => { const sh = Lg(L.mid); R(sh, -100, y, 1900, 20, "#8E6440"); for (let k = 0; k < 15; k++) el("ellipse", { cx: -40 + k * 125, cy: y - 26, rx: 46, ry: 26, fill: k % 3 ? "#E8B06A" : "#C98B5E" }, sh); });
    R(L.back, -1200, 900, 4320, 600, "#C99A6E");
    const ctr = Lg(L.front, true); R(ctr, -200, 720, 1700, 400, "#C9875A", 8); R(ctr, -220, 700, 1740, 40, "#7A4E32", 10); R(ctr, 0, 760, 640, 200, "#DFF3FF", 10, { opacity: 0.85 }); for (let k = 0; k < 5; k++) el("ellipse", { cx: 70 + k * 120, cy: 900, rx: 46, ry: 24, fill: "#E8B06A" }, ctr);
    return { HZ: 520, update() {} }; };

  // ---------- Kai's site ----------
  S.site = (L) => { sky(L.sky, "#B8C4D2"); const cl = clouds(L.sky, 55, 6);
    const fr = Lg(L.mid, true); for (let i = 0; i < 6; i++) R(fr, 200 + i * 230, 160, 24, 700, "#C8553D", 4); for (let j = 0; j < 4; j++) R(fr, 190, 180 + j * 170, 1180, 22, "#C8553D", 4);
    ground(L.back, 840, "#B9A07A", 9); const bricks = Lg(L.back); for (let i = 0; i < 4; i++) for (let j = 0; j < 6 - i; j++) R(bricks, 1450 + j * 70 + i * 35, 800 - i * 36, 66, 34, "#C8553D", 3);
    [[160, 880], [1760, 900]].forEach(([x, y]) => { const c = Lg(L.front); P(c, `M${x - 40},${y + 60} L${x},${y - 60} L${x + 40},${y + 60} Z`, "#FF8A2A"); R(c, x - 22, y - 10, 44, 16, "#FFFFFF"); });
    return { HZ: 600, update: (t) => cl(t) }; };

  // ---------- Ana's doorstep (door opens/closes, frosted glass) ----------
  S.doorstep = (L) => { sky(L.sky, "#BFD6E2"); const cl = clouds(L.sky, 66, 6);
    const wall = Lg(L.mid, true); R(wall, -600, 60, 2400, 820, "#F4A6A0", 6); for (let i = 0; i < 3; i++) R(wall, -440 + i * 900 + (i === 1 ? 900 : 0), 220, 200, 220, "#9FD3EA", 10);
    const frame = Lg(L.back, true); R(frame, 780, 300, 360, 560, "#7A4E32", 8);
    const door = el("g", {}, L.back), dp = Lg(door, true); R(dp, 800, 320, 320, 540, "#3A6F8F", 6); const glassD = R(dp, 870, 380, 180, 200, "#CFE3EE", 8, { opacity: 0.9 }); C(dp, 1090, 600, 10, "#FFC93C");
    const flick = R(door, 870, 380, 180, 200, "#FFFFFF", 8, { opacity: 0 });
    R(L.back, 700, 860, 520, 40, "#B9A07A", 6); ground(L.back, 900, "#E2CDA8", 11); plant(L.front, 1640, 930, 0.9); plant(L.front, 300, 930, 0.8);
    const pile = el("g", {}, L.back); box(pile, 1260, 900, 130, 90, "MUM — KITCHEN"); box(pile, 1260, 810, 110, 80); box(pile, 1400, 900, 120, 90);
    return { HZ: 600, door, glassD, flick, pile, update(t, k = {}) { cl(t); const o = clamp(k.open ?? 1, 0, 1); door.setAttribute("transform", `translate(${800 + 320 * (1 - o) * 0},0) translate(800,0) scale(${(0.15 + 0.85 * (1 - o)).toFixed(3)},1) translate(-800,0)`);
      flick.setAttribute("opacity", (k.flash || 0).toFixed(2)); pile.setAttribute("opacity", (k.pile ?? 1).toFixed(2)); } }; };

  // ---------- Ana's half-packed kitchen ----------
  S.kitchen = (L) => { R(L.sky, -1200, -800, 4320, 2000, "#F2DDB8");
    const win = Lg(L.mid, true); R(win, 1200, 180, 460, 340, "#BFE3F2", 10); R(win, 1200, 180, 460, 340, "none", 10, { stroke: "#8E6440", "stroke-width": 18 }); R(win, 1422, 180, 16, 340, "#8E6440");
    const cup = Lg(L.mid, true); for (let i = 0; i < 4; i++) R(cup, -100 + i * 230, 160, 210, 260, i === 1 ? "#E9D9BE" : "#D8B98E", 8); R(cup, 130, 160, 210, 260, "#F6EAD6", 8);   // one cupboard open/empty
    const board = Lg(L.mid); R(board, 860, 220, 260, 200, "#C8A06A", 8); R(board, 890, 250, 90, 110, "#FFFFFF", 4); T(board, 935, 300, "HELP", 22); T(board, 935, 330, "WANTED", 18); R(board, 1000, 260, 90, 70, "#FFE7A0", 4);
    R(L.back, -1200, 860, 4320, 600, "#C98B5E"); const tbl = Lg(L.back, true); R(tbl, 300, 760, 700, 30, "#8E6440", 8); R(tbl, 330, 790, 26, 160, "#6B4A34"); R(tbl, 950, 790, 26, 160, "#6B4A34");
    const boxes = el("g", {}, L.back); [[100, 900, "MUM — KITCHEN"], [230, 900, "BOOKS"], [160, 810, "PLATES"], [1500, 900, ""], [1640, 900, "MUM — BEDROOM"], [1570, 810, ""]].forEach(([x, y, l]) => box(boxes, x, y, 130, 90, l));
    return { HZ: 560, update() {} }; };

  // ---------- Mo's café (interior) ----------
  S.cafe = (L) => { const wall = R(L.sky, -1200, -800, 4320, 2000, "#E9D9BE");
    const win = el("g", { transform: "translate(1180,140)" }, L.mid); const skyR = R(win, 0, 0, 560, 420, "#9FB6C8"); const sunC = C(win, 420, 110, 54, "#FFD84A", { opacity: 0 }); R(win, 0, 0, 560, 420, "none", 0, { stroke: "#6B4A34", "stroke-width": 22 }); R(win, 272, 0, 16, 420, "#6B4A34"); R(win, 0, 202, 560, 16, "#6B4A34");
    const ctr = Lg(L.mid, true); R(ctr, -200, 480, 640, 320, "#C9875A", 10); R(ctr, -220, 460, 680, 34, "#7A4E32", 8); C(ctr, 0, 440, 22, "#F2EDE4"); C(ctr, 110, 440, 22, "#F2EDE4"); T(ctr, 120, 640, "MO'S", 60, "#FFF6E3");
    const menu = Lg(L.mid); R(menu, 520, 160, 300, 220, "#2E3A34", 8); T(menu, 670, 230, "TUNA MELT", 30, "#F4EEE2"); T(menu, 670, 280, "SOUP", 30, "#F4EEE2"); T(menu, 670, 330, "HUGS: FREE", 26, "#FFD84A");
    R(L.back, -1200, 800, 4320, 600, "#B98A5E"); for (let i = 0; i < 18; i++) el("line", { x1: -1200 + i * 240, y1: 800, x2: -1320 + i * 260, y2: 1400, stroke: "#A97C52", "stroke-width": 4 }, L.back);
    const tbl = Lg(L.front, true); el("ellipse", { cx: 960, cy: 800, rx: 160, ry: 26, fill: "#8E6440" }, tbl); R(tbl, 946, 800, 28, 140, "#3B3446"); R(tbl, 900, 766, 34, 32, "#FFFFFF", 6); R(tbl, 984, 766, 34, 32, "#FFFFFF", 6);
    plant(L.front, 1860, 820, 1.0);
    return { HZ: 520, update(t, m = 0) { skyR.setAttribute("fill", K.mix("#8E98A8", "#9FD8F2", m)); sunC.setAttribute("opacity", K.sm(0.6, 1, m).toFixed(2)); wall.setAttribute("fill", K.mix("#D8CFC2", "#F2DDB8", m)); } }; };

  // ---------- café window close (reflection) ----------
  S.cafeWindow = (L) => { R(L.sky, -1200, -800, 4320, 2000, "#6B4A34");
    const out = el("g", {}, L.mid); R(out, 260, 60, 1400, 960, "#BFE3F2"); [[300, 440, 520, "#F4A6A0"], [760, 380, 460, "#FFF1D6"], [1160, 460, 540, "#9FD8C8"]].forEach(([x, w, h, c]) => R(out, x, 1020 - h, w, h, c, 6, { opacity: 0.6 }));
    const reflG = el("g", {}, L.back); const sheen = el("g", {}, L.front); P(sheen, "M300,1020 L700,60 L820,60 L420,1020 Z", "#FFFFFF", { opacity: 0.16 }); P(sheen, "M1300,1020 L1600,300 L1640,300 L1340,1020 Z", "#FFFFFF", { opacity: 0.12 });
    R(L.front, 260, 60, 1400, 960, "none", 0, { stroke: "#6B4A34", "stroke-width": 40 });
    return { HZ: 540, reflG, update() {} }; };

  // ---------- Ana's street (Saturday) ----------
  S.street = (L) => { sky(L.sky, "#C9DCE6"); const cl = clouds(L.sky, 77, 9);
    [[-640, 340, 460, "#F4A6A0", "#7A4E32"], [-260, 380, 520, "#FFF1D6", "#2F6F73"], [160, 420, 560, "#F4A6A0", "#3A6F8F"], [620, 400, 500, "#F2C14E", "#C8553D"], [1060, 420, 540, "#CDB6E8", "#7A4E32"], [1520, 380, 480, "#9FD8C8", "#2F6F73"], [1940, 420, 520, "#FFF1D6", "#C8553D"]].forEach((h, i) => house(L.mid, ...h, i + 20));
    ground(L.back, 840, "#E2CDA8", 13); const chalk = Lg(L.back); R(chalk, 1500, 700, 150, 170, "#2E3A34", 8); T(chalk, 1575, 770, "SAT", 44, "#F4EEE2"); T(chalk, 1575, 830, "☁", 44, "#F4EEE2"); R(chalk, 1520, 870, 12, 40, "#6B4A34"); R(chalk, 1618, 870, 12, 40, "#6B4A34");
    const van = el("g", {}, L.front), vb = Lg(van, true); R(vb, 0, 0, 620, 300, "#F2EDE4", 30); R(vb, 400, 30, 200, 120, "#9FD3EA", 16); T(vb, 240, 170, "KAI BUILDS", 48, "#C8553D"); C(vb, 120, 300, 54, "#3B3446"); C(vb, 480, 300, 54, "#3B3446"); C(vb, 120, 300, 22, "#B9C7CF"); C(vb, 480, 300, 22, "#B9C7CF");
    const doors = el("g", {}, van); R(doors, -6, 20, 20, 260, "#D9D4CC", 6);
    return { HZ: 600, van, update(t, k = {}) { cl(t); van.setAttribute("transform", `translate(${(k.vanX ?? -2000).toFixed(1)},${(560 + Math.sin(t * 9) * (k.vanMoving ? 2 : 0)).toFixed(1)})`); } }; };

  // ---------- UI inserts: rule card, phone, list ----------
  S.ruleCard = (svg) => { const g = el("g", { opacity: 0 }, svg); const c = Lg(g, true); R(c, 340, 140, 1240, 800, "#FFF6E3", 30); R(c, 340, 140, 1240, 130, "#6C5CE7", 30); R(c, 340, 230, 1240, 40, "#6C5CE7");
    T(c, 960, 230, "THE RULES", 70, "#FFFFFF"); const rows = ["You can see everyone's inner weather.", "They can't.", "You can't see your own.*"].map((s, i) => { const r = el("g", {}, c), y = 400 + i * 170; C(r, 460, y, 52, "#FFC93C"); T(r, 460, y + 22, String(i + 1), 60); T(r, 545, y + 20, s, 54, "#3a2e2a", { "text-anchor": "start" }); return r; });
    const fine = T(c, 1500, 900, "*…until someone really asks.", 34, "#3a2e2a", { "text-anchor": "end" }); const blur = el("filter", { id: "fineblur" }, svg.querySelector("defs")); const fb = el("feGaussianBlur", { stdDeviation: 6 }, blur); fine.setAttribute("filter", "url(#fineblur)");
    return { g, set(op, ks, sharp = 0, zoomFine = 0) { g.setAttribute("opacity", op.toFixed(2)); rows.forEach((r, i) => { const k = K.back(ks[i] || 0); r.setAttribute("opacity", clamp((ks[i] || 0) * 3, 0, 1).toFixed(2)); r.setAttribute("transform", `translate(${((1 - k) * -60).toFixed(1)},0)`); });
      fb.setAttribute("stdDeviation", (6 * (1 - sharp)).toFixed(2)); fine.setAttribute("opacity", (0.35 + 0.65 * sharp).toFixed(2));
      const z = 1 + 1.6 * K.sm(0, 1, zoomFine); g.setAttribute("transform", `translate(${1300 * (z - 1) * -0.62},${880 * (z - 1) * -0.62}) translate(960,540) scale(${z.toFixed(3)}) translate(-960,-540)`); } }; };
  S.phone = (svg) => { const g = el("g", { opacity: 0 }, svg); R(g, 0, 0, 1920, 1080, "#2B2140"); const ph = Lg(g, true); R(ph, 660, 60, 600, 980, "#1E1B22", 60); R(ph, 690, 120, 540, 860, "#F4F1EA", 24);
    T(ph, 960, 180, "Mo", 34, "#3a2e2a"); const bubble = Lg(ph); const bub = R(bubble, 720, 700, 480, 120, "#6C5CE7", 30); const txt = T(bubble, 750, 775, "", 38, "#FFFFFF", { "text-anchor": "start" }), txt2 = T(bubble, 750, 825, "", 38, "#FFFFFF", { "text-anchor": "start" }); const caret = R(ph, 0, 745, 4, 42, "#FFFFFF");
    const sent = el("g", { opacity: 0 }, ph); R(sent, 900, 520, 300, 100, "#6C5CE7", 30); T(sent, 1050, 585, "fine!", 44, "#FFFFFF");
    return { g, set(op, text, sentK = 0) { g.setAttribute("opacity", op.toFixed(2)); let l1 = text, l2 = ""; if (text.length > 19) { const cut = text.lastIndexOf(" ", 19); l1 = text.slice(0, cut > 0 ? cut : 19); l2 = text.slice(l1.length).trimStart(); }
      txt.textContent = l1; txt2.textContent = l2; bub.setAttribute("y", l2 ? 670 : 700); bub.setAttribute("height", l2 ? 180 : 120); txt.setAttribute("y", l2 ? 740 : 775);
      const last = l2 || l1, w = last.length * 19.5; caret.setAttribute("x", (754 + w).toFixed(0)); caret.setAttribute("y", l2 ? 795 : 745); caret.setAttribute("opacity", text.length ? 1 : 0); sent.setAttribute("opacity", sentK.toFixed(2)); sent.setAttribute("transform", `translate(0,${((1 - K.back(sentK)) * 60).toFixed(1)})`); bubble.setAttribute("opacity", sentK > 0.1 ? 0 : 1); } }; };
  S.list = (svg) => { const g = el("g", { opacity: 0 }, svg); R(g, 0, 0, 1920, 1080, "#3a2e2a", 0, { opacity: 0.85 }); const pg = Lg(g, true); R(pg, 560, 40, 800, 1000, "#FFFBEF", 10); T(pg, 960, 120, "SATURDAY HELP?", 56, "#3a2e2a");
    const names = ["Theo", "Mo", "Kai", "Bea", "Finn", "Nia", "Ola", "Sam", "Ruth", "Jun", "Ivo", "Lena", "Tom", "Ari", "Mei", "Raj", "Zoe", "Ken", "Eli", "Pip"];
    const rows = names.map((n, i) => { const r = el("g", {}, pg), x = i < 10 ? 640 : 1000, y = 200 + (i % 10) * 80; T(r, x, y, `${i + 1}. ${n}`, 40, "#3a2e2a", { "text-anchor": "start" }); const tick = el("path", { d: `M${x + 240},${y - 16} l16,18 l34,-38`, fill: "none", stroke: "#2F9E8F", "stroke-width": 10, "stroke-linecap": "round", opacity: 0 }, r); return [r, tick]; });
    return { g, set(op, nShown, ticks) { g.setAttribute("opacity", op.toFixed(2)); rows.forEach(([r, tk], i) => { r.setAttribute("opacity", clamp(nShown - i, 0, 1).toFixed(2)); tk.setAttribute("opacity", clamp(ticks - i, 0, 1).toFixed(2)); }); } }; };
})();
