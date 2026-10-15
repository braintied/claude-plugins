#!/usr/bin/env node
// Talks to Braintied Academy through its CLI (@braintied/academy), quietly.
//
//   node academy.mjs progress
//   node academy.mjs signal <name> [key=value ...]
//
// Optional by design: if the learner never ran `npx @braintied/academy login`,
// this prints one short hint the first time and nothing after that. It never
// fails the command that called it (exit code is always 0), so a missing
// login or a dropped connection can't break /ship-it or /design.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CLI = "@braintied/academy@0.1";
const [command, ...rest] = process.argv.slice(2);

function academy(args) {
  const result = spawnSync("npx", ["-y", CLI, ...args], {
    encoding: "utf8",
    timeout: 60_000,
    shell: process.platform === "win32", // npx is npx.cmd on Windows
  });
  return { code: result.status, out: (result.stdout ?? "").trim() };
}

// Same folder the CLI keeps its login in.
function configDir() {
  if (process.env.ACADEMY_CONFIG_DIR) return process.env.ACADEMY_CONFIG_DIR;
  if (process.env.XDG_CONFIG_HOME) return join(process.env.XDG_CONFIG_HOME, "braintied");
  return join(homedir(), ".config", "braintied");
}

function hintOnce() {
  const marker = join(configDir(), "academy-hint-shown");
  if (existsSync(marker)) return;
  console.log("Academy (optional): track your progress at braintied.com/academy with `npx @braintied/academy login`.");
  try {
    mkdirSync(configDir(), { recursive: true });
    writeFileSync(marker, new Date().toISOString());
  } catch {
    // can't write the marker; the hint may show again, which is harmless
  }
}

if (command !== "progress" && command !== "signal") {
  console.log("Usage: academy.mjs progress | signal <name> [key=value ...]");
  process.exit(0);
}

if (academy(["whoami"]).code !== 0) {
  if (command === "progress") {
    console.log("You're not signed in to Braintied Academy. It's optional; to track progress run:");
    console.log("  npx @braintied/academy login");
  } else {
    hintOnce();
  }
  process.exit(0);
}

if (command === "progress") {
  const { code, out } = academy(["progress"]);
  // Plain text for Claude to relay: drop the CLI's colors and make "Next:" a full link.
  const plain = out.replace(/\x1b\[[0-9;]*m/g, "").replace(/Next: (\S+)/g, "Next: https://braintied.com/academy/$1");
  console.log(code === 0 ? plain : "Academy: couldn't load progress right now (offline?).");
  process.exit(0);
}

const [name, ...pairs] = rest;
if (!name) {
  console.log("Usage: academy.mjs signal <name> [key=value ...]");
  process.exit(0);
}
const args = ["signal", name];
if (pairs.length) args.push("--payload", pairs.join(","));
const { code, out } = academy(args);
if (code === 0) {
  console.log(out.includes("Lesson completed") ? `Academy: logged ${name}. Lesson completed!` : `Academy: logged ${name}.`);
} else {
  console.log(`Academy: couldn't log ${name} right now (offline?). Run /learn later to retry.`);
}
