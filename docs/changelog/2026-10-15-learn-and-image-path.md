# 2026-10-15 · braintied 0.2.0: /learn, Academy milestones, image script path

Created 2026-10-15 · Updated 2026-10-15 · Version 1

**What changed**
- New `/learn` skill: shows Braintied Academy progress and logs milestones through
  `@braintied/academy` (`skills/learn/scripts/academy.mjs`). Signed out, it prints one
  hint the first time and stays quiet after; it always exits 0, so it can't break the
  skill that called it.
- `/design` logs `design_direction_written` after stage 2; `/ship-it` logs `first_deploy`
  (and `waitlist_live`) with the live URL.
- `/design` stage 4: the image script path now comes from `${CLAUDE_SKILL_DIR}` in
  SKILL.md. The old `${CLAUDE_PLUGIN_ROOT}` path in the reference file is empty in
  Claude's shell, so the command pointed at `/skills/design/...`.

**Why**
Found in the Edge City workshop rehearsal (idea-to-mvp
`docs/changelog/2026-10-15-workshop-rehearsal.md`), plus Academy stage A.

**How it was checked**
- `claude plugin validate` passes for the marketplace and the plugin.
- `academy.mjs` signed out: one hint, then silent, exit 0. Signed in, against a stub of
  the Academy API: the signal body, the payload `url`, the "Lesson completed" line, and
  progress with colors stripped all came out right.
- A headless `/design` run with `--plugin-dir` resolved the real script path and fired
  `design_direction_written` through the `../learn` path.
