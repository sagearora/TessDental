import { formatTime, getTimeSlots, DEFAULT_DAY_START_HOUR, DEFAULT_DAY_END_HOUR } from "@/lib/time";
import type { Clinic } from "@/api/types";

interface TimeGutterProps {
  date: Date;
  clinic: Clinic;
  pxPerMinute: number;
}

export function TimeGutter({ date, clinic, pxPerMinute }: TimeGutterProps) {
  const slots = getTimeSlots(
    date,
    clinic.timezone,
    DEFAULT_DAY_START_HOUR,
    DEFAULT_DAY_END_HOUR,
    30
  );

  return (
    <div className="sticky left-0 z-10 w-20 bg-gray-50 border-r border-gray-200">
      <div className="relative" style={{ minHeight: `${(DEFAULT_DAY_END_HOUR - DEFAULT_DAY_START_HOUR) * 60 * pxPerMinute}px` }}>
        {slots.map((slot, index) => (
          <div
            key={index}
            className="absolute right-2 text-xs text-gray-600 font-medium"
            style={{
              top: `${index * 30 * pxPerMinute}px`,
              transform: "translateY(-50%)",
            }}
          >
            {formatTime(slot, clinic.timezone, "h:mm a")}
          </div>
        ))}
      </div>
    </div>
  );
}
