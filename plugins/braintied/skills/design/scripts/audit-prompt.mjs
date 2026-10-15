#!/usr/bin/env node
// Check image prompts before spending money: @braintied/prompt-craft's
// anti-slop audit, plus the arrangement check this skill adds (rows of
// identical objects read as a product shot).
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
const ARRANGED = /\b(side by side|in a (neat )?row|lined up|evenly spaced|symmetrical(ly)?|perfectly arranged|in a grid)\b/i;
const NO_IMPERFECTION = /imperfection:/i;

let problems = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const audit = pc.auditImagePrompt(text, { model: "gpt-image-2.5-flare", quality: "high" });
  const notes = [...audit.errors, ...audit.warnings].map((f) => f.message ?? String(f));
  if (ARRANGED.test(text)) notes.push(`"${text.match(ARRANGED)[0]}" arranges objects like a product shot; say how they were put down instead.`);
  if (!NO_IMPERFECTION.test(text)) notes.push("No 'Imperfection:' line. Name one.");
  problems += notes.length;
  console.log(`${notes.length ? "✗" : "✓"} ${file}${notes.map((n) => `\n    ${n}`).join("")}`);
}
process.exit(problems ? 1 : 0);
