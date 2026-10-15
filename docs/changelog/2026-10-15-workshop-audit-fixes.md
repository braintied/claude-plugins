# 2026-10-15 · Workshop audit fixes: ship-it, review, learn, design scripts

Created 2026-10-15 · Version 1

From the prompt and skill audit before the Edge City workshop. The four files the open
`design/levelup-2026-10-15` branch edits (design SKILL.md, 03-identity.md,
05-composition.md, audit-prompt.mjs) are untouched. No version bump here, so the two
branches don't collide; bump once when both are in.

**What changed**
- `/ship-it`: a first-time-live step (import into Vercel, env names, Inngest, Supabase
  Site URL and the vercel.app callback); migrations are announced before the push, and on
  projects without the Supabase integration applied before it; `waitlist_live` is checked
  by counting rows, never by submitting the live form; its signal command is spelled out.
  Triggers add "put it online", "go live", "a link to share".
- `/review-my-diff`: reviews everything not yet pushed (`git diff HEAD`, untracked files,
  `git log @{u}..HEAD -p`), not just unstaged edits.
- `/learn`: `env_configured` and `mcp_server_connected` are checked in ways Claude can
  actually do; the description no longer claims "what's next" from `/next`.
- `/next`, `/explain`: triggers for "what do I do now", "explain this", "what does this
  error mean". `/next` prompts say to press Shift+Tab rather than "start with plan mode".
- `/brand-to-tokens`: names the contrast script and its 6-digit-hex input.
- `/design` stage 4: what to do with no OpenAI key. 05b: `metadataBase` and absolute URLs
  come from the starter's `siteUrl()`, so share previews don't point at localhost.
- Scripts: `generate-image.mjs` treats the `sk-...` placeholder as unset and turns network
  errors into one line; `contrast.mjs` names a non-hex token instead of "missing" and
  handles a missing file; `_load.mjs` only reports "not installed" for a missing module
  and says to skip the script if the install itself fails; `academy.mjs` runs `npx` on
  Windows.

**How it was checked**
- `node --check` on every script; `contrast.mjs` against the starter's globals.css (all
  pass, exit 0), an `oklch()` token, and a missing file; `generate-image.mjs` with the
  placeholder key (stops before any request).
- The pre-push gate (strict validate, frontmatter, node --check, academy smoke).
