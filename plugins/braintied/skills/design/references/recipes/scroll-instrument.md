# Scroll instrument

**When:** the product has a number that changes on its way to the promise: a time (a lunch at 1 pm), a height (a climb), a distance (a delivery), a count (stamps on a card). The page becomes the journey and a small instrument reads it out as you scroll. A second signature that costs one component.

**File:** `src/components/scroll-clock.tsx` (tested on the Tiffin site: Next 16.4, Cache Components, 390/1440, reduced motion)

The instrument writes its own text from a ScrollTrigger, so nothing re-renders. It runs from the top of the page to one marked element (`data-one-pm` here: the section where the promise lands) and changes state when it gets there (laterite red at 1:00). Reduced motion: it never appears; the page says the promise in words anyway.

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOTION_OK } from "./motion/motion-root";

// Scroll is the clock (direction.md, signature 2): the home page is the morning of a
// lunch, 11:30 at the top to 1:00 at [data-one-pm]. The clock writes its own text,
// so nothing re-renders. Reduced motion: it simply says "Lunch at 1 pm".
const START = 11 * 60 + 30;
const END = 13 * 60;

function label(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, "0")}`;
}

export function ScrollClock() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    const time = el?.querySelector<HTMLElement>("[data-time]");
    const one = document.querySelector("[data-one-pm]");
    if (!el || !time || !one) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      el.dataset.live = "";
      const st = ScrollTrigger.create({
        start: 0,
        endTrigger: one,
        end: "center center",
        onUpdate: (self) => {
          const minutes = START + (END - START) * self.progress;
          time.textContent = label(minutes);
          el.toggleAttribute("data-one", self.progress >= 0.999);
        },
        onLeave: () => {
          time.textContent = "1:00";
          el.setAttribute("data-one", "");
        },
      });
      // Shown once the first screen has gone by.
      const show = ScrollTrigger.create({
        start: () => window.innerHeight * 0.6,
        onToggle: (self) => el.toggleAttribute("data-shown", self.isActive),
      });
      return () => {
        st.kill();
        show.kill();
        delete el.dataset.live;
      };
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="scroll-clock pointer-events-none fixed bottom-4 right-4 z-30 hidden items-center gap-3 bg-background/90 px-3 py-2 text-foreground backdrop-blur-sm md:bottom-6 md:right-10"
    >
      <span className="stamp text-muted">Lunch at</span>
      <span data-time className="font-display text-2xl tabular-nums leading-none">
        1:00
      </span>
    </div>
  );
}
```

```css
/* globals.css */
.scroll-clock[data-live] { display: flex; opacity: 0; transform: translateY(8px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
.scroll-clock[data-live][data-shown] { opacity: 1; transform: none; }
.scroll-clock[data-one] [data-time] { color: var(--brand); }
```

Mount it inside the page (not the layout) after the element it runs to, so `document.querySelector` finds it.

## Gotchas

- Put it where captions aren't. Bottom-left collided with every photo band's caption; bottom-right didn't.
- The landing element should *be* the promise at poster size (a giant "1 pm"), so the instrument arriving and the page arriving are one moment.
- `aria-hidden`: it repeats what the page says. Don't make it a live region.

**Not this:** a progress bar along the top. That measures the page; an instrument measures the world.
