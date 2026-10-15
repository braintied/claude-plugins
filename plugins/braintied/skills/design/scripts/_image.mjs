// One image from OpenAI's GPT Image models, saved to a file, with its cost.
// Shared by generate-image.mjs (one frame) and image-set.mjs (a whole set).
//
// Model facts (from @braintied/prompt-craft MODEL_FACTS, 2026-10):
// - gpt-image-2.5-flare: text-to-image, fast and cheap. The default.
// - gpt-image-2.5-sunburst: edits and reference images (up to 16). Use it when
//   frames must share a subject, or for a transparent cutout from a reference.
// - quality: high (default), xhigh (finals, about 1.8x high), max (slow).
// - Never pass input_fidelity to either 2.5 model; it returns 400.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname } from "node:path";

// USD per million tokens. They reproduce the measured $0.053 for a 1024x1024
// high image on flare; the reference-image rate is OpenAI's published GPT Image
// input rate, not yet checked against a bill. Update them when the pricing page changes.
const RATES = { textIn: 5, imageIn: 10, imageOut: 30 };

export function checkSize(size) {
  const match = /^(\d+)x(\d+)$/.exec(size);
  if (!match) return `size must look like 1536x1024, got "${size}"`;
  const [w, h] = [Number(match[1]), Number(match[2])];
  if (w % 16 || h % 16) return "both edges must be multiples of 16";
  if (Math.max(w, h) > 3840) return "the longest edge must be 3840 or less";
  if (Math.max(w, h) / Math.min(w, h) > 3) return "the aspect ratio must be 3:1 or narrower";
  if (w * h < 655_360 || w * h > 8_294_400) return "total pixels must be between 655,360 and 8,294,400";
  return null;
}

export function apiKey() {
  if (!process.env.OPENAI_API_KEY) {
    try {
      process.loadEnvFile(".env.local");
    } catch {
      // no .env.local; the caller reports the missing key
    }
  }
  const key = process.env.OPENAI_API_KEY;
  // The starter's .env.example ships a placeholder like "sk-...": that's no key.
  return key && !key.includes("...") ? key : null;
}

function cost(usage) {
  if (!usage) return { usd: null, line: "No usage returned, so no cost." };
  const textIn = usage.input_tokens_details?.text_tokens ?? usage.input_tokens ?? 0;
  const imageIn = usage.input_tokens_details?.image_tokens ?? 0;
  const imageOut = usage.output_tokens_details?.image_tokens ?? usage.output_tokens ?? 0;
  const usd = (textIn * RATES.textIn + imageIn * RATES.imageIn + imageOut * RATES.imageOut) / 1_000_000;
  return { usd, line: `${textIn} prompt, ${imageIn} reference, ${imageOut} image tokens. About $${usd.toFixed(3)}.` };
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

/**
 * @param {{ prompt: string, out: string, size?: string, quality?: string, model?: string,
 *           background?: "transparent" | "opaque" | "auto", refs?: string[], key: string }} o
 * @returns {Promise<{ out: string, usd: number | null, line: string }>}
 */
export async function generateImage(o) {
  const size = o.size ?? "1536x1024";
  const quality = o.quality ?? "high";
  const refs = o.refs ?? [];
  const model = o.model ?? (refs.length ? "gpt-image-2.5-sunburst" : "gpt-image-2.5-flare");
  const format = extname(o.out).slice(1) === "webp" ? "webp" : "png";
  if (o.background === "transparent" && format !== "png" && format !== "webp") {
    throw new Error(`${o.out}: a transparent image must be .png or .webp`);
  }
  const headers = { Authorization: `Bearer ${o.key}` };

  let response;
  try {
    if (refs.length) {
      // Reference images go to the edits endpoint as multipart form data.
      const form = new FormData();
      form.set("model", model);
      form.set("prompt", o.prompt);
      form.set("size", size);
      form.set("quality", quality);
      form.set("output_format", format);
      if (o.background) form.set("background", o.background);
      for (const ref of refs) {
        const type = MIME[extname(ref).toLowerCase()] ?? "image/png";
        form.append("image[]", new Blob([readFileSync(ref)], { type }), basename(ref));
      }
      response = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers, body: form });
    } else {
      const body = { model, prompt: o.prompt, size, quality, n: 1, output_format: format };
      if (o.background) body.background = o.background;
      response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
  } catch (error) {
    throw new Error(`${o.out}: couldn't get an answer from OpenAI (${error.message}). Check the internet and run it again.`);
  }

  const json = await response.json();
  if (!response.ok) throw new Error(`${o.out}: OpenAI ${response.status}: ${json?.error?.message ?? JSON.stringify(json)}`);
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${o.out}: OpenAI returned no image data`);
  mkdirSync(dirname(o.out), { recursive: true });
  writeFileSync(o.out, Buffer.from(b64, "base64"));
  return { out: o.out, ...cost(json.usage) };
}
