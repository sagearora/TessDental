import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database.service";

@Injectable()
export class AppointmentsService {
  constructor(private readonly db: DatabaseService) {}

  async findByClinicAndDateRange(clinicId: number, start: string, end: string) {
    const appointments = await this.db.query(
      `SELECT a.*, 
        jsonb_build_object(
          'id', p.id, 'first_name', p.first_name, 'last_name', p.last_name,
          'chart_no', p.chart_no, 'email', p.email
        ) as patient,
        jsonb_build_object(
          'id', u.id, 'first_name', u.first_name, 'last_name', u.last_name,
          'email', u.email, 'role', u.role
        ) as provider,
        jsonb_build_object(
          'id', o.id, 'name', o.name, 'short_name', o.short_name
        ) as operatory,
        jsonb_build_object(
          'id', s.id, 'name', s.name, 'color', s.color
        ) as status,
        jsonb_build_object(
          'id', c.id, 'name', c.name
        ) as confirmation
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.provider_id = u.id
      LEFT JOIN operatories o ON a.operatory_id = o.id
      LEFT JOIN appointment_statuses s ON a.status_id = s.id
      LEFT JOIN appointment_confirmations c ON a.confirmation_id = c.id
      WHERE a.clinic_id = $1 
        AND a.start_at >= $2::timestamptz 
        AND a.start_at < $3::timestamptz
        AND a.cancelled_at IS NULL
      ORDER BY a.start_at`,
      [clinicId, start, end]
    );

    // Get tags for each appointment
    for (const appointment of appointments) {
      const tags = await this.db.query(
        `SELECT t.* FROM appointment_tags t
         INNER JOIN appointment_tag_links l ON t.id = l.appointment_tag_id
         WHERE l.appointment_id = $1`,
        [appointment.id]
      );
      appointment.tags = tags;
    }

    return appointments;
  }

  async create(createAppointmentDto: any) {
    const {
      clinic_id,
      type = "appointment",
      start_at,
      length_minutes,
      operatory_id,
      provider_id,
      patient_id,
      status_id,
      confirmation_id,
      title,
      notes,
      source = "front_desk",
    } = createAppointmentDto;

    const result = await this.db.queryOne(
      `INSERT INTO appointments (
        clinic_id, type, start_at, length_minutes, end_at,
        operatory_id, provider_id, patient_id, status_id, confirmation_id,
        title, notes, show_on_calendar, is_online_booking, is_self_bookable,
        booked_at, source, last_modified_at, created_at, updated_at, row_version
      ) VALUES (
        $1, $2, $3::timestamptz, $4, $3::timestamptz + ($4 || ' minutes')::interval,
        $5, $6, $7, $8, $9, $10, $11, true, false, false,
        NOW(), $12, NOW(), NOW(), NOW(), 1
      )
      RETURNING *`,
      [
        clinic_id,
        type,
        start_at,
        length_minutes,
        operatory_id,
        provider_id || null,
        patient_id || null,
        status_id,
        confirmation_id || null,
        title || null,
        notes || null,
        source,
      ]
    );

    return result;
  }

  async update(id: number, updateAppointmentDto: any) {
    const {
      start_at,
      length_minutes,
      operatory_id,
      provider_id,
      patient_id,
      status_id,
      confirmation_id,
      title,
      notes,
      row_version,
    } = updateAppointmentDto;

    // Check row version for optimistic locking
    const current = await this.db.queryOne(
      `SELECT row_version FROM appointments WHERE id = $1`,
      [id]
    );

    if (!current) {
      throw new Error("Appointment not found");
    }

    if (current.row_version !== row_version) {
      const error: any = new Error("Appointment was modified by another user");
      error.status = 409;
      throw error;
    }

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (start_at !== undefined) {
      updates.push(`start_at = $${paramIndex}::timestamptz`);
      params.push(start_at);
      paramIndex++;
    }

    if (length_minutes !== undefined) {
      updates.push(`length_minutes = $${paramIndex}`);
      params.push(length_minutes);
      paramIndex++;
    }

    if (start_at !== undefined || length_minutes !== undefined) {
      updates.push(`end_at = start_at + (length_minutes || ' minutes')::interval`);
    }

    if (operatory_id !== undefined) {
      updates.push(`operatory_id = $${paramIndex}`);
      params.push(operatory_id);
      paramIndex++;
    }

    if (provider_id !== undefined) {
      updates.push(`provider_id = $${paramIndex}`);
      params.push(provider_id);
      paramIndex++;
    }

    if (patient_id !== undefined) {
      updates.push(`patient_id = $${paramIndex}`);
      params.push(patient_id);
      paramIndex++;
    }

    if (status_id !== undefined) {
      updates.push(`status_id = $${paramIndex}`);
      params.push(status_id);
      paramIndex++;
    }

    if (confirmation_id !== undefined) {
      updates.push(`confirmation_id = $${paramIndex}`);
      params.push(confirmation_id);
      paramIndex++;
    }

    if (title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      params.push(title);
      paramIndex++;
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      params.push(notes);
      paramIndex++;
    }

    updates.push(`updated_at = NOW()`);
    updates.push(`last_modified_at = NOW()`);
    updates.push(`row_version = row_version + 1`);

    params.push(id);

    const result = await this.db.queryOne(
      `UPDATE appointments 
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *`,
      params
    );

    return result;
  }

  async cancel(id: number) {
    const result = await this.db.queryOne(
      `UPDATE appointments 
       SET cancelled_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result;
  }
}
