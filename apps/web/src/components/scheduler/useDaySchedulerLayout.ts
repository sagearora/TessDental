import { useMemo } from "react";
import type { AppointmentWithRelations } from "@/api/types";

export interface LayoutedAppointment {
  appointment: AppointmentWithRelations;
  column: number; // Column within the operatory (for overlaps)
  totalColumns: number; // Total columns in this overlap group
  leftPercent: number;
  widthPercent: number;
}

/**
 * Calculate overlap layout for appointments in a single operatory
 */
export function useDaySchedulerLayout(
  appointments: AppointmentWithRelations[],
  operatoryId: number
): LayoutedAppointment[] {
  return useMemo(() => {
    // Filter appointments for this operatory
    const operatoryAppointments = appointments.filter(
      (a) => a.operatory_id === operatoryId && !a.cancelled_at
    );

    if (operatoryAppointments.length === 0) return [];

    // Sort by start time
    const sorted = [...operatoryAppointments].sort(
      (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    );

    // Group overlapping appointments
    const groups: AppointmentWithRelations[][] = [];
    let currentGroup: AppointmentWithRelations[] = [];

    for (const appointment of sorted) {
      if (currentGroup.length === 0) {
        currentGroup.push(appointment);
        continue;
      }

      // Check if this appointment overlaps with any in current group
      const appointmentStart = new Date(appointment.start_at);
      const appointmentEnd = new Date(appointment.end_at);
      const overlaps = currentGroup.some((a) => {
        const aStart = new Date(a.start_at);
        const aEnd = new Date(a.end_at);
        return appointmentStart < aEnd && appointmentEnd > aStart;
      });

      if (overlaps) {
        currentGroup.push(appointment);
      } else {
        groups.push(currentGroup);
        currentGroup = [appointment];
      }
    }
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    // Assign columns within each group
    const layouted: LayoutedAppointment[] = [];

    for (const group of groups) {
      const totalColumns = group.length;
      group.forEach((appointment, index) => {
        layouted.push({
          appointment,
          column: index,
          totalColumns,
          leftPercent: (index / totalColumns) * 100,
          widthPercent: 100 / totalColumns,
        });
      });
    }

    return layouted;
  }, [appointments, operatoryId]);
}
