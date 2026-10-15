# Depth

**When:** any world layer. Three small scroll effects declared by attribute, so pages stay server components: the first screen's picture pushes in as you leave it, the words on it lift away faster, and one oversized line settles as it's read.

**File:** `src/components/depth.tsx`, mounted once per page (tested on the Tiffin site).

| Attribute | Does | Use on |
|---|---|---|
| `data-zoom` | the element scales 1 → 1.1 while its section scrolls away | the first screen's `<picture>` (give it `origin-[x_y]` on the subject) |
| `data-depth="35"` | lifts 35% faster than the page, desktop only | the words on a full-bleed photograph |
| `data-settle` | from small, loose and faint to set, scrubbed as it's read | one line of type at poster size per page |

```tsx
"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MOTION_OK } from "./motion/motion-root";

// Scroll depth for a page, by attribute, so server components stay server components:
//   data-zoom      the element's picture pushes in as its section leaves (1 → 1.1)
//   data-depth="n" the element lifts n% faster than the page while its section passes
//   data-settle    oversized type settles from loose and small to set, as it's read
// Mount once per page. Reduced motion: nothing moves; everything is at its final frame.
export function Depth() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>("[data-zoom]").forEach((el) => {
        gsap.to(el, {
          scale: 1.1,
          ease: "none",
          scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: true },
        });
      });
      // Words lifting off a photograph only make sense where they sit on it (desktop).
      const wide = window.matchMedia("(min-width: 768px)").matches;
      gsap.utils.toArray<HTMLElement>("[data-depth]").filter(() => wide).forEach((el) => {
        gsap.to(el, {
          yPercent: -Number(el.dataset.depth ?? 20),
          ease: "none",
          scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-settle]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.72, letterSpacing: "0.08em", opacity: 0.35 },
          {
            scale: 1,
            letterSpacing: "-0.02em",
            opacity: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 95%", end: "center 55%", scrub: 0.8 },
          },
        );
      });
    });
  });
  return null;
}
```

## Gotchas

- `data-depth` on a phone moves words that sit *under* the photograph, not on it, into the picture. It's desktop-only for that reason.
- `data-settle` with `letter-spacing` can push a poster-size line past the edge at the start; give its section `overflow-hidden` and set `origin-left`.

**Not this:** parallax on every image. One push-in, one lift, one settle per page.
