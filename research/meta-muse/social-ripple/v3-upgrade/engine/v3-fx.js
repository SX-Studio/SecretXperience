/* Social Ripple v3 finishing kit: rim light, depth-of-field, motion blur, colour grade, light glows, animated grain,
   and a shot list (instant cuts between camera set-ups, with per-shot focus). Pure functions of t (seek-safe). */
(function () {
  const SR = window.SR; const { el, clamp, EASE, sampleTrack } = SR;
  let UID = 1;
  const defsOf = (svg) => svg.querySelector("defs") || el("defs", {}, svg);
  const V3 = {};
  // warm rim light: a thin offset halo hugging the silhouette + a soft outer bloom
  V3.rim = function (svg, color = "#FFD08A", width = 4, dx = -3, dy = -2, bloom = 0.35) {
    const id = "rim" + UID++, f = el("filter", { id, x: "-20%", y: "-20%", width: "140%", height: "140%" }, defsOf(svg));
    el("feMorphology", { in: "SourceAlpha", operator: "dilate", radius: width, result: "d" }, f);
    el("feOffset", { in: "d", dx, dy, result: "o" }, f);
    el("feFlood", { "flood-color": color, result: "c" }, f);
    el("feComposite", { in: "c", in2: "o", operator: "in", result: "co" }, f);
    el("feComposite", { in: "co", in2: "SourceAlpha", operator: "out", result: "rim" }, f);
    el("feGaussianBlur", { in: "rim", stdDeviation: 1.2, result: "rb" }, f);
    el("feMorphology", { in: "SourceAlpha", operator: "dilate", radius: width * 3, result: "d2" }, f);
    el("feGaussianBlur", { in: "d2", stdDeviation: width * 4, result: "gb" }, f);
    el("feComposite", { in: "c", in2: "gb", operator: "in", result: "glow" }, f);
    el("feComponentTransfer", { in: "glow", result: "glow2" }, f).appendChild((() => { const n = document.createElementNS("http://www.w3.org/2000/svg", "feFuncA"); n.setAttribute("type", "linear"); n.setAttribute("slope", bloom); return n; })());
    const m = el("feMerge", {}, f); ["glow2", "SourceGraphic", "rb"].forEach((r) => el("feMergeNode", { in: r }, m));
    return `url(#${id})`;
  };
  // blur with a live-adjustable deviation (for depth of field and whip-pan motion blur)
  V3.blur = function (svg) {
    const id = "bl" + UID++, f = el("filter", { id, x: "-10%", y: "-10%", width: "120%", height: "120%" }, defsOf(svg));
    const g = el("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "0 0" }, f);
    return { url: `url(#${id})`, set(sx, sy = sx) { g.setAttribute("stdDeviation", `${Math.max(0, sx).toFixed(2)} ${Math.max(0, sy).toFixed(2)}`); } };
  };
  // colour grade: light from one corner (soft-light), cool shadows (multiply), plus vignette
  V3.grade = function (svg, g, o = {}) {
    const d = defsOf(svg), W = 1920, H = 1080;
    const a = "gr" + UID++, lg = el("linearGradient", { id: a, x1: o.x1 ?? 0, y1: o.y1 ?? 0, x2: o.x2 ?? 1, y2: o.y2 ?? 1 }, d);
    el("stop", { offset: 0, "stop-color": o.light || "#FFB46B", "stop-opacity": o.lightK ?? 0.55 }, lg); el("stop", { offset: 0.6, "stop-color": o.light || "#FFB46B", "stop-opacity": 0 }, lg);
    el("rect", { x: 0, y: 0, width: W, height: H, fill: `url(#${a})`, style: "mix-blend-mode: soft-light" }, g);
    const b = "gs" + UID++, lg2 = el("linearGradient", { id: b, x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    el("stop", { offset: 0.55, "stop-color": o.shadow || "#3A2A5A", "stop-opacity": 0 }, lg2); el("stop", { offset: 1, "stop-color": o.shadow || "#3A2A5A", "stop-opacity": o.shadowK ?? 0.35 }, lg2);
    el("rect", { x: 0, y: 0, width: W, height: H, fill: `url(#${b})`, style: "mix-blend-mode: multiply" }, g);
    const v = "vg" + UID++, rg = el("radialGradient", { id: v, cx: "50%", cy: "50%", r: "72%" }, d);
    el("stop", { offset: 0.55, "stop-color": "#140F18", "stop-opacity": 0 }, rg); el("stop", { offset: 1, "stop-color": "#140F18", "stop-opacity": o.vignette ?? 0.45 }, rg);
    el("rect", { x: 0, y: 0, width: W, height: H, fill: `url(#${v})` }, g);
  };
  // soft additive light pool (lamps, windows, the sun)
  V3.glow = function (svg, g, x, y, r, color = "#FFE2A8", k = 0.6) {
    const id = "lg" + UID++, rg = el("radialGradient", { id }, defsOf(svg));
    el("stop", { offset: 0, "stop-color": color, "stop-opacity": k }, rg); el("stop", { offset: 1, "stop-color": color, "stop-opacity": 0 }, rg);
    return el("circle", { cx: x, cy: y, r, fill: `url(#${id})`, style: "mix-blend-mode: screen" }, g);
  };
  // film grain that changes every frame (a static grain reads as dirt on the lens)
  V3.grain = function (svg, g, amount = 0.07) {
    const id = "gn" + UID++, f = el("filter", { id, x: 0, y: 0, width: "100%", height: "100%" }, defsOf(svg));
    const tu = el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.85", numOctaves: 2, seed: 1 }, f);
    el("feColorMatrix", { type: "matrix", values: `0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 ${amount * 4} -${amount * 1.6}` }, f);
    el("rect", { x: 0, y: 0, width: 1920, height: 1080, filter: `url(#${id})`, style: "mix-blend-mode: overlay" }, g);
    return { update(t) { tu.setAttribute("seed", 1 + Math.floor(t * 24) % 97); } };
  };
  // shot list: [{ t, cam: {x,y,z,r}, to: {x,y,z,r} (end of shot, eased), ease, focus: {bg, mid, fg} blur amounts }]
  V3.Shots = function (shots, D) {
    return { at(t) { let i = 0; for (let k = 0; k < shots.length; k++) if (t >= shots[k].t) i = k; const s = shots[i], t1 = i + 1 < shots.length ? shots[i + 1].t : D, k = clamp((t - s.t) / Math.max(0.01, t1 - s.t), 0, 1), e = (EASE[s.ease || "inOut"] || EASE.inOut)(k), to = s.to || s.cam;
      const c = {}; for (const key of ["x", "y", "z", "r"]) c[key] = (s.cam[key] ?? 0) + ((to[key] ?? s.cam[key] ?? 0) - (s.cam[key] ?? 0)) * e; return { i, s, k, c, tin: t - s.t }; } };
  };
  V3.apply = function (world, c, shake = 0, t = 0, W = 1920, H = 1080) {
    const sx = shake * (Math.sin(t * 23.1) + Math.sin(t * 37.7) * 0.5), sy = shake * (Math.cos(t * 19.3) + Math.sin(t * 41.9) * 0.5);
    world.setAttribute("transform", `translate(${W / 2 + sx},${H / 2 + sy}) rotate(${c.r || 0}) scale(${c.z}) translate(${-c.x},${-c.y})`);
  };
  window.V3 = V3;
})();
