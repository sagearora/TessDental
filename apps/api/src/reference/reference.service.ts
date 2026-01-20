import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database.service";

@Injectable()
export class ReferenceService {
  constructor(private readonly db: DatabaseService) {}

  async getStatuses(clinicId: number) {
    return this.db.query(
      `SELECT * FROM appointment_statuses 
       WHERE clinic_id = $1 AND is_active = true 
       ORDER BY workflow_order, name`,
      [clinicId]
    );
  }

  async getConfirmations(clinicId: number) {
    return this.db.query(
      `SELECT * FROM appointment_confirmations 
       WHERE clinic_id = $1 AND is_active = true 
       ORDER BY workflow_order, name`,
      [clinicId]
    );
  }

  async getTags(clinicId: number) {
    return this.db.query(
      `SELECT * FROM appointment_tags 
       WHERE clinic_id = $1 AND is_active = true 
       ORDER BY name`,
      [clinicId]
    );
  }
}
