# Gaudiano Site — Project State

Living snapshot of the project. Update this file whenever a significant decision, integration, or TODO changes. See `CLAUDE.md` for brand/aesthetic context and workflow.

**Last updated:** 2026-04-24

---

## Current direction

- **Option 6** was chosen and promoted to the sole landing at `/` (`src/pages/index.astro`).
- Previous options (1, 2, 3, 5) and the selector index are preserved on branch `archive/pre-option-6-cleanup` on the remote.

## Pages

| Route | File | Status |
|---|---|---|
| `/` | `src/pages/index.astro` | Landing |
| `POST /api/contact` | `src/pages/api/contact.ts` | Serverless endpoint (Resend) |

---

## Contact form

Posts JSON to `POST /api/contact` (Vercel serverless function) which validates input, re-checks the honeypot server-side, and sends via Resend.

### Fields

| Name | Type | Required | Notes |
|---|---|---|---|
| `name`    | text      | yes | `autocomplete="name"` |
| `email`   | email     | yes | `autocomplete="email"` |
| `phone`   | tel       | yes (client) / optional (server) | `autocomplete="tel"` |
| `message` | textarea  | yes | 4 rows, vertically resizable |
| `website` | text (honeypot) | no | Hidden off-screen; filled → server returns `{ ok: true }` without sending |

### Required env vars (Vercel → Settings → Environment Variables)

See `.env.example`. All three must be set for the endpoint to succeed:

- `RESEND_API_KEY` — Resend API key.
- `CONTACT_TO_EMAIL` — inbox that receives consultas (e.g. `romina@rominagaudiano.com`).
- `CONTACT_FROM_EMAIL` — verified sender (requires a domain verified in Resend).

If any is missing, the endpoint returns `500` with `"Servicio de correo no configurado."`.

### Pre-launch TODOs for the form

- [ ] Sign up for Resend and verify the sending domain.
- [ ] Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in Vercel.
- [ ] Test end-to-end from a deployed preview URL (local dev can't hit Resend unless `vercel dev` is used with secrets).
- [ ] Optional: add Cloudflare Turnstile (free, invisible) for stronger spam protection beyond the honeypot.

---

## WhatsApp floating button

- Fixed bottom-right, brand-green circle, SVG icon.
- `aria-label="Contactar por WhatsApp"`, opens in new tab.
- Prefilled message: *"Hola Romina, me gustaría saber más sobre la mentoría."*

### Phone number

Live URL: `https://wa.me/5491154697343?text=...` (Romina's AR mobile +54 9 11 5469-7343).

---

## Stack

- **Astro 6** with `@astrojs/vercel` adapter → static pages + serverless API routes on Vercel.
- **Tailwind CSS 4** via `@tailwindcss/vite`.
- **`@astrojs/sitemap`** → `sitemap-index.xml` generated at build.
- **Fonts self-hosted** via `@fontsource/playfair-display` + `@fontsource/lora` (latin-only, specific weights) — no Google Fonts CDN.
- **Images** in `src/assets/` served through Astro's `<Image />` component (responsive `srcset`, on-the-fly compression; hero ~512kB → ~40kB at display sizes).
- **No GSAP** — all entrance reveals are CSS / IntersectionObserver.

### Commands

```bash
npm run dev      # localhost:4321
npm run build    # → ./dist (static) + .vercel/output (Vercel build output)
npm run preview
```

## Hosting / deploy

- **Hosting:** Vercel (decided 2026-04-24).
- Repo: `github.com/kirigaya97/gaudiano-site`, branch `master` = deploy branch.
- First deploy steps:
  1. Import the GitHub repo in Vercel.
  2. Set the three env vars above (Production + Preview).
  3. Add custom domain; update `SITE` in `astro.config.mjs` to match, and the `Sitemap:` line in `public/robots.txt`.
  4. Verify sending domain in Resend.

---

## Open TODOs (summary)

- [ ] **Domain.** Pick it (rominagaudiano.com?), configure in Vercel, update `astro.config.mjs` `SITE` and `robots.txt`.
- [ ] **Resend setup.** Domain verification + API key + Vercel env vars (see Contact form section).
- [ ] **OG image.** Add `public/og-image.jpg` (1200×630) so unfurls look premium; BaseLayout references `/og-image.jpg` by default.
- [ ] **Apple touch icon.** Add `public/apple-touch-icon.png` (180×180) — layout references `/apple-touch-icon.png`.
- [ ] **A11y pass.** Keyboard-focus visibility (the page uses `cursor: none` globally — verify focus rings survive), form tab order, contrast on cashmere-over-cream strips.
- [ ] **Legal footer.** Once the form captures PII, add a minimal privacy note + `/privacidad` page (Argentina Ley 25.326).
- [ ] **Analytics decision.** Plausible / Vercel Analytics / none.
- [ ] **Stale top-of-page comment in `index.astro`** is already cleaned — leave as reference.
