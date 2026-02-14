import type { DbPool } from "./db.js";
import type { InitInput } from "./validate.js";
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
