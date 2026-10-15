# Product demos in code

A page that shows the product working convinces more than one that describes it. A
product demo is a small piece of the real interface (or, before launch, the thing the
customer will hold) recreated in code, playing through the one moment that matters.

## The shape: a scripted state machine

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

// The one moment, as ordered steps with how long each holds.
const STEPS = ["empty", "checking", "ticked", "signed"] as const;
type Step = (typeof STEPS)[number];
const HOLD_MS: Record<Step, number> = { empty: 600, checking: 1400, ticked: 900, signed: 2600 };

// Scenes render cumulatively: once "ticked" is reached, it stays shown.
const reached = (current: Step, target: Step) => STEPS.indexOf(current) >= STEPS.indexOf(target);

export function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>("signed"); // server and reduced motion: the finished frame
  const [playing, setPlaying] = useState(false);

  // Play once when it scrolls into view, unless the visitor asked for less motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    // Below the fold, reset to the first frame so the visitor sees it play.
    // Already on screen at load: leave the finished frame rather than flicker.
    const startsVisible = node.getBoundingClientRect().top < window.innerHeight;
    if (startsVisible) return;
    setStep("empty");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setPlaying(true); observer.disconnect(); }
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const next = STEPS[STEPS.indexOf(step) + 1];
    if (!next) { setPlaying(false); return; }
    const timer = setTimeout(() => setStep(next), HOLD_MS[step]);
    return () => clearTimeout(timer);
  }, [playing, step]);

  return (
    <div ref={ref}>
      <p className="sr-only">A mechanic ticks each check on the job card, then signs it.</p>
      <div aria-hidden="true">{/* draw each scene with reached(step, "...") */}</div>
    </div>
  );
}
```

## Rules

1. **The resting frame is the finished one.** Server render, no JavaScript and reduced
   motion all show the last step. The demo plays *from* empty only when it's seen.
2. **It plays once.** No loops. A loop is decoration; one play is a demonstration.
3. **`sr-only` prose says what it shows**, in the sentence a person would say. The
   drawn parts are `aria-hidden`.
4. **Real shapes.** Before launch, the object's fields come from the brief, not
   imagination. After launch, port the app's real component and say so in a comment.
5. **An honesty label** on anything illustrative: "Specimen", "Example", "Illustrative".
6. **No `Math.random()`** in anything rendered on the server; use a function of the
   index so server and browser agree.
7. **CSS staggering beats timers** for simple reveals: `style={{ animationDelay:
   \`${i * 60}ms\` }}` on each line, with the keyframes' `fill-mode: both`.
