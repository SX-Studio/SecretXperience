/* Ep4 kit: the MrBeast-style progress devices, in Social Ripple colours.
   EP4K.counter(svg, keys)  — top-left "DAY 07 / 30" tear-off calendar + "HELLOS 7" tally. keys = [[t, day, hellos]] (day 0 = hidden)
   EP4K.meter(svg, keys)    — "TALKED  2h 40m" pill with a filling bar. keys = [[t, minutes]] (eased between keys); show window [t0,t1]
   EP4K.grade(el, keys)     — CSS colour grade on the 3D canvas: keys = [[t, sat, warm]] (sat 0.35..1.1, warm -1..1)
   All are pure functions of t (seek-safe). */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, a, p) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const back = (k) => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  const io = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const INK = "#1E1B22", CREAM = "#FFF6E4", RED = "#E2574C", TEAL = "#3FA7A0";
  function step(keys, t) { let k = keys[0]; for (const x of keys) if (t >= x[0]) k = x; return k; }

  function counter(svg, keys, o = {}) {
    const X = o.x ?? 70, Y = o.y ?? 56, g = el("g", { opacity: 0 }, svg);
    el("rect", { x: X + 6, y: Y + 10, width: 236, height: 132, rx: 18, fill: "rgba(18,12,34,0.35)" }, g);       // soft shadow
    const card = el("g", {}, g);
    el("rect", { x: X, y: Y, width: 236, height: 132, rx: 18, fill: CREAM, stroke: INK, "stroke-width": 5 }, card);
    el("rect", { x: X, y: Y, width: 236, height: 36, rx: 18, fill: RED, stroke: INK, "stroke-width": 5 }, card);
    el("rect", { x: X + 3, y: Y + 22, width: 230, height: 14, fill: RED }, card);
    [X + 56, X + 180].forEach((rx) => el("circle", { cx: rx, cy: Y + 4, r: 7, fill: CREAM, stroke: INK, "stroke-width": 4 }, card));
    const lbl = el("text", { x: X + 118, y: Y + 27, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 22, fill: CREAM, "letter-spacing": 3 }, card); lbl.textContent = "DAY";
    const num = el("text", { x: X + 104, y: Y + 108, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 70, fill: INK }, card);
    const of = el("text", { x: X + 186, y: Y + 106, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 30, fill: "#8A7F72" }, card); of.textContent = "/" + (o.of || 30);
    // the page that tears off when the day changes
    const page = el("g", { opacity: 0 }, g); el("rect", { x: X, y: Y + 36, width: 236, height: 96, rx: 14, fill: CREAM, stroke: INK, "stroke-width": 5 }, page);
    const pnum = el("text", { x: X + 104, y: Y + 108, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 70, fill: INK }, page);
    // hello tally pill
    const tally = el("g", {}, g); el("rect", { x: X, y: Y + 148, width: 236, height: 50, rx: 25, fill: TEAL, stroke: INK, "stroke-width": 5 }, tally);
    const hw = el("text", { x: X + 118, y: Y + 182, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 27, fill: "#FFFFFF", "letter-spacing": 1 }, tally);
    const pad = (n) => (n < 10 ? "0" + n : "" + n);
    return { g, update(t) {
      const k = step(keys, t), day = k[1], hel = k[2];
      g.setAttribute("opacity", day > 0 ? 1 : 0); if (!day) return;
      num.textContent = pad(day); hw.textContent = `${o.label || "HELLOS"}  ${hel}`;
      // tear-off: previous day's page flies off for 0.5 s after a change
      const i = keys.indexOf(k), prev = i > 0 ? keys[i - 1] : null, u = clamp((t - k[0]) / 0.5, 0, 1);
      if (prev && prev[1] && prev[1] !== day && u < 1) { page.setAttribute("opacity", 1 - u * u); pnum.textContent = pad(prev[1]);
        page.setAttribute("transform", `translate(${X + 118},${Y + 84}) rotate(${-28 * io(u)}) translate(${-X - 118 - 40 * u},${-Y - 84 + 160 * u * u})`); }
      else page.setAttribute("opacity", 0);
      const pop = prev && prev[1] !== day ? back(clamp((t - k[0]) / 0.35, 0, 1)) : 1; card.setAttribute("transform", `translate(${X + 118},${Y + 66}) scale(${0.9 + 0.1 * pop}) translate(${-X - 118},${-Y - 66})`);
      const hb = prev && prev[2] !== hel ? back(clamp((t - k[0]) / 0.3, 0, 1)) : 1; tally.setAttribute("transform", `translate(${X + 118},${Y + 173}) scale(${0.85 + 0.15 * hb}) translate(${-X - 118},${-Y - 173})`);
    } };
  }

  function meter(svg, keys, t0, t1, o = {}) {
    const X = o.x ?? 70, Y = o.y ?? 270, g = el("g", { opacity: 0 }, svg);
    el("rect", { x: X, y: Y, width: 236, height: 96, rx: 20, fill: CREAM, stroke: INK, "stroke-width": 5 }, g);
    const lab = el("text", { x: X + 118, y: Y + 28, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 19, fill: "#8A7F72", "letter-spacing": 2 }, g); lab.textContent = "TIME TALKED";
    const val = el("text", { x: X + 118, y: Y + 58, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 28, fill: INK }, g);
    el("rect", { x: X + 18, y: Y + 70, width: 200, height: 14, rx: 7, fill: "#E8DCC6" }, g);
    const bar = el("rect", { x: X + 18, y: Y + 70, width: 0, height: 14, rx: 7, fill: "#F2A23A" }, g);
    const full = o.full || 200;                                     // bar = hours toward a casual friendship benchmark
    return { g, update(t) {
      const on = t >= t0 && t <= t1; g.setAttribute("opacity", on ? clamp(Math.min((t - t0) / 0.3, (t1 - t) / 0.3), 0, 1) : 0); if (!on) return;
      let m = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [a, va] = keys[i], [b, vb] = keys[i + 1]; if (t >= a && t <= b) m = lerp(va, vb, io((t - a) / (b - a))); else if (t > b) m = vb; }
      const h = Math.floor(m / 60), mm = Math.round(m % 60); val.textContent = h ? `${h}h ${mm}m` : `${mm} min`; bar.setAttribute("width", clamp(m / full, 0, 1) * 200);
    } };
  }

  function grade(target, keys) {
    return { update(t) { let s = keys[0][1], w = keys[0][2];
      for (let i = 0; i < keys.length - 1; i++) { const [a, sa, wa] = keys[i], [b, sb, wb] = keys[i + 1]; if (t >= a && t <= b) { const k = io((t - a) / (b - a)); s = lerp(sa, sb, k); w = lerp(wa, wb, k); } else if (t > b) { s = sb; w = wb; } }
      const sep = clamp(w, 0, 1) * 0.12, hue = w < 0 ? w * 12 : 0, bri = 1 + w * 0.03;
      target.style.filter = `saturate(${s.toFixed(3)}) sepia(${sep.toFixed(3)}) hue-rotate(${hue.toFixed(1)}deg) brightness(${bri.toFixed(3)})`; } };
  }
  window.EP4K = { counter, meter, grade };
})();
