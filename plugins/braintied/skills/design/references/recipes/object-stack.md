# object-stack: the product object is the navigation

**When:** Object-led worlds where one physical thing carries the story: a tiffin, a camera, a bottle. Each part of the object is one section; tapping a part jumps to it.

**File:** `src/components/motion/object-stack.tsx`

## Component (as tested)

```tsx
"use client";

import { useId, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOTION_OK } from "./motion-root";

export type Tier = { id: string; name: string; title: string; body: string };

function Lid({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 200 56" className="block w-full" aria-hidden>
      <path d="M70 30 Q100 -4 130 30" fill="none" stroke={`url(#${g}-body)`} strokeWidth="7" strokeLinecap="round" />
      <path d="M8 46 Q100 6 192 46 A92 9 0 0 1 8 46 Z" fill={`url(#${g}-body)`} />
    </svg>
  );
}

function TierShape({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 200 64" className="block w-full" aria-hidden>
      <path d="M8 12 V50 A92 11 0 0 0 192 50 V12 Z" fill={`url(#${g}-body)`} />
      <ellipse cx="100" cy="12" rx="92" ry="10" fill={`url(#${g}-rim)`} />
      <path d="M8 30 A92 11 0 0 0 192 30" fill="none" stroke="var(--steel-lo)" strokeOpacity="0.5" />
    </svg>
  );
}

/**
 * The product object is the navigation: a steel lunch carrier whose tiers separate as
 * the reader scrolls, one tier per section, each tier a link to the section it opens.
 * One CSS variable (--split: 0 closed, 1 apart) drives every tier; GSAP scrubs only it.
 */
export function ObjectStack({ tiers, label }: { tiers: Tier[]; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const g = useId().replace(/[^a-zA-Z0-9]/g, "");
  const n = tiers.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const sections = el.querySelectorAll<HTMLElement>("[data-tier-section]");
      const links = el.querySelectorAll<HTMLElement>("[data-tier-link]");
      sections.forEach((section, i) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => links[i]?.toggleAttribute("data-active", self.isActive),
        }),
      );
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(el, { "--split": 0 }, {
          "--split": 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 35%", end: "bottom bottom", scrub: 0.4 },
        });
      });
    },
    { scope: root },
  );

  // Gap k (above tier k) opens over the k-th nth of --split, so tiers part one at a time.
  const open = (k: number) => `clamp(0, var(--split) * ${n} - ${k - 1}, 1)`;
  const all = Array.from({ length: n }, (_, k) => open(k + 1)).join(" + ");
  const shift = (part: number) => {
    const above = part === 0 ? "0" : Array.from({ length: part }, (_, k) => open(k + 1)).join(" + ");
    return { translate: `0 calc((${above} - (${all}) / 2) * var(--gap))` };
  };

  return (
    <div ref={root} className="relative [--gap:1.4rem] [--split:0] motion-reduce:[--split:1] md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:[--gap:4.5rem]">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <linearGradient id={`${g}-body`} x1="0" x2="1">
          <stop offset="0" style={{ stopColor: "var(--steel-lo)" }} />
          <stop offset="0.28" style={{ stopColor: "var(--steel-hi)" }} />
          <stop offset="0.6" style={{ stopColor: "var(--steel)" }} />
          <stop offset="1" style={{ stopColor: "var(--steel-lo)" }} />
        </linearGradient>
        <linearGradient id={`${g}-rim`} x1="0" x2="1">
          <stop offset="0" style={{ stopColor: "var(--steel)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--steel-lo)" }} />
          <stop offset="1" style={{ stopColor: "var(--steel)" }} />
        </linearGradient>
      </svg>
      <nav aria-label={label} className="sticky top-0 z-10 flex h-[46svh] items-center justify-center bg-background md:h-svh">
        <ol className="flex w-40 flex-col md:w-72">
          <li style={shift(0)}>
            <Lid g={g} />
          </li>
          {tiers.map((t, i) => (
            <li key={t.id} style={shift(i + 1)} className="relative">
              <a href={`#${t.id}`} data-tier-link className="group block rounded-full outline-offset-4 transition-[filter] duration-300 data-active:drop-shadow-[0_0_18px_var(--brand)]">
                <TierShape g={g} />
                <span className="absolute top-1/2 left-full ml-3 -translate-y-1/2 font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-muted uppercase group-data-active:text-brand md:ml-6 md:text-xs">
                  {t.name}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div>
        {tiers.map((t) => (
          <section key={t.id} id={t.id} data-tier-section aria-labelledby={`${t.id}-h`} className="flex min-h-[70svh] scroll-mt-[46svh] flex-col justify-center px-4 py-16 md:min-h-svh md:scroll-mt-0 md:px-12">
            <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">{t.name}</p>
            <h2 id={`${t.id}-h`} className="mt-3 max-w-[16ch] text-4xl leading-tight font-semibold tracking-tight md:text-6xl">{t.title}</h2>
            <p className="mt-5 max-w-[48ch] leading-relaxed text-muted md:text-lg">{t.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
```

## CSS

```css
/* globals.css :root — dark block overrides */
--steel: #b8bdc3;
--steel-hi: #f2f4f6;
--steel-lo: #6c727a;
```

Separation is pure CSS: each tier's `translate` is a `calc()` of `clamp(0, var(--split) * n - (k-1), 1)` terms, so gap k opens over the k-th nth of `--split`. GSAP tweens only `--split` on the container.

## Reduced motion

`motion-reduce:[--split:1]` renders the separated state from first paint. Active-tier highlighting still works (it is a state, not motion), and anchor links jump natively.

## Phone

The object is a sticky strip (46svh) above the sections; sections use `scroll-mt-[46svh]` so a tier tap lands the heading under the strip. Measured: section top exactly at the strip bottom, with and without Lenis.

## Gotchas we hit

- First version separated all tiers at once; "tier by tier" needs the per-gap `clamp()` so each section opens one tier.
- Inline `style` beats Tailwind classes, so the reduced-motion `--split:1` must be a class on the container and GSAP must only write `--split` under `MOTION_OK`.
- SVG gradient ids come from `useId()` with non-alphanumerics stripped, so two stacks on a page do not share `url(#...)`.
- The lid handle first floated above the dome; check the art at both widths before trusting the geometry.
- Copy that says "bottom tier" fights a DOM order that lists the top tier first. Name tiers by their section, not their position.
- Measured: p95 frame 17ms at both widths.

**Not this:** A product photo that merely parallaxes next to the copy, or a sticky object that never responds to which section is active.
