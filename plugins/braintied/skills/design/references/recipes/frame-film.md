# frame-film: a pinned stack of stills played as a film

**When:** Process and time worlds: one day, one recipe, one journey, told in 4-8 stills with a timestamped caption each. The reader controls the pace by scrolling.

**File:** `src/components/motion/frame-film.tsx`

## Component (as tested)

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MOTION_OK } from "./motion-root";

export type Frame = { src: string; alt: string; caption: string };

/**
 * A pinned section that plays 4-8 stills as a film: each frame crossfades in while the
 * one under it keeps a slow push-in, and the caption advances with it. The stacked
 * layout lives in CSS under motion-safe, so reduced motion gets a plain vertical
 * sequence with no JS involved and no layout jump when JS arrives.
 */
export function FrameFilm({ frames, title }: { frames: Frame[]; title: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ phone: `${MOTION_OK} and (max-width: 767px)`, wide: `${MOTION_OK} and (min-width: 768px)` }, (ctx) => {
        const shots = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-shot]"));
        const caps = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-cap]"));
        const perFrame = ctx.conditions?.phone ? 55 : 90; // % of viewport scrolled per frame
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            pin: true,
            // GSAP turns pin spacing off when the pinned element's parent is a flex
            // container (a <main className="flex flex-col"> is), and the next section
            // slides over the film. Say it explicitly.
            pinSpacing: true,
            scrub: 0.5,
            start: "top top",
            end: `+=${frames.length * perFrame}%`,
            anticipatePin: 1,
          },
        });
        shots.forEach((shot, i) => {
          tl.fromTo(shot.querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 1.4 }, i);
          if (i === 0) return;
          tl.fromTo(shot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, i - 0.2);
          tl.to(caps[i - 1], { autoAlpha: 0, yPercent: -40, duration: 0.25 }, i - 0.2);
          tl.fromTo(caps[i], { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 0.25 }, i - 0.05);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={title} className="relative text-on-image motion-safe:h-svh motion-safe:overflow-hidden">
      <ol className="motion-reduce:space-y-1 motion-safe:absolute motion-safe:inset-0">
        {frames.map((f, i) => (
          <li
            key={f.src}
            data-shot
            className={`motion-reduce:relative motion-reduce:h-[70svh] motion-safe:absolute motion-safe:inset-0 ${
              i > 0 ? "motion-safe:invisible motion-safe:opacity-0" : ""
            }`}
          >
            {/* Lab placeholders are data: URIs; a real site passes art-directed stills. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.src} alt={f.alt} className="h-full w-full object-cover will-change-transform" />
            <p className="absolute inset-x-0 bottom-0 bg-linear-to-t from-scrim to-transparent px-4 pt-16 pb-6 text-lg motion-safe:hidden md:px-16 md:text-2xl">
              {f.caption}
            </p>
          </li>
        ))}
      </ol>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-linear-to-t from-scrim to-transparent px-4 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] motion-safe:block md:px-16 md:pb-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em]">{title}</p>
        {/* Every caption in one grid cell: the box is as tall as the tallest caption, so
            one that wraps on a phone never runs into the title above it. */}
        <div className="mt-3 grid items-end text-lg leading-snug md:text-3xl">
          {frames.map((f, i) => (
            <p key={f.src} data-cap className={`max-w-[36ch] [grid-area:1/1] ${i > 0 ? "invisible opacity-0" : ""}`}>
              {f.caption}
            </p>
          ))}
        </div>
      </div>
    </section>
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

The stacked-vs-sequence layout is all Tailwind `motion-safe:` / `motion-reduce:` variants; no extra CSS.

## Reduced motion

No pin, no timeline. CSS lays the frames out as a vertical sequence (70svh each, 4px apart) with each caption over its own frame. No JS involved, so no layout jump when JS arrives.

## Phone

`55%` of the viewport per frame on phone, `90%` on desktop (`gsap.matchMedia` conditions). The section is `h-svh`, not `vh`, so the iOS address bar cannot resize the pin mid-scroll. Caption block respects `env(safe-area-inset-bottom)`.

## Gotchas we hit

- Initial hidden state lives in CSS (`motion-safe:invisible opacity-0` on frames 2+), not in `gsap.set`, or the frames flash stacked before hydration.
- Each frame keeps pushing in (`scale 1.12 → 1` over 1.4 units) after the next one starts fading in; a scale that stops at the crossfade looks like a slideshow.
- Captions use `autoAlpha` so hidden ones leave the accessibility tree; the per-frame `<p>` captions are `motion-safe:hidden` so screen readers never hear duplicates.
- Measured: one frame over 50ms at 1440 during a fast wheel (p95 50ms in that run, 17ms in the first). The stand-ins were SVGs with `feTurbulence`, which are expensive to re-rasterize while scaling; real JPEG/AVIF stills cost less. Keep `will-change: transform` on the `<img>`.

**Not this:** Ken Burns zoom on every frame in the same direction, captions that fade in after the image settles, or more than 8 frames (the scroll distance becomes a chore).
