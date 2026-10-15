#!/usr/bin/env node
// Audit the words on the running site, page by page, as a visitor reads them.
//
//   node copy-audit.mjs --site http://localhost:3000 --pages /,/how-it-works,/join
//
// For each page: @braintied/prose's audit in the brand voice (slop patterns,
// manufactured triads, meta commentary, repetition), this skill's banned words and
// exclamation marks, and every number on the page so you can check each one against
// the brief's "Can't claim yet" line. Exits 1 if anything is flagged.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { load } from "./_load.mjs";

const { values } = parseArgs({
  options: { site: { type: "string", default: "http://localhost:3000" }, pages: { type: "string", default: "/" } },
});

const prose = await load("@braintied/prose");
let chromium;
try {
  const require = createRequire(pathToFileURL(`${process.cwd()}/package.json`));
  const mod = await import(pathToFileURL(require.resolve("playwright")).href);
  chromium = mod.chromium ?? mod.default?.chromium;
  if (!chromium) throw new Error("no chromium export");
} catch {
  console.error("playwright isn't installed in this project. Run:\n  pnpm add -D playwright && pnpm exec playwright install chromium");
  process.exit(2);
}

// Hype that reads as generated. @braintied/prose 2.x carries its own list for brand
// copy; until a project has it, these are checked here.
const BANNED = /\b(unlock|seamless(ly)?|revolutioni[sz]e|elevate|empower|cutting[- ]edge|game[- ]changer|next[- ]level|world[- ]class|curated|effortless(ly)?|delightful|journey|supercharge|reimagine|transform your|in today's fast[- ]paced)\b/gi;

const browser = await chromium.launch();
let flagged = 0;
for (const path of values.pages.split(",")) {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(`${values.site}${path}`, { waitUntil: "networkidle" });
  // The page's own words: main content, without the header and footer every page shares.
  const text = await page.evaluate(() => (document.querySelector("main") ?? document.body).innerText);
  await page.close();

  const notes = [];
  const audit = prose.auditProse(text, { context: "brand" });
  for (const v of audit.violations ?? []) notes.push(`prose ${v.rule} (${v.severity}): "${String(v.found ?? "").trim().slice(0, 90)}"`);
  for (const m of new Set((text.match(BANNED) ?? []).map((w) => w.toLowerCase()))) notes.push(`banned word: "${m}"`);
  if (/!/.test(text)) notes.push("an exclamation mark");
  const numbers = [...new Set((text.match(/(?:[$₹€£] ?)?\d[\d,.:]*(?: ?(?:%|pm|am|km|min(?:utes)?|hours?|days?)\b)?/gi) ?? []).map((n) => n.replace(/[.,:]$/, "").toLowerCase()))];

  flagged += notes.length;
  console.log(`\n${notes.length ? "✗" : "✓"} ${path}  (${audit.stats?.wordCount ?? "?"} words)`);
  for (const n of notes) console.log(`    ${n}`);
  if (numbers.length) console.log(`    numbers to check against "Can't claim yet": ${numbers.join(" · ")}`);
}
await browser.close();
process.exit(flagged ? 1 : 0);
