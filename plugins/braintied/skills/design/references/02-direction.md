# Stage 2 · Direction

Goal: decide what world the site lives in before any color, font, or layout. This is
the stage that separates intentional work from generated work, and the one people most
want to skip.

## 1. Write the first idea down, then kill it

Write the obvious direction in one line ("clean, modern, minimal, blue"). That's what
every AI site already looks like. Keep it in the file as **Rejected first idea** so the
next stages can check they haven't drifted back to it.

## 2. Find the world

A direction is a *feeling* plus *refusals*, grounded in something real:

- **Feels like:** a place, object, or moment, not adjectives. "A handwritten menu
  chalked outside a beach café at 8am" beats "warm and friendly".
- **Not like:** the nearest generic version. "Not a wellness app with pastel blobs."
- **Refusals (3–7):** things this site will never do. Concrete enough to check:
  "no gradients", "no stock photos of laptops", "no centered paragraphs", "never more
  than two typefaces", "no exclamation marks".
- **Analogs (3–5):** real references from the brief and beyond. For each, the specific
  *move* you take from it, stated without its name: not "like Aesop's site" but "product
  photographed on raw stone with one hard shadow, lots of empty space around it". Also
  what you *avoid* from it.
- **Invariant:** the one thing true on every page (e.g. "one hand-drawn underline per
  page, always on the action").
- **Voice:** how the copy sounds, with one example sentence in that voice and one that
  is wrong.

Offer the person two or three distinct worlds, a paragraph each. Let them pick or mix.

## 3. Write `docs/brand/direction.md`

```markdown
# Direction

**Rejected first idea:** <the obvious one>
**Feels like:** <the world>
**Not like:** <the generic neighbor>
**Refusals:** <3–7 checkable rules>
**Analogs:**
- <move> — from <reference>; avoid <what>
**Invariant:** <the thing on every page>
**Voice:** <description>. Right: "<sentence>" Wrong: "<sentence>"
```

## Check before moving on

- Swap in a competitor's name. If the direction still fits them, it's too vague.
- Is any refusal impossible to check by looking at a page? Rewrite it until it isn't.
- Does the chosen world differ from the rejected first idea in more than color?
