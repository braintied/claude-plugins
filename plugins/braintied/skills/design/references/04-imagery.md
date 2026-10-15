# Stage 4 · Imagery

Goal: a set of pictures that looks like one shoot by one photographer (or one
illustrator) in one world, big enough to carry every page, and none of it reads as AI.

A site with one hero photograph and two small extras still looks like a template with a
picture in it. The sites people remember are built *out of* their pictures. Plan the
set from the direction's **World layer** and **Art direction · Images** block.

## 1. Size the set from the world layer

| World layer | Set | Why |
|---|---|---|
| Photographic | 8–14 frames | Every page opens on a full-bleed frame, and sections change frame as you scroll |
| Film | 6–10 frames in order, one moment apart | The pinned sequence plays them like a film |
| Object | 2–4 frames plus the object drawn in code | The object leads; photographs place it in the world |
| Field or typographic | 0–4 frames | The field or the type is the picture; photographs are breaths between |

Plus the cutouts the composition needs (an object with a transparent background to lay
over a page), and phone crops for every full-bleed frame (step 4).

**No OpenAI key?** Don't stop the person to make one mid-session. Choose one: their own
photos in `public/images/` (judged against the refusals the same way), a typographic
page where the direction's page form carries it with no photography, or imagery later.
Write which in `docs/brand/images.md`.

Plan frames the model can draw. Hands *operating a mechanism* (squeezing a brake lever,
turning a key, typing) fail most often: the hand ends up beside the part, not on it. Show
the object, the result, or hands doing something broad (pressing flat, holding, cutting).

## 2. Write the set as one file: `docs/brand/prompts.json`

Every prompt is three parts, so the world is written once and every frame shares it:

- **meta** (60–90 words, the same for every frame): the place, the hour, the light and
  where it comes from, the film or medium, the palette from materials in the world.
- **main** (40–120 words, one per frame): this frame only. The first 50 words carry the
  picture: shot size and subject first ("Close, waist height: a woman's hands lifting
  the lid off the top tier"), then the moment, where things are in the frame (thirds,
  room for type), the one formal device it carries, and it ends with **one named
  imperfection** on its own line: `Imperfection: one tier dented near the clasp.`
- **lock** (the same for every frame): closing constraints said as what *is* there,
  not what isn't ("muted natural colour, real materials, grain visible in the
  shadows"), the palette again in three words, and "no text, letters or logos in frame".

Each frame also says what it's for (`use`), its `device`, its `size` and its `out` path.
The format is at the top of `<image-set script>`. Write `docs/brand/images.md` in prose
beside it: the constants, the one axis that varies across the set, and which frame goes
where on which page.

**One anchor frame.** Pick the frame that best shows the world (usually the home page's
first screen). It is made first and judged before the rest.

**A recurring object** (the product, a carrier, a slip) drifts between frames when it's
described in words each time. Make it once (a clean frame or a reference sheet), then
list that file in later frames' `refs`; describe it there in 2–3 details only. More than
three details fights the reference and consistency drops.

**Cutouts:** `"background": "transparent"` with a `.png` out and no scenery in the
prompt ("the steel carrier alone, three-quarter view, soft shadow under it"). Use it for
objects that sit on the page itself or move over sections. Transparent output is reliable
with a reference image (gpt-image-2.5-sunburst); check the alpha before using it.

## 3. What makes images look generated (avoid in every prompt)

- Everyone smiling at the camera; perfect skin and teeth. Prefer the moment *after*.
- Centered subject on a blurred bokeh background.
- Glowing, teal-and-orange, neon, bloom, lens flare, or purple-gradient lighting.
- Floating devices, holograms, particles, abstract "network" shapes.
- Text inside the image (add text in code instead).
- Words like "stunning", "8k", "ultra-detailed", "hyperrealistic", "award-winning".
- Identical objects in a neat row or grid ("six mackerel side by side"). Say how they
  were put down instead: "tipped in loosely so they overlap", "left where he dropped them".
- Perfect symmetry, plastic surfaces, oversaturated colour.

## 4. Audit, sample, then the set

```bash
node "<image-set script>"                         # writes prompts/<id>.txt, prints the plan and cost
node "<audit script>" docs/brand/prompts/*.txt    # free; fix what it flags
node "<image-set script>" --generate --sample 2 --budget 3   # the anchor and one more
```

Show the person the plan with its cost, then the two samples. Only when the anchor is
right does the rest of the set get made (`--generate --budget <amount>`), several at a
time. A wrong anchor fixed now costs one frame; found after the set, it costs the set.

| Size | `high` (default) | `xhigh` (finals) |
|---|---|---|
| `1536x1024` landscape, `1024x1536` portrait | about $0.04 | about $0.07 |
| `1024x1024` square | about $0.05 | about $0.09 |
| `2560x1440` wide hero (bigger frames scale by pixels) | about $0.10 | about $0.17 |

A photographic site of 12 frames at `high` is about $0.50–1.20. The script prints the
real cost of every frame and keeps a running total in `docs/brand/images.json`.

**Phone crops.** A 3:2 frame shown full-screen on a phone shows about a third of its
width. For each full-bleed frame either set `object-position` on the subject (fine when
the subject sits in the middle third), or make a portrait version (`1024x1536`, same
main, "framed tall, subject in the upper middle") and serve it with `<picture>`.

## 5. Judge the set

Open every frame. Then put them side by side (a contact sheet, or the folder in a grid
view) and judge the *set*, not the frames:

- **One world:** do they look like one shoot? If one frame's light or colour is off,
  it's the one to retake, however good it is alone.
- **Not one picture repeated:** if they all share the same distance and angle, vary the
  shot size (wide, middle, close) across the set.
- Against the direction's refusals and the lock.

Retake by changing **one** line of `main` at a time, so you know what fixed it
(`--generate --only <id>`; every take is kept in `docs/brand/takes/<id>/` with its
prompt). Two takes of the same frame with the same fault means the plan is wrong, not
the prompt: replace the frame with one the model can draw.

Then fill each frame's `describes` line in `images.json` from what you actually see. It
becomes the `alt` text.

Use images with `next/image` (`sizes` set for full-bleed: `100vw`), `priority` on the
first screen's image only, and a token colour as the background while it loads.
