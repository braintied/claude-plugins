# Stage 6 · Critique

Goal: look at the real page like a demanding art director, fix what's off, and repeat
until it passes.

## Look

Shoot every page beside the references:

```bash
pnpm add -D playwright && pnpm exec playwright install chromium   # once
node "<shots script>" --site http://localhost:3000 --pages /,/how-it-works,/join --tag pass1
```

It writes the first screen and full page of every page at 390 and 1440, light and dark,
shoots each reference in `references.json` at the same widths, and builds
`docs/brand/shots/pass1/compare.html`: this site's first screens beside the references.
It also prints signals per page (how much of the first screen is picture, the scale
contrast, the longest run of text-only sections, full-bleed frames, animations seen,
sideways scroll) and flags any below the floor. A flag is a fact to fix; passing every
signal proves nothing about the verdict below.

For detail, also screenshot each section on its own (element screenshot) with the
playwright MCP or your browser tool. A full-page shot of a phone layout is 10,000
pixels tall and shrinks to unreadable when you view it; keep it as the record, don't
judge from it. Set the theme with the browser's color-scheme emulation
(`prefers-color-scheme`), not by editing tokens. Look at the pictures, not the code.

Critique against `pnpm dev`, which reloads on save. If you use a production build
(`pnpm build && pnpm start`), stop the old server first: a second `start` on a busy port
fails quietly in the background and the old server keeps serving pages that no longer
match the build. After each fix, confirm the screenshot shows the changed text before
judging it.

## First: designed or generated?

Before any mechanics, open `compare.html` and answer in writing, in `critique.md`:

1. **Would a stranger believe a designer made this?** Yes or no, in one sentence each
   way. "Clean" and "fine" are no.
2. **The three things that most make it look generated**, named by element: "the
   three grey tier cards", "every section starts with a heading on the left",
   "nothing on the first screen but type". Each must be specific enough to fix.
3. **What the reference does that this page doesn't**: the scale contrast, the
   photograph's light, the density, the one bold move.

4. **Costume or building?** Lay this site's home page beside the starter's, or beside
   the last site you made. If the boxes line up (same hero split, same section bands,
   same widths) and only the colours and fonts changed, it's a costume. The direction
   has to change what is huge and what is small, where pictures sit, and how a section
   is built.

Then score the art direction, 1 to 5 each, with the element that earns the score:

| | 1 is | 5 is |
|---|---|---|
| **World** | could be any company | unmistakably this world on every first screen |
| **Signature** | nothing only this product would do | one mechanism a visitor would describe to a friend |
| **Pictures** | one photo in a column | a set from one shoot, full size, carrying sections |
| **Graphics** | none, or boxes | the object and motif drawn, used on every page |
| **Motion** | none, or the same fade everywhere | the plan's two or three motions, each with a reason |
| **Type** | one size of everything | a display step that owns the first screen; quiet text |
| **Copy** | could be on a competitor's site | the world's own words, a headline you'd quote |

Any score under 3 is a fix before mechanics. Fix the three worst, re-shoot with a new
tag, and ask question 1 again. Only a yes and no score under 3 moves on. If it's still
no after two rounds, the direction or the image set is the problem: go back to stage 2
or 4, not to another round of spacing.

**Retake verbs.** Name each fix as one move, so the next pass can tell whether it
worked: *bolder* (bigger scale jumps, more contrast, the picture larger), *quieter*
(fewer things competing, one accent), *typeset* (fix the scale and rhythm), *arrange*
(spacing and alignment), *distill* (cut a section, a line, an element). If the person
has the Impeccable skills installed, these are its commands.

## Score against the files, not taste in the abstract

For each section, answer with the specific element named:

1. **Direction:** does it feel like `direction.md`'s world? Which refusal does it break?
   Would it fit a competitor just as well?
2. **The rejected first idea:** has the page drifted back to it?
3. **First glance:** squint. What does the eye land on first? Is that the right thing?
4. **Hierarchy and rhythm:** sizes from the scale, spacing from the scale, alignment on
   a consistent edge.
5. **Copy:** in the voice? Specific? Any of: unlock, seamless, revolutionize, elevate,
   empower, cutting-edge, game-changer, "in today's fast-paced world"? Cut them. Grep
   for them and for the direction's banned words and `!`:
   `grep -niE "unlock|seamless|revolution|elevate|empower|cutting-edge|game-changer|!" src/app/page.tsx`
   (add the direction's own banned words; JSX like `{!x}` will match, so read each hit). Check every number on the page against
   the brief's **Can't claim yet** line.
6. **AI tells, by name:** centred everything; purple-blue gradients and gradient text;
   glowing accents on a dark page; glass cards without a reason; floating 3D shapes;
   three identical feature cards with icons or emoji; pill clusters, stat strips, icon
   rows, badges on the hero picture; a "live" dot; shadows on everything; cards that
   still make sense with their border, shadow and radius removed (then they shouldn't
   be cards); a photograph in one half of a two-column hero; every headline the same
   length; every section the same label-left/content-right split; Inter, Roboto or the
   system font as a choice; objects in a photo lined up like a product shot.
7. **Mobile:** anything cramped, overflowing, or too small to tap?
8. **Accessibility:** contrast, focus states, alt text, reduced motion.

9. **Every page, not just home.** Each page in `site-plan.md` against its section jobs:
   does each section do its job, and does it look like its pattern's recipe rather than
   its "not this"? Check the share image (`/opengraph-image`), the icon, the 404 and the
   privacy page too.
10. **Motion:** does the signature mechanism work at 390 as well as 1440, with a touch
    scroll? Shoot again with `--reduced`: every motion sits on its finished frame,
    nothing loops, nothing is hidden, smooth scroll is off. Read the `sr-only`
    sentences aloud: do they say what the product does? Scroll the home page fast on a
    phone-sized window: any stutter, any frame that loads late?

## Fix and repeat

Fix the three worst problems, re-screenshot, and show before/after side by side. Repeat
until a pass finds nothing above "minor". Record what was found and fixed in
`docs/brand/critique.md`, so the next session doesn't reintroduce it.

## Done means

The person looks at it on their own phone and says it feels like theirs, and,
looking at `compare.html`, nobody would guess which page took a day to make.
