# Motion recipes

Tested code for the world layers and signature mechanisms in stage 2, on the idea-to-mvp
starter (Next.js 16.4 with Cache Components, Tailwind v4 tokens), GSAP 3.15.0 (free,
including ScrollTrigger and SplitText), @gsap/react 2.1.2 and Lenis 1.3.26. Each passed
`pnpm check` and a Playwright pass at 390 and 1440, with and without
`prefers-reduced-motion: reduce`: no sideways scroll, no console errors, reduced motion
resting on the finished frame.

```bash
pnpm add --save-exact gsap@3.15.0 @gsap/react@2.1.2 lenis@1.3.26
```

| Recipe | World layer | What it does |
|---|---|---|
| [motion-root](recipes/motion-root.md) | all | One provider in the root layout: Lenis on GSAP's ticker feeding ScrollTrigger; reduced motion turns it all off. Every other recipe needs it. |
| [photo-bands](recipes/photo-bands.md) | photographic | Full-bleed photographs that dissolve into each other through a mask, with a slight scrubbed parallax and a scrim token for text. |
| [frame-film](recipes/frame-film.md) | film | A pinned stack of 4–8 stills played as a film by scrolling, captions advancing per frame; reduced motion is a plain sequence. |
| [kinetic-headline](recipes/kinetic-headline.md) | typographic | Headline lines rise out of masks on load; an oversized statement lights up word by word as it is read. |
| [point-field](recipes/point-field.md) | field | Canvas 2D points sampled from words or a shape, re-forming between them as the section scrolls. No three.js. |
| [object-stack](recipes/object-stack.md) | object | The product object is the navigation: its parts separate one per section and link to it. |
| [scroll-instrument](recipes/scroll-instrument.md) | any | A small instrument (a clock, an altimeter, a count) reads the page as a journey toward the promise, and changes state when it arrives. |
| [depth](recipes/depth.md) | any | By attribute: the first picture pushes in, the words on it lift away, one poster-size line settles as it's read. |

**Every pin sets `pinSpacing: true`.** GSAP switches pin spacing off by default when the
pinned element's parent is a flex container, and the starter's pages are
`<main className="flex flex-col">`: the film stays pinned while the next section slides
over it, and the page comes out thousands of pixels too short. Found on a real site
after the recipe passed in a lab route whose parent wasn't flex.

Mount `motion-root` first, then at most two others per page: the signature and the
page-level motion. Every recipe checks the same reduced-motion flag from
`motion-root.tsx`.

These are starting points. Adapt them to the direction (the object's real parts, the
world's durations); don't paste them in unchanged. A recipe used as-is on every site
becomes the new template.
