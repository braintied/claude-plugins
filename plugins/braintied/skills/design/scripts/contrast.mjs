#!/usr/bin/env node
// Print the contrast ratios that matter for the brand tokens in globals.css,
// for light (:root) and dark (the prefers-color-scheme: dark block).
//
//   node contrast.mjs src/app/globals.css
//
// Passes at 4.5:1 (WCAG AA for body text). Exits 1 if any pair fails.
import { existsSync, readFileSync } from "node:fs";

const file = process.argv[2] ?? "src/app/globals.css";
if (!existsSync(file)) {
  console.error(`No ${file}. Run this from the project folder.`);
  process.exit(1);
}
const css = readFileSync(file, "utf8");

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\b/g)) out[m[1]] = m[2];
  return out;
}

const lightBlock = css.match(/:root\s*{([^}]*)}/)?.[1] ?? "";
const darkBlock = css.match(/prefers-color-scheme:\s*dark\)\s*{\s*:root\s*{([^}]*)}/)?.[1] ?? "";

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const pairs = [
  ["foreground", "background"], ["foreground", "surface"], ["muted", "background"],
  ["muted", "surface"], ["brand-ink", "brand"], ["danger", "background"],
];

let failed = 0;
for (const [name, block] of [["light", lightBlock], ["dark", darkBlock]]) {
  const t = tokens(block);
  if (!Object.keys(t).length) { console.log(`${name}: no hex tokens found`); failed++; continue; }
  for (const [fg, bg] of pairs) {
    const absent = [fg, bg].filter((k) => !t[k]);
    if (absent.length) {
      const why = absent.map((k) => {
        const raw = block.match(new RegExp(`--${k}:\\s*([^;]+);`))?.[1]?.trim();
        return raw ? `--${k} is "${raw}"; write it as 6-digit hex` : `--${k} is missing`;
      });
      console.log(`${name}  ${fg} on ${bg}: ${why.join(", ")}`);
      failed++;
      continue;
    }
    const r = ratio(t[fg], t[bg]);
    const ok = r >= 4.5;
    if (!ok) failed++;
    console.log(`${name}  ${fg} on ${bg}: ${r.toFixed(2)}:1 ${ok ? "ok" : "FAIL"}`);
  }
}
process.exit(failed ? 1 : 0);
