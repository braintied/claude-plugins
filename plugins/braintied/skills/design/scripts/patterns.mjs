#!/usr/bin/env node
// The section-pattern catalog from @braintied/site-engine: what a section can
// be, how to build it, what it must not turn into.
//
//   node patterns.mjs                      every pattern, one line each
//   node patterns.mjs --role thesis        full build notes for one role
//   node patterns.mjs --id specimen-ledger full build notes for one pattern
//   node patterns.mjs --engines css,scroll which patterns this site can build
//
// Engines: css (always), canvas2d, scroll (a scroll library), gsap, webgl.
// Say only the engines the project really has; a pattern that needs a missing
// engine is listed as blocked, and a still pattern is offered instead.
import { parseArgs } from "node:util";
import { load } from "./_load.mjs";

const { values } = parseArgs({
  options: { role: { type: "string" }, id: { type: "string" }, engines: { type: "string", default: "css" } },
});
const se = await load("@braintied/site-engine");
const surface = { engines: values.engines.split(",").map((e) => e.trim()), respectsReducedMotion: true };
// These only work with real records: attributed quotes, credentials, stated terms.
// A product that isn't live yet has none.
const NEEDS_RECORDS = new Set(["attributed-review-wall", "credential-strip", "risk-reversal-band"]);
const blocked = new Map(se.auditSurface(se.SECTION_PATTERNS, surface).map((b) => [b.patternId, b.missingEngines]));

const full = (p) =>
  [
    `## ${p.id}  [${p.role}]${blocked.has(p.id) ? `  BLOCKED: needs ${blocked.get(p.id).join(", ")}` : ""}`,
    `Job: ${p.job}`,
    `Build: ${p.prompt}`,
    `Constraints:\n${p.constraints.map((c) => `  - ${c}`).join("\n")}`,
    `A reviewer checks:\n${p.criticChecks.map((c) => `  - ${c}`).join("\n")}`,
    `Not this: ${p.notThis}`,
    "",
  ].join("\n");

const chosen = se.SECTION_PATTERNS.filter((p) => (!values.role || p.role === values.role) && (!values.id || p.id === values.id));
if (!chosen.length) {
  console.error(`No pattern matches. Roles: ${se.SECTION_ROLES.join(", ")}`);
  process.exit(1);
}
if (values.role || values.id) {
  console.log(chosen.map(full).join("\n"));
  for (const role of new Set(chosen.map((p) => p.role))) {
    const usable = se.SECTION_PATTERNS.filter((p) => p.role === role && !blocked.has(p.id));
    if (chosen.some((p) => p.role === role && blocked.has(p.id))) {
      console.log(usable.length
        ? `Usable ${role} patterns on these engines: ${usable.map((p) => p.id).join(", ")}`
        : `No ${role} pattern works on these engines. Compose a still one and write its recipe in the plan (05, plan rules).`);
    }
  }
} else {
  for (const role of se.SECTION_ROLES) {
    const inRole = chosen.filter((p) => p.role === role);
    if (!inRole.length) continue;
    console.log(`${role}`);
    for (const p of inRole) {
      const mark = blocked.has(p.id) ? "✗" : NEEDS_RECORDS.has(p.id) ? "r" : "✓";
      console.log(`  ${mark} ${p.id.padEnd(26)} ${p.job}`);
    }
    if (inRole.every((p) => blocked.has(p.id))) console.log(`  → nothing usable on these engines: compose a still ${role} and write its recipe in the plan.`);
  }
  console.log(`\nEngines declared: ${surface.engines.join(", ")}. ✗ = needs an engine this site doesn't have. r = needs real records (quotes, credentials, terms).`);
}
