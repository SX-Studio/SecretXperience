/* Social Ripple original cast — rigged 2D characters (our own designs).
   const C = CAST(I);  const kai = C.make(parent, "kai", x, feetY, scale, appearAt);
   kai.key(t, pose, dur)      blend to a named pose (or a partial pose object) starting at t over dur
   kai.move(t, x, dur)        walk/slide the root to x (legs cycle while moving)
   kai.cry(t0, t1)            tears under the eyes between t0 and t1 (they follow the head)
   kai.face(t, expr)          expression: neutral | smile | grin | talk | sad | strain | wow | determined | tired
   kai.say(lineId)            mouth moves with the narration words of that line (uses window.WORDS / window.DT)
   kai.update(t)
   Poses: stand, wave, fist, point, think, slump, pushUp, pushDown, flat, pockets, cheer, look */
(function () {
  window.CAST = function (I) {
    const el = I.el, INK = I.INKC, NS = "http://www.w3.org/2000/svg";
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const D = {
      nia: { skin: "#A8714E", hair: "#231813", hairStyle: "braidbun", top: "#EFE6D6", top2: "#D9CDB8", pants: "#6E8FB8", shoe: "#F4F4F0", eye: "#4A2E1E", glasses: true, lash: true, halfzip: true, wide: true, chunky: true },
      kai: { skin: "#C98E62", hair: "#1E1612", hairStyle: "fade", top: "#7A8B5A", top2: "#66764A", pants: "#2E2E33", shoe: "#F4F4F0", eye: "#5A3A1E", brows: "thick", hood: true, hoodie: true, cargo: true, chunky: true, wide: true },
      mo: { skin: "#E8C7A8", hair: "#2A2230", hairStyle: "curtain", top: "#2A2A30", top2: "#1E1E24", pants: "#3D5A80", shoe: "#F4F4F0", eye: "#6F8FAF", phones: true, tired: true, hood: true, vest: "#8A93A6", wide: true, chunky: true },
      // anime characters (drawn in our style) for the moments a lesson references them
      luffy: { skin: "#F7D3AE", hair: "#1B1A1F", hairStyle: "luffy", top: "#D8322A", top2: "#B8261F", pants: "#8FB4E0", cuff: "#FFFFFF", shoe: "#C9A27A", sole: "#8A5A2B", eye: "#1B1A1F", eyeScar: true, vestClosed: true, shorts: true, sleeveless: true, sandals: true, accs: ["strawhat"], acc: "strawhat" },
      luffyEL: { skin: "#F7D3AE", hair: "#1B1A1F", hairStyle: "luffy", top: "#D8322A", top2: "#B8261F", pants: "#2A2A30", cuff: "#FFFFFF", shoe: "#C9A27A", sole: "#8A5A2B", eye: "#1B1A1F", eyeScar: true, vestClosed: true, shorts: true, sleeveless: true, sandals: true, hatBack: true },
      nami: { skin: "#F8D9BC", hair: "#F08A2A", hairStyle: "nami", top: "#A8D8A0", top2: "#6FAF6A", pants: "#1E1E22", cuff: "#1E1E22", shoe: "#C9A27A", sole: "#8A5A2B", eye: "#6B4226", lash: true, camisole: true, shorts: true, sleeveless: true, sandals: true, tattoo: true, handBandage: true, hipRings: true, accs: ["strawhat"], acc: "none" },
      zoro: { skin: "#E8C39A", hair: "#6FAF5A", hairStyle: "zoro", top: "#2A3A6A", top2: "#8FB4E0", pants: "#1E1E22", shoe: "#1E1E22", sole: "#111114", eye: "#2A2A2A", brows: "thick", openShirt: true, shortSleeve: true, chestBandage: true, haramaki: "#5E9A4E", sword: true, armBandana: true, earrings: true },
      usopp: { skin: "#D9A679", hair: "#1E1A1A", hairStyle: "usopp", top: "#D9A679", top2: "#8A5A2B", pants: "#8A5A2B", shoe: "#6B4A2E", sole: "#3A2A1E", eye: "#2A2A2A", longNose: true, overalls: true, sleeveless: true, sash: false, satchel: true, armStripe: true, lips: true },
      sanji: { skin: "#F8DDC4", hair: "#F2D24B", hairStyle: "sanji", top: "#1E1E22", top2: "#5C86C4", pants: "#1E1E22", shoe: "#111114", sole: "#111114", eye: "#3A5A8A", suit: true, cigarette: true, curlBrow: true },
      robin: { skin: "#E8C8A8", hair: "#1A1820", hairStyle: "robin", top: "#1E1E22", top2: "#2E2E36", pants: "#1E1E22", shoe: "#111114", sole: "#111114", eye: "#3A6FB8", lash: true, coat: true, dress: true },
      sogeking: { skin: "#D9A679", hair: "#1E1A1A", hairStyle: "usopp", top: "#D9A679", top2: "#8A5A2B", pants: "#8A5A2B", shoe: "#C9A27A", sole: "#8A5A2B", eye: "#2A2A2A", overalls: true, sleeveless: true, cape: "#8A1E22", accs: ["sogemask"], acc: "sogemask", noBandana: true },
      naruto: { skin: "#F6CFA4", hair: "#F7C531", hairStyle: "naruto", top: "#F28C28", top2: "#2C5AA0", pants: "#F28C28", shoe: "#2C5AA0", sole: "#1E3E73", eye: "#2F7FE0", whiskers: true, narutoJacket: true, holster: true, accs: ["goggles", "band"], acc: "goggles", brows: "thick", browCol: "#C9962A" },
      iruka: { skin: "#D9A679", hair: "#5A3A28", hairStyle: "topknot", top: "#2C3E63", top2: "#22304E", pants: "#2C3E63", shoe: "#2C5AA0", sole: "#1E3E73", eye: "#3A2A1E", noseScar: true, flak: "#6B8E4E", accs: ["band"], acc: "band" },
      gaara: { skin: "#F3DCC8", hair: "#A8322A", hairStyle: "gaara", top: "#3A2A2E", top2: "#2A1E22", pants: "#3A2A2E", shoe: "#2A2A30", sole: "#1E1E24", eye: "#7FC8B8", rings: true, noBrows: true, kanji: true, sash: true, gourd: true },
      haku: { skin: "#F8E4D4", hair: "#2A2020", hairStyle: "hakubun", top: "#4F8068", top2: "#3E6653", pants: "#7A5A48", shoe: "#C9A27A", sole: "#8A6A4A", eye: "#5A3A2A", lash: true, coat: true, haori: true, accs: ["mask"], acc: "mask" },
      rue: { skin: "#F6D2B4", hair: "#6B3A22", hairStyle: "pony", top: "#F28C6A", top2: "#E07A58", pants: "#7F9CC8", shoe: "#F4F4F0", sole: "#C8A070", eye: "#3E8E5A", freckles: true, bandage: true, puffer: true, wide: true },
    };
    const POSES = {
      stand: { root: 0, lift: 0, side: 0, torso: 0, head: 0, aL: 10, eL: -6, aR: -10, eR: 6, lL: 4, kL: 0, lR: -4, kR: 0 },
      wave: { aR: -150, eR: 25 }, fist: { aR: -168, eR: 12, head: -4 }, cheer: { aL: 160, eL: 20, aR: -160, eR: -20 },
      point: { aR: -95, eR: 0, head: -6 }, think: { aR: -150, eR: -150, head: 8 }, look: { head: -12, torso: -3 },
      slump: { torso: 6, head: 22, aL: 4, eL: 0, aR: -4, eR: 0, lift: 6 },
      sit: { lL: -84, kL: 86, lR: -76, kR: 80, lift: 74, torso: -4, head: 4, aL: -168, eL: 14, aR: -168, eR: 14 },
      cuffed: { aL: 22, eL: -75, aR: -22, eR: 75, head: 10 }, kneel: { lift: 126, lL: 76, kL: -150, lR: -76, kR: 150, torso: 5, head: 16, aL: 14, eL: -10, aR: -14, eR: 10 },
      arms: { aL: 55, eL: -120, aR: -55, eR: 120 },
      pockets: { aL: 18, eL: -40, aR: -18, eR: 40, head: 4 },
      pushUp: { root: 62, lift: -40, side: 0, torso: 0, head: -58, aL: -80, eL: 0, aR: -80, eR: 0, lL: 0, kL: 0, lR: 0, kR: 0, plant: 1 },
      pushDown: { root: 77, lift: -18, side: 0, torso: 0, head: -73, aL: -80, eL: 0, aR: -80, eR: 0, lL: 0, kL: 0, lR: 0, kR: 0, plant: 1 },
      flat: { root: 90, lift: 0, side: -46, torso: 0, head: -60, aL: -170, eL: 0, aR: -170, eR: 0, lL: 0, kL: 0, lR: 0, kR: 0, plant: 0 },
    };
    const JOINTS = ["root", "lift", "side", "torso", "head", "aL", "eL", "aR", "eR", "lL", "kL", "lR", "kR", "plant"];
    function make(parent, name, x, y, s, at) {
      const c = D[name], G = (p, a = {}) => el("g", a, p);
      const root = G(parent, { opacity: 0 }), body = G(root);
      const limb = (p, px, py, L, w, col, end) => { const g = G(p); const seg = G(g); el("path", { d: `M0,0 L0,${L}`, stroke: INK, "stroke-width": w + 8, "stroke-linecap": "round" }, seg);
        el("path", { d: `M0,0 L0,${L}`, stroke: col, "stroke-width": w, "stroke-linecap": "round" }, seg); const j = G(g); return { g, j, px, py, L }; };
      // ---- legs (hip at 0,0; feet at y=+170)
      const legs = [-1, 1].map((d) => { const th = limb(body, d * 24, 0, 80, c.wide ? 36 : 30, c.pants); const sh = limb(th.j, 0, 80, 78, c.shorts ? 22 : (c.wide ? 34 : 26), c.shorts ? c.skin : c.pants);
        if (c.shorts) { th.g.insertBefore(el("path", { d: "M-20,78 H20", stroke: c.cuff || "#5C86C4", "stroke-width": c.cuff === "#FFFFFF" ? 18 : 12, "stroke-linecap": "round" }), th.j); if (c.cuff === "#FFFFFF") th.g.insertBefore(el("path", { d: "M-24,70 q8,-8 16,0 t16,0 t16,0", fill: "none", stroke: INK, "stroke-width": 2.5 }), th.j); }
        if (c.hipRings && d > 0) [0, 16].forEach((o2) => th.g.insertBefore(el("circle", { cx: 12, cy: 10 + o2, r: 6, fill: "none", stroke: "#F2C230", "stroke-width": 3 }), th.j));
        if (c.cargo) el("rect", { x: d > 0 ? 8 : -26, y: 30, width: 18, height: 26, rx: 3, fill: c.pants, stroke: "#55555E", "stroke-width": 3 }, th.g);
        if (c.holster && d > 0) th.g.insertBefore(el("rect", { x: -19, y: 26, width: 38, height: 24, rx: 3, fill: "#FFF6E6", stroke: INK, "stroke-width": 3 }), th.j);
        const shoe = el("ellipse", { cx: d * 6, cy: c.sandals ? 90 : 86, rx: c.chunky ? 33 : 28, ry: c.sandals ? 8 : (c.chunky ? 18 : 14), fill: c.shoe, stroke: INK, "stroke-width": 5 }, sh.j);
        if (c.sandals) { el("ellipse", { cx: d * 6 + 4, cy: 80, rx: 20, ry: 10, fill: c.skin, stroke: INK, "stroke-width": 4 }, sh.j); el("path", { d: `M${d * 6 - 14},84 L${d * 6 + 6},72 L${d * 6 + 22},84`, fill: "none", stroke: c.strap || "#8A5A2B", "stroke-width": 5, "stroke-linecap": "round" }, sh.j); }
        el("path", { d: `M${d * 6 - (c.chunky ? 31 : 26)},${92} h${c.chunky ? 62 : 52}`, stroke: c.sole || "#CFC6B4", "stroke-width": c.chunky ? 7 : 5, "stroke-linecap": "round" }, sh.j); return { th, sh, d, shoe }; });
      // ---- torso group (pivot at hip)
      const torso = G(body);
      if (c.hood) el("path", { d: "M-46,-150 Q0,-120 46,-150 Q30,-110 0,-108 Q-30,-110 -46,-150 Z", fill: c.top2, stroke: INK, "stroke-width": 5 }, torso);
      if (c.cape) el("path", { d: "M-66,-146 L66,-146 L104,150 Q0,170 -104,150 Z", fill: c.cape, stroke: INK, "stroke-width": 6 }, torso);
      if (c.hatBack) { el("ellipse", { cx: 0, cy: -150, rx: 120, ry: 42, fill: "#E9C46A", stroke: INK, "stroke-width": 5 }, torso); el("path", { d: "M-40,-150 Q0,-178 40,-150", fill: "none", stroke: "#C62F2A", "stroke-width": 8 }, torso); }
      if (c.gourd) { el("ellipse", { cx: 44, cy: -92, rx: 46, ry: 84, fill: "#C9A66B", stroke: INK, "stroke-width": 6, transform: "rotate(18 44 -92)" }, torso); el("ellipse", { cx: 74, cy: -178, rx: 22, ry: 26, fill: "#C9A66B", stroke: INK, "stroke-width": 5 }, torso); el("rect", { x: 64, y: -214, width: 18, height: 16, rx: 3, fill: "#8A5A2B", stroke: INK, "stroke-width": 3 }, torso); }
      const tFront = c.coat ? el("path", { d: "M-60,-130 Q-64,-146 -42,-148 L42,-148 Q64,-146 60,-130 L74,40 L-74,40 Z", fill: c.top, stroke: INK, "stroke-width": 6 }, torso)
        : el("path", { d: "M-58,-128 Q-60,-146 -40,-148 L40,-148 Q60,-146 58,-128 L52,8 L-52,8 Z", fill: c.top, stroke: INK, "stroke-width": 6 }, torso);
      const tSide = el("path", { d: c.coat ? "M-36,-130 Q-38,-148 -18,-150 L22,-150 Q42,-146 40,-128 L52,40 L-46,40 Z" : "M-34,-128 Q-36,-148 -16,-150 L22,-150 Q42,-146 40,-126 L36,8 L-34,8 Z", fill: c.top, stroke: INK, "stroke-width": 6, style: "display:none" }, torso);
      const n0 = torso.childNodes.length;
      if (c.hoodie || c.hood) { el("path", { d: "M-36,-30 h72 l-8,32 h-56 z", fill: c.top2, stroke: INK, "stroke-width": 4 }, torso); el("path", { d: "M-12,-138 v40 M12,-138 v34", stroke: "#F4F4F0", "stroke-width": 4, "stroke-linecap": "round" }, torso); el("path", { d: "M-52,2 H52", stroke: c.top2, "stroke-width": 8 }, torso); }
      if (c.halfzip) { el("path", { d: "M-30,-150 Q0,-136 30,-150 L28,-128 Q0,-116 -28,-128 Z", fill: c.top2, stroke: INK, "stroke-width": 4 }, torso); el("path", { d: "M0,-128 V-70", stroke: "#8A847A", "stroke-width": 4 }, torso); el("circle", { cx: 0, cy: -70, r: 5, fill: "#8A847A" }, torso); el("path", { d: "M-50,0 H50", stroke: c.top2, "stroke-width": 9 }, torso); }
      if (c.vest) { el("path", { d: "M-56,-132 Q-40,-150 -18,-142 L-10,6 L-54,6 Z M56,-132 Q40,-150 18,-142 L10,6 L54,6 Z", fill: c.vest, stroke: INK, "stroke-width": 5 }, torso); for (let k = 0; k < 4; k++) el("path", { d: `M-52,${-110 + k * 30} H-14 M14,${-110 + k * 30} H52`, stroke: "#6E7688", "stroke-width": 3 }, torso); }
      if (c.puffer) { for (let k = 0; k < 4; k++) el("path", { d: `M-54,${-118 + k * 28} Q0,${-110 + k * 28} 54,${-118 + k * 28}`, fill: "none", stroke: c.top2, "stroke-width": 4 }, torso); el("path", { d: "M0,-146 V-24", stroke: INK, "stroke-width": 3 }, torso); el("path", { d: "M-50,-24 H50 L52,8 H-52 Z", fill: "#FFF6E6", stroke: INK, "stroke-width": 4 }, torso); }
      if (c.vestClosed) { el("path", { d: "M0,-146 V8", stroke: INK, "stroke-width": 3 }, torso); [-104, -64, -24].forEach((yy) => el("circle", { cx: 9, cy: yy, r: 6.5, fill: "#F2C230", stroke: INK, "stroke-width": 2.5 }, torso)); el("path", { d: "M-22,-148 L0,-126 L22,-148", fill: c.skin, stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, torso); }
      if (c.camisole) { el("path", { d: "M-40,-150 L-22,-150 L-10,-128 L10,-128 L22,-150 L40,-150 L30,-118 L-30,-118 Z", fill: c.skin, stroke: "none" }, torso); el("path", { d: "M-34,-150 L-26,-118 M34,-150 L26,-118 M-30,-118 Q0,-106 30,-118", fill: "none", stroke: INK, "stroke-width": 4 }, torso); [[-26, -80, 15], [20, -52, 18], [-14, -22, 13], [30, -96, 10]].forEach(([x2, y2, rr]) => el("circle", { cx: x2, cy: y2, r: rr, fill: c.top2, opacity: 0.85 }, torso)); }
      if (c.openShirt) { el("path", { d: "M-28,-148 L28,-148 L24,8 L-24,8 Z", fill: c.skin, stroke: INK, "stroke-width": 4 }, torso); if (c.chestBandage) for (let k = 0; k < 5; k++) el("path", { d: `M-27,${-120 + k * 22} L26,${-108 + k * 22}`, stroke: "#FFFFFF", "stroke-width": 14 }, torso); if (c.chestBandage) for (let k = 0; k < 5; k++) el("path", { d: `M-27,${-113 + k * 22} L26,${-101 + k * 22}`, stroke: "#B8B0A2", "stroke-width": 2 }, torso);
        [[-44, -100], [-40, -50], [42, -90], [44, -40]].forEach(([x2, y2]) => el("path", { d: `M${x2},${y2} q6,-10 12,0 q-6,10 -12,0`, fill: "none", stroke: c.top2, "stroke-width": 3 }, torso)); }
      if (c.haramaki) { el("path", { d: "M-56,-30 H56 L54,10 H-54 Z", fill: c.haramaki, stroke: INK, "stroke-width": 5 }, torso); for (let k = -2; k <= 2; k++) el("path", { d: `M${k * 20},-28 V8`, stroke: "#4A7A3E", "stroke-width": 2.5 }, torso); }
      if (c.sword) { el("path", { d: "M-50,-14 L-110,96", stroke: INK, "stroke-width": 16, "stroke-linecap": "round" }, torso); el("path", { d: "M-50,-14 L-110,96", stroke: "#F4F0E6", "stroke-width": 9, "stroke-linecap": "round" }, torso); el("path", { d: "M-32,-48 L-50,-14", stroke: INK, "stroke-width": 15, "stroke-linecap": "round" }, torso); el("path", { d: "M-32,-48 L-50,-14", stroke: "#F4F0E6", "stroke-width": 8, "stroke-linecap": "round" }, torso); el("path", { d: "M-62,-22 L-38,-8", stroke: "#C9A640", "stroke-width": 7, "stroke-linecap": "round" }, torso); }
      if (c.overalls) { el("path", { d: "M-38,-92 H38 L52,8 H-52 Z", fill: c.top2, stroke: INK, "stroke-width": 5 }, torso); el("path", { d: "M-34,-92 L-44,-146 M34,-92 L44,-146", stroke: INK, "stroke-width": 16, "stroke-linecap": "round" }, torso); el("path", { d: "M-34,-92 L-44,-146 M34,-92 L44,-146", stroke: c.top2, "stroke-width": 10, "stroke-linecap": "round" }, torso); el("path", { d: "M-56,-22 H56", stroke: "#F4F0E6", "stroke-width": 14 }, torso); }
      if (c.satchel) { el("path", { d: "M-40,-140 L48,-10", stroke: "#8A6A2A", "stroke-width": 6 }, torso); el("rect", { x: 34, y: -20, width: 50, height: 46, rx: 8, fill: "#E8C15A", stroke: INK, "stroke-width": 4 }, torso); }
      if (c.suit) { el("path", { d: "M-26,-150 L0,-104 L26,-150 Z", fill: c.top2, stroke: INK, "stroke-width": 4 }, torso); for (let k = -2; k <= 2; k++) el("path", { d: `M${k * 7},-146 L${k * 4},-110`, stroke: "#FFFFFF", "stroke-width": 1.5 }, torso); el("path", { d: "M-4,-140 L4,-140 L7,-104 L0,-94 L-7,-104 Z", fill: "#22223A", stroke: INK, "stroke-width": 3 }, torso);
        el("path", { d: "M-30,-150 L-4,-98 L-10,6 M30,-150 L4,-98", fill: "none", stroke: "#3A3A44", "stroke-width": 4 }, torso); [[-18, -64], [-18, -30], [16, -64], [16, -30]].forEach(([x2, y2]) => el("circle", { cx: x2, cy: y2, r: 5.5, fill: "#F2C230", stroke: INK, "stroke-width": 2 }, torso)); }
      if (c.dress) { el("path", { d: "M-22,-148 L0,-118 L22,-148", fill: "none", stroke: "#4A4A56", "stroke-width": 5, "stroke-linejoin": "round" }, torso); el("path", { d: "M-70,34 H70", stroke: "#FFFFFF", "stroke-width": 7, "stroke-dasharray": "3 9" }, torso); el("path", { d: "M-30,-90 Q0,-70 30,-90", fill: "none", stroke: "#3A3A44", "stroke-width": 3 }, torso); }
      if (c.openVest) { el("path", { d: "M-30,-148 L30,-148 L26,8 L-26,8 Z", fill: c.skin, stroke: INK, "stroke-width": 4 }, torso); [-1, 1].forEach((d) => [-60, -20].forEach((yy) => el("circle", { cx: d * 34, cy: yy, r: 6, fill: "#F2C230", stroke: INK, "stroke-width": 2.5 }, torso))); el("path", { d: "M-10,-70 q10,8 20,0", fill: "none", stroke: "#C99A7A", "stroke-width": 3 }, torso); }
      if (c.narutoJacket) { el("path", { d: "M-58,-128 Q-60,-146 -40,-148 L40,-148 Q60,-146 58,-128 L56,-98 Q0,-86 -56,-98 Z", fill: c.top2, stroke: INK, "stroke-width": 5 }, torso); el("path", { d: "M0,-96 V6", stroke: INK, "stroke-width": 3 }, torso);
        el("path", { d: "M-34,-152 L0,-112 L34,-152 L24,-160 L0,-134 L-24,-160 Z", fill: "#FFFFFF", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, torso); el("circle", { cx: -26, cy: -60, r: 9, fill: "#FFFFFF", stroke: INK, "stroke-width": 3 }, torso); el("path", { d: "M-52,2 H52", stroke: c.top2, "stroke-width": 9 }, torso); }
      if (c.flak) { el("path", { d: "M-56,-132 Q-40,-150 -14,-146 L-6,6 L-54,6 Z M56,-132 Q40,-150 14,-146 L6,6 L54,6 Z", fill: c.flak, stroke: INK, "stroke-width": 5 }, torso); [-1, 1].forEach((d) => { el("rect", { x: d > 0 ? 16 : -46, y: -112, width: 30, height: 30, rx: 3, fill: c.flak, stroke: INK, "stroke-width": 3 }, torso); el("path", { d: `M${d > 0 ? 16 : -46},-100 h30`, stroke: INK, "stroke-width": 3 }, torso); });
        el("path", { d: "M-34,-152 Q0,-136 34,-152 L32,-134 Q0,-120 -32,-134 Z", fill: c.flak, stroke: INK, "stroke-width": 4 }, torso); }
      if (c.sash) { el("path", { d: "M-52,-146 L-26,-150 L54,-12 L40,8 Z", fill: "#F4F0E6", stroke: INK, "stroke-width": 4 }, torso); el("path", { d: "M52,-146 L30,-150 L-52,-30", fill: "none", stroke: "#6B4A2E", "stroke-width": 9, "stroke-linecap": "round" }, torso); }
      if (c.haori) { el("path", { d: "M-24,-148 L0,-70 L24,-148 Z", fill: "#7A5A48", stroke: INK, "stroke-width": 4 }, torso); for (let k = -2; k <= 2; k++) el("path", { d: `M${k * 8},-144 L${k * 5},-${78 + Math.abs(k) * 10}`, stroke: "#C9B49A", "stroke-width": 2 }, torso);
        el("path", { d: "M-30,-150 L-4,-66 L-10,38 M30,-150 L4,-66 L10,38", fill: "none", stroke: "#FFFFFF", "stroke-width": 9, "stroke-linejoin": "round" }, torso); el("path", { d: "M-74,40 H74", stroke: "#FFFFFF", "stroke-width": 9 }, torso);
        el("path", { d: "M-66,-40 H66 L68,-14 H-68 Z", fill: "#8A5A3A", stroke: INK, "stroke-width": 4 }, torso); }
      const det = el("g", {}); Array.from(torso.childNodes).slice(n0).forEach((nd) => det.appendChild(nd)); torso.appendChild(det);
      // ---- arms (shoulders at ±50,-128)
      const sleeve = c.sleeveless ? c.skin : (c.sleeve || c.top);
      const arms = [-1, 1].map((d) => { const ua = limb(torso, d * 50, -128, 72, 26, sleeve); const fa = limb(ua.j, 0, 72, 68, 24, ((c.torn && d > 0) || c.shortSleeve) ? c.skin : sleeve);
        if (c.tattoo && d > 0) ua.g.insertBefore(el("path", { d: "M-7,26 q14,-14 12,6 q-4,14 -14,4 q-2,-8 6,-8 M-6,44 l12,6", fill: "none", stroke: "#2F6FD0", "stroke-width": 3.5, "stroke-linecap": "round" }), ua.j);
        if (c.armBandana && d > 0) ua.g.insertBefore(el("path", { d: "M-13,36 H13", stroke: "#1E1E22", "stroke-width": 16 }), ua.j);
        if (c.armStripe && d > 0) [14, 26, 38].forEach((yy, i2) => fa.g.insertBefore(el("path", { d: `M-12,${yy} H12`, stroke: i2 % 2 ? "#FFFFFF" : "#3D6FB0", "stroke-width": 10 }), fa.j));
        if (c.handBandage && d > 0) fa.j.appendChild(el("path", { d: "M-12,60 H12 M-12,68 H12", stroke: "#FFFFFF", "stroke-width": 7 }));
        if (c.narutoJacket) ua.g.insertBefore(el("path", { d: "M0,0 L0,24", stroke: c.top2, "stroke-width": 26, "stroke-linecap": "round" }), ua.j);
        if (c.torn && d > 0) el("path", { d: "M-14,4 l6,8 l6,-6 l6,8 l6,-6", fill: "none", stroke: INK, "stroke-width": 4 }, fa.g);
        const hand = el("circle", { cx: 0, cy: 74, r: 16, fill: c.skin, stroke: INK, "stroke-width": 5 }, fa.j);
        if (c.wristband && d < 0) { el("rect", { x: -15, y: 52, width: 30, height: 14, rx: 3, fill: "#D8322A", stroke: INK, "stroke-width": 3 }, fa.j); el("path", { d: "M-8,55 v8 M-3,55 v8 M2,55 v8", stroke: "#FFF", "stroke-width": 2 }, fa.j); }
        if (c.bandage && d > 0) el("rect", { x: -10, y: 66, width: 20, height: 8, rx: 2, fill: "#FFF6E6", stroke: INK, "stroke-width": 2.5 }, fa.j);
        if (c.notebook && d < 0) el("rect", { x: -26, y: 60, width: 44, height: 56, rx: 4, fill: "#D8322A", stroke: INK, "stroke-width": 4, transform: "rotate(-12 0 80)" }, fa.j);
        return { ua, fa, d }; });
      // ---- head group (pivot at neck 0,-140)
      const headG = G(torso), r = 82, U = (u, v) => `${(u * r).toFixed(1)},${(-228 + v * r).toFixed(1)}`;
      el("path", { d: "M-14,-150 h28 v20 h-28 z", fill: c.skin, stroke: INK, "stroke-width": 4 }, headG);
      const P = (d, fill, sw = 5, p = headG) => el("path", { d, fill, stroke: INK, "stroke-width": sw, "stroke-linejoin": "round", "stroke-linecap": "round" }, p);
      const ring = (a0, a1, n, rin, rout, jit) => { const pts = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180, rr = i % 2 ? rout + (((i * 37) % 7) - 3) / 3 * jit : rin; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return pts; };
      const poly = (pts) => "M" + pts.map((q) => U(q[0], q[1])).join(" L") + " Z";
      // back hair
 if (c.hairStyle === "braidbun") { P(poly(ring(150, 390, 18, 0.99, 1.05, 0.0).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5); el("circle", { cx: 0, cy: -228 - 1.3 * r, r: 0.52 * r, fill: c.hair, stroke: INK, "stroke-width": 5 }, headG);
        for (let k = 0; k < 6; k++) el("path", { d: `M${(-0.4 + k * 0.16) * r},${-228 - 1.72 * r} q8,${0.42 * r} 0,${0.84 * r}`, fill: "none", stroke: "#4A3A30", "stroke-width": 3 }, headG); }
      if (c.hairStyle === "fade") { P(poly(ring(150, 390, 18, 0.99, 1.04, 0.0).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5); [[-0.55, -0.85], [-0.3, -1.0], [0, -1.05], [0.3, -1.0], [0.55, -0.85], [-0.15, -0.88], [0.15, -0.88], [-0.42, -0.7], [0.42, -0.7]].forEach(([u, v]) => el("circle", { cx: u * r, cy: -228 + v * r, r: 0.2 * r, fill: c.hair, stroke: INK, "stroke-width": 4 }, headG)); }
      if (c.hairStyle === "nami") P(poly([[-1.06, 0.3], [-1.08, -0.3], [-0.72, -1.0], [0, -1.12], [0.72, -1.0], [1.08, -0.3], [1.06, 0.3], [0.86, 0.42], [-0.86, 0.42]]), c.hair, 5);
      if (c.hairStyle === "zoro") P(poly(ring(150, 390, 20, 0.99, 1.14, 0.05).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5);
      if (c.hairStyle === "usopp") { [[-0.9, 0.05, 0.3], [0.9, 0.05, 0.3], [-1.0, -0.3, 0.26], [1.0, -0.3, 0.26], [-0.7, 0.4, 0.26], [0.7, 0.4, 0.26]].forEach(([u, v, rr]) => el("circle", { cx: u * r, cy: -228 + v * r, r: rr * r, fill: c.hair, stroke: INK, "stroke-width": 5 }, headG)); P(poly(ring(150, 390, 18, 0.99, 1.04, 0.0).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5); }
      if (c.hairStyle === "sanji") P(poly(ring(150, 390, 18, 0.99, 1.06, 0.0).concat([[1.0, 0.3], [-0.95, 0.1]])), c.hair, 5);
      if (c.hairStyle === "robin") P(poly([[-1.06, 0.7], [-1.08, -0.3], [-0.72, -1.0], [0, -1.12], [0.72, -1.0], [1.08, -0.3], [1.06, 0.7], [0.7, 0.8], [-0.7, 0.8]]), c.hair, 5);
      if (c.hairStyle === "luffy") P(poly(ring(150, 390, 18, 0.98, 1.2, 0.06).concat([[0.95, 0.1], [-0.95, 0.1]])), c.hair, 5);
      if (c.hairStyle === "naruto") P(poly(ring(150, 390, 22, 0.98, 1.72, 0.14).concat([[0.9, 0.05], [-0.9, 0.05]])), c.hair, 5);
      if (c.hairStyle === "gaara") P(poly(ring(150, 390, 26, 0.99, 1.24, 0.08).concat([[0.95, 0.1], [-0.95, 0.1]])), c.hair, 5);
      if (c.hairStyle === "topknot") { P(poly([[-0.2, -0.95], [-0.5, -1.6], [-0.14, -1.34], [0, -1.82], [0.14, -1.34], [0.5, -1.6], [0.2, -0.95]]), c.hair, 5); P(poly(ring(150, 390, 18, 0.99, 1.04, 0.0).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5); el("rect", { x: -18, y: -228 - 1.08 * r, width: 36, height: 14, rx: 4, fill: "#C9B48A", stroke: INK, "stroke-width": 3 }, headG); }
      if (c.hairStyle === "hakubun") { P(poly(ring(150, 390, 18, 0.99, 1.05, 0.0).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5); el("rect", { x: -0.3 * r, y: -228 - 1.5 * r, width: 0.6 * r, height: 0.52 * r, rx: 0.2 * r, fill: "#FFFFFF", stroke: INK, "stroke-width": 5 }, headG); el("path", { d: `M${-0.3 * r},${-228 - 1.12 * r} h${0.6 * r}`, stroke: "#B8B0A2", "stroke-width": 4 }, headG); }
      if (c.hairStyle === "curtain") P(poly(ring(150, 390, 20, 1.0, 1.1, 0.0).concat([[1.0, 0.25], [-1.0, 0.25]])), c.hair, 5);
      if (c.hairStyle === "pony") { P(`M${U(0.35, -0.95)} Q${U(1.25, -1.35)} ${U(1.15, -0.4)} Q${U(1.05, 0.4)} ${U(1.3, 0.95)} Q${U(0.8, 0.55)} ${U(0.85, -0.3)} Z`, c.hair, 5); P(poly(ring(150, 390, 18, 0.99, 1.04, 0.0).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5);
        el("rect", { x: 0.55 * r - 16, y: -228 - 0.98 * r - 10, width: 32, height: 20, rx: 6, fill: "#3E8E5A", stroke: INK, "stroke-width": 3 }, headG); }
     if (c.hairStyle === "puff") { [[-0.7, -0.55, 0.42], [0, -0.85, 0.5], [0.7, -0.55, 0.42], [-0.95, 0.0, 0.34], [0.95, 0.0, 0.34], [0, -1.45, 0.48]].forEach(([u, v, rr]) => el("circle", { cx: u * r, cy: -228 + v * r, r: rr * r, fill: c.hair, stroke: INK, "stroke-width": 5 }, headG)); }
      if (c.hairStyle === "swoop") P(poly(ring(160, 380, 16, 0.98, 1.2, 0.05).concat([[0.95, 0.05], [-0.95, 0.05]])), c.hair, 5);
      if (c.hairStyle === "shag") P(poly(ring(150, 390, 22, 1.0, 1.16, 0.04).concat([[1.0, 0.5], [0.85, 0.3], [-0.85, 0.3], [-1.0, 0.5]])), c.hair, 5);
      if (c.hairStyle === "bob") P(poly([[-1.08, 0.55], [-1.1, -0.3], [-0.7, -1.02], [0, -1.12], [0.7, -1.02], [1.1, -0.3], [1.08, 0.55], [0.7, 0.62], [-0.7, 0.62]]), c.hair, 5);
      if (c.scarf) { el("path", { d: "M-70,-150 Q0,-110 70,-150 Q78,-128 60,-118 Q0,-96 -60,-118 Q-78,-128 -70,-150 Z", fill: c.scarf, stroke: INK, "stroke-width": 5 }, torso); }
      // ears + face
      P(`M${U(-0.86, -0.02)} q${-0.22 * r},${0.02 * r} ${-0.16 * r},${0.26 * r} q${0.06 * r},${0.14 * r} ${0.2 * r},${0.06 * r} z`, c.skin, 4);
      const earR = P(`M${U(0.86, -0.02)} q${0.22 * r},${0.02 * r} ${0.16 * r},${0.26 * r} q${-0.06 * r},${0.14 * r} ${-0.2 * r},${0.06 * r} z`, c.skin, 4);
      P(`M${U(-0.9, -0.15)} C${U(-0.95, -1.08)} ${U(0.95, -1.08)} ${U(0.9, -0.15)} C${U(0.88, 0.42)} ${U(0.5, 0.8)} ${U(0, 0.96)} C${U(-0.5, 0.8)} ${U(-0.88, 0.42)} ${U(-0.9, -0.15)} Z`, c.skin, 6);
      if (c.phones) { const ph = el("g", {}); el("path", { d: "M-58,-150 Q0,-196 58,-150", fill: "none", stroke: "#1E1E24", "stroke-width": 9 }, ph); [-1, 1].forEach((dd) => el("ellipse", { cx: dd * 58, cy: -146, rx: 20, ry: 15, fill: "#2A2A33", stroke: INK, "stroke-width": 4 }, ph)); torso.insertBefore(ph, headG); }
      const f0 = headG.childNodes.length;
      if (c.freckles) [-1, 1].forEach((dd) => [[0.5, 0.42], [0.6, 0.5], [0.42, 0.52]].forEach(([u, v]) => el("circle", { cx: dd * u * r, cy: -228 + v * r, r: 2.6, fill: "#B0603A" }, headG)));
      el("ellipse", { cx: -0.55 * r, cy: -228 + 0.48 * r, rx: 13, ry: 7, fill: "#F08A80", opacity: 0.35 }, headG); el("ellipse", { cx: 0.55 * r, cy: -228 + 0.48 * r, rx: 13, ry: 7, fill: "#F08A80", opacity: 0.35 }, headG);
      if (c.rings) [-1, 1].forEach((dd) => el("ellipse", { cx: dd * 0.38 * r, cy: -228 + 0.14 * r, rx: 0.28 * r, ry: 0.31 * r, fill: "#1E1A1E" }, headG));
      if (c.whiskers) for (const dd of [-1, 1]) for (let i = 0; i < 3; i++) el("path", { d: `M${U(dd * 0.5, 0.36 + i * 0.11)} L${U(dd * 0.84, 0.32 + i * 0.14)}`, stroke: "#5A3A22", "stroke-width": 4, "stroke-linecap": "round" }, headG);
      if (c.eyeScar) el("path", { d: `M${U(0.2, 0.44)} Q${U(0.38, 0.52)} ${U(0.56, 0.44)} M${U(0.3, 0.4)} l3,10 M${U(0.45, 0.4)} l3,10`, fill: "none", stroke: "#8A4A3A", "stroke-width": 3.5, "stroke-linecap": "round" }, headG);
      if (c.noseScar) el("path", { d: `M${U(-0.5, 0.3)} Q${U(0, 0.36)} ${U(0.5, 0.3)}`, fill: "none", stroke: "#8A4A3A", "stroke-width": 5, "stroke-linecap": "round" }, headG);
      // eyes: open set + closed-happy set + tired lids
      const eyesOpen = G(headG), eyesHappy = G(headG, { style: "display:none" }), lids = G(headG, { style: "display:none" });
      for (const d of [-1, 1]) { const ex = d * 0.38, ey = 0.14;
        P(`M${U(ex, ey - 0.25)} C${U(ex + 0.21, ey - 0.25)} ${U(ex + 0.21, ey + 0.23)} ${U(ex, ey + 0.23)} C${U(ex - 0.21, ey + 0.23)} ${U(ex - 0.21, ey - 0.25)} ${U(ex, ey - 0.25)} Z`, "#FFFFFF", 3, eyesOpen);
        el("ellipse", { cx: ex * r, cy: -228 + (ey + 0.03) * r, rx: 0.13 * r, ry: 0.17 * r, fill: c.eye }, eyesOpen); el("ellipse", { cx: ex * r, cy: -228 + (ey + 0.05) * r, rx: 0.065 * r, ry: 0.09 * r, fill: "#0E0E12" }, eyesOpen);
        el("circle", { cx: (ex - 0.05) * r, cy: -228 + (ey - 0.05) * r, r: 0.045 * r, fill: "#FFFFFF" }, eyesOpen);
        P(`M${U(ex - 0.23, ey - 0.12)} Q${U(ex, ey - 0.33)} ${U(ex + 0.24, ey - 0.12)}`, "none", c.lash ? 8 : 6, eyesOpen);
        if (c.lash) P(`M${U(ex + d * 0.22, ey - 0.16)} l${d * 10},-8`, "none", 5, eyesOpen);
        P(`M${U(ex - 0.2, ey + 0.02)} Q${U(ex, ey - 0.2)} ${U(ex + 0.2, ey + 0.02)}`, "none", 6, eyesHappy);
        P(`M${U(ex - 0.22, ey - 0.03)} L${U(ex + 0.22, ey - 0.03)} L${U(ex + 0.2, ey - 0.25)} L${U(ex - 0.2, ey - 0.25)} Z`, c.skin, 0, lids); P(`M${U(ex - 0.23, ey - 0.03)} L${U(ex + 0.23, ey - 0.03)}`, "none", 6, lids); }
      const browG = G(headG); const brows = [-1, 1].map((d) => P(`M${U(d * 0.2, -0.3)} L${U(d * 0.56, -0.36)}`, "none", c.brows === "thick" ? 9 : 6, browG)); if (c.browCol) brows.forEach((b) => b.setAttribute("stroke", c.browCol)); if (c.noBrows) browG.setAttribute("opacity", 0);
      el("path", { d: `M${U(0.02, 0.4)} l-3,5`, stroke: "#A06A4A", "stroke-width": 4, "stroke-linecap": "round" }, headG);
      if (c.longNose) { el("path", { d: `M${U(0.0, 0.3)} L${U(0.34, 0.62)}`, stroke: INK, "stroke-width": 0.24 * r, "stroke-linecap": "round" }, headG); el("path", { d: `M${U(0.0, 0.3)} L${U(0.34, 0.62)}`, stroke: c.skin, "stroke-width": 0.16 * r, "stroke-linecap": "round" }, headG); }
      if (c.earrings) [0.16, 0.26, 0.36].forEach((v) => el("path", { d: `M${U(0.98, v)} l8,14`, stroke: "#E8B830", "stroke-width": 5, "stroke-linecap": "round" }, headG));
      if (c.curlBrow) el("path", { d: `M${U(-0.6, -0.34)} q-10,-12 -2,-18 q10,-4 12,8`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, headG);
      // mouths
      const MO = { neutral: [`M${U(-0.12, 0.66)} L${U(0.12, 0.66)}`, "none"], smile: [`M${U(-0.22, 0.6)} Q${U(0, 0.78)} ${U(0.22, 0.6)}`, "none"], sad: [`M${U(-0.16, 0.72)} Q${U(0, 0.6)} ${U(0.16, 0.72)}`, "none"],
        determined: [`M${U(-0.14, 0.68)} L${U(0.14, 0.64)}`, "none"], strain: [`M${U(-0.26, 0.6)} h${0.52 * r} v${0.12 * r} h${-0.52 * r} z`, "#FFFFFF"], wow: [`M${U(0, 0.56)} a${0.1 * r},${0.13 * r} 0 1,0 0.1,0 z`, "#7A2A2A"],
        grin: [`M${U(-0.32, 0.55)} Q${U(0, 0.62)} ${U(0.32, 0.55)} Q${U(0, 0.98)} ${U(-0.32, 0.55)} Z`, "#7A2A2A"] };
      const mouths = {}; for (const m in MO) mouths[m] = el("path", { d: MO[m][0], fill: MO[m][1], stroke: INK, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round", style: "display:none" }, headG);
      const talk = el("path", { d: "", fill: "#7A2A2A", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round", style: "display:none" }, headG);
      const faceG = el("g", {}); Array.from(headG.childNodes).slice(f0).forEach((nd) => faceG.appendChild(nd)); headG.appendChild(faceG);
      const tearG = el("g", { style: "display:none" }, faceG), cries = []; [-1, 1].forEach((dd) => el("path", { d: `M${U(dd * 0.44, 0.34)} q10,22 0,34 q-10,-12 0,-34 z`, fill: "#8CC8F0", stroke: INK, "stroke-width": 3 }, tearG));
      const fh0 = headG.childNodes.length;
      // front hair
 if (c.hairStyle === "braidbun") P(poly([[-0.94, -0.32], [-0.6, -0.5], [-0.2, -0.56], [0.0, -0.5], [0.2, -0.56], [0.6, -0.5], [0.94, -0.32], [0.7, -0.92], [-0.7, -0.92]]), c.hair, 5);
      if (c.hairStyle === "fade") { P(poly([[-0.9, -0.42], [-0.6, -0.6], [-0.2, -0.66], [0.2, -0.66], [0.6, -0.6], [0.9, -0.42], [0.7, -0.9], [-0.7, -0.9]]), c.hair, 5); [[-0.5, -0.62], [-0.18, -0.68], [0.16, -0.68], [0.48, -0.62]].forEach(([u, v]) => el("circle", { cx: u * r, cy: -228 + v * r, r: 0.16 * r, fill: c.hair, stroke: INK, "stroke-width": 3 }, headG)); }
      if (c.hairStyle === "curtain") { P(`M${U(0, -0.98)} Q${U(-0.5, -0.9)} ${U(-0.98, -0.1)} L${U(-1.0, 0.25)} Q${U(-0.8, -0.2)} ${U(-0.55, -0.32)} Q${U(-0.2, -0.45)} ${U(-0.04, -0.62)} Z`, c.hair, 5);
        P(`M${U(0, -0.98)} Q${U(0.5, -0.9)} ${U(0.98, -0.1)} L${U(1.0, 0.25)} Q${U(0.8, -0.2)} ${U(0.55, -0.32)} Q${U(0.2, -0.45)} ${U(0.04, -0.62)} Z`, c.hair, 5); }
      if (c.hairStyle === "pony") { P(poly([[-0.94, -0.3], [-0.6, -0.55], [-0.1, -0.64], [0.4, -0.6], [0.94, -0.3], [0.7, -0.95], [-0.7, -0.95]]), c.hair, 5); el("path", { d: `M${U(-0.5, -0.78)} Q${U(-0.1, -0.88)} ${U(0.3, -0.82)}`, fill: "none", stroke: "#8A5A3A", "stroke-width": 4 }, headG); }
     if (c.hairStyle === "swoop") P(poly([[-0.96, -0.36], [-0.86, -0.08], [-0.62, -0.34], [-0.4, -0.16], [-0.2, -0.38], [0.1, -0.2], [0.45, -0.42], [0.75, -0.26], [0.98, -0.02], [0.96, -0.42], [0.7, -0.92], [-0.7, -0.9]]), c.hair, 5);
      if (c.hairStyle === "shag") P(poly([[-1.0, -0.36], [-0.96, 0.2], [-0.8, -0.1], [-0.6, 0.0], [-0.44, -0.28], [-0.2, -0.02], [0.0, -0.3], [0.2, 0.12], [0.34, -0.1], [0.5, 0.28], [0.62, 0.0], [0.82, 0.34], [1.0, -0.36], [0.7, -0.92], [-0.7, -0.92]]), c.hair, 5);
      if (c.hairStyle === "bob") P(poly([[-1.04, -0.3], [-0.9, -0.16], [-0.5, -0.34], [-0.1, -0.22], [0.3, -0.36], [0.7, -0.2], [1.04, -0.3], [0.7, -0.95], [-0.7, -0.95]]), c.hair, 5);
      if (c.hairStyle === "puff") P(poly([[-0.92, -0.3], [-0.7, -0.44], [-0.4, -0.36], [-0.1, -0.5], [0.2, -0.38], [0.5, -0.48], [0.8, -0.34], [0.92, -0.3], [0.7, -0.9], [-0.7, -0.9]]), c.hair, 5);
      if (c.hairStyle === "nami") P(poly([[-1.04, -0.3], [-0.96, 0.3], [-0.8, -0.1], [-0.52, -0.3], [-0.2, -0.16], [0.16, -0.36], [0.5, -0.2], [0.8, -0.34], [0.96, 0.3], [1.04, -0.3], [0.7, -0.95], [-0.7, -0.95]]), c.hair, 5);
      if (c.hairStyle === "zoro") P(poly([[-0.92, -0.4], [-0.7, -0.52], [-0.5, -0.4], [-0.3, -0.56], [-0.1, -0.44], [0.1, -0.58], [0.3, -0.44], [0.5, -0.56], [0.7, -0.42], [0.92, -0.4], [0.7, -0.92], [-0.7, -0.92]]), c.hair, 5);
      if (c.hairStyle === "usopp" && !c.noBandana) { P(`M${U(-0.96, -0.3)} C${U(-0.98, -1.1)} ${U(0.98, -1.1)} ${U(0.96, -0.3)} Q${U(0, -0.52)} ${U(-0.96, -0.3)} Z`, "#7A7A3A", 5); el("path", { d: `M${U(-0.6, -0.7)} q8,-8 16,0 M${U(0.1, -0.86)} q8,-8 16,0 M${U(0.5, -0.62)} q8,-8 16,0`, fill: "none", stroke: "#5A5A26", "stroke-width": 3 }, headG);
        el("path", { d: `M${U(-0.98, -0.42)} Q${U(0, -0.66)} ${U(0.98, -0.42)}`, fill: "none", stroke: "#3A3A44", "stroke-width": 8 }, headG); [-1, 1].forEach((dd) => el("ellipse", { cx: dd * 0.3 * r, cy: -228 - 0.56 * r, rx: 0.2 * r, ry: 0.14 * r, fill: "#BFE0F0", stroke: INK, "stroke-width": 4 }, headG)); }
      if (c.hairStyle === "usopp" && c.noBandana) P(poly([[-0.94, -0.36], [-0.5, -0.56], [0, -0.62], [0.5, -0.56], [0.94, -0.36], [0.7, -0.92], [-0.7, -0.92]]), c.hair, 5);
      if (c.hairStyle === "sanji") { P(`M${U(-0.96, -0.3)} Q${U(-0.7, -0.5)} ${U(-0.2, -0.56)} Q${U(-0.4, -0.3)} ${U(-0.1, -0.5)} L${U(0.12, 0.5)} Q${U(0.6, 0.62)} ${U(1.0, 0.32)} L${U(0.98, -0.3)} L${U(0.7, -0.94)} L${U(-0.7, -0.94)} Z`, c.hair, 5); }
      if (c.hairStyle === "robin") { P(poly([[-1.04, -0.3], [-1.0, 0.72], [-0.82, 0.72], [-0.8, -0.12], [0.8, -0.12], [0.82, 0.72], [1.0, 0.72], [1.04, -0.3], [0.7, -0.96], [-0.7, -0.96]]), c.hair, 5); el("path", { d: `M${U(0, -0.96)} V${(-228 - 0.14 * r).toFixed(1)}`, stroke: "#3A3848", "stroke-width": 3 }, headG); }
      if (c.cigarette) { el("path", { d: `M${U(-0.08, 0.68)} L${U(-0.42, 0.78)}`, stroke: INK, "stroke-width": 9, "stroke-linecap": "round" }, headG); el("path", { d: `M${U(-0.08, 0.68)} L${U(-0.42, 0.78)}`, stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round" }, headG); el("path", { d: `M${U(-0.46, 0.72)} q-10,-16 2,-28 q10,-12 -2,-26`, fill: "none", stroke: "#B8B0A2", "stroke-width": 3, "stroke-linecap": "round" }, headG); }
      if (c.hairStyle === "luffy") P(poly([[-0.95, -0.4], [-0.82, -0.12], [-0.62, -0.34], [-0.44, -0.16], [-0.22, -0.36], [0.0, -0.18], [0.2, -0.38], [0.4, -0.14], [0.62, -0.36], [0.84, -0.1], [0.95, -0.4], [0.7, -0.9], [-0.7, -0.9]]), c.hair, 5);
      if (c.hairStyle === "naruto") P(poly([[-0.95, -0.42], [-0.78, -0.1], [-0.6, -0.4], [-0.38, -0.08], [-0.18, -0.4], [0.05, -0.12], [0.22, -0.42], [0.44, -0.1], [0.62, -0.42], [0.8, -0.12], [0.95, -0.42], [0.7, -0.85], [-0.7, -0.85]]), c.hair, 5);
      if (c.hairStyle === "topknot") P(poly([[-0.92, -0.4], [-0.5, -0.58], [0, -0.64], [0.5, -0.58], [0.92, -0.4], [0.7, -0.9], [-0.7, -0.9]]), c.hair, 5);
      if (c.hairStyle === "gaara") P(poly([[-0.98, -0.2], [-0.8, -0.12], [-0.66, -0.4], [-0.44, -0.24], [-0.26, -0.5], [-0.06, -0.4], [0.1, -0.64], [0.4, -0.7], [0.7, -0.62], [0.98, -0.2], [0.7, -0.94], [-0.7, -0.94]]), c.hair, 5);
      if (c.hairStyle === "hakubun") { P(poly([[-0.94, -0.34], [-0.5, -0.56], [-0.04, -0.7], [0, -0.98], [0.04, -0.7], [0.5, -0.56], [0.94, -0.34], [0.7, -0.94], [-0.7, -0.94]]), c.hair, 5);
        [-1, 1].forEach((dd) => { P(`M${U(dd * 0.78, -0.5)} Q${U(dd * 1.06, 0.1)} ${U(dd * 0.98, 1.05)} L${U(dd * 0.8, 1.05)} Q${U(dd * 0.84, 0.1)} ${U(dd * 0.62, -0.42)} Z`, c.hair, 5); el("rect", { x: dd * 0.89 * r - 0.13 * r, y: -228 + 0.92 * r, width: 0.26 * r, height: 0.2 * r, rx: 3, fill: "#C9CED6", stroke: INK, "stroke-width": 3 }, headG); }); }
      if (c.kanji) { const kt = el("text", { x: 0.36 * r, y: -228 - 0.3 * r, "text-anchor": "middle", "font-family": "WenQuanYi Zen Hei, sans-serif", "font-size": 0.34 * r, "font-weight": 700, fill: "#B8322A" }, headG); kt.textContent = "愛"; }
      const accs = {};
      for (const an of (c.accs || [])) { const ag = G(headG, { style: "display:none" }); accs[an] = ag; const col = an === "band" ? "#2C3E73" : "#3F6B5A";
        if (an === "sogemask") { for (let k = 0; k < 10; k++) { const a2 = (k / 10) * Math.PI * 2 - Math.PI / 2, a3 = a2 + 0.2, a4 = a2 - 0.2; P(`M${U(Math.cos(a3) * 0.9, 0.0 + Math.sin(a3) * 0.9)} L${U(Math.cos(a2) * 1.45, 0.0 + Math.sin(a2) * 1.45)} L${U(Math.cos(a4) * 0.9, 0.0 + Math.sin(a4) * 0.9)} Z`, "#E8B830", 4, ag); }
          el("circle", { cx: 0, cy: -228, r: 0.92 * r, fill: "#F2C230", stroke: INK, "stroke-width": 5 }, ag); el("path", { d: `M${U(-0.86, -0.16)} H${(0.86 * r).toFixed(1)} V${(-228 + 0.2 * r).toFixed(1)} H${(-0.86 * r).toFixed(1)} Z`, fill: "#2F6FD0", stroke: INK, "stroke-width": 4 }, ag);
          [-1, 1].forEach((dd) => el("ellipse", { cx: dd * 0.36 * r, cy: -228 + 0.02 * r, rx: 0.16 * r, ry: 0.1 * r, fill: "#0E0E12" }, ag)); el("path", { d: `M${U(0.0, 0.24)} L${U(0.36, 0.6)}`, stroke: INK, "stroke-width": 0.24 * r, "stroke-linecap": "round" }, ag); el("path", { d: `M${U(0.0, 0.24)} L${U(0.36, 0.6)}`, stroke: "#F4F0E6", "stroke-width": 0.16 * r, "stroke-linecap": "round" }, ag);
          [0.25, 0.5, 0.75].forEach((f2) => el("path", { d: `M${U(0.36 * f2 - 0.06, 0.24 + 0.36 * f2 + 0.06)} L${U(0.36 * f2 + 0.06, 0.24 + 0.36 * f2 - 0.06)}`, stroke: "#C62F2A", "stroke-width": 5 }, ag)); el("path", { d: `M${U(-0.3, 0.62)} Q${U(-0.1, 0.74)} ${U(0.1, 0.66)}`, fill: "none", stroke: INK, "stroke-width": 4 }, ag); continue; }
        if (an === "strawhat") { P(`M${U(-1.6, -0.62)} Q${U(0, -0.98)} ${U(1.6, -0.62)} Q${U(0, -0.22)} ${U(-1.6, -0.62)} Z`, "#E9C46A", 5, ag); P(`M${U(-0.78, -0.62)} Q${U(-0.82, -1.5)} ${U(0, -1.52)} Q${U(0.82, -1.5)} ${U(0.78, -0.62)} Z`, "#E9C46A", 5, ag);
          P(`M${U(-0.8, -0.92)} Q${U(0, -1.02)} ${U(0.8, -0.92)} L${U(0.79, -0.66)} Q${U(0, -0.76)} ${U(-0.79, -0.66)} Z`, "#C62F2A", 4, ag); el("path", { d: `M${U(-1.2, -0.56)} Q${U(-0.9, -0.5)} ${U(-0.6, -0.48)} M${U(0.6, -0.48)} Q${U(0.9, -0.5)} ${U(1.2, -0.56)} M${U(-0.4, -1.2)} q${0.4 * r},${-0.12 * r} ${0.8 * r},0`, fill: "none", stroke: "#B8913E", "stroke-width": 3 }, ag); continue; }
        if (an === "mask") { P(`M${U(-0.84, -0.3)} C${U(-0.88, -0.86)} ${U(0.88, -0.86)} ${U(0.84, -0.3)} C${U(0.84, 0.4)} ${U(0.46, 0.76)} ${U(0, 0.9)} C${U(-0.46, 0.76)} ${U(-0.84, 0.4)} ${U(-0.84, -0.3)} Z`, "#F6F2EA", 5, ag);
          [-1, 1].forEach((dd) => P(`M${U(dd * 0.2, 0.1)} Q${U(dd * 0.4, -0.02)} ${U(dd * 0.6, 0.12)} Q${U(dd * 0.4, 0.2)} ${U(dd * 0.2, 0.1)} Z`, "#1E1A1E", 2, ag));
          el("path", { d: `M${U(-0.3, 0.56)} q${0.1 * r},${-0.12 * r} ${0.2 * r},0 t${0.2 * r},0 t${0.2 * r},0 M${U(-0.2, 0.72)} q${0.1 * r},${-0.1 * r} ${0.2 * r},0 t${0.2 * r},0`, fill: "none", stroke: "#C62F2A", "stroke-width": 6, "stroke-linecap": "round" }, ag);
          for (let k = 0; k < 4; k++) el("path", { d: `M${U(-0.15 + k * 0.1, -0.62)} q${0.05 * r},${0.07 * r} 0,${0.14 * r} q${-0.05 * r},${0.07 * r} 0,${0.14 * r}`, fill: "none", stroke: "#3A3A44", "stroke-width": 3.5, "stroke-linecap": "round" }, ag); continue; }
        if (an === "band") P(`M${U(0.95, -0.56)} q${0.26 * r},${0.1 * r} ${0.42 * r},${0.46 * r} M${U(0.95, -0.48)} q${0.18 * r},${0.14 * r} ${0.3 * r},${0.52 * r}`, "none", 9, ag).setAttribute("stroke", col);
        P(`M${U(-0.98, -0.62)} Q${U(0, -0.86)} ${U(0.98, -0.62)} L${U(0.96, -0.4)} Q${U(0, -0.64)} ${U(-0.96, -0.4)} Z`, col, 4, ag);
        if (an === "band") { P(`M${U(-0.34, -0.8)} L${U(0.34, -0.8)} L${U(0.32, -0.46)} L${U(-0.32, -0.46)} Z`, "#C9CED6", 4, ag); const sp = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2.6, rr = 0.012 + i / 24 * 0.1; sp.push(U(Math.cos(a) * rr * 1.3, -0.63 + Math.sin(a) * rr)); }
          el("path", { d: `M${sp.join(" L")} L${U(-0.2, -0.5)} M${U(-0.11, -0.53)} L${U(-0.2, -0.5)} L${U(-0.15, -0.6)}`, fill: "none", stroke: "#4A4F5A", "stroke-width": 3.5, "stroke-linecap": "round" }, ag); }
        else [-1, 1].forEach((dd) => { el("rect", { x: dd * 0.3 * r - 0.22 * r, y: -228 - 0.8 * r, width: 0.44 * r, height: 0.34 * r, rx: 9, fill: "#BFE0F0", stroke: INK, "stroke-width": 4 }, ag); el("rect", { x: dd * 0.3 * r - 0.22 * r, y: -228 - 0.8 * r, width: 0.44 * r, height: 0.34 * r, rx: 9, fill: "none", stroke: "#8FB89A", "stroke-width": 9, "stroke-opacity": 0.9 }, ag); el("rect", { x: dd * 0.3 * r - 0.25 * r, y: -228 - 0.83 * r, width: 0.5 * r, height: 0.4 * r, rx: 11, fill: "none", stroke: INK, "stroke-width": 3 }, ag); }); }
      if (accs.mask) headG.insertBefore(accs.mask, headG.childNodes[fh0]);
      if (c.clips) [[-0.62, -0.42], [-0.44, -0.5]].forEach(([u, v]) => el("rect", { x: u * r - 14, y: -228 + v * r - 4, width: 28, height: 8, rx: 3, fill: "#F2C230", stroke: INK, "stroke-width": 3, transform: `rotate(-20 ${u * r} ${-228 + v * r})` }, headG));
      const glassG = G(headG);
      if (c.glasses) { [-1, 1].forEach((d) => el("circle", { cx: d * 0.38 * r, cy: -228 + 0.14 * r, r: 0.27 * r, fill: "#FFFFFF", "fill-opacity": 0.12, stroke: "#3A2A22", "stroke-width": 6 }, glassG)); el("path", { d: `M${U(-0.11, 0.1)} Q${U(0, 0.04)} ${U(0.11, 0.1)}`, fill: "none", stroke: "#3A2A22", "stroke-width": 6 }, glassG); }
      // ---------- animation state ----------
      const keys = [{ t: -1, p: Object.assign({}, POSES.stand), dur: 0 }], moves = [{ t: -1, x, dur: 0 }], faces = [[-1, "neutral"]], talks = [], views = [[-1, "front", 1]], accKeys = [[-1, c.acc || "none"]]; let curView = "";
      const h = { root, name, at, x, y, s,
        key(t, pose, dur = 0.35) { keys.push({ t, p: typeof pose === "string" ? POSES[pose] : pose, dur }); return h; },
        move(t, nx, dur = 1) { moves.push({ t, x: nx, dur }); return h; },
        face(t, e) { faces.push([t, e]); return h; },
        view(t, v, dir = 1) { views.push([t, v, dir]); return h; },
        acc(t, a) { accKeys.push([t, a]); return h; },
        cry(t0, t1 = 1e9) { cries.push([t0, t1]); return h; },
        say(id) { const st = window.DT[id][0]; window.WORDS[id].forEach((w) => talks.push([st + w.start, st + w.end])); return h; } };
      const poseAt = (t) => { let cur = Object.assign({}, POSES.stand); for (const k of keys) { if (t < k.t) break; const u = k.dur ? ease(clamp((t - k.t) / k.dur, 0, 1)) : 1, next = Object.assign({}, cur, k.p); for (const j of JOINTS) cur[j] = (cur[j] ?? 0) + ((next[j] ?? 0) - (cur[j] ?? 0)) * u; } return cur; };
      const xAt = (t) => { let px = moves[0].x, walking = 0; for (const m of moves) { if (t < m.t) break; const u = clamp((t - m.t) / m.dur, 0, 1); if (u < 1) walking = 1; px = px + (m.x - px) * u; } return [px, walking]; };
      const rot = (g, px, py, a) => g.setAttribute("transform", `translate(${px},${py}) rotate(${a.toFixed(2)})`);
      h.update = (t) => {
        if (cries.length) { const on = cries.some(([a, b]) => t >= a && t < b); tearG.style.display = on ? "inline" : "none"; if (on) tearG.setAttribute("transform", `translate(0,${(((t * 0.9) % 1) * 10).toFixed(1)})`); }
        const vis = t >= at; root.setAttribute("opacity", vis ? 1 : 0); if (!vis) return; const pop = clamp((t - at) / 0.35, 0, 1), sc = s * (0.6 + 0.4 * (1 + 1.7 * Math.pow(pop - 1, 3) + 0.7 * Math.pow(pop - 1, 2)));
        let vw = views[0]; for (const q of views) if (t >= q[0]) vw = q; const side = vw[1] === "side", dir = vw[2];
        if (curView !== vw[1] + dir) { curView = vw[1] + dir; tFront.style.display = side ? "none" : "inline"; tSide.style.display = side ? "inline" : "none"; det.setAttribute("transform", side ? "translate(2,0) scale(0.62,1)" : "");
          earR.style.display = side ? "none" : "inline"; const ft = side ? `translate(${0.3 * r},0) translate(0,-228) scale(0.86,1) translate(0,228)` : ""; faceG.setAttribute("transform", ft); glassG.setAttribute("transform", ft);
          body.setAttribute("transform", dir < 0 ? "scale(-1,1)" : ""); legs.forEach((lg) => { lg.th.px = side ? lg.d * 6 : lg.d * 24; lg.shoe.setAttribute("cx", side ? 16 : lg.d * 6); });
          arms.forEach((a) => { a.ua.px = side ? 0 : a.d * 50; }); const far = arms[1].ua.g; if (side) torso.insertBefore(far, torso.firstChild); else torso.insertBefore(far, headG); }
        let ak = accKeys[0][1]; for (const q of accKeys) if (t >= q[0]) ak = q[1]; for (const an in accs) accs[an].style.display = an === ak ? "inline" : "none";
        const p = poseAt(t), [px, walking] = xAt(t), wk = walking ? Math.sin(t * 11) : 0, breath = Math.sin(t * 2.4 + x) * 1.5;
        const lift = p.lift + (walking ? -Math.abs(Math.cos(t * 11)) * 6 : 0);
        root.setAttribute("transform", `translate(${px.toFixed(1)},${(y - 170 * s).toFixed(1)}) scale(${sc.toFixed(3)}) rotate(${p.root.toFixed(2)},0,170) translate(${(p.side || 0).toFixed(1)},${lift.toFixed(1)})`);
        rot(torso, 0, 0, p.torso + (walking ? wk * 2 : 0)); torso.firstChild && torso.setAttribute("transform", `rotate(${(p.torso + (walking ? wk * 2 : 0)).toFixed(2)}) translate(0,${breath.toFixed(2)})`);
        legs.forEach(({ th, sh, d }, i) => { const sw = walking ? (i ? -wk : wk) * 24 : 0; rot(th.g, th.px, th.py, (i ? p.lR : p.lL) + sw); rot(sh.g, 0, 80, (i ? p.kR : p.kL) + (walking ? Math.max(0, (i ? wk : -wk)) * 30 : 0)); });
        // arms; "plant" = hands reach the floor (two-bone IK in torso space)
        const th = (p.root + p.torso) * Math.PI / 180, pl = clamp(p.plant || 0, 0, 1);
        arms.forEach(({ ua, fa, d }, i) => { let a = i ? p.aR : p.aL, e = i ? p.eR : p.eL; if (walking && !pl && Math.abs(a) < 40) a += (i ? wk : -wk) * 18;
          let spx = ua.px;
          if (pl > 0.01) { // hands planted: fixed palm on the floor under the up-position shoulder; elbows fold back toward the feet
            const th0 = (p.root + p.torso) * Math.PI / 180, tA = th0 * 180 / Math.PI, ly = -128 + lift - 170, sxo = (p.side || 0) + (i ? 6 : -6);
            const Xs = sxo * Math.cos(th0) - ly * Math.sin(th0), Ys = sxo * Math.sin(th0) + ly * Math.cos(th0) + 170;
            const pu = POSES.pushUp, thU = pu.root * Math.PI / 180, Hx = -(-128 + pu.lift - 170) * Math.sin(thU) - 18, Hy = 154;
            const L1 = 72, L2 = 74, dx = Hx - Xs, dy = Hy - Ys, R = clamp(Math.hypot(dx, dy), 20, L1 + L2 - 0.5), phi = Math.atan2(dy, dx);
            const al = Math.acos(clamp((L1 * L1 + R * R - L2 * L2) / (2 * L1 * R), -1, 1));
            let best = null; for (const sg of [1, -1]) { const ex = Xs + L1 * Math.cos(phi + sg * al), ey = Ys + L1 * Math.sin(phi + sg * al); if (!best || ex < best[0]) best = [ex, ey]; }
            const A1 = Math.atan2(best[1] - Ys, best[0] - Xs) * 180 / Math.PI - 90, A2 = Math.atan2(Hy - best[1], Hx - best[0]) * 180 / Math.PI - 90;
            const ia = A1 - tA, ie = A2 - A1; a = a + (ia - a) * pl; e = e + (ie - e) * pl; spx = ua.px * (1 - pl) + (i ? 6 : -6) * pl; }
          rot(ua.g, spx, ua.py, a + (i ? -breath * 0.6 : breath * 0.6)); rot(fa.g, 0, 72, e); });
        rot(headG, 0, 0, p.head + (talks.some(([a, b]) => t >= a && t < b) ? Math.sin(t * 9) * 2 : 0)); headG.setAttribute("transform", `rotate(${(p.head).toFixed(2)},0,-140)`);
        // face
        let e = faces[0][1]; for (const [tt, ee] of faces) if (t >= tt) e = ee;
        const speaking = talks.find(([a, b]) => t >= a && t < b); for (const m in mouths) mouths[m].style.display = !speaking && m === e ? "inline" : "none";
        if (speaking) { const o = 0.35 + 0.65 * Math.abs(Math.sin((t - speaking[0]) * 17)); talk.setAttribute("d", `M${U(-0.18, 0.6)} Q${U(0, 0.56)} ${U(0.18, 0.6)} Q${U(0.16, 0.6 + 0.3 * o)} ${U(0, 0.62 + 0.3 * o)} Q${U(-0.16, 0.6 + 0.3 * o)} ${U(-0.18, 0.6)} Z`); talk.style.display = "inline"; } else talk.style.display = "none";
        const happy = e === "grin" || e === "smile" && false, tired = e === "tired" || (c.tired && e !== "wow" && e !== "grin");
        const blink = (t * 1000 + x * 13) % 3900 < 120;
        eyesOpen.style.display = happy || blink ? "none" : "inline"; eyesHappy.style.display = happy || blink ? "inline" : "none"; lids.style.display = tired && !happy && !blink ? "inline" : "none";
        const bt = { sad: [10, 6], strain: [-12, 8], determined: [-14, 4], wow: [6, -10], tired: [4, 2], grin: [0, -6], smile: [0, -4], talk: [0, 0], neutral: [0, 0] }[e] || [0, 0];
        brows.forEach((b, i) => b.setAttribute("transform", `translate(0,${bt[1]}) rotate(${(i ? -1 : 1) * bt[0]} ${(i ? 1 : -1) * 0.38 * r} ${-228 - 0.33 * r})`));
      };
      return h;
    }
    return { make, POSES, designs: D };
  };
})();
