# Gaudiano Site — Project State

Living snapshot of the project. Update this file whenever a significant decision, integration, or TODO changes. See `CLAUDE.md` for brand/aesthetic context and workflow.

**Last updated:** 2026-05-06

---

## Current direction

- **Option 6** was chosen and promoted to the sole landing at `/` (`src/pages/index.astro`).
- Previous options (1, 2, 3, 5) and the selector index are preserved on branch `archive/pre-option-6-cleanup` on the remote.

## Pages

| Route | File | Status |
|---|---|---|
| `/` | `src/pages/index.astro` | Landing |
| `POST /api/contact` | `src/pages/api/contact.ts` | ⚠️ Inactive — Resend fallback (see below) |

---

## Contact form

Posts JSON directly from the browser to `https://api.web3forms.com/submit` (Web3Forms). No server-side endpoint is involved in the active flow.

**Why not Resend?** Resend requires a verified sender domain, which requires an MX record on a subdomain (e.g. `send.rominagaudiano.com`). Wix does not allow custom MX records on subdomains, and the domain DNS is currently locked to Wix (see `../dns.txt`). Web3Forms needs zero DNS config, so it works while DNS migration is pending.

### Active integration — Web3Forms

- **Endpoint:** `POST https://api.web3forms.com/submit` (form-as-a-service, no serverless function).
- **Access key:** `ec6f5c19-fc4b-4287-b6cb-66bd742a44e2` — inlined as a hidden input. Per Web3Forms docs the key is safe to be public; it cannot be used to read submissions, only to send them to the registered inbox.
- **Inbox:** the Gmail used to register at web3forms.com (Romina's). Free tier = 250 submissions/month, single-recipient. Multi-recipient requires PRO.
- **Spam protection:** double honeypot — Web3Forms native `botcheck` (hidden checkbox) + the existing custom `website` text field (re-checked client-side before submitting).

### Fields

| Name | Type | Required | Notes |
|---|---|---|---|
| `name`     | text       | yes | `autocomplete="name"` |
| `email`    | email      | yes | `autocomplete="email"` |
| `phone`    | tel        | yes | `autocomplete="tel"` |
| `message`  | textarea   | yes | 4 rows, vertically resizable |
| `subject`  | hidden     | — | `"Nueva consulta — rominagaudiano.com"` |
| `from_name`| hidden     | — | `"rominagaudiano.com"` (sender label in the email) |
| `botcheck` | checkbox (hidden) | — | Web3Forms native honeypot |
| `website`  | text (custom honeypot) | — | Filled → JS short-circuits with fake "success" |

### Inactive fallback — `src/pages/api/contact.ts` (Resend)

The Resend endpoint is preserved (still deployed, still importable) so we can swap back without rewriting if/when the DNS migration unblocks Resend. Reactivation = (1) verify the sender domain in Resend, (2) set `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` in Vercel, (3) revert the form `action` and the `fetch()` URL in `src/pages/index.astro` to `/api/contact`.

### TODOs for the form

- [ ] Submit a real test from the deployed preview and confirm the email lands in Romina's Gmail (check spam folder on first send).
- [ ] Decide long-term: stay on Web3Forms (250/mo cap, single-recipient) or migrate to Resend after DNS leaves Wix.
- [ ] Optional: add Cloudflare Turnstile or hCaptcha if the honeypots ever stop being enough.

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
