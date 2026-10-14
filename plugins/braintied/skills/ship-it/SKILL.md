---
name: ship-it
description: Review, check, commit and push the current work so it deploys, then confirm the live site works. Use when someone says ship it, deploy, push, publish, or "put it live".
---

# Ship it

1. Run `/review-my-diff`. Stop and report if it says "Fix these first".
2. Run the project's check command (CLAUDE.md lists it; usually `pnpm check`). If it
   fails, fix the cause and rerun. Never bypass it (`--no-verify` is off-limits).
3. Make sure no secret is staged: `git status` must not show `.env.local` or any key.
4. Write the changelog entry if the project keeps one
   (`docs/changelog/YYYY-MM-DD-short-name.md`: what, why, how it was checked).
5. Commit with a message that says what changed for a user, e.g.
   "Add follow-up email drafts on contact pages".
6. Ask before pushing, then `git push`. The pre-push hook reruns the check.
7. If the change added an env var: tell the person to add it in Vercel → Project →
   Settings → Environment Variables and redeploy.
8. If it added a database migration: ask before applying it to the live database
   (`pnpm db:push`).
9. Wait for the deploy (Vercel dashboard, or `vercel ls` if the CLI is installed), open
   the live URL, and check the changed page at phone and desktop width.
10. Tell the person in one or two plain sentences what's live and where.
