# Episode 3 sets brief: "How Money Actually Works, Explained With One Sandwich"

You are one of three agents building the 3D sets for an ~8-minute animated YouTube episode (1920×1080, 30 fps). The episode is for the channel **Social Ripple** (subtly therapeutic, warm, funny).

The story takes place on **Crumb Island**: a tiny, cute island town with 200 people, one bank, and the best sandwich shop in the ocean. Characters are flat 2D SVG cut-outs, drawn by the director's code, standing in a real 3D world. You build **only 3D sets and props**, in **your own file**. Do not edit any other file.

## The engine (read it first)
- Main project: `/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/hf/videos/sr-ep03/`.
- `assets/sr3d.js` is the engine. Read all of it.
- `index.html` is a working minimal test scene. Copy its structure.
- three.js r158 is loaded as a global UMD (`window.THREE`). There are no ES modules and no addons (no GLTFLoader).
- **Everything is procedural.** Geometry comes from three primitives; textures come from `W3.tex(w, h, draw)` (canvas 2D) or `W3.label(text, {...})` for signs. Never load any external file.
- **Determinism:**
  - No `Math.random`. Use `SR.mulberry32(seed)`.
  - No `Date`, no `requestAnimationFrame`.
  - All animation must be a pure function of the time `t` passed to your `update(t, env)`.
- **Look (matches the reference style we measured):**
  - Toon shading: `W3.toon(color, map)` uses a 3-step ramp. Ink outlines are drawn automatically by the engine's post-pass from depth and normal edges, so model **clear, chunky shapes with real geometric edges** (bevel-like steps, trims, window frames, planks), not flat painted detail.
  - Saturated, warm, cheerful pastel palette:
    - walls: coral `#F4A28C`, mint `#9FD8C2`, butter `#F6D77A`, sky `#8EC3E8`, lilac `#C7B3E6`, cream `#F2E6C8`;
    - roofs: terracotta `#C8553D` / teal `#2F8F8A`;
    - wood `#9A6A44`, sand `#F2D9A0`, grass `#7DBA5A`, sea `#2FA7B8`.
  - **No pure black** anywhere (darkest is about `#1E1B22`).
  - Hand-painted textures are welcome when drawn on canvas: plank gaps, cobbles, roof tiles, wood grain, brick. They are the difference between "premium" and "cheap".
- **Glows** (lamps, windows at night, string lights): emissive materials (`W3.toon(c, null, {emissive, emissiveIntensity})`) plus optional `W3.glow(color, size, x, y, z)` sprites (layer 1, additive).
- **Budget:**
  - Use `InstancedMesh` for repeated things (cobbles, planks, tiles, bulbs, palm leaves).
  - Keep each set under about 150k triangles and about 250 draw calls.
  - Rendering is software WebGL on CPU, so be frugal.
- **Units:** metres, Y up. A character is 1.75 m tall. Doors are about 2.2 m high and 1.2 m wide. Counters are 1.05 m and desks 0.78 m high.
- **Text on signs:** use `W3.label(...)`, which waits for the web font `Outfit` (900 weight). Your test page must include this, so the font loads:
  `<div id="fontwarm" style="position:absolute;left:-9999px;font-family:Outfit;font-weight:900">Aa<b style="font-family:Nunito">Aa</b></div>`

## Your module contract
Write exactly one file, `assets/<your-file>.js`:

```js
(function () {
  window.EP3 = window.EP3 || {};
  window.EP3.<name> = function (W3) {      // called once at build time
    const THREE = W3.TH;
    // ...build meshes with W3.add / W3.box / W3.toon / W3.tex / W3.label ...
    return {
      anchors: { /* named world positions the director needs, e.g. moDoor: {x,y,z} */ },
      occ: [ /* optional occluders for characters standing behind counters/desks (see sr3d.js clipFor) */ ],
      update(t, env) { /* env: { night: 0..1, boom: 0..1, bust: 0..1, ...set-specific } */ },
      // plus any set-specific controls documented below
    };
  };
})();
```

The director's code calls your `update(t, env)` every frame. The `env` values change smoothly over time, so your update must be cheap: no geometry rebuilds per frame, only changes to visibility, scale, material colour/intensity, texture offsets, or `needsUpdate` on a small canvas texture.

**Lights:** the director owns global lighting (sun, hemisphere, fog, sky). You may add **local** `PointLight`s (at most 3 per set, with a `distance` set so they stay local), and you must scale their intensity with `env.night`.

## Test, and measure
Work in **your own copy** of the project. Copy the main project directory (without `renders/` and `snaps*`) to `.../hf/videos/sr-ep03-<name>/`. Then make its `index.html` load your file and show your set with a camera path of 3–6 keyframes that visits every important angle, lit like the main scene (copy the lights from the main `index.html`). Add a night variant: set `env.night = 1` for part of the test timeline, and change the sky and lights accordingly (night sky, for example `W3.skyCol("#0B1030", "#1C2A5A", "#4A4A7A")` with `W3.stars.material.opacity = 1`).

Render stills with:
`/root/.npm/_npx/702923228c2ce1e6/node_modules/.bin/hyperframes snapshot --at 0.5,1.5,... --no-end -o snaps` (run it inside your copy, with `</dev/null`). Then **look at the PNGs** with your image-reading tool.

Iterate until the set looks premium: bold silhouettes, clear ink edges, rich hand-painted textures, no z-fighting, no floating objects, no pure black, and readable signs. Check at least 8 stills, including a wide, a close-up at character eye height (camera y about 1.6), and a night still.

When you finish, leave your final file at `.../hf/videos/sr-ep03-<name>/assets/<your-file>.js`. Write `NOTES.md` next to it with:
- the anchors and controls;
- the triangle and draw-call estimate;
- the paths of your 4 best stills.

Your final reply must summarize the API, the anchors and any known limitations.
