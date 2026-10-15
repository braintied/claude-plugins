# Stage 2 · Direction and art direction

Goal: decide what world the site lives in, and then how that world shows up in four
things: the pictures, the graphics, the motion and the words. This is the stage that
separates a designed site from a generated one, and the one people most want to skip.

A direction that stops at "a feeling and some refusals" still produces a quiet page
with one photo and tidy type: correct, and forgettable. The sites people remember
commit to a world that fills the whole page and one mechanism that only this product
could have. Decide both here, in writing, before any colour or font.

## 1. Write the first idea down, then kill it

Write the obvious direction in one line ("clean, modern, minimal, blue"). That's what
every AI site already looks like. Keep it in the file as **Rejected first idea** so later
stages can check they haven't drifted back to it. If what you keep is the first idea in a
new costume (the same page with warmer colours), you haven't directed yet.

## 2. Find the world

A direction is a *feeling* plus *refusals*, grounded in something real:

- **Feels like:** a place, object, or moment, not adjectives. "A handwritten menu
  chalked outside a beach café at 8am" beats "warm and friendly". Reach outside
  websites: a material, a trade's own paperwork, weather, a ritual, a time of day.
- **Not like:** the nearest generic version, named. "Not a food-delivery app."
- **Refusals (3–7):** things this site will never do. Concrete enough to check on a
  screenshot: "no gradients", "no stock photos of laptops", "no centered paragraphs".
- **Invariant:** the one thing true on every page.

Offer the person two or three distinct worlds, a paragraph each. Let them pick or mix.

## 3. References that each govern one thing

Open the references from the brief (`docs/brand/references.json`) and look at them
before writing. Then give each one a job: the single thing it decides, and nothing else.

- Right: "That studio's portfolio site, governs how one full-bleed photograph dissolves
  into the next; nothing else." "A railway timetable, governs how facts are set: fixed columns, times first."
- Wrong: "Like Aesop's site." (Which part? A name is not a decision.)

Add a `governs` line to each entry in `references.json`. Stage 6 screenshots them beside
the site with `<shots script>`, so pick references whose first screen shows the thing
they govern. At least one must be a live website at the bar you're aiming for.

## 4. The world layer: what fills the page

Pick one. It decides the engines stage 5 declares and the size of the image set in
stage 4.

| World layer | What the visitor sees | Good for | Engines |
|---|---|---|---|
| **Photographic** | Every section on a full-bleed photograph from one shoot; frames dissolve into each other as you scroll | Places, food, trades, anything physical | `css`, `gsap`, `scroll` |
| **Film** | A pinned sequence: scrolling plays a run of frames (stills or video) like a film, captions advancing | A process with stages, a day, a journey | `gsap`, `scroll` |
| **Object** | The product's own object, built in code, carries the page: it opens, unstacks, fills in as you scroll | Products with a physical thing at the centre (a carrier, a ticket, a card) | `css`, `gsap`, `scroll` |
| **Field** | A drawn field behind everything (points, lines, a pattern) that takes the shape of the argument as you scroll | Systems, data, networks, anything abstract | `canvas2d`, `scroll` |
| **Typographic** | Type at poster scale is the image: oversized words, kinetic headlines, a grid you can feel | Manifestos, publishing, a product whose point is a sentence | `css`, `gsap` |

Most sites combine two (photographic plus an object, typographic plus a field). Say
which leads. "Typographic" alone is the hardest to make look designed; choose it only
when the type idea is strong enough to carry a stranger's first screen.

## 5. The signature mechanism

One moment on the site that only this product could have, written as one sentence that
names what moves and what it proves:

- "The steel carrier unstacks tier by tier as you scroll; each tier is one step of the
  service." (The product *is* the navigation.)
- "The field of points gathers into the logo's centre node and stays warm while the rest
  turns cool: one person inside an automatic system."
- "The day's frames play from 6:30 at the market to the parcel on your counter."

Then the test: delete the sentence's product name and give it to a competitor. If it
still works for them, it isn't a signature. One mechanism, not three; everything else
stays quiet so it lands.

## 6. Art direction: four systems

Write one short block for each. Later stages build to these blocks; stage 6 checks them.

- **Images:** the shoot. Where and when (one place, one hour), the light (source and
  direction), the film or medium, the palette from materials in the world, what varies
  across the set (one axis), and the formal device frames may use (a horizon in the
  lowest eighth, a long-exposure blur, shadow across the subject). If the world layer is
  photographic or film, plan for a set of 8–16 frames, not a hero and two extras.
- **Graphics:** what is drawn in code: the object (with which parts), rules and frames,
  a pattern or texture from the world (a woven grid, a stamp, a chalk line), icons if
  any and in what hand. Name the one graphic motif that recurs.
- **Motion:** the character in one line ("heavy and settled, like steel set down";
  "quick and exact, like a ticket punch"), the signature mechanism, and what moves on
  entry (one thing per section, at most). Durations come from the character: settled
  is 600–900ms with a long ease-out; exact is 150–250ms.
- **Copy:** the voice with one right and one wrong sentence, the words this world uses
  that outsiders don't (its lexicon: "tiers", "the 1 pm run", "the slip"), the words it
  never uses, and the headline rule ("headlines are times and places", "headlines are
  instructions, never claims").

## 7. Colour ownership

Decide how much of the page the brand colour owns, from the world: "laterite red owns
the action and the 1 pm mark only" or "chalk-white on slate owns 60% of every page". A
quiet brand colour is a choice; a timid one is a default. Write it as a percentage or a
list of places.

## Write `docs/brand/direction.md`

```markdown
# Direction

**Rejected first idea:** <the obvious one>
**Worlds offered:** <the two or three you offered, one line each, and which was chosen>
**Feels like:** <the world>
**Not like:** <the generic neighbor>
**Refusals:** <3–7 checkable rules>
**References:** <name> governs <one thing> (full list in references.json)
**Invariant:** <the thing on every page>
**Page form:** <the object the page is built like: a menu card is one ruled column, a
timetable is a table, a job card is a numbered checklist>
**World layer:** <which leads, which supports, and the engines that need>
**Signature mechanism:** <one sentence: what moves and what it proves>
**Light / dark:** <what each theme is in this world: "light is the carbon copy in your
hand, dark is the workshop at night">
**Colour ownership:** <where the brand colour goes, or how much of the page it owns>

## Art direction
**Images:** <place, hour, light, medium, palette, the varying axis, formal devices, set size>
**Graphics:** <the object and its parts, the recurring motif, rules/frames/texture>
**Motion:** <character in one line; durations; what enters; the signature>
**Copy:** <voice>. Right: "<sentence>" Wrong: "<sentence>". Lexicon: <words>. Never: <words>. Headlines: <rule>.
```

## Check before moving on

- Swap in a competitor's name. If the direction or the signature still fits them, it's
  too vague.
- Is any refusal impossible to check by looking at a page? Rewrite it until it isn't.
- Does the chosen world differ from the rejected first idea in more than colour?
- Does the page form come from the world? "Label on the left, content on the right" for
  every section is a template, not a form.
- Picture the first screen from this file alone. If what you picture is a headline
  beside a photo, the world layer isn't doing its job yet.
- Every sentence should die if moved to another project. Cut the ones that wouldn't.
