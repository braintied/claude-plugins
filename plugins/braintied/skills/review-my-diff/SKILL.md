---
name: review-my-diff
description: Review everything that changed since the last commit before it's pushed — bugs, leaked secrets, missing row-level security, unchecked input, broken mobile layout. Use when someone asks for a review, "check my work", or before shipping.
---

# Review my diff

If the project has a `reviewer` subagent (`.claude/agents/reviewer.md`), hand the
review to it. Otherwise do it yourself:

Read `git status` and `git diff` (include new, untracked files). Fix nothing until the
person says so. Report findings in plain language, most serious first, each with
`path:line`, what goes wrong for a real user, and the fix.

**Security**
- A key, token, or password anywhere in the diff or in a file about to be committed.
- Server-only clients or secrets imported into browser code (`"use client"` files).
- A new table without row-level security and a policy in the same migration.
- Form or URL input used without validation (zod).
- Owner-only behavior without a check on who's asking.

**Correctness**
- Errors from database or API calls ignored.
- Schema changes without regenerated types.
- New env vars missing from `.env.example`.
- Placeholder text, fake data, or TODOs presented as finished.

**Experience**
- Layout that breaks at 375px wide; hex colors instead of tokens; slow actions with no
  pending state; missing alt text or focus states.

End with **Safe to ship** or **Fix these first**.
