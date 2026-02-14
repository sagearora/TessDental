import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// tools/seed/src -> repo root -> infra/compose/.env
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
  // Helpful confirmation so you don't accidentally seed the wrong DB
  return {
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PORT: process.env.POSTGRES_PORT
  };
}
