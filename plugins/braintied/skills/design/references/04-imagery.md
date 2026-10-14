# Stage 4 · Imagery

Goal: photographs and illustrations that belong to this direction and don't read as AI.

## Plan the set before generating anything

List every image the site needs (hero, 2–4 section images, social share image at
1536×800). For the whole set decide:

- **Constant:** what stays the same in every image (light, palette, lens, grain,
  setting). This is what makes them look like one shoot.
- **Varying:** the one thing that changes (subject, moment, distance).

Write the plan to `docs/brand/images.md` and show the person before spending money.

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
Common: `1536x1024` (landscape), `1024x1536` (portrait), `1024x1024`. About $0.05 each
at the default quality.

## Judge every result

Open each image and check it against the direction's refusals and the constants. Retake
by changing **one** line of the prompt at a time, so you know what fixed it. Two bad
retakes in a row means the plan is wrong, not the prompt: go back to the set plan.

Use images with `next/image`, real `alt` text describing what's in them, and `priority`
on the hero only.
