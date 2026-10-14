---
name: design
description: Take an idea from a sentence to a beautiful, intentional website in six stages — brief, direction, identity, imagery, composition, critique — so the result looks decided rather than generated. Use when someone wants to design or redesign a site or landing page, says their site "looks like AI made it", "looks generic", or asks for a brand, a look, or a homepage.
---

# Design

Sites look generic when nobody decided what they should feel like, so every choice
defaulted to the safest option. Safe is generic. This pipeline forces the decisions, in
order, and writes each one down so every later step (and every later session) reads it.

## The six stages

Run them in order. Each stage reads the files the earlier ones wrote. Show the person
the result of each stage and get a yes before the next; their taste is the point.

| # | Stage | Reads | Writes | Reference |
|---|---|---|---|---|
| 1 | Brief | the person | `docs/brand/brief.md` | [01-brief](references/01-brief.md) |
| 2 | Direction | brief | `docs/brand/direction.md` | [02-direction](references/02-direction.md) |
| 3 | Identity | direction | tokens in `globals.css`, `docs/brand/identity.md` | [03-identity](references/03-identity.md) |
| 4 | Imagery | direction, identity | `public/images/*`, `docs/brand/images.md` | [04-imagery](references/04-imagery.md) |
| 5 | Composition | all of the above | the pages | [05-composition](references/05-composition.md) |
| 6 | Critique | the running site | fixes + `docs/brand/critique.md` | [06-critique](references/06-critique.md) |

The stage 4 image script lives at `${CLAUDE_SKILL_DIR}/scripts/generate-image.mjs`.
Use that exact path; the reference files call it `<image script>`.

After stage 2 is approved and `docs/brand/direction.md` is written, log the Academy
milestone (optional and quiet; show its one line of output, if any):
`node "${CLAUDE_SKILL_DIR}/../learn/scripts/academy.mjs" signal design_direction_written`

Read the stage's reference file before starting that stage. Don't skip ahead: a page
composed before the direction exists will be the generic page.

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
- Explain each choice in one plain sentence ("serif headings because the direction says
  'a letter from a friend', not 'a SaaS dashboard'"). The person is learning to see.

## Optional companions

The [Impeccable](https://impeccable.style) skill pack (`/polish`, `/typeset`,
`/arrange`, `/critique`, `/audit`…) pairs well with stage 6. Install it from its own
source if the person wants it; this plugin doesn't bundle it.
