import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  buildMiniCalendarDays,
  dateKeyTz,
  monthLabel,
  parseDateKey,
  SHORT_DAY_NAMES,
  tzParts,
} from "@/lib/date-utils";
import { useTimezone } from "@/components/calendar/timezone-context";
import { cn } from "@/lib/utils";

type MiniCalendarProps = {
  visibleMonth: Date;
  selectedDate: Date;
  today: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
};

export function MiniCalendar({
  visibleMonth,
  selectedDate,
  today,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
}: MiniCalendarProps) {
  const days = buildMiniCalendarDays(visibleMonth);
  const { timezone } = useTimezone();
  const tzLabel = timezone.label;

  return (
    <section className="m3-container mt-4 rounded-[28px] px-3 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">{monthLabel(visibleMonth)}</span>
        <div className="flex">
          <button
            type="button"
            aria-label="Previous month"
            onClick={onPreviousMonth}
            className="m3-icon-button rounded-full p-1.5 hover:bg-calendar-primary-container"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={onNextMonth}
            className="m3-icon-button rounded-full p-1.5 hover:bg-calendar-primary-container"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
        {SHORT_DAY_NAMES.map((day, index) => (
          <div key={`${day}-${index}`}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
        {days.map((day) => {
          const dk = dateKeyTz(day.date, tzLabel);
          const isSelected = dk === dateKeyTz(selectedDate, tzLabel);
          const isToday = dk === dateKeyTz(today, tzLabel);
          const { day: dayNum } = tzParts(day.date, tzLabel);
          return (
          <button
            key={dk}
            type="button"
            onClick={() => onSelectDate(parseDateKey(dk))}
            className={cn(
              "m3-focus-ring mx-auto flex h-8 w-8 items-center justify-center rounded-full p-1.5 transition-all duration-200 hover:scale-105 hover:bg-calendar-surface-container-high active:scale-95",
              day.muted && "text-gray-400",
              isSelected &&
                "bg-calendar-primary-container font-bold text-calendar-primary hover:bg-calendar-primary-container",
              isToday && !isSelected &&
                "border-2 border-calendar-primary text-calendar-primary",
            )}
            aria-label={`Select ${dk}`}
          >
            {dayNum}
          </button>
          );
        })}
      </div>
    </section>
  );
}
