/* SR Host: a realistic 3D stick-figure presenter for SR3D worlds (pure function of t).
   Satin-black capsule limbs with ball joints, a 3D head with glossy eyes, eyelids, brows and a lip-synced mouth,
   procedural walk, gestures, idle breathing, blinks, and eye contact with the camera.
   const host = SRHost.create(W3, { P3:[[t,{x,y,z},ease]], yaw:[[t,deg]], pose:[[t,name,dur]], mood:[[t,name,dur]], talk:[[t0,lipId]], lookCam:[[t,0..1]] });
   host.update(t)  (call before W3.frame) */
(function () {
  const TH = window.THREE, SR = window.SR; const { clamp, sampleTrack } = SR;
  const lerp = (a, b, k) => a + (b - a) * k, D2R = Math.PI / 180, sst = (k) => k * k * (3 - 2 * k);
  // joint angles in degrees: spine/head (x = pitch fwd+, y = yaw, z = roll), shoulders (x fwd swing, z = out from body), elbows (bend), hips (x fwd), knees (bend)
  const POSES = {
    stand:    { spX: 0, spZ: 0, hdX: 0, hdY: 0, hdZ: 0, shLx: 4, shLz: 10, elL: 12, shRx: 4, shRz: 10, elR: 12, hiL: 0, knL: 2, hiR: 0, knR: 2 },
    wave:     { spX: 0, spZ: -3, hdX: 0, hdY: 0, hdZ: 6, shLx: 4, shLz: 10, elL: 12, shRx: 0, shRz: 150, elR: 35, hiL: 0, knL: 2, hiR: 0, knR: 2, waveR: 1 },
    hands:    { spX: 14, spZ: 0, hdX: 34, hdY: 0, hdZ: 0, shLx: 70, shLz: 8, elL: 70, shRx: 70, shRz: 8, elR: 70, hiL: 0, knL: 4, hiR: 0, knR: 4 },
    shrug:    { spX: -2, spZ: 0, hdX: -4, hdY: 0, hdZ: 8, shLx: 10, shLz: 40, elL: 95, shRx: 10, shRz: 40, elR: 95, hiL: 0, knL: 2, hiR: 0, knR: 2, shrugK: 1 },
    present:  { spX: 2, spZ: 4, hdX: 0, hdY: 0, hdZ: -4, shLx: 4, shLz: 10, elL: 14, shRx: 35, shRz: 55, elR: 20, hiL: 0, knL: 2, hiR: 0, knR: 2 },
    point:    { spX: 2, spZ: 2, hdX: 0, hdY: 0, hdZ: 0, shLx: 4, shLz: 10, elL: 12, shRx: 80, shRz: 25, elR: 4, hiL: 0, knL: 2, hiR: 0, knR: 2 },
    explain:  { spX: 3, spZ: 0, hdX: 2, hdY: 0, hdZ: 0, shLx: 40, shLz: 22, elL: 70, shRx: 40, shRz: 22, elR: 70, hiL: 0, knL: 3, hiR: 0, knR: 3 },
    hipHand:  { spX: 0, spZ: 6, hdX: -3, hdY: 0, hdZ: 8, shLx: -10, shLz: 45, elL: 120, shRx: 20, shRz: 20, elR: 40, hiL: 0, knL: 3, hiR: 6, knR: 12 },
  };
  const MOODS = { neutral: { smile: 0.2, brow: 0, browIn: 0, lidL: 0, lidR: 0, eyeS: 1 }, happy: { smile: 1, brow: 0.3, browIn: 0, lidL: 0.15, lidR: 0.15, eyeS: 1 },
    joy: { smile: 1, brow: 0.6, browIn: 0, lidL: 0, lidR: 0, eyeS: 1.08 }, curious: { smile: 0.3, brow: 0.8, browIn: -0.4, lidL: 0, lidR: 0.25, eyeS: 1.05 },
    wink: { smile: 1, brow: 0.4, browIn: 0, lidL: 0, lidR: 1, eyeS: 1 }, surprised: { smile: 0, brow: 1, browIn: 0, lidL: 0, lidR: 0, eyeS: 1.2 }, sly: { smile: 0.8, brow: 0.2, browIn: 0.5, lidL: 0.35, lidR: 0.35, eyeS: 1 } };
  function blendNamed(keys, t, table, def) { if (!keys || !keys.length) return Object.assign({}, table[def]); let cur = Object.assign({}, table[keys[0][1]] || table[def]);
    for (const [t0, name, dur] of keys) { if (t < t0) break; const tg = table[name] || table[def], k = sst(clamp((t - t0) / Math.max(0.01, dur ?? 0.35), 0, 1)); const o = {}; for (const key of new Set([...Object.keys(cur), ...Object.keys(tg)])) o[key] = lerp(cur[key] ?? 0, tg[key] ?? 0, k); cur = o; } return cur; }

  function create(W3, o) {
    const body = new TH.MeshPhysicalMaterial({ color: new TH.Color(o.color || "#26222E"), roughness: 0.36, metalness: 0.0, clearcoat: 0.7, clearcoatRoughness: 0.22, sheen: 0.4, sheenColor: new TH.Color("#6A6AA0") });
    const joint = new TH.MeshPhysicalMaterial({ color: new TH.Color(o.jointColor || "#34303E"), roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.18 });
    const white = new TH.MeshPhysicalMaterial({ color: new TH.Color("#F6F3EE"), roughness: 0.12, clearcoat: 1.0, clearcoatRoughness: 0.05 });
    const pupilM = new TH.MeshPhysicalMaterial({ color: new TH.Color("#0E0C14"), roughness: 0.05, clearcoat: 1.0 });
    const mouthIn = new TH.MeshStandardMaterial({ color: new TH.Color("#5A1E28"), roughness: 0.6 }), lipM = new TH.MeshPhysicalMaterial({ color: new TH.Color("#E9E2DA"), roughness: 0.3, clearcoat: 0.5 });
    const browM = new TH.MeshPhysicalMaterial({ color: new TH.Color("#E9E2DA"), roughness: 0.4 });
    const accent = o.accent ? new TH.MeshPhysicalMaterial({ color: new TH.Color(o.accent), roughness: 0.5, sheen: 0.6, sheenColor: new TH.Color("#FFFFFF") }) : null;
    const G = (parent, x = 0, y = 0, z = 0) => { const g = new TH.Group(); g.position.set(x, y, z); parent.add(g); return g; };
    const cap = (parent, r, L, mat) => { const m = new TH.Mesh(new TH.CapsuleGeometry(r, L, 6, 14), mat); m.position.y = -L / 2; m.castShadow = true; parent.add(m); return m; };
    const ball = (parent, r, mat, x = 0, y = 0, z = 0) => { const m = new TH.Mesh(new TH.SphereGeometry(r, 18, 12), mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
    const root = G(W3.scene), pelvis = G(root, 0, 0.93, 0);
    ball(pelvis, 0.045, joint);
    const spine = G(pelvis); const torso = new TH.Mesh(new TH.CapsuleGeometry(0.036, 0.42, 6, 14), body); torso.position.y = 0.25; torso.castShadow = true; spine.add(torso);
    const chest = G(spine, 0, 0.5, 0); ball(chest, 0.045, joint);
    if (accent) { const sc = new TH.Mesh(new TH.TorusGeometry(0.06, 0.018, 8, 20), accent); sc.rotation.x = Math.PI / 2; sc.position.y = 0.02; chest.add(sc); }   // a scarf ring: one accent colour
    const neck = G(chest, 0, 0.03, 0); const nk = new TH.Mesh(new TH.CapsuleGeometry(0.022, 0.06, 4, 10), body); nk.position.y = 0.05; neck.add(nk);
    const headG = G(neck, 0, 0.215, 0); const HR = 0.155; const head = ball(headG, HR, body);
    // face (front = +z)
    const eyes = [-1, 1].map((s) => { const eg = G(headG, s * 0.056, 0.026, HR * 0.86); const w = ball(eg, 0.038, white); const p = ball(eg, 0.019, pupilM, 0, 0, 0.027);
      const lid = new TH.Mesh(new TH.SphereGeometry(0.041, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), body); lid.rotation.x = -Math.PI / 2 - 0.15; eg.add(lid);   // upper lid shell rotates down to blink
      const brow = new TH.Mesh(new TH.CapsuleGeometry(0.006, 0.04, 3, 8), browM); brow.rotation.z = Math.PI / 2; brow.position.set(0, 0.062, 0.012); brow.scale.setScalar(1.25); eg.add(brow);
      return { eg, w, p, lid, brow, s }; });
    const mouthG = G(headG, 0, -0.06, HR * 0.92); mouthG.scale.setScalar(1.3);
    const smileArc = new TH.Mesh(new TH.TorusGeometry(0.034, 0.0065, 8, 24, Math.PI * 0.8), lipM); smileArc.rotation.z = Math.PI + Math.PI * 0.1; mouthG.add(smileArc);
    const mOpen = new TH.Mesh(new TH.SphereGeometry(0.03, 16, 10), mouthIn); mOpen.scale.set(1.2, 0.2, 0.35); mouthG.add(mOpen);
    const mRim = new TH.Mesh(new TH.TorusGeometry(0.032, 0.006, 8, 24), lipM); mRim.scale.set(1.15, 0.2, 1); mouthG.add(mRim);
    // limbs
    const limb = (parent, x, y, L1, L2, r) => { const sh = G(parent, x, y, 0); ball(sh, r * 1.35, joint); cap(sh, r, L1, body); const el = G(sh, 0, -L1, 0); ball(el, r * 1.25, joint); cap(el, r * 0.92, L2, body); const end = G(el, 0, -L2, 0); return { sh, el, end }; };
    const armL = limb(chest, -0.16, -0.02, 0.27, 0.25, 0.021), armR = limb(chest, 0.16, -0.02, 0.27, 0.25, 0.021);
    [armL, armR].forEach((a) => ball(a.end, 0.034, body, 0, -0.02, 0));
    const legL = limb(pelvis, -0.085, -0.02, 0.43, 0.42, 0.026), legR = limb(pelvis, 0.085, -0.02, 0.43, 0.42, 0.026);
    [legL, legR].forEach((l) => { const f = new TH.Mesh(new TH.CapsuleGeometry(0.03, 0.09, 4, 10), body); f.rotation.x = Math.PI / 2; f.position.set(0, -0.035, 0.045); f.castShadow = true; l.end.add(f); });
    // soft contact shadow under the feet (in addition to real shadows when enabled)
    const blobTex = W3.tex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(20,14,30,0.55)"); gr.addColorStop(1, "rgba(20,14,30,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }, { clamp: true });
    const blob = new TH.Mesh(new TH.PlaneGeometry(0.75, 0.5), new TH.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, fog: false })); blob.rotation.x = -Math.PI / 2; blob.layers.set(1); W3.scene.add(blob);
    root.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    // tracks
    const P3 = o.P3, dist = []; let acc = 0; P3.forEach((k, i) => { if (i) { const a = P3[i - 1][1], c = k[1]; acc += k[2] === "jump" ? 0 : Math.hypot(c.x - a.x, c.z - a.z); } dist.push([k[0], acc, k[2] === "jump" ? "linear" : k[2]]); });
    const P = P3.map((k) => [k[0], k[1], k[2] === "jump" ? "linear" : k[2]]);
    const lips = window.SR_LIPS || {};
    const H = { root, headG, pos: (t) => sampleTrack(P, t, P[0][1]) };
    H.update = (t, cam) => {
      const p = H.pos(t), yaw = sampleTrack(o.yaw || [[0, 0]], t, 0) * D2R; root.position.set(p.x, p.y, p.z); root.rotation.y = yaw;
      blob.position.set(p.x, (p.groundY ?? p.y) + 0.012, p.z);
      const d = sampleTrack(dist, t, 0), spd = Math.abs(sampleTrack(dist, t + 0.05, 0) - sampleTrack(dist, t - 0.05, 0)) / 0.1, w = clamp(spd / 1.2, 0, 1);
      const ph = (d / 1.35) * Math.PI * 2, sw = Math.sin(ph), cw = Math.cos(ph);
      const Q = blendNamed(o.pose, t, POSES, "stand"), M = blendNamed(o.mood, t, MOODS, "neutral");
      // talk envelope
      let env = 0; for (const [t0, id] of o.talk || []) { const L = lips[id]; if (!L) continue; const i = Math.floor((t - t0) * L.fps); if (i >= 0 && i < L.env.length) env = Math.max(env, L.env[i]); }
      const breath = Math.sin(t * 2.2) * 0.012 * (1 - w);
      pelvis.position.y = 0.93 - Math.abs(cw) * 0.025 * w + breath * 0.5; pelvis.rotation.y = sw * 0.12 * w; pelvis.rotation.z = cw * 0.03 * w;
      spine.rotation.x = (Q.spX + 6 * w) * D2R + env * 0.03 * Math.sin(t * 9); spine.rotation.z = Q.spZ * D2R - pelvis.rotation.z * 0.6; spine.scale.y = 1 + breath;
      chest.rotation.y = -sw * 0.18 * w;
      // arms (swing when walking, gesture otherwise); shoulders x = forward swing, z = abduction
      const shrug = (Q.shrugK || 0) * 0.04; chest.position.y = 0.5 + shrug * 0.3;
      const arm = (a, sx, sz, el, side, swing) => { a.sh.rotation.set(-(sx * D2R) + swing, 0, side * sz * D2R); a.el.rotation.set(el * D2R * 1.0, 0, 0); };
      const waveR = (Q.waveR || 0) * Math.sin(t * 11) * 0.35;
      arm(armL, Q.shLx, Q.shLz, -Q.elL, -1, -sw * 0.55 * w); arm(armR, Q.shRx, Q.shRz, -Q.elR, 1, sw * 0.55 * w);
      armR.el.rotation.z = waveR; armL.sh.position.y = -0.02 + shrug; armR.sh.position.y = -0.02 + shrug;
      // legs
      const leg = (l, hi, kn, s) => { l.sh.rotation.set(-(hi * D2R) - s * 0.5 * w, 0, 0); l.el.rotation.set(kn * D2R + Math.max(0, -s) * 0.9 * w + 0.05, 0, 0); l.end.rotation.x = -l.el.rotation.x * 0.4 - l.sh.rotation.x * 0.3; };
      leg(legL, Q.hiL, Q.knL, sw); leg(legR, Q.hiR, Q.knR, -sw);
      // head: pose + eye contact with the camera
      const lc = clamp(sampleTrack(o.lookCam || [[0, 1]], t, 1), 0, 1); let hy = Q.hdY * D2R, hx = Q.hdX * D2R;
      if (cam && lc > 0) { root.updateMatrixWorld(true); const hp = new TH.Vector3(); headG.getWorldPosition(hp); const v = cam.position.clone().sub(hp); const ya = Math.atan2(v.x, v.z) - yaw; let dy = ((ya + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; dy = clamp(dy, -1.0, 1.0);
        const pa = -Math.atan2(v.y, Math.hypot(v.x, v.z)); hy = lerp(hy, dy - chest.rotation.y, lc); hx = lerp(hx, clamp(pa, -0.5, 0.5) - spine.rotation.x, lc); }
      headG.rotation.set(hx + env * 0.04 * Math.sin(t * 7), hy, Q.hdZ * D2R);
      // face: blink, lids, brows, mouth
      const bph = (t + 0.7) % 3.7, blink = bph < 0.12 ? Math.sin((bph / 0.12) * Math.PI) : 0;
      eyes.forEach((E, i) => { const lid = clamp((i ? M.lidR : M.lidL) + blink, 0, 1); E.lid.rotation.x = -Math.PI / 2 - 0.15 + lid * 1.45; E.eg.scale.setScalar(M.eyeS);
        E.p.position.set(0, 0, 0.027); E.brow.position.y = 0.062 + M.brow * 0.014 + env * 0.004; E.brow.rotation.z = Math.PI / 2 + E.s * M.browIn * 0.35; });
      const open = clamp(env * 1.1, 0, 1); smileArc.visible = open < 0.18; smileArc.scale.set(1, 0.6 + M.smile * 0.6, 1); smileArc.rotation.z = M.smile >= 0 ? Math.PI + 0.31 : 0.31;
      mOpen.visible = mRim.visible = open >= 0.18; mOpen.scale.set(1.0 + M.smile * 0.25, 0.2 + open * 0.85, 0.35); mRim.scale.set(1.05 + M.smile * 0.25, 0.22 + open * 0.85, 1);
    };
    return H;
  }
  window.SRHost = { create, POSES, MOODS };
})();
