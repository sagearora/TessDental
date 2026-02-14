import { createPool } from "./db.js";
import { getDatabaseUrl, getEnvSummaryForDisplay } from "./env.js";
import { input, select, confirm, number } from "@inquirer/prompts";
import { seedPatients, validateClinic } from "./seed.js";

async function getClinicId(db: ReturnType<typeof createPool>): Promise<number> {
  // Query for existing clinics
  const result = await db.query<{ id: number; name: string }>(
    "SELECT id, name FROM public.clinic WHERE is_active = true ORDER BY id"
  );

  if (result.rows.length === 0) {
    throw new Error("No active clinics found. Please run the init tool first.");
  }

  const clinics = result.rows;

  if (clinics.length === 1) {
    const useOnly = await confirm({
      message: `Found clinic: ${clinics[0].name} (ID: ${clinics[0].id}). Use this clinic?`,
      default: true
    });

    if (useOnly) {
      return clinics[0].id;
    }
  }

  // Show list of clinics
  const clinicChoices = clinics.map((clinic: { id: number; name: string }) => ({
    name: `${clinic.name} (ID: ${clinic.id})`,
    value: clinic.id
  }));

  const selectedId = await select<number>({
    message: "Select a clinic to seed:",
    choices: clinicChoices
  });

  return selectedId;
}

async function main() {
  const databaseUrl = getDatabaseUrl();
  const envSummary = getEnvSummaryForDisplay();

  const db = createPool(databaseUrl);

  try {
    console.log("\nTessDental Patient Seed Tool\n");
    console.log("Database target:");
    console.log(envSummary);
    console.log("");

    const proceed = await confirm({
      message: "Continue and seed patients in this database?",
      default: false
    });

    if (!proceed) {
      console.log("Aborted.");
      process.exit(0);
    }

    // Get clinic ID
    const clinicId = await getClinicId(db);

    // Validate clinic exists
    const clinicExists = await validateClinic(db, clinicId);
    if (!clinicExists) {
      throw new Error(`Clinic with ID ${clinicId} does not exist or is not active.`);
    }

    // Get target count
    const targetCount = await number({
      message: "How many patients to create?",
      default: 500,
      validate: (value: number | undefined) => {
        if (value === undefined || value < 1) {
          return "Must create at least 1 patient";
        }
        if (value > 10000) {
          return "Maximum 10,000 patients per seed run";
        }
        return true;
      }
    });

    console.log(`\nSeeding ${targetCount} patients for clinic ${clinicId}...`);
    console.log("This may take a few minutes...\n");

    const result = await seedPatients(db, clinicId, targetCount);

    console.log("✅ Seed complete!\n");
    console.log("Summary:");
    console.log(`  Patients: ${result?.patientsCreated ?? 0}`);
    console.log(`  Persons: ${result?.personsCreated ?? 0}`);
    console.log(`  Addresses: ${result?.addressesCreated ?? 0}`);
    console.log(`  Referrals: ${result?.referralsCreated ?? 0}\n`);
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : String(err);

    if (msg.includes("aborted")) {
      console.log("Aborted.");
      process.exit(0);
    }

    console.error("❌ Seed failed:", msg);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
