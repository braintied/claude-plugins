# Product demos in code

A page that shows the product working convinces more than one that describes it. A
product demo is a small piece of the real interface (or, before launch, the thing the
customer will hold) recreated in code, playing through the one moment that matters.

## The shape: steps in CSS, one observer, no React state

The steps are elements with a step index. CSS plays them in order with a delay per
step and `fill-mode: backwards`: each holds its empty first frame until it plays, then
rests on the element's own style, which is the finished frame. (`both` looks the same
but keeps the animation applied, which breaks `backdrop-filter` underneath.) A single
`IntersectionObserver` starts the play when the demo is seen; it writes a data
attribute, not React state, so there is nothing to re-render and nothing for
`react-hooks/set-state-in-effect` to flag.

```tsx
"use client";
import { useEffect, useRef } from "react";

const CHECKS = ["Front brake", "Rear brake", "Tyres", "Lights and horn"];

export function Demo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.dataset.seen = "true"; observer.disconnect(); }
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="demo">
      <p className="sr-only">A mechanic ticks each check on the job card, then signs it.</p>
      <ol aria-hidden="true">
        {CHECKS.map((check, i) => (
          <li key={check} className="demo-step" style={{ animationDelay: `${i * 500}ms` }}>{check}</li>
        ))}
      </ol>
      <noscript><style>{`.demo .demo-step{animation:none}`}</style></noscript>
    </div>
  );
}
```

```css
/* globals.css */
@keyframes demo-in { from { opacity: 0; transform: translateY(4px); } }
.demo .demo-step { animation: demo-in 300ms ease-out backwards; animation-play-state: paused; }
.demo[data-seen] .demo-step { animation-play-state: running; }
@media (prefers-reduced-motion: reduce) {
  .demo .demo-step { animation: none; }
}
```

A demo that is on screen at load (in or right under the hero, on a projector) plays
from first paint; it needs no observer, so drop `animation-play-state: paused` for it.

## Rules

1. **The resting frame is the finished one.** No JavaScript (the `noscript` rule) and
   reduced motion both show every step done. The demo plays *from* empty only when seen.
2. **It plays once.** No loops. A loop is decoration; one play is a demonstration.
3. **`sr-only` prose says what it shows**, in the sentence a person would say. The
   drawn parts are `aria-hidden`.
4. **Real shapes.** Before launch, the object's fields come from the brief, not
   imagination. After launch, port the app's real component and say so in a comment.
5. **An honesty label** on anything illustrative: "Specimen", "Example", "Illustrative".
6. **No `Math.random()`** in anything rendered on the server; use a function of the
   index so server and browser agree.
7. **CSS beats timers.** Delays per step in CSS, no `setTimeout`, no state machine in
   React unless the demo branches.
8. **Where it sits when the entry is still.** `still-editorial-entry` allows no
   animation, so the hero shows the object on its finished frame and the demo plays in
   the section directly under it.
