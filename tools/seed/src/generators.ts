import { faker } from "@faker-js/faker";

// Canadian provinces and territories
const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon"
] as const;

// Major Canadian cities by province
const CANADIAN_CITIES: Record<string, string[]> = {
  "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert"],
  "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"],
  "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie"],
  "New Brunswick": ["Saint John", "Moncton", "Fredericton", "Dieppe", "Miramichi"],
  "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South", "Grand Falls-Windsor"],
  "Northwest Territories": ["Yellowknife", "Hay River", "Inuvik", "Fort Smith", "Behchokǫ̀"],
  "Nova Scotia": ["Halifax", "Dartmouth", "Sydney", "Truro", "New Glasgow"],
  "Nunavut": ["Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake", "Cambridge Bay"],
  "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Windsor", "Kitchener", "Winnipeg"],
  "Prince Edward Island": ["Charlottetown", "Summerside", "Stratford", "Cornwall", "Montague"],
  "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Lévis", "Trois-Rivières", "Terrebonne"],
  "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current"],
  "Yukon": ["Whitehorse", "Dawson City", "Watson Lake", "Haines Junction", "Carmacks"]
};

// Common Canadian area codes
const CANADIAN_AREA_CODES = [
  "416", "647", "437", // Toronto
  "514", "438", "450", // Montreal
  "613", "343", // Ottawa
  "604", "778", "236", // Vancouver
  "780", "587", // Edmonton
  "403", "825", // Calgary
  "204", // Winnipeg
  "902", // Nova Scotia/PEI
  "506", // New Brunswick
  "709", // Newfoundland
  "306", // Saskatchewan
  "807", // Northwestern Ontario
  "705", // Northern Ontario
  "519", "226", // Southwestern Ontario
  "905", "289", "365" // Greater Toronto Area
];

// Common languages in Canada
const CANADIAN_LANGUAGES = [
  "English",
  "French",
  "Mandarin",
  "Cantonese",
  "Punjabi",
  "Spanish",
  "Arabic",
  "Tagalog",
  "Italian",
  "German",
  "Portuguese",
  "Hindi",
  "Urdu",
  "Polish",
  "Russian"
];

// Patient status distribution
const PATIENT_STATUSES = [
  { status: "active", weight: 75 },
  { status: "inactive", weight: 10 },
  { status: "archived", weight: 8 },
  { status: "deleted", weight: 5 },
  { status: "deceased", weight: 2 }
] as const;

export type PersonData = {
  clinic_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  preferred_name?: string;
  dob: Date;
  gender: string;
  preferred_language?: string;
  responsible_party_id?: number;
  household_relationship?: "self" | "child" | "spouse" | "parent" | "guardian" | "other";
  household_head_id?: number;
  mailing_address_id?: number;
  billing_address_id?: number;
};

export type AddressData = {
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
};

export type ContactPointData = {
  person_id: number;
  kind: "email" | "cell_phone" | "home_phone" | "work_phone";
  value: string;
  phone_e164?: string;
  is_primary: boolean;
};

export type PatientData = {
  person_id: number;
  chart_no?: string;
  status: string;
  family_doctor_name?: string;
  family_doctor_phone?: string;
  imaging_id?: string;
};

export type ReferralData = {
  patient_person_id: number;
  referral_kind: "contact" | "source" | "other";
  referral_contact_person_id?: number;
  referral_source_id?: number;
  referral_other_text?: string;
};

/**
 * Generates a valid Canadian postal code (format: A1A 1A1)
 */
export function generatePostalCode(): string {
  const letters = "ABCDEFGHJKLMNPRSTUVWXYZ";
  const numbers = "0123456789";
  
  const firstLetter = letters[Math.floor(Math.random() * letters.length)];
  const firstNumber = numbers[Math.floor(Math.random() * numbers.length)];
  const secondLetter = letters[Math.floor(Math.random() * letters.length)];
  const space = " ";
  const thirdNumber = numbers[Math.floor(Math.random() * numbers.length)];
  const fourthLetter = letters[Math.floor(Math.random() * letters.length)];
  const fifthNumber = numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${firstLetter}${firstNumber}${secondLetter}${space}${thirdNumber}${fourthLetter}${fifthNumber}`;
}

/**
 * Generates a Canadian phone number in E.164 format
 */
export function generatePhoneNumber(): { formatted: string; e164: string } {
  const areaCode = CANADIAN_AREA_CODES[Math.floor(Math.random() * CANADIAN_AREA_CODES.length)];
  const exchange = Math.floor(Math.random() * 900) + 100; // 100-999
  const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  
  const formatted = `(${areaCode}) ${exchange}-${number}`;
  const e164 = `+1${areaCode}${exchange}${number}`;
  
  return { formatted, e164 };
}

/**
 * Generates a Canadian address
 */
export function generateAddress(): AddressData {
  const province = CANADIAN_PROVINCES[Math.floor(Math.random() * CANADIAN_PROVINCES.length)];
  const cities = CANADIAN_CITIES[province] || [faker.location.city()];
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  const hasUnit = Math.random() < 0.3; // 30% have unit numbers
  
  return {
    line1: `${Math.floor(Math.random() * 9999) + 1} ${faker.location.street()}`,
    line2: hasUnit ? `Unit ${Math.floor(Math.random() * 500) + 1}` : undefined,
    city,
    region: province,
    postal_code: generatePostalCode(),
    country: "Canada"
  };
}

/**
 * Generates a name with special character variations (apostrophes, dashes, prefixes)
 * This creates more realistic test data for names like O'Brien, St. Lawrence, Van Der Berg, etc.
 */
function generateNameWithVariations(baseName: string, isLastName: boolean = false): string {
  // 35% chance to apply variations
  if (Math.random() > 0.35) {
    return baseName;
  }

  const variationType = Math.random();

  if (variationType < 0.25) {
    // Apostrophes: O'Brien, D'Angelo, L'Heureux, D'Artagnan
    const apostrophePrefixes = ["O'", "D'", "L'", "Mc'", "Mac'"];
    const prefix = faker.helpers.arrayElement(apostrophePrefixes);
    const capitalized = baseName.charAt(0).toUpperCase() + baseName.slice(1).toLowerCase();
    return prefix + capitalized;
  } else if (variationType < 0.50) {
    // Dashes: Smith-Jones, Mary-Jane
    const secondPart = isLastName 
      ? faker.person.lastName() 
      : faker.person.firstName();
    return `${baseName}-${secondPart}`;
  } else if (variationType < 0.75 && isLastName) {
    // Prefixes for last names: St. Lawrence, Van Der Berg, De La Cruz
    const prefixType = Math.random();
    if (prefixType < 0.3) {
      // St. prefix
      const stNames = ["Lawrence", "John", "James", "Pierre", "Claire", "Michael", "Patrick"];
      return `St. ${faker.helpers.arrayElement(stNames)}`;
    } else if (prefixType < 0.6) {
      // Van Der / Van prefix
      const vanParts = ["Der Berg", "Der Meer", "Der Wal", "Der Berg", "Der Hout", "Der Laan"];
      return `Van ${faker.helpers.arrayElement(vanParts)}`;
    } else {
      // De La / De prefix
      const deParts = ["La Cruz", "La Rosa", "La Torre", "La Fuente", "La Vega", "La Montagne"];
      return `De ${faker.helpers.arrayElement(deParts)}`;
    }
  } else if (variationType < 0.85 && isLastName) {
    // Mc/Mac prefixes: McDonald, MacLeod, McAllister
    const mcPrefix = Math.random() < 0.5 ? "Mc" : "Mac";
    const capitalized = baseName.charAt(0).toUpperCase() + baseName.slice(1).toLowerCase();
    return `${mcPrefix}${capitalized}`;
  } else if (variationType < 0.95 && isLastName) {
    // Compound last names without periods: St Lawrence, Van Der Berg
    const compoundType = Math.random();
    if (compoundType < 0.5) {
      const stNames = ["Lawrence", "John", "James", "Pierre", "Claire"];
      return `St ${faker.helpers.arrayElement(stNames)}`;
    } else {
      const vanParts = ["Der Berg", "Der Meer", "Der Wal"];
      return `Van ${faker.helpers.arrayElement(vanParts)}`;
    }
  }

  return baseName;
}

/**
 * Generates person data with appropriate age based on relationship
 */
export function generatePersonData(
  clinicId: number,
  isHeadOfHousehold: boolean,
  responsiblePartyId?: number,
  relationship?: "self" | "child" | "spouse" | "parent" | "guardian" | "other"
): PersonData {
  const gender = faker.helpers.arrayElement(["male", "female", "other"]);
  const baseFirstName = faker.person.firstName(gender === "male" ? "male" : gender === "female" ? "female" : undefined);
  const baseLastName = faker.person.lastName();
  
  // Apply name variations (35% chance for each name)
  const firstName = generateNameWithVariations(baseFirstName, false);
  const lastName = generateNameWithVariations(baseLastName, true);
  const middleName = Math.random() < 0.3 
    ? generateNameWithVariations(faker.person.firstName(), false) 
    : undefined;
  const preferredName = Math.random() < 0.2 
    ? generateNameWithVariations(faker.person.firstName(), false) 
    : undefined;
  
  // Calculate age based on relationship
  let age: number;
  if (relationship === "child") {
    age = Math.floor(Math.random() * 18); // 0-17
  } else if (relationship === "spouse") {
    age = Math.floor(Math.random() * 50) + 25; // 25-75
  } else {
    age = Math.floor(Math.random() * 63) + 18; // 18-80
  }
  
  const dob = new Date();
  dob.setFullYear(dob.getFullYear() - age);
  dob.setMonth(Math.floor(Math.random() * 12));
  dob.setDate(Math.floor(Math.random() * 28) + 1);
  
  const preferredLanguage = Math.random() < 0.7 
    ? faker.helpers.arrayElement(CANADIAN_LANGUAGES)
    : undefined;
  
  // When household_head_id is null, household_relationship must be "self" or null
  // Since we're not using household_head_id in seed, set relationship accordingly
  let householdRelationship: "self" | "child" | "spouse" | "parent" | "guardian" | "other" | undefined;
  if (isHeadOfHousehold) {
    householdRelationship = "self";
  } else {
    // For dependents, we use responsible_party_id for the relationship
    // household_relationship should be null when household_head_id is null
    householdRelationship = undefined;
  }
  
  return {
    clinic_id: clinicId,
    first_name: firstName,
    last_name: lastName,
    middle_name: middleName,
    preferred_name: preferredName,
    dob,
    gender,
    preferred_language: preferredLanguage,
    responsible_party_id: responsiblePartyId,
    household_relationship: householdRelationship
  };
}

/**
 * Generates contact points (phones and emails) for a person
 */
export function generateContactPoints(
  personId: number,
  isAdult: boolean
): ContactPointData[] {
  const contacts: ContactPointData[] = [];
  
  // Primary email (all patients)
  contacts.push({
    person_id: personId,
    kind: "email",
    value: faker.internet.email().toLowerCase(),
    is_primary: true
  });
  
  // Secondary email (20% of patients) - still use "email" kind
  if (Math.random() < 0.2) {
    contacts.push({
      person_id: personId,
      kind: "email",
      value: faker.internet.email().toLowerCase(),
      is_primary: false
    });
  }
  
  // Primary cell phone (most patients)
  if (isAdult || Math.random() < 0.5) {
    const cellPhone = generatePhoneNumber();
    contacts.push({
      person_id: personId,
      kind: "cell_phone",
      value: cellPhone.formatted,
      phone_e164: cellPhone.e164,
      is_primary: true
    });
  }
  
  // Home phone (60% of households, only for adults)
  if (isAdult && Math.random() < 0.6) {
    const homePhone = generatePhoneNumber();
    contacts.push({
      person_id: personId,
      kind: "home_phone",
      value: homePhone.formatted,
      phone_e164: homePhone.e164,
      is_primary: false
    });
  }
  
  // Work phone (30% of adults)
  if (isAdult && Math.random() < 0.3) {
    const workPhone = generatePhoneNumber();
    contacts.push({
      person_id: personId,
      kind: "work_phone",
      value: workPhone.formatted,
      phone_e164: workPhone.e164,
      is_primary: false
    });
  }
  
  return contacts;
}

/**
 * Generates a patient status based on distribution
 */
export function generatePatientStatus(): string {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const { status, weight } of PATIENT_STATUSES) {
    cumulative += weight;
    if (random < cumulative) {
      return status;
    }
  }
  
  return "active"; // fallback
}

/**
 * Generates a chart number
 */
export function generateChartNumber(index: number): string {
  return `CH-${String(index).padStart(4, "0")}`;
}

/**
 * Generates patient data
 */
export function generatePatientData(
  personId: number,
  chartIndex: number,
  status?: string
): PatientData {
  const hasFamilyDoctor = Math.random() < 0.4; // 40% have family doctor
  
  return {
    person_id: personId,
    chart_no: generateChartNumber(chartIndex),
    status: status || generatePatientStatus(),
    family_doctor_name: hasFamilyDoctor ? `Dr. ${faker.person.fullName()}` : undefined,
    family_doctor_phone: hasFamilyDoctor ? generatePhoneNumber().formatted : undefined,
    imaging_id: Math.random() < 0.3 ? `IMG-${Math.floor(Math.random() * 10000)}` : undefined
  };
}

/**
 * Generates a family group
 */
export function generateFamilyGroup(clinicId: number): {
  persons: PersonData[];
  addresses: AddressData[];
} {
  const familyType = Math.random();
  const persons: PersonData[] = [];
  const addresses: AddressData[] = [];
  
  // Generate mailing address
  const mailingAddress = generateAddress();
  addresses.push(mailingAddress);
  
  // Generate billing address (90% same as mailing, 10% different)
  const billingAddress = Math.random() < 0.9 ? mailingAddress : generateAddress();
  if (billingAddress !== mailingAddress) {
    addresses.push(billingAddress);
  }
  
  if (familyType < 0.6) {
    // 60% single patients
    const person = generatePersonData(clinicId, true);
    person.mailing_address_id = 1; // Will be set after address insertion
    person.billing_address_id = billingAddress === mailingAddress ? 1 : 2;
    persons.push(person);
  } else if (familyType < 0.85) {
    // 25% couples (spouse relationship)
    const head = generatePersonData(clinicId, true);
    const headAge = new Date().getFullYear() - head.dob.getFullYear();
    const spouseAge = headAge + Math.floor(Math.random() * 11) - 5; // Within 5 years
    
    const spouse = generatePersonData(clinicId, false, undefined, "spouse");
    const spouseDob = new Date();
    spouseDob.setFullYear(spouseDob.getFullYear() - spouseAge);
    spouse.dob = spouseDob;
    spouse.responsible_party_id = undefined; // Will be set to head's ID after insertion
    spouse.household_relationship = "spouse";
    
    head.mailing_address_id = 1;
    head.billing_address_id = billingAddress === mailingAddress ? 1 : 2;
    spouse.mailing_address_id = 1;
    spouse.billing_address_id = billingAddress === mailingAddress ? 1 : 2;
    
    persons.push(head);
    persons.push(spouse);
  } else {
    // 15% families with children (1-3 children)
    const head = generatePersonData(clinicId, true);
    const headAge = new Date().getFullYear() - head.dob.getFullYear();
    
    // Add spouse (70% of families with children have both parents)
    let spouse: PersonData | undefined;
    if (Math.random() < 0.7) {
      const spouseAge = headAge + Math.floor(Math.random() * 11) - 5;
      spouse = generatePersonData(clinicId, false, undefined, "spouse");
      const spouseDob = new Date();
      spouseDob.setFullYear(spouseDob.getFullYear() - spouseAge);
      spouse.dob = spouseDob;
      spouse.household_relationship = "spouse";
      spouse.mailing_address_id = 1;
      spouse.billing_address_id = billingAddress === mailingAddress ? 1 : 2;
    }
    
    // Add children (1-3)
    const numChildren = Math.floor(Math.random() * 3) + 1;
    const children: PersonData[] = [];
    for (let i = 0; i < numChildren; i++) {
      const child = generatePersonData(clinicId, false, undefined, "child");
      child.mailing_address_id = 1;
      child.billing_address_id = billingAddress === mailingAddress ? 1 : 2;
      children.push(child);
    }
    
    head.mailing_address_id = 1;
    head.billing_address_id = billingAddress === mailingAddress ? 1 : 2;
    
    persons.push(head);
    if (spouse) {
      persons.push(spouse);
    }
    persons.push(...children);
  }
  
  return { persons, addresses };
}

/**
 * Generates a referral (contact, source, or other)
 */
export function generateReferral(
  patientPersonId: number,
  allPersonIds: number[]
): ReferralData | null {
  // 20-25% of patients have referrals
  if (Math.random() > 0.23) {
    return null;
  }
  
  const referralType = Math.random();
  
  if (referralType < 0.4) {
    // 40% are contact referrals
    // Select a random person from the pool (excluding self)
    const availablePersons = allPersonIds.filter(id => id !== patientPersonId);
    if (availablePersons.length === 0) {
      return null; // Can't create contact referral without other people
    }
    
    const contactPersonId = availablePersons[Math.floor(Math.random() * availablePersons.length)];
    
    return {
      patient_person_id: patientPersonId,
      referral_kind: "contact",
      referral_contact_person_id: contactPersonId
    };
  } else if (referralType < 0.7) {
    // 30% are source referrals (would need referral_source_id, skip for now)
    // Could be implemented if referral_source table has data
    return null;
  } else {
    // 30% are other referrals
    const otherReasons = [
      "Friend recommendation",
      "Online search",
      "Walk-in",
      "Insurance provider",
      "Previous patient",
      "Social media",
      "Advertisement"
    ];
    
    return {
      patient_person_id: patientPersonId,
      referral_kind: "other",
      referral_other_text: faker.helpers.arrayElement(otherReasons)
    };
  }
}
