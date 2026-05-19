# Passos Travel

Vue 3 + Vite SPA for a Brazilian travel agency (LGPD jurisdiction). Single-page site with PT/ES/EN i18n via route param.

## Stack

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build:** Vite 5
- **UI:** PrimeVue 3 (unstyled mode + custom Tailwind preset in `src/myPreset/`)
- **Styling:** Tailwind CSS 3
- **Routing:** vue-router 4 with `/`, `/pt`, `/es`
- **Email:** EmailJS (client-side; key is intentionally public — see Security)
- **Reviews:** Fouita widget (third-party JS, loaded async on mount)
- **No backend yet.** All data flows client-side. Adding admin login / customer records requires adding a backend first.

## Commands

```bash
npm install        # install deps
npm run dev        # vite dev server
npm run build      # production build → dist/
npm run preview    # preview the build locally
```

Tests will live in `tests/` (Vitest unit + Playwright e2e). Not yet wired up.

## File map

- `index.html` — shell. SEO/meta tags live here.
- `src/main.js` — app entry. Registers PrimeVue, router, global CSS.
- `src/App.vue` — bare `<RouterView />`.
- `src/router/index.js` — two routes (`/`, `/:lang(pt|es)`). Language detection via `navigator.language` in `beforeEnter`.
- `src/views/HomeView.vue` — the entire site. Component split planned.
- `src/langData/{en,es,pt}.js` — translation strings. Each exports `{ [lang]: { ... } }`. Shape includes `title`, `subtitle`, `description[]`, `contactTitle`, `contactDescription`, `contactAlternative`, `formLabels{}`, `validation{}`, `dialog{}`, `sendButton`, `testimonialTitle`, `footerText`.
- `src/myPreset/` — PrimeVue Tailwind preset (Lara). ~86 component dirs, most unused. Removed when we upgrade to PrimeVue 4.
- `src/style.css` — Tailwind layers + PrimeVue CSS variables.
- `public/images/` — static assets.
- `dist/` — committed build output, uploaded to Hostinger.
- `.env.example` — template for env vars. Real values live in `.env.local` (gitignored).

## Conventions

- Vue 3 Composition API with `<script setup>` only. No Options API.
- Tailwind utility classes preferred over scoped CSS. Custom CSS only in `src/style.css`.
- Brand color is navy `#34446C`. Define palette in `tailwind.config.js` rather than inline hex.
- i18n: every user-facing string MUST come from `src/langData/*.js`. Adding a key requires adding it to **all three** files.
- Component names: PascalCase. Files: `.vue`.
- Routes: `/` (English), `/pt`, `/es`. No other language prefixes.

## Security (priority — read before editing anything that touches user data, auth, or external services)

- **Never commit `.env`, `.env.local`, or any file containing secrets.** Only `.env.example` is committed.
- **EmailJS keys** (`VITE_EMAILJS_*`) are public by design — EmailJS calls them "publishable". They protect *nothing*; abuse protection comes from EmailJS's per-domain rate limiting + a captcha on the form. `VITE_*` env vars are inlined into the bundle and visible to any visitor.
- **Customer data / PII**: this codebase does not handle PII yet. When admin/customer features are added, every PII-touching change MUST include:
  - Input validation at the boundary (Zod or valibot).
  - Parameterized queries — never string-built SQL.
  - Audit log entry (actor, action, IP, timestamp).
  - LGPD compliance: explicit consent, retention policy, right-to-delete endpoint, DPO contact in privacy policy. LGPD applies because the agency operates in Brazil.
  - Argon2id (not bcrypt) for password hashing.
  - Sessions in httpOnly + Secure + SameSite=Lax cookies. **Never store tokens in localStorage.**
- **Form spam**: the public contact form needs a captcha (Cloudflare Turnstile planned) + honeypot field before any rate-sensitive integrations are added.
- **External scripts**: third-party JS (Fouita widget, etc.) is loaded with `defer` or in `onMounted`. Never add new third-party `<script>` tags to `index.html` without auditing the source.
- **Headers**: production responses should set CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy. Configured via `.htaccess` on Hostinger.
- **Dependencies**: run `npm audit` before merging. New deps need a one-line justification in the PR description.
- **No `console.log` in committed code.** `console.error` only in genuinely unrecoverable paths.

## Known limitations (acknowledged, not bugs)

- EmailJS keys visible in bundle — accepted (they're meant to be).
- Fouita reviews widget is third-party JS — accepted until a backend exists or curated static reviews replace it.
- Single-page site (everything in `HomeView.vue`) — component split planned.
- `dist/` is committed because Hostinger deployment uses it. Don't add to `.gitignore` unless the deploy workflow changes.
- Tailwind 3 + PrimeVue 3 — major upgrades deferred; both have v4 with breaking changes that should land together.
- No tests yet — Vitest + Playwright planned.

## Deployment

- **Host:** Hostinger (shared, Apache/LiteSpeed).
- **Method:** build locally (`npm run build`), commit `dist/`, upload via Hostinger file manager or git integration.
- **Security headers:** configured in `.htaccess` (added in a future phase).

## When working in this repo

- Edits to user-facing strings: update all 3 lang files.
- Edits touching form / auth / PII paths: re-read the Security section.
- Before committing: confirm no secrets staged, no `console.log`, no `.env*` staged.
- New external dependency: justify in PR, check `npm audit`, add to CLAUDE.md if it adds a concept (auth lib, validation lib, etc.).
- Tests must pass before merging once they exist.
