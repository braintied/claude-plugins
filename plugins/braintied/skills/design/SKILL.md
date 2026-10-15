---
name: design
description: Take an idea from a sentence to a bespoke, art-directed website in six stages — brief, direction and art direction, identity, imagery, composition, critique — with a full image set, drawn graphics, scroll motion and a signature moment, judged side by side against real reference sites, so the result looks designed rather than generated. Use when someone wants to design or redesign a site or landing page, says their site "looks like AI made it", "looks generic", or asks for a brand, a look, or a homepage.
---

# Design

Sites look generic when nobody decided what they should feel like, so every choice
defaulted to the safest option. Safe is generic. This pipeline forces the decisions, in
order, and writes each one down so every later step (and every later session) reads it.

## The bar

Aim for a site that could sit in a design gallery next to the references the person
chose, not a tidy landing page. In practice that means: a world that fills every first
screen, pictures from one art-directed set used at full size, drawn graphics from the
world, two or three motions with a reason (one of them a signature only this product
could have), type with real scale contrast, and copy in the world's own words. A page
that is correct, clean and quiet fails this bar. Stage 6 holds the result against the
references, screenshot beside screenshot, and scores it.

## The six stages

Run them in order. Each stage reads the files the earlier ones wrote. Show the person
the result of each stage and get a yes before the next; their taste is the point.

**Short on time** (a workshop day): ask for one yes after stages 1–2 together and one
after 3–4 together (show the image plan, its cost and the two sample frames before the
rest of the set). Never skip the yes before money is spent or before code is written.
Short on time cuts approvals, never the bar: the set, the motion plan and the
side-by-side critique still happen.

| # | Stage | Reads | Writes | Reference |
|---|---|---|---|---|
| 1 | Brief | the person | `docs/brand/brief.md` | [01-brief](references/01-brief.md) |
| 2 | Direction and art direction | brief, references | `docs/brand/direction.md`, `references.json` | [02-direction](references/02-direction.md), [reference-sites](references/reference-sites.md) |
| 3 | Identity | direction | tokens in `globals.css`, `docs/brand/identity.md` | [03-identity](references/03-identity.md) |
| 4 | Imagery | direction, identity | `docs/brand/prompts.json`, `public/images/*`, `docs/brand/images.md` | [04-imagery](references/04-imagery.md) |
| 5 | Composition | all of the above | `docs/brand/site-plan.md`, every page and the site essentials | [05-composition](references/05-composition.md), [motion-recipes](references/motion-recipes.md), [05b-site-essentials](references/05b-site-essentials.md), [product-demo](references/product-demo.md) |
| 6 | Critique | the running site, the references | fixes + `docs/brand/critique.md`, `docs/brand/shots/` | [06-critique](references/06-critique.md) |

The stage 4 image script lives at `${CLAUDE_SKILL_DIR}/scripts/generate-image.mjs`.
Use that exact path; the reference files call it `<image script>`. The palette check
is `${CLAUDE_SKILL_DIR}/scripts/contrast.mjs` (`<contrast script>`).

Helper scripts, all in `${CLAUDE_SKILL_DIR}/scripts/`, run from the project folder:

| Script | Stage | What it does | Needs |
|---|---|---|---|
| `name-score.mjs` (`<name script>`) | 3 | Ranks name candidates; obvious names sink | `pnpm add -D @braintied/naming` |
| `contrast.mjs` | 3 | Contrast of every token pair, light and dark | nothing |
| `audit-prompt.mjs` (`<audit script>`) | 4 | Checks image prompts before money is spent | `pnpm add -D @braintied/prompt-craft` (3.1.0+) |
| `image-set.mjs` (`<image-set script>`) | 4 | Composes every prompt from `prompts.json`, prices the set, makes it in parallel, keeps every take | `OPENAI_API_KEY` in `.env.local` |
| `shots.mjs` (`<shots script>`) | 2, 6 | Screenshots every page beside the references, with the signals | `pnpm add -D playwright` |
| `generate-image.mjs` | 4 | One image, with its cost | `OPENAI_API_KEY` in `.env.local` |
| `patterns.mjs` (`<patterns script>`) | 5 | The section-pattern catalog: what a section can be | `pnpm add -D @braintied/site-engine` |

Each script says the install command if its package is missing.

After stage 2 is approved and `docs/brand/direction.md` is written, log the Academy
milestone (optional and quiet; show its one line of output, if any):
`node "${CLAUDE_SKILL_DIR}/../learn/scripts/academy.mjs" signal design_direction_written`

Read the stage's reference file before starting that stage. Don't skip ahead: a page
composed before the direction exists will be the generic page.

**Gates that don't bend, even when the person approves everything up front:**

- Stage 5 doesn't start until every image in `images.md` exists in `public/images/`.
  Never compose around a placeholder ("image not generated yet", a grey box, a dashed
  frame). If the person won't spend on images, go back to stage 4 and re-plan the set
  as drawn objects, type and product demos, then compose to that plan.
- Stage 4 makes the anchor frame (and one more) before the rest of the set, and the
  person sees them before the set is paid for.
- Stage 5 writes each page's first screen and the motion plan (the signature mechanism,
  the page-level motion) into `site-plan.md` before code. A site with no motion plan is
  the static template again.
- Stage 6 opens with the "designed or generated?" verdict and the art-direction scores
  (see 06) before any mechanics, from `compare.html`, not from memory. A page that
  passes every mechanical check can still look made in five minutes.

## Starting points

- **Nothing yet:** start at 1.
- **"Make it look better":** read `docs/brand/` if it exists. If `direction.md` is
  missing, do 1–2 before touching code, even when it feels slower. It's faster than
  three rounds of "still not right".
- **Just one stage** ("new hero image", "critique my page"): run that stage, but read
  `docs/brand/direction.md` first. If it doesn't exist, say so and offer stage 2.

## Rules that hold in every stage

- Decisions get written to `docs/brand/`; CLAUDE.md's "The brand" section gets a
  two-line summary and a link.
- Colors and fonts only as tokens in `src/app/globals.css`.
- Phone and desktop together, light and dark together. Never "I'll do mobile later".
- Real words from the brief, never lorem ipsum, never invented numbers or testimonials.
  Anything in the brief's **Can't claim yet** line stays off the page, or appears only
  inside something labelled *Example* or *Specimen*.
- Explain each choice in one plain sentence ("serif headings because the direction says
  'a letter from a friend', not 'a SaaS dashboard'"). The person is learning to see.

## Optional companions

The [Impeccable](https://impeccable.style) skill pack (`/polish`, `/typeset`,
`/arrange`, `/critique`, `/audit`…) pairs well with stage 6. Install it from its own
source if the person wants it; this plugin doesn't bundle it.
