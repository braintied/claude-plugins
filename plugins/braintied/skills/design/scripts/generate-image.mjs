#!/usr/bin/env node
// Generate one image with OpenAI's GPT Image model and save it as a file.
//
//   node generate-image.mjs --prompt-file docs/brand/prompts/hero.txt \
//     --out public/images/hero.png [--size 1536x1024] [--quality high] \
//     [--model gpt-image-2.5-flare]
//
// Reads OPENAI_API_KEY from the environment or from .env.local in the
// current folder. Never prints the key.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "prompt-file": { type: "string" },
    prompt: { type: "string" },
    out: { type: "string" },
    size: { type: "string", default: "1536x1024" },
    quality: { type: "string", default: "high" },
    model: { type: "string", default: "gpt-image-2.5-flare" },
  },
});

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!values.out) fail("Missing --out <path.png>");
const prompt = values.prompt ?? (values["prompt-file"] ? readFileSync(values["prompt-file"], "utf8") : null);
if (!prompt?.trim()) fail("Missing --prompt-file <file.txt> (or --prompt \"...\")");

const match = /^(\d+)x(\d+)$/.exec(values.size);
if (!match) fail(`--size must look like 1536x1024, got "${values.size}"`);
const [width, height] = [Number(match[1]), Number(match[2])];
const pixels = width * height;
if (width % 16 || height % 16) fail("Both edges must be multiples of 16.");
if (Math.max(width, height) > 3840) fail("The longest edge must be 3840 or less.");
if (Math.max(width, height) / Math.min(width, height) > 3) fail("The aspect ratio must be 3:1 or narrower.");
if (pixels < 655_360 || pixels > 8_294_400) fail("Total pixels must be between 655,360 and 8,294,400.");

if (!process.env.OPENAI_API_KEY) {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // no .env.local; handled below
  }
}
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) fail("OPENAI_API_KEY is not set. Add it to .env.local (get one at platform.openai.com/api-keys).");

console.log(`Generating ${values.size} with ${values.model} (quality ${values.quality})...`);
const response = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: values.model,
    prompt,
    size: values.size,
    quality: values.quality,
    n: 1,
  }),
});

const body = await response.json();
if (!response.ok) fail(`OpenAI error ${response.status}: ${body?.error?.message ?? JSON.stringify(body)}`);
const b64 = body?.data?.[0]?.b64_json;
if (!b64) fail("OpenAI returned no image data.");

mkdirSync(dirname(values.out), { recursive: true });
writeFileSync(values.out, Buffer.from(b64, "base64"));
console.log(`Saved ${values.out}`);
