/* Ep4 props (original designs): seagull, Theo's wall calendar, the "on guard" shield dome, a soup pot icon.
   EP4P.gull(W3)          → { group, update(t, o) }   o = { x,y,z, ry, flap (0..1), hop }
   EP4P.calendar(W3)      → { group, set(circled, today, note) }  canvas-textured plane, 30-day grid, hand-drawn circles
   EP4P.shield(W3)        → { group, update(t, k, alarm) }  translucent dome around a person, k = 0..1 size, alarm = red pulse 0..1
   EP4P.soupIcon(svgParent) → SVG <g> (drawn at a hand's screen position) */
(function () {
  const TH = window.THREE;
  function gull(W3) {
    const g = new TH.Group(), white = W3.toon("#F8F6F0"), grey = W3.toon("#9AA3AE"), beakM = W3.toon("#F2B53A"), dark = W3.toon("#2A2630");
    const body = new TH.Mesh(new TH.SphereGeometry(0.16, 14, 10), white); body.scale.set(1.5, 0.95, 0.95); g.add(body);
    const head = new TH.Mesh(new TH.SphereGeometry(0.1, 12, 10), white); head.position.set(0.2, 0.12, 0); g.add(head);
    const beak = new TH.Mesh(new TH.ConeGeometry(0.03, 0.12, 8), beakM); beak.rotation.z = -Math.PI / 2; beak.position.set(0.33, 0.1, 0); g.add(beak);
    [-1, 1].forEach((s) => { const e = new TH.Mesh(new TH.SphereGeometry(0.017, 8, 6), dark); e.position.set(0.26, 0.15, 0.065 * s); g.add(e); });
    const tail = new TH.Mesh(new TH.BoxGeometry(0.14, 0.03, 0.12), grey); tail.position.set(-0.27, 0.04, 0); g.add(tail);
    const wings = [-1, 1].map((s) => { const piv = new TH.Group(); piv.position.set(0, 0.08, 0.09 * s); const w = new TH.Mesh(new TH.BoxGeometry(0.26, 0.025, 0.34), grey); w.position.set(-0.03, 0, 0.17 * s); piv.add(w);
      const tip = new TH.Mesh(new TH.BoxGeometry(0.12, 0.026, 0.12), dark); tip.position.set(-0.06, 0, 0.36 * s); piv.add(tip); g.add(piv); return { piv, s }; });
    const legs = [-1, 1].map((s) => { const l = new TH.Mesh(new TH.CylinderGeometry(0.008, 0.008, 0.16, 5), beakM); l.position.set(0.02, -0.2, 0.05 * s); g.add(l); return l; });
    W3.scene.add(g);
    return { group: g, update(t, o) { g.visible = !!o; if (!o) return; const hop = o.hop ? Math.abs(Math.sin(t * 9)) * 0.05 * o.hop : 0;
      g.position.set(o.x, o.y + 0.2 + hop, o.z); g.rotation.y = o.ry || 0; head.rotation.z = Math.sin(t * 2.2) * 0.15; head.position.y = 0.12 + Math.max(0, Math.sin(t * 3.1)) * 0.02;
      const f = o.flap || 0; wings.forEach(({ piv, s }) => (piv.rotation.x = s * (0.15 + f * (0.6 + 0.6 * Math.sin(t * 16))))); legs.forEach((l) => (l.visible = f < 0.5)); } };
  }
  function calendar(W3) {
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 600; const c = cv.getContext("2d"); const tex = new TH.CanvasTexture(cv); tex.anisotropy = 4;
    const mat = new TH.MeshBasicMaterial({ map: tex }); const m = new TH.Mesh(new TH.PlaneGeometry(0.62, 0.73), mat); const g = new TH.Group(); g.add(m);
    const frame = new TH.Mesh(new TH.BoxGeometry(0.66, 0.77, 0.02), W3.toon("#5A3E2A")); frame.position.z = -0.012; g.add(frame); W3.scene.add(g);
    let key = "";
    function draw(circled, today, note) {
      c.fillStyle = "#FBF4E4"; c.fillRect(0, 0, 512, 600); c.fillStyle = "#E2574C"; c.fillRect(0, 0, 512, 92);
      c.fillStyle = "#FFF6E4"; c.font = "900 54px Outfit, sans-serif"; c.textAlign = "center"; c.fillText("30 DAYS", 256, 66);
      c.font = "800 34px Nunito, sans-serif";
      for (let d = 1; d <= 30; d++) { const i = d - 1, x = 48 + (i % 6) * 83, y = 150 + Math.floor(i / 6) * 96;
        c.fillStyle = d === today ? "#FFE3A0" : "#FBF4E4"; c.fillRect(x - 38, y - 44, 76, 80); c.strokeStyle = "#D8CBB2"; c.lineWidth = 2; c.strokeRect(x - 38, y - 44, 76, 80);
        c.fillStyle = "#3A3036"; c.fillText(String(d), x, y + 10);
        if (circled.includes(d)) { c.strokeStyle = "#E2574C"; c.lineWidth = 6; c.beginPath(); const wob = (d * 37) % 7; c.ellipse(x + 1, y - 2, 31 + wob * 0.6, 29, (wob - 3) * 0.05, 0.2, Math.PI * 2 + 0.5); c.stroke(); } }
      if (note) { c.save(); c.translate(372, 560); c.rotate(-0.06); c.fillStyle = "#FFF07A"; c.fillRect(-120, -40, 240, 70); c.fillStyle = "#3A3036"; c.font = "800 26px Nunito, sans-serif"; c.fillText(note, 0, 4); c.restore(); }
      tex.needsUpdate = true; }
    return { group: g, set(circled, today, note) { const k = circled.join(",") + "|" + today + "|" + (note || ""); if (k !== key) { key = k; draw(circled, today, note); } } };
  }
  function shield(W3) {
    const g = new TH.Group(); const mat = new TH.MeshBasicMaterial({ color: "#9FD0FF", transparent: true, opacity: 0.18, depthWrite: false, side: TH.DoubleSide });
    const dome = new TH.Mesh(new TH.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat); g.add(dome);
    const rimM = new TH.MeshBasicMaterial({ color: "#CFE8FF", transparent: true, opacity: 0.7, depthWrite: false }); const rim = new TH.Mesh(new TH.TorusGeometry(1, 0.02, 6, 64).rotateX(Math.PI / 2), rimM); g.add(rim);
    const hexM = new TH.MeshBasicMaterial({ color: "#E8F4FF", transparent: true, opacity: 0.35, depthWrite: false, wireframe: true }); const hex = new TH.Mesh(new TH.IcosahedronGeometry(1.002, 2), hexM); g.add(hex);
    g.traverse((o) => { if (o.isMesh) { o.layers.set(1); o.renderOrder = 5; } }); W3.scene.add(g);
    const blue = new TH.Color("#9FD0FF"), red = new TH.Color("#FF6A5A");
    return { group: g, update(t, k, alarm = 0, pos) { g.visible = k > 0.01; if (!g.visible) return; if (pos) g.position.set(pos.x, pos.y || 0, pos.z); g.scale.setScalar(0.05 + 1.05 * k);
      const p = alarm * (0.5 + 0.5 * Math.sin(t * 9)); mat.color.copy(blue).lerp(red, p * 0.85); mat.opacity = 0.14 + 0.12 * p; hexM.color.copy(new TH.Color("#E8F4FF")).lerp(red, p); hex.rotation.y = t * 0.2; rimM.opacity = 0.5 + 0.4 * p; } };
  }
  function soupIcon(parent) {
    const NS = "http://www.w3.org/2000/svg", el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
    const g = el("g", { display: "none" }, parent);
    el("path", { d: "M-30,-6 L30,-6 L24,26 Q0,34 -24,26 Z", fill: "#3FA7A0", stroke: "#1E1B22", "stroke-width": 5, "stroke-linejoin": "round" }, g);
    el("rect", { x: -34, y: -14, width: 68, height: 11, rx: 5, fill: "#FFF6E4", stroke: "#1E1B22", "stroke-width": 5 }, g);
    el("path", { d: "M-34,-2 q-12,6 0,14 M34,-2 q12,6 0,14", fill: "none", stroke: "#1E1B22", "stroke-width": 5, "stroke-linecap": "round" }, g);
    const steam = [-12, 2, 16].map((x) => el("path", { d: `M${x},-20 q-6,-10 0,-20 q6,-10 0,-20`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4, "stroke-linecap": "round", opacity: 0.8 }, g));
    g.steam = steam; return g;
  }
  window.EP4P = { gull, calendar, shield, soupIcon };
})();
