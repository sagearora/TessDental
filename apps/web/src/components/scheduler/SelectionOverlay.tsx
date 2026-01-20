import { formatTime } from "@/lib/time";
import type { Selection } from "./useDragSelection";

interface SelectionOverlayProps {
  selection: Selection;
  timezone: string;
  pxPerMinute: number;
  windowStart: Date;
}

export function SelectionOverlay({
  selection,
  timezone,
  pxPerMinute,
  windowStart,
}: SelectionOverlayProps) {
  const top = ((selection.startTime.getTime() - windowStart.getTime()) / (1000 * 60)) * pxPerMinute;
  const height = ((selection.endTime.getTime() - selection.startTime.getTime()) / (1000 * 60)) * pxPerMinute;

  return (
    <div
      className="absolute left-0 right-0 bg-blue-200 border-2 border-blue-400 rounded pointer-events-none z-20"
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      <div className="absolute top-1 left-1 text-xs font-medium text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">
        {formatTime(selection.startTime, timezone, "h:mm")} - {formatTime(selection.endTime, timezone, "h:mm")}
      </div>
    </div>
  );
}
