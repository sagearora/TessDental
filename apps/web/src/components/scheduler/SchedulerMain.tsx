import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Resize,
  DragAndDrop,
  Inject,
  ResourcesDirective,
  ResourceDirective,
  ViewDirective,
  ViewsDirective,
  PopupOpenEventArgs,
  ActionEventArgs,
  SelectEventArgs,
  EventRenderedArgs,
} from "@syncfusion/ej2-react-schedule";
import type { EventSettingsModel } from "@syncfusion/ej2-react-schedule";
import type { Clinic, Operatory, AppointmentWithRelations } from "@/api/types";
import { appointmentToSyncfusionEvent, operatoriesToResources } from "./syncfusionAdapters";
import { useEffect, useRef, useState } from "react";
import { AppointmentTooltip } from "./AppointmentTooltip";

interface SchedulerMainProps {
  clinic: Clinic;
  selectedDate: Date;
  currentView: "Day" | "Week" | "WorkWeek" | "Month";
  operatories: Operatory[];
  appointments: AppointmentWithRelations[];
  onEventCreate: (event: any) => Promise<void>;
  onEventChange: (event: any) => Promise<void>;
  onEventRemove: (eventId: number) => Promise<void>;
  onSlotCreate?: (slot: { startTime: Date; endTime: Date; operatoryId: number }) => void;
  onEventClick?: (appointment: AppointmentWithRelations) => void;
  onEventSelect?: (appointment: AppointmentWithRelations) => void;
  onEventContextMenu?: (appointment: AppointmentWithRelations, event: MouseEvent) => void;
  onCellSelect?: (args: SelectEventArgs) => void;
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
  onSlotCreate,
  onEventClick,
  onEventSelect,
  onEventContextMenu,
  onCellSelect,
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
        // Prevent default creation - we handle multi-cell selection in handleSelect
        // Single cell drag-to-create is handled via popupOpen
        args.cancel = true;
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
    // Single click - set patient if appointment has one
    if (onEventSelect) {
      // args.event might be the event data directly, or args.data might contain it
      const eventData = args.event || args.data;
      if (eventData) {
        const syncfusionEvent = eventData as any;
        const appointment = appointments.find((a) => a.id === syncfusionEvent.Id);
        if (appointment && appointment.patient) {
          onEventSelect(appointment);
        }
      }
    }
  };

  const handleEventDoubleClick = (args: any) => {
    // Double click - open edit modal
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

  // Helper function to lighten a hex color
  const lightenColor = (hex: string, percent: number = 20): string => {
    // Remove # if present
    hex = hex.replace("#", "");
    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten by blending with white
    r = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Helper function to format time in 12-hour format
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase().replace(/\s/g, " ");
  };

  // Helper function to get confirmation border color
  const getConfirmationBorderColor = (confirmationName: string | null | undefined): string | null => {
    if (!confirmationName) return null;
    const name = confirmationName.toLowerCase();
    if (name === "unconfirmed") return "#3b82f6"; // blue
    if (name === "confirmed") return "#10b981"; // green
    if (name === "left message") return "#ef4444"; // red
    return null;
  };

  // Handle right-click on appointments
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const appointmentElement = target.closest(".e-appointment");
      
      if (appointmentElement && onEventContextMenu) {
        e.preventDefault();
        e.stopPropagation();
        
        // Find the appointment ID from the element
        const appointmentId = appointmentElement.getAttribute("data-id");
        if (appointmentId) {
          const appointment = appointments.find((a) => a.id === parseInt(appointmentId));
          if (appointment) {
            onEventContextMenu(appointment, e);
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("contextmenu", handleContextMenu);
      return () => {
        container.removeEventListener("contextmenu", handleContextMenu);
      };
    }
  }, [appointments, onEventContextMenu]);

  // Handle hover on appointments with delay
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const appointmentElement = target.closest(".e-appointment");
      
      if (appointmentElement) {
        const appointmentId = appointmentElement.getAttribute("data-id");
        if (appointmentId) {
          const appointment = appointments.find((a) => a.id === parseInt(appointmentId));
          if (appointment) {
            // Clear any existing timeout
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            
            // Set timeout to show tooltip after 1 second
            hoverTimeoutRef.current = setTimeout(() => {
              const rect = appointmentElement.getBoundingClientRect();
              setHoveredAppointment({
                appointment,
                x: rect.right + 10,
                y: rect.top,
              });
            }, 1000);
          }
        }
      } else {
        // Not hovering over an appointment, clear tooltip
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setHoveredAppointment(null);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const appointmentElement = target.closest(".e-appointment");
      const tooltip = target.closest(".appointment-tooltip");
      
      // Only hide if leaving the appointment and not entering the tooltip
      if (!appointmentElement && !tooltip) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setHoveredAppointment(null);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseover", handleMouseEnter, true);
      container.addEventListener("mouseout", handleMouseLeave, true);
      
      return () => {
        container.removeEventListener("mouseover", handleMouseEnter, true);
        container.removeEventListener("mouseout", handleMouseLeave, true);
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      };
    }
  }, [appointments]);

  const handleEventRendered = (args: EventRenderedArgs) => {
    const eventData = args.data as any;
    if (!args.element) return;

    const element = args.element as HTMLElement;
    
    // Add data-id attribute for context menu
    element.setAttribute("data-id", String(eventData?.Id || ""));
    
    // Apply styling if tag color exists
    if (eventData?.TagColor) {
      // Use a lighter version of the tag color for background
      const lightenedColor = lightenColor(eventData.TagColor, 20);
      element.style.backgroundColor = lightenedColor;
      element.style.borderLeftColor = eventData.TagColor;
      element.style.borderLeftWidth = "3px";
      element.style.borderLeftStyle = "solid";
      element.style.color = "#ffffff";
    } else {
      // Default styling for appointments without tags
      element.style.color = "#1f2937";
    }

    // Add right border for confirmation status
    const confirmationBorderColor = getConfirmationBorderColor(eventData?.ConfirmationName);
    if (confirmationBorderColor) {
      element.style.borderRightColor = confirmationBorderColor;
      element.style.borderRightWidth = "10px";
      element.style.borderRightStyle = "solid";
    }

    // Custom appointment card content
    const startTime = eventData?.StartTime ? new Date(eventData.StartTime) : null;
    const endTime = eventData?.EndTime ? new Date(eventData.EndTime) : null;
    const patientName = eventData?.PatientName || "";
    const notes = eventData?.Notes || "";
    const tagNames = eventData?.TagNames || "";
    const procedureCodes = eventData?.ProcedureCodes || "";

    // Build the description line: notes + tags
    let descriptionLine = "";
    if (notes && tagNames) {
      descriptionLine = `${notes}, ${tagNames}`;
    } else if (notes) {
      descriptionLine = notes;
    } else if (tagNames) {
      descriptionLine = tagNames;
    }

    // Format time range
    let timeLine = "";
    if (startTime && endTime) {
      const start = formatTime(startTime);
      const end = formatTime(endTime);
      timeLine = `${start} - ${end}`;
    }

    // Get text color based on whether tag color exists
    const textColor = eventData?.TagColor ? "#ffffff" : "#1f2937";

    // Hide default Syncfusion content (subject, time, etc.)
    const defaultSubject = element.querySelector(".e-subject");
    const defaultTime = element.querySelector(".e-time");
    const defaultDetails = element.querySelector(".e-appointment-details");
    
    if (defaultSubject) {
      (defaultSubject as HTMLElement).style.display = "none";
    }
    if (defaultTime) {
      (defaultTime as HTMLElement).style.display = "none";
    }
    if (defaultDetails) {
      (defaultDetails as HTMLElement).style.display = "none";
    }
    
    // Find or create content container, preserving resize handles
    let contentContainer = element.querySelector(".custom-appointment-content") as HTMLElement;
    if (!contentContainer) {
      // Create a wrapper div for our content
      contentContainer = document.createElement("div");
      contentContainer.className = "custom-appointment-content";
      // Insert before any resize handles
      const firstChild = element.firstChild;
      if (firstChild) {
        element.insertBefore(contentContainer, firstChild);
      } else {
        element.appendChild(contentContainer);
      }
    }
    
    // Create custom HTML content
    const customContent = `
      <div style="display: flex; flex-direction: column; gap: 2px; font-size: 12px; line-height: 1.3; padding: 2px 4px; color: ${textColor}; width: 100%; box-sizing: border-box;">
        ${timeLine ? `<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${timeLine}</div>` : ""}
        ${patientName ? `<div style="font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${patientName}</div>` : ""}
        ${descriptionLine ? `<div style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal; hyphens: auto;">${descriptionLine}</div>` : ""}
        ${procedureCodes ? `<div style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal; hyphens: auto;">${procedureCodes}</div>` : ""}
      </div>
    `;

    // Replace only the content container, preserving resize handles and other elements
    contentContainer.innerHTML = customContent;
    element.style.padding = "0";
    // Ensure the element allows wrapping but hides vertical overflow
    element.style.overflow = "hidden";
    element.style.wordWrap = "break-word";
    element.style.overflowWrap = "break-word";
  };

  const handleSelect = (args: SelectEventArgs) => {
    // Only process on mouseup events (when user releases mouse after selecting)
    if (args.event && args.event.type === "mouseup" && onSlotCreate) {
      const selectedData = args.data;
      const wasDragging = isDraggingRef.current;
      
      // Multi-cell selection returns a single object with the overall time range
      // Only open modal if it was a drag (user moved mouse while selecting)
      if (wasDragging && selectedData && typeof selectedData === "object" && !Array.isArray(selectedData)) {
        const startTime = new Date(selectedData.StartTime || selectedData.startTime);
        const endTime = new Date(selectedData.EndTime || selectedData.endTime);
        const operatoryId = selectedData.OperatoryId ?? selectedData.groupIndex ?? selectedData.resourceData?.id ?? 0;
        
        console.log("Multi-cell selection (drag):", {
          startTime,
          endTime,
          durationMinutes: Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)),
          operatoryId,
        });
        
        // Open the create appointment modal with the selected time range
        onSlotCreate({
          startTime,
          endTime,
          operatoryId,
        });
      } else if (onCellSelect) {
        // Pass through to handler if provided
        onCellSelect(args);
      }
    }
  };

  const handlePopupOpen = (args: PopupOpenEventArgs) => {
    // Cancel all default Editor popups (both for new and existing events)
    // We use our custom modal for editing appointments
    if (args.type === "Editor") {
      args.cancel = true;
      // If it's an existing event, open our custom edit modal
      if (args.data && (args.data as any).Id && onEventClick) {
        const appointment = appointments.find((a) => a.id === (args.data as any).Id);
        if (appointment) {
          onEventClick(appointment);
        }
      }
    }
    
    // Cancel all QuickInfo popups (both for new and existing events)
    // We only want to set the patient on click, not show any popup
    if (args.type === "QuickInfo") {
      args.cancel = true;
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [schedulerHeight, setSchedulerHeight] = useState<string>("100%");
  const isDraggingRef = useRef(false);
  const mouseDownRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [hoveredAppointment, setHoveredAppointment] = useState<{
    appointment: AppointmentWithRelations;
    x: number;
    y: number;
  } | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Track mouse events to detect dragging vs clicking
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseDownRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };
      isDraggingRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseDownRef.current) {
        const deltaX = Math.abs(e.clientX - mouseDownRef.current.x);
        const deltaY = Math.abs(e.clientY - mouseDownRef.current.y);
        
        // If mouse moved more than 5 pixels, consider it a drag
        if (deltaX > 5 || deltaY > 5) {
          isDraggingRef.current = true;
        }
      }
    };

    const handleMouseUp = () => {
      // Reset after a short delay to allow select event to check the state
      setTimeout(() => {
        mouseDownRef.current = null;
        isDraggingRef.current = false;
      }, 100);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        container.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
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
        eventDoubleClick={handleEventDoubleClick}
        navigating={handleNavigating}
        popupOpen={handlePopupOpen}
        select={handleSelect}
        eventRendered={handleEventRendered}
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
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Day, Week, Month, Resize, DragAndDrop]} />
      </ScheduleComponent>
      
      {/* Appointment Tooltip */}
      {hoveredAppointment && (
        <AppointmentTooltip
          appointment={hoveredAppointment.appointment}
          patient={hoveredAppointment.appointment.patient}
          provider={hoveredAppointment.appointment.provider}
          clinic={clinic}
          x={hoveredAppointment.x}
          y={hoveredAppointment.y}
        />
      )}
    </div>
  );
}
