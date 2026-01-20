import { useDroppable } from "@dnd-kit/core";
import { AppointmentCard } from "./AppointmentCard";
import { SelectionOverlay } from "./SelectionOverlay";
import { useDaySchedulerLayout } from "./useDaySchedulerLayout";
import type { AppointmentWithRelations, Operatory } from "@/api/types";
import type { Selection } from "./useDragSelection";
import { getWindowStart, DEFAULT_DAY_START_HOUR, DEFAULT_PX_PER_MINUTE } from "@/lib/time";

interface OperatoryColumnProps {
  operatory: Operatory;
  appointments: AppointmentWithRelations[];
  timezone: string;
  date: Date;
  pxPerMinute?: number;
  selection: Selection | null;
  onEditAppointment: (appointment: AppointmentWithRelations) => void;
  onResizeStart?: (appointment: AppointmentWithRelations, edge: "top" | "bottom") => void;
}

export function OperatoryColumn({
  operatory,
  appointments,
  timezone,
  date,
  pxPerMinute = DEFAULT_PX_PER_MINUTE,
  selection,
  onEditAppointment,
  onResizeStart,
}: OperatoryColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `operatory-${operatory.id}`,
  });

  const layoutedAppointments = useDaySchedulerLayout(appointments, operatory.id);
  const windowStart = getWindowStart(date, timezone, 7);

  return (
    <div
      ref={setNodeRef}
      className={`
        relative border-r border-gray-200 bg-white
        ${isOver ? "bg-blue-50" : ""}
      `}
      style={{ minWidth: "200px" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-50 border-b border-gray-200 px-3 py-2 font-medium text-sm">
        {operatory.name}
        {operatory.short_name && (
          <span className="text-gray-500 ml-1">({operatory.short_name})</span>
        )}
      </div>

      {/* Grid content */}
      <div className="relative" style={{ minHeight: "720px" }}>
        {/* Selection overlay */}
        {selection && selection.operatoryId === operatory.id && (
          <SelectionOverlay
            selection={selection}
            timezone={timezone}
            pxPerMinute={pxPerMinute}
            windowStart={windowStart}
          />
        )}

        {/* Appointments */}
        {layoutedAppointments.map((layouted) => (
          <AppointmentCard
            key={layouted.appointment.id}
            appointment={layouted.appointment}
            layout={layouted}
            timezone={timezone}
            pxPerMinute={pxPerMinute}
            windowStart={windowStart}
            onEdit={onEditAppointment}
            onResizeStart={onResizeStart}
          />
        ))}
      </div>
    </div>
  );
}
