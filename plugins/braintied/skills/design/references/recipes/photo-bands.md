# photo-bands: full-bleed photographs that dissolve into each other

**When:** Place-led worlds: a neighbourhood, a kitchen, a route, a venue. The story is told by three to five photographs at full width with one line each. Not for product UI or feature lists.

**File:** `src/components/motion/photo-bands.tsx`

## Component (as tested)

```tsx
"use client";

import { useRef } from "react";
import { getImageProps } from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MOTION_OK } from "./motion-root";

export type Band = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  alt: string;
  desktop: { src: string; width: number; height: number };
  phone: { src: string; width: number; height: number };
};

function BandPicture({ band, eager }: { band: Band; eager: boolean }) {
  const loading: "eager" | "lazy" = eager ? "eager" : "lazy";
  const common = { alt: band.alt, sizes: "100vw", loading };
  const desktop = getImageProps({ ...common, ...band.desktop }).props;
  const { srcSet: phoneSet, ...img } = getImageProps({ ...common, ...band.phone }).props;
  // Unoptimized sources (data: URIs, SVG) come back with no srcSet; src is the only candidate.
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop.srcSet ?? desktop.src} />
      <source media="(max-width: 767px)" srcSet={phoneSet ?? img.src} />
      <img {...img} alt={band.alt} className="h-full w-full object-cover" />
    </picture>
  );
}

/**
 * Full-bleed photograph bands. Each band after the first overlaps the previous one by
 * --overlap and fades in through a mask, so the photographs dissolve into each other.
 */
export function PhotoBands({ bands }: { bands: Band[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        root.current?.querySelectorAll<HTMLElement>("[data-band-media]").forEach((media) => {
          gsap.fromTo(
            media,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: media.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="[--overlap:22svh] md:[--overlap:30svh]">
      {bands.map((band, i) => (
        <section
          key={band.id}
          aria-labelledby={`${band.id}-title`}
          className={`relative isolate h-[88svh] overflow-hidden md:h-[110svh] ${
            i > 0 ? "-mt-(--overlap) [mask-image:linear-gradient(to_bottom,transparent,black_var(--overlap))]" : ""
          }`}
          style={{ zIndex: i + 1 }}
        >
          <div data-band-media className="absolute inset-x-0 -inset-y-[12%] -z-10 will-change-transform">
            <BandPicture band={band} eager={i === 0} />
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-linear-to-t from-scrim to-transparent" />
          <div className="flex h-full flex-col justify-end px-4 pb-[calc(var(--overlap)+3rem)] text-on-image md:px-16 md:pb-[calc(var(--overlap)+4rem)]">
            <p className="font-mono text-xs uppercase tracking-[0.3em]">{band.kicker}</p>
            <h2 id={`${band.id}-title`} className="mt-3 max-w-[14ch] text-5xl leading-[0.95] font-semibold tracking-tight md:text-8xl">
              {band.title}
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed md:text-lg">{band.body}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
```

## CSS

```css
/* globals.css :root (light) — dark block overrides --scrim and --steel* */
--scrim: color-mix(in oklab, #08080c 64%, transparent);
--on-image: #f6f4ef;
/* @theme inline */
--color-scrim: var(--scrim);
--color-on-image: var(--on-image);
```

Usage: pass each band a desktop (landscape, ~1600x1000) and a phone (portrait, ~800x1400) crop. Real photographs go in `public/` and are optimized by Next. (Data-URI or SVG stand-ins get no `srcSet`, so the `<source>` falls back to `src`.)

## Reduced motion

No parallax; the cross-dissolve is a static mask, not motion, so it stays. Text and scrim are identical.

## Phone

Bands are 88svh (110svh desktop), overlap 22svh (30svh desktop). The `<source media>` swap serves the portrait crop below 768px; do not let `object-cover` crop a landscape photo to a sliver.

## Gotchas we hit

- `getImageProps()` returns no `srcSet` for unoptimized sources (data: URIs, SVG), so `<source srcSet={undefined}>` silently serves nothing art-directed. Fall back to `src` as shown.
- `<img>` directly inside `<picture>` passes `@next/next/no-img-element`; outside a picture it does not.
- The media layer is `-inset-y-[12%]` so `yPercent ±8` never reveals an edge (8% of 124% is under 12%). Make the overlap and the inset agree if you change either.
- Text sits above `var(--overlap)` from the bottom, otherwise the next band dissolves over the paragraph.
- Each band needs an increasing `zIndex`; the later band must paint over the earlier one for the mask to dissolve.
- Measured: p95 frame 17ms at 390 and 1440 during wheel scroll, 0 frames over 50ms.

**Not this:** Hard horizontal seams between photos, a black 40% overlay on every image instead of a bottom scrim, or parallax past ±10% (it reads as a template).
