# kinetic-headline: masked line rise + scroll-lit statement

**When:** Voice-led worlds: a manifesto, a founder's line, a one-sentence promise. One headline per page rises on load; one oversized statement per page lights up as it is read.

**File:** `src/components/motion/kinetic-headline.tsx`

## Component (as tested)

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { MOTION_OK } from "./motion-root";

gsap.registerPlugin(SplitText);

/**
 * Headline whose lines rise out of a mask on load. The text is real DOM text; SplitText
 * puts an aria-label on the heading and aria-hides the line wrappers. CSS hides the
 * heading only under motion-safe until the split lands (see [data-split] in globals.css).
 */
export function KineticHeadline({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true, // re-splits when fonts load or the width changes
        onSplit: (self) => {
          el.dataset.splitReady = "";
          // Returning the tween lets autoSplit revert and rebuild it at the same progress.
          return gsap.from(self.lines, { yPercent: 110, duration: 0.85, ease: "expo.out", stagger: 0.09 });
        },
      });
      return () => split.revert();
    });
  });

  return (
    <>
      <noscript>
        <style>{"[data-split]{visibility:visible!important}"}</style>
      </noscript>
      <h1 ref={ref} data-split className={className}>
        {children}
      </h1>
    </>
  );
}

/**
 * Oversized statement whose words light up one by one as it crosses the viewport.
 * Reduced motion: the split never happens, every word stays at full strength.
 */
export function ScrubStatement({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const split = SplitText.create(el, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          // clamp() keeps the end reachable when the statement sits near the bottom of the page.
          scrollTrigger: { trigger: el, start: "top 85%", end: "clamp(bottom 55%)", scrub: true },
        },
      );
      return () => split.revert();
    });
  });

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
```

## CSS

```css
/* globals.css */
@media (prefers-reduced-motion: no-preference) {
  [data-split]:not([data-split-ready]) { visibility: hidden; }
}
/* Line masks clip at the line box; tight leading cuts descenders. */
[data-split-ready] > * { padding-block: 0.12em; margin-block: -0.12em; }
```

## Reduced motion

No split happens at all, so the heading and statement are plain DOM text at full opacity from the first paint. The hide-until-split rule is scoped to `no-preference`, and the `<noscript>` style un-hides it when JS is off.

## Phone

Lines re-split on width change (`autoSplit: true`), and because `onSplit` returns the tween, a rotation mid-animation resumes at the same progress instead of restarting.

## Gotchas we hit

- Without the hide-until-split rule the server-rendered headline paints, then vanishes and rises. That flash is the single most "vibe-coded" tell.
- `leading-[0.92]` with `mask: "lines"` clipped the descenders of g and y even at rest. The padding/negative-margin pair above fixes it without moving the text.
- The statement's first `end: "bottom 45%"` was past the maximum scroll, so it never fully lit. `end: "clamp(bottom 55%)"` keeps the end reachable.
- SplitText `aria: "auto"` (default) puts `aria-label` on the heading and `aria-hidden` on the line wrappers; verified the label equals the sentence.
- Fonts: `autoSplit` re-splits after `document.fonts` loads, so lines break on Geist, not the fallback.
- Measured: p95 frame 17ms, 0 frames over 50ms at both widths.

**Not this:** Per-character staggers on a headline, bounce or back easing, or lighting up every paragraph on the page. One rise, one lit statement.
