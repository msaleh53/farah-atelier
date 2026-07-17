# Contact form email setup

The contact form (`/contact`) sends email via [Resend](https://resend.com) from the API route at
`src/app/api/contact/route.ts`. This doc covers the DNS/dashboard setup that lives outside the
codebase — the code side is documented in `CLAUDE.md`.

## How it works

1. Visitor submits the Inquiry or Commission form.
2. `src/app/api/contact/route.ts` validates the payload and calls `sendContactEmail` in `src/lib/email.ts`.
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

`site.email` (`src/lib/site.ts`) is not an env var — it's the recipient constant, currently
`studio@farahramadan.art`.
