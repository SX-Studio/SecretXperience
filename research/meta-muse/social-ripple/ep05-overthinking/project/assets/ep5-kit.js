/* Ep5 kit (original designs): thought bubbles that follow a character's head, and the 3-rules card with a fine-print reveal.
   EP5K.thought(svg, { text, t0, t1, who, style: "warm"|"critic", side: 1|-1, size })  → { update(t) }   who = actor (uses who.b.head)
   EP5K.rules(svg, { t0, t1, reveal, lines: [r1, r2], fine })                        → { update(t) }
   All pure functions of t. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, a, p) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const back = (k) => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  const INK = "#1E1B22";
  const STY = { warm: { fill: "#FFFDF6", stroke: INK, ink: INK, font: "Nunito" }, critic: { fill: "#2B2140", stroke: "#8E6BD8", ink: "#E8DDFF", font: "Nunito" } };
  const cv = document.createElement("canvas").getContext("2d");
  function wrap(text, font, size, maxW) { cv.font = `900 ${size}px ${font}`; const words = text.split(" "), lines = []; let cur = "";
    for (const w of words) { const t = cur ? cur + " " + w : w; if (cv.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur);
    return { lines, w: Math.max(...lines.map((l) => cv.measureText(l).width)) }; }

  const REG = { t: -1, r: [] };
  function thought(svg, o) {
    const S = STY[o.style || "warm"], size = o.size || 38, g = el("g", { display: "none" }, svg);
    const body = el("g", {}, g); const txt = el("g", {}, g); const dots = [0, 1, 2].map(() => el("circle", { fill: S.fill, stroke: S.stroke, "stroke-width": 5 }, g));
    let built = false, W = 0, H = 0;
    function build() { const { lines, w } = wrap(o.text, S.font, size, 520); W = w + 70; H = lines.length * size * 1.15 + 54 + (o.style === "critic" ? 26 : 0); built = true; const ty0 = o.style === "critic" ? 12 : 0;
      // cloud: a rounded rect plus bumps around the rim
      const bumps = Math.max(5, Math.round(W / 70)), r = 30;
      for (let i = 0; i < bumps; i++) { const x = -W / 2 + 20 + (i * (W - 40)) / (bumps - 1); el("circle", { cx: x, cy: -H / 2 + 6, r, fill: S.fill, stroke: S.stroke, "stroke-width": 5 }, body); el("circle", { cx: x, cy: H / 2 - 6, r, fill: S.fill, stroke: S.stroke, "stroke-width": 5 }, body); }
      [-1, 1].forEach((s) => el("circle", { cx: s * (W / 2 - 4), cy: 0, r: H / 2 - 4, fill: S.fill, stroke: S.stroke, "stroke-width": 5 }, body));
      el("rect", { x: -W / 2 + 6, y: -H / 2 + 4, width: W - 12, height: H - 8, rx: 26, fill: S.fill }, body);
      lines.forEach((l, i) => { const t = el("text", { x: 0, y: ty0 - ((lines.length - 1) * size * 1.15) / 2 + i * size * 1.15 + size * 0.36, "text-anchor": "middle", "font-family": S.font, "font-weight": 900, "font-size": size, fill: S.ink }, txt); t.textContent = l; });
      if (o.style === "critic") el("text", { x: 0, y: -H / 2 + 26, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 20, fill: "#B9A4F0", "letter-spacing": 2 }, txt).textContent = "BEA'S INNER VOICE"; }
    return { update(t) {
      const on = t >= o.t0 && t < o.t1, head = o.who && o.who.b && o.who.b.head && o.who.b.outer.getAttribute("display") !== "none" ? o.who.b.head : null;
      if (!on || (!head && !o.at)) { g.setAttribute("display", "none"); return; } if (!built) build(); g.setAttribute("display", "inline");
      const k = clamp((t - o.t0) / 0.35, 0, 1), out = clamp((o.t1 - t) / 0.3, 0, 1), sc = (0.55 + 0.45 * back(k)) * (o.scale || 1);
      const hx = head ? head.x : o.at.x, hy = head ? head.y : o.at.y, side = o.side || 1, hk = head ? head.k || 1 : 1;
      const s0 = o.scale || 1, EW = (W / 2 + H / 2 - 4) * s0, EH = (H / 2 + 26) * s0, lift = (o.lift || 0) * (2 * EH + 18);
      const R = REG.t === t ? REG : (REG.t = t, REG.r = [], REG);
      const ov = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
      const fit = (x, y) => [clamp(x, EW + 24, 1920 - EW - 24), clamp(y, EH + 24, 1080 - EH - 24)];
      const C = [[hx + side * (EW * 0.45 + 50 * hk), hy - 130 * hk - EH - lift], [hx + side * (EW + 95 * hk), hy - 70 * hk - lift], [hx - side * (EW + 95 * hk), hy - 70 * hk - lift], [hx + side * (EW * 0.45 + 50 * hk), hy - 130 * hk - EH - lift - 2 * EH - 18]];
      const FR = o.avoid ? o.avoid(t) || [] : []; let best = null, bs = 1e18;
      C.forEach(([x0, y0], i) => { const [x, y] = fit(x0, y0), rc = [x - EW, y - EH, x + EW, y + EH]; let sc2 = Math.hypot(x - x0, y - y0) * 40 + i * 900;
        sc2 += ov(rc, [0, 0, 330, 270]) * 60; R.r.forEach((q) => (sc2 += ov(rc, q) * 60));
        sc2 += ov(rc, [hx - 70 * hk, hy - 90 * hk, hx + 70 * hk, hy + 60 * hk]) * 30; FR.forEach((f) => (sc2 += ov(rc, [f.x0, f.y0, f.x1, f.y1]) * 30)); if (sc2 < bs) { bs = sc2; best = [x, y]; } });
      if (o.place) best = fit(o.place.x, o.place.y);
      const cx = best[0], cy = best[1]; R.r.push([cx - EW - 10, cy - EH - 10, cx + EW + 10, cy + EH + 10]);
      g.setAttribute("opacity", (Math.min(k * 2, 1) * out).toFixed(3)); const bob = Math.sin(t * 2.2 + (o.t0 % 3)) * 4;
      body.setAttribute("transform", `translate(${cx.toFixed(1)},${(cy + bob).toFixed(1)}) scale(${sc.toFixed(3)})`); txt.setAttribute("transform", `translate(${cx.toFixed(1)},${(cy + bob).toFixed(1)}) scale(${sc.toFixed(3)})`);
      const tx = hx, ty = hy - 40 * hk, hk2 = Math.min(1.3, Math.max(0.6, hk)), capW = (W / 2 - 4) * s0, capR = (H / 2 + 26) * s0;
      const prev = R.r.slice(0, -1), out2 = (x, y, m) => Math.hypot(Math.max(0, Math.abs(x - cx) - capW), y - cy) > capR + m;
      let u0 = 1; for (let u = 0; u <= 1; u += 0.02) if (out2(cx + (tx - cx) * u, cy + (ty - cy) * u, 14 * hk2)) { u0 = u; break; }
      [0, 1, 2].forEach((i) => { const u = u0 + (1 - u0) * [0.14, 0.42, 0.66][i], x = cx + (tx - cx) * u, y = cy + (ty - cy) * u, d = dots[i], r = [13, 9.5, 6.5][i] * Math.min(1, sc) * hk2;
        const hidden = u0 >= 0.97 || prev.some((q) => x > q[0] - r && x < q[2] + r && y > q[1] - r && y < q[3] + r);
        d.setAttribute("cx", x.toFixed(1)); d.setAttribute("cy", y.toFixed(1)); d.setAttribute("r", hidden ? 0 : r.toFixed(1)); });
    } };
  }

  function rules(svg, o) {
    const g = el("g", { display: "none" }, svg), X = 960, Y = 520;
    el("rect", { x: X - 560, y: Y - 300, width: 1120, height: 600, rx: 34, fill: "#FFF6E4", stroke: INK, "stroke-width": 8 }, g);
    el("rect", { x: X - 560, y: Y - 300, width: 1120, height: 110, rx: 34, fill: "#E2574C", stroke: INK, "stroke-width": 8 }, g);
    el("rect", { x: X - 552, y: Y - 230, width: 1104, height: 38, fill: "#E2574C" }, g);
    const h = el("text", { x: X, y: Y - 225, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 60, fill: "#FFF6E4", "letter-spacing": 4 }, g); h.textContent = "THE RULES";
    const rows = (o.lines || []).map((l, i) => { const r = el("g", { opacity: 0 }, g); el("circle", { cx: X - 470, cy: Y - 110 + i * 120, r: 36, fill: INK }, r);
      const n = el("text", { x: X - 470, y: Y - 96 + i * 120, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 42, fill: "#FFF6E4" }, r); n.textContent = i + 1;
      const t = el("text", { x: X - 410, y: Y - 96 + i * 120, "font-family": "Outfit", "font-weight": 900, "font-size": 46, fill: INK }, r); t.textContent = l; return r; });
    const r3 = el("g", { opacity: 0 }, g); el("circle", { cx: X - 470, cy: Y + 130, r: 36, fill: INK }, r3);
    el("text", { x: X - 470, y: Y + 144, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 42, fill: "#FFF6E4" }, r3).textContent = "3";
    const fine = el("text", { x: X - 410, y: Y + 140, "font-family": "Nunito", "font-weight": 800, "font-size": 15, fill: "#6A5E52", "letter-spacing": 0.5 }, r3); fine.textContent = o.fine;
    const lens = el("g", { opacity: 0 }, g); el("circle", { cx: 0, cy: 0, r: 70, fill: "none", stroke: INK, "stroke-width": 9 }, lens); el("line", { x1: 50, y1: 50, x2: 105, y2: 105, stroke: INK, "stroke-width": 14, "stroke-linecap": "round" }, lens);
    return { update(t) {
      const win = (a, b) => t >= a && t < b; const on = win(o.t0, o.t1) || (o.reveal && win(o.reveal[0], o.reveal[1]));
      g.setAttribute("display", on ? "inline" : "none"); if (!on) return;
      const rv = o.reveal && win(o.reveal[0], o.reveal[1]), a = rv ? o.reveal[0] : o.t0, b = rv ? o.reveal[1] : o.t1;
      const k = back(clamp((t - a) / 0.4, 0, 1)), out = clamp((b - t) / 0.3, 0, 1);
      g.setAttribute("opacity", out.toFixed(3)); g.setAttribute("transform", `translate(${X},${Y}) scale(${(0.85 + 0.15 * k).toFixed(3)}) translate(${-X},${-Y})`);
      rows.forEach((r, i) => r.setAttribute("opacity", rv ? 0.35 : clamp((t - (o.rowT ? o.rowT[i] : a + 0.4 + i * 0.6)) / 0.25, 0, 1)));
      r3.setAttribute("opacity", rv ? 1 : clamp((t - (o.rowT ? o.rowT[2] : a + 1.6)) / 0.25, 0, 1));
      // reveal: the fine print grows to full size under a magnifier
      const z = rv ? clamp((t - a - 0.6) / 0.9, 0, 1) : 0, zz = z * z * (3 - 2 * z);
      fine.setAttribute("font-size", (15 + zz * 37).toFixed(1)); { const L = fine.getComputedTextLength ? fine.getComputedTextLength() : 0, maxL = 930; if (L > maxL) fine.setAttribute("font-size", ((15 + zz * 37) * maxL / L).toFixed(1)); } fine.setAttribute("fill", zz > 0.5 ? "#D23A2A" : "#6A5E52"); fine.setAttribute("font-weight", zz > 0.5 ? 900 : 800);
      lens.setAttribute("opacity", rv && z < 1 ? 1 - z * 0.6 : 0); lens.setAttribute("transform", `translate(${X - 250 + zz * 160},${Y + 135}) scale(${0.8 + zz * 0.4})`);
    } };
  }
  window.EP5K = { thought, rules };
})();
