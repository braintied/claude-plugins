# Stage 5 · Composition

Goal: pages built from the brief, direction, identity and images, where every section
earns its place.

## Plan the page as a story first

Before code, write the section list with one sentence each of what it must make the
visitor believe. A landing page that converts usually runs:

1. **Hero:** who it's for and what changes, in the brief's own words, plus the one
   action. The image or demo shows the moment *after*.
2. **The problem as they live it:** the "today" from the brief, specific.
3. **How it works:** three steps max, shown, not listed.
4. **Proof:** only real proof (a quote you actually have, a number you can source, the
   founder's story). No invented testimonials. If there is none yet, use the founder's
   "why us" instead.
5. **The action again**, with what happens after they click.

Cut any section whose sentence repeats another. Shorter is usually better.

## Show the product, don't describe it

If there's a product, recreate a small piece of the real interface in code (a card, a
message, a booking slot) and let it animate through the one moment that matters.
Label illustrative data as illustrative.

No product yet? Recreate the *thing the customer will hold*: the slip in the parcel,
the ticket, the signed check sheet. Label it in the world's own words ("Specimen",
"Example slip") and leave out any number from the brief's **Can't claim yet** line; a
field can say how the number will be measured instead.

## Build rules

- **Layout follows the direction's page form**, not a template. If the direction is "a
  menu on a chalkboard", the page can be a single column with ruled lines. Avoid the
  default: a centered hero over three identical cards with icons. Avoid the second
  default too: every section split into a small label on the left and content on the
  right. Use that split once at most.
- **The action appears twice** (hero and the end), so the form must work in a narrow
  column as well as full width: switch it to a row by its own width (`@container` on the
  wrapper, `@xl:flex-row` on the form), not the viewport's, and give its inputs ids from
  `useId()` so the two copies don't share ids.
- **Spacing from one scale** (4, 8, 12, 16, 24, 32, 48, 64, 96, 128). Generous space
  between sections; tight within them.
- **Type from the stage 3 scale only.** At most three sizes per section.
- **The brand color only on the main action** and the invariant.
- **Motion with a reason:** one entrance per section at most, 200–400ms, ease-out.
  With `prefers-reduced-motion`, everything lands on its final frame, never hidden.
- **Mobile first:** design at 375px wide, then widen. No horizontal scroll ever.
- **Accessible:** real headings in order, `alt` text, visible focus states, 44px tap
  targets, and every animated demo has an `sr-only` sentence saying what it shows.
- **Fast:** hero image with `priority`, everything else lazy; no animation library
  unless it earns its weight.

## Check

Run the project's check command (CLAUDE.md lists it), then open every changed page at
375px and 1280px, light and dark, and look at each section. Then go to stage 6.
