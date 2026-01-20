# TessDental (Dev Scaffold)

## Requirements
- Node 20+
- pnpm
- Docker

## Start databases + flyway migrations
```bash
pnpm i
pnpm db:up
pnpm db:migrate
```

## Start apps

### Start all apps (web + api + worker)
```bash
pnpm dev
```

### Start individual apps
```bash
# Start just the web app (recommended for frontend development)
pnpm dev:web

# Start just the API
pnpm dev:api

# Start just the worker
pnpm dev:worker
```

* Web: [http://localhost:3000](http://localhost:3000)
* API: [http://localhost:3001/healthz](http://localhost:3001/healthz)
* MinIO console: [http://localhost:9001](http://localhost:9001)

---

# TessDental Server

The Self-Hosted Dental PMS That Is Installed Like an Appliance

TessDental is not designed to run on "whatever computer is lying around."
It is a medical record system. It deserves proper hardware, proper backups, and proper reliability.

TessDental is opinionated by design. These opinions exist to protect your clinic, your data, and your future.

If you want a fragile system that works "most of the time," use cloud software.
If you want a system you own and trust, follow this guide.

---

## Non-Negotiable Requirements

TessDental requires two separate devices:

1. A TessDental Server
2. A dedicated NAS for backups

They must be physically separate.
If they are not separate, you do not have backups. You have copies.

---

## TessDental Server Hardware

This is your live production system.

Minimum:

* Intel i5 / Ryzen 5 or better
* 32 GB RAM
* 1 TB NVMe SSD
* Dual NIC preferred (not required)
* Wired Ethernet
* UPS battery backup

Recommended:

* Intel i7 / Ryzen 7
* 64 GB RAM
* 2 TB NVMe SSD
* Enterprise SSD if possible

This server should do **one thing only**:
Run TessDental.

No browsing.
No email.
No other software.

---

## NAS Hardware (Required)

This is your safety net.
It is not optional.

Minimum:

* Synology / QNAP / TrueNAS
* RAID 1 or RAID 5
* 2× drives minimum
* Connected via wired Ethernet

Recommended:

* RAID 5 or RAID 6
* Snapshots enabled
* Nightly offsite replication

The NAS must:

* Always be powered on
* Be on the same network as TessDental
* Have a dedicated backup share for TessDental

Example:

```
\\NAS\TessDentalBackups
```

---

## How TessDental Thinks About Backups

Backups are not a feature.
They are the foundation.

Every night TessDental:

1. Creates a full encrypted snapshot
2. Writes it to the NAS
3. Verifies integrity
4. Performs a test restore
5. Reports success or failure in the UI

If the NAS is offline:
TessDental shows a red alert.

If backups fail:
TessDental shows a red alert.

No silent failures. Ever.

---

## Installation Summary

There are exactly four steps:

1. Install TessDental Server on your server hardware
2. Install your NAS on the network
3. Open Chrome and run the setup wizard
4. Start using TessDental

That is the entire deployment.

---

## Step 1 – Create the TessDental Installer USB

1. Download:

```
tessdental-server.iso
```

2. Download Balena Etcher:
   [https://www.balena.io/etcher/](https://www.balena.io/etcher/)

3. Insert a USB drive (8GB+)

4. Flash:

* Select ISO
* Select USB
* Click Flash

Remove USB safely.

---

## Step 2 – Install TessDental Server

1. Plug USB into the TessDental Server
2. Plug Ethernet into your clinic network
3. Power on
4. Boot from USB if prompted

TessDental installs automatically.

No configuration.
No questions.
No menus.

When finished, the screen shows:

> TessDental Server Ready
>
> Open Chrome and go to:
> **[https://tessdental.local](https://tessdental.local)**

---

## Step 3 – Open TessDental

From any computer:

1. Open Chrome
2. Go to:

```
https://tessdental.local
```

The setup wizard appears.

---

## Step 4 – TessDental Setup Wizard

This runs once and only once.

You will configure:

1. Clinic Name

2. Admin Email

3. Admin Password

4. Time Zone

5. NAS Backup Location (Required)

   * Network path:

     ```
     \\NAS\TessDentalBackups
     ```
   * NAS username
   * NAS password

TessDental will test:

* Connectivity
* Write permission
* Available storage
* Encryption capability

If this step fails, setup cannot continue.

Backups are mandatory.

6. Network Mode:

   * Local-only (default)
   * Local + Remote (VPN required)

Click **Finish Setup**.

TessDental will:

* Generate encryption keys
* Lock down the system
* Start backup scheduler
* Enable update engine
* Launch PMS

You are now live.

---

## How You Access TessDental

From anywhere in your clinic:

```
https://tessdental.local
```

No apps.
No installs.
Just Chrome.

---

## Backup System (Required Behavior)

Every night:

* Database snapshot
* Imaging snapshot
* Configuration snapshot
* Encrypted archive written to NAS
* Test restore performed
* Health status updated

In TessDental:

🟢 Backups Verified
🟠 Backup Warning
🔴 Backups Failing

No green means no trust.

---

## Disaster Recovery

If TessDental Server fails:

1. Replace hardware
2. Install TessDental Server ISO
3. Open:

```
https://tessdental.local
```

4. Choose:

> Restore from NAS Backup

5. Enter NAS credentials
6. Select backup
7. Restore

Clinic restored.

---

## Updates: Controlled and Reversible

TessDental never overwrites itself.

When an update is available:

> TessDental vX.Y.Z available

Options:

* Install now
* Install overnight
* Skip

Update process:

1. Download new system
2. Clone current database
3. Migrate clone
4. Health-check new stack
5. If success → switch
6. If failure → rollback

Rollback is always one click.

---

## What TessDental Is Opinionated About

These are non-negotiable:

* Dedicated server hardware
* Dedicated NAS backups
* Encrypted backups
* Verified restores
* Atomic updates
* No manual IT tasks
* No silent failures

If any of these are removed, TessDental is no longer safe to use in a clinical environment.

---

## What You Never Do

You never:

* Touch Linux
* Touch Docker
* Touch a terminal
* Write config files
* Run backup commands
* Install updates manually

---

## Final Design Principle

TessDental is not “software.”

It is a medical appliance.

If it ever feels like “IT,” the product has failed.
