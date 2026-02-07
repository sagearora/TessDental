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

    console.log("\nNext: Start the web app at http://localhost:5173\n");
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
