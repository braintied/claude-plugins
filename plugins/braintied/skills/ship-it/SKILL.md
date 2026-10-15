---
name: ship-it
description: Review, check, commit and push the current work so it deploys, then confirm the live site works. Use when someone says ship it, deploy, push, publish, put it live, put it online, go live, or wants a link to share.
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
6. First time live? Ask whether the repo is already imported in Vercel. If not, walk them
   through the README's "Put it live" section first: import the repo (Vercel → Add New →
   Project), add each name from `.env.example` in Vercel → Settings → Environment
   Variables (they paste the values there themselves, never in the chat), add the Inngest
   integration, then in Supabase → Authentication → URL Configuration set the Site URL to
   the Vercel address and add `https://<project>.vercel.app/auth/callback` to Redirect
   URLs. Ask them for the Vercel URL; never guess it.
7. If the commit adds a file in `supabase/migrations/`, say so before pushing, with one
   line on what it changes in the live database. If Vercel has the Supabase integration
   (Deploy Button projects), the production build applies it, so the yes to push is the
   yes to migrate. Otherwise ask, run `pnpm db:push`, then push, so the new code never
   goes live before its tables.
8. Ask before pushing (and say whether it will change the live database), then
   `git push`. The pre-push hook reruns the check.
9. If the change added an env var: tell the person to add it in Vercel → Project →
   Settings → Environment Variables and redeploy.
10. Wait for the deploy (Vercel dashboard, or `vercel ls` if the CLI is installed), open
   the live URL, and check the changed page at phone and desktop width.
11. Tell the person in one or two plain sentences what's live and where.
12. Academy (optional, quiet): once the live URL loads, log the milestone. The first
    successful deploy is `first_deploy`. For `waitlist_live`, never submit the live form
    yourself (that writes a production row and sends a real email): count rows in
    `waitlist` with the supabase MCP, and if there are none, ask the person to join their
    own live waitlist with their `OWNER_EMAIL`.

    ```bash
    node "${CLAUDE_SKILL_DIR}/../learn/scripts/academy.mjs" signal first_deploy url=<live URL>
    node "${CLAUDE_SKILL_DIR}/../learn/scripts/academy.mjs" signal waitlist_live url=<live URL>
    ```

    Show its one line of output, if any, and nothing more.
