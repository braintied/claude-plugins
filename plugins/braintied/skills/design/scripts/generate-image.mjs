#!/usr/bin/env node
// Generate one image with OpenAI's GPT Image model and save it as a file.
//
//   node generate-image.mjs --prompt-file docs/brand/prompts/hero.txt \
//     --out public/images/hero.png [--size 1536x1024] [--quality high] \
//     [--model gpt-image-2.5-flare] [--ref docs/brand/refs/sheet.png ...] \
//     [--background transparent]
//
// With --ref, the image is made from reference images on the edits endpoint
// (gpt-image-2.5-sunburst by default). For a whole set, use image-set.mjs.
// Reads OPENAI_API_KEY from the environment or from .env.local in the
// current folder. Never prints the key.
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { apiKey, checkSize, generateImage } from "./_image.mjs";

const { values } = parseArgs({
  options: {
    "prompt-file": { type: "string" },
    prompt: { type: "string" },
    out: { type: "string" },
    size: { type: "string", default: "1536x1024" },
    quality: { type: "string", default: "high" },
    model: { type: "string" },
    ref: { type: "string", multiple: true, default: [] },
    background: { type: "string" },
  },
});

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!values.out) fail("Missing --out <path.png>");
const prompt = values.prompt ?? (values["prompt-file"] ? readFileSync(values["prompt-file"], "utf8") : null);
if (!prompt?.trim()) fail("Missing --prompt-file <file.txt> (or --prompt \"...\")");
const sizeError = checkSize(values.size);
if (sizeError) fail(`--size: ${sizeError}`);
const key = apiKey();
if (!key) fail("OPENAI_API_KEY is not set. Run `pnpm keys` in your own Terminal and paste it there (platform.openai.com/api-keys). Never paste it in the chat.");

console.log(`Generating ${values.size} (quality ${values.quality})${values.ref.length ? ` from ${values.ref.length} reference(s)` : ""}...`);
try {
  const result = await generateImage({
    prompt,
    out: values.out,
    size: values.size,
    quality: values.quality,
    model: values.model,
    refs: values.ref,
    background: values.background,
    key,
  });
  console.log(`Saved ${result.out}`);
  console.log(`Tokens: ${result.line}`);
} catch (error) {
  fail(error.message);
}
