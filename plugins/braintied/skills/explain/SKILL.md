---
name: explain
description: Explain how something in this project works — a feature, a file, an error, a concept like row-level security or server actions — in plain language for someone learning to build, using the project's own code as the example. Use when someone asks "how does X work", "what is X", "why did that happen", "what does this file do", or types /explain.
---

# Explain

The person is learning. The goal is that they understand well enough to make the next
change themselves, or to ask for it precisely.

1. **Find the real thing.** Read `docs/architecture.md` and the matching lesson in
   `docs/learn/` if the project has them, then the actual code. Never explain from
   general knowledge when the project's own code can show it.
2. **Start with what it does for a person using the app**, in one sentence, before any
   mechanism.
3. **Walk the path** through the files, in order, as a short numbered list with
   clickable `path:line` references. Name each piece of the stack as it appears
   ("this is the server action", "here RLS steps in").
4. **One analogy at most**, and only if it's accurate.
5. **Show one small, safe experiment** they can try to see it for themselves (change a
   word and reload; trigger the job in the Inngest dashboard; run a read-only query
   with the database MCP).
6. **Link the lesson** in `docs/learn/` for more, if one exists.

Rules: no jargon without a five-word definition the first time; under 250 words unless
they ask for more; if the honest answer is "this part is fragile" or "this is a
shortcut", say so.

If it's an error message: say what it means in one sentence, the most likely cause in
this project, and the fix. Check `docs/runbook.md` first if it exists.
