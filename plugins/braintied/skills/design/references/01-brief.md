# Stage 1 · Brief

Goal: one page that every later decision can be checked against.

## Interview

Ask these one or two at a time, conversationally. Push for specifics; "everyone" and
"easy to use" are not answers.

If the person asks you to draft the answers ("just write something, I'll fix it"), write
them as the founder's assumptions and put this line at the top of `brief.md`:
`> Draft from assumptions. No customers, prices or results exist yet.` Then read each
answer back; an assumption the person doesn't recognise gets cut, not kept.

1. Who is the first person who would pay for or use this? Name a real kind of person
   ("a yoga teacher in Goa with 40 regulars"), not a market.
2. What do they do today instead, and what's annoying about it?
3. What's different for them the week after they start using this?
4. Why you? What do you know or have that others don't?
5. Three words for how it should feel. Three words for how it must *not* feel.
6. Two or three sites, apps, shops, magazines, or places they love the feel of, and
   what exactly they love (the type? the photos? the pace?).
7. The one action a visitor should take (join a waitlist, book, buy, download).
8. What do you already have? Real photographs, the physical thing itself, a logo, a
   place you could photograph. Real material beats generated material; generated fills
   the gaps.
9. What should a visitor remember an hour later? One moment or one picture, not a
   feature ("the tins stacking up as I scrolled", "the fish on newspaper"). This becomes
   the signature in stage 2.

**Question 6 can't be skipped.** If the person has no references, offer six that fit the
idea (live sites from [reference-sites](reference-sites.md) plus printed things and
places), and let them pick two or three and say what they like in each. At least one
must be a live website at the level you're aiming for: it is what stage 6 holds the
result against. A direction with no real references has nothing to be judged against,
and drifts to the generic page.

Write them to `docs/brand/references.json` (stage 2 adds what each one governs):

```json
[{ "name": "…", "url": "https://…", "loves": "what the person said they love in it" },
 { "name": "A Goan shop signboard", "image": "docs/brand/refs/signboard.jpg", "loves": "letters painted big" }]
```

A reference that isn't a website (a printed menu, a shop sign, a place) goes in as an
`image`: a photo the person has, or one you find and save to `docs/brand/refs/`. Stage 6
puts every reference beside the page, so each needs a picture.

## Write `docs/brand/brief.md`

```markdown
# Brief

**One sentence:** <who> can <do what> without <today's pain>.
**First user:** <specific person>
**Today:** <what they do instead and why it hurts>
**After:** <what's different>
**Why us:** <the unfair advantage>
**Feels:** <3 words> · **Never feels:** <3 words>
**Loves:** <reference> — <the specific thing>; ...
**The one action:** <action>
**Have:** <real photos, the object, a logo, places; or "nothing yet">
**Remembered for:** <the one moment or picture a visitor keeps>
**Can't claim yet:** <every number, customer, quote, partner or result that doesn't exist yet>
```

Also fill "The idea" in CLAUDE.md from it.

## Check before moving on

- Could the one sentence describe a competitor too? Then it's not sharp yet; ask
  what's different.
- Read it back to the person. They should say "yes, that's it", not "sort of".
