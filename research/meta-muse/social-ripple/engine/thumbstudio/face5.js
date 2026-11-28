/* Face v5: expressive cartoon faces that read like real human expressions (wink, smirk, big laugh with teeth + tongue,
   jaw-drop "o", pucker, skeptical brow, wobbly frown...). Replaces the rig's eyes + mouth on any cast member, keeps head + hair.
   TS.face5(char, expr | {eyes:[L,R], brows:[[raise,angle],[raise,angle]], mouth, cheeks, squash:[sx,sy], sweat, tears})
   Coordinates are head units (head radius 41), face centred a little toward the facing side, like the rig. */
(function () {
  const SR = window.SR, { el } = SR, TS = window.TS, INK = "#1E1B22";
  const X = {   // presets: each one is a recognisable human expression
    laugh:    { eyes: ["happy", "happy"], brows: [[5, -8], [5, 8]], mouth: "laughBig", cheeks: 1, squash: [1.07, 0.95] },
    cheeky:   { eyes: ["wink", "open"], brows: [[-2, 10], [7, -6]], mouth: "tongue", cheeks: 1 },
    smug:     { eyes: ["half", "half"], brows: [[1, 6], [8, -12]], mouth: "smirk", cheeks: 0.5 },
    shock:    { eyes: ["wide", "wide"], brows: [[11, -6], [11, 6]], mouth: "o", squash: [0.9, 1.12] },
    grin:     { eyes: ["open", "open"], brows: [[4, -5], [4, 5]], mouth: "grin", cheeks: 1 },
    skeptic:  { eyes: ["half", "open"], brows: [[-3, 14], [10, -8]], mouth: "flat" },
    angry:    { eyes: ["angry", "angry"], brows: [[-4, 24], [-4, -24]], mouth: "growl", squash: [1.04, 0.97] },
    worried:  { eyes: ["sad", "sad"], brows: [[6, -18], [6, 18]], mouth: "wobble", sweat: 1 },
    kiss:     { eyes: ["closed", "closed"], brows: [[4, -6], [4, 6]], mouth: "pucker", blush: 1 },
    wail:     { eyes: ["closedSad", "closedSad"], brows: [[5, -20], [5, 20]], mouth: "wail", tears: 1, squash: [0.96, 1.06] },
    forced:   { eyes: ["wide", "wide"], brows: [[6, -16], [6, 16]], mouth: "grin", sweat: 1, cheeks: 0.3 },
    bliss:    { eyes: ["closed", "closed"], brows: [[3, -6], [3, 6]], mouth: "smileOpen", cheeks: 1, blush: 1 },
  };
  TS.FACE5 = X;
  TS.face5 = (c, e) => {
    const E = typeof e === "string" ? X[e] : e, ink = c.spec.skin === "ink", LINE = ink ? "#F4EEE2" : INK, SKIN = ink ? INK : (c.spec.skin || SR.SKIN || "#F1EBDD");
    const head = [...c.g.querySelectorAll("circle")].find((n) => +n.getAttribute("r") === 41), headG = head.parentNode, hair = c.hair || [];
    [...headG.children].forEach((n) => { if (n !== head && !hair.includes(n)) n.setAttribute("display", "none"); });   // hide the rig's eyes + mouth
    const F = el("g", { transform: "translate(7,0)" }); const kids = [...headG.children], hi = kids.indexOf(head);
    const front = kids.find((n, j) => j > hi && hair.includes(n)); headG.insertBefore(F, front || null);   // above the head, below the front hair
    if (E.squash) headG.setAttribute("transform", (headG.getAttribute("transform") || "") + ` scale(${E.squash[0]},${E.squash[1]})`);
    const P = (d, o) => el("path", Object.assign({ d, fill: "none", stroke: LINE, "stroke-width": 3.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, o), F);
    // cheeks (pushed up by a smile) and blush
    if (E.blush || E.cheeks) [-1, 1].forEach((s) => el("ellipse", { cx: s * 18, cy: 9, rx: 7, ry: 4, fill: "#FF8FA3", opacity: E.blush ? 0.75 : 0.45 }, F));
    if (E.cheeks) [-1, 1].forEach((s) => P(`M${s * 24},${4} q${s * 4},${4} ${s * 2},${9}`, { "stroke-width": 2.6 }));
    // eyes
    E.eyes.forEach((t, i) => { const s = i ? 1 : -1, x = s * 14, y = -6, g = el("g", { transform: `translate(${x},${y})` }, F);
      const white = (rx, ry) => el("ellipse", { rx, ry, fill: "#FFFFFF", stroke: ink ? "#F4EEE2" : INK, "stroke-width": 3 }, g);
      const pupil = (r, dy = 1) => { el("circle", { cx: 1, cy: dy, r, fill: INK }, g); el("circle", { cx: 2.6, cy: dy - 2.2, r: r * 0.38, fill: "#FFFFFF" }, g); };
      if (t === "open") { white(8, 10); pupil(4.6); }
      if (t === "wide") { white(10.5, 13); pupil(3, 0); }
      if (t === "half") { white(8, 10); pupil(4.6, 3); el("path", { d: "M-9,-11 L9,-11 L9,0 L-9,1 Z", fill: SKIN }, g); P("M-9,1 L9,0", { transform: `translate(${x},${y})` }); }
      if (t === "angry") { white(8, 9); pupil(4.4, 2); el("path", { d: `M-10,-11 L10,-11 L10,${s < 0 ? 2 : -6} L-10,${s < 0 ? -6 : 2} Z`, fill: SKIN }, g); P(`M-9,${s < 0 ? -6 : 2} L9,${s < 0 ? 2 : -6}`, { transform: `translate(${x},${y})` }); }
      if (t === "sad") { white(8, 10); pupil(4.6, 2); el("path", { d: `M-10,-11 L10,-11 L10,${s < 0 ? -7 : 0} L-10,${s < 0 ? 0 : -7} Z`, fill: SKIN }, g); P(`M-9,${s < 0 ? 0 : -7} L9,${s < 0 ? -7 : 0}`, { transform: `translate(${x},${y})` }); }
      if (t === "happy") P(`M${x - 8},${y + 3} Q${x},${y - 9} ${x + 8},${y + 3}`, { "stroke-width": 4.4 });
      if (t === "closed") P(`M${x - 8},${y - 1} Q${x},${y + 6} ${x + 8},${y - 1}`, { "stroke-width": 4 });
      if (t === "closedSad") P(`M${x - 8},${y + 2} Q${x},${y - 4} ${x + 8},${y + 2}`, { "stroke-width": 4 });
      if (t === "wink") { P(`M${x - 8},${y + 1} Q${x},${y - 6} ${x + 8},${y + 1}`, { "stroke-width": 4.4 }); P(`M${x + s * 7},${y} l${s * 4},${-3}`, { "stroke-width": 3 }); } });
    // brows: tapered strokes with their own raise + angle
    (E.brows || [[0, 0], [0, 0]]).forEach(([raise, ang], i) => { const s = i ? 1 : -1, x = s * 14, y = -20 - raise;
      el("path", { d: "M-9,2 Q0,-4 9,1 Q0,-1 -9,4 Z", fill: LINE, stroke: LINE, "stroke-width": 2.4, "stroke-linejoin": "round", transform: `translate(${x},${y}) rotate(${ang})` }, F); });
    // a small nose makes the face read as human (the reference faces all have one)
    if (E.nose !== false) P("M3,2 q5,4 0,7 q-2,1 -4,0", { "stroke-width": 3 });
    // mouths
    const M = E.mouth, my = 16, DARK = "#5A1F2A", TONG = "#FF7A8A", TEETH = "#FFFFFF";
    const fillP = (d, fill, sw = 3.4) => el("path", { d, fill, stroke: LINE, "stroke-width": sw, "stroke-linejoin": "round" }, F);
    if (M === "laughBig") { fillP(`M-17,${my - 4} Q0,${my - 6} 17,${my - 4} Q15,${my + 20} 0,${my + 21} Q-15,${my + 20} -17,${my - 4} Z`, DARK);
      el("path", { d: `M-15,${my - 3} Q0,${my - 5} 15,${my - 3} L13,${my + 2} Q0,${my} -13,${my + 2} Z`, fill: TEETH }, F); el("path", { d: `M-8,${my + 15} Q0,${my + 8} 8,${my + 15} Q0,${my + 21} -8,${my + 15} Z`, fill: TONG }, F); }
    if (M === "smileOpen") { fillP(`M-12,${my - 2} Q0,${my} 12,${my - 2} Q9,${my + 11} 0,${my + 12} Q-9,${my + 11} -12,${my - 2} Z`, DARK); el("path", { d: `M-6,${my + 8} Q0,${my + 4} 6,${my + 8} Q0,${my + 12} -6,${my + 8} Z`, fill: TONG }, F); }
    if (M === "grin") { fillP(`M-16,${my - 4} Q0,${my} 16,${my - 4} Q13,${my + 10} 0,${my + 11} Q-13,${my + 10} -16,${my - 4} Z`, TEETH);
      P(`M-15,${my + 2} Q0,${my + 5} 15,${my + 2}`, { "stroke-width": 2.2 }); [-8, 0, 8].forEach((tx) => P(`M${tx},${my - 2} L${tx},${my + 9}`, { "stroke-width": 1.8 })); }
    if (M === "growl") { fillP(`M-14,${my + 2} Q0,${my - 6} 14,${my + 2} Q12,${my + 10} 0,${my + 9} Q-12,${my + 10} -14,${my + 2} Z`, TEETH);
      P(`M-13,${my + 3} Q0,${my - 2} 13,${my + 3}`, { "stroke-width": 2 }); [-7, 0, 7].forEach((tx) => P(`M${tx},${my - 2} L${tx},${my + 8}`, { "stroke-width": 1.8 })); }
    if (M === "smirk") { P(`M-12,${my + 3} Q2,${my + 5} 14,${my - 5}`, { "stroke-width": 4 }); P(`M14,${my - 5} l3,-2`, { "stroke-width": 3 }); }
    if (M === "o") { fillP(`M0,${my - 3} C7,${my - 3} 8,${my + 14} 0,${my + 14} C-8,${my + 14} -7,${my - 3} 0,${my - 3} Z`, DARK); }
    if (M === "pucker") { el("path", { d: `M-2,${my - 2} q-7,3 -1,6 q-7,3 1,7 q6,1 5,-6 q2,-6 -5,-7 Z`, fill: "#E2577A", stroke: LINE, "stroke-width": 3 }, F); }
    if (M === "wobble") P(`M-12,${my + 6} q4,-5 8,0 q4,5 8,0 q4,-5 8,0`, { "stroke-width": 3.6 });
    if (M === "flat") P(`M-11,${my + 4} L12,${my + 1}`, { "stroke-width": 4 });
    if (M === "tongue") { P(`M-14,${my - 1} Q0,${my + 10} 14,${my - 1}`, { "stroke-width": 4 }); el("path", { d: `M-1,${my + 4} Q-2,${my + 18} 6,${my + 18} Q13,${my + 17} 10,${my + 3} Z`, fill: TONG, stroke: LINE, "stroke-width": 3 }, F); P(`M5,${my + 7} L5,${my + 13}`, { "stroke-width": 1.6 }); }
    if (M === "wail") { fillP(`M-14,${my + 12} Q0,${my - 8} 14,${my + 12} Q0,${my + 16} -14,${my + 12} Z`, DARK); el("path", { d: `M-6,${my + 11} Q0,${my + 6} 6,${my + 11} Q0,${my + 14} -6,${my + 11} Z`, fill: TONG }, F); }
    if (E.sweat) el("path", { d: "M30,-26 q6,10 0,15 q-6,-5 0,-15 Z", fill: "#7EC8FF", stroke: LINE, "stroke-width": 2.6 }, F);
    if (E.tears) [-1, 1].forEach((s) => el("path", { d: `M${s * 14 - 3},-2 Q${s * 20},18 ${s * 22},40`, fill: "none", stroke: "#7EC8FF", "stroke-width": 6, "stroke-linecap": "round", opacity: 0.9 }, F));
    return F; };
})();
