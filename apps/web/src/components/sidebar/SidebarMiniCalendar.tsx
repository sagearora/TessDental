import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DayPicker,
  type MonthCaptionProps,
  useNavigation,
  type ClassNames,
} from "react-day-picker";
import { CalendarComponent } from "@syncfusion/ej2-react-calendars";
import { format, startOfMonth, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarMiniCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
}

function CustomMonthCaption(
  props: MonthCaptionProps & { 
    onTodayClick?: () => void; 
    onMonthYearClick?: () => void;
    monthYearButtonRef?: React.RefObject<HTMLButtonElement>;
  }
) {
  const { calendarMonth, onTodayClick, onMonthYearClick, monthYearButtonRef } = props;
  const { goToMonth, previousMonth, nextMonth } = useNavigation();

  const displayMonth = calendarMonth.date;

  const handlePrevMonth = () => {
    if (previousMonth) goToMonth(previousMonth);
  };

  const handleNextMonth = () => {
    if (nextMonth) goToMonth(nextMonth);
  };

  const handleToday = () => {
    const today = startOfToday();
    goToMonth(startOfMonth(today));
    onTodayClick?.();
  };

  return (
    <div className="h-10 px-2 flex items-center justify-between select-none">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          type="button"
          onClick={handlePrevMonth}
          aria-label="Previous month"
          className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted transition-colors flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 flex justify-center">
          <button
            ref={monthYearButtonRef}
            type="button"
            onClick={onMonthYearClick}
            className="flex items-baseline gap-3 min-w-0 hover:bg-muted rounded px-1 py-0.5 transition-colors cursor-pointer"
          >
            <span className="text-xs font-medium truncate">
              {format(displayMonth, "MMMM")}
            </span>
            <span className="text-xs font-medium tabular-nums">
              {format(displayMonth, "yyyy")}
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="opacity-40">|</span>

        <button
          type="button"
          onClick={handleToday}
          className="text-xs px-2 py-1 rounded hover:bg-muted transition-colors"
        >
          Today
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="Next month"
          className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Notes:
 * - fixedWeeks + showOutsideDays => always 6 rows (stable height).
 * - These classNames target react-day-picker v9+ keys.
 * - Do NOT import `react-day-picker/dist/style.css` or it will fight sizing.
 */
export function SidebarMiniCalendar({
  value,
  onChange,
  onMonthChange,
}: SidebarMiniCalendarProps) {
  const [displayedMonth, setDisplayedMonth] = useState<Date>(
    startOfMonth(value)
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const monthYearButtonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedMonth(startOfMonth(value));
  }, [value]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        monthYearButtonRef.current &&
        !monthYearButtonRef.current.contains(event.target as Node)
      ) {
        setShowMonthPicker(false);
      }
    };

    if (showMonthPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMonthPicker]);

  const handleMonthChange = (month: Date) => {
    const monthStart = startOfMonth(month);
    setDisplayedMonth(monthStart);
    onMonthChange?.(monthStart);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    onChange(date);

    // If user clicked an outside-day, keep displayedMonth in sync
    const newMonth = startOfMonth(date);
    if (newMonth.getTime() !== displayedMonth.getTime()) {
      handleMonthChange(newMonth);
    }
  };

  const handleToday = () => {
    const today = startOfToday();
    onChange(today);
    handleMonthChange(today);
  };

  const handleMonthYearClick = () => {
    setShowMonthPicker(!showMonthPicker);
  };

  const handleMonthPickerChange = (args: any) => {
    if (args.value) {
      const selectedDate = new Date(args.value);
      handleMonthChange(selectedDate);
      setShowMonthPicker(false);
    }
  };

  const classNames = useMemo<Partial<ClassNames>>(() => {
    const cell = "h-4 w-9"; // adjust if you want tighter (h-9 w-9) or looser (h-11 w-11)

    return {
      root: "w-full",
      months: "w-full",
      month: "w-full",

      // We replace the caption via MonthCaption component
      month_caption: "p-0",
      caption_label: "hidden",
      nav: "hidden",

      // Weekday header row - same padding and grid as day grid
      weekdays: "grid grid-cols-7 gap-1",
      weekday:
        "h-7 flex items-center justify-center text-xs font-medium opacity-80",

      // 6 weeks x 7 days grid - same padding and gap as weekdays
      month_grid: "px-2",
      weeks: "grid grid-rows-6 gap-1",
      week: "grid grid-cols-7 gap-1",

      // Day cells + button sizing
      day: "flex items-center justify-center",
      day_button:
        `${cell} inline-flex items-center justify-center rounded-full ` +
        "text-xs tabular-nums border border-transparent " +
        "hover:bg-muted hover:border-foreground/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",

      // States (theme-driven, no layout changes)
      selected:
        "!bg-transparent !text-blue-600 !font-bold !border-transparent hover:!bg-muted hover:!border-foreground/50",
      today: "font-bold",
      outside: "opacity-40",
      disabled: "opacity-30 pointer-events-none",
    };
  }, []);

  return (
    <div className="p-2 relative">
      <DayPicker
        mode="single"
        selected={value}
        onSelect={handleDateSelect}
        month={displayedMonth}
        onMonthChange={handleMonthChange}
        fixedWeeks
        showOutsideDays
        classNames={classNames}
        components={{
          MonthCaption: (props) => (
            <CustomMonthCaption
              {...props}
              onTodayClick={handleToday}
              onMonthYearClick={handleMonthYearClick}
              monthYearButtonRef={monthYearButtonRef}
            />
          ),
        }}
      />

      {/* Syncfusion Month/Year Picker Popup */}
      {showMonthPicker && (
        <div
          ref={popupRef}
          className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg"
          style={{
            bottom: "100%",
            left: "8px",
            marginBottom: "8px",
          }}
        >
          <CalendarComponent
            value={displayedMonth}
            change={handleMonthPickerChange}
            start="Year"
            depth="Year"
            cssClass="tessdental-month-picker"
          />
        </div>
      )}
    </div>
  );
}
