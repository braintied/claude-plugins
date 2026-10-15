# Stage 4 · Imagery

Goal: photographs and illustrations that belong to this direction and don't read as AI.

## Plan the set before generating anything

List every image the site needs (hero, 2–4 section images, social share image at
1536×800). For the whole set decide:

- **Constant:** what stays the same in every image (light, palette, lens, grain,
  setting). This is what makes them look like one shoot.
- **Varying:** the one thing that changes (subject, moment, distance).

Write the plan to `docs/brand/images.md` with its cost (sizes below), and show the person
before spending money. Two to four images are usually enough; when the direction is
typographic (a timetable, a ticket), fewer images and more type is the stronger page.
The social share image is optional on day one.

**No OpenAI key?** Don't stop the person to make one mid-session. Choose one: their own
photos in `public/images/` (judged against the refusals the same way), a typographic
page where the direction's page form carries it with no photography, or imagery later.
Write which in `docs/brand/images.md`.

Plan frames the model can draw. Hands *operating a mechanism* (squeezing a brake lever,
turning a key, typing) fail most often: the hand ends up beside the part, not on it. Show
the object, the result, or hands doing something broad (pressing flat, holding, cutting).

## Writing each prompt

Write it like a brief to a photographer, in this order:

1. **Shot:** subject, action, moment. Specific people doing a specific thing.
2. **Place:** where, time of day, what's around them.
3. **Camera:** lens and distance ("35mm, waist height, three metres back"), depth of
   field, framing (where the subject sits; leave room for text if it's a hero).
4. **Light:** the source and its quality ("low sun through a doorway, hard shadows").
5. **Craft:** film stock or medium ("Portra 400 grain", "risograph two-color"), palette
   tied to the tokens from stage 3.
6. **One imperfection, named:** a flyaway hair, a chipped cup, a slightly crooked
   horizon, dust in the light. Perfect is what makes AI images look like AI.

## What makes images look generated (avoid in every prompt)

- Everyone smiling at the camera; perfect skin and teeth.
- Centered subject on a blurred bokeh background.
- Glowing, teal-and-orange, or purple-gradient lighting.
- Floating devices, holograms, abstract "network" shapes.
- Text inside the image (add text in code instead).
- Words like "stunning", "8k", "ultra-detailed", "hyperrealistic" in the prompt.
- Identical objects in a neat row or grid ("six mackerel side by side"). The model
  arranges things like a product shot. Say how they were put down instead: "tipped in
  loosely so they overlap", "left where he dropped them".

## Audit before you spend

`node "<audit script>" docs/brand/prompts/*.txt` runs the anti-slop audit and flags
arranged-object phrasing and a missing imperfection line. Fix what it flags first; it
costs nothing.

## Generate

Run it from the project folder; `<image script>` is the full path given in the design
skill's SKILL.md. The script uses OpenAI's newest image model (`gpt-image-2.5-flare`)
and needs `OPENAI_API_KEY` in `.env.local`. The person adds it themselves (`pnpm keys`
in idea-to-mvp projects); never ask them to paste it in the chat.

```bash
node "<image script>" \
  --prompt-file docs/brand/prompts/hero.txt \
  --out public/images/hero.png \
  --size 1536x1024
```

Save each prompt as a `.txt` under `docs/brand/prompts/` so it can be rerun and
improved. Sizes: both edges multiples of 16, longest edge ≤ 3840, ratio ≤ 3:1.

| Size | Default quality (`high`) |
|---|---|
| `1536x1024` landscape, `1024x1536` portrait | about $0.04 |
| `1024x1024` square | about $0.05 (more tokens than landscape) |

The script prints the tokens and the cost of every image; add them up in `images.md`.
Each image takes about 20–25 seconds, so generate the whole set at once (one command per
image, run in parallel) rather than one after another.

Before a retake, copy the prompt to `<name>.v1.txt` so the one changed line shows in a
diff.

## Judge every result

Open each image and check it against the direction's refusals and the constants. Retake
by changing **one** line of the prompt at a time, so you know what fixed it. Two bad
takes of the same frame (the first and one retake) with the same fault means the plan is
wrong, not the prompt: replace the frame in the set plan with one the model can draw, and
keep the rejected take in `docs/brand/rejected/` with one line on why.

Use images with `next/image`, real `alt` text describing what's in them, and `priority`
on the hero only.
