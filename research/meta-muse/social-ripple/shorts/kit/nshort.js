/* Helpers shared by the Naruto Shorts (vertical). const N = NSHORT(K, L, C). */
(function () {
  window.NSHORT = function (K, L, C) {
    const { I, el, INKC, RED, T, S } = K, ink = K.ink, cast = [], ups = [];
    const F = (i, f) => S(i) + f * T[i][1];
    const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
    const person = (x, fl, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, ink); el("circle", { cx: x, cy: fl - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${fl} Q${x - 70 * s},${fl - 250 * s} ${x},${fl - 270 * s} Q${x + 70 * s},${fl - 250 * s} ${x + 62 * s},${fl} Z`, fill: col }, g); I.fill(ink, g, at, 0.2, { sound: false }); return g; };
    const floor = (y0) => el("path", { d: `M-200,${y0 + 300} H1280`, stroke: "#8A847A", "stroke-width": 5, fill: "none" }, ink);
    // cover-style hook block: black slab at the top of beat 0 with two big lines (present from frame 0)
    const hook = (y0, a, b, tag) => { el("path", { d: `M-200,${y0 - 1200} H1280 V${y0 - 500} L-200,${y0 - 430} Z`, fill: "#0D0D0D" }, ink);
      const t = (txt, y, size, fill) => { const e = el("text", { x: 540, y, "text-anchor": "middle", "font-family": "Anton", "font-size": size, fill, "letter-spacing": 2 }, ink); e.textContent = txt; return e; };
      t(a[0], y0 - 730, a[1], "#F4EFE6"); t(b[0], y0 - 575, b[1], RED);
      if (tag) { const g = el("g", { transform: `rotate(-3 540 ${y0 - 395})` }, ink); el("rect", { x: 540 - tag.length * 17 - 34, y: y0 - 440, width: tag.length * 34 + 68, height: 80, rx: 10, fill: "#F2C230", stroke: INKC, "stroke-width": 5 }, g); const e = el("text", { x: 540, y: y0 - 382, "text-anchor": "middle", "font-family": "Anton", "font-size": 54, fill: "#1E1B2E", "letter-spacing": 3 }, g); e.textContent = tag; } };
    const swing = (cx, y0, at) => { const top = y0 - 300, fl = y0 + 300; el("path", { d: `M${cx - 330},${fl} L${cx - 230},${top} L${cx - 130},${fl} M${cx + 130},${fl} L${cx + 230},${top} L${cx + 330},${fl} M${cx - 245},${top + 8} H${cx + 245}`, fill: "none", stroke: "#8A5A2B", "stroke-width": 10, "stroke-linecap": "round" }, ink);
      const g = el("g", {}, ink); el("path", { d: `M${cx - 70},${top + 10} V${y0 + 60} M${cx + 70},${top + 10} V${y0 + 60}`, stroke: INKC, "stroke-width": 5 }, g); el("rect", { x: cx - 92, y: y0 + 54, width: 184, height: 22, rx: 4, fill: "#A0703A", stroke: INKC, "stroke-width": 5 }, g);
      const n = mk(g, "naruto", cx, y0 + 60 + 170 * 0.8 - 74 * 0.8 + 4, 0.8, at); n.view(0, "side", 1).key(0, "sit", 0).key(0, { head: 18 }, 0).face(0, "sad");
      ups.push((t) => g.setAttribute("transform", `rotate(${(Math.sin(t * 1.3) * 3).toFixed(2)} ${cx} ${top})`)); return n; };
    return { F, mk, person, floor, hook, swing, cast, ups, tick: (t) => { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } };
  };
})();
