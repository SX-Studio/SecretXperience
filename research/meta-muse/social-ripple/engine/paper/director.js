/* Director: shot list -> per-actor tracks (cheat positions per shot, like 2D layout), camera with parallax, set switching,
   weather, captions, energy log, and QA (joints + face safe zone + caption collisions). Staging presets from STAGING-RESEARCH.md. */
(function () {
  const SR = window.SR, { el, clamp, lerp } = SR, K = window.PK, SETS = window.SETS;
  const DIR = (window.DIR = {});
  const EYE = 390, HEADD = 184;                // paper rig at scale 1: eye height above feet, head diameter (px)
  DIR.make = function (svg, D) {
    const layers = { sky: el("g", {}, svg), mid: el("g", {}, svg) }, world = el("g", {}, svg);
    layers.back = el("g", {}, world); const chars = el("g", {}, world), wxL = el("g", {}, world); layers.frontWrap = el("g", {}, svg);
    const sets = {}, actors = {}, shots = [], extrasPool = [];
    const api = { svg, world, chars, wxL, sets, actors, shots, D, log: [] };
    api.set = (name, builder) => { const L = { sky: el("g", { display: "none" }, layers.sky), mid: el("g", { display: "none" }, layers.mid), back: el("g", { display: "none" }, layers.back), front: el("g", { display: "none" }, layers.frontWrap) };
      sets[name] = Object.assign({ L }, builder(L)); return sets[name]; };
    api.actor = (name, look, o = {}) => { const a = { name, spec: look, keys: { x: [], y: [], s: [], f: [], walk: [] }, mood: [[0, o.mood || "neutral", 0]], pose: [[0, "relaxed", 0]], look: [[0, { x: 0, y: 0 }]], hop: [], squash: [], lips: [], vis: [], wx: null, extra: !!o.extra }; actors[name] = a; return a; };
    // a shot: { t, set, cam:{x,y,z,x2,y2,z2,e}, cast:{name:{fx,fy,hd,f, fx2,fy2, walk, feet}}, k:{...set params}, tag }
    api.shot = (s) => { shots.push(s); return s; };
    const camAt = (c, t, t0, t1) => { const u = c.x2 == null ? 0 : clamp((t - t0) / Math.max(0.01, t1 - t0), 0, 1), k = c.e === "lin" ? u : c.e === "out" ? 1 - Math.pow(1 - u, 3) : u * u * (3 - 2 * u);
      return { x: lerp(c.x, c.x2 ?? c.x, k), y: lerp(c.y, c.y2 ?? c.y, k), z: lerp(c.z, c.z2 ?? c.z, k) }; };
    // frame placement -> world. fy = eye height as a fraction of frame; hd = head diameter as a fraction of frame height.
    // or absolute world placement: wx (x), wy (feet y), s (scale)
    const place = (cam, p) => { if (p.wx != null) return [p.wx, p.wy, p.s];
      const s = p.hd * 1080 / (HEADD * cam.z); const wx = cam.x + (p.fx - 0.5) * 1920 / cam.z; let wy;
      if (p.feet != null) wy = p.feet; else wy = cam.y + (p.fy - 0.5) * 1080 / cam.z + EYE * s; return [wx, wy, s]; };
    api.compile = () => {
      shots.sort((a, b) => a.t - b.t); shots.forEach((s, i) => { s.t1 = i + 1 < shots.length ? shots[i + 1].t : D; });
      for (const s of shots) for (const [name, p] of Object.entries(s.cast || {})) { const a = actors[name]; if (!a) continue;
        const c0 = camAt(s.cam, s.t, s.t, s.t1), [x, y, sc] = place(c0, p); let x2 = x, y2 = y;
        if (p.fx2 != null || p.fy2 != null) { const q = Object.assign({}, p, { fx: p.fx2 ?? p.fx, fy: p.fy2 ?? p.fy }); [x2, y2] = place(c0, q); }
        if (p.wx2 != null || p.wy2 != null) { x2 = p.wx2 ?? x; y2 = p.wy2 ?? y; }
        const eps = 0.0005; a.keys.x.push([s.t - eps, null], [s.t, x]); a.keys.y.push([s.t - eps, null], [s.t, y]); a.keys.s.push([s.t - eps, null], [s.t, sc]); a.keys.f.push([s.t, p.f ?? 1]); a.keys.walk.push([s.t, p.walk ? 1 : 0]);
        if (x2 !== x || y2 !== y) { a.keys.x.push([s.t + (p.d0 || 0), x], [s.t1 - eps - (p.d1 || 0), x2, p.e || "inOut"]); a.keys.y.push([s.t + (p.d0 || 0), y], [s.t1 - eps - (p.d1 || 0), y2, p.e || "inOut"]); }
        a.vis.push([s.t, s.t1]); }
      for (const a of Object.values(actors)) {
        const fill = (arr) => { let last = arr.find((k) => k[1] != null); last = last ? last[1] : 0; return arr.map((k) => { if (k[1] == null) return [k[0], last]; last = k[1]; return k; }); };
        const xs = fill(a.keys.x), ys = fill(a.keys.y), ss = fill(a.keys.s); if (!xs.length) { xs.push([0, -5000]); ys.push([0, 900]); ss.push([0, 1]); }
        a.c = SR.Paper(chars, Object.assign({}, a.spec, { scale: ss[0][1], x: xs, y: ys, scaleT: ss, facing: a.keys.f.length ? a.keys.f : [[0, 1]], walkOn: a.keys.walk.length ? a.keys.walk : [[0, 0]], mood: a.mood, pose: a.pose, look: a.look, hop: a.hop, squash: a.squash, lips: a.lips })); }
      // energy log: cuts, expression changes, pose changes, pops
      shots.forEach((s) => api.log.push([s.t, "cut"])); for (const a of Object.values(actors)) { a.mood.slice(1).forEach((m) => api.log.push([m[0], "expr"])); a.pose.slice(1).forEach((m) => api.log.push([m[0], "pose"])); a.hop.forEach((m) => api.log.push([m[0], "hop"])); }
    };
    // weather per actor: keys [[t, level]], pops [t...], k scale, dy
    // weather per actor: keys [[t, level]] (lv < 0 hides), pop time, k scale, dy; `from` lets one actor carry several weather
    // layers over the episode (e.g. an extra in SC01's crowd and again in SC03's town) -- the latest layer with from <= t is used
    api.weather = (name, lv, pop, k = 1.3, dy = 0, from = 0) => { const a = actors[name]; const w = a.wx ? a.wx.w : K.weather(wxL, Object.keys(actors).indexOf(name) + 3); w.g.setAttribute("display", "none");
      a.wx = a.wx || { w, layers: [] }; a.wx.layers.push({ lv, pop, k, dy, from }); a.wx.layers.sort((p, q) => p.from - q.from); api.log.push([pop, "pop"]); };
    api.curShot = (t) => { let i = 0; while (i + 1 < shots.length && t >= shots[i + 1].t) i++; return shots[i]; };
    api.toScreen = (cam, wx, wy) => [(wx - cam.x) * cam.z + 960, (wy - cam.y) * cam.z + 540];
    let active = null;
    api.draw = (t, extra = {}) => {
      const s = api.curShot(t), cam = camAt(s.cam, t, s.t, s.t1), sh = extra.shake || 0, jx = (Math.sin(t * 61) * 9 + Math.cos(t * 47) * 6) * sh, jy = Math.cos(t * 53) * 7 * sh;
      if (active !== s.set) { for (const [n, st] of Object.entries(sets)) ["sky", "mid", "back", "front"].forEach((k) => st.L[k].setAttribute("display", n === s.set ? "inline" : "none")); active = s.set; }
      const tf = (depth) => `translate(960,540) scale(${cam.z.toFixed(4)}) translate(${(-(960 + (cam.x - jx - 960) * depth)).toFixed(1)},${(-(540 + (cam.y - jy - 540) * depth)).toFixed(1)})`;
      layers.sky.setAttribute("transform", tf(0.25)); layers.mid.setAttribute("transform", tf(0.6)); world.setAttribute("transform", tf(1)); layers.frontWrap.setAttribute("transform", tf(1.15));
      const st = sets[s.set]; if (st && st.update) st.update(t, s.k ? (typeof s.k === "function" ? s.k(t) : s.k) : undefined);
      const issues = [];
      for (const a of Object.values(actors)) { const on = a.vis.some(([t0, t1]) => t >= t0 && t < t1); a.c.g.setAttribute("display", on ? "inline" : "none"); if (a.wx) a.wx.w.g.setAttribute("display", "none"); if (!on) continue;
        const J = a.c.update(t);
        const WX = a.wx ? a.wx.layers.filter((L) => L.from <= t).pop() : null;
        if (WX) { const pop = WX.pop == null ? 0 : clamp((t - WX.pop) / 0.4, 0, 1), lv = SR.sampleTrack(WX.lv, t, WX.lv[0][1]); if (lv >= 0 && pop > 0) {
          // size follows the head (never > ~1.8x on screen); sits fully ABOVE the hair; shrinks to fit headroom; only then moves beside the head, away from frame centre
          const HM = { bun: 0.8, afro: 0.4, curly: 0.3, spiky: 0.3, cap: 0.22 }, top = J.headY - J.headR * (1 + (HM[(a.spec || {}).hairStyle] || 0.1));
          let ws = Math.min(WX.k * Math.max(0.6, J.sc), 1.8 / cam.z), wx = J.headX; const roomW = (((top - cam.y) * cam.z + 540) - 8) / cam.z;   // world units of headroom
          if (roomW < 190 * ws) ws = Math.max(roomW / 190, 0);
          let wy = top - 120 * ws + WX.dy + Math.sin(t * 2.1) * 3;
          if (ws * cam.z < 0.55) { ws = Math.min(WX.k * Math.max(0.6, J.sc), 1.1 / cam.z); const hs = (J.headX - cam.x) * cam.z + 960; let side = hs > 960 ? 1 : -1; const off = J.headR + 100 * ws;
            if (hs + side * off * cam.z > 1920 - 120 * ws * cam.z || hs + side * off * cam.z < 120 * ws * cam.z) side = -side; wx = J.headX + side * off; wy = Math.max(J.headY - J.headR * 0.6, (8 - 540) / cam.z + cam.y + 70 * ws); }
          if (a.extra) for (const b of Object.values(actors)) if (!b.extra && b !== a && b.c.g.getAttribute("display") !== "none" && b.c.joints.y > J.y && Math.abs(b.c.joints.x - J.headX) < 90 * b.c.joints.sc && J.headY > b.c.joints.headY - b.c.joints.headR) ws = 0;
          a.wx.w.g.setAttribute("display", ws > 0 ? "inline" : "none"); a.wx.w.g.setAttribute("transform", `translate(${wx.toFixed(1)},${wy.toFixed(1)})`); a.wx.w.set(lv, t, ws, pop); } }
        // nobody sits on air: a stool under every seated hip
        if (!a.seat) { a.seat = el("g", { display: "none" }, layers.back); el("rect", { x: -62, y: 0, width: 124, height: 22, rx: 8, fill: "#9A6B45" }, a.seat); el("rect", { x: -50, y: 22, width: 14, height: 100, fill: "#7A4E32" }, a.seat); el("rect", { x: 36, y: 22, width: 14, height: 100, fill: "#7A4E32" }, a.seat); a.seatLeg = a.seat.querySelectorAll("rect"); }
        if (J.sitting) { const top = J.hipY + 18 * J.sc, legH = Math.max(10, (J.y - top) / J.sc - 22); a.seat.setAttribute("display", "inline"); a.seat.setAttribute("transform", `translate(${(J.x - 8 * J.facing * J.sc).toFixed(1)},${top.toFixed(1)}) scale(${J.sc.toFixed(3)})`); a.seatLeg[1].setAttribute("height", legH.toFixed(1)); a.seatLeg[2].setAttribute("height", legH.toFixed(1)); } else a.seat.setAttribute("display", "none");
        if (window.__QA && !a.extra) { a.c.check(null).forEach((m) => issues.push(`${a.name}: ${m}`));
          const [hx, hy] = api.toScreen(cam, J.headX, J.headY), hr = J.headR * cam.z;
          if (hx > -hr && hx < 1920 + hr && hy > -hr && hy < 1080 + hr) {   // head at least partly on screen
            if (hy - hr < -0.35 * hr * 2 && hr < 300) issues.push(`${a.name}: head top cut (${Math.round(hy - hr)})`);
            if (extra.capOn && hy > 900 && hy < 1080 && hr < 320) issues.push(`${a.name}: face under captions`);
            for (const b of Object.values(actors)) if (b !== a && !b.extra && b.c.g.getAttribute("display") !== "none" && b.c.joints.headX != null) { const [bx, by] = api.toScreen(cam, b.c.joints.headX, b.c.joints.headY), br = b.c.joints.headR * cam.z; if (Math.hypot(bx - hx, by - hy) < (hr + br) * 0.55 && a.name < b.name) issues.push(`${a.name}/${b.name}: faces overlap`); } } } }
      // depth: whoever stands lower on the ground is drawn in front
      const vis = Object.values(actors).filter((a) => a.c.g.getAttribute("display") !== "none").sort((p, q) => (p.c.joints.y - q.c.joints.y) || (p.extra - q.extra));
      const key = vis.map((a) => a.name).join(","); if (key !== api._order) { vis.forEach((a) => chars.appendChild(a.c.g)); api._order = key; }
      for (const a of Object.values(actors)) if (a.seat && a.c.g.getAttribute("display") === "none") a.seat.setAttribute("display", "none");
      if (window.__QA && issues.length) window.__QA.push(...issues.map((m) => `${t.toFixed(2)} ${m}`));
      return { cam, shot: s };
    };
    return api;
  };
})();
