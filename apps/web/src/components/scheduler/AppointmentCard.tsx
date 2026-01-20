import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { formatTime } from "@/lib/time";
import type { AppointmentWithRelations, AppointmentStatus } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: AppointmentWithRelations;
  layout: {
    column: number;
    totalColumns: number;
    leftPercent: number;
    widthPercent: number;
  };
  timezone: string;
  pxPerMinute: number;
  windowStart: Date;
  onEdit: (appointment: AppointmentWithRelations) => void;
  onResizeStart?: (appointment: AppointmentWithRelations, edge: "top" | "bottom") => void;
}

export function AppointmentCard({
  appointment,
  layout,
  timezone,
  pxPerMinute,
  windowStart,
  onEdit,
  onResizeStart,
}: AppointmentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `appointment-${appointment.id}`,
    data: { appointment },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: `${layout.leftPercent}%`,
    width: `${layout.widthPercent}%`,
  };

  const start = new Date(appointment.start_at);
  const end = new Date(appointment.end_at);
  const top = ((start.getTime() - windowStart.getTime()) / (1000 * 60)) * pxPerMinute;
  const height = ((end.getTime() - start.getTime()) / (1000 * 60)) * pxPerMinute;

  const statusColor = (appointment.status as AppointmentStatus | undefined)?.color || "#3b82f6";

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "absolute",
        top: `${top}px`,
        height: `${height}px`,
        zIndex: isDragging ? 50 : 10,
      }}
      className={cn(
        "group cursor-move rounded border-l-2 shadow-sm bg-white hover:shadow-md transition-shadow",
        isDragging && "opacity-50"
      )}
      onClick={() => onEdit(appointment)}
      {...listeners}
      {...attributes}
    >
      <div
        className="h-full p-1.5 overflow-hidden"
        style={{ borderLeftColor: statusColor }}
      >
        <div className="text-xs font-medium text-gray-900 truncate">
          {appointment.type === "block"
            ? appointment.title || "Block"
            : appointment.patient
            ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
            : "No Patient"}
        </div>
        <div className="text-xs text-gray-500">
          {formatTime(start, timezone, "h:mm")} - {formatTime(end, timezone, "h:mm")}
        </div>
        {appointment.tags && appointment.tags.length > 0 && (
          <div className="flex flex-wrap gap-0.5 mt-1">
            {appointment.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-[10px] px-1 py-0"
                style={{ borderColor: tag.color || undefined }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {onResizeStart && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-blue-400 hover:bg-blue-500 transition-opacity"
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(appointment, "top");
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-blue-400 hover:bg-blue-500 transition-opacity"
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(appointment, "bottom");
            }}
          />
        </>
      )}
    </div>
  );
}
