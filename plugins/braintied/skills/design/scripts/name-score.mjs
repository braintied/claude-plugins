#!/usr/bin/env node
// Rank name candidates with @braintied/naming. Its load-bearing term is an
// obviousness penalty: a name ranks worse for being the word an outsider would
// reach for first ("Fresh Catch" for a fish service).
//
//   node name-score.mjs names.json
//
// names.json:
// {
//   "insider":  ["words the trade itself uses"],
//   "outsider": ["words a stranger would use to describe it"],
//   "blocked":  ["names already taken nearby"],
//   "candidates": [{ "name": "Nustem", "strategy": "jargon", "source": "nustem", "rationale": "Konkani for fish" }]
// }
// strategy is one of: jargon, clip, bend, coined, plain.
import { readFileSync } from "node:fs";
import { load } from "./_load.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node name-score.mjs names.json");
  process.exit(1);
}
const input = JSON.parse(readFileSync(file, "utf8"));
const naming = await load("@braintied/naming");
const ranked = naming.rankCandidates(input.candidates, {
  insider: input.insider ?? [],
  outsider: input.outsider ?? [],
  blocked: input.blocked ?? [],
});
for (const c of ranked) {
  const why = c.breakdown.filter((x) => x.delta).map((x) => `${x.label} ${x.delta > 0 ? "+" : ""}${x.delta.toFixed(2)}`).join(", ");
  const stop = c.disqualifiers.length ? `  DO NOT SHIP: ${c.disqualifiers.join("; ")}` : "";
  console.log(`${c.name.padEnd(18)} ${c.score.toFixed(2)}  spell ${c.spellability.toFixed(2)}  wordmark ${c.wordmark.toFixed(2)}${stop}\n    ${why}`);
}
