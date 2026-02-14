import { input, password, select, confirm } from "@inquirer/prompts";
import type { InitInput } from "./validate.js";

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
  
  const email = await input({
    message: "Admin email:",
    validate: (value: string) => {
      if (!value || value.trim().length === 0) {
        return "Email is required";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Invalid email format";
      }
      return true;
    }
  });
  
  let pw: string;
  let pwConfirm: string;
  
  // Keep asking for password until they match
  while (true) {
    pw = await password({
      message: "Admin password (min 10 chars):",
      mask: "*",
      validate: (value: string) => {
        if (!value || value.length < 10) {
          return "Password must be at least 10 characters";
        }
        return true;
      }
    });
    
    pwConfirm = await password({
      message: "Confirm password:",
      mask: "*"
    });
    
    if (pw === pwConfirm) {
      break;
    }
    
    console.log("❌ Passwords do not match. Please try again.\n");
  }
  
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
