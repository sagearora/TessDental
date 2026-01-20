import { ScheduleComponent, Day, Week, WorkWeek, Month, Resize, DragAndDrop, Inject, ResourcesDirective, ResourceDirective, ViewDirective, ViewsDirective, PopupOpenEventArgs, ActionEventArgs } from "@syncfusion/ej2-react-schedule";
import type { EventSettingsModel } from "@syncfusion/ej2-react-schedule";
import type { Clinic, Operatory, AppointmentWithRelations } from "@/api/types";
import { appointmentToSyncfusionEvent, operatoriesToResources } from "./syncfusionAdapters";
import { useEffect, useRef, useState } from "react";

interface SchedulerMainProps {
  clinic: Clinic;
  selectedDate: Date;
  currentView: "Day" | "Week" | "WorkWeek" | "Month";
  operatories: Operatory[];
  appointments: AppointmentWithRelations[];
  onEventCreate: (event: any) => Promise<void>;
  onEventChange: (event: any) => Promise<void>;
  onEventRemove: (eventId: number) => Promise<void>;
  onEventClick?: (appointment: AppointmentWithRelations) => void;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: "Day" | "Week" | "WorkWeek" | "Month") => void;
}

export function SchedulerMain({
  clinic,
  selectedDate,
  currentView,
  operatories,
  appointments,
  onEventCreate,
  onEventChange,
  onEventRemove,
  onEventClick,
  onDateChange,
  onViewChange,
}: SchedulerMainProps) {
  // Convert appointments to Syncfusion format
  const events: EventSettingsModel = {
    dataSource: appointments.map(appointmentToSyncfusionEvent),
    fields: {
      id: "Id",
      subject: { name: "Subject" },
      startTime: { name: "StartTime" },
      endTime: { name: "EndTime" },
    },
  };

  // Calculate time scale based on unit_length_minutes
  const unitMinutes = clinic.unit_length_minutes;
  const slotCount = 60 / unitMinutes; // e.g., 15 min = 4 slots per hour

  // Resources configuration
  const resources = operatoriesToResources(operatories);

  const handleActionBegin = async (args: ActionEventArgs) => {
    try {
      if (args.requestType === "eventCreate") {
        // Prevent default creation, we'll handle it
        args.cancel = true;
        const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
        await onEventCreate(eventData);
      } else if (args.requestType === "eventChange") {
        // Prevent default update, we'll handle it
        args.cancel = true;
        const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
        await onEventChange(eventData);
      } else if (args.requestType === "eventRemove") {
        // Prevent default deletion, we'll handle it
        args.cancel = true;
        const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
        const eventId = (eventData as any).Id;
        if (eventId) {
          await onEventRemove(eventId);
        }
      }
    } catch (error) {
      // Error is handled in the parent component
      console.error("Scheduler action error:", error);
    }
  };

  const handleEventClick = (args: any) => {
    if (onEventClick && args.event) {
      // Find the original appointment
      const syncfusionEvent = args.event as any;
      const appointment = appointments.find((a) => a.id === syncfusionEvent.Id);
      if (appointment) {
        onEventClick(appointment);
      }
    }
  };

  const handleNavigating = (args: any) => {
    if (args.action === "date" && onDateChange) {
      onDateChange(new Date(args.currentDate));
    } else if (args.action === "view" && onViewChange) {
      onViewChange(args.currentView as "Day" | "Week" | "WorkWeek" | "Month");
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [schedulerHeight, setSchedulerHeight] = useState<string>("100%");

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setSchedulerHeight(`${height}px`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex-1 min-w-0 h-full" 
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}
    >
      <ScheduleComponent
        selectedDate={selectedDate}
        currentView={currentView as any}
        eventSettings={events}
        allowDragAndDrop={true}
        allowResizing={true}
        allowMultiCellSelection={true}
        height={schedulerHeight}
        workHours={{
          start: "07:00",
          end: "19:00",
        }}
        timeScale={{
          interval: 60,
          slotCount: slotCount,
        }}
        group={{
          byDate: true,
          resources: ["Operatories"],
        }}
        actionBegin={handleActionBegin}
        eventClick={handleEventClick}
        navigating={handleNavigating}
        cssClass="tessdental-scheduler"
      >
        <ResourcesDirective>
          <ResourceDirective
            field="OperatoryId"
            title="Operatory"
            name="Operatories"
            allowMultiple={false}
            dataSource={resources}
            textField="text"
            idField="id"
            colorField="color"
          />
        </ResourcesDirective>
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  );
}
