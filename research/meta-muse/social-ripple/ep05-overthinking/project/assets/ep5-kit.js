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

  function thought(svg, o) {
    const S = STY[o.style || "warm"], size = o.size || 38, g = el("g", { display: "none" }, svg);
    const body = el("g", {}, g); const txt = el("g", {}, g); const dots = [0, 1, 2].map(() => el("circle", { fill: S.fill, stroke: S.stroke, "stroke-width": 5 }, g));
    let built = false, W = 0, H = 0;
    function build() { const { lines, w } = wrap(o.text, S.font, size, 520); W = w + 70; H = lines.length * size * 1.15 + 54; built = true;
      // cloud: a rounded rect plus bumps around the rim
      const bumps = Math.max(5, Math.round(W / 70)), r = 30;
      for (let i = 0; i < bumps; i++) { const x = -W / 2 + 20 + (i * (W - 40)) / (bumps - 1); el("circle", { cx: x, cy: -H / 2 + 6, r, fill: S.fill, stroke: S.stroke, "stroke-width": 5 }, body); el("circle", { cx: x, cy: H / 2 - 6, r, fill: S.fill, stroke: S.stroke, "stroke-width": 5 }, body); }
      [-1, 1].forEach((s) => el("circle", { cx: s * (W / 2 - 4), cy: 0, r: H / 2 - 4, fill: S.fill, stroke: S.stroke, "stroke-width": 5 }, body));
      el("rect", { x: -W / 2 + 6, y: -H / 2 + 4, width: W - 12, height: H - 8, rx: 26, fill: S.fill }, body);
      lines.forEach((l, i) => { const t = el("text", { x: 0, y: -((lines.length - 1) * size * 1.15) / 2 + i * size * 1.15 + size * 0.36, "text-anchor": "middle", "font-family": S.font, "font-weight": 900, "font-size": size, fill: S.ink }, txt); t.textContent = l; });
      if (o.style === "critic") el("text", { x: -W / 2 + 18, y: -H / 2 - 8, "font-family": "Outfit", "font-weight": 900, "font-size": 20, fill: "#B9A4F0", "letter-spacing": 2 }, txt).textContent = "BEA'S INNER VOICE"; }
    return { update(t) {
      const on = t >= o.t0 && t < o.t1, head = o.who && o.who.b && o.who.b.head && o.who.b.outer.getAttribute("display") !== "none" ? o.who.b.head : null;
      if (!on || (!head && !o.at)) { g.setAttribute("display", "none"); return; } if (!built) build(); g.setAttribute("display", "inline");
      const k = clamp((t - o.t0) / 0.35, 0, 1), out = clamp((o.t1 - t) / 0.3, 0, 1), sc = (0.55 + 0.45 * back(k)) * (o.scale || 1);
      const hx = head ? head.x : o.at.x, hy = head ? head.y : o.at.y, side = o.side || 1, hk = head ? head.k || 1 : 1;
      let cx = hx + side * (W / 2 * 0.55 + 60 * hk), cy = hy - 120 * hk - H / 2 - 40 - (o.lift || 0) * (H * 0.9 + 20); cx = clamp(cx, W / 2 + 40, 1920 - W / 2 - 40); cy = clamp(cy, H / 2 + 40, 1080 - H / 2 - 40); if (cx - W / 2 < 340 && cy - H / 2 < 290) cx = 340 + W / 2;
      g.setAttribute("opacity", (Math.min(k * 2, 1) * out).toFixed(3)); const bob = Math.sin(t * 2.2 + (o.t0 % 3)) * 4;
      body.setAttribute("transform", `translate(${cx.toFixed(1)},${(cy + bob).toFixed(1)}) scale(${sc.toFixed(3)})`); txt.setAttribute("transform", `translate(${cx.toFixed(1)},${(cy + bob).toFixed(1)}) scale(${sc.toFixed(3)})`);
      [0, 1, 2].forEach((i) => { const u = (i + 1) / 4, x = cx + (hx - cx) * u * 0.9, y = (cy + H / 2) + (hy - 30 * hk - (cy + H / 2)) * u * 0.9; const d = dots[i]; d.setAttribute("cx", x.toFixed(1)); d.setAttribute("cy", y.toFixed(1)); d.setAttribute("r", (16 - i * 4) * Math.min(1, sc)); });
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
      fine.setAttribute("font-size", (15 + zz * 37).toFixed(1)); fine.setAttribute("fill", zz > 0.5 ? "#D23A2A" : "#6A5E52"); fine.setAttribute("font-weight", zz > 0.5 ? 900 : 800);
      lens.setAttribute("opacity", rv && z < 1 ? 1 - z * 0.6 : 0); lens.setAttribute("transform", `translate(${X - 250 + zz * 120},${Y + 135}) scale(${0.8 + zz * 0.4})`);
    } };
  }
  window.EP5K = { thought, rules };
})();
