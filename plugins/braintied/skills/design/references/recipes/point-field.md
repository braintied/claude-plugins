# point-field: canvas2d particles that morph between words on scroll

**When:** Idea-led worlds with three verbs or three nouns (cook / carry / eat). A single moment per page; the canvas is decoration with a real `aria-label`, the words also appear in text nearby.

**File:** `src/components/motion/point-field.tsx`

## Component (as tested)

```tsx
"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "./motion-root";

type Pt = { x: number; y: number };

/** Samples `count` points from where `word` paints on an offscreen canvas of w x h. */
function sample(word: string, w: number, h: number, font: string, count: number): Pt[] {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const c = off.getContext("2d", { willReadFrequently: true });
  if (!c) return [];
  let size = h * 0.62;
  c.font = `700 ${size}px ${font}`;
  size *= Math.min(1, (w * 0.92) / c.measureText(word).width);
  c.font = `700 ${size}px ${font}`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(word, w / 2, h / 2);
  const data = c.getImageData(0, 0, w, h).data;
  const hits: Pt[] = [];
  const step = Math.max(2, Math.round(Math.sqrt((w * h) / (count * 6))));
  for (let y = 0; y < h; y += step)
    for (let x = 0; x < w; x += step) if (data[(y * w + x) * 4 + 3] > 128) hits.push({ x, y });
  for (let i = hits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hits[i], hits[j]] = [hits[j], hits[i]];
  }
  return Array.from({ length: count }, (_, i) => hits[i % Math.max(1, hits.length)]).filter(Boolean);
}

/**
 * Canvas2D particle field that morphs between words as its section scrolls through the
 * viewport. Sticky canvas inside a tall section; scroll progress picks the morph.
 */
export function PointField({ words, label }: { words: string[]; label: string }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const sec = section.current;
    const ctx = el?.getContext("2d");
    if (!el || !sec || !ctx) return;
    const still = !window.matchMedia(MOTION_OK).matches;
    let shapes: Pt[][] = [];
    let w = 0;
    let h = 0;
    let color = "";
    let progress = still ? words.length - 1 : 0;
    let frame = 0;
    let visible = false;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const i = Math.min(Math.floor(progress), shapes.length - 2);
      const raw = Math.min(1, progress - i);
      const t = raw * raw * (3 - 2 * raw); // smoothstep: holds each word, travels between
      const from = shapes[i] ?? [];
      const to = shapes[i + 1] ?? from;
      const drift = still ? 0 : Math.sin(t * Math.PI) * 18;
      for (let p = 0; p < from.length; p++) {
        const a = from[p];
        const b = to[p] ?? a;
        const n = still ? 0 : Math.sin(time * 0.0012 + p) * 0.6;
        const x = a.x + (b.x - a.x) * t + Math.cos(p) * drift + n;
        const y = a.y + (b.y - a.y) * t + Math.sin(p * 1.7) * drift + n;
        ctx.fillRect(x, y, 1.8, 1.8);
      }
    };
    const loop = (time: number) => {
      draw(time);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const css = getComputedStyle(el);
      color = css.getPropertyValue("--brand").trim();
      const count = w < 768 ? 1400 : 3600;
      shapes = words.map((word) => sample(word, w, h, css.fontFamily, count));
      if (still && shapes.length === 1) shapes.push(shapes[0]);
      draw(0);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !still && !frame) frame = requestAnimationFrame(loop);
    });
    const ro = new ResizeObserver(build);
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", build);
    const st = still
      ? null
      : ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            progress = self.progress * (words.length - 1);
          },
        });
    document.fonts.ready.then(() => {
      ro.observe(el);
      io.observe(el);
    });
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      scheme.removeEventListener("change", build);
      st?.kill();
    };
  }, [words]);

  return (
    <section ref={section} className="relative motion-safe:h-[320svh]">
      <canvas ref={canvas} role="img" aria-label={label} className="sticky top-0 h-svh w-full" />
    </section>
  );
}
```

## CSS

No CSS beyond Tailwind. Color comes from `--brand` via `getComputedStyle`, re-read on resize and on `prefers-color-scheme` change.

## Reduced motion

No loop, no ScrollTrigger, section is not tall. It draws the last word once (and again on resize), statically.

## Phone

DPR capped at 2, 1400 points (3600 on desktop). On a 390px screen the word is width-bound, so the sampler scales the font to 92% of the width.

## Gotchas we hit

- Sample after `document.fonts.ready`, or the first word samples from the fallback font and the morph jumps when Geist arrives.
- At 2200 points and 1.6px dots the 1440 field read as noise; 3600 points at 1.8px reads as a word. On phone the height-sized font was width-limited and tiny until scaled to the width.
- `smoothstep` on the morph fraction holds each word legible for most of its scroll span; linear interpolation means the field is mush most of the time.
- `IntersectionObserver` stops the rAF loop off-screen; the ScrollTrigger only writes a number.
- Measured: p95 frame 17ms at both widths, 0 frames over 50ms while drawing 3600 points.

**Not this:** three.js for 3000 dots, glow/blur on every particle, rainbow colors, or a field that never resolves to anything readable.
