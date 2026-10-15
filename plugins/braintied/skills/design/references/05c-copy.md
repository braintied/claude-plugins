# Stage 5c · Copy

Goal: words a visitor would quote, section by section, before any section is built.
The pictures can be right and the page still reads as generated when every line
*describes the product* ("Tiffin is a weekly lunch subscription…"). Copy that works
does a job in each line: it stops someone, it proves something, or it moves them.

Write the copy into `docs/brand/copy.md` after the site plan and before the pages. The
pages are then set from that file, not written inside JSX.

## 1. Every section: job, hook, line, proof

For each section in `site-plan.md`, four lines:

```markdown
### / · section 3 (the day, in frames)
**Job:** make the visitor see their own 1 pm, not our process.
**Hook:** "11:30 · a kitchen in Assagao"   ← the first thing read: a time and a place
**Line:** Cooked in a kitchen, not a restaurant.
**Proof:** Rice, dal and a vegetable, the way the cook makes it for her own family.
```

- **Job** is what the visitor must feel or do after this section, never what the
  section contains.
- **Hook** is the small line above the headline: a time, a place, a person, a number
  the founder has decided. It is the first thing the eye reads; "How it works" is not
  a hook.
- **Line** is the headline. Every line names a **thing**, a **proof** or a **next
  step**, or it sits right beside one that does. A brand-story line never stands
  alone as a headline.
- **Proof** is the one sentence under it. Concrete nouns, the world's own words, a
  mechanism the sceptic can picture. No adjective doing a number's job.

## 2. The first screen: pick one hero shape

Pick one; don't blend two.

| Shape | Lead with | Choose it when | Not this |
|---|---|---|---|
| Benefit | what the visitor gets, in their words | they arrive with a goal | an adjective with nothing under it ("unlock your potential") |
| Product-forward | the thing itself | they already know what they want | a mood photo standing in for the product |
| Offer | the terms | price or timing is why they came | a "was/now" price with no record |
| Problem | today's pain, named exactly | the pain is sharper than the promise | a scare line with no answer under it |
| Proof | a real record | there is one (there usually isn't before launch) | invented proof, ever |
| Dual-path | two kinds of visitor, two doors | two sides depend on each other (customers and cooks) | two equal heroes fighting |

Answer the biggest objection on the first screen too, in the smallest type there
("Not running yet. One email when your village opens.").

## 3. Headlines: the tournament

For the first screen's line and each page's first line:

1. Read ten headlines on [H1 Gallery](https://h1gallery.com) first: short, concrete,
   one turn.
2. Write **eight** versions in the direction's voice, each from a different angle: the
   time, the place, the person, the object, today's pain, the after, the one word only
   this product can use, a plain instruction.
3. Score each 1–5 by five readers: **the sceptic** (which claim can't they believe?),
   **the first user from the brief, tired, on a phone** (would they stop?), **a
   competitor** (could they say it too? then it loses), **the founder at midnight**
   (would they put it on the van?), **a copywriter** (is there a turn, a rhythm, a word
   that earns its place?).
4. Keep the winner, steal one phrase from the runner-up, and list the losers with the
   reason in `copy.md`.

Climb the specificity ladder before scoring: *generic* ("Healthy lunch delivered") →
*specific* ("Hot lunch at 1 pm") → *only us* ("Lunch from down the road, at 1 pm").
Only the third rung is allowed on a first screen.

## 4. The small words

They're read more often than headlines, and they're where generated sites give
themselves away.

- **Buttons say what happens**, in the world's words: "Put me on the 1 pm run", not
  "Submit" or "Get started". The same action has the same label everywhere.
- **The confirmation** after the form, the **error** if it fails, the **404**, the
  **empty states**: all in the voice. "This lane ends here." beats "Page not found".
- **Labels and stamps** (the small uppercase lines) carry facts: times, places, steps.
  Never "Features", "Benefits", "Why us".
- **Alt text** describes the picture from `images.json`'s `describes` line.

## 5. Read it all at once

Paste every line of `copy.md` into one column and read it top to bottom, aloud.

- Does it tell one story in order, or is it a list of sections?
- Does any sentence shape repeat (three headlines that start "No…", three that are
  questions)? Change two of them.
- Would the copy survive with no pictures? It should still make someone want the
  thing.

## 6. Audit

On the running site:

```bash
pnpm add -D @braintied/prose playwright   # once
node "<copy-audit script>" --site http://localhost:3000 --pages /,/how-it-works,/join
```

It runs `@braintied/prose`'s brand-voice audit (repetition, manufactured triads, meta
commentary), this skill's banned words and exclamation marks, and lists every number
on each page to check against the brief's **Can't claim yet**. Clean is the floor, not
the bar: the bar is the tournament and the read-aloud.

**Where this comes from:** the hero shapes and the thing/proof/next-step test are
Braintied's conversion-page method (measured on 2,138 calls to action across 107
pages); the eight-version, five-judge tournament is from the research corpus; H1 Gallery
is the headline shelf the corpus points to; `@braintied/prose` is Braintied's writing
engine.
