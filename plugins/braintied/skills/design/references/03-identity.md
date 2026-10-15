# Stage 3 · Identity

Goal: name check, type, color, and mark, all derived from the direction and turned into
tokens the code reads.

## Name (if not settled)

Generate 20–30 candidates that fit the voice. Cut to five. For each finalist: check the
.com and one local TLD (Cloudflare Registrar search or `whois`), the main social handle,
and a quick trademark search (WIPO Global Brand Database, plus the national register
where they'll trade). Present the five with what's free. The person picks.

`whois` answers differ by registry: "No match" (.com), "is available for registration"
(.in), "No Data Found" (.work), and some new TLDs print nothing at all. Nothing printed
means *unknown*, not free; check those in a registrar's search. Write down in
`identity.md` what you checked, on which date, and what you didn't check.

## Type

Pick at most two families from Google Fonts (load with `next/font/google`): one for
headings, one for text, or one family doing both. Justify each against the direction in
one sentence. Set a scale with clear jumps (e.g. 14 / 16 / 20 / 28 / 40 / 64) and line
lengths of 55–75 characters for body text.

Check the exact family name before writing code; Google renames families (there is no
"Big Shoulders Stencil Display" any more, only "Big Shoulders Stencil"):

```bash
node -e 'const d=require(require.resolve("next/dist/compiled/@next/font/dist/google/font-data.json"));for(const f of process.argv.slice(1))console.log(f,d[f]?d[f].weights.join(","):"MISSING")' "Rozha One" "Newsreader"
```

Wire them through tokens, not class names. In `layout.tsx` give each font a
`variable` (`--font-display-face`, `--font-text-face`) and put both on `<html>`; in
`globals.css` under `@theme inline` map `--font-display: var(--font-display-face);` and
`--font-sans: var(--font-text-face);`. Remove the starter's Geist imports. Headings then
use `font-display`, everything else inherits `font-sans`. A variable family with a width
axis (Archivo, `axes: ["wdth"]`) can be one family doing both: condensed for headings,
normal for text.

## Color

Derive from the world (the chalkboard, the stone, the sea at 8am), not from "brand blue".

- One **brand** color reserved for the main action.
- Neutrals for background, surface, text, muted text, and lines, slightly tinted
  toward the brand hue instead of pure gray.
- A dark-mode set that keeps the hue and lightens it; don't just invert.
- Contrast: text on background ≥ 4.5:1; button text on brand ≥ 4.5:1. Report ratios;
  `node "<contrast script>" src/app/globals.css` prints every pair for light and dark
  (`<contrast script>` is `scripts/contrast.mjs` next to the image script).

Write them into the existing token names in `src/app/globals.css` (`--brand`,
`--brand-ink`, `--background`, `--surface`, `--foreground`, `--muted`, `--line`,
`--danger`) for light and dark. Add a token rather than ever hard-coding a hex.

## Mark

A wordmark set in the heading face (with one deliberate detail from the invariant) is
usually stronger than a generated symbol. If they want a symbol, write a prompt for it
with stage 4's script and treat the result as a sketch to redraw as SVG, not a final.

## Write `docs/brand/identity.md`

Name, domain, type choices with reasons, the palette (light and dark, with contrast
ratios), and how the mark is built. Put a two-line summary under "The brand" in
CLAUDE.md.

## Check

Open the current site with the new tokens at phone and desktop width, light and dark.
Does it already feel like the direction, before any layout change? If not, the palette
or type is wrong; fix it here, not later.
