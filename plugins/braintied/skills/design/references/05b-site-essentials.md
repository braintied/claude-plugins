# Stage 5b · Site essentials

The parts of a site nobody sees until they are missing: the link preview in WhatsApp,
the tab icon, the page that says "not found". Each one is a place the site either stays
in its world or falls back to a default. Build them with the pages, not after.

All of these are Next.js App Router file conventions: a file with the right name in
`src/app/` (or a page's folder) and Next wires it up.

## Titles and descriptions, per page

Every `page.tsx` exports its own `metadata`. The layout sets a template so each page only
writes its own part:

```ts
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Nustem: Mapusa market fish at your door by ten", template: "%s · Nustem" },
  description: "<the brief's one sentence, in the voice>",
};

// src/app/how-it-works/page.tsx
export const metadata: Metadata = { title: "How a delivery goes", description: "<this page's job>" };
```

A description is the sentence you would say to someone who asked "what's on that
page?". Not keywords.

## The share image: `src/app/opengraph-image.tsx`

This is what appears when the link is pasted into WhatsApp, Slack or X. Draw it in code
with `ImageResponse` from `next/og`, in the brand's own type and colours: no AI image,
no stock photo, no text in a generated picture. 1200×630.

- Compose it like the site's first screen: the wordmark, the one sentence, the
  invariant. The page form applies here too (a ticket, a menu card, a job card).
- `ImageResponse` can't read your `next/font` fonts. Install the face from Fontsource
  (`pnpm add -D @fontsource/<family>`, e.g. `@fontsource/rozha-one`) and read its
  `.woff` with `readFile(join(process.cwd(), "node_modules/@fontsource/<family>/files/<family>-latin-400-normal.woff"))`.
  `ImageResponse` reads `.woff` and `.ttf`, not `.woff2`.
- Colours: `ImageResponse` can't read CSS variables, so import them from one small
  `src/lib/brand.ts` that mirrors the light tokens, with a comment pointing at
  `globals.css`. That file and `globals.css` are the only two places a hex appears.
- A page can have its own (`src/app/how-it-works/opengraph-image.tsx`) when its job
  is different enough to deserve one.

Check it by opening `/opengraph-image` in the browser.

## The icon: `src/app/icon.tsx` and `src/app/apple-icon.tsx`

Also drawn with `ImageResponse`: the mark from stage 3, or the wordmark's first letter
with the invariant's one detail. 32×32 for `icon`, 180×180 for `apple-icon`. Delete
the starter's `favicon.ico` so the new icon is the one browsers use.

## Sitemap and robots: `src/app/sitemap.ts`, `src/app/robots.ts`

List the public pages. Keep the CRM and login out of both: `robots.ts` disallows
`/crm` and `/login`.

## Not found: `src/app/not-found.tsx`

A 404 in the world's voice, with the header, one line, and a way back. The fish site's
"Nothing on the ice at this address." beats "404 | This page could not be found."

## Privacy: `/privacy`

The waitlist collects a name and an email, so say: what is stored, where (Supabase),
who sees it (the founder), what it's used for (one email when it opens), and how to be
removed (reply, or the address). Five short paragraphs, in the voice, no legal
boilerplate pretending to be more than it is. Link it from the footer and next to the
form.

## Footer

The page list again, the privacy link, and one line from the world. The footer is the
last thing the visitor reads; make it the invariant's last appearance, not a copyright
line.

## Check

- `pnpm build` lists every page, `/opengraph-image`, `/icon`, `/sitemap.xml` and
  `/robots.txt`.
- Open `/opengraph-image` and `/icon` and look at them.
- Visit a made-up URL and see the 404.
- Every page has a different `<title>`.
