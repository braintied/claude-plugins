#!/usr/bin/env node
// Screenshot the site beside its reference sites, and measure the signals that
// separate a designed page from a generated one.
//
//   node shots.mjs --site http://localhost:3000 --pages /,/how-it-works [--tag pass2]
//   node shots.mjs ... --reduced          also shoot with reduced motion
//   node shots.mjs ... --refresh-refs     re-shoot the references
//
// Reads docs/brand/references.json (written in stage 1 and 2):
//   [{ "name": "…", "url": "https://…", "governs": "the one thing this reference decides" }]
// Writes docs/brand/shots/<tag>/<page>/<scheme>-<width>(-fold).png,
// docs/brand/shots/refs/<name>-<width>.png, and docs/brand/shots/<tag>/compare.html:
// every page's first screen beside the references at the same width, with the signals.
// Open compare.html and judge from it. The signals are evidence, not the verdict.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    site: { type: "string", default: "http://localhost:3000" },
    pages: { type: "string", default: "/" },
    tag: { type: "string", default: "latest" },
    reduced: { type: "boolean", default: false },
    "refresh-refs": { type: "boolean", default: false },
  },
});

let chromium;
try {
  const require = createRequire(pathToFileURL(`${process.cwd()}/package.json`));
  const mod = await import(pathToFileURL(require.resolve("playwright")).href);
  chromium = mod.chromium ?? mod.default?.chromium;
  if (!chromium) throw new Error("no chromium export");
} catch {
  console.error("playwright isn't installed in this project. Run:\n  pnpm add -D playwright && pnpm exec playwright install chromium\nthen run this again.");
  process.exit(2);
}

const WIDTHS = [[390, 844], [1440, 900]];
const root = `docs/brand/shots/${values.tag}`;
const refs = existsSync("docs/brand/references.json") ? JSON.parse(readFileSync("docs/brand/references.json", "utf8")) : [];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Runs in the page. Samples the first screen on a grid: a point counts as
// "visual" when a picture, video, canvas, large svg or background image is under it.
function measure() {
  const vw = innerWidth, vh = innerHeight;
  const isVisual = (el) => {
    const tag = el.tagName.toLowerCase();
    if (["img", "video", "canvas", "picture"].includes(tag)) return true;
    if (tag === "svg") { const r = el.getBoundingClientRect(); return r.width > 120 && r.height > 120; }
    const bg = getComputedStyle(el).backgroundImage;
    return bg && bg !== "none" && bg.includes("url(");
  };
  let hits = 0, total = 0;
  for (let x = 0; x < 24; x++) for (let y = 0; y < 16; y++) {
    total++;
    const stack = document.elementsFromPoint((x + 0.5) * vw / 24, (y + 0.5) * vh / 16);
    if (stack.some(isVisual)) hits++;
  }
  const body = parseFloat(getComputedStyle(document.querySelector("main p, p") ?? document.body).fontSize) || 16;
  let biggest = 0;
  for (const el of document.querySelectorAll("h1, h2, h3, p, span, div, a")) {
    const r = el.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0 || !el.textContent.trim() || el.children.length > 3) continue;
    biggest = Math.max(biggest, parseFloat(getComputedStyle(el).fontSize));
  }
  const sections = [...(document.querySelector("main") ?? document.body).children].filter((s) => s.getBoundingClientRect().height > 120);
  let run = 0, longest = 0;
  for (const s of sections) {
    const visual = isVisual(s) || [...s.querySelectorAll("*")].some((el) => isVisual(el) || (el.tagName === "TABLE"));
    run = visual ? 0 : run + 1;
    longest = Math.max(longest, run);
  }
  const fullBleed = [...document.querySelectorAll("img, video, canvas, picture, section, div")]
    .filter((el) => isVisual(el) && el.getBoundingClientRect().width >= vw * 0.98).length;
  return {
    visualShare: hits / total,
    typeScale: biggest / body,
    textOnlyRun: longest,
    sections: sections.length,
    fullBleed,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
}

async function scrollThrough(page) {
  // Scroll slowly so lazy images load and scroll-driven motion runs; count the
  // animations seen on the way (CSS, Web Animations and most libraries show up).
  return page.evaluate(async () => {
    let seen = 0;
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
      seen = Math.max(seen, document.getAnimations().length);
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
    return { animations: seen, gsap: Boolean(window.gsap || window.ScrollTrigger), webgl: Boolean(document.querySelector("canvas")) };
  });
}

// Some sites refuse a headless browser's default user agent.
const UA = {
  desktop: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
  phone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
};

// Cookie banners, region pickers and discount pop-ups cover a reference's first
// screen. Decline or close what can be closed; the comparison is with the page.
async function clearOverlays(page) {
  const words = /^\s*(reject all|decline all|decline|deny|disagree and close|only necessary|necessary only|no thanks|close|dismiss|continue|got it|ok|accept all|accept|agree and close|allow all|stay|stay (in|on) .{2,30}|tout refuser|refuser|continuer sans accepter|autoriser tous les cookies|tout accepter|alle ablehnen|alle akzeptieren|rechazar todo|aceptar todo)\s*$/i;
  for (let round = 0; round < 3; round++) {
    const buttons = page.locator("button, [role=button], a").filter({ hasText: words });
    const count = await buttons.count();
    let clicked = false;
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible().catch(() => false)) {
        await button.click({ timeout: 2000 }).catch(() => {});
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      // Dialogs closed by an icon: a button labelled only "Close".
      const x = page.locator('[role=dialog] [aria-label*="close" i], [aria-modal=true] [aria-label*="close" i]').first();
      if (await x.isVisible().catch(() => false)) {
        await x.click({ timeout: 2000 }).catch(() => {});
        clicked = true;
      }
    }
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(800);
    if (!clicked) break;
  }
}

const browser = await chromium.launch();
const results = [];
let bad = 0;

for (const path of values.pages.split(",")) {
  const name = path === "/" ? "home" : slug(path);
  mkdirSync(`${root}/${name}`, { recursive: true });
  for (const scheme of ["light", "dark"]) {
    for (const [w, h] of WIDTHS) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: values.reduced ? "reduce" : "no-preference", deviceScaleFactor: w < 500 ? 2 : 1 });
      const res = await page.goto(`${values.site}${path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);
      const signals = await page.evaluate(measure);
      const motion = await scrollThrough(page);
      const file = `${root}/${name}/${scheme}-${w}`;
      await page.screenshot({ path: `${file}-fold.png` });
      await page.screenshot({ path: `${file}.png`, fullPage: true });
      if (res.status() >= 400 || signals.overflow > 0) bad++;
      results.push({ path, name, scheme, w, status: res.status(), ...signals, ...motion });
      await page.close();
    }
  }
}

const refShots = [];
mkdirSync("docs/brand/shots/refs", { recursive: true });
for (const ref of refs) {
  for (const [w, h] of WIDTHS) {
    const file = `docs/brand/shots/refs/${slug(ref.name)}-${w}.png`;
    if (!existsSync(file) || values["refresh-refs"]) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1, userAgent: UA[w < 500 ? "phone" : "desktop"], locale: "en-US" });
      try {
        await page.goto(ref.url, { waitUntil: "load", timeout: 30_000 });
        await page.waitForTimeout(5000); // studio sites run a preloader first
        await clearOverlays(page);
        await page.screenshot({ path: file });
      } catch (error) {
        console.log(`  reference ${ref.name} (${w}): ${error.message.split("\n")[0]}`);
      }
      await page.close();
    }
    if (existsSync(file)) refShots.push({ ...ref, w, file });
  }
}
await browser.close();

// The signals. Thresholds are the floor for a site that looks designed; a page
// can pass them all and still fail the verdict.
const FLOOR = { visualShare: 0.35, phoneVisualShare: 0.25, typeScale: 4, textOnlyRun: 2 };
console.log("\npage            scheme width  visual  scale  text-run  bleed  anim  overflow");
for (const r of results) {
  const flags = [];
  if (r.visualShare < (r.w > 1000 ? FLOOR.visualShare : FLOOR.phoneVisualShare)) flags.push("first screen is mostly text");
  if (r.w > 1000 && r.typeScale < FLOOR.typeScale) flags.push("no scale contrast");
  if (r.textOnlyRun > FLOOR.textOnlyRun) flags.push(`${r.textOnlyRun} text-only sections in a row`);
  if (r.overflow > 0) flags.push("sideways scroll");
  console.log(
    `${r.path.padEnd(15)} ${r.scheme.padEnd(6)} ${String(r.w).padEnd(6)} ${(r.visualShare * 100).toFixed(0).padStart(4)}%  ${r.typeScale.toFixed(1).padStart(5)}  ${String(r.textOnlyRun).padStart(8)}  ${String(r.fullBleed).padStart(5)}  ${String(r.animations).padStart(4)}  ${String(r.overflow).padStart(6)}px  ${flags.join("; ")}`,
  );
}
if (!refs.length) console.log("\nNo docs/brand/references.json, so nothing to compare against. Stage 1 asks for references.");

const rel = (p) => p.replace(`${root}/`, "").replace("docs/brand/shots/", "../");
const cell = (src, label) => `<figure><img loading="lazy" src="${src}" alt="${label}"><figcaption>${label}</figcaption></figure>`;
const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Shots · ${values.tag}</title>
<style>
:root{color-scheme:light dark;--bg:#f4f2ee;--ink:#1a1a1a;--muted:#666}
@media (prefers-color-scheme:dark){:root{--bg:#141414;--ink:#eee;--muted:#999}}
body{margin:0;padding:24px 16px;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,sans-serif}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:40px 0 8px}p{color:var(--muted);margin:0 0 16px;max-width:70ch}
.row{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;align-items:flex-start}
figure{margin:0;flex:0 0 auto}figure img{display:block;border:1px solid #8884;max-height:70vh;width:auto}
.w1440 img{width:min(720px,80vw);height:auto}.w390 img{width:200px;height:auto}
figcaption{font-size:12px;color:var(--muted);margin-top:4px}
table{border-collapse:collapse;font-size:13px}td,th{padding:4px 10px;border-bottom:1px solid #8883;text-align:left}
</style>
<h1>${values.tag}: the site beside its references</h1>
<p>Judge the first screen of each page against the references at the same width. Ask: would a stranger believe a designer made this? What does the reference do that this doesn't?</p>
${values.pages.split(",").map((path) => {
  const name = path === "/" ? "home" : slug(path);
  return [1440, 390].map((w) => `<h2>${path} at ${w}</h2><div class="row w${w}">
${cell(`${name}/light-${w}-fold.png`, "this site, light")}
${cell(`${name}/dark-${w}-fold.png`, "this site, dark")}
${refShots.filter((r) => r.w === w).map((r) => cell(rel(r.file), `${r.name}: ${r.governs ?? ""}`)).join("\n")}
</div>`).join("\n");
}).join("\n")}
<h2>Signals</h2>
<table><tr><th>page</th><th>scheme</th><th>width</th><th>visual share</th><th>type scale</th><th>text-only run</th><th>full bleed</th><th>animations</th><th>overflow</th></tr>
${results.map((r) => `<tr><td>${r.path}</td><td>${r.scheme}</td><td>${r.w}</td><td>${(r.visualShare * 100).toFixed(0)}%</td><td>${r.typeScale.toFixed(1)}×</td><td>${r.textOnlyRun}</td><td>${r.fullBleed}</td><td>${r.animations}</td><td>${r.overflow}px</td></tr>`).join("\n")}
</table>`;
writeFileSync(`${root}/compare.html`, html);
console.log(`\nOpen ${root}/compare.html`);
process.exit(bad ? 1 : 0);
