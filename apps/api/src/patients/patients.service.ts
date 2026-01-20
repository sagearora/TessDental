import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database.service";

@Injectable()
export class PatientsService {
  constructor(private readonly db: DatabaseService) {}

  async findByClinicId(clinicId: number, query?: string) {
    if (query) {
      const searchTerm = `%${query.toLowerCase()}%`;
      return this.db.query(
        `SELECT * FROM patients 
         WHERE clinic_id = $1 
         AND is_active = true
         AND (
           LOWER(first_name) LIKE $2 
           OR LOWER(last_name) LIKE $2 
           OR LOWER(chart_no) LIKE $2 
           OR LOWER(email) LIKE $2
         )
         ORDER BY last_name, first_name
         LIMIT 50`,
        [clinicId, searchTerm]
      );
    }
    return this.db.query(
      `SELECT * FROM patients 
       WHERE clinic_id = $1 
       AND is_active = true 
       ORDER BY last_name, first_name
       LIMIT 50`,
      [clinicId]
    );
  }

  async create(createPatientDto: any) {
    const {
      clinic_id,
      chart_no,
      first_name,
      last_name,
      dob,
      email,
      preferred_contact_method,
    } = createPatientDto;

    const result = await this.db.queryOne(
      `INSERT INTO patients (
        clinic_id, chart_no, first_name, last_name, dob, email, 
        preferred_contact_method, is_active, created_at, updated_at, row_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW(), 1)
      RETURNING *`,
      [clinic_id, chart_no || null, first_name, last_name, dob || null, email || null, preferred_contact_method || null]
    );

    return result;
  }
}
