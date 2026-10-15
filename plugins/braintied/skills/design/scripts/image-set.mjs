#!/usr/bin/env node
// A whole image set from one file, so every frame shares the same world.
//
//   node image-set.mjs                          compose prompts/<id>.txt, print the plan and cost
//   node image-set.mjs --generate --sample 2    make the first two frames only (judge before the set)
//   node image-set.mjs --generate               make every frame that doesn't exist yet
//   node image-set.mjs --generate --only hero   (re)make one frame; the old take is kept
//   ... --budget 2                              refuse if the estimate is over $2
//
// Reads docs/brand/prompts.json (or --file):
//   {
//     "meta": "the world, said once: place, hour, light, film, palette (60-90 words)",
//     "lock": "the closing every frame shares: closed positives, no hype words",
//     "defaults": { "size": "1536x1024", "quality": "high" },
//     "frames": [
//       { "id": "hero", "use": "home first screen, full bleed",
//         "device": "the one formal device this frame carries",
//         "main": "this frame: shot, subject, moment, one imperfection (first 50 words carry the picture)",
//         "size": "2560x1440", "out": "public/images/hero.png",
//         "refs": ["docs/brand/refs/carrier-sheet.png"], "background": "transparent" }
//     ]
//   }
// Each prompt is meta + main + lock. Writes docs/brand/prompts/<id>.txt (so the
// audit script can read them) and docs/brand/images.json (what exists, what it
// cost, and a "describes" line you fill in after looking: it becomes the alt text).
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname } from "node:path";
import { parseArgs } from "node:util";
import { apiKey, checkSize, generateImage } from "./_image.mjs";

const { values } = parseArgs({
  options: {
    file: { type: "string", default: "docs/brand/prompts.json" },
    generate: { type: "boolean", default: false },
    only: { type: "string" },
    sample: { type: "string" },
    budget: { type: "string" },
    parallel: { type: "string", default: "4" },
  },
});

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!existsSync(values.file)) fail(`No ${values.file}. Write the set plan first (stage 4, "The set").`);
const set = JSON.parse(readFileSync(values.file, "utf8"));
if (!set.meta || !set.lock || !Array.isArray(set.frames) || !set.frames.length) {
  fail(`${values.file} needs "meta", "lock" and a non-empty "frames" list.`);
}
const defaults = { size: "1536x1024", quality: "high", ...set.defaults };

// Estimated USD by quality: [square, other] at the base sizes, measured on
// flare 2026-09/10. Bigger frames scale by pixel count. A guide, not a bill.
const BASE = { high: [0.053, 0.041], xhigh: [0.094, 0.073], max: [0.211, 0.165] };
function estimate(size, quality, refs) {
  const [w, h] = size.split("x").map(Number);
  const [square, other] = BASE[quality] ?? BASE.high;
  const base = w === h ? square * ((w * h) / 1_048_576) : other * ((w * h) / 1_572_864);
  return base + refs * 0.01;
}

const ids = new Set();
const frames = set.frames.map((f) => {
  if (!f.id || !f.main || !f.out) fail(`Every frame needs "id", "main" and "out" (problem: ${JSON.stringify(f).slice(0, 80)})`);
  if (ids.has(f.id)) fail(`Two frames are called "${f.id}".`);
  ids.add(f.id);
  const size = f.size ?? defaults.size;
  const sizeError = checkSize(size);
  if (sizeError) fail(`${f.id}: ${sizeError}`);
  const quality = f.quality ?? defaults.quality;
  const refs = f.refs ?? [];
  for (const ref of refs) if (!existsSync(ref)) fail(`${f.id}: reference ${ref} doesn't exist yet. Make it first.`);
  const prompt = [set.meta.trim(), f.main.trim(), set.lock.trim()].join("\n\n");
  const words = f.main.trim().split(/\s+/).length;
  return { ...f, size, quality, refs, prompt, words, usd: estimate(size, quality, refs.length) };
});

mkdirSync("docs/brand/prompts", { recursive: true });
for (const f of frames) writeFileSync(`docs/brand/prompts/${f.id}.txt`, `${f.prompt}\n`);

const manifestFile = "docs/brand/images.json";
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, "utf8")) : {};

console.log(`${frames.length} frames in ${values.file}. Prompts written to docs/brand/prompts/.\n`);
for (const f of frames) {
  const state = existsSync(f.out) ? "made" : "to make";
  const short = f.words < 25 ? `  (main is ${f.words} words; brief the picture, 40-120)` : !/imperfection:/i.test(f.main) ? "  (main has no 'Imperfection:' line)" : "";
  console.log(`  ${f.id.padEnd(16)} ${f.size.padEnd(10)} ${f.quality.padEnd(5)} ~$${f.usd.toFixed(3)}  ${state.padEnd(8)} ${f.use ?? ""}${short}`);
}
const total = frames.reduce((sum, f) => sum + f.usd, 0);
const audit = new URL("./audit-prompt.mjs", import.meta.url).pathname;
console.log(`\nWhole set: about $${total.toFixed(2)}. Audit before spending:\n  node "${audit}" docs/brand/prompts/*.txt`);

if (!values.generate) process.exit(0);

let todo = values.only
  ? frames.filter((f) => values.only.split(",").includes(f.id))
  : frames.filter((f) => !existsSync(f.out));
if (values.sample) todo = todo.slice(0, Number(values.sample));
if (!todo.length) fail(values.only ? `No frame called ${values.only}.` : "Every frame already exists. Use --only <id> to retake one.");

const planned = todo.reduce((sum, f) => sum + f.usd, 0);
if (values.budget && planned > Number(values.budget)) {
  fail(`These ${todo.length} frames are about $${planned.toFixed(2)}, over the $${values.budget} budget. Cut frames or use --sample.`);
}
const key = apiKey();
if (!key) fail("OPENAI_API_KEY is not set. Run `pnpm keys` in your own Terminal and paste it there (platform.openai.com/api-keys). Never paste it in the chat.");

console.log(`\nMaking ${todo.length} frame(s), ${values.parallel} at a time (each takes 20-60s)...`);
let spent = 0;
const queue = [...todo];
const failed = [];
async function worker() {
  while (queue.length) {
    const f = queue.shift();
    try {
      mkdirSync(dirname(f.out), { recursive: true });
      const r = await generateImage({ prompt: f.prompt, out: f.out, size: f.size, quality: f.quality, model: f.model, refs: f.refs, background: f.background, key });
      spent += r.usd ?? f.usd;
      const prev = manifest[f.id];
      // Every take is kept with the prompt that made it, so a retake you like
      // less can be put back and the one changed line shows in a diff.
      const take = (prev?.takes ?? 0) + 1;
      const takes = `docs/brand/takes/${f.id}`;
      mkdirSync(takes, { recursive: true });
      copyFileSync(f.out, `${takes}/take-${take}${extname(f.out)}`);
      writeFileSync(`${takes}/take-${take}.txt`, `${f.prompt}\n`);
      manifest[f.id] = {
        out: f.out,
        prompt: `docs/brand/prompts/${f.id}.txt`,
        size: f.size,
        use: f.use ?? "",
        device: f.device ?? "",
        takes: take,
        usd: Number(((prev?.usd ?? 0) + (r.usd ?? f.usd)).toFixed(3)),
        describes: prev?.describes ?? "",
      };
      console.log(`  ✓ ${f.id}  ${r.line}`);
    } catch (error) {
      failed.push(f.id);
      console.log(`  ✘ ${f.id}  ${error.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(Number(values.parallel), todo.length) }, worker));
writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nSpent about $${spent.toFixed(3)} this run. ${manifestFile} updated.`);
console.log(`Now open every frame and judge it (stage 4, "Judge the set"). Fill each "describes" line from what you see.`);
process.exit(failed.length ? 1 : 0);
