# Where each stage comes from

The rules in this skill are not taste in the abstract. Each stage draws on Braintied's
own recent sites, its research corpus (links collected, read and rated by the team),
its packages, and the runs that tested this skill. When a rule here and a source
disagree, the source wins; fix the rule.

| Stage | Draws on |
|---|---|
| 1 Brief | The rehearsal run whose site had no references to be judged against; the [reference shelf](reference-sites.md), built from live sites' first screens. |
| 2 Direction and art direction | Braintied's creative-direction method (a world before a picture list; each reference governs one thing; the one-world test both ways). Braintied's recent client sites, which all share a page-wide world, one signature mechanism and image sets of 10–40 frames. A lesson from a rejected redesign: a new design that changes tokens but not compositions is a costume. |
| 3 Identity | Impeccable's type and colour rules ([impeccable.style](https://impeccable.style)): scale jumps, fluid display type, tinted neutrals. Anthropic's [frontend-design skill](https://github.com/anthropics/skills): commit to an aesthetic, never converge on the safe font. |
| 4 Imagery | `@braintied/prompt-craft` (the model facts and the anti-slop audit; 2–3 details on a referenced subject hold ~78% consistency, 8+ fall to ~31%). Braintied's image art-direction method (one shared opening and closing, one brief per frame, one change per retake). Costs and the cutout halo measured on the Tiffin run. |
| 5 Composition | `@braintied/site-engine`'s section-pattern catalog. OpenAI's frontend hard rules ([designing delightful frontends](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)): one job per section, a real visual anchor, 2–3 intentional motions. GSAP ([gsap.com](https://gsap.com), free since 2025) and [Lenis](https://lenis.darkroom.engineering) for the recipes, each tested on the starter. |
| 5c Copy | Braintied's conversion-page method (hero shapes; every line names a thing, a proof or a next step; measured on 2,138 calls to action across 107 pages). The eight-version, five-judge headline tournament from the corpus. [H1 Gallery](https://h1gallery.com) as the headline shelf. `@braintied/prose` for the audit. |
| 6 Critique | The "designed or generated?" verdict and costume test from the Tiffin rejections. Screenshots beside real references, not a description of them, as several posts in the corpus argue ("reference cases beat skill labels"). Retake verbs from Impeccable's command vocabulary. |

## Runs that tested it

- Three gallery sites (a fish service, a café desk, a scooter shop) on 0.2–0.3: 48
  findings, each fixed in a named file.
- Tiffin, the same brief three times: 0.2 (rejected: "basic, vibe coded in 5
  minutes"), 0.3.2 (rejected: "no intention into each section, no dynamic animations
  or scrolling"), 0.4 ("much better, but we can go even harder"), then a harder pass
  that became the scroll-instrument and depth recipes and the "raise the ceiling"
  round.
