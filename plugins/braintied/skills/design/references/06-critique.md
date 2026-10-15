# Stage 6 · Critique

Goal: look at the real page like a demanding art director, fix what's off, and repeat
until it passes.

## Look

With the playwright MCP (or the browser tool you have), screenshot at 375×812 and
1280×800, in light and dark: the first screen as the viewport shows it, then each
section on its own (element screenshot). A full-page shot of a phone layout is 10,000
pixels tall and shrinks to unreadable when you view it; keep it as the record, don't
judge from it. Set the theme with the browser's color-scheme emulation
(`prefers-color-scheme`), not by editing tokens. Look at the pictures, not the code.

Critique against `pnpm dev`, which reloads on save. If you use a production build
(`pnpm build && pnpm start`), stop the old server first: a second `start` on a busy port
fails quietly in the background and the old server keeps serving pages that no longer
match the build. After each fix, confirm the screenshot shows the changed text before
judging it.

## First: designed or generated?

Before any mechanics, put the first screen of each page beside the references from the
brief (screenshots or photos of them; take them now if you don't have them) and answer
in writing, in `critique.md`:

1. **Would a stranger believe a designer made this?** Yes or no, in one sentence each
   way. "Clean" and "fine" are no.
2. **The three things that most make it look generated**, named by element: "the
   three grey tier cards", "every section starts with a heading on the left",
   "nothing on the first screen but type". Each must be specific enough to fix.
3. **What the reference does that this page doesn't**: the scale contrast, the
   photograph's light, the density, the one bold move.

Fix those three before anything in the list below, then ask question 1 again. Only a
yes moves on to mechanics. If the answer is still no after two rounds, the direction or
the image set is the problem: go back to stage 2 or 4, not to another round of spacing.

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
6. **AI tells:** centered everything, gradient blobs, glass cards without a reason,
   three identical feature cards with emoji, stock-feeling images, every headline the
   same length, every section the same label-left/content-right split, objects in a
   photo lined up like a product shot.
7. **Mobile:** anything cramped, overflowing, or too small to tap?
8. **Accessibility:** contrast, focus states, alt text, reduced motion.

9. **Every page, not just home.** Each page in `site-plan.md` against its section jobs:
   does each section do its job, and does it look like its pattern's recipe rather than
   its "not this"? Check the share image (`/opengraph-image`), the icon, the 404 and the
   privacy page too.
10. **Motion:** with `prefers-reduced-motion: reduce` emulated, every demo sits on its
    finished frame, nothing loops, nothing is hidden. Read the `sr-only` sentences
    aloud: do they say what the product does?

## Fix and repeat

Fix the three worst problems, re-screenshot, and show before/after side by side. Repeat
until a pass finds nothing above "minor". Record what was found and fixed in
`docs/brand/critique.md`, so the next session doesn't reintroduce it.

## Done means

The person looks at it on their own phone and says it feels like theirs.
