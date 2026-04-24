# Gaudiano Site — Project State

Living snapshot of the project. Update this file whenever a significant decision, integration, or TODO changes. See `CLAUDE.md` for brand/aesthetic context and workflow.

**Last updated:** 2026-04-24

---

## Current direction

- **Option 6 is the chosen direction** and has been promoted to the sole landing at `/` (`src/pages/index.astro`).
- Previous options (1, 2, 3, 5) and the selector index are preserved on branch `archive/pre-option-6-cleanup` on the remote.

## Pages

| Route | File | Status |
|---|---|---|
| `/` | `src/pages/index.astro` | The landing (formerly `option-6.astro`) |

---

## Contact form

Located in the `#contacto` section at the bottom of `index.astro`.

### Fields

| Name | Type | Required | Notes |
|---|---|---|---|
| `name`    | text      | yes | `autocomplete="name"` |
| `email`   | email     | yes | `autocomplete="email"` |
| `phone`   | tel       | no  | `autocomplete="tel"` |
| `message` | textarea  | yes | 4 rows, vertically resizable |
| `website` | text (honeypot) | no | Hidden off-screen; if non-empty at submit, submission is silently dropped |

### Current behaviour

- `action=""` is **empty on purpose** — no mailing provider wired yet.
- A JS handler in the page script:
  1. `preventDefault()` on submit.
  2. Checks the honeypot; if filled → resets form, shows "Gracias, te escribo pronto.", returns.
  3. Runs `checkValidity()` / `reportValidity()`.
  4. Disables the submit button, shows the same confirmation, resets the form.
- **No data is currently sent anywhere.** Users get a success-looking UX; nothing reaches Romina's inbox.

### TODO — wire a real mailing provider

Likely options (pick one):

- **Formspree** — set `action="https://formspree.io/f/<id>"`, `method="POST"`, remove the JS `preventDefault` or switch to `fetch()` with JSON. Pros: no backend. Cons: branding/limits on free tier.
- **Resend** (or similar transactional email) via a tiny serverless function (Vercel/Netlify/Cloudflare Worker). Pros: full control over from/to, no third-party form branding. Cons: needs a deployment target with functions — current site is pure static Astro.
- **Custom SMTP endpoint** on Hostinger (PHP mail handler). Only if the site is eventually hosted on Hostinger shared hosting.

Once chosen, update:
1. `<form action="...">` in `index.astro`.
2. The submit handler — either remove `preventDefault` and let the form POST natively, or `fetch()` the endpoint and keep the status-message flow.
3. Remove the TODO comment block above the form.
4. Verify the honeypot is checked **server-side too** (client-side alone is insufficient).

---

## WhatsApp floating button

- Fixed bottom-right, brand-green circle, SVG icon.
- `aria-label="Contactar por WhatsApp"`, opens in new tab.
- Prefilled message: *"Hola Romina, me gustaría saber más sobre la mentoría."*

### Phone number

Live URL: `https://wa.me/5491154697343?text=...` (Romina's AR mobile +54 9 11 5469-7343).

---

## Stack & commands

- **Astro** static output, no framework integrations.
- **Tailwind via CDN/utility classes** inside Astro components (verify in `astro.config.mjs`/`package.json` if extending).
- No GSAP yet — entrance reveals are CSS-only (`animation-timeline: view()` / IntersectionObserver for counters).

```bash
npm run dev      # localhost:4321
npm run build    # → ./dist (static)
npm run preview
```

## Hosting / deploy

- **Not yet decided.** Repo is at `github.com/kirigaya97/gaudiano-site`. `master` is the deploy branch by convention.
- No `deploy.sh`, no CI/CD wired in this project (contrast with `~/web/arilart/`).
- When hosting is chosen (Vercel / Netlify / Cloudflare Pages / Hostinger static): document the target here and whether a serverless function is available (relevant for the mailing provider decision above).

---

## Open TODOs (summary)

- [ ] Decide mailing provider and wire `<form action>` + server-side honeypot check.
- [ ] Pick hosting target; add deploy workflow.
- [ ] Add `favicon` / social-share meta (`og:image`, `twitter:card`) before launch.
- [ ] Optional: rename the top-of-file comment block in `index.astro` (still references "Option 6 — Fusion + Customer Modifications" and compares to options 3/4/5).
