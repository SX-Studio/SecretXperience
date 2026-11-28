/* Short 3: "When a test gives us bad news, we do something sneaky" (Ditto & Lopez, 1992, Study 2). */
(function () {
  const K = SHORT({ keys: { bad: 1, news: 1, sneaky: 1, spit: 1, strip: 1, yellow: 1, never: 1, "30": 1, longer: 1, retested: 1, "12": 1, accept: 1, instantly: 1, prove: 1, dip: 1, color: 1 }, noCap: ["c8"], fix: { c7: { 0: "And" }, c8: { 1: "good", 2: "news", 3: "group?", 4: "Under" } } });
  const { S, E, W, I, ink, Y, el, label, fig, clamp, ease, sm, INKC, HI, RED } = K;
  const tx = (str, x, y, size, at, dur, o = {}) => I.text(ink, str, x, y, size, at, dur, o);
  const pop = (str, x, y, size, at, fill = INKC, font = "Caveat", sound = "pop", rot = 0) => I.fill(ink, Object.assign(el("text", { x, y, "text-anchor": "middle", "font-family": font, "font-weight": font === "Caveat" ? 700 : 400, "font-size": size, fill, opacity: 0, transform: rot ? `rotate(${rot} ${x} ${y})` : "" }), { textContent: str }), at, 0.18, { pop: [x, y - size * 0.35], sound });
  const strip = (p, x, y, w, h, at, fill = "#F2D24B", rot = 0) => I.fill(p, el("rect", { x, y, width: w, height: h, rx: 6, fill, stroke: INKC, "stroke-width": 6, opacity: 0, transform: rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : "" }), at, 0.2, { pop: [x + w / 2, y + h / 2], sound: "swish" });
  const arrowR = (x, y, len, at, color = INKC) => I.path(ink, `M${x},${y} h${len} M${x + len - 30},${y - 26} l30,26 l-30,26`, at, 0.3, { w: 8, color });

  // ---------- B0: the hook — a bad result ----------
  const Y0 = Y(0);
  tx("the spit test", 130, Y0 - 600, 110, 0.0, 0.7);
  const f0 = fig(ink, 330, Y0 + 230, 1.15, 0.05, { mood: "worried", arms: `M330,${Y0 + 0} L250,${Y0 + 130} M330,${Y0 + 0} L560,${Y0 - 90}` });
  I.path(ink, `M560,${Y0 - 420} h400 v330 h-400 z`, 0.2, 0.45, { w: 8 }); pop("RESULT:", 760, Y0 - 330, 70, 0.5, INKC, "Patrick Hand", false);
  pop("BAD NEWS", 760, Y0 - 180, 92, W("c1", 5), RED, "Anton", "slap", -4);
  f0.setMood(W("c1", 9), "forced");

  // ---------- B1: spit on a strip of paper ----------
  const Y1 = Y(1);
  tx("a made-up condition", 130, Y1 - 600, 96, W("c2", 5) - 0.2, 0.8); pop("(TAA deficiency)", 540, Y1 - 490, 64, W("c2", 7), "#6B6359", "Patrick Hand", false);
  const f1 = fig(ink, 380, Y1 + 230, 1.15, S("c2") - 0.2, { mood: "neutral", arms: `M380,${Y1 + 0} L300,${Y1 + 130} M380,${Y1 + 0} L520,${Y1 - 140}` });
  const s1 = el("g", {}, ink); strip(s1, 500, Y1 - 320, 46, 210, W("c2", 12) - 0.1, "#F2D24B", 18);
  [[455, -300], [470, -265], [440, -240]].forEach(([x, dy], i) => I.path(ink, `M${x},${Y1 + dy} q10,16 0,24 q-10,-8 0,-24`, W("c2", 9) + i * 0.08, 0.15, { w: 5, color: "#5B8DB8", silent: i > 0 }));
  label(ink, "test strip", 760, Y1 - 220, 60, W("c2", 12) + 0.2, INKC); I.path(ink, `M660,${Y1 - 240} q-60,0 -100,20`, W("c2", 12) + 0.3, 0.25, { w: 6, silent: true });

  // ---------- B2: the rule ----------
  const Y2 = Y(2);
  tx("what they were told", 130, Y2 - 600, 96, S("c3") - 0.15, 0.8);
  strip(ink, 180, Y2 - 420, 70, 280, W("c3", 5), "#F2D24B"); arrowR(300, Y2 - 280, 190, W("c3", 7)); strip(ink, 540, Y2 - 420, 70, 280, W("c3", 8), "#F2D24B");
  pop("no change…", 575, Y2 - 70, 64, W("c3", 8) + 0.1, INKC, "Caveat", false);
  pop("= BAD NEWS", 830, Y2 - 260, 84, W("c3", 12), RED, "Anton", "slap", -6);

  // ---------- B3: the secret — just yellow paper ----------
  const Y3 = Y(3);
  tx("the secret", 130, Y3 - 600, 110, S("c4") - 0.15, 0.6);
  strip(ink, 430, Y3 - 470, 110, 420, W("c4", 6), "#F2D24B", -8);
  pop("plain yellow paper", 540, Y3 + 60, 80, W("c4", 9), INKC, "Caveat", false);
  pop("it never changed. for anyone.", 540, Y3 + 200, 70, W("c4", 12), RED, "Caveat", "slap", -2);

  // ---------- B4: who took longer to accept the result ----------
  const Y4 = Y(4), base = 130, k = 6.4;
  tx("time to decide", 130, Y4 - 600, 104, S("c5") - 0.1, 0.6); tx("the test was done", 130, Y4 - 480, 80, S("c5") + 0.3, 0.7, { color: "#6B6359" });
  const bars = [[Y4 - 300, 104.8, RED, "bad news", W("c6", 1)], [Y4 - 20, 76.5, "#7FB069", "good news", W("c6", 4)]].map(([y, v, c, lb, at]) => {
    tx(lb, base, y - 24, 60, at - 0.2, 0.4, { font: "Patrick Hand" }); const r = el("rect", { x: base, y, width: 0, height: 110, fill: c, stroke: INKC, "stroke-width": 6 }, ink); return { r, w: v * k, at }; });
  I.path(ink, `M${base + 76.5 * k},${Y4 - 330} v-40 h${(104.8 - 76.5) * k} v40`, W("c6", 6), 0.35, { w: 7, color: RED });
  pop("+30 sec", base + 90.6 * k, Y4 - 400, 76, W("c6", 7), RED, "Anton", "slap");

  // ---------- B5: retesting — dip, dip, dip ----------
  const Y5 = Y(5);
  tx("retest…", 130, Y5 - 600, 110, W("c7", 4), 0.5);
  fig(ink, 300, Y5 + 230, 1.15, S("c7") - 0.3, { mood: "worried", arms: `M300,${Y5 + 0} L220,${Y5 + 130} M300,${Y5 + 0} L520,${Y5 - 180}` });
  I.path(ink, `M560,${Y5 - 120} L600,${Y5 + 110} h180 L820,${Y5 - 120}`, S("c7") - 0.1, 0.45, { w: 8 }); I.path(ink, `M570,${Y5 - 70} q60,-15 120,0 t120,0`, S("c7") + 0.2, 0.3, { w: 5, color: "#5B8DB8" });
  const dipS = el("g", {}, ink); strip(dipS, 660, Y5 - 380, 46, 210, S("c7") + 0.1);
  const dA = W("c7", 1), dB = E("c7") + 0.25, NDIP = 12; const dips = [...Array(NDIP)].map((_, i) => dA + (dB - dA) * (i / (NDIP - 1)) ** 0.8);
  const tally = dips.map((at, i) => { const g = Math.floor(i / 5), j = i % 5, x = 560 + g * 150 + j * 26; return j === 4 ? I.path(ink, `M${x - 110},${Y5 - 470} l120,-60`, at, 0.08, { w: 7, color: RED, silent: true }) : I.path(ink, `M${x},${Y5 - 540} v80`, at, 0.08, { w: 7, color: RED, silent: true }); });
  pop("up to 12x", 820, Y5 + 260, 90, W("c7", 12), RED, "Anton", "slap", -5);

  // ---------- B6: good news vs bad news ----------
  const Y6 = Y(6);
  const env = (x, at, lb, col) => { I.path(ink, `M${x},${Y6 - 450} h380 v260 h-380 z M${x},${Y6 - 450} l190,140 l190,-140`, at, 0.45, { w: 8 }); pop(lb, x + 190, Y6 - 110, 60, at + 0.3, col, "Anton", false); };
  env(90, S("c9") - 0.1, "GOOD NEWS", "#4E8A3A"); pop("✓ accepted!", 280, Y6 + 30, 76, W("c9", 3), "#4E8A3A", "Caveat", "slap", -6);
  env(610, W("c9", 5) - 0.1, "BAD NEWS", RED);
  I.circle(ink, 820, Y6 + 60, 85, W("c9", 9) - 0.1, 0.35, { w: 9 }); I.path(ink, `M880,${Y6 + 120} l90,90`, W("c9", 9) + 0.2, 0.2, { w: 14 });
  pop("prove it.", 700, Y6 + 250, 72, W("c9", 9) + 0.2, RED, "Caveat", false);

  // ---------- B7: how many times would you dip? ----------
  const Y7 = Y(7);
  tx("be honest…", 130, Y7 - 600, 110, S("c10") - 0.3, 0.6);
  strip(ink, 470, Y7 - 450, 140, 520, S("c10") - 0.1, "#F2D24B", -6);
  pop("how many dips?", 540, Y7 + 220, 90, W("c10", 3), RED, "Caveat", false);

  // ---------- poster: who retested ----------
  const posters = [{ on: [S("c8") - 0.05, E("c8") + 0.3], shakeAt: W("c8", 7), lines: [
    { txt: "BAD NEWS:", x: 90, y: 560, size: 150, fill: "#9A958C", at: S("c8") },
    { txt: "52%", x: 90, y: 880, size: 320, fill: RED, at: S("c8") + 0.2 },
    { txt: "GOOD NEWS:", x: 90, y: 1110, size: 150, fill: "#9A958C", at: W("c8", 1) },
    { txt: "18%", x: 90, y: 1430, size: 320, at: W("c8", 4), big: true }] }];

  const shots = [[0, 540, Y0 - 120, 1.05], [S("c2") - 0.4, 540, Y1 - 120, 1.05], [S("c3") - 0.4, 540, Y2 - 120, 1.05], [S("c4") - 0.4, 540, Y3 - 120, 1.05], [S("c5") - 0.4, 540, Y4 - 120, 1.05], [S("c7") - 0.45, 540, Y5 - 120, 1.05], [S("c8"), 540, Y6 - 120, 1.05], [S("c10") - 0.45, 540, Y7 - 120, 1.05]];
  K.run({ shots, posters, events: dips.map((at) => ({ type: "pop", at: at + 0.05 })).concat([{ type: "draw", at: W("c6", 1), dur: 0.6 }, { type: "draw", at: W("c6", 4), dur: 0.6 }]),
    extra(t) {
      let off = 0; for (const at of dips) { const u = (t - at) / 0.16; if (u > -1 && u < 1) off = Math.max(off, 1 - Math.abs(u)); } dipS.setAttribute("transform", `translate(0,${(off * 200).toFixed(1)})`);
      bars.forEach((b) => { const v = ease(clamp((t - b.at) / 0.7, 0, 1)); b.r.setAttribute("width", (b.w * v).toFixed(1)); b.r.setAttribute("opacity", v > 0 ? 1 : 0); });
    } });
})();
