/* Social Ripple ep2: school sets, phone UI, level HUD, network map. Seek-safe: everything is drawn from t. */
(function () {
  const SR = window.SR; const { el, PAL, clamp, EASE, mulberry32, sampleTrack } = SR;
  const INK = PAL.ink;
  let UID = 1;
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const f = (c) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k); return "#" + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1); };
  const defsOf = (svg) => svg.querySelector("defs") || el("defs", {}, svg);
  const txt = (parent, x, y, s, size, fill, o = {}) => { const t = el("text", Object.assign({ x, y, "font-family": o.font || "Nunito", "font-weight": o.weight || 900, "font-size": size, fill, "text-anchor": o.anchor || "middle", "dominant-baseline": "central" }, o.attrs || {}), parent); t.textContent = s; return t; };
  const C = { wall: "#CFE3D6", wall2: "#B9D3C4", trim: "#2F6F73", locker1: "#4F7FB0", locker2: "#E58A3A", floorA: "#E9E1D2", floorB: "#D6CCBA", steel: "#B9C2C9", school: "#2F6F73", otter: "#8A5A35" };

  // ---------- extra props: tray, fan ----------
  const baseProp = SR.buildProp;
  SR.buildProp = function (g, kind) {
    if (kind === "tray") {
      el("rect", { x: -46, y: -8, width: 92, height: 12, rx: 4, fill: "#E58A3A", stroke: INK, "stroke-width": 3 }, g);
      el("path", { d: "M-34,-8 Q-24,-26 -12,-8 Z", fill: "#F2C14E", stroke: INK, "stroke-width": 2.5 }, g);   // taco
      el("rect", { x: 4, y: -26, width: 14, height: 18, fill: "#FFFFFF", stroke: INK, "stroke-width": 2.5 }, g); // milk
      el("path", { d: "M4,-26 L11,-33 L18,-26", fill: "#7EC8E3", stroke: INK, "stroke-width": 2.5 }, g);
      el("circle", { cx: 32, cy: -15, r: 8, fill: "#D9453A", stroke: INK, "stroke-width": 2.5 }, g);            // apple
      return g;
    }
    if (kind === "fan") {
      el("rect", { x: -4, y: -4, width: 8, height: 40, fill: "#6F8299", stroke: INK, "stroke-width": 2 }, g);
      el("circle", { cx: 0, cy: -26, r: 26, fill: "#DCE6EC", stroke: INK, "stroke-width": 3 }, g);
      for (let a = 0; a < 3; a++) el("path", { d: "M0,-26 q14,-16 4,-22 z", fill: "#7EC8E3", stroke: INK, "stroke-width": 1.5, transform: `rotate(${a * 120},0,-26)` }, g);
      return g;
    }
    return baseProp(g, kind);
  };

  const EP = {};
  EP.C = C; EP.shade = shade; EP.txt = txt;

  // ---------- cafeteria ----------
  EP.cafeteria = function (svg, g, G, o = {}) {
    const wall = o.wall || C.wall, B = o.base ?? (G - 300);   // B = where the back wall meets the floor
    el("rect", { x: -1600, y: -900, width: 5200, height: B + 900, fill: wall }, g);
    el("rect", { x: -1600, y: B - 150, width: 5200, height: 150, fill: shade(wall, -0.1) }, g);
    el("rect", { x: -1600, y: B - 156, width: 5200, height: 10, fill: C.trim }, g);
    const defs = defsOf(svg), bid = "beam" + (UID++);
    const lg = el("linearGradient", { id: bid, x1: 0, y1: 0, x2: 0.3, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#FFF6D8", "stop-opacity": 0.45 }, lg); el("stop", { offset: 1, "stop-color": "#FFF6D8", "stop-opacity": 0 }, lg);
    const wy = B - 560;
    (o.windows || [-1100, -660, -220, 1500, 1940, 2380]).forEach((wx) => {
      el("rect", { x: wx, y: wy, width: 300, height: 240, rx: 6, fill: "#BFE0EE", stroke: INK, "stroke-width": 6 }, g);
      el("path", { d: `M${wx + 150},${wy} V${wy + 240} M${wx},${wy + 120} H${wx + 300}`, stroke: INK, "stroke-width": 5 }, g);
      el("path", { d: `M${wx + 30},${wy + 20} l60,0 l-50,90 l-40,0 z`, fill: "rgba(255,255,255,0.45)" }, g);
      el("path", { d: `M${wx},${wy + 240} L${wx + 300},${wy + 240} L${wx + 480},${G + 200} L${wx + 120},${G + 200} Z`, fill: `url(#${bid})` }, g);
    });
    const bx = o.bannerX ?? 260;
    el("path", { d: `M${bx},${wy - 10} L${bx + 560},${wy - 10} L${bx + 530},${wy + 55} L${bx + 560},${wy + 120} L${bx},${wy + 120} L${bx + 30},${wy + 55} Z`, fill: C.school, stroke: INK, "stroke-width": 6 }, g);
    txt(g, bx + 280, wy + 56, o.banner || "GO OTTERS!", 60, "#FFE7A0", { font: "Outfit" });
    const mx = o.menuX ?? 900, my = B - 470;
    el("rect", { x: mx, y: my, width: 440, height: 270, rx: 10, fill: "#2B3A34", stroke: INK, "stroke-width": 8 }, g);
    txt(g, mx + 220, my + 42, "TODAY", 36, "#F4F1EA");
    txt(g, mx + 220, my + 102, o.menu || "Mystery Tacos", 42, "#F2D28A");
    txt(g, mx + 220, my + 165, "Milk ......... $0.50", 28, "#F4F1EA");
    txt(g, mx + 220, my + 220, "Kindness ...... FREE", 28, "#F2D28A");
    const cx = o.clockX ?? 1410, cy = B - 380;
    el("circle", { cx, cy, r: 52, fill: "#FFFFFF", stroke: INK, "stroke-width": 7 }, g);
    const [hh, mm] = (o.time || "12:05").split(":").map(Number);
    const ha = ((hh % 12) + mm / 60) * 30 * Math.PI / 180, ma = mm * 6 * Math.PI / 180;
    el("path", { d: `M${cx},${cy} L${cx + 26 * Math.sin(ha)},${cy - 26 * Math.cos(ha)}`, stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, g);
    el("path", { d: `M${cx},${cy} L${cx + 40 * Math.sin(ma)},${cy - 40 * Math.cos(ma)}`, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, g);
    const lx = o.lineX ?? 2700;
    el("rect", { x: lx, y: B - 130, width: 900, height: 150, fill: C.steel, stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: `M${lx},${B - 130} l60,-110 l780,0 l60,110`, fill: "rgba(200,235,245,0.35)", stroke: INK, "stroke-width": 5 }, g);
    for (let i = 0; i < 4; i++) el("rect", { x: lx + 80 + i * 200, y: B - 150, width: 150, height: 26, rx: 6, fill: ["#E58A3A", "#9DB49A", "#F2C14E", "#D98C8C"][i], stroke: INK, "stroke-width": 4 }, g);
    el("rect", { x: -1600, y: B, width: 5200, height: 1400, fill: C.floorA }, g);
    for (let r = 0; r < 14; r++) { const y0 = B + r * 70; for (let i = -1600; i < 3600; i += 140) if (((i + 1600) / 140 + r) % 2 === 0) el("rect", { x: i, y: y0, width: 140, height: 70, fill: C.floorB }, g); }
    el("rect", { x: -1600, y: B, width: 5200, height: 20, fill: "rgba(0,0,0,0.12)" }, g);
  };

  // long cafeteria table with attached benches; trays seeded. Characters sit "behind" it (draw table after them).
  EP.table = function (g, x, w, G, s = 1, seed = 1, o = {}) {
    const t = el("g", { transform: `translate(${x},${G}) scale(${s})` }, g);
    const R = mulberry32(seed);
    el("rect", { x: 0, y: -66, width: w, height: 14, rx: 5, fill: o.bench || "#4F7FB0", stroke: INK, "stroke-width": 4 }, t);   // far bench (peeks)
    el("rect", { x: 30, y: -52, width: 10, height: 52, fill: "#6B6F7A" }, t); el("rect", { x: w - 40, y: -52, width: 10, height: 52, fill: "#6B6F7A" }, t);
    el("path", { d: `M40,-112 L70,0 M${w - 40},-112 L${w - 70},0`, stroke: "#6B6F7A", "stroke-width": 9 }, t);
    el("rect", { x: -10, y: -128, width: w + 20, height: 22, rx: 6, fill: o.top || "#E9D9B8", stroke: INK, "stroke-width": 5 }, t);
    el("rect", { x: -6, y: -110, width: w + 12, height: 6, fill: "rgba(0,0,0,0.12)" }, t);
    if (o.trays !== false) for (let i = 0; i < Math.floor(w / 150); i++) {
      if (R() < 0.25) continue;
      const tx = 50 + i * 150 + R() * 40;
      el("rect", { x: tx, y: -138, width: 76, height: 10, rx: 3, fill: ["#E58A3A", "#9DB49A", "#7EC8E3"][Math.floor(R() * 3)], stroke: INK, "stroke-width": 3 }, t);
      if (R() < 0.6) el("rect", { x: tx + 46, y: -158, width: 14, height: 20, fill: "#FFFFFF", stroke: INK, "stroke-width": 2.5 }, t);
      if (R() < 0.6) el("path", { d: `M${tx + 8},-138 q12,-22 26,0 z`, fill: "#F2C14E", stroke: INK, "stroke-width": 2.5 }, t);
    }
    el("rect", { x: -20, y: -44, width: w + 40, height: 16, rx: 5, fill: o.bench || "#4F7FB0", stroke: INK, "stroke-width": 4 }, t);    // near bench
    el("rect", { x: 10, y: -28, width: 10, height: 28, fill: "#6B6F7A" }, t); el("rect", { x: w - 20, y: -28, width: 10, height: 28, fill: "#6B6F7A" }, t);
    el("ellipse", { cx: w / 2, cy: 4, rx: w / 2 + 30, ry: 10, fill: "rgba(30,27,34,0.12)" }, t);
    return t;
  };

  // ---------- hallway ----------
  EP.hallway = function (svg, g, G, o = {}) {
    const x0 = o.x0 ?? -1400, x1 = o.x1 ?? 3600, wall = o.wall || "#E8DFC9";
    el("rect", { x: x0, y: -600, width: x1 - x0, height: G + 600, fill: wall }, g);
    el("rect", { x: x0, y: -600, width: x1 - x0, height: 640, fill: shade(wall, -0.06) }, g);
    // fluorescent panels
    for (let i = x0; i < x1; i += 420) { el("rect", { x: i + 100, y: 10, width: 220, height: 22, rx: 4, fill: "#FFFDF2", stroke: INK, "stroke-width": 4 }, g); el("ellipse", { cx: i + 210, cy: 120, rx: 220, ry: 90, fill: "rgba(255,253,230,0.25)" }, g); }
    el("rect", { x: x0, y: 40, width: x1 - x0, height: 12, fill: C.trim }, g);
    const R = mulberry32(o.seed || 7);
    let x = x0 + 40; let k = 0;
    const items = o.items || ["lockers", "door", "lockers", "poster", "lockers", "trophy", "lockers", "door", "lockers"];
    while (x < x1) {
      const kind = items[k % items.length]; k++;
      if (kind === "lockers") {
        const n = 6, lw = 74, col = k % 4 < 2 ? C.locker1 : C.locker2;
        for (let i = 0; i < n; i++) {
          const lx = x + i * lw, top = G - 470;
          el("rect", { x: lx, y: top, width: lw, height: 470, fill: col, stroke: INK, "stroke-width": 5 }, g);
          for (let v = 0; v < 4; v++) el("rect", { x: lx + 16, y: top + 30 + v * 14, width: lw - 32, height: 5, rx: 2, fill: shade(col, -0.3) }, g);
          el("rect", { x: lx + lw - 20, y: top + 200, width: 8, height: 46, rx: 3, fill: "#D7DDE2", stroke: INK, "stroke-width": 2.5 }, g);
          el("rect", { x: lx + 6, y: top + 6, width: 8, height: 456, fill: shade(col, 0.22), opacity: 0.6 }, g);
          if (R() < 0.18) { el("rect", { x: lx + 14, y: top + 110, width: 36, height: 44, fill: ["#FFF6C7", "#F7C6D0", "#CDE4EC"][Math.floor(R() * 3)], stroke: INK, "stroke-width": 2, transform: `rotate(${(R() - 0.5) * 14},${lx + 32},${top + 132})` }, g); }
        }
        el("rect", { x: x - 6, y: G - 476, width: n * lw + 12, height: 12, fill: shade(col, -0.35) }, g);
        x += n * lw + 60;
      } else if (kind === "door") {
        el("rect", { x, y: G - 400, width: 200, height: 400, fill: "#A8754F", stroke: INK, "stroke-width": 6 }, g);
        el("rect", { x: x + 40, y: G - 350, width: 70, height: 120, fill: "#BFE0EE", stroke: INK, "stroke-width": 5 }, g);
        el("circle", { cx: x + 170, cy: G - 200, r: 10, fill: "#E9C46A", stroke: INK, "stroke-width": 3 }, g);
        el("rect", { x: x + 40, y: G - 470, width: 120, height: 46, rx: 6, fill: "#FFFFFF", stroke: INK, "stroke-width": 4 }, g);
        txt(g, x + 100, G - 447, String(100 + Math.floor(R() * 120)), 30, INK);
        x += 260;
      } else if (kind === "poster") {
        const ps = o.posters || [["SPIRIT WEEK", "#F2C14E"], ["DRAMA CLUB AUDITIONS", "#D98C8C"], ["VOTE MAYA · CLASS PREZ", "#9DB49A"]];
        const [label, c] = ps[Math.floor(R() * ps.length)];
        el("rect", { x, y: G - 520, width: 300, height: 200, fill: c, stroke: INK, "stroke-width": 5, transform: `rotate(${(R() - 0.5) * 4},${x + 150},${G - 420})` }, g);
        label.split(" · ").forEach((s, i, a) => txt(g, x + 150, G - 430 + (i - (a.length - 1) / 2) * 50, s, s.length > 14 ? 30 : 42, INK));
        el("rect", { x: x + 40, y: G - 190, width: 220, height: 100, rx: 8, fill: "#B9C2C9", stroke: INK, "stroke-width": 4 }, g);   // fountain
        el("path", { d: `M${x + 150},${G - 190} q10,-30 30,-10`, fill: "none", stroke: "#7EC8E3", "stroke-width": 4 }, g);
        x += 360;
      } else if (kind === "trophy") {
        el("rect", { x, y: G - 480, width: 340, height: 300, fill: "#7A5238", stroke: INK, "stroke-width": 6 }, g);
        el("rect", { x: x + 14, y: G - 466, width: 312, height: 272, fill: "#CDE4EC", stroke: INK, "stroke-width": 4 }, g);
        for (let i = 0; i < 4; i++) { const tx = x + 50 + i * 80; el("path", { d: `M${tx - 18},${G - 380} h36 q0,40 -18,46 q-18,-6 -18,-46 z M${tx - 6},${G - 334} h12 v20 h12 v10 h-36 v-10 h12 z`, fill: "#E9C46A", stroke: INK, "stroke-width": 3 }, g); }
        el("path", { d: `M${x + 14},${G - 330} H${x + 326}`, stroke: "#7A5238", "stroke-width": 6 }, g);
        x += 400;
      }
    }
    el("rect", { x: x0, y: G, width: x1 - x0, height: 800, fill: "#D9D2C2" }, g);
    for (let i = x0; i < x1; i += 160) el("path", { d: `M${i},${G} L${i - 120},${G + 400}`, stroke: "rgba(0,0,0,0.06)", "stroke-width": 3 }, g);
    for (let i = x0 + 200; i < x1; i += 420) el("ellipse", { cx: i, cy: G + 70, rx: 110, ry: 14, fill: "rgba(255,255,255,0.45)" }, g);
    el("rect", { x: x0, y: G, width: x1 - x0, height: 18, fill: "#4E4A44" }, g);
  };

  // ---------- school exterior (finale) ----------
  EP.exterior = function (svg, g, G) {
    el("rect", { x: 300, y: G - 520, width: 1320, height: 520, fill: "#C9775B", stroke: INK, "stroke-width": 6 }, g);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) { const wx = 360 + i * 160, wy = G - 470 + r * 190; el("rect", { x: wx, y: wy, width: 100, height: 120, fill: "#FFE7A8", stroke: INK, "stroke-width": 5 }, g); el("path", { d: `M${wx + 50},${wy} V${wy + 120} M${wx},${wy + 60} H${wx + 100}`, stroke: INK, "stroke-width": 3 }, g); }
    el("path", { d: `M260,${G - 520} L960,${G - 700} L1660,${G - 520} Z`, fill: "#8A4F3E", stroke: INK, "stroke-width": 6 }, g);
    el("rect", { x: 740, y: G - 612, width: 440, height: 70, rx: 8, fill: C.school, stroke: INK, "stroke-width": 5 }, g);
    txt(g, 960, G - 577, "RIVERSIDE HIGH", 40, "#FFE7A0", { font: "Outfit" });
    el("rect", { x: 880, y: G - 190, width: 160, height: 190, fill: "#5A3A2A", stroke: INK, "stroke-width": 5 }, g);
    el("rect", { x: 1700, y: G - 600, width: 10, height: 600, fill: "#8E8A86", stroke: INK, "stroke-width": 2 }, g);
    el("path", { d: `M1710,${G - 590} l110,20 l-110,24 z`, fill: C.school, stroke: INK, "stroke-width": 3 }, g);
  };

  // ---------- screen-space HUD: the 7-level ladder ----------
  const LEVELS = ["INVISIBLE", "THE NPC", "THE FUNNY ONE", "GROUP CHAT ADMIN", "THE CONNECTOR", "MAIN CHARACTER", "???"];
  EP.LEVELS = LEVELS;
  EP.Ladder = function (parent, spec) {
    const s = Object.assign({ x: 90, y: 230, h: 560, show: [[0, 1]], level: [[0, 1]], unlock: 999 }, spec);
    if (s.hide != null) s.show = [[0, s.from ?? 1], [s.hide, 1], [s.hide + 0.5, 0]];
    const g = el("g", {}, parent), rungs = [];
    el("rect", { x: s.x - 22, y: s.y - 30, width: 210, height: s.h + 60, rx: 18, fill: "rgba(30,27,34,0.55)" }, g);
    el("path", { d: `M${s.x},${s.y} V${s.y + s.h} M${s.x + 40},${s.y} V${s.y + s.h}`, stroke: "#F4F1EA", "stroke-width": 6 }, g);
    for (let i = 0; i < 7; i++) {
      const y = s.y + s.h - (i + 0.5) * (s.h / 7);
      const r = el("rect", { x: s.x - 6, y: y - 7, width: 52, height: 14, rx: 6, fill: "#F4F1EA", stroke: INK, "stroke-width": 3 }, g);
      const n = txt(g, s.x + 66, y, String(i + 1), 30, "#F4F1EA", { font: "Outfit", anchor: "start" });
      const l = txt(g, s.x + 96, y, i === 6 ? "🔒" : "", 22, "#F4F1EA", { anchor: "start" });
      rungs.push({ r, n, l, y });
    }
    const dot = el("circle", { r: 16, fill: PAL.rude, stroke: INK, "stroke-width": 4 }, g);
    return {
      g, update(t) {
        const show = sampleTrack(s.show, t, 1), lv = sampleTrack(s.level, t, 1);
        g.setAttribute("opacity", show); g.setAttribute("transform", `translate(${-260 * (1 - show)},0)`);
        rungs.forEach((R, i) => { const on = Math.abs(lv - (i + 1)) < 0.5; R.r.setAttribute("fill", on ? (i === 6 && t >= s.unlock ? PAL.kind : PAL.rude) : (i === 6 && t >= s.unlock ? PAL.kind : "#F4F1EA")); R.n.setAttribute("font-size", on ? 40 : 30); if (i === 6) R.l.textContent = t >= s.unlock ? "" : "🔒"; });
        const y = s.y + s.h - (lv - 0.5) * (s.h / 7);
        dot.setAttribute("cx", s.x + 20); dot.setAttribute("cy", y); dot.setAttribute("fill", lv > 6.5 && t >= s.unlock ? PAL.kind : PAL.rude);
      }
    };
  };

  // big slam-in level title (screen space)
  EP.LevelCard = function (parent, spec) {
    const s = Object.assign({ x: 960, y: 150, color: PAL.rude }, spec);
    const g = el("g", { opacity: 0 }, parent);
    const pill = el("rect", { x: -150, y: -46, width: 300, height: 92, rx: 46, fill: s.color, stroke: INK, "stroke-width": 6 }, g);
    txt(g, 0, 2, "LEVEL " + s.n, 60, "#FFFFFF", { font: "Outfit" });
    const nm = txt(g, 0, 98, s.name, 66, INK, { font: "Outfit", attrs: { stroke: "#FFFFFF", "stroke-width": 14, "paint-order": "stroke", "stroke-linejoin": "round" } });
    return { g, update(t) { const k = clamp((t - s.t0) / 0.35, 0, 1), ko = clamp((t - s.t1) / 0.3, 0, 1); const vis = t >= s.t0 && t < s.t1 + 0.3; g.setAttribute("opacity", vis ? 1 - ko : 0); const sc = EASE.back(k) * (1 + 0.6 * (1 - Math.min(1, k * 1.4))) ; g.setAttribute("transform", `translate(${s.x},${s.y - 40 * ko}) scale(${Math.max(0.001, k < 1 ? 1.6 - 0.6 * EASE.out(k) : 1)}) rotate(${(1 - EASE.out(k)) * -6})`); } };
  };

  // floating label over a head; texts: [[t, "TEXT", color]]
  EP.Tag = function (parent, spec) {
    const s = Object.assign({ lift: 150, size: 40 }, spec);
    const g = el("g", { opacity: 0 }, parent);
    const box = el("rect", { y: -28, height: 56, rx: 12, stroke: INK, "stroke-width": 4 }, g);
    const tx = txt(g, 0, 1, "", s.size, "#FFFFFF", { font: "Outfit" });
    el("path", { d: "M-10,27 L0,44 L10,27 Z", fill: INK }, g);
    let cur = null;
    return { g, update(t, a) {
      let e = null; for (const k of s.texts) if (t >= k[0]) e = k;
      const vis = e && t >= s.t0 && t < s.t1 + 0.25;
      g.setAttribute("opacity", vis ? 1 - clamp((t - s.t1) / 0.25, 0, 1) : 0);
      if (!e) return;
      if (cur !== e) { cur = e; tx.textContent = e[1]; const w = e[1].length * s.size * 0.62 + 34; box.setAttribute("x", -w / 2); box.setAttribute("width", w); box.setAttribute("fill", e[2] || INK); }
      const flip = clamp((t - e[0]) / 0.25, 0, 1), sy = Math.abs(Math.cos(Math.min(1, flip) * Math.PI)) * (flip < 0.5 && e !== s.texts[0] ? 1 : 1);
      const k = clamp((t - s.t0) / 0.3, 0, 1);
      g.setAttribute("transform", `translate(${a.x},${a.y - s.lift + Math.sin(t * 3) * 4}) scale(${Math.max(0.001, EASE.back(k))},${Math.max(0.05, e === s.texts[0] ? 1 : Math.abs(Math.cos(flip * Math.PI)))})`);
    } };
  };

  // sunglasses that follow a head
  EP.Shades = function (parent) {
    const g = el("g", {}, parent);
    el("path", { d: "M-34,-6 L34,-6", stroke: INK, "stroke-width": 5 }, g);
    el("path", { d: "M-32,-8 h26 q0,22 -14,22 q-12,0 -12,-22 z M6,-8 h26 q0,22 -14,22 q-12,0 -12,-22 z", fill: "#1E1B22", stroke: INK, "stroke-width": 3 }, g);
    el("path", { d: "M-26,-4 l8,0 l-6,8 z M12,-4 l8,0 l-6,8 z", fill: "rgba(255,255,255,0.6)" }, g);
    return { update(t, c, facing = 1, on = 1) { g.setAttribute("opacity", on); g.setAttribute("transform", `translate(${c.headX + 8 * facing},${c.headY - 2}) scale(${facing},1)`); } };
  };

  // aura counter: big number that ticks from a to b
  EP.Aura = function (parent, spec) {
    const s = Object.assign({ from: 0, to: -1000, dur: 1.4 }, spec);
    const g = el("g", { opacity: 0 }, parent);
    const t1 = txt(g, 0, 0, "", 72, PAL.rude, { font: "Outfit", attrs: { stroke: "#FFFFFF", "stroke-width": 12, "paint-order": "stroke" } });
    txt(g, 0, 62, "AURA", 40, INK, { font: "Outfit", attrs: { stroke: "#FFFFFF", "stroke-width": 10, "paint-order": "stroke" } });
    return { update(t, x, y) { const k = clamp((t - s.t0) / s.dur, 0, 1); const vis = t >= s.t0 && t < s.t1; g.setAttribute("opacity", vis ? 1 - clamp((t - s.t1 + 0.3) / 0.3, 0, 1) : 0); const v = Math.round(s.from + (s.to - s.from) * EASE.out(k)); t1.textContent = (v > 0 ? "+" : "") + v; g.setAttribute("transform", `translate(${x},${y}) scale(${0.6 + 0.4 * EASE.back(clamp((t - s.t0) / 0.3, 0, 1))}) rotate(${-6 + Math.sin(t * 20) * (k < 1 ? 3 : 0)})`); } };
  };

  // padlock that bursts open
  EP.Lock = function (parent, spec) {
    const s = Object.assign({ s: 1, tOpen: 999 }, spec);
    const g = el("g", {}, parent), sh = el("path", { d: "M-40,0 V-40 Q-40,-90 0,-90 Q40,-90 40,-40 V0", fill: "none", stroke: "#8E8A86", "stroke-width": 18, "stroke-linecap": "round" }, g);
    const body = el("rect", { x: -64, y: -10, width: 128, height: 110, rx: 18, fill: "#C9A227", stroke: INK, "stroke-width": 6 }, g);
    el("circle", { cx: 0, cy: 36, r: 14, fill: INK }, g); el("rect", { x: -5, y: 40, width: 10, height: 30, fill: INK }, g);
    return { g, update(t, x, y, show = 1) { const k = clamp((t - s.tOpen) / 0.5, 0, 1); sh.setAttribute("transform", `translate(${k * 40},${-k * 40}) rotate(${k * 30})`); body.setAttribute("fill", k > 0 ? PAL.kind : "#C9A227"); const shake = t < s.tOpen && t > s.tOpen - 0.8 ? Math.sin(t * 60) * 6 : 0; g.setAttribute("opacity", show * (1 - clamp((t - s.tOpen - 0.6) / 0.4, 0, 1))); g.setAttribute("transform", `translate(${x + shake},${y}) scale(${s.s * (1 + 0.3 * Math.sin(k * Math.PI))})`); } };
  };

  // ---------- phone with group chat ----------
  // msgs: [[t, name, text, color, mine]]; header; notif count track
  EP.Phone = function (parent, spec) {
    const s = Object.assign({ x: 960, y: 560, s: 1, title: "grade 9 🔥 (148)", msgs: [] }, spec);
    const g = el("g", {}, parent), inner = el("g", {}, g);
    el("rect", { x: -260, y: -500, width: 520, height: 1000, rx: 64, fill: "#1E1B22", stroke: INK, "stroke-width": 6 }, inner);
    el("rect", { x: -236, y: -476, width: 472, height: 952, rx: 46, fill: "#F4F1EA" }, inner);
    el("rect", { x: -236, y: -476, width: 472, height: 120, fill: "#2F6F73" }, inner);
    el("rect", { x: -60, y: -470, width: 120, height: 26, rx: 13, fill: "#1E1B22" }, inner);
    txt(inner, 0, -395, s.title, 34, "#FFFFFF");
    const cid = "phc" + (UID++); const cp = el("clipPath", { id: cid }, inner); el("rect", { x: -236, y: -356, width: 472, height: 760 }, cp);
    const feed = el("g", { "clip-path": `url(#${cid})` }, inner), stack = el("g", {}, feed);
    el("rect", { x: -236, y: 404, width: 472, height: 72, fill: "#E5DED0" }, inner);
    el("rect", { x: -210, y: 418, width: 340, height: 44, rx: 22, fill: "#FFFFFF", stroke: "#BDB4A4", "stroke-width": 2 }, inner);
    el("circle", { cx: 186, cy: 440, r: 24, fill: "#2F6F73" }, inner);
    const items = s.msgs.map(([mt, name, text, color, mine], i) => {
      const m = el("g", { opacity: 0 }, stack);
      if (name === "*") { const w = Math.min(440, text.length * 15 + 40); el("rect", { x: -w / 2, y: 0, width: w, height: 40, rx: 20, fill: "#E5DED0" }, m); txt(m, 0, 21, text, 22, "#6B6F7A", { weight: 800 }); return { m, mt, h: 40 }; }
      if (name === "#") { el("rect", { x: -170, y: 0, width: 340, height: 200, rx: 18, fill: "#DCE6EC", stroke: INK, "stroke-width": 3 }, m); el("path", { d: "M-130,170 l80,-90 l60,60 l40,-40 l80,70 z", fill: "#9DB49A", stroke: INK, "stroke-width": 3 }, m); el("circle", { cx: 90, cy: 50, r: 20, fill: "#F2C14E", stroke: INK, "stroke-width": 3 }, m); txt(m, 0, 186, text, 22, INK, { weight: 800 }); return { m, mt, h: 200 }; }
      const lines = []; let cur = ""; text.split(" ").forEach((w) => { if ((cur + " " + w).trim().length > 20) { lines.push(cur.trim()); cur = w; } else cur += " " + w; }); lines.push(cur.trim());
      const h = 30 + lines.length * 38 + (mine ? 0 : 26), w = 340;
      const bx = mine ? 220 - w : -170;
      if (!mine) { el("circle", { cx: -200, cy: h - 20, r: 20, fill: color || "#9DB49A", stroke: INK, "stroke-width": 3 }, m); }
      el("rect", { x: bx, y: 0, width: w, height: h, rx: 20, fill: mine ? "#2F6F73" : "#FFFFFF", stroke: INK, "stroke-width": 3 }, m);
      if (!mine) txt(m, bx + 18, 22, name, 22, color || "#2F6F73", { anchor: "start" });
      lines.forEach((l, j) => txt(m, bx + 18, (mine ? 34 : 60) + j * 38, l, 30, mine ? "#FFFFFF" : INK, { anchor: "start", weight: 800 }));
      return { m, mt, h };
    });
    return { g, update(t, o = {}) {
      let y = 380; const vis = [];
      for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; if (t < it.mt) { it.m.setAttribute("opacity", 0); continue; } vis.push(it); }
      // newest at bottom; slide up
      let acc = 0; vis.forEach((it) => { const k = clamp((t - it.mt) / 0.25, 0, 1); acc += (it.h + 18) * EASE.out(k); it.m.setAttribute("opacity", k); it.m.setAttribute("transform", `translate(0,${y - acc}) scale(${1})`); });
      const sh = o.shake || 0;
      g.setAttribute("transform", `translate(${s.x + sh * Math.sin(t * 50) * 6},${s.y + (o.dy || 0)}) scale(${s.s * (o.z || 1)}) rotate(${o.r || 0})`);
    } };
  };

  // ---------- social network map ----------
  // nodes on a jittered grid, edges to near neighbours. spread: { src, t0, speed (s per hop), color }
  EP.Network = function (parent, spec) {
    const s = Object.assign({ cols: 12, rows: 7, x: 260, y: 200, w: 1400, h: 680, seed: 21 }, spec);
    const R = mulberry32(s.seed), N = [], E = [];
    for (let r = 0; r < s.rows; r++) for (let c = 0; c < s.cols; c++) N.push({ x: s.x + (c + 0.5 + (R() - 0.5) * 0.7) * s.w / s.cols, y: s.y + (r + 0.5 + (R() - 0.5) * 0.7) * s.h / s.rows, adj: [], hub: R() < 0.08 });
    N.forEach((a, i) => N.forEach((b, j) => { if (j <= i) return; const d = Math.hypot(a.x - b.x, a.y - b.y); const lim = (a.hub || b.hub) ? 300 : 170; if (d < lim && R() < 0.8) { E.push([i, j]); a.adj.push(j); b.adj.push(i); } }));
    const eg = el("g", {}, parent), ng = el("g", {}, parent);
    const EL = E.map(() => el("line", { stroke: "#BDB4A4", "stroke-width": 3 }, eg));
    const NL = N.map((n) => { const g = el("g", { transform: `translate(${n.x},${n.y})` }, ng); const c = el("circle", { r: n.hub ? 20 : 13, fill: "#F4F1EA", stroke: INK, "stroke-width": 3.5 }, g); return { g, c }; });
    E.forEach(([i, j], k) => { EL[k].setAttribute("x1", N[i].x); EL[k].setAttribute("y1", N[i].y); EL[k].setAttribute("x2", N[j].x); EL[k].setAttribute("y2", N[j].y); });
    const hop = (src) => { const d = N.map(() => 1e9); d[src] = 0; const q = [src]; while (q.length) { const u = q.shift(); N[u].adj.forEach((v) => { const w = (N[u].hub || N[v].hub) ? 0.5 : 1; if (d[u] + w < d[v]) { d[v] = d[u] + w; q.push(v); } }); } return d; };
    const cache = {};
    return { N, E, update(t, spreads) {
      const col = N.map(() => null), ks = N.map(() => 0);
      spreads.forEach((sp) => { const d = cache[sp.src] || (cache[sp.src] = hop(sp.src)); N.forEach((n, i) => { const k = clamp((t - sp.t0 - d[i] * sp.speed) / 0.3, 0, 1); if (k > 0 && (sp.cap == null || d[i] <= sp.cap)) { col[i] = sp.color; ks[i] = k; } }); });
      NL.forEach((L, i) => { L.c.setAttribute("fill", col[i] || "#F4F1EA"); L.g.setAttribute("transform", `translate(${N[i].x},${N[i].y}) scale(${1 + 0.5 * Math.sin(ks[i] * Math.PI)})`); });
      E.forEach(([i, j], k) => { const on = col[i] && col[j] && col[i] === col[j]; EL[k].setAttribute("stroke", on ? col[i] : "#BDB4A4"); EL[k].setAttribute("stroke-width", on ? 5 : 3); });
    } };
  };

  // hand-written reveal text (left-to-right wipe), plus underline
  EP.Write = function (parent, spec) {
    const s = Object.assign({ size: 56, color: INK, anchor: "middle", dur: 0.6, font: "Nunito" }, spec);
    const id = "wr" + (UID++), cp = el("clipPath", { id }, parent), r = el("rect", { y: s.y - s.size, height: s.size * 2, width: 0 }, cp);
    const t = txt(parent, s.x, s.y, s.text, s.size, s.color, { anchor: s.anchor, font: s.font, attrs: { "clip-path": `url(#${id})` } });
    const w = s.w || s.text.length * s.size * 0.72, x0 = s.anchor === "middle" ? s.x - w / 2 - 20 : s.x - 10;
    r.setAttribute("x", x0);
    return { t, update(tt) { r.setAttribute("width", (w + 40) * clamp((tt - s.t0) / s.dur, 0, 1)); t.setAttribute("opacity", s.t1 ? 1 - clamp((tt - s.t1) / 0.3, 0, 1) : 1); } };
  };

  // source chip, lower left (screen space)
  EP.Source = function (parent, spec) {
    const g = el("g", { opacity: 0 }, parent);
    const w = spec.text.length * 15.5 + 50;
    el("rect", { x: 60, y: 960, width: w, height: 54, rx: 27, fill: "rgba(30,27,34,0.78)" }, g);
    txt(g, 86, 988, "📄 " + spec.text, 26, "#F4F1EA", { anchor: "start", weight: 800 });
    return { update(t) { const k = clamp((t - spec.t0) / 0.3, 0, 1), ko = clamp((t - spec.t1) / 0.3, 0, 1); g.setAttribute("opacity", k * (1 - ko)); g.setAttribute("transform", `translate(${-30 * (1 - k)},0)`); } };
  };

  // phone buzz glyph near a head
  EP.Buzz = function (parent) {
    const g = el("g", { opacity: 0 }, parent);
    el("path", { d: "M-22,-14 q-8,14 0,28 M22,-14 q8,14 0,28 M-32,-22 q-12,22 0,44 M32,-22 q12,22 0,44", fill: "none", stroke: PAL.rude, "stroke-width": 4, "stroke-linecap": "round" }, g);
    return { update(t, x, y, t0, dur = 0.8) { const on = t >= t0 && t < t0 + dur; g.setAttribute("opacity", on ? 1 : 0); g.setAttribute("transform", `translate(${x + Math.sin(t * 70) * 2},${y}) scale(${1 + 0.1 * Math.sin(t * 30)})`); } };
  };

  window.EP = EP;
})();

/* ---------- cast, crowds and scene boilerplate ---------- */
(function () {
  const SR = window.SR, EP = window.EP; const { Character, mulberry32, el } = SR;
  const base = {
    nia:    { color: "#5DA9A6", outfit: "hoodie", hair: "bun", hairColor: "#5B3A29", pants: "#3A4A63", shoes: "#E9E1D2", seed: 21, scale: 0.98 },
    jordan: { color: "#2F3E5C", outfit: "jacket", hair: "spiky", hairColor: "#3B2B22", pants: "#46524A", shoes: "#FFFFFF", seed: 33, scale: 1.04 },
    theo:   { color: "#E58A3A", outfit: "tee", hair: "curly", hairColor: "#5B3A29", glasses: true, pants: "#3A4A63", seed: 41, scale: 0.98 },
    priya:  { color: "#9A8AB0", outfit: "shirt", hair: "long", hairColor: "#2A2228", pants: "#2F3A4A", seed: 52, scale: 0.96 },
    marcus: { color: "#4E8A5A", outfit: "hoodie", hair: "short", hairColor: "#2A2228", pants: "#5A4E44", seed: 63, scale: 1.06 },
    dev:    { color: "#C2A27A", outfit: "tee", hair: "cap", hairColor: "#C8452F", pants: "#3A4A63", seed: 74, scale: 0.96 },
    okafor: { color: "#3F7F87", outfit: "dress", hair: "bun", hairColor: "#2A2228", glasses: true, pants: "#3F7F87", seed: 85, scale: 1.12 },
  };
  EP.cast = (who, spec) => Object.assign({ id: who }, base[who], spec);
  const COLS = ["#6F8299", "#9DB49A", "#8C5E78", "#7B9E87", "#C2A27A", "#5E7C99", "#9A8AB0", "#B07A63", "#D98C8C", "#E8C79B", "#4F7FB0", "#A5B86A"];
  const HAIRS = ["short", "ponytail", "bun", "curly", "cap", "long", "spiky", "afro", "none", "short", "long"];
  const HC = ["#2A2228", "#2A2228", "#3B2B22", "#5B3A29", "#8A5A35", "#C79A5A", "#2A2228"];
  const OUT = ["hoodie", "tee", "shirt", "jacket", "tee", "hoodie", "dress"];
  // a row of seated (or standing) kids. turn: [t, dir] -> everyone snaps to face dir at t.
  EP.kids = function (parent, o) {
    const R = mulberry32(o.seed || 1), P = [];
    const xs = o.xs || Array.from({ length: o.n }, (_, i) => o.x0 + (i + 0.5) * (o.x1 - o.x0) / o.n + (R() - 0.5) * 30);
    xs.forEach((x, i) => {
      const f0 = o.facing ? o.facing(i, x) : (i % 2 ? -1 : 1);
      const facing = [[0, f0]]; const mood = [[0, ["content", "happy", "neutral", "joy"][Math.floor(R() * 4)], 0]];
      (o.turns || []).forEach(([t, d, m]) => { const dd = typeof d === "function" ? d(i, x) : d; if (dd == null) return; facing.push([t + R() * 0.12, facing[facing.length - 1][1]], [t + 0.12 + R() * 0.12, dd]); if (m) mood.push([t, m, 0.2]); });
      const talk = []; let tt = R() * 2; while (tt < (o.dur || 30)) { const len = 0.6 + R() * 1.6; if (R() < 0.6) talk.push([tt, tt + len]); tt += len + 0.4 + R() * 1.8; }
      const spec = Object.assign({
        id: `${o.idp || "k"}-${i}`, color: COLS[Math.floor(R() * COLS.length)], hair: HAIRS[Math.floor(R() * HAIRS.length)], hairColor: HC[Math.floor(R() * HC.length)],
        outfit: OUT[Math.floor(R() * OUT.length)], pants: ["#3A4A63", "#2F3A4A", "#5A4E44", "#6B6F7A"][Math.floor(R() * 4)], seed: Math.floor(R() * 999), glasses: R() < 0.2,
        scale: (o.scale || 0.9) * (0.94 + R() * 0.1), x: [[0, x]], y: [[0, o.y]], facing, mood, noWalk: true,
        pose: [[0, o.pose || "sit", 0]], talk: o.quiet ? [] : talk, look: [[0, { x: 0, y: 0 }]],
      }, o.spec ? o.spec(i, x, R) : {});
      P.push(Character(parent, spec));
    });
    return { people: P, update: (t) => P.map((p) => p.update(t)) };
  };
  // scene boilerplate: build(svg, T) returns draw(t)
  EP.scene = function (id, build) {
    const svg = document.getElementById(id + "-svg"), T = window.TIM[id];
    const draw = build(svg, T);
    const tl = gsap.timeline({ paused: true });
    SR.drive(tl, T.D, draw);
    window.__timelines[id] = tl;
  };
})();
/* word-time lookup: W(T, "n05", "doors") -> scene-local start of that word (fallback: fraction of line) */
window.EP.W = function (T, id, word, nth = 0, frac = 0.5) {
  const ws = (window.TIMW || {})[id]; const w = word.toLowerCase();
  if (ws) { let k = 0; for (const [tx, st] of ws) { if (tx.toLowerCase().replace(/[^a-z0-9']/g, "").startsWith(w)) { if (k === nth) return T[id] + st; k++; } } }
  return T[id] + (T[id + "_e"] - T[id]) * frac;
};
window.EP.chair = function (g, x, y, s = 1, color = "#E58A3A") {
  const SR = window.SR, c = SR.el("g", {}, g), INK = SR.PAL.ink;
  SR.el("rect", { x: -28, y: -236, width: 16, height: 186, rx: 5, fill: color, stroke: INK, "stroke-width": 4 }, c); SR.el("rect", { x: -34, y: -240, width: 28, height: 50, rx: 8, fill: color, stroke: INK, "stroke-width": 4 }, c);
  SR.el("rect", { x: -30, y: -62, width: 64, height: 12, rx: 4, fill: color, stroke: INK, "stroke-width": 4 }, c);
  SR.el("path", { d: "M-24,-50 L-28,0 M26,-50 L30,0", stroke: "#6B6F7A", "stroke-width": 7 }, c);
  return { g: c, set(dx = 0, rot = 0) { c.setAttribute("transform", `translate(${x + dx},${y}) scale(${s}) rotate(${rot},0,0)`); } };
};
