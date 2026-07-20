# Self-Hosted VPS for Client Sites — Design

**Status:** Exploratory — approved design, not yet implemented. This document is infrastructure planning for future freelance client work; it does not change how farah-atelier is currently hosted (Vercel + Neon + R2), and there is no plan to migrate this site yet.

## Goal

Set up a manageable, cost-effective, self-hosted alternative to per-site managed platforms (Vercel, Neon, etc.) for hosting multiple client websites, driven by cost predictability and reducing vendor lock-in — while keeping day-to-day operations close to zero manual server work.

## Context / constraints

- Starting point: one site (farah-atelier) as a reference stack, not yet migrated.
- Expected scale: 4-8 client sites within 6-12 months.
- Stack per client is not yet fixed — could be Next.js + Postgres + CMS (like this project) or something else. Design should not assume a single framework.
- Operator preference: minimal hands-on server administration — wants automation over manual shell work (SSH, nginx configs, manual SSL renewal, etc.).
- Reliability bar: "good enough for now" — no hard requirement for automated backups, uptime monitoring, or staging environments at this stage. These are acceptable to add later.

## Approach

Considered three options:

1. **Self-hosted PaaS (Coolify) on a single VPS** — chosen.
2. Bare Docker Compose per site + hand-rolled reverse proxy/SSL/deploy scripting — rejected as too much manual plumbing for the stated "minimal ops" preference.
3. Alternative self-hosted PaaS tools (Dokploy, CapRover) — viable alternatives to Coolify, not pursued further since Coolify satisfies the requirements and is a mature, widely-used option.

## Design

### 1. Infrastructure

- One VPS: Hetzner Cloud, CX32 tier (4 vCPU, 8GB RAM, 80GB disk), Ubuntu 24.04 LTS, ~€14/mo (~$15/mo).
- [Coolify](https://coolify.io) (open-source, self-hosted PaaS) installed via its standard install script. Coolify is the control plane: a web UI for creating "projects" (one per client site), connecting GitHub repos, managing env vars, and triggering deploys.
- Coolify bundles Traefik as a reverse proxy and automates Let's Encrypt SSL issuance per domain/subdomain.
- Each client site runs as its own isolated Docker container (or container group — e.g. app + Postgres). Sites share the box's compute but not process space, so one client's crash/bug doesn't take down another's site.

### 2. Deploy workflow

- Each site has its own GitHub repo.
- `git push` to `main` triggers a Coolify webhook → build (Nixpacks auto-detection, or a Dockerfile if the stack needs one) → near-zero-downtime rollout.
- This mirrors the git-push-to-deploy experience already familiar from Vercel, just pointed at the self-hosted box.
- Coolify supports per-branch deployments. This isn't a standing staging requirement, but is available opt-in per site: a `preview`/feature branch can be deployed to a throwaway subdomain when the operator wants to keep WIP off the client-visible URL.

### 3. Development process for a client site

1. **Kickoff:** create a GitHub repo for the site; create a new Coolify project connected to that repo; point it at an operator-controlled review subdomain (e.g. `clientname.yourvps.dev`) so review doesn't need to wait on the client's real domain. Coolify auto-provisions Postgres (if needed) and SSL for that subdomain.
2. **Day-to-day development:** local development is unchanged from current practice (e.g. local Next.js dev server, local Postgres via Docker, `npm run build` as a pre-push gate).
3. **Review loop:** push to `main` → Coolify auto-deploys to the review subdomain for client feedback. Optional throwaway preview URLs for riskier in-progress changes.
4. **Go-live:** point the client's real domain at the VPS (A/CNAME), add it in Coolify, SSL issues automatically, cut over DNS.
5. **Post-launch changes:** same loop — push to `main`, Coolify redeploys production directly. No formal staging gate by default, consistent with the "good enough for now" reliability bar; a temporary preview URL remains available per-site if a change warrants extra caution.

### 4. Data & storage per site

- Each site needing a database gets its own isolated Postgres instance provisioned through Coolify — analogous to today's per-site Neon database, just self-hosted, not a shared cluster across clients.
- File/media uploads go to an S3-compatible object store (R2, reusing the provider already in use for farah-atelier) rather than local VPS disk, keeping the box close to stateless and avoiding disk-space growth as sites accumulate.

### 5. Security basics (lightweight, not enterprise)

- SSH key-only login, no password auth.
- Firewall restricted to ports 22, 80, 443.
- `unattended-upgrades` for automatic OS security patches.
- Coolify itself is updated manually, on the operator's schedule — a bad auto-update to the PaaS layer could affect every hosted site at once, so this is deliberately not automatic.

### 6. Cost estimate

- VPS: ~$15/mo, covering all 4-8 sites on one box.
- Per-domain registration: ~$10-15/yr each (client-specific, outside the infra budget).
- R2 storage: negligible at this scale (pennies/mo).
- **Total infra: roughly $15-20/mo for the entire client roster**, vs. paying per-site platform costs (e.g. Vercel/Neon) as client count grows.

## Explicitly out of scope

- Automated backup scheduling (Coolify supports one-click scheduled DB backups to S3-compatible storage — cheap to enable later, not included in this initial design).
- Uptime monitoring/alerting.
- A standing staging environment as a hard requirement (opt-in per-branch preview deploys cover this need at lower overhead).
- Migrating farah-atelier off Vercel/Neon/R2 — this design is infrastructure to have ready for future client engagements, not a migration plan for the current site.
- Multi-VPS redundancy / high availability — single box is accepted as a single point of failure at this stage, consistent with the stated reliability bar.
