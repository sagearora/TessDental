import type { DbPool } from "./db.js";
import {
  type AddressData,
  type ContactPointData,
  type PersonData,
  type PatientData,
  type ReferralData,
  generateFamilyGroup,
  generateContactPoints,
  generatePatientData,
  generateReferral,
  generatePatientStatus
} from "./generators.js";

export interface SeedResult {
  patientsCreated: number;
  personsCreated: number;
  addressesCreated: number;
  referralsCreated: number;
}

/**
 * Validates that the clinic exists
 */
export async function validateClinic(db: DbPool, clinicId: number): Promise<boolean> {
  const result = await db.query<{ exists: boolean }>(
    "SELECT EXISTS(SELECT 1 FROM public.clinic WHERE id = $1 AND is_active = true) as exists",
    [clinicId]
  );
  return result.rows[0]?.exists ?? false;
}

/**
 * Inserts an address and returns its ID
 */
async function insertAddress(db: DbPool, address: AddressData): Promise<number> {
  const result = await db.query<{ id: number }>(
    `INSERT INTO public.address (line1, line2, city, region, postal_code, country, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id`,
    [address.line1, address.line2 || null, address.city, address.region, address.postal_code, address.country]
  );
  return result.rows[0].id;
}

/**
 * Inserts a person and returns its ID
 */
async function insertPerson(db: DbPool, person: PersonData): Promise<number> {
  // Ensure household_relationship is "self" or null when household_head_id is null
  // (household_head_id is not set in our seed, so it will be null)
  let householdRelationship = person.household_relationship || null;
  if (!person.household_head_id && householdRelationship && householdRelationship !== "self") {
    householdRelationship = "self";
  }
  
  const result = await db.query<{ id: number }>(
    `INSERT INTO public.person (
      clinic_id, first_name, last_name, middle_name, preferred_name,
      dob, gender, preferred_language, is_active,
      responsible_party_id, household_relationship, household_head_id,
      mailing_address_id, billing_address_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id`,
    [
      person.clinic_id,
      person.first_name,
      person.last_name,
      person.middle_name || null,
      person.preferred_name || null,
      person.dob,
      person.gender,
      person.preferred_language || null,
      true,
      person.responsible_party_id || null,
      householdRelationship,
      person.household_head_id || null,
      person.mailing_address_id || null,
      person.billing_address_id || null
    ]
  );
  return result.rows[0].id;
}

/**
 * Inserts a contact point
 */
async function insertContactPoint(db: DbPool, contact: ContactPointData): Promise<void> {
  await db.query(
    `INSERT INTO public.person_contact_point (
      person_id, kind, value, phone_e164, is_primary, is_active
    )
    VALUES ($1, $2, $3, $4, $5, true)`,
    [
      contact.person_id,
      contact.kind,
      contact.value,
      contact.phone_e164 || null,
      contact.is_primary
    ]
  );
}

/**
 * Inserts a patient record
 */
async function insertPatient(db: DbPool, patient: PatientData): Promise<void> {
  await db.query(
    `INSERT INTO public.patient (
      person_id, chart_no, status,
      family_doctor_name, family_doctor_phone, imaging_id, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, true)`,
    [
      patient.person_id,
      patient.chart_no || null,
      patient.status,
      patient.family_doctor_name || null,
      patient.family_doctor_phone || null,
      patient.imaging_id || null
    ]
  );
}

/**
 * Inserts a referral record
 */
async function insertReferral(db: DbPool, referral: ReferralData): Promise<void> {
  await db.query(
    `INSERT INTO public.patient_referral (
      patient_person_id, referral_kind,
      referral_contact_person_id, referral_source_id, referral_other_text,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5, true)`,
    [
      referral.patient_person_id,
      referral.referral_kind,
      referral.referral_contact_person_id || null,
      referral.referral_source_id || null,
      referral.referral_other_text || null
    ]
  );
}

/**
 * Main seeding function
 */
export async function seedPatients(
  db: DbPool,
  clinicId: number,
  targetCount: number = 500
): Promise<SeedResult> {
  // Validate clinic exists
  const clinicExists = await validateClinic(db, clinicId);
  if (!clinicExists) {
    throw new Error(`Clinic with ID ${clinicId} does not exist or is not active`);
  }

  // Start transaction
  await db.query("BEGIN");

  try {
    let patientsCreated = 0;
    let personsCreated = 0;
    let addressesCreated = 0;
    let referralsCreated = 0;
    const allPersonIds: number[] = [];
    let chartIndex = 1;

    console.log(`\nStarting seed for clinic ${clinicId}...`);
    console.log(`Target: ${targetCount} patients\n`);

    // Generate family groups until we reach target count
    while (patientsCreated < targetCount) {
      const familyGroup = generateFamilyGroup(clinicId);
      
      // Insert addresses first
      const addressIds: number[] = [];
      for (const address of familyGroup.addresses) {
        const addressId = await insertAddress(db, address);
        addressIds.push(addressId);
        addressesCreated++;
      }

      // Update person addresses with actual IDs
      // First address is mailing, second (if exists) is billing
      const mailingAddressId = addressIds[0];
      const billingAddressId = familyGroup.addresses.length > 1 ? addressIds[1] : addressIds[0];

      // Separate head of household from dependents
      // Head is the person with relationship "self" or the first person if no relationship is set
      const headOfHousehold = familyGroup.persons.find(p => 
        p.household_relationship === "self" || 
        (!p.household_relationship && !p.responsible_party_id)
      ) || familyGroup.persons[0];
      const dependents = familyGroup.persons.filter(p => p !== headOfHousehold);

      // Insert head of household first
      headOfHousehold.mailing_address_id = mailingAddressId;
      headOfHousehold.billing_address_id = billingAddressId;
      const headId = await insertPerson(db, headOfHousehold);
      allPersonIds.push(headId);
      personsCreated++;

      // Generate and insert contact points for head
      const headContacts = generateContactPoints(headId, true);
      for (const contact of headContacts) {
        await insertContactPoint(db, contact);
      }

        // Create patient record for head
        const headStatus = generatePatientStatus();
        const headPatient = generatePatientData(headId, chartIndex++, headStatus);
        await insertPatient(db, headPatient);
        patientsCreated++;

      // Update dependents with head's ID as responsible party (if not already set)
      for (const dependent of dependents) {
        if (!dependent.responsible_party_id) {
          dependent.responsible_party_id = headId;
        }
        dependent.mailing_address_id = mailingAddressId;
        dependent.billing_address_id = billingAddressId;
        
        const dependentId = await insertPerson(db, dependent);
        allPersonIds.push(dependentId);
        personsCreated++;

        // Generate and insert contact points
        const dependentAge = new Date().getFullYear() - dependent.dob.getFullYear();
        const isAdult = dependent.household_relationship !== "child" || dependentAge >= 18;
        const dependentContacts = generateContactPoints(dependentId, isAdult);
        for (const contact of dependentContacts) {
          await insertContactPoint(db, contact);
        }

          // Create patient record
          const dependentStatus = generatePatientStatus();
          const dependentPatient = generatePatientData(dependentId, chartIndex++, dependentStatus);
          await insertPatient(db, dependentPatient);
          patientsCreated++;

        if (patientsCreated >= targetCount) break;
      }

      // Progress update every 50 patients
      if (patientsCreated % 50 === 0) {
        console.log(`  Progress: ${patientsCreated}/${targetCount} patients created...`);
      }

      if (patientsCreated >= targetCount) break;
    }

    console.log(`\nCreating referrals...`);

    // Create referrals after all patients are created
    // 20-25% of patients should have referrals
    const numReferrals = Math.floor(allPersonIds.length * 0.225);
    const shuffledPersonIds = [...allPersonIds].sort(() => Math.random() - 0.5);
    const patientsWithReferrals = shuffledPersonIds.slice(0, numReferrals);

    for (const patientPersonId of patientsWithReferrals) {
      const referral = generateReferral(patientPersonId, allPersonIds);
      if (referral) {
        await insertReferral(db, referral);
        referralsCreated++;
      }
    }

    // Commit transaction
    await db.query("COMMIT");

    console.log(`\n✅ Seed complete!`);
    console.log(`  Patients created: ${patientsCreated}`);
    console.log(`  Persons created: ${personsCreated}`);
    console.log(`  Addresses created: ${addressesCreated}`);
    console.log(`  Referrals created: ${referralsCreated}\n`);

    return {
      patientsCreated,
      personsCreated,
      addressesCreated,
      referralsCreated
    };
  } catch (error) {
    // Rollback on error
    await db.query("ROLLBACK");
    throw error;
  }
}
