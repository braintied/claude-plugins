---
name: learn
description: Show the person's Braintied Academy progress and log milestones they reach while building (waitlist live, first CRM contact, design direction, first deploy). Use when someone asks about their progress, the Academy, what lesson is next, or says /learn. Optional and quiet when they aren't signed in to the Academy.
---

# Learn

[Braintied Academy](https://braintied.com/academy) has a track that follows this build,
**Idea to Live Product** (`braintied.com/academy/idea-to-live-product`). The Academy
CLI (`@braintied/academy`) connects the two: progress shows here, and milestones the
person reaches in their own project count toward the track.

It's optional. Signing in (`npx @braintied/academy login`, in their own Terminal) is
how the person opts in to milestones being logged from this project.

All calls go through one script, which stays quiet when they aren't signed in and
never fails the command around it:

```bash
node "${CLAUDE_SKILL_DIR}/scripts/academy.mjs" progress
node "${CLAUDE_SKILL_DIR}/scripts/academy.mjs" signal <name> [key=value ...]
```

## /learn

1. Run `progress` and show what it prints.
2. If they aren't signed in, say it in one line and move on. Don't ask again this
   session.
3. Look at the project for milestones below that are already true. List them and
   log the ones the person says haven't counted yet.
4. Point them at the next lesson, and at the matching `docs/learn/` file if the project
   has one.

## Milestones

Other skills log these at the moment they happen, using the script path above with
`learn` in place of their own skill folder:
`${CLAUDE_SKILL_DIR}/../learn/scripts/academy.mjs`.

| Signal | When | Logged by |
|---|---|---|
| `repo_created` | Their own repo exists on GitHub | /learn |
| `env_configured` | `.env.local` is filled in (the person's `pnpm keys` said it's complete; never read the file) | /learn |
| `mcp_server_connected` | `/mcp` shows supabase connected; add `server=supabase` | /learn |
| `claude_code_skill_installed` | This plugin is installed (it is, if you're reading this) | /learn |
| `waitlist_live` | The live site's waitlist form saved a signup; add `url=<live URL>` | /ship-it, /learn |
| `crm_first_contact` | The CRM has at least one contact (count `contacts` with the supabase MCP) | /learn |
| `design_direction_written` | `docs/brand/direction.md` exists | /design (after stage 2), /learn |
| `first_deploy` | The site is live; add `url=<live URL>` | /ship-it |

Check a milestone from the project itself (files, git remote, the live page) before
logging it. Never log one because the person said "I did it" if you can see it isn't
true, and never invent a URL.

After logging, mention it in one short line at most ("Logged to your Academy
progress."). No celebrations, no repeated reminders to sign in.
