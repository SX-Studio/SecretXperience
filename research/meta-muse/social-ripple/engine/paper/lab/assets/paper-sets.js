/* Paper storybook sets + props: island square, weather icons, word cards, YOU tag, camera helpers. Pure functions of t. */
(function () {
  const SR = window.SR, { el, clamp, lerp } = SR, K = (window.PK = {});
  K.sm = (a, b, t) => { const u = clamp((t - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  K.back = (u) => { u = clamp(u, 0, 1); const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  K.win = (t, a, b, fi = 0.25, fo = 0.25) => Math.min(K.sm(a, a + fi, t), 1 - K.sm(b - fo, b, t));
  K.mix = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); k = clamp(k, 0, 1); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join(""); };
  const R = (p, x, y, w, h, fill, rx = 0, o = {}) => el("rect", Object.assign({ x, y, width: w, height: h, fill, rx }, o), p);
  const P = (p, d, fill, o = {}) => el("path", Object.assign({ d, fill }, o), p);
  const L = (p, big) => el("g", { filter: big ? "url(#pshadowL)" : "url(#pshadow)" }, p);
  // ---------- square ----------
  K.square = (back, front) => {
    const sky = R(back, -800, -600, 3520, 1600, "#BFE3F2");
    const sun = L(back); el("circle", { cx: 1500, cy: 160, r: 90, fill: "#FFD27A" }, sun);
    const clouds = [[-300, 140, 1.3], [500, 90, 1.0], [1200, 60, 1.1], [2000, 150, 1.2]].map(([x, y, k]) => { const g = L(back); g.setAttribute("transform", `translate(${x},${y}) scale(${k})`); P(g, "M0,40 C-50,40 -50,-20 0,-20 C10,-70 90,-80 110,-30 C150,-50 200,0 170,40 Z", "#FFFFFF"); return [g, x, y, k]; });
    const house = (x, w, h, wall, roof, i) => { const g = L(back, true); R(g, x, 820 - h, w, h, wall, 6); P(g, `M${x - 16},${820 - h + 6} L${x + w / 2},${820 - h - 80} L${x + w + 16},${820 - h + 6} Z`, roof);
      for (let r = 0; r < Math.floor((h - 120) / 110) + 1; r++) for (let c = 0; c < Math.max(1, Math.floor(w / 110)); c++) { const wx = x + 26 + c * ((w - 52) / Math.max(1, Math.floor(w / 110))) + ((w - 52) / Math.max(1, Math.floor(w / 110)) - 56) / 2, wy = 820 - h + 40 + r * 110; R(g, wx, wy, 56, 66, (r + c + i) % 3 ? "#9FD3EA" : "#FFE7A0", 8); }
      R(g, x + w / 2 - 30, 820 - 120, 60, 120, roof === "#C8553D" ? "#7A4E32" : "#8E6440", 26); };
    [[-640, 300, 330, "#F2C14E", "#C8553D"], [-320, 280, 400, "#9FD8C8", "#3A6F8F"], [-20, 330, 360, "#F4A6A0", "#7A4E32"], [330, 300, 430, "#FFF1D6", "#2F6F73"], [1180, 320, 390, "#CDB6E8", "#C8553D"], [1520, 300, 350, "#F2C14E", "#3A6F8F"], [1840, 330, 420, "#9FD8C8", "#7A4E32"], [2180, 300, 360, "#F4A6A0", "#2F6F73"]].forEach((h, i) => house(...h, i));
    const cafe = L(back, true); R(cafe, 650, 470, 520, 350, "#FFF6E3", 8); for (let i = 0; i < 8; i++) P(cafe, `M${650 + i * 65},440 L${715 + i * 65},440 L${715 + i * 65},500 Q${682 + i * 65},530 ${650 + i * 65},500 Z`, i % 2 ? "#FFFFFF" : "#E8634A"); R(cafe, 720, 560, 380, 170, "#9FD3EA", 10);
    el("text", { x: 910, y: 428, "text-anchor": "middle", "font-family": "Fredoka", "font-weight": 700, "font-size": 40, fill: "#3a2e2a" }, cafe).textContent = "CRUMB CAFÉ";
    const ground = L(back, true); R(ground, -800, 820, 3520, 700, "#E2CDA8"); const rnd = SR.mulberry32(3); for (let i = 0; i < 160; i++) el("ellipse", { cx: -800 + rnd() * 3520, cy: 850 + rnd() * 400, rx: 30 + rnd() * 20, ry: 10 + rnd() * 5, fill: "#D6BE96", opacity: 0.7 }, ground);
    const bunt = (x0, x1, y) => { const g = L(back); const cols = ["#E8634A", "#FFC93C", "#3FA7A0", "#6C5CE7", "#F2EDE4"], flags = []; for (let i = 1; i < 16; i++) { const u = i / 16, x = lerp(x0, x1, u), yy = y + 90 * u * (1 - u); const f = P(g, "M-14,0 L14,0 L0,30 Z", cols[i % 5]); flags.push([f, x, yy, i]); } return (t) => flags.forEach(([f, x, yy, i]) => f.setAttribute("transform", `translate(${x},${yy}) rotate(${(Math.sin(t * 2.4 + i) * 8).toFixed(2)})`)); };
    const b1 = bunt(-500, 640, 300), b2 = bunt(1180, 2400, 290);
    const fo = L(front, true); el("ellipse", { cx: 960, cy: 880, rx: 230, ry: 40, fill: "#B9C7CF" }, fo); el("ellipse", { cx: 960, cy: 870, rx: 200, ry: 28, fill: "#7EC8F2" }, fo); R(fo, 940, 740, 40, 130, "#B9C7CF", 10); el("ellipse", { cx: 960, cy: 740, rx: 70, ry: 16, fill: "#B9C7CF" }, fo);
    const jets = [-1, 1].map(() => P(fo, "", "none", { stroke: "#BFE8FF", "stroke-width": 8, "stroke-linecap": "round" }));
    return { update(t, m = 1) { b1(t); b2(t); jets.forEach((j, i) => { const s = i ? 1 : -1, h = 70 + Math.sin(t * 3 + i) * 6; j.setAttribute("d", `M960,728 Q${960 + s * 70},${728 - h} ${960 + s * 150},862`); });
      clouds.forEach(([g, x, y, k], i) => g.setAttribute("transform", `translate(${x + ((t * (8 + i * 3)) % 400) - 100},${y}) scale(${k})`)); sky.setAttribute("fill", K.mix("#9FA8B8", "#BFE3F2", m)); } };
  };
  // ---------- paper weather icon: level 0 sun .. 4 storm, with pop ----------
  K.weather = (parent, seed = 1) => { const g = el("g", {}, parent), inner = L(g); const sun = el("g", {}, inner); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; R(sun, -6, -52, 12, 22, "#FFC93C", 6, { transform: `rotate(${(a * 180) / Math.PI})` }); } el("circle", { r: 28, fill: "#FFD84A" }, sun);
    const cloud = el("g", {}, inner), c1 = P(cloud, "M-50,16 C-80,16 -80,-20 -46,-20 C-40,-56 10,-66 26,-30 C56,-50 94,-20 74,16 Z", "#8C97A6"), c2 = P(cloud, "M-28,16 C-50,16 -50,-10 -26,-10 C-20,-36 20,-42 30,-16 C52,-28 76,-4 60,16 Z", "#AEB7C3");
    const bolt = P(inner, "M6,20 L-24,66 L0,66 L-18,112 L30,52 L6,52 L26,20 Z", "#FFD84A"), drops = [0, 1, 2, 3, 4].map((i) => R(inner, -44 + i * 22, 26, 9, 30, "#5F9ED6", 4));
    function set(lv, t, k = 1, pop = 1) { lv = clamp(lv, 0, 4); g.setAttribute("opacity", pop > 0.001 ? 1 : 0); inner.setAttribute("transform", `scale(${(k * K.back(pop)).toFixed(3)})`);
      sun.setAttribute("opacity", clamp(1 - lv * 1.5, 0, 1).toFixed(2)); sun.setAttribute("transform", `rotate(${(t * 15) % 360})`); const co = clamp(lv * 1.4, 0, 1); cloud.setAttribute("opacity", co.toFixed(2)); cloud.setAttribute("transform", `translate(0,${(Math.sin(t * 2 + seed) * 3).toFixed(1)})`);
      c1.setAttribute("fill", K.mix("#D9DEE6", "#5C6378", lv / 4)); c2.setAttribute("fill", K.mix("#FFFFFF", "#8C97A6", lv / 4));
      const rk = clamp(lv - 1.4, 0, 2.6) / 2.6; drops.forEach((d, i) => { const ph = ((t * (1.6 + rk) + i * 0.37 + seed * 0.1) % 1); d.setAttribute("y", (26 + ph * 40).toFixed(1)); d.setAttribute("height", (14 + rk * 20).toFixed(1)); d.setAttribute("opacity", (i < Math.round(1 + rk * 4) && lv > 1.4) ? ((1 - ph * 0.7) * clamp(lv - 1.4, 0, 1)).toFixed(2) : 0); });
      const fl = lv > 3.3 ? ((Math.floor(t * 6 + seed) % 5) < 3 ? 1 : 0.3) * clamp((lv - 3.3) * 1.5, 0, 1) : 0; bolt.setAttribute("opacity", fl.toFixed(2)); }
    return { g, set }; };
  // ---------- word card (black screen, big words), YOU tag, pointer ----------
  K.card = (svg, lines, o = {}) => { const g = el("g", { opacity: 0 }, svg); R(g, 0, 0, 1920, 1080, o.bg || "#1a1512"); const ts = lines.map((s, i) => { const t = el("text", { x: 960, y: 540 + (i - (lines.length - 1) / 2) * (o.fs || 150) * 1.1 + (o.fs || 150) * 0.35, "text-anchor": "middle", "font-family": "Fredoka", "font-weight": 700, "font-size": o.fs || 150, fill: o.fg || "#F3E4C8" }, g); t.textContent = s; return t; });
    return { g, set(op, k) { g.setAttribute("opacity", op.toFixed(2)); ts.forEach((t, i) => { const kk = K.back(clamp(k * 1.4 - i * 0.25, 0, 1)); t.setAttribute("transform", `translate(960,540) scale(${(0.6 + 0.4 * kk).toFixed(3)}) translate(-960,-540)`); t.setAttribute("opacity", clamp(kk * 2, 0, 1).toFixed(2)); }); } }; };
  K.tag = (parent, text, o = {}) => { const g = L(parent), fs = o.fs || 30, w = text.length * fs * 0.62 + 34; R(g, -w / 2, -fs * 0.9, w, fs * 1.75, o.bg || "#6C5CE7", 14); el("text", { x: 0, y: fs * 0.33, "text-anchor": "middle", "font-family": "Fredoka", "font-weight": 700, "font-size": fs, fill: o.fg || "#FFFFFF" }, g).textContent = text; return g; };
  K.bubble = (parent, text, o = {}) => { const g = L(parent), fs = o.fs || 34, w = text.length * fs * 0.6 + 50; R(g, -w / 2, -fs, w, fs * 1.9, "#FFFFFF", 22); P(g, `M${-w / 2 + 40},${fs * 0.88} l10,26 l22,-26 Z`, "#FFFFFF"); el("text", { x: 0, y: fs * 0.35, "text-anchor": "middle", "font-family": "Fredoka", "font-weight": 700, "font-size": fs, fill: "#3a2e2a" }, g).textContent = text; return g; };
  // camera: shots [t, [cx, cy, z] | {who, z, dy}, next?, ease]; snap when no next; shake(t) added
  K.camera = (shots, D) => { let CUR = shots[0]; return { cur: () => CUR, at(t, res, shake = 0) { let i = 0; while (i + 1 < shots.length && t >= shots[i + 1][0]) i++; CUR = shots[i]; const t0 = shots[i][0], t1 = i + 1 < shots.length ? shots[i + 1][0] : D;
      const A = res(shots[i][1]), B = shots[i][2] ? res(shots[i][2]) : A, u = clamp((t - t0) / Math.max(0.01, t1 - t0), 0, 1), k = shots[i][2] ? (shots[i][3] === "lin" ? u : shots[i][3] === "out" ? 1 - Math.pow(1 - u, 3) : u * u * (3 - 2 * u)) : 0;
      const z = lerp(A[2], B[2], k), sx = (Math.sin(t * 61) * 9 + Math.cos(t * 47) * 6) * shake, sy = (Math.cos(t * 53) * 7) * shake;
      return `translate(960,540) scale(${z.toFixed(4)}) translate(${(-lerp(A[0], B[0], k) + sx).toFixed(1)},${(-lerp(A[1], B[1], k) + sy).toFixed(1)})`; } }; };
})();
