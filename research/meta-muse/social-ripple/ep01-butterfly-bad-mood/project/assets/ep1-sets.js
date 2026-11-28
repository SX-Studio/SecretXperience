/* Episode 1 shared sets (built from the engine). Loaded after sr-engine.js. */
(function () {
  const SR = window.SR; const { el, Set, PAL } = SR;
  // The Daily Grind, interior. Returns handles used by scenes 5-7.
  function cafe(layers, opts = {}) {
    const { bg, board, counterL } = layers;
    const G = opts.G || 900;
    el("rect", { x: -600, y: -300, width: 3200, height: 1600, fill: "#EADBC6" }, bg);
    el("rect", { x: -600, y: G, width: 3200, height: 600, fill: "#B98E6A" }, bg);
    Set.cafeInterior(bg, G, 1920);
    // window onto the street (outside group exposed so scenes can put the car there)
    const win = el("g", {}, bg);
    el("rect", { x: 300, y: 300, width: 520, height: 420, fill: "#F7D3B5" }, win);
    const outside = el("g", { "clip-path": SR.clip(win, (opts.id || "ep1") + "-winclip", "M300,300 H820 V720 H300 Z") }, win);
    Set.building(el("g", { transform: "translate(300,0)" }, outside), 30, 160, 260, 720, PAL.sage, { cols: 2 });
    Set.building(el("g", { transform: "translate(300,0)" }, outside), 240, 200, 330, 720, PAL.plum, { cols: 2 });
    el("rect", { x: 300, y: 640, width: 520, height: 80, fill: PAL.street }, outside);
    const carSlot = el("g", {}, outside);
    el("rect", { x: 300, y: 300, width: 520, height: 420, fill: "none", stroke: PAL.ink, "stroke-width": 8 }, win);
    el("path", { d: "M560,300 L560,720 M300,510 L820,510", stroke: PAL.ink, "stroke-width": 6 }, win);
    const door = Set.door(bg, 160, G, PAL.teal);
    if (board) {
      Set.chalkboard(board, 870, 110, 640, 420);
      const t = el("text", { x: 1190, y: 200, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "Nunito", "font-weight": 900, "font-size": 46, fill: "#F4F1EA" }, board); t.textContent = "TODAY'S SPECIALS";
      [["Oat latte", "4.50"], ["Hot chocolate", "3.00"], ["Croissant", "3.25"], ["Good mood", "FREE"]].forEach(([a, b], i) => {
        const y = 280 + i * 62;
        const l = el("text", { x: 960, y, "font-family": "Nunito", "font-weight": 800, "font-size": 32, fill: "#F4F1EA", "dominant-baseline": "central" }, board); l.textContent = a;
        const r = el("text", { x: 1420, y, "text-anchor": "end", "font-family": "Nunito", "font-weight": 800, "font-size": 32, fill: i === 3 ? "#F2D28A" : "#F4F1EA", "dominant-baseline": "central" }, board); r.textContent = b;
      });
    }
    Set.table(bg, 380, 180, G); Set.table(bg, 640, 160, G);
    return { G, door, carSlot, counter: () => { Set.counter(counterL, 1100, 760, G); return Set.espressoMachine(counterL, 1700, G); } };
  }
  window.EP1 = { cafe };
})();
