---
name: brand-to-tokens
description: Turn brand guidelines (a palette, fonts, a logo, or a pasted guidelines doc) into design tokens in the project's global stylesheet, so every page picks up the brand. Use when someone shares brand colors or fonts, a logo, or says "apply my brand". For a brand that doesn't exist yet, use /design instead.
---

# Brand to tokens

1. Find the inputs: what the person pasted, a file they named, `docs/brand/identity.md`,
   or "The brand" in CLAUDE.md. If there's no palette, ask, or offer `/design` stage 3.
2. Find the token file: usually `src/app/globals.css` (`:root` variables mapped into
   Tailwind with `@theme inline`). Keep the existing token names; change the values:
   - `--brand`: the main action color. `--brand-ink`: text on top of it.
   - `--background`, `--surface`, `--foreground`, `--muted`, `--line`, `--danger`.
   If the project has no tokens yet, create this set and map it into Tailwind.
3. Write the dark-mode set in the `prefers-color-scheme: dark` block. Keep the hue,
   adjust lightness; don't invert.
4. Check contrast in both modes: `--foreground` on `--background` and `--brand-ink` on
   `--brand` must be ≥ 4.5:1. Report the ratios.
5. Fonts: load Google Fonts with `next/font/google` in the root layout and point
   `--font-sans` (and a heading variable if needed) at them.
6. Logo: put the file in `public/`, use it with `next/image` and real alt text.
7. Search components for hard-coded hex colors and replace them with token classes.
8. Update "The brand" in CLAUDE.md. Show the main page at phone and desktop width, in
   light and dark.
