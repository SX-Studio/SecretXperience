# Short 02 (3D) — The Christmas Truce, 1914

The same script, voice and soundtrack as `../short02-christmas-truce/`, rebuilt as a **real 3D world** at **60 fps** (1080×1920, 51.8 s), so the two versions can be compared directly.

## What changed from the 2D version
- **World:** three.js scene (toon shading, 3-step light ramp), with the trenches, sandbag parapets (about 2,000 instanced bags), duckboards, plank revetments, barbed wire, craters, sky dome, stars and moon. Both trench lines run on for hundreds of metres, so the aerial "for miles" shot is real geometry.
- **Ink lines:** a custom post-pass that finds edges from the depth (Laplacian of inverse depth) and normal buffers and draws them in ink. It fades with distance and depth of field, as in the comic-ink style we studied.
- **Depth of field:** a 24-tap gather in the same pass, focused on the camera's look target. Characters always stay sharp because they are SVG.
- **Characters:** the same 2D rig (light skin, thin limbs), projected into the 3D world every frame:
  - scaled by distance and depth-sorted with the other cards (candles, trees, the tin, the cross, notes);
  - clipped behind parapets and the HQ table by projected occluder edges;
  - facing worked out from their world direction;
  - lit with an inner rim plus a tint that changes with the scene's light (moon, candle, warm, lamp, artillery red).
- **Light tells the story:**
  - candles light up in time with the audio ticks, and real point lights spill onto the sandbags;
  - in the aerial shot, the truce spreads down both lines as a wave of candle glow;
  - 1915 gets snow and red artillery flashes synced to the booms;
  - the ending: *one* candle lights ("Somebody goes first"), its neighbours follow, then the British line answers, and the camera cranes up to show both lines glowing.
- **Camera:** 3D keyframes with smootherstep glides and creeping holds. There are only two hard cuts (HQ, and 1915). The 1915 shot has flip-shakes that decay.

## Files
- `short02-3d-60fps.mp4` — the render.
- `project/index.html` — the whole composition (three.js world + SVG overlay + HUD).
- `project/assets/` — the shared engine files are in the 2D project. `t.js` (timings) is copied here.

Facts as in the 2D version: Christmas 1914 truce along parts of the Western Front; candles and trees on German parapets; carols traded; men met in no-man's-land, swapped cigarettes, food and buttons, buried the dead together, and in some accounts played football (one account: a tin of bully beef as the ball); commanders ordered shelling in 1915 to prevent a repeat.
