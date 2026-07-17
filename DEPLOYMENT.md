# Deployment notes

Live on **Vercel**, with **Neon** (Postgres) and **Cloudflare R2** (media storage) in
production, on the custom domain `www.farahramadan.art` (the apex `farahramadan.art`
redirects to `www`). Pushing to `main` deploys automatically via Vercel's GitHub
integration. This doc covers the non-obvious parts of that setup — things that will
silently break if changed without knowing why they're there.

## Required environment variables (Vercel → Production)

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `PAYLOAD_SECRET` | Payload session/token signing |
| `NEXT_PUBLIC_SERVER_URL` | Must be `https://www.farahramadan.art` exactly — see [CORS/CSRF](#corscsrf-on-admin-mutations) below |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | R2 bucket credentials |
| `S3_PUBLIC_URL` | `https://media.farahramadan.art` — R2 direct-read image URLs, see [Media/images](#media--images) |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` | Contact form email — see `EMAIL_SETUP.md` |
| `TURNSTILE_SECRET` | Contact form bot protection — see `EMAIL_SETUP.md` |

**Note on reading these back:** `vercel env pull` and `vercel env ls` redact any var marked
"Sensitive" (which `vercel env add` defaults new vars to) — a pulled `.env` file will show
`VAR=""` for a sensitive var even when it has a real value set. Don't mistake that redaction
for the var actually being empty; check behavior (does the feature work?) rather than trusting
a pulled value.

## Node version & build command

- **Node 22** — set explicitly in Vercel Project Settings → General. Vercel's default
  (24.x at time of writing) breaks Payload's CLI (`tsx`). Matches `.nvmrc` locally.
- **Build command**: `npx payload migrate && npm run build` — the migrate step applies
  `src/migrations/` against Neon before the Next build runs. Without it, a fresh Neon
  branch/database has no schema.

## sharp / libvips native binary

Next's file tracer doesn't follow `sharp`'s runtime `dlopen`, so without help the
`libvips-cpp.so` binary gets left out of the Lambda bundle and `/admin` 500s with
`Could not load the sharp module / libvips-cpp.so`. Fixed in `next.config.mjs`:

- `serverExternalPackages: ["sharp"]` — keeps sharp out of the webpack bundle so it loads
  from `node_modules` at runtime instead.
- `outputFileTracingIncludes` for `/admin/[[...segments]]` and `/api/[...slug]` — forces
  `./node_modules/sharp/**/*` and `./node_modules/@img/**/*` into those serverless functions.
- `sharp` is pinned in `package.json` (currently `0.34.5`) to match the version Next itself
  vendors — two different sharp versions in the same Lambda is its own failure mode.

## importMap

`src/app/(payload)/admin/importMap.js` is committed and used as-is by the production build —
Payload does not regenerate it at build/runtime. It must be manually regenerated whenever a
plugin adds admin-side components (e.g. the R2 `s3Storage` plugin only registers its
`S3ClientUploadHandler` import when `S3_BUCKET` is set locally):

```bash
S3_BUCKET=dummy npx payload generate:importmap   # Node 22
```

Commit the result. If this drifts (e.g. the import silently disappears — this has happened
from `npm install` reshuffling `node_modules` mid-dev-session), production errors with
`getFromImportMap: PayloadComponent not found`. **Before committing, diff this file** — if a
commit unintentionally drops an import you didn't mean to touch, revert just that file rather
than committing it as a side effect of unrelated work.

## CORS/CSRF on admin mutations

Symptom: `/admin` loads and reads fine, but saving/uploading anything fails with
`You are not allowed to perform this action.` This is a Payload **Forbidden**, not an R2 or
database error — don't chase storage or DB permissions when you see this message.

Cause: `payload.config.ts` sets `cors: [serverURL]` and `csrf: [serverURL]`, where
`serverURL` comes from `NEXT_PUBLIC_SERVER_URL`. If that env var doesn't **exactly** match
the origin the browser is actually on (protocol + host, no trailing slash), the admin UI's
auth cookie gets rejected on client-side POST/PATCH requests, even though page loads
(server-rendered GETs) work fine.

This bit us directly: after `farahramadan.art` went live, `NEXT_PUBLIC_SERVER_URL` still
pointed at the old `*.vercel.app` deployment URL, so Site Settings saves failed with this
exact error until it was corrected. The apex domain **redirects to `www`**
(`farahramadan.art` → `www.farahramadan.art`), so the correct value is
`https://www.farahramadan.art` — using the bare apex here will fail the same way, since
that's not the origin the browser ends up on after the redirect.

**If the domain changes again** (new custom domain, apex/www swap, etc.), update
`NEXT_PUBLIC_SERVER_URL` to match and redeploy — `NEXT_PUBLIC_*` vars can be inlined at
build time, so changing the value alone isn't enough; a fresh deploy is required for it to
actually take effect.

## Media / images

Two independent things need to agree, or images either 404 or `next/image` refuses to
render them (`hostname "..." is not configured under images` in the Next error overlay):

1. **Where Payload says the image lives** — `payload.config.ts`'s `generateFileURL`, gated
   on `S3_PUBLIC_URL`:
   - Set → returns `${S3_PUBLIC_URL}/${filename}` directly (currently
     `https://media.farahramadan.art`, an R2 custom domain for the bucket's public reads).
   - Unset → falls back to Payload's own proxy, which serves images through `serverURL`
     (i.e. `https://www.farahramadan.art/api/media/file/...`).
2. **What `next/image` will render** — `next.config.mjs`'s `images.remotePatterns` must
   allowlist whichever host (1) actually produces. Currently allowlisted:
   `images.unsplash.com`, `*.r2.cloudflarestorage.com` (R2 API host), `*.r2.dev` (R2's
   default "Public Development URL"), `media.farahramadan.art` (the R2 custom domain in
   active use), and both `farahramadan.art` + `www.farahramadan.art` (Payload's proxied
   fallback, in case `S3_PUBLIC_URL` is ever unset again).

**Incident precedent (2026-07-15):** `S3_PUBLIC_URL` was set to R2's public dev URL host
(`pub-<hash>.r2.dev`) without that exact host being in `remotePatterns` — every image on the
site broke. Resolved by clearing `S3_PUBLIC_URL` (falling back to the proxied path) and
separately fixing the `remotePatterns` entry. **The rule going forward: never change
`S3_PUBLIC_URL` without first confirming the exact hostname it resolves to is already in
`next.config.mjs`'s `remotePatterns`.**

**R2 credential gotcha:** `S3_ACCESS_KEY_ID` is 32 characters, `S3_SECRET_ACCESS_KEY` is 64 —
easy to paste into the wrong field. R2 errors with `Credential access key has length 64,
should be 32` if they're swapped.

## R2 bucket CORS (direct browser uploads)

`clientUploads: true` in `payload.config.ts` uploads media directly from the browser to R2
(bypassing Vercel's 4.5MB serverless body limit). This requires the R2 bucket's CORS
`AllowedOrigins` to include whatever origin the browser is actually on — currently
`https://www.farahramadan.art`, `http://localhost:3000`, `http://localhost:3001`. If a new
domain/origin is ever added, update this too, or uploads fail CORS preflight even though
everything else works. Set via:

```bash
wrangler r2 bucket cors set framadan --rules-file <file>
```

(The Cloudflare dashboard UI has a known "request too large" bug for this — use `wrangler`.)

## Checklist: adding or changing a custom domain

All of the above are origin-allowlists tied to the current domain — none of them
auto-update when a domain is attached in Vercel's dashboard. When the domain changes:

- [ ] `NEXT_PUBLIC_SERVER_URL` (Vercel env var) → new domain, then **redeploy**
- [ ] `next.config.mjs` `images.remotePatterns` → add the new host
- [ ] R2 bucket CORS `AllowedOrigins` (via `wrangler`, see above)
- [ ] If using R2 direct-read images, confirm `S3_PUBLIC_URL`'s host is still correct/allowlisted
- [ ] Cloudflare Email Routing / Resend domain verification, if contact-form email is involved — see `EMAIL_SETUP.md`

## Verification discipline

When debugging a production issue, match the **Deployment ID** (`dpl_...`) in Vercel's
runtime logs to the deployment produced by the commit you think is live — timestamps alone
are ambiguous, and a manual no-cache redeploy can leave production pinned to an older commit
than the latest push. `vercel ls` and `vercel inspect <url>` show this.
