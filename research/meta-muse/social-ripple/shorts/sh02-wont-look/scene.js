/* Short 2: "Would you click one button to see if you're hurting someone?" (Dana, Weber & Kuang, 2007). */
(function () {
  const K = SHORT({ keys: { click: 1, button: 1, hurting: 1, "74%": 1, fair: 1, "44%": 1, half: 1, moral: 1, wiggle: 1, room: 1, never: 1, look: 1, unfair: 1, clicking: 1, free: 1, hid: 1 }, noCap: ["b6"], fix: { b5: { 7: "A" }, b7: { 0: "And" } } });
  const { S, E, W, I, ink, Y, el, label, fig, clamp, ease, sm, INKC, HI, RED } = K;
  const tx = (str, x, y, size, at, dur, o = {}) => I.text(ink, str, x, y, size, at, dur, o);
  const box = (x, y, w, h, at, o = {}) => I.path(ink, `M${x + 20},${y} h${w - 40} q20,0 20,20 v${h - 40} q0,20 -20,20 h${-(w - 40)} q-20,0 -20,-20 v${-(h - 40)} q0,-20 20,-20 z`, at, o.dur || 0.45, { w: o.w || 8, color: o.color });
  const pop = (str, x, y, size, at, fill = INKC, font = "Caveat", sound = "pop", rot = 0) => I.fill(ink, Object.assign(el("text", { x, y, "text-anchor": "middle", "font-family": font, "font-weight": font === "Caveat" ? 700 : 400, "font-size": size, fill, opacity: 0, transform: rot ? `rotate(${rot} ${x} ${y})` : "" }), { textContent: str }), at, 0.18, { pop: [x, y - size * 0.35], sound });
  const button = (cx, cy, at, txt) => { box(cx - 260, cy - 40, 520, 230, at); I.fill(ink, el("ellipse", { cx, cy: cy + 40, rx: 170, ry: 60, fill: RED, stroke: INKC, "stroke-width": 7, opacity: 0 }), at + 0.35, 0.2, { pop: [cx, cy + 40] });
    I.fill(ink, el("ellipse", { cx: cx - 60, cy: cy + 20, rx: 50, ry: 14, fill: "#FF8A7E", opacity: 0 }), at + 0.45, 0.2, { sound: false }); pop(txt, cx, cy + 160, 56, at + 0.5, INKC, "Patrick Hand", false); };
  const cursor = (p) => { const g = el("g", {}, p); el("path", { d: "M0,0 l0,92 l24,-21 l17,38 l17,-7 l-17,-37 l33,-2 z", fill: "#FFFDF6", stroke: INKC, "stroke-width": 6, "stroke-linejoin": "round" }, g); return g; };

  // ---------- B0: the button ----------
  const Y0 = Y(0);
  tx("one free click", 130, Y0 - 600, 110, 0.0, 0.8);
  button(540, Y0 - 300, 0.1, "see who you're hurting");
  const c0 = cursor(ink); const c0p = [[0, 760, Y0 + 220], [W("b1", 4), 590, Y0 - 285], [W("b2", 7), 590, Y0 - 285], [W("b2", 7) + 0.7, 880, Y0 + 260]];
  const f0 = fig(ink, 300, Y0 + 260, 0.85, 0.3, { mood: "worried" }); f0.setMood(W("b2", 7), "smile");

  // ---------- B1: option A vs option B ----------
  const Y1 = Y(1);
  tx("split money with a stranger", 110, Y1 - 600, 84, S("b3") - 0.1, 0.9);
  const card = (x, at, L, you, them, atY, atT) => { box(x, Y1 - 470, 420, 400, at); pop(L, x + 210, Y1 - 370, 96, at + 0.2, INKC, "Anton", false);
    pop(`you: ${you}`, x + 210, Y1 - 240, 74, atY, INKC, "Caveat"); if (them) pop(`them: ${them}`, x + 210, Y1 - 140, 74, atT, INKC, "Caveat"); };
  card(80, W("b3", 6) - 0.2, "OPTION A", "$6", "$1", W("b3", 8), W("b3", 12));
  card(580, W("b3", 15) - 0.2, "OPTION B", "$5", "$5", W("b3", 17), W("b3", 17) + 0.2);
  fig(ink, 290, Y1 + 260, 0.62, S("b3") + 0.1, { mood: "neutral" }); fig(ink, 790, Y1 + 260, 0.62, S("b3") + 0.4, { mood: "neutral" });
  tx("you", 350, Y1 + 240, 56, S("b3") + 0.5, 0.3, { font: "Patrick Hand", color: "#6B6359" }); tx("stranger", 850, Y1 + 240, 56, S("b3") + 0.7, 0.4, { font: "Patrick Hand", color: "#6B6359" });
  I.path(ink, `M560,${Y1 - 500} q240,-60 470,0 q40,230 0,460 q-240,60 -470,0 q-40,-230 0,-460`, W("b4", 5) - 0.1, 0.45, { w: 9, color: RED, loud: 1.3 });
  pop("74%", 540, Y1 + 190, 150, W("b4", 5) + 0.25, RED, "Anton", "slap", -8); I.path(ink, `M640,${Y1 + 90} q60,-60 70,-140`, W("b4", 5) + 0.35, 0.25, { w: 7, color: RED, silent: true });

  // ---------- B2: the twist — hidden payoff, free click ----------
  const Y2 = Y(2), a2 = S("b5") - 0.2;
  tx("the twist", 130, Y2 - 600, 110, a2, 0.6);
  box(80, Y2 - 470, 420, 400, a2 + 0.2); pop("OPTION A", 290, Y2 - 370, 96, a2 + 0.4, INKC, "Anton", false); pop("you: $6", 290, Y2 - 240, 74, W("b5", 5), INKC);
  I.fill(ink, el("rect", { x: 130, y: Y2 - 205, width: 320, height: 95, rx: 10, fill: "#8A847A", stroke: INKC, "stroke-width": 5, opacity: 0 }), W("b5", 8), 0.2, { sound: "slap" });
  pop("them: ???", 290, Y2 - 140, 66, W("b5", 9), "#FFFDF6", "Caveat", false);
  box(580, Y2 - 470, 420, 400, a2 + 0.5, { color: "#B8B0A2", w: 6 }); pop("OPTION B", 790, Y2 - 370, 96, a2 + 0.7, "#B8B0A2", "Anton", false); pop("you: $5", 790, Y2 - 240, 74, a2 + 0.8, "#B8B0A2", "Caveat", false);
  button(540, Y2 + 30, W("b5", 11) - 0.1, "reveal");
  pop("FREE", 860, Y2 + 30, 80, W("b5", 15), RED, "Anton", "slap", 12);

  // ---------- B3: fair outcomes ----------
  const Y3 = Y(3), a3 = S("b7") - 0.25;
  tx("fair outcomes", 130, Y3 - 600, 110, a3, 0.6);
  const bars = [[Y3 - 420, 74, "#7FB069", a3 + 0.2, "when it was clear"], [Y3 - 130, 38, RED, W("b7", 3), "when they could look away"]].map(([y, v, c, at, lb]) => {
    tx(lb, 130, y - 22, 56, at - 0.3, 0.5, { font: "Patrick Hand" }); const r = el("rect", { x: 130, y, width: 0, height: 110, fill: c, stroke: INKC, "stroke-width": 6 }, ink); pop(`${v}%`, 130 + v * 9 + 105, y + 82, 80, at + 0.6, INKC, "Anton", "pop"); return { r, w: v * 9, at }; });
  I.path(ink, `M${130 + 38 * 9 + 40},${Y3 + 100} q160,40 290,-10`, W("b7", 6) - 0.1, 0.3, { w: 7, color: RED, silent: true }); pop("about half", 680, Y3 + 170, 70, W("b7", 6), RED, "Caveat", false);

  // ---------- B4: moral wiggle room ----------
  const Y4 = Y(4);
  tx("moral wiggle room", 130, Y4 - 600, 110, W("b8", 3), 0.7);
  const f4 = fig(ink, 540, Y4 + 230, 1.2, S("b8") - 0.3, { mood: "smile", arms: `M540,${Y4 - 10} L420,${Y4 - 120} L470,${Y4 - 170} M540,${Y4 - 10} L660,${Y4 - 120} L610,${Y4 - 170}` });
  I.fill(ink, el("rect", { x: 425, y: Y4 - 225, width: 230, height: 50, rx: 18, fill: "#3B3633", opacity: 0, transform: `rotate(-4 540 ${Y4 - 200})` }), W("b8", 9) - 0.1, 0.2, { sound: "swish" });
  [[300, -330], [780, -330]].forEach(([x, dy], i) => I.path(ink, `M${x},${Y4 + dy} q${i ? 30 : -30},40 0,80 q${i ? -30 : 30},40 0,80`, W("b8", 4) + i * 0.1, 0.3, { w: 7, color: "#6B6359", silent: i > 0 }));
  pop("never have to feel unfair :)", 540, Y4 - 470, 64, W("b8", 14), RED, "Caveat", false);

  // ---------- B5: so — what are you not clicking on? ----------
  const Y5 = Y(5);
  button(540, Y5 - 330, S("b9") - 0.35, "the thing you avoid");
  pop("?", 860, Y5 - 360, 260, W("b9", 5), RED, "Caveat", "pop", 10);
  const c5 = cursor(ink); const c5p = [[0, 870, Y5 + 260], [W("b9", 3), 620, Y5 - 250], [W("b9", 6), 610, Y5 - 245], [D_(), 640, Y5 - 120]];
  function D_() { return K.D - 0.3; }
  const f5 = fig(ink, 300, Y5 + 260, 0.85, S("b9") - 0.2, { mood: "worried" });

  // ---------- poster: 44% never clicked ----------
  const posters = [{ on: [W("b6", 0) - 0.05, E("b6") + 0.3], slashAt: W("b6", 2), shakeAt: W("b6", 2), lines: [
    { txt: "44%", x: 90, y: 860, size: 420, fill: RED, at: W("b6", 0) },
    { txt: "NEVER", x: 90, y: 1120, size: 230, at: W("b6", 1) },
    { txt: "CLICKED.", x: 90, y: 1370, size: 230, at: W("b6", 2), big: true }] }];

  const shots = [[0, 540, Y0 - 120, 1.05], [S("b3") - 0.45, 540, Y1 - 120, 1.05], [S("b5") - 0.45, 540, Y2 - 120, 1.05], [W("b6", 0), 540, Y3 - 120, 1.05], [S("b8") - 0.45, 540, Y4 - 120, 1.05], [S("b9") - 0.5, 540, Y5 - 120, 1.05]];
  const path = (P, t) => { let i = 0; while (i + 1 < P.length && t >= P[i + 1][0]) i++; const a = P[i], b = P[i + 1] || a; const u = b === a ? 1 : ease(clamp((t - a[0]) / Math.min(0.6, b[0] - a[0]), 0, 1)); return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; };
  K.run({ shots, posters, events: [{ type: "swish", at: W("b2", 7) }, { type: "slam", at: W("b8", 9) }],
    extra(t) {
      const [x0, y0] = path(c0p, t); c0.setAttribute("transform", `translate(${x0.toFixed(1)},${y0.toFixed(1)})`); c0.setAttribute("opacity", t > 0.5 ? 1 : 0);
      const [x5, y5] = path(c5p, t); c5.setAttribute("transform", `translate(${x5.toFixed(1)},${y5.toFixed(1)})`); c5.setAttribute("opacity", t > S("b9") - 0.1 ? 1 : 0);
      bars.forEach((b) => { const v = ease(clamp((t - b.at) / 0.6, 0, 1)); b.r.setAttribute("width", (b.w * v).toFixed(1)); b.r.setAttribute("opacity", v > 0 ? 1 : 0); });
    } });
})();
