# Self-Hosted VPS for Client Sites — Implementation Plan

> **Execution note:** This plan is NOT agent-executable end-to-end. Creating a cloud account, entering billing details, and pointing DNS at a domain you own are actions only you can take — no subagent can perform them. Each step below is marked **[User]** (you do this outside Claude Code, or with Claude Code only relaying exact commands/values for you to run yourself) or **[Agent-assisted]** (once the VPS exists and you've shared SSH access in this session, Claude Code can run the command directly and check the output). Treat this as a runbook you drive, with Claude available to execute and verify the SSH/CLI portions as you go.

**Goal:** Stand up a working, verified self-hosted VPS (Hetzner + Coolify) that can host multiple client sites, and prove the full pipeline — provisioning, hardening, deploy-on-push, SSL, and per-site Postgres isolation — with a disposable smoke-test deployment before any real client site touches it.

**Architecture:** One Hetzner Cloud VPS running Coolify (open-source self-hosted PaaS) as the control plane. Coolify manages Docker-based deployments per "project," issues Let's Encrypt SSL via its bundled Traefik proxy, and can provision isolated Postgres instances per project. Verification uses a throwaway Docker-image deployment (`nginxdemos/hello`) rather than a real app, since no client site is being migrated yet.

**Tech Stack:** Hetzner Cloud (VPS + Cloud Firewall), Ubuntu 24.04 LTS, Coolify (self-hosted, latest via official installer), Docker (installed by Coolify), Let's Encrypt (via Coolify/Traefik).

## Global Constraints

- Server: Hetzner Cloud CX32 (4 vCPU, 8 GB RAM, 80 GB disk), Ubuntu 24.04 LTS, ~€14/mo (~$15/mo).
- SSH key-only authentication — no password auth, ever.
- Firewall allow-list only: 22 (SSH), 80 (SSL issuance), 443 (HTTPS) open to all; Coolify dashboard ports 8000/6001/6002 restricted to the operator's own IP.
- `unattended-upgrades` enabled for automatic OS security patching.
- No automated backups, uptime monitoring, or standing staging environment required at this stage (per approved spec, `docs/superpowers/specs/2026-07-20-vps-hosting-design.md`).
- Coolify itself is updated manually, never automatically.
- This plan does not migrate farah-atelier or deploy any real client site — it validates the pipeline with a disposable smoke test only.

Placeholders used throughout this plan (replace with your real values as you go):
- `<VPS_IP>` — the server's public IPv4 address, known after Task 1.
- `<TEST_SUBDOMAIN>` — a subdomain of a domain you already control, e.g. `vps-test.yourdomain.com`, used only for Task 5/6 smoke testing.
- `<YOUR_IP>` — your current public IP address (`curl ifconfig.me` from your own machine), used to restrict dashboard access in Task 2.

---

### Task 1: Generate SSH key and provision the Hetzner server

**Files:** None (infrastructure-only task; no repo files change).

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `<VPS_IP>` (server public IP) and a local SSH keypair, both required by every later task.

- [ ] **Step 1 [User]: Generate a dedicated SSH keypair for this VPS**

```bash
ssh-keygen -t ed25519 -C "vps-hosting" -f ~/.ssh/vps_hosting_ed25519
```

Press Enter through the passphrase prompt (or set one if you prefer — either works with the rest of this plan).

- [ ] **Step 2 [User]: Create a Hetzner Cloud account and project**

Go to https://console.hetzner.cloud, sign up, add a payment method, and create a new Project (e.g. "client-hosting").

- [ ] **Step 3 [User]: Create a Hetzner Cloud Firewall (rules added in Task 2)**

In the Hetzner Cloud Console, go to Firewalls → Create Firewall. Name it `client-hosting-fw`. Leave default rules for now — you'll edit them in Task 2. Hetzner's Cloud Firewall operates at the hypervisor level, outside the VPS's own network stack, so it isn't affected by Docker's iptables NAT rules the way a VPS-local `ufw` would be — this is why we use it instead of (or in addition to) `ufw`.

- [ ] **Step 4 [User]: Create the server**

In the Console: Servers → Add Server.
- Location: whichever region is closest to your target clients.
- Image: Ubuntu 24.04.
- Type: Shared vCPU → CX32 (4 vCPU / 8 GB RAM / 80 GB disk).
- SSH Key: paste the contents of `~/.ssh/vps_hosting_ed25519.pub`.
- Firewall: attach `client-hosting-fw`.
- Name: e.g. `client-hosting-01`.

Create the server and note its public IPv4 address as `<VPS_IP>`.

- [ ] **Step 5 [Agent-assisted]: Verify SSH key access works**

Run (substituting your real IP for `<VPS_IP>`):

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 -o StrictHostKeyChecking=accept-new root@<VPS_IP> "cat /etc/os-release && uptime"
```

Expected: prints `Ubuntu 24.04...` from `/etc/os-release` and an `uptime` line, with no password prompt.

---

### Task 2: Lock down access — firewall rules and SSH hardening

**Files:** `/etc/ssh/sshd_config` on the VPS (not in this repo).

**Interfaces:**
- Consumes: `<VPS_IP>`, SSH key from Task 1; `<YOUR_IP>` (run `curl ifconfig.me` on your own machine to get this).
- Produces: a VPS reachable only via SSH key, with dashboard ports restricted to your IP — required before Task 4 installs Coolify.

- [ ] **Step 1 [User]: Add firewall rules in the Hetzner Console**

On `client-hosting-fw`, add inbound rules:
- TCP 22, source `0.0.0.0/0, ::/0` (SSH — key-only auth enforced in Step 2 below).
- TCP 80, source `0.0.0.0/0, ::/0` (Let's Encrypt HTTP challenge).
- TCP 443, source `0.0.0.0/0, ::/0` (HTTPS traffic).
- TCP 8000, 6001, 6002, source `<YOUR_IP>/32` (Coolify dashboard, real-time comms, terminal — restricted to you only).

Remove/deny all other inbound rules. Save.

Note: if your IP changes (e.g. dynamic home IP), you'll need to update the `<YOUR_IP>/32` rule to keep dashboard access working — this is a known limitation of IP-based restriction, acceptable given the "good enough for now" reliability bar in the spec.

- [ ] **Step 2 [Agent-assisted]: Disable SSH password authentication**

SSH in and edit sshd_config:

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "sed -i \
  -e 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' \
  -e 's/^#\?PermitRootLogin .*/PermitRootLogin prohibit-password/' \
  /etc/ssh/sshd_config && systemctl restart ssh"
```

- [ ] **Step 3 [Agent-assisted]: Verify password auth is rejected**

```bash
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no root@<VPS_IP>
```

Expected: `Permission denied (publickey).` — confirms password login is disabled and only the key works.

---

### Task 3: Enable automatic OS security patching

**Files:** `/etc/apt/apt.conf.d/20auto-upgrades` on the VPS (not in this repo).

**Interfaces:**
- Consumes: SSH access from Task 2.
- Produces: a VPS that self-patches OS security updates without manual intervention.

- [ ] **Step 1 [Agent-assisted]: Install and enable unattended-upgrades**

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "apt update && \
  apt install -y unattended-upgrades apt-listchanges && \
  dpkg-reconfigure -f noninteractive unattended-upgrades"
```

- [ ] **Step 2 [Agent-assisted]: Verify it's enabled and would apply updates**

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "cat /etc/apt/apt.conf.d/20auto-upgrades"
```

Expected output contains:
```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

Then confirm a dry run runs cleanly:

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "unattended-upgrade --dry-run --debug 2>&1 | tail -20"
```

Expected: no errors; output shows it checking for eligible packages.

---

### Task 4: Install Coolify

**Files:** None (installer manages its own files on the VPS).

**Interfaces:**
- Consumes: hardened SSH access from Tasks 2-3.
- Produces: a running Coolify instance reachable at `http://<VPS_IP>:8000` from `<YOUR_IP>` — required by every later task.

- [ ] **Step 1 [Agent-assisted]: Run the official Coolify installer**

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash"
```

Let it finish (it installs Docker if needed, then Coolify itself). It prints a dashboard URL at the end, e.g. `http://<VPS_IP>:8000`.

- [ ] **Step 2 [Agent-assisted]: Verify Coolify is responding locally on the server**

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000"
```

Expected: `200`.

- [ ] **Step 3 [User]: Complete first-run setup in the browser**

From a machine on `<YOUR_IP>`, visit `http://<VPS_IP>:8000`. Expected: Coolify's initial setup screen. Create your admin account and log in.

---

### Task 5: Smoke-test the deploy pipeline (throwaway Docker image + SSL)

**Files:** None in this repo — DNS record and Coolify project config live outside the codebase.

**Scope note:** this task deploys a public Docker image directly (no GitHub connection needed) to prove the reverse-proxy, SSL, and per-project deploy mechanics work. It does not exercise Coolify's GitHub App / git-push-to-deploy integration — that requires connecting a GitHub account at the account level, which is better done once, for real, when onboarding the first actual client (see the runbook written in Task 7) rather than for a throwaway test.

**Interfaces:**
- Consumes: Coolify dashboard access from Task 4; `<TEST_SUBDOMAIN>` (a subdomain of a domain you already control).
- Produces: a live HTTPS URL proving deploy + reverse-proxy + Let's Encrypt all work end-to-end — required before Task 6.

- [ ] **Step 1 [User]: Point a test subdomain at the VPS**

In your DNS provider for the domain you're using for testing, add an A record: `<TEST_SUBDOMAIN>` → `<VPS_IP>`.

- [ ] **Step 2 [User]: Deploy a throwaway image via Coolify**

In the Coolify dashboard: Projects → New Project → name it `smoke-test`. Inside it, New Resource → Docker Image → image `nginxdemos/hello` → set the resource's domain to `https://<TEST_SUBDOMAIN>` → Deploy.

- [ ] **Step 3 [Agent-assisted]: Verify the site is live over HTTPS with a valid cert**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<TEST_SUBDOMAIN>
curl -s https://<TEST_SUBDOMAIN> | grep -i "hello"
echo | openssl s_client -connect <TEST_SUBDOMAIN>:443 -servername <TEST_SUBDOMAIN> 2>/dev/null | openssl x509 -noout -issuer
```

Expected: `200`; a line containing `hello`; issuer line mentioning `Let's Encrypt`.

---

### Task 6: Smoke-test per-project Postgres isolation

**Files:** None in this repo.

**Interfaces:**
- Consumes: the `smoke-test` Coolify project from Task 5.
- Produces: confirmation that each Coolify project gets its own isolated Postgres + Docker network — the isolation model the design spec relies on for multi-client hosting.

- [ ] **Step 1 [User]: Add a Postgres resource to the smoke-test project**

In Coolify, inside the `smoke-test` project: New Resource → Databases → Postgres → Deploy.

- [ ] **Step 2 [Agent-assisted]: Verify the Postgres container is scoped to this project**

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "docker ps --filter 'label=coolify.projectName=smoke-test' --format '{{.Names}}\t{{.Image}}'"
```

Expected: a row showing a container running a `postgres` image, alongside the `nginxdemos/hello` container from Task 5.

- [ ] **Step 3 [Agent-assisted]: Verify the database actually responds to queries**

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "docker exec \$(docker ps --filter 'label=coolify.projectName=smoke-test' --filter 'ancestor=postgres' -q | head -1) psql -U postgres -c 'SELECT 1;'"
```

Expected: output includes a row with `1`, confirming the database is live and queryable.

- [ ] **Step 4 [Agent-assisted]: Verify project-level network isolation**

```bash
ssh -i ~/.ssh/vps_hosting_ed25519 root@<VPS_IP> "docker network ls | grep smoke-test"
```

Expected: a dedicated Docker network for the `smoke-test` project — confirming future client projects each get their own network rather than sharing one, matching the per-client isolation described in the spec.

---

### Task 7: Write the client-onboarding runbook and tear down the smoke test

**Files:**
- Create: `docs/vps-hosting-runbook.md`

**Interfaces:**
- Consumes: everything verified in Tasks 1-6.
- Produces: a standing operational reference for onboarding future client sites onto this VPS (distinct from the design spec, which explains *why*; this explains *how*, step by step, each time a new client signs on).

- [ ] **Step 1: Write the runbook**

Create `docs/vps-hosting-runbook.md` with this content:

```markdown
# VPS Hosting Runbook — Onboarding a New Client Site

Reference: `docs/superpowers/specs/2026-07-20-vps-hosting-design.md` for the full design rationale.

VPS: Hetzner CX32, Coolify dashboard at `http://<VPS_IP>:8000` (access restricted to your current IP — update the Hetzner Cloud Firewall rule `client-hosting-fw` if your IP has changed and the dashboard is unreachable).

## Steps for each new client site

1. Create a GitHub repo for the site.
2. In Coolify: New Project → name it after the client.
3. Inside that project: New Resource → connect the GitHub repo → Coolify auto-detects the build method (Nixpacks or Dockerfile).
4. If the site needs a database: New Resource → Databases → Postgres, inside the same project (keeps it isolated from other clients' data).
5. Set the resource's domain to a review subdomain you control (e.g. `clientname.yourvps.dev`) and point DNS at it.
6. Push to `main` → Coolify auto-deploys to the review subdomain. Share that URL with the client for feedback.
7. Optional: for risky in-progress changes, deploy a feature branch to a second throwaway subdomain rather than touching the review URL.
8. On approval, point the client's real domain at the VPS (A/CNAME), add it as the resource's domain in Coolify, SSL issues automatically, cut over DNS.
9. Ongoing changes: push to `main`, Coolify redeploys production directly — no formal staging gate by default.

## Out of scope by design (see spec for rationale)

- No automated backups by default — Coolify supports one-click scheduled DB backups to S3-compatible storage if a specific client engagement warrants it.
- No uptime monitoring/alerting.
- No standing staging environment — use throwaway preview subdomains per branch instead.
```

- [ ] **Step 2: Commit the runbook**

```bash
git add docs/vps-hosting-runbook.md
git commit -m "Add VPS hosting runbook for onboarding client sites"
```

- [ ] **Step 3 [User]: Tear down the smoke-test project**

In Coolify: delete the `smoke-test` project (both the `nginxdemos/hello` resource and the Postgres resource) now that the pipeline is verified, so it doesn't consume resources or cause confusion later. This is optional — the box has capacity to leave it running — but recommended for a clean slate before the first real client.

---
