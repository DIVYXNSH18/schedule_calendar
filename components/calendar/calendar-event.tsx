import type { CalendarEventItem } from "@/components/calendar/types";
import { humanTimeRange } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 48;

const toneClasses = {
  blue: {
    box: "border-calendar-primary bg-calendar-primary-container hover:bg-[#c9d7ff]",
    title: "text-blue-800",
    time: "text-blue-700",
  },
  teal: {
    box: "border-calendar-secondary bg-calendar-secondary-container hover:bg-[#a7dfde]",
    title: "text-teal-800",
    time: "text-teal-700",
  },
  violet: {
    box: "border-violet-600 bg-violet-100 hover:bg-violet-200",
    title: "text-violet-800",
    time: "text-violet-700",
  },
  amber: {
    box: "border-calendar-amber bg-calendar-amber-container hover:bg-[#ffd29b]",
    title: "text-amber-900",
    time: "text-amber-800",
  },
  rose: {
    box: "border-rose-600 bg-rose-100 hover:bg-rose-200",
    title: "text-rose-800",
    time: "text-rose-700",
  },
} satisfies Record<CalendarEventItem["tone"], { box: string; title: string; time: string }>;

type CalendarEventProps = {
  event: CalendarEventItem;
  onOpen: (event: CalendarEventItem) => void;
};

export function CalendarEvent({ event, onOpen }: CalendarEventProps) {
  const tone = toneClasses[event.tone];
  const durationMins = event.endMinutes - event.startMinutes;

  return (
    <button
      type="button"
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onOpen(event);
      }}
      className={cn(
        "m3-pressable m3-focus-ring absolute left-1 right-1 overflow-hidden rounded-[14px] border-l-[5px] p-2 text-left shadow-m3-container",
        tone.box,
      )}
      style={{
        top: (event.startMinutes / 60) * HOUR_HEIGHT,
        height: Math.max(((event.endMinutes - event.startMinutes) / 60) * HOUR_HEIGHT, 28),
      }}
    >
      <p className={cn("truncate text-xs font-semibold leading-tight", tone.title)}>
        {event.title}
      </p>
      {durationMins >= 45 && event.teacher && (
        <p className={cn("truncate text-[10px] leading-tight mt-0.5", tone.time)}>
          {event.teacher}
        </p>
      )}
    </button>
  );
}
