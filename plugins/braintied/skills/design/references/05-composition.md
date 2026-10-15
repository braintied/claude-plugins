# Stage 5 · Composition

Goal: a whole site, not one page, built from the brief, direction, identity and images,
where every page and every section has a job and looks like it was decided.

A site looks like a template for one reason more than any other: nothing described what
a *section* could be, so every section became the same band of centred type, or the same
label-left/content-right split. A site looks *generated* for a second reason: nothing
on it was art-directed. One photograph, tidy type, nothing moves, every section the
same width. This stage fixes both: every section gets a written job and a named
pattern, and every page gets the direction's world layer, its pictures at full size,
and its signature mechanism, before any code.

## 1. Plan the site: `docs/brand/site-plan.md`

### Pages

A product that isn't live yet usually needs these. Cut what the brief doesn't support;
add what it does.

| Page | Its job |
|---|---|
| `/` Home | Who it's for, what changes for them, the one action. |
| `/how-it-works` | The mechanism in enough detail that a sceptic believes it could work. |
| A page for the other side | The people the product also depends on: the cooks, the cafés, the mechanics. They have different questions. |
| `/questions` | The real objections, answered in full, on the page (not hidden in accordions). |
| `/join` | The action on its own, and exactly what happens after. |
| `/privacy` | What the waitlist stores, why, and how to be removed. Short and true. |
| `not-found` | A 404 that is still in the world. |

Every page also needs what is in [05b-site-essentials](05b-site-essentials.md) (titles,
share image, icon, sitemap). Do those as you build each page, not at the end.

### First screens

Write each page's first screen before its sections, as one composition:

- **One dominant visual, full width or close to it**: a stage 4 frame, the object, the
  field. Not a photograph in one half of a two-column grid; that is the template hero.
- **The brand in the first screen is unmistakable.** Cover the nav and ask whether the
  first screen could belong to another company. If yes, the world layer isn't on it yet.
- **The budget:** the wordmark, one headline at the display step, one sentence, the
  action, and the visual. Nothing else: no feature list, no stat strip, no badges.
- **Scale contrast:** on desktop the headline is at least five times the body size.
- The headline can sit *on* the picture (with the scrim token for contrast) or be the
  picture (typographic world). Don't box it.

### The motion plan

From the direction's **Motion** block, write in `site-plan.md`:

- **The signature mechanism**, where it lives (which page, which section), what drives it
  (scroll position, time on load, the pointer), and its reduced-motion frame.
- **The page-level motion** the world layer needs: frames dissolving as you scroll
  (photographic), a pinned sequence (film), the object coming apart (object), the field
  re-forming (field), headlines resolving (typographic).
- **Entrances:** one per section at most, from the direction's durations.

Two or three intentional motions per page is the target: the signature, the page-level
motion, quiet entrances. More than that and nothing lands. None at all and the page
reads as unfinished next to the references.

The engines and tested code for each are in [motion-recipes](motion-recipes.md).

### Sections

For each page, list its sections in order. Each line has three parts:

```markdown
## /how-it-works
1. **Job:** make the 6:30 market run feel real and specific · **Pattern:** numbered-rail-explainer · **Content:** the three times, what happens at each
2. **Job:** answer "how do I know it's fresh?" · **Pattern:** objection-answer-pair · **Content:** ...
```

- **Job** is what the section must make the visitor believe or do, in one sentence. Not
  "Features" or "How it works": "defuses the 'is it fresh' doubt". A section named for
  what it contains drifts into a feature list within three edits; a section named for
  its job stays an argument.
- **Pattern** comes from the section-pattern catalog in `@braintied/site-engine`. List it
  with `node "<patterns script>" --engines css` (install once with
  `pnpm add -D @braintied/site-engine`), then read the full notes for the ones you pick
  with `--id <pattern>`. Each pattern gives a build recipe with real numbers, the
  constraints, what a reviewer checks, and what it must *not* become. Declare the
  engines the direction's **World layer** names and install them first: photographic,
  film and object worlds use `--engines css,gsap,scroll` (`pnpm add gsap @gsap/react
  lenis`); a field adds `canvas2d`; a purely typographic page can stay `css,gsap`. A
  pattern that needs an engine you didn't declare shows as blocked. Don't declare an
  engine to unlock a pattern you won't build properly: a scroll pattern with its motion
  half-done reads as broken.
- **Content** is the actual words and data, from the brief. Anything on the brief's
  **Can't claim yet** line is out, or appears only inside something labelled *Example*.

Read a pattern's recipe through this project's identity:

- **Its numbers are proportions, not sizes.** A recipe's "4rem to 8.5rem display" means
  "much bigger than the body"; map it onto the nearest step of the stage 3 scale. If a
  page needs one size bigger than the scale has, add a single display step to the scale
  in stage 3 and use it everywhere, rather than a one-off size in one section.
- **"Mono" in a recipe means the label role**: small, tracked uppercase in the text
  face, unless stage 3 chose a mono face. Don't add a third family for a label.
- **"Accent" or "brand" in a recipe means ground and ink** unless the direction lets the
  brand colour go beyond the action and the invariant. A two-tone image in ground and
  ink often fits the world better anyway.

Then apply the direction's **Page form** on top: the pattern says what the section
does, the page form says what it looks like in this world (a ledger in a menu card is
set as a menu; in a station board, as a timetable).

Rules for the plan:

- No two sections on a page use the same pattern, and no single layout repeats on more
  than two sections of the site. Page openers and closes are exempt: inner pages open
  with the page form's own head (the card's header, the board's first strip) and end on
  the same close, because the invariant puts the action on every page.
- **Records, before launch:** a recipe that asks for facts "traceable to a real record"
  (a fact rail, a ledger) can use method facts the founder decides (when it is booked,
  where it is measured, who is paid). Numbers, customers and results cannot.
- **A role with no usable pattern** (the listing shows only blocked ones, as `close`
  does on `css`): compose a still one and write its recipe in the plan. A still close is
  one statement, the action, and nothing else in the band.
- **The page form's frame counts as the bleed edge.** A pattern that asks for full bleed
  bleeds to the card or board edge when the page form is a framed object.
- **Not every section needs a pattern.** If none fits, write the section's own recipe in
  the plan. A forced fit is worse than an honest one-off. Essentials pages (`/privacy`,
  the 404) and the action page (`/join`) need none: their job is plain.
- **The close band and the form:** a close pattern that forbids fields (as
  `magnetic-close` does) ends on a link to `/join`; otherwise the form sits in the
  close. Pick one per page.
- **Answer patterns stack.** Put the question above its answer, never in a column to its
  left; that is the label-left default again.
- Cut any section whose job repeats another's. Shorter wins.
- Evidence patterns (`attributed-review-wall`, `credential-strip`) need real records. A
  product with none uses the founder's "why us" or a `specimen-ledger` of the method
  instead, never invented proof.

Show the plan to the person before building. This is where "make it better" is cheap.

## 2. Write the words with a tournament

For the hero headline, the home page's first sentence and each page's first line,
don't write one version:

1. Write five versions in the direction's voice, each taking a different angle.
2. Judge each against three readers: **the sceptic** (which claim can't they believe?),
   **the first user from the brief, tired, on their phone** (which one would they stop
   scrolling for?), and **a competitor** (which one could they also say? that one loses).
3. Keep the winner and steal one phrase from the runner-up. Note the losers in
   `site-plan.md` so nobody rewrites the same weak line later.

Before writing, read ten headlines on [H1 Gallery](https://h1gallery.com): short,
concrete, one turn. Write in the direction's **Copy** block: its lexicon (the world's
own words), its headline rule, and none of its banned words. A headline that would make
sense on a competitor's site loses, however well it reads.

## 3. Show the product, don't describe it

If there's a product, recreate a small piece of the real interface in code and let it
play through the one moment that matters. The mechanics (CSS steps played once by one
observer, resting on the finished frame) are in [product-demo](product-demo.md).

No product yet? Recreate the *thing the customer will hold*: the slip in the parcel,
the ticket, the signed check sheet. Label it in the world's own words ("Specimen",
"Example slip") and leave out any number from **Can't claim yet**; a field can say how
the number will be measured instead. It can still move: a ticket being stamped, boxes
being ticked one by one, as long as it rests on its finished frame.

## Every page has something to look at

- **Pictures at the size of the page.** Full-bleed frames carry whole sections; adjacent
  frames can dissolve into each other through a mask instead of meeting at a hard edge
  (recipe in [motion-recipes](motion-recipes.md)). A photograph at a third of the page
  width is an illustration of the text; at full width it is the world.
- **The graphic kit is used**, not just defined: the motif from stage 3 appears on every
  page, and the object (if there is one) is drawn at a size you can read its parts.
- **Text on pictures** sits on a scrim (add a `--scrim` token: the ground colour at
  40–70%, as a gradient from the text's side) so it reads in both themes. The contrast
  script can't see a photograph; judge it in the stage 6 screenshots, at phone width.

- **The first screen of every page has one dominant visual:** a photograph from stage 4,
  the product object or demo, or a drawn object from the world. Never a grey box, a
  dashed frame or an empty "image" area.
- **No more than two text-only sections in a row.** A text-only section is one with no
  photograph, object, demo, drawing, table or oversized type.
- **No grey cards.** A block of `bg-surface` boxes with a heading and two lines each is
  the template look, whatever the label says ("tiers", "steps", "features"). If the page
  form is an object (a carrier, a ticket, a card), draw the object; don't box text and
  call it the object.

## Build rules

- **Layout follows the pattern and the page form**, never a template. Avoid the two
  defaults: a centred hero over three identical cards with icons, and every section split
  into a small label on the left and content on the right.
- **Shared parts go in components** (`src/components/`): the header, the footer, the
  form, the invariant, the product object. A change to the header changes every page.
- **The header carries real navigation** once there is more than one page: the pages
  from the plan, the current page marked, and the one action. On a phone it must fit at
  375px without a hamburger if there are four links or fewer.
- **Marking the current page needs a Suspense boundary.** The starter turns on Cache
  Components, so a header that calls `usePathname()` in the layout fails `pnpm build`
  ("URL data in a Client Component outside of `<Suspense>`") while `pnpm dev` looks fine.
  Make the header take `path` as a prop; render
  `<Suspense fallback={<SiteHeader path={null} />}><SiteHeaderLive /></Suspense>` in the
  layout, where `SiteHeaderLive` is a two-line client component that passes
  `usePathname()` through. Always run `pnpm build` before calling a page done.
- **The action appears more than once**, so the form must work in a narrow column and
  full width: lay it out by its own width (`@container` on the wrapper, `@xl:flex-row`
  on the form), give inputs ids from `useId()`, and keep the button label on one line
  (`whitespace-nowrap`).
- **Spacing from one scale** (4, 8, 12, 16, 24, 32, 48, 64, 96, 128). Generous between
  sections; tight within them.
- **Type from the stage 3 scale only.** At most three sizes per section.
- **The brand colour goes where the direction's Colour ownership line says**, no further
  and no less.
- **Motion from the plan:** durations from the direction's motion character (exact:
  150–250ms; settled: 600–900ms, long ease-out such as `expo.out`; never bounce or
  elastic), exits shorter than entrances, and only on engines you declared. Under
  `prefers-reduced-motion: reduce` every motion lands on its final frame: GSAP work goes
  inside `gsap.matchMedia()` with a reduced branch, smooth scroll is off, CSS keyframes
  drop to near-zero duration. A reveal that hides content under reduced motion is a bug.
  Use `animation-fill-mode: backwards` for entrances, not `both`: a retained
  `both`/`forwards` animation on an ancestor stops `backdrop-filter` working underneath.
- **Mobile first:** design at 375px wide, then widen. No horizontal scroll ever.
- **Accessible:** one `h1` per page, headings in order, `alt` text that says what is in
  the picture, visible focus states, 44px tap targets, and every animated or decorative
  demo has an `sr-only` sentence saying what it shows.
- **Fast:** first-screen image with `priority`, everything else lazy. GSAP, ScrollTrigger
  and Lenis together are small; a canvas field starts after first paint, pauses when off
  screen, and draws less on a slow device. Nothing heavy on a phone that a still frame
  can do.

## Check

Run the project's check command (CLAUDE.md lists it), then open every page at 375px and
1280px, light and dark. Then go to stage 6.
