/* Social Ripple 3D engine (sr3d): a three.js toon world with comic-ink edges and depth of field, plus the 2D SVG rig
   projected into it as depth-sorted, occlusion-clipped billboards. Everything is a pure function of time (seek-safe).
   Units: metres. A character is ~1.75 m tall (rig ~300 px at scale 1 → PXM = 171 rig px per metre).

   const W3 = SR3D.create({ canvas, ov, width, height });
   W3.scene / W3.cam / W3.TH / W3.toon(color, map) / W3.tex(w, h, draw) / W3.add(mesh, x, y, z, layer)
   W3.person({...}) / W3.card({...}) / W3.occ.push({...})  /  W3.frame(t, camState, opts)  */
(function () {
  const TH = window.THREE, SR = window.SR;
  const { el, clamp, sampleTrack, mulberry32 } = SR;
  const lerp = (a, b, k) => a + (b - a) * k, sstep = (k) => k * k * k * (k * (k * 6 - 15) + 10);

  function create(opt) {
    const FW = opt.width || 1920, FH = opt.height || 1080, PXM = 171, INK = "#1E1B22";
    const W3 = { TH, FW, FH, PXM, lerp, sstep };
    // ---------------- renderer + passes ----------------
    const renderer = new TH.WebGLRenderer({ canvas: opt.canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(1); renderer.setSize(FW, FH, false);
    const NDS = opt.ndScale || 1, TAPS = opt.dofTaps || 24; const rtC = new TH.WebGLRenderTarget(FW, FH, { type: TH.HalfFloatType, samples: opt.samples ?? 4 });
    const rtN = new TH.WebGLRenderTarget(Math.round(FW * NDS), Math.round(FH * NDS), { type: TH.HalfFloatType, minFilter: TH.NearestFilter, magFilter: TH.NearestFilter });
    const scene = new TH.Scene(); const fog = new TH.Fog(0x1b2246, 30, 160); scene.fog = fog;
    const cam = new TH.PerspectiveCamera(40, FW / FH, 0.05, 1500);
    const ndMat = new TH.ShaderMaterial({ blending: TH.NoBlending,
      vertexShader: `varying vec3 vN; varying float vD; void main(){ vec4 p = vec4(position,1.0); vec3 n = normal;
        #ifdef USE_INSTANCING
          p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
        #endif
        vec4 mv = modelViewMatrix * p; vN = normalize(normalMatrix * n); vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vN; varying float vD; void main(){ gl_FragColor = vec4(normalize(vN)*0.5+0.5, vD/1000.0); }` });
    const comp = new TH.ShaderMaterial({
      defines: { TAPS: TAPS + ".0", TAPSI: TAPS }, uniforms: { tC: { value: rtC.texture }, tN: { value: rtN.texture }, res: { value: new TH.Vector2(FW, FH) }, resN: { value: new TH.Vector2(Math.round(FW * NDS), Math.round(FH * NDS)) }, focus: { value: 10 }, dofR: { value: 0 }, inkK: { value: 0.9 }, inkNear: { value: 40 }, inkFar: { value: 160 }, inkCol: { value: new TH.Color("#1E1830") },
        sat: { value: 1.12 }, lift: { value: new TH.Color("#120C22") } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `uniform sampler2D tC; uniform sampler2D tN; uniform vec2 res; uniform vec2 resN; uniform float focus, dofR, inkK, inkNear, inkFar, sat; uniform vec3 inkCol, lift; varying vec2 vUv;
        float dep(vec2 uv){ return max(texture2D(tN, uv).a * 1000.0, 0.01); }
        vec3 nor(vec2 uv){ return texture2D(tN, uv).rgb * 2.0 - 1.0; }
        float cocAt(float d){ return clamp(abs(d - focus) / max(focus, 0.5), 0.0, 1.0) * dofR; }
        void main(){
          vec2 px = 1.0 / res; float d0 = dep(vUv); vec3 n0 = nor(vUv);
          vec3 col = texture2D(tC, vUv).rgb; float coc = cocAt(d0);
          if (coc > 0.6) { vec3 acc = col; float ws = 1.0;
            for (int i = 0; i < TAPSI; i++) { float fi = float(i); float r = sqrt((fi + 0.5) / TAPS) * coc; float a = fi * 2.39996; vec2 o = vec2(cos(a), sin(a)) * r * px;
              float cn = cocAt(dep(vUv + o)); float w = clamp(cn / max(r, 0.5), 0.0, 1.0); acc += texture2D(tC, vUv + o).rgb * w; ws += w; }
            col = acc / ws; }
          vec2 pn = 1.0 / resN; float l = dep(vUv - vec2(pn.x, 0.0)), r2 = dep(vUv + vec2(pn.x, 0.0)), u = dep(vUv + vec2(0.0, pn.y)), dn = dep(vUv - vec2(0.0, pn.y));
          float iz = 1.0 / d0; float lap = max(abs(1.0/l + 1.0/r2 - 2.0*iz), abs(1.0/u + 1.0/dn - 2.0*iz)) * d0;
          float eD = smoothstep(0.035, 0.09, lap);
          float eN = 0.0; vec2 o4[4]; o4[0] = vec2(pn.x, 0.0); o4[1] = vec2(-pn.x, 0.0); o4[2] = vec2(0.0, pn.y); o4[3] = vec2(0.0, -pn.y);
          for (int i = 0; i < 4; i++) { vec2 uv2 = vUv + o4[i] * 1.2; float dd = dep(uv2); if (abs(dd - d0) / d0 < 0.2) eN = max(eN, 1.0 - clamp(dot(n0, nor(uv2)), 0.0, 1.0)); }
          eN = smoothstep(0.2, 0.42, eN);
          float e = max(eD, eN) * (1.0 - smoothstep(inkNear, inkFar, d0)) * (1.0 - smoothstep(1.0, 7.0, coc)) * step(d0, 900.0);
          col = mix(col, inkCol, e * inkK);
          float g = dot(col, vec3(0.2126, 0.7152, 0.0722)); col = max(mix(vec3(g), col, sat), lift * 0.0) ; col = col + lift * (1.0 - smoothstep(0.0, 0.25, g)) * 0.35;
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }` });
    const compScene = new TH.Scene(), compCam = new TH.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    compScene.add(new TH.Mesh(new TH.PlaneGeometry(2, 2), comp));
    Object.assign(W3, { renderer, scene, cam, fog, comp });

    // ---------------- materials + helpers ----------------
    const gradTex = new TH.DataTexture(new Uint8Array([70, 150, 255]), 3, 1, TH.RedFormat); gradTex.minFilter = gradTex.magFilter = TH.NearestFilter; gradTex.needsUpdate = true;
    W3.gradTex = gradTex;
    W3.toon = (color, map, o = {}) => new TH.MeshToonMaterial(Object.assign({ color: new TH.Color(color), gradientMap: gradTex, map: map || null }, o));
    W3.basic = (color, o = {}) => new TH.MeshBasicMaterial(Object.assign({ color: new TH.Color(color) }, o));
    W3.tex = (w, h, draw, o = {}) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new TH.CanvasTexture(c);
      t.wrapS = t.wrapT = o.clamp ? TH.ClampToEdgeWrapping : TH.RepeatWrapping; t.colorSpace = TH.SRGBColorSpace; t.anisotropy = 8; return t; };
    W3.uvScale = (geo, sx, sy) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy); uv.needsUpdate = true; return geo; };
    W3.add = (m, x = 0, y = 0, z = 0, layer, parent) => { m.position.set(x, y, z); if (layer) m.layers.set(layer); (parent || scene).add(m); return m; };
    W3.box = (w, h, d, color, x, y, z, parent) => W3.add(new TH.Mesh(new TH.BoxGeometry(w, h, d), typeof color === "string" ? W3.toon(color) : color), x, y, z, 0, parent);   // y = bottom
    W3.glowTex = W3.tex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.18, "rgba(255,255,255,0.75)"); gr.addColorStop(0.5, "rgba(255,255,255,0.18)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }, { clamp: true });
    W3.glow = (color, size, x, y, z) => { const s = new TH.Sprite(new TH.SpriteMaterial({ map: W3.glowTex, color: new TH.Color(color), blending: TH.AdditiveBlending, depthWrite: false, fog: false, transparent: true })); s.scale.set(size, size, 1); return W3.add(s, x, y, z, 1); };
    // text label texture (signs)
    // canvas textures that use web fonts are drawn again once the font has loaded (the render waits on buildReady)
    let FONTN = 0; window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
    W3.fontTex = (w, h, draw, fonts, o = {}) => { const t = W3.tex(w, h, draw, o); const c = t.image;
      if (document.fonts && fonts && fonts.length) window.__hf.buildReady["sr3dfont" + FONTN++] = Promise.all(fonts.map((f) => document.fonts.load(f).catch(() => null))).then(() => { const g = c.getContext("2d"); g.clearRect(0, 0, w, h); draw(g, w, h); t.needsUpdate = true; });
      return t; };
    W3.label = (text, o = {}) => { const font = `900 ${o.size || 72}px ${o.font || "Outfit"}`;
      return W3.fontTex(o.w || 512, o.h || 128, (g, w, h) => { g.fillStyle = o.bg || "#F2E6C8"; g.fillRect(0, 0, w, h); if (o.border !== false) { g.strokeStyle = o.ink || INK; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); }
        g.fillStyle = o.color || INK; g.font = `${font}, Nunito, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, w / 2, h / 2 + 4); }, [font], { clamp: true }); };
    // sky dome (layer 1: no ink, no depth). Colours are set per frame with W3.skyCol(top, mid, horizon)
    const sky = new TH.Mesh(new TH.SphereGeometry(900, 32, 16), new TH.ShaderMaterial({ side: TH.BackSide, depthWrite: false, fog: false,
      uniforms: { cT: { value: new TH.Color("#5A8CD8") }, cM: { value: new TH.Color("#9CC4EC") }, cH: { value: new TH.Color("#FFE2C0") }, cG: { value: new TH.Color("#6A7A9A") }, sunDir: { value: new TH.Vector3(0.3, 0.4, -0.8).normalize() }, sunCol: { value: new TH.Color("#FFE6B0") }, sunK: { value: 0.0 } },
      vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 cT, cM, cH, cG, sunDir, sunCol; uniform float sunK; varying vec3 vP; void main(){ float h = vP.y; vec3 c = mix(cH, cM, smoothstep(0.0, 0.22, h)); c = mix(c, cT, smoothstep(0.22, 0.75, h)); c = mix(cG, c, smoothstep(-0.08, 0.0, h));
        float s = clamp(dot(normalize(vP), normalize(sunDir)), 0.0, 1.0); c += sunCol * (pow(s, 600.0) * 2.0 + pow(s, 12.0) * 0.35) * sunK; gl_FragColor = vec4(c, 1.0); }` }));
    sky.renderOrder = -10; W3.add(sky, 0, 0, 0, 1); W3.sky = sky;
    W3.skyCol = (top, mid, hor, gr) => { const u = sky.material.uniforms; u.cT.value.set(top); u.cM.value.set(mid); u.cH.value.set(hor); if (gr) u.cG.value.set(gr); };
    // stars
    { const r = mulberry32(14), n = 900, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, y = 0.06 + Math.pow(r(), 0.7) * 0.94, rr = Math.sqrt(1 - y * y); pos.set([Math.cos(a) * rr * 800, y * 800, Math.sin(a) * rr * 800], i * 3); }
      const g = new TH.BufferGeometry(); g.setAttribute("position", new TH.BufferAttribute(pos, 3));
      W3.stars = new TH.Points(g, new TH.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0, depthWrite: false })); W3.stars.renderOrder = -9; W3.add(W3.stars, 0, 0, 0, 1); }

    // ---------------- SVG overlay: billboards ----------------
    const ov = opt.ov, defs = ov.querySelector("defs") || el("defs", {}, ov);
    let FID = 1;
    // lit filter: tints the flat rig toward the scene light and adds an INNER rim on the light-facing side (never an outer copy)
    W3.litF = function (rim, dx, dy, tint, k = 0.9) { const id = "lf" + FID++, f = el("filter", { id, x: "-20%", y: "-20%", width: "140%", height: "140%", "color-interpolation-filters": "sRGB" }, defs);
      el("feColorMatrix", { in: "SourceGraphic", type: "matrix", values: `${tint[0]} 0 0 0 0  0 ${tint[1]} 0 0 0  0 0 ${tint[2]} 0 0  0 0 0 1 0`, result: "tn" }, f);
      el("feOffset", { in: "SourceAlpha", dx, dy, result: "o" }, f); el("feComposite", { in: "SourceAlpha", in2: "o", operator: "out", result: "band" }, f);
      el("feFlood", { "flood-color": rim, "flood-opacity": k, result: "c" }, f); el("feComposite", { in: "c", in2: "band", operator: "in", result: "rb" }, f);
      el("feGaussianBlur", { in: "rb", stdDeviation: 0.8, result: "rbb" }, f); el("feComposite", { in: "rbb", in2: "SourceAlpha", operator: "in", result: "rim" }, f);
      const m = el("feMerge", {}, f); el("feMergeNode", { in: "tn" }, m); el("feMergeNode", { in: "rim" }, m); return `url(#${id})`; };
    const bbL = el("g", {}, ov); W3.ovTop = el("g", {}, ov);
    const BB = []; let BID = 1; W3.BB = BB; W3.occ = [];
    W3.card = function (o) { const outer = el("g", { display: "none" }, bbL), cp = el("clipPath", { id: "bc" + BID, clipPathUnits: "userSpaceOnUse" }, defs), poly = el("polygon", { points: "" }, cp), wrap = el("g", {}, outer);
      const b = Object.assign({ outer, cpId: "bc" + BID++, poly, wrap, vis: () => 1, scale: 1 }, o); BB.push(b); return b; };
    // a person: P3 = [[t, {x,y,z}, ease]], face = [[t, {x,z}]] world direction; rig = SR.Character spec overrides
    W3.person = function (o) {
      const P3 = o.P3, xs = []; let acc = 0; P3.forEach((k, i) => { if (i) { const a = P3[i - 1][1], c = k[1]; const jump = Math.hypot(c.x - a.x, c.y - a.y, c.z - a.z); acc += (k[2] === "jump" ? 0 : jump) * PXM; } xs.push([k[0], acc, k[2] === "jump" ? "linear" : k[2]]); });
      const P = P3.map((k) => [k[0], k[1], k[2] === "jump" ? "linear" : k[2]]);
      const b = W3.card(Object.assign({ kind: "char", pref: 1, face: [[0, { x: 1, z: 0 }]] }, o));
      b.ch = SR.Character(b.wrap, Object.assign({ thin: true, scale: 1, x: xs, y: [[0, 0]], facing: [[0, 1]], noWalk: false, pose: [[0, "relaxed", 0]], mood: [[0, "neutral", 0]] }, o.rig || {}));
      if (o.extra) o.extra(b);
      b.pos = (t) => sampleTrack(P, t, P[0][1]); return b; };
    const tv = new TH.Vector3();
    const proj = W3.proj = (x, y, z) => { tv.set(x, y, z).applyMatrix4(cam.matrixWorldInverse); const d = -tv.z; tv.applyMatrix4(cam.projectionMatrix); return { sx: (tv.x + 1) * FW / 2, sy: (1 - tv.y) * FH / 2, d }; };
    // occluders: {axis:"z"|"x", a0, a1 (extent along the facing axis), b0, b1 (extent along the run), y (top)}; legacy {x0,x1,z0,z1,y} = axis z
    function clipFor(p) { let best = null, bestY = Infinity; const c = cam.position;
      for (const o0 of W3.occ) { const o = o0.axis ? o0 : { axis: "z", a0: o0.z0, a1: o0.z1, b0: o0.x0, b1: o0.x1, y: o0.y };
        const ax = o.axis === "z" ? "z" : "x", bx = ax === "z" ? "x" : "z"; const pa = p[ax], pb = p[bx], ca = c[ax];
        if (pb < o.b0 || pb > o.b1) continue; if (o.y0 !== undefined && p.y < o.y0 - 2) continue; let ea;
        if (ca < o.a0 && pa > o.a1) ea = c.y > o.y ? o.a1 : o.a0; else if (ca > o.a1 && pa < o.a0) ea = c.y > o.y ? o.a0 : o.a1; else continue;
        const q = (bv) => ax === "z" ? proj(bv, o.y, ea) : proj(ea, o.y, bv); const a = q(pb - 2), b = q(pb + 2); if (a.d < 0.05 || b.d < 0.05) continue;
        const m = (b.sy - a.sy) / (b.sx - a.sx || 1e-6), yAt = (X) => a.sy + m * (X - a.sx), here = yAt(proj(p.x, p.y, p.z).sx);
        if (here < bestY) { bestY = here; best = `-2000,${yAt(-2000).toFixed(1)} ${FW + 2000},${yAt(FW + 2000).toFixed(1)} ${FW + 2000},-6000 -2000,-6000`; } }
      return best; }

    // ---------------- camera keys ----------------
    // K = [{t, p:[x,y,z], l:[x,y,z], f, dof, fn, ff, e:"io"|"lin"|"cut"|"out"|"in"}]
    W3.keys = function (K) {
      K.sort((a, b) => a.t - b.t);
      for (let i = 1; i < K.length; i++) for (const f of ["dof", "fn", "ff", "f"]) if (K[i][f] === undefined) K[i][f] = K[i - 1][f];
      K.forEach((k) => { const dx = k.l[0] - k.p[0], dy = k.l[1] - k.p[1], dz = k.l[2] - k.p[2], d = Math.hypot(dx, dy, dz); Object.assign(k, { yaw: Math.atan2(dx, -dz), pitch: Math.asin(dy / d), d }); });
      const EZ = { lin: (u) => u, io: sstep, out: (u) => 1 - Math.pow(1 - u, 3), in: (u) => u * u * u };
      return function (t) { let i = 0; while (i < K.length - 1 && t >= K[i + 1].t) i++; const a = K[i], b = K[Math.min(i + 1, K.length - 1)];
        if (a === b || b.e === "cut" || t <= a.t) return a; const u = clamp((t - a.t) / (b.t - a.t), 0, 1), k = (EZ[b.e] || sstep)(u);
        let dy = b.yaw - a.yaw; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
        return { p: a.p.map((v, j) => lerp(v, b.p[j], k)), yaw: a.yaw + dy * k, pitch: lerp(a.pitch, b.pitch, k), d: lerp(a.d, b.d, k), f: lerp(a.f, b.f, k), dof: lerp(a.dof, b.dof, k), fn: lerp(a.fn, b.fn, k), ff: lerp(a.ff, b.ff, k) }; };
    };

    // ---------------- one frame ----------------
    // c = camera state from W3.keys(...)(t); o = { shake:[x,y], lightFor(b, t) → filter url | null }
    W3.frame = function (t, c, o = {}) {
      const sh = o.shake || [0, 0];
      cam.position.set(c.p[0] + sh[0], c.p[1] + sh[1], c.p[2]); cam.fov = c.f; cam.updateProjectionMatrix();
      const dir = new TH.Vector3(Math.sin(c.yaw) * Math.cos(c.pitch), Math.sin(c.pitch), -Math.cos(c.yaw) * Math.cos(c.pitch));
      cam.lookAt(cam.position.clone().add(dir)); if (o.roll) cam.rotateZ(o.roll); cam.updateMatrixWorld(); cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
      fog.near = c.fn; fog.far = c.ff; comp.uniforms.focus.value = c.d; comp.uniforms.dofR.value = c.dof * 14; comp.uniforms.inkNear.value = c.fn * 1.3; comp.uniforms.inkFar.value = c.ff * 1.05;
      sky.position.copy(cam.position); W3.stars.position.copy(cam.position);
      if (o.before) o.before(cam);
      cam.layers.enableAll(); renderer.setRenderTarget(rtC); renderer.setClearColor(0x0b0a12, 1); renderer.clear(); renderer.render(scene, cam);
      scene.overrideMaterial = ndMat; cam.layers.set(0); const fgs = scene.fog; scene.fog = null; renderer.setRenderTarget(rtN); renderer.setClearColor(new TH.Color(0.5, 0.5, 1.0), 1); renderer.clear(); renderer.render(scene, cam);
      scene.overrideMaterial = null; scene.fog = fgs; cam.layers.enableAll(); renderer.setRenderTarget(null); renderer.render(compScene, compCam);
      // billboards
      const live = [], fpx = (FH / 2) / Math.tan((c.f * Math.PI) / 360);
      for (const b of BB) { const vis = b.vis(t); const p = vis && b.pos ? b.pos(t) : null; if (!p) { b.outer.setAttribute("display", "none"); continue; }
        const s = proj(p.x, p.y, p.z); if (s.d < 0.3 || s.sx < -1200 || s.sx > FW + 1200) { b.outer.setAttribute("display", "none"); continue; }
        b.outer.removeAttribute("display"); const k = fpx / s.d / PXM * (typeof b.scale === "function" ? b.scale(t) : b.scale); let ox = 0, oy = 0;
        if (b.ch) { const fd = sampleTrack(b.face, t, { x: 1, z: 0 }), a = proj(p.x, p.y + 1, p.z), e = proj(p.x + fd.x * 0.6, p.y + 1, p.z + fd.z * 0.6), dx = e.sx - a.sx;
          b.ch.spec.facing = [[0, Math.abs(dx) > 3 ? Math.sign(dx) : b.pref]];
          const r = b.ch.update(t); ox = r.x; oy = r.y; b.head = { x: s.sx + (r.headX - r.x) * k, y: s.sy + (r.headY - r.y) * k, k }; b.hand = { x: s.sx + (r.handX - r.x) * k, y: s.sy + (r.handY - r.y) * k }; b.r = r; b.k = k; b.screen = s; }
        if (o.lightFor) { const lf = o.lightFor(b, t); if (lf) b.wrap.setAttribute("filter", lf); else b.wrap.removeAttribute("filter"); }
        if (b.upd) b.upd(t, b);
        b.wrap.setAttribute("transform", `translate(${(s.sx - ox * k).toFixed(2)},${(s.sy - oy * k).toFixed(2)}) scale(${k.toFixed(4)})`);
        const cl = b.noClip ? null : clipFor(p); if (cl) { b.poly.setAttribute("points", cl); b.outer.setAttribute("clip-path", `url(#${b.cpId})`); } else b.outer.removeAttribute("clip-path");
        live.push([s.d - (b.bias || 0), b]); }
      live.sort((a, b) => b[0] - a[0]); live.forEach(([, b]) => bbL.appendChild(b.outer));
    };
    W3.compile = () => renderer.compile(scene, cam);
    return W3;
  }
  window.SR3D = { create };
})();
