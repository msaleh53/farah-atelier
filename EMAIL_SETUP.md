# Contact form email setup

The contact form (`/contact`) sends email via [Resend](https://resend.com) from the API route at
`src/app/api/contact/route.ts`. This doc covers the DNS/dashboard setup that lives outside the
codebase — the code side is documented in `CLAUDE.md`.

## How it works

1. Visitor submits the Inquiry or Commission form. Both forms render a Cloudflare Turnstile
   widget (`src/components/TurnstileWidget.tsx`) that solves silently in the background and
   produces a `cf-turnstile-response` token.
2. `src/app/api/contact/route.ts` first verifies that token against Cloudflare's siteverify
   endpoint — unverified/missing tokens get rejected with 403 before any validation or email
   logic runs. Then it validates the payload and calls `sendContactEmail` in `src/lib/email.ts`.
3. Resend sends the email **from** `CONTACT_FROM_EMAIL` (env var) **to** `site.email` (`src/lib/site.ts`),
   with `reply_to` set to the visitor's own email so replies go straight to them.
4. `site.email` is `studio@farahramadan.art` — an address that doesn't have its own mailbox.
   Cloudflare Email Routing forwards anything sent to it into a real inbox (currently
   `saleh.mayada@gmail.com` for testing; swap to the client's Gmail before handoff — see below).

## Cloudflare Email Routing (receiving → forwarding)

Domain: `farahramadan.art`, DNS hosted on Cloudflare.

- **Dashboard path:** domain → **Email** → **Email Routing**
- **Destination address:** the Gmail address mail actually lands in. Must be verified (Cloudflare
  emails a confirmation link to it) before it can receive forwarded mail.
- **Routing rule:** custom address `studio@farahramadan.art` → **Send to an email** → destination Gmail.
- Cloudflare auto-added its own MX records (`route1/2/3.mx.cloudflare.net`) and a DKIM TXT record
  (`cf2024-1._domainkey`) when Email Routing was activated. The domain originally had a conflicting
  non-Cloudflare MX record (registrar parking default) that had to be deleted first — if Email
  Routing ever needs re-activating, check **DNS → Records** for stray MX records before retrying.

**To hand off to the client:** in the Email Routing rule, change the destination from
`saleh.mayada@gmail.com` to the client's Gmail address (re-verify it first). No code change needed —
`site.email` stays `studio@farahramadan.art` either way.

## Resend (sending)

- Domain `farahramadan.art` is verified in Resend (**Domains** → the domain → **Records** tab).
- Verification added, via Cloudflare's "Auto configure": a DKIM TXT record
  (`resend._domainkey`) and an SPF MX + TXT record pair (`send` subdomain, Amazon SES relay).
- **"Enable Receiving" must stay OFF** on the Resend domain settings — receiving is already handled
  by Cloudflare Email Routing above; turning this on would add conflicting MX records.
- Once DKIM/SPF show **Verified**, `CONTACT_FROM_EMAIL` in `.env.local` (and in Vercel's env vars for
  production) is set to `studio@farahramadan.art` instead of the `onboarding@resend.dev` sandbox
  address.

## DMARC (deliverability)

Resend's setup doesn't add a DMARC record automatically, and its absence is a common reason new
sending domains land in spam. Added manually in Cloudflare DNS:

- Type: `TXT`
- Name: `_dmarc`
- Content: `v=DMARC1; p=none; rua=mailto:studio@farahramadan.art`

`p=none` is monitor-only (doesn't reject/quarantine anything) — a safe starting point for a new domain.

## Cloudflare Turnstile (bot protection)

Widget `farah-atelier-contact` (sitekey `0x4AAAAAAD3nuFJuIftIk0G7`), managed mode, registered
for `localhost`, `127.0.0.1`, and `farahramadan.art`. Created via
`wrangler turnstile widget create` — dashboard path to view/edit: **Turnstile** in the
Cloudflare dashboard for the account (not the domain-specific DNS view).

- **Frontend:** `src/components/TurnstileWidget.tsx`, used by both `InquiryForm.tsx` and
  `CommissionForm.tsx`. It explicitly calls `turnstile.render()` inside a `next/script`
  `onReady` callback rather than relying on Turnstile's implicit `class="cf-turnstile"`
  auto-render. This matters because `ContactView.tsx` only mounts one form at a time (tab
  switch) — implicit auto-render only scans the DOM once, on the script's *initial* load, so
  the second tab's widget would never render and its form would always fail verification.
  `onReady` fires on every remount, not just once, which is what makes this work reliably.
- **Backend:** siteverify call inline in `src/app/api/contact/route.ts`, gated before any
  other request handling.
- **Secret:** `TURNSTILE_SECRET` env var — server-only, never exposed to the client (the
  sitekey, by contrast, is public by design and hardcoded in the widget component).
- **Token reuse:** Turnstile tokens are single-use. `TurnstileWidget` exposes a `reset()`
  handle via ref; both forms call it on a failed submission so a retry gets a fresh token
  instead of resubmitting an already-consumed one.

## Why the first test email landed in spam

Expected for a brand-new sending domain with no reputation yet — not a misconfiguration. Fixed by:
1. Adding the DMARC record above.
2. Marking the test email "Not spam" in Gmail (trains the filter for this sender).
3. Sending reputation improves naturally with more normal (non-test) traffic over time.

## Env vars involved

| Var | Where | Value |
|---|---|---|
| `RESEND_API_KEY` | `.env.local`, Vercel | Resend dashboard → API Keys |
| `CONTACT_FROM_EMAIL` | `.env.local`, Vercel | `studio@farahramadan.art` |
| `TURNSTILE_SECRET` | `.env.local`, Vercel | Cloudflare dashboard → Turnstile → widget → secret |

`site.email` (`src/lib/site.ts`) is not an env var — it's the recipient constant, currently
`studio@farahramadan.art`. The Turnstile **sitekey** is also not an env var — it's public by
design and hardcoded in `TurnstileWidget.tsx`.

## Why the admin panel wouldn't save (unrelated to email, but hit during this work)

Editing Site Settings in `/admin` failed with `You are not allowed to perform this action`
after the custom domain went live — this was a Payload CORS/CSRF misconfiguration
(`NEXT_PUBLIC_SERVER_URL` not matching the real origin), not an email or Turnstile issue.
See `DEPLOYMENT.md`'s "CORS/CSRF on admin mutations" section for the full explanation and fix.
