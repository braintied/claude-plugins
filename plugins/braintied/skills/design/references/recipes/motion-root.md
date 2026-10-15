# motion-root: Lenis + GSAP + ScrollTrigger, one provider

**When:** Every page world that uses any recipe below. Mount once in `src/app/layout.tsx`; every other recipe assumes it (it registers ScrollTrigger and exports `MOTION_OK`).

**File:** `src/components/motion/motion-root.tsx`

## Component (as tested)

```tsx
"use client";

import "lenis/dist/lenis.css";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Use as the condition for every scrub, pin and entrance in the app. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * One instance in the root layout. Renders nothing, so the tree stays server-rendered.
 * Lenis drives the native scroll position; GSAP's ticker drives Lenis; every Lenis
 * scroll tells ScrollTrigger to update. Reduced motion: Lenis never starts.
 */
export function MotionRoot() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lenis = new Lenis({ autoRaf: false, anchors: true, stopInertiaOnNavigate: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });
    return () => mm.revert();
  }, []);
  return null;
}
```

## CSS

`lenis/dist/lenis.css` is imported by the component. Mount it in the root layout as a sibling, not a wrapper:

```tsx
// src/app/layout.tsx
import { MotionRoot } from "@/components/motion/motion-root";
// ...
<body className="min-h-full flex flex-col font-sans">
  <MotionRoot />
  {children}
</body>
```

## Reduced motion

`gsap.matchMedia()` only starts Lenis under `(prefers-reduced-motion: no-preference)`. Flip the OS setting live and Lenis is destroyed and lag smoothing restored. Every recipe wraps its scrubs in `mm.add(MOTION_OK, ...)`, so reduced motion means native scroll and no scrubs anywhere.

## Phone

Lenis leaves touch scrolling native by default (`syncTouch: false`). Keep it that way: synced touch fights iOS momentum. Wheel and trackpad get the smoothing.

## Gotchas we hit

- It renders `null` and reads no request data, so every route stays static (`○`) under Cache Components. No `usePathname`, no `Suspense` needed.
- `autoRaf: false` is required when GSAP's ticker drives Lenis; with both running you get two rafs per frame and drifting scrubs.
- `gsap.ticker.lagSmoothing(0)` is required, or a slow frame makes scrubs jump. Restore `lagSmoothing(500, 33)` in cleanup.
- `anchors: true` makes `<a href="#id">` scroll through Lenis, and it respects `scroll-margin-top` (measured: section landed exactly under a 46svh sticky header). `stopInertiaOnNavigate: true` stops a fling carrying into the next route.
- Client navigation was tested: triggers from the previous route are killed (0 pin-spacers after leaving), scroll resets to 0, no console errors.

**Not this:** Lenis with `lerp` turned way down so the page feels like it is skating. Default inertia is the ceiling, not the floor.
