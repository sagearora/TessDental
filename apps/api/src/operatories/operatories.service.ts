import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database.service";

@Injectable()
export class OperatoriesService {
  constructor(private readonly db: DatabaseService) {}

  async findByClinicId(clinicId: number) {
    return this.db.query(
      `SELECT * FROM operatories WHERE clinic_id = $1 AND is_active = true ORDER BY name`,
      [clinicId]
    );
  }
}
