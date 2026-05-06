# Romina Gaudiano — Mentoría

Landing page for Romina Gaudiano (Reprogramación Mental Aplicada / mentoría 1:1 + CryptoMind Pro Elite).

**Live:** [https://mentoria.rominagaudiano.com](https://mentoria.rominagaudiano.com)

---

## Stack

- **[Astro 6](https://astro.build/)** with the **[`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/)** adapter — static pages + serverless API routes.
- **[Tailwind CSS 4](https://tailwindcss.com/)** via `@tailwindcss/vite`.
- **[`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** — generates `sitemap-index.xml` at build.
- **Self-hosted fonts** via `@fontsource/playfair-display` + `@fontsource/lora` (latin-only subsets, only the weights actually used). No Google Fonts CDN.
- **Astro `<Image />`** for responsive images served from `src/assets/`.
- **Vercel Web Analytics** (`@vercel/analytics`) + **Speed Insights** (`@vercel/speed-insights`) — wired in `BaseLayout.astro`, activated from the Vercel dashboard.
- **No client-side framework, no GSAP** — entrance reveals are CSS / IntersectionObserver.

---

## Project structure

```
src/
├── assets/              # source images (compressed via <Image />)
├── components/          # shared Astro components
├── layouts/
│   └── BaseLayout.astro # <head>, fonts, Analytics, SpeedInsights
├── pages/
│   ├── index.astro      # the landing
│   └── api/
│       └── contact.ts   # ⚠️ inactive Resend fallback (see below)
└── styles/
    └── global.css
public/                  # static assets served as-is (favicons, og-image, etc.)
```

The single landing at `/` was promoted from "Option 6" — see `PROJECT_STATE.md` for history. Earlier exploratory variants live on the remote branch `archive/pre-option-6-cleanup`.

---

## Commands

All run from the project root:

| Command           | Action                                        |
| :---------------- | :-------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Dev server at `localhost:4321`                |
| `npm run build`   | Production build to `./dist/` + `.vercel/`    |
| `npm run preview` | Preview the production build locally          |
| `npm run astro …` | Run any Astro CLI command (`astro add`, etc.) |

Node `>= 22.12` (see `engines` in `package.json`).

---

## Contact form — Web3Forms

The landing form posts JSON **directly from the browser** to `https://api.web3forms.com/submit`. There is no server-side endpoint in the active flow.

- **Access key** is inlined as a hidden input. Per [Web3Forms docs](https://docs.web3forms.com/) the key is safe to expose; it can only be used to send to the registered inbox, not to read submissions.
- **Inbox:** the Gmail used to register the access key on web3forms.com (Romina's). Free tier = **250 submissions / month, single recipient**.
- **Spam protection:** double honeypot — Web3Forms' native `botcheck` checkbox + a custom `website` text field re-checked client-side before posting.
- **Localization:** the email body wrapper is in English (PRO-only to customize). The `subject` and `from_name` headers are set in Spanish.

### Why not Resend?

Resend requires a verified sender domain, which requires an MX record on a subdomain. The domain DNS is currently locked to Wix and Wix does not allow custom MX on subdomains. Web3Forms needs zero DNS, so it works while DNS migration is pending. Full breakdown: `../dns.txt`.

### Inactive fallback — `src/pages/api/contact.ts`

A Resend-backed serverless endpoint is preserved (still deployed and importable) so the form can be swapped back without rewriting once DNS leaves Wix. Reactivation:

1. Verify the sender domain in Resend.
2. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in Vercel.
3. Revert the form `action` and the `fetch()` URL in `src/pages/index.astro` from `https://api.web3forms.com/submit` back to `/api/contact`.

See `.env.example` for variable shapes.

---

## Deployment

Auto-deployed by Vercel on every push to `master`.

- **Project:** `gaudiano-site` (Vercel)
- **Production domain:** `mentoria.rominagaudiano.com`
- **Adapter:** `@astrojs/vercel` (serverless output)

### Vercel dashboard toggles to enable on a fresh project

- **Analytics** tab → Enable (the `<Analytics />` component already injects the script in production)
- **Speed Insights** tab → Enable (the `<SpeedInsights />` component already injects the script in production)

No env vars are required for analytics or for the active Web3Forms flow.

---

## Further context

- **Brand, palette, typography, copy direction:** `CLAUDE.md`
- **Live project state, decisions, open TODOs:** `PROJECT_STATE.md`
- **DNS / domain migration plan:** `../dns.txt`
