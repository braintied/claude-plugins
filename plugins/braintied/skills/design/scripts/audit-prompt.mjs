#!/usr/bin/env node
// Check image prompts before spending money: @braintied/prompt-craft's
// anti-slop audit (3.1.0+ also flags objects arranged like a product shot:
// "side by side", "lined up", "in a row"), plus this skill's rule that every
// prompt names one imperfection.
//
//   node audit-prompt.mjs docs/brand/prompts/*.txt
import { readFileSync } from "node:fs";
import { load } from "./_load.mjs";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: node audit-prompt.mjs <prompt.txt> [...]");
  process.exit(1);
}
const pc = await load("@braintied/prompt-craft");
if (!("ARRANGEMENT_PROVENANCE" in pc)) {
  console.error("This @braintied/prompt-craft is older than 3.1.0 and misses the arrangement rule. Run:\n  pnpm add -D @braintied/prompt-craft@latest");
  process.exit(2);
}
const NO_IMPERFECTION = /imperfection:/i;

let problems = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const audit = pc.auditImagePrompt(text, { model: "gpt-image-2.5-flare", quality: "high" });
  const notes = [...audit.errors, ...audit.warnings].map((f) => f.message ?? String(f));
  if (!NO_IMPERFECTION.test(text)) notes.push("No 'Imperfection:' line. Name one.");
  problems += notes.length;
  console.log(`${notes.length ? "✗" : "✓"} ${file}${notes.map((n) => `\n    ${n}`).join("")}`);
}
process.exit(problems ? 1 : 0);
