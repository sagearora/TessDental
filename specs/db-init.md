# `tess init` CLI Wizard (uses infra/compose/.env)

## Goal

Create a CLI tool runnable from repo root:

```bash
pnpm init
```

It should:

1. load env from `infra/compose/.env`
2. connect to local Postgres using those creds
3. check `public.fn_is_bootstrapped()`
4. if not bootstrapped: ask questions and execute `public.fn_bootstrap_system(...)`
5. print the resulting IDs
6. exit non-zero on failure

---

# 1) Folder structure

Create:

```text
tools/
  init/
    package.json
    tsconfig.json
    src/
      index.ts
      env.ts
      db.ts
      prompts.ts
      validate.ts
      bootstrap.ts
```

---

# 2) Root package.json script

In root `package.json`, add:

```json
{
  "scripts": {
    "init": "pnpm -C tools/init dev"
  }
}
```

---

# 3) tools/init/package.json

Create `tools/init/package.json`:

```json
{
  "name": "@tessdental/init",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node --enable-source-maps dist/index.js",
    "test": "vitest"
  },
  "dependencies": {
    "@inquirer/prompts": "^5.3.8",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.4.5",
    "pg": "^8.11.5",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "tsx": "^4.19.2",
    "typescript": "^5.5.4",
    "vitest": "^2.1.8"
  }
}
```

---

# 4) tools/init/tsconfig.json

Create `tools/init/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

---

# 5) Env loading (single source of truth)

## `tools/init/src/env.ts`

Create file exactly:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// tools/init/src -> repo root -> infra/compose/.env
const repoRoot = path.resolve(__dirname, "../../../");
const envPath = path.join(repoRoot, "infra/compose/.env");

// Load ONLY this env file
dotenv.config({ path: envPath });

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing ${key} in ${envPath}`);
  return v;
}

export function getDatabaseUrl(): string {
  const user = requireEnv("POSTGRES_USER");
  const password = requireEnv("POSTGRES_PASSWORD");
  const db = requireEnv("POSTGRES_DB");
  const port = requireEnv("POSTGRES_PORT");

  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@localhost:${port}/${encodeURIComponent(db)}`;
}

export function getEnvSummaryForDisplay() {
  // Helpful confirmation so you don’t accidentally init the wrong DB
  return {
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PORT: process.env.POSTGRES_PORT
  };
}
```

---

# 6) DB connection

## `tools/init/src/db.ts`

```ts
import pg from "pg";

export type DbPool = pg.Pool;

export function createPool(databaseUrl: string): DbPool {
  return new pg.Pool({
    connectionString: databaseUrl,
    max: 2
  });
}
```

---

# 7) Input validation

## `tools/init/src/validate.ts`

```ts
import { z } from "zod";

export const InitInputSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(10, "Use at least 10 characters"),
  clinicName: z.string().min(1, "Clinic name is required"),
  timezone: z.string().min(1, "Timezone is required")
});

export type InitInput = z.infer<typeof InitInputSchema>;
```

---

# 8) CLI prompts

## `tools/init/src/prompts.ts`

```ts
import { input, password, select, confirm } from "@inquirer/prompts";
import type { InitInput } from "./validate";

const TIMEZONES = [
  "America/Toronto",
  "America/Vancouver",
  "America/Edmonton",
  "America/Winnipeg",
  "America/Halifax",
  "America/St_Johns"
] as const;

export async function promptInit(envSummary: Record<string, unknown>): Promise<InitInput> {
  console.log("\nTessDental one-time initializer\n");
  console.log("Database target:");
  console.log(envSummary);
  console.log("");

  const proceed = await confirm({
    message: "Continue and initialize this database?",
    default: false
  });

  if (!proceed) {
    throw new Error("aborted");
  }

  const firstName = await input({ message: "Admin first name:" });
  const lastName = await input({ message: "Admin last name:" });
  const email = await input({ message: "Admin email:" });
  const pw = await password({ message: "Admin password (min 10 chars):", mask: "*" });
  const clinicName = await input({ message: "Clinic name:" });

  const timezone = await select({
    message: "Clinic timezone:",
    choices: TIMEZONES.map((tz) => ({ name: tz, value: tz })),
    default: "America/Toronto"
  });

  return {
    firstName,
    lastName,
    email,
    password: pw,
    clinicName,
    timezone
  };
}
```

---

# 9) Bootstrap logic

## `tools/init/src/bootstrap.ts`

```ts
import type { DbPool } from "./db";
import type { InitInput } from "./validate";
import bcrypt from "bcryptjs";

export type BootstrapRow = {
  admin_user_id: string;
  clinic_id: number;
  clinic_user_id: number;
  role_id: number;
  success: boolean;
};

export async function isBootstrapped(db: DbPool): Promise<boolean> {
  const res = await db.query<{ fn_is_bootstrapped: boolean }>(
    "select public.fn_is_bootstrapped() as fn_is_bootstrapped"
  );
  return res.rows[0]?.fn_is_bootstrapped ?? false;
}

export async function bootstrapSystem(db: DbPool, input: InitInput): Promise<BootstrapRow> {
  const password_hash = await bcrypt.hash(input.password, 12);

  // IMPORTANT: These named args must match your Postgres function signature.
  const sql = `
    select *
    from public.fn_bootstrap_system(
      p_admin_email         => $1,
      p_admin_password_hash => $2,
      p_admin_first_name    => $3,
      p_admin_last_name     => $4,
      p_clinic_name         => $5,
      p_clinic_timezone     => $6
    )
  `;

  const res = await db.query<BootstrapRow>(sql, [
    input.email,
    password_hash,
    input.firstName,
    input.lastName,
    input.clinicName,
    input.timezone
  ]);

  if (!res.rows[0]) {
    throw new Error("Bootstrap returned no rows (unexpected).");
  }

  return res.rows[0];
}
```

---

# 10) Entry point

## `tools/init/src/index.ts`

```ts
import { createPool } from "./db";
import { getDatabaseUrl, getEnvSummaryForDisplay } from "./env";
import { promptInit } from "./prompts";
import { InitInputSchema } from "./validate";
import { bootstrapSystem, isBootstrapped } from "./bootstrap";

async function main() {
  const databaseUrl = getDatabaseUrl();
  const envSummary = getEnvSummaryForDisplay();

  const db = createPool(databaseUrl);

  try {
    const already = await isBootstrapped(db);
    if (already) {
      console.log("✅ Setup already complete (admin user exists). Nothing to do.");
      process.exit(0);
    }

    const raw = await promptInit(envSummary);
    const input = InitInputSchema.parse(raw);

    console.log("\nCreating admin + clinic + RBAC defaults…\n");

    const result = await bootstrapSystem(db, input);

    console.log("✅ Bootstrap complete\n");
    console.log({
      admin_user_id: result.admin_user_id,
      clinic_id: result.clinic_id,
      clinic_user_id: result.clinic_user_id,
      role_id: result.role_id
    });

    console.log("\nNext:");
    console.log("- Start the web app (no setup code needed).");
    console.log("- Implement login/JWT next.\n");
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : String(err);

    if (msg.includes("aborted")) {
      console.log("Aborted.");
      process.exit(0);
    }

    if (msg.includes("setup_complete")) {
      console.error("⚠️ Setup already complete. Aborting.");
      process.exit(2);
    }

    console.error("❌ Init failed:", msg);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
```

---

# 11) Usage (document in README)

1. Ensure your infra env exists:

```bash
cp infra/compose/.env.example infra/compose/.env
```

2. Start docker:

```bash
pnpm infra:up
```

3. Install and run init wizard:

```bash
pnpm -C tools/init i
pnpm init
```

---

# 12) Notes for Cursor (important)

### Assumptions

* Postgres is reachable at `localhost:${POSTGRES_PORT}` from `infra/compose/.env`
* Your DB already contains:

  * `public.fn_is_bootstrapped()`
  * `public.fn_bootstrap_system(...)` with named params:

    * `p_admin_email`
    * `p_admin_password_hash`
    * `p_admin_first_name`
    * `p_admin_last_name`
    * `p_clinic_name`
    * `p_clinic_timezone`

If your function parameter names differ, update the SQL in `bootstrap.ts`.

### Security

* This CLI is intended for local provisioning or a one-off server run.
* It never stores plaintext password, only hashes it before sending to DB.
