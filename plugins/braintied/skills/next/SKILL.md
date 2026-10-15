---
name: next
description: Suggest the most valuable next thing to build, from the project's brief, what's already built, and what's half-done. Use when someone asks "what should I build next", "what's next", "what do I do now", "I'm stuck", or types /next.
---

# Next

1. Read "The idea" in CLAUDE.md (or `docs/brand/brief.md`), the newest files in
   `docs/changelog/`, and `git log --oneline -15`. Skim the routes in `src/app/`.
2. Check for anything unfinished first: failing `pnpm check`, uncommitted work, a
   feature mentioned in the changelog as partial, env vars in `.env.example` the code
   doesn't use yet. Unfinished work comes before new work.
3. Otherwise pick from what moves the brief's **one action** forward for the **first
   user**: usually something that gets a real person to use it this week, not polish.
4. Offer **three options**, each as:
   - **What:** one sentence a user would notice.
   - **Why now:** tied to the brief.
   - **Size:** small (an hour), medium (an afternoon), large (split it first).
   - **Prompt:** the exact request to paste. Tell them to press Shift+Tab into plan mode first.
5. Recommend one and say why in a sentence. Then stop; the person chooses.
