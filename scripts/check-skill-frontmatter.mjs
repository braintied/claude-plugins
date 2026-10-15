#!/usr/bin/env node
// Checks every plugins/*/skills/*/SKILL.md frontmatter, for the pre-push gate.
//
//   node scripts/check-skill-frontmatter.mjs [repo root]
//
// `claude plugin validate --strict` catches a missing block or a missing
// description, but measured on 2.1.299 it passes `name: [explain` silently, so
// a YAML syntax error would ship. This holds the frontmatter to the subset the
// skills use: top-level `key: value` lines, plain or quoted scalars, plus
// indented lines under a key with an empty or block-scalar (| >) value.
// Also: `name` matches the skill's folder and `description` is not empty.
// No dependencies, because this repo has no package.json.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] ?? process.cwd();
const errors = [];

function scalar(raw, where) {
  const v = raw.trim();
  if (v === "") return "";
  if (v.startsWith('"')) {
    if (!/^"(?:[^"\\]|\\.)*"$/.test(v)) errors.push(`${where}: unterminated or trailing text after a double-quoted value`);
    return v.slice(1, -1);
  }
  if (v.startsWith("'")) {
    if (!/^'(?:[^']|'')*'$/.test(v)) errors.push(`${where}: unterminated or trailing text after a single-quoted value`);
    return v.slice(1, -1).replaceAll("''", "'");
  }
  // YAML plain scalars cannot start with an indicator, contain ": " (a nested
  // mapping) or " #" (a comment that silently truncates the value).
  if (/^[[\]{}&*!%@`,|>#]/.test(v) || /^[-?:](\s|$)/.test(v)) {
    errors.push(`${where}: value starts with YAML indicator "${v[0]}"; quote it`);
  }
  if (/:\s/.test(v)) errors.push(`${where}: unquoted value contains ": "; quote it`);
  if (/\s#/.test(v)) errors.push(`${where}: unquoted value contains " #", which YAML reads as a comment; quote it`);
  return v;
}

function check(file, folder) {
  const where = relative(root, file);
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  if (lines[0] !== "---") return errors.push(`${where}: first line must be "---" (frontmatter block)`);
  const end = lines.indexOf("---", 1);
  if (end === -1) return errors.push(`${where}: frontmatter block is never closed with "---"`);

  const fields = {};
  let openKey = null; // key whose value continues on indented lines
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    const at = `${where}:${i + 1}`;
    if (line.trim() === "" || /^\s*#/.test(line)) continue;
    if (/^\s/.test(line)) {
      if (!openKey) errors.push(`${at}: indented line with no parent key`);
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_-]+):(?:\s(.*)|)$/);
    if (!m) {
      errors.push(`${at}: expected "key: value", got ${JSON.stringify(line.slice(0, 60))}`);
      openKey = null;
      continue;
    }
    const [, key, rest = ""] = m;
    if (key in fields) errors.push(`${at}: duplicate key "${key}"`);
    const isBlock = /^[|>][+-]?\s*$/.test(rest.trim()) || rest.trim() === "";
    fields[key] = isBlock ? "(block)" : scalar(rest, `${at} ${key}`);
    openKey = isBlock ? key : null;
  }

  if (!fields.name) errors.push(`${where}: missing "name"`);
  else if (fields.name !== folder) errors.push(`${where}: name "${fields.name}" does not match folder "${folder}"`);
  if (!fields.description) errors.push(`${where}: missing or empty "description"`);
}

let count = 0;
const pluginsDir = join(root, "plugins");
for (const plugin of existsSync(pluginsDir) ? readdirSync(pluginsDir) : []) {
  const skillsDir = join(pluginsDir, plugin, "skills");
  if (!existsSync(skillsDir)) continue;
  for (const skill of readdirSync(skillsDir)) {
    const file = join(skillsDir, skill, "SKILL.md");
    if (!existsSync(file)) continue;
    check(file, skill);
    count++;
  }
}

if (count === 0) errors.push("no SKILL.md files found under plugins/*/skills/ — wrong root?");
for (const e of errors) console.error(`  ✘ ${e}`);
if (errors.length) process.exit(1);
console.log(`  ✔ ${count} SKILL.md frontmatter blocks parse and name their folder`);
