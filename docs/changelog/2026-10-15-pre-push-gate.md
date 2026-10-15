# 2026-10-15 · Pre-push gate for the plugin

Created 2026-10-15 · Updated 2026-10-15 · Version 1

**What changed**
- `.localci.sh` at the repo root. `git-local-ci` runs it on every push. Before
  this, the repo had no `package.json`, so the gate printed "nothing to verify" and
  every push landed unchecked. That included 0.2.0 (`96682e3`), which was validated by hand.
- The gate fails on:
  1. `claude plugin validate --strict` failing for `.` (marketplace) or
     `plugins/braintied` (plugin, skills).
  2. A SKILL.md frontmatter that doesn't parse, has a `name` that isn't its folder name,
     or has no description (`scripts/check-skill-frontmatter.mjs`, no dependencies).
  3. `node --check` failing on any `plugins/*/skills/*/scripts/*.mjs` or `.js`, or on `scripts/*.mjs`.
  4. `skills/learn/scripts/academy.mjs signal x` with `ACADEMY_CONFIG_DIR` pointed at an
     empty temp dir: it must exit 0 and print exactly the one-line sign-in hint, then
     print nothing on a second run.
- Declared `# localci-cost: light`. It checks the whole tree every time, in about 20 s,
  mostly the `npx` lookup inside `academy.mjs`.

**Why `--strict` and a separate frontmatter check**
Measured on Claude Code 2.1.299:
- Without `--strict`, `claude plugin validate` exits 0 when a SKILL.md has no
  frontmatter block or no description. It only prints a warning.
- Even with `--strict`, it passes `name: [explain` without a word. A YAML syntax error
  in a skill's frontmatter would ship. The checker accepts only the subset the skills
  use: top-level `key: value` lines, quoted or plain scalars, and block values. A plain
  value that starts with a YAML indicator, or contains `": "` or `" #"`, fails with a
  "quote it" message.

**How it was checked**
- Clean tree (`7ea5a40`): passes, exit 0.
- Seven deliberate breaks, each in a scratch copy, all exit 1: a YAML syntax error in
  `name`, a missing opening `---`, a deleted description, a name that isn't the folder
  name, an unquoted `": "` in a description, a syntax error in `contrast.mjs`, and an
  extra line printed by `academy.mjs` before the hint.
- The `design/levelup-2026-10-15` tree (0.3.0, `89b6cd3`) with this gate copied in
  passes. Its four new scripts (`_load.mjs`, `audit-prompt.mjs`, `name-score.mjs`,
  `patterns.mjs`) match the script glob, so that merge is gated with no extra wiring.
  They import `@braintied/*` from the user's project at runtime, so `node --check` is
  the check that fits them. Running them needs a project.
