import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { TimeGutter } from "./TimeGutter";
import { OperatoryColumn } from "./OperatoryColumn";
import { useDragSelection } from "./useDragSelection";
import { roundToUnit, getWindowStart, DEFAULT_DAY_START_HOUR, DEFAULT_PX_PER_MINUTE } from "@/lib/time";
import type { AppointmentWithRelations, Operatory, Clinic } from "@/api/types";
import { useState } from "react";

interface DaySchedulerProps {
  clinic: Clinic;
  date: Date;
  operatories: Operatory[];
  appointments: AppointmentWithRelations[];
  onSelectionComplete: (selection: { startTime: Date; endTime: Date; operatoryId: number }) => void;
  onAppointmentMove: (appointmentId: number, newStart: Date, newOperatoryId: number) => void;
  onEditAppointment: (appointment: AppointmentWithRelations) => void;
  onResizeStart?: (appointment: AppointmentWithRelations, edge: "top" | "bottom") => void;
  pxPerMinute?: number;
}

export function DayScheduler({
  clinic,
  date,
  operatories,
  appointments,
  onSelectionComplete,
  onAppointmentMove,
  onEditAppointment,
  onResizeStart,
  pxPerMinute = DEFAULT_PX_PER_MINUTE,
}: DaySchedulerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const roundToMinutes = (d: Date) => roundToUnit(d, clinic.unit_length_minutes, clinic.timezone);

  const {
    isSelecting,
    selection,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDragSelection(onSelectionComplete, roundToMinutes);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    const appointmentId = parseInt((active.id as string).replace("appointment-", ""));
    const operatoryId = parseInt((over.id as string).replace("operatory-", ""));

    if (isNaN(appointmentId) || isNaN(operatoryId)) return;

    const appointment = appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;

    // For now, just move to new operatory with same start time
    // In a full implementation, we'd calculate the new start time based on drop position
    onAppointmentMove(appointmentId, new Date(appointment.start_at), operatoryId);
  };

  const activeAppointment = activeId
    ? appointments.find((a) => `appointment-${a.id}` === activeId)
    : null;

  const handleGridMouseDown = (e: React.MouseEvent, operatoryId: number) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("grid-cell")) {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const windowStart = getWindowStart(date, clinic.timezone, DEFAULT_DAY_START_HOUR);
      const time = new Date(windowStart.getTime() + (y / pxPerMinute) * 60 * 1000);
      handleMouseDown(time, operatoryId);
    }
  };

  const handleGridMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const windowStart = getWindowStart(date, clinic.timezone, DEFAULT_DAY_START_HOUR);
    const time = new Date(windowStart.getTime() + (y / pxPerMinute) * 60 * 1000);
    handleMouseMove(time);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
        <TimeGutter date={date} clinic={clinic} pxPerMinute={pxPerMinute} />
        <div className="flex-1 overflow-x-auto">
          <div className="flex">
            {operatories.map((operatory) => (
              <div
                key={operatory.id}
                className="flex-1 min-w-[200px]"
                onMouseDown={(e) => handleGridMouseDown(e, operatory.id)}
                onMouseMove={handleGridMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <OperatoryColumn
                  operatory={operatory}
                  appointments={appointments}
                  timezone={clinic.timezone}
                  date={date}
                  pxPerMinute={pxPerMinute}
                  selection={selection}
                  onEditAppointment={onEditAppointment}
                  onResizeStart={onResizeStart}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeAppointment ? (
          <div className="bg-white border-2 border-blue-400 rounded p-2 shadow-lg opacity-90">
            {activeAppointment.patient
              ? `${activeAppointment.patient.first_name} ${activeAppointment.patient.last_name}`
              : "Block"}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
