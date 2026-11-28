/* Ep10 ch2: Trick #1 — just don't look (ostrich effect, Huntington testing, moral wiggle room). */
(function () {
  const K = LONG({ keys: { look: 1, sweden: 1, pension: 1, logins: 1, vanguard: 1, rising: 1, more: 1, falling: 1, less: 1, ostrich: 1, money: 1, "huntington's": 1, gene: 1, test: 1, sure: 1, ten: 1, optimistic: 1, retire: 1, sensible: 1, hope: 1, bad: 1, fair: 1, "74%": 1, "44%": 1, free: 1, click: 1, half: 1, moral: 1, wiggle: 1, unfair: 1, door: 1 },
    noCap: ["e1", "e15"], fix: { e14: {} } });
  const { S, E, W, T, I, X, B, el, fig, clamp, ease, INKC, HI, RED } = K, L = LIB(K);
  const F = (i, f) => S(i) + f * T[i][1];
  const updaters = [];

  // ---------- B0: Sweden's pension logins ----------
  const X0 = X(0), g0 = B(0);
  L.tx(g0, "Sweden", X0 - 800, 190, 110, W("e2", 1) - 0.2, 0.5);
  L.rect(g0, X0 - 780, 260, 240, 150, W("e2", 1), "#2D6DB5", { rx: 4 }); I.fill(g0, el("rect", { x: X0 - 710, y: 260, width: 34, height: 150, fill: "#F2C230", opacity: 0 }), W("e2", 1) + 0.1, 0.15, { sound: false }); I.fill(g0, el("rect", { x: X0 - 780, y: 318, width: 240, height: 34, fill: "#F2C230", opacity: 0 }), W("e2", 1) + 0.1, 0.15, { sound: false });
  for (let i = 0; i < 7; i++) { const x = X0 - 760 + i * 90, at = W("e2", 2) + i * 0.06; I.circle(g0, x, 560, 28, at, 0.15, { w: 5, silent: i > 0 }); I.path(g0, `M${x},${588} v80 M${x - 30},${720} l30,-52 l30,52`, at + 0.05, 0.15, { w: 5, silent: true }); }
  L.pop(g0, "millions of savers", X0 - 490, 800, 60, W("e2", 3), L.GREY, "Patrick Hand", false);
  I.path(g0, `M${X0 - 60},${560} q0,-130 150,-130 q150,0 150,130 q0,110 -150,110 q-150,0 -150,-110 z M${X0 + 240},${540} l40,-10 M${X0 + 20},${660} v40 M${X0 + 160},${660} v40 M${X0 + 90},${430} v-26 m-30,0 h60`, W("e2", 12) - 0.2, 0.6, { w: 8 });
  L.pop(g0, "pension", X0 + 90, 580, 60, W("e2", 12), INKC, "Patrick Hand", false);
  L.phone(g0, X0 + 480, 270, W("e2", 18) - 0.1); L.pop(g0, "LOG IN", X0 + 610, 450, 54, W("e2", 18) + 0.2, RED, "Anton", false);
  I.path(g0, `M${X0 + 530},${600} l50,-40 l40,20 l60,-70`, W("e2", 23), 0.3, { w: 7, color: L.GREEN });

  // ---------- B1: counted day by day; then Vanguard ----------
  const X1 = X(1), g1 = B(1);
  L.tx(g1, "logins, counted day by day", X1 - 800, 190, 96, S("e3") - 0.1, 1.0);
  I.path(g1, `M${X1 - 780},${290} h700 v440 h-700 z`, S("e3") + 0.1, 0.5, { w: 7 });
  for (let c = 1; c < 7; c++) I.path(g1, `M${X1 - 780 + c * 100},${290} v440`, S("e3") + 0.3 + c * 0.03, 0.15, { w: 3, silent: true });
  for (let r = 1; r < 4; r++) I.path(g1, `M${X1 - 780},${290 + r * 110} h700`, S("e3") + 0.35 + r * 0.03, 0.15, { w: 3, silent: true });
  for (let i = 0; i < 28; i++) { const c = i % 7, r = Math.floor(i / 7), at = W("e3", 4) + i * 0.05; I.path(g1, `M${X1 - 755 + c * 100},${320 + r * 110} v50 M${X1 - 735 + c * 100},${320 + r * 110} v50 M${X1 - 715 + c * 100},${320 + r * 110} v50`, at, 0.08, { w: 4, color: RED, silent: i % 4 > 0 }); }
  L.pop(g1, "2002 → 2004", X1 - 430, 820, 70, W("e3", 8), L.GREY, "Caveat", false);
  L.rect(g1, X1 + 180, 300, 300, 190, W("e3", 19) - 0.2, "#FFFDF6", { rx: 4 }); for (let i = 0; i < 4; i++) I.fill(g1, el("rect", { x: X1 + 180, y: 320 + i * 46, width: 300, height: 22, fill: RED, opacity: 0 }), W("e3", 19) + i * 0.05, 0.12, { sound: false });
  I.fill(g1, el("rect", { x: X1 + 180, y: 300, width: 130, height: 100, fill: "#2D4E8C", opacity: 0 }), W("e3", 19) + 0.2, 0.12, { sound: false });
  L.pop(g1, "USA: Vanguard", X1 + 330, 590, 80, W("e3", -1), INKC, "Caveat", "pop");
  L.pop(g1, "millions of investors", X1 + 330, 680, 56, W("e3", -1) + 0.2, L.GREY, "Patrick Hand", false);

  // ---------- B2: rising → check more; falling → check less ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "same pattern, both countries", X2 - 800, 175, 90, S("e4") - 0.1, 1.0);
  I.path(g2, `M${X2 - 760},${260} V${820} H${X2 + 780}`, S("e4") + 0.1, 0.5, { w: 7 }); L.pop(g2, "the market", X2 - 640, 860, 46, S("e4") + 0.4, L.GREY, "Patrick Hand", false);
  I.path(g2, `M${X2 - 760},${720} L${X2 - 500},${640} L${X2 - 280},${560} L${X2 - 20},${420}`, W("e4", 10), 0.8, { w: 10, color: L.GREEN });
  I.path(g2, `M${X2 - 20},${420} L${X2 + 260},${560} L${X2 + 480},${600} L${X2 + 760},${720}`, W("e4", 19), 0.8, { w: 10, color: RED });
  const eye = (x, y, at, silent) => { I.path(g2, `M${x - 34},${y} q34,-30 68,0 q-34,30 -68,0 z`, at, 0.15, { w: 5, silent }); I.fill(g2, el("circle", { cx: x, cy: y, r: 9, fill: INKC, opacity: 0 }), at + 0.1, 0.1, { sound: false }); };
  [[-700, 600], [-600, 520], [-520, 590], [-430, 490], [-340, 560], [-250, 440], [-160, 510], [-90, 380]].forEach(([dx, y], i) => eye(X2 + dx, y - 60, W("e4", 14) + i * 0.07, i > 0));
  [[340, 470], [620, 530]].forEach(([dx, y], i) => eye(X2 + dx, y - 60, W("e4", 23) + i * 0.15, i > 0));
  L.pop(g2, "checked MORE", X2 - 400, 300, 70, W("e4", 15), L.GREEN, "Caveat", false);
  L.pop(g2, "checked less", X2 + 480, 360, 60, W("e4", 24), RED, "Caveat", false);

  // ---------- B3: the ostrich effect ----------
  const X3 = X(3), g3 = B(3);
  L.tx(g3, "the ostrich effect", X3 - 800, 180, 120, W("e5", 2) - 0.2, 0.8);
  L.phone(g3, X3 - 700, 300, W("e5", 5) - 0.1); I.path(g3, `M${X3 - 650},${620} l50,-60 l40,30 l70,-110 M${X3 - 530},${480} h40 v40`, W("e5", 5) + 0.1, 0.35, { w: 8, color: L.GREEN });
  L.pop(g3, "Good news? Let me see!", X3 - 560, 850, 64, W("e5", 7), L.GREEN, "Caveat", false);
  const ox = X3 + 380; I.path(g3, `M${ox - 170},${560} q0,-110 170,-110 q190,0 190,110 q0,100 -170,110 q-190,0 -190,-110 z`, W("e5", 1), 0.6, { w: 8 });
  I.path(g3, `M${ox + 170},${520} q80,-40 110,-90 M${ox + 180},${560} q90,-10 130,-60 M${ox + 170},${600} q90,20 140,-20`, W("e5", 1) + 0.4, 0.3, { w: 6, silent: true });
  I.path(g3, `M${ox - 150},${510} q-130,-50 -180,110 q-20,80 -40,140`, W("e5", 1) + 0.5, 0.4, { w: 9 });
  I.path(g3, `M${ox - 20},${660} l-20,90 l20,110 M${ox + 50},${660} l20,90 l-20,110`, W("e5", 1) + 0.7, 0.35, { w: 8 });
  I.path(g3, `M${ox - 520},${860} q140,-150 280,0`, W("e5", 1) + 0.8, 0.3, { w: 7, color: "#B08A4A" }); I.path(g3, `M${X3 - 120},${860} H${X3 + 800}`, W("e5", 1) + 0.8, 0.4, { w: 4, color: "#B08A4A", silent: true });
  L.pop(g3, "Bad news? I'd rather not know.", ox - 40, 330, 60, W("e5", 12), RED, "Caveat", false);

  // ---------- B4: not just money — Huntington's ----------
  const X4 = X(4), g4 = B(4);
  L.tx(g4, "…and it isn't just money.", X4 - 800, 180, 96, S("e6") - 0.1, 0.9);
  L.tx(g4, "Huntington's disease", X4 - 800, 310, 80, S("e7"), 0.8, { color: RED });
  L.pop(g4, "serious, inherited, affects the brain", X4 - 450, 390, 50, F("e7", 0.25), L.GREY, "Patrick Hand", false);
  const par = fig(g4, X4 - 560, 860, 0.95, F("e7", 0.45), { mood: "worried" }), kid = fig(g4, X4 - 260, 860, 0.62, F("e7", 0.55), { mood: "neutral" });
  L.arrow(g4, X4 - 470, 520, X4 - 300, 600, F("e7", 0.62), { w: 6, color: L.GREY, silent: true });
  for (let i = 0; i < 9; i++) { const y = 260 + i * 62; I.path(g4, `M${X4 + 160 + Math.sin(i * 0.8) * 70},${y} L${X4 + 160 - Math.sin(i * 0.8) * 70},${y}`, F("e7", 0.3) + i * 0.04, 0.12, { w: 5, color: L.BLUE, silent: true }); }
  I.path(g4, `M${X4 + 160},${230} ${[...Array(10)].map((_, i) => `L${X4 + 160 + Math.sin(i * 0.8) * 70},${260 + i * 62}`).join(" ")}`, F("e7", 0.3), 0.6, { w: 7 });
  I.path(g4, `M${X4 + 160},${230} ${[...Array(10)].map((_, i) => `L${X4 + 160 - Math.sin(i * 0.8) * 70},${260 + i * 62}`).join(" ")}`, F("e7", 0.32), 0.6, { w: 7, color: RED });
  I.circle(g4, X4 + 560, 520, 150, F("e7", 0.72), 0.4, { w: 9, color: RED }); L.pop(g4, "50%", X4 + 560, 565, 130, F("e7", 0.76), RED, "Anton", "slap");
  L.pop(g4, "chance of carrying the gene", X4 + 560, 730, 50, F("e7", 0.86), L.GREY, "Patrick Hand", false);

  // ---------- B5: the test, and fewer than 1 in 10 ----------
  const X5 = X(5), g5 = B(5);
  L.envelope(g5, X5 - 820, 260, F("e8", 0.02), "GENETIC TEST", INKC); L.sign(g5, "100% sure", X5 - 520, 230, 260, 90, F("e8", 0.25), { size: 56, rot: 8 });
  const row = []; for (let i = 0; i < 10; i++) row.push(fig(g5, X5 - 170 + i * 100, 860, 0.42, F("e8", 0.55) + i * 0.06, { mood: "neutral" }));
  L.pop(g5, "about 1,000 people at risk", X5 + 280, 560, 58, F("e8", 0.58), L.GREY, "Patrick Hand", false);
  I.circle(g5, X5 - 170, 760, 80, F("e8", 0.84), 0.35, { w: 8, color: RED }); L.pop(g5, "fewer than 1 in 10 tested", X5 + 280, 970 - 330, 64, F("e8", 0.88), RED, "Caveat", "slap");
  L.thought(g5, X5 + 300, 330, 520, 150, F("e9", 0.2)); L.pop(g5, "probably fine :)", X5 + 300, 350, 66, F("e9", 0.3), INKC, "Caveat", false);
  for (let i = 1; i < 10; i++) row[i].setMood(F("e9", 0.3), "smile");
  L.sign(g5, "retire? plan as if: no HD", X5 - 540, 560, 560, 100, F("e9", 0.6), { size: 48, rot: -4, fill: "#FFFDF6" });

  // ---------- B6: not knowing can be sensible ----------
  const X6 = X(6), g6 = B(6);
  L.tx(g6, "before anyone judges them…", X6 - 800, 180, 84, S("e10") - 0.1, 0.9, { color: L.GREY });
  L.tx(g6, "not knowing can be a sensible choice", X6 - 800, 320, 90, F("e10", 0.3), 1.0);
  I.path(g6, L.heart(X6, 600, 150), F("e10", 0.72), 0.6, { w: 10, color: RED }); L.pop(g6, "hope", X6, 640, 90, F("e10", 0.82), RED, "Caveat", "pop");

  // ---------- B7: not having to feel bad ----------
  const X7 = X(7), g7 = B(7);
  L.tx(g7, "not looking = not feeling bad", X7 - 800, 180, 100, F("e11", 0.25), 1.0);
  fig(g7, X7, 860, 1.15, S("e11") - 0.2, { mood: "smile", arms: `M${X7},${860 - 230} L${X7 - 120},${860 - 360} L${X7 - 60},${860 - 400} M${X7},${860 - 230} L${X7 + 120},${860 - 360} L${X7 + 60},${860 - 400}` });
  I.fill(g7, el("rect", { x: X7 - 100, y: 860 - 420, width: 200, height: 46, rx: 18, fill: "#3B3633", opacity: 0 }), F("e11", 0.55), 0.2, { sound: "swish" });

  // ---------- B8: option A vs option B ----------
  const X8 = X(8), g8 = B(8);
  L.tx(g8, "split money with a stranger", X8 - 800, 180, 96, S("e12") - 0.1, 0.9);
  const card = (x, at, lb, you, them, aY, aT) => { L.box(g8, x, 260, 440, 420, at); L.pop(g8, lb, x + 220, 370, 100, at + 0.2, INKC, "Anton", false); L.pop(g8, `you: ${you}`, x + 220, 500, 76, aY); L.pop(g8, `them: ${them}`, x + 220, 610, 76, aT); };
  card(X8 - 820, W("e12", 12) - 0.2, "OPTION A", "$6", "$1", W("e12", 14), W("e12", 18));
  card(X8 - 300, W("e12", 21) - 0.2, "OPTION B", "$5", "$5", W("e12", 23), W("e12", 23) + 0.2);
  fig(g8, X8 + 420, 860, 0.8, S("e12") + 0.3, { mood: "neutral" }); fig(g8, X8 + 720, 860, 0.8, S("e12") + 0.6, { mood: "neutral" });
  L.pop(g8, "you", X8 + 420, 540, 54, S("e12") + 0.6, L.GREY, "Patrick Hand", false); L.pop(g8, "stranger", X8 + 720, 540, 54, S("e12") + 0.8, L.GREY, "Patrick Hand", false);
  I.path(g8, `M${X8 - 330},${235} q250,-50 500,0 q40,235 0,470 q-250,50 -500,0 q-40,-235 0,-470`, F("e13", 0.5), 0.45, { w: 9, color: RED, loud: 1.3 });
  L.pop(g8, "74% picked this", X8 - 80, 800, 84, F("e13", 0.6), RED, "Anton", "slap", -4);

  // ---------- B9: the twist ----------
  const X9 = X(9), g9 = B(9);
  L.tx(g9, "the twist", X9 - 800, 180, 120, S("e14") - 0.2, 0.6);
  L.box(g9, X9 - 820, 260, 440, 420, S("e14")); L.pop(g9, "OPTION A", X9 - 600, 370, 100, S("e14") + 0.2, INKC, "Anton", false); L.pop(g9, "you: $6", X9 - 600, 500, 76, S("e14") + 0.3);
  L.rect(g9, X9 - 770, 550, 340, 95, W("e14", 8), "#8A847A", { rx: 10, sound: "slap" }); L.pop(g9, "them: ???", X9 - 600, 615, 70, W("e14", 9), "#FFFDF6", "Caveat", false);
  L.button(g9, X9 + 200, 330, W("e14", 11) - 0.1, "reveal"); L.pop(g9, "FREE", X9 + 560, 330, 90, W("e14", 15), RED, "Anton", "slap", 12);
  L.pop(g9, "(and private)", X9 + 200, 760, 56, W("e14", 16), L.GREY, "Patrick Hand", false);
  const cur = L.cursor(g9);

  // ---------- B10: fair outcomes dropped by about half ----------
  const X10 = X(10), g10 = B(10);
  L.tx(g10, "fair outcomes", X10 - 800, 180, 110, S("e16") - 0.3, 0.6);
  L.tx(g10, "when it was clear", X10 - 800, 330, 60, S("e16") - 0.1, 0.5, { font: "Patrick Hand" }); L.tx(g10, "when they could look away", X10 - 800, 600, 60, S("e16") + 0.1, 0.6, { font: "Patrick Hand" });
  updaters.push(L.bars(g10, [{ x: X10 - 800, y: 360, len: 74 * 14, thick: 120, fill: "#7FB069", at: S("e16"), horizontal: true }, { x: X10 - 800, y: 630, len: 38 * 14, thick: 120, fill: RED, at: W("e16", 3), horizontal: true }]));
  L.pop(g10, "74%", X10 - 800 + 74 * 14 + 110, 450, 90, S("e16") + 0.6, INKC, "Anton"); L.pop(g10, "38%", X10 - 800 + 38 * 14 + 110, 720, 90, W("e16", 3) + 0.6, RED, "Anton");
  L.pop(g10, "≈ half", X10 + 300, 720, 90, W("e16", -1), RED, "Caveat", false);

  // ---------- B11: moral wiggle room ----------
  const X11 = X(11), g11 = B(11);
  L.tx(g11, "moral wiggle room", X11 - 800, 180, 120, W("e17", 3) - 0.3, 0.8);
  fig(g11, X11 - 250, 860, 1.15, S("e17") - 0.2, { mood: "smile", arms: `M${X11 - 250},${860 - 230} L${X11 - 370},${860 - 360} L${X11 - 310},${860 - 400} M${X11 - 250},${860 - 230} L${X11 - 130},${860 - 360} L${X11 - 190},${860 - 400}` });
  I.fill(g11, el("rect", { x: X11 - 350, y: 860 - 420, width: 200, height: 46, rx: 18, fill: "#3B3633", opacity: 0 }), W("e17", 8), 0.2, { sound: "swish" });
  [[X11 - 480, 0], [X11 - 20, 1]].forEach(([x, i]) => I.path(g11, `M${x},${380} q${i ? 30 : -30},40 0,80 q${i ? -30 : 30},40 0,80`, W("e17", 4) + i * 0.1, 0.3, { w: 7, color: L.GREY, silent: i > 0 }));
  L.pop(g11, "never look → never feel unfair", X11 + 430, 520, 64, F("e17", 0.75), RED, "Caveat", false);

  // ---------- B12: never lets it in the door ----------
  const X12 = X(12), g12 = B(12);
  L.tx(g12, "trick #1: don't let it in", X12 - 800, 180, 100, S("e18") - 0.1, 0.8);
  I.path(g12, `M${X12 - 160},${860} V${300} H${X12 + 160} V${860}`, S("e18") + 0.2, 0.5, { w: 9 }); I.path(g12, `M${X12 - 130},${330} H${X12 + 130} V${860} H${X12 - 130} Z`, S("e18") + 0.4, 0.4, { w: 6 });
  I.fill(g12, el("circle", { cx: X12 + 95, cy: 600, r: 14, fill: INKC, opacity: 0 }), S("e18") + 0.6, 0.1, { sound: false });
  L.sign(g12, "THE TRUTH", X12 - 560, 520, 320, 110, F("e18", 0.6), { font: "Anton", size: 60, rot: -6, fill: "#FFFDF6", color: RED });
  I.path(g12, `M${X12 - 220},${520} q40,-20 60,0`, F("e18", 0.7), 0.2, { w: 6, color: L.GREY, silent: true });
  I.path(g12, `M${X12 - 210},${640} L${X12 + 210},${480}`, W("e18", -1) - 0.1, 0.25, { w: 22, color: "#8A5A2B", loud: 1.4 });

  // ---------- posters ----------
  const posters = [L.trick(1, [S("e1") - 0.05, E("e1") + 0.45], [{ txt: "JUST", at: W("e1", 3) }, { txt: "DON'T LOOK.", at: W("e1", 4) }]),
    { on: [S("e15") - 0.05, E("e15") + 0.35], slashAt: W("e15", -1), shakeAt: W("e15", -1), lines: [{ txt: "44%", y: 500, size: 380, fill: RED, at: S("e15") }, { txt: "NEVER CLICKED.", y: 800, size: 220, at: W("e15", -1), big: true }] }];
  const sh = (t, x) => [t, x, 540, 1];
  const shots = [sh(0, X0), sh(S("e3") - 0.4, X1), sh(S("e4") - 0.4, X2), sh(S("e5") - 0.4, X3), sh(S("e6") - 0.4, X4), sh(S("e8") - 0.4, X5), sh(S("e10") - 0.4, X6), sh(S("e11") - 0.4, X7), sh(S("e12") - 0.4, X8), sh(S("e14") - 0.4, X9), sh(S("e15"), X10), sh(S("e17") - 0.4, X11), sh(S("e18") - 0.4, X12)];
  const cp = [[0, X9 + 500, 900], [W("e14", 11) + 0.3, X9 + 520, 900], [W("e14", 13), X9 + 220, 380]];
  K.run({ shots, posters, events: [{ type: "slam", at: W("e18", -1) }],
    extra(t) { updaters.forEach((u) => u(t)); let i = 0; while (i + 1 < cp.length && t >= cp[i + 1][0]) i++; const a = cp[i], b = cp[i + 1] || a, u = b === a ? 1 : ease(clamp((t - a[0]) / Math.max(0.01, b[0] - a[0]), 0, 1));
      cur.setAttribute("transform", `translate(${(a[1] + (b[1] - a[1]) * u).toFixed(1)},${(a[2] + (b[2] - a[2]) * u).toFixed(1)})`); cur.setAttribute("opacity", t > W("e14", 11) ? 1 : 0); } });
})();
