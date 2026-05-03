import type { CalendarEventItem, EventDraft } from "@/components/calendar/types";
import { CalendarEvent } from "@/components/calendar/calendar-event";
import { useTimezone } from "@/components/calendar/timezone-context";
import {
  addDays,
  dateKeyTz,
  dayOfWeekTz,
  DAY_NAMES,
  currentMinutesInTz,
  tzParts,
} from "@/lib/date-utils";
import { cn } from "@/lib/utils";

export const HOUR_HEIGHT = 64;
const DAY_COUNT = 7;
const TIME_COL_W = 64; // px — must match w-16

type WeekCalendarProps = {
  weekStart: Date;
  selectedDate: Date;
  today: Date;
  events: CalendarEventItem[];
  onSelectDate: (date: Date) => void;
  onCreateEvent: (draft: EventDraft) => void;
  onOpenEvent: (event: CalendarEventItem) => void;
};

export function WeekCalendar({
  weekStart,
  selectedDate,
  today,
  events,
  onSelectDate,
  onCreateEvent,
  onOpenEvent,
}: WeekCalendarProps) {
  const days = Array.from({ length: DAY_COUNT }, (_, i) => addDays(weekStart, i));
  const { timezone } = useTimezone();
  const tz = timezone.label;

  return (
    <main className="m3-container mb-3 mr-3 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[32px]">
      <div className="flex h-full min-h-0 flex-col overflow-x-auto">
        <div className="flex min-h-0 min-w-[760px] flex-1 flex-col">

          {/* ── Header ── */}
          <div
            className="flex-shrink-0 border-b border-white/70 bg-white/35"
            style={{ display: "grid", gridTemplateColumns: `${TIME_COL_W}px repeat(${DAY_COUNT}, 1fr)` }}
          >
            <div className="flex items-end justify-center border-r border-white/70 pb-2 text-[10px] font-semibold text-gray-500">
              {timezone.offset}
            </div>
            {days.map((day) => {
              const isToday = dateKeyTz(day, tz) === dateKeyTz(today, tz);
              const isSelected = dateKeyTz(day, tz) === dateKeyTz(selectedDate, tz);
              const dow = dayOfWeekTz(day, tz);
              const { day: dayNum } = tzParts(day, tz);
              return (
                <button
                  key={dateKeyTz(day, tz)}
                  type="button"
                  onClick={() => onSelectDate(day)}
                  className="m3-focus-ring flex flex-col items-center justify-center border-r border-white/70 py-3 last:border-r-0 hover:bg-calendar-surface-container-low"
                >
                  <span className={cn("text-[11px] font-medium uppercase", isToday ? "text-blue-600" : "text-gray-500")}>
                    {DAY_NAMES[dow]}
                  </span>
                  <span className={cn(
                    "mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl",
                    isToday && "animate-m3-pop bg-calendar-primary text-white shadow-m3-container",
                    isSelected && !isToday && "bg-calendar-primary-container text-calendar-primary",
                    !isToday && !isSelected && "text-gray-600 hover:bg-gray-100",
                  )}>
                    {dayNum}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Time grid ── */}
          <div className="relative min-h-0 flex-1 overflow-y-auto">
            {/* Total height = 24 hours */}
            <div className="relative" style={{ height: HOUR_HEIGHT * 24 }}>

              {/* Horizontal hour lines + labels */}
              {Array.from({ length: 25 }, (_, i) => (
                <div
                  key={i}
                  className="pointer-events-none absolute left-0 right-0 flex items-center"
                  style={{ top: i * HOUR_HEIGHT, height: 0 }}
                >
                  {/* Label sits above the line */}
                  <span
                    className="w-16 shrink-0 pr-2 text-right text-[10px] font-medium text-gray-400 select-none"
                    style={{ marginTop: -8 }}
                  >
                    {i === 0 || i === 24 ? "" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                  </span>
                  {/* The actual line */}
                  <div className="flex-1 border-t border-calendar-line/50" />
                </div>
              ))}

              {/* Vertical column dividers + events per day */}
              {days.map((day, colIdx) => {
                const dayKey = dateKeyTz(day, tz);
                const dayEvents = events.filter((e) => e.date === dayKey);
                const isToday = dateKeyTz(day, tz) === dateKeyTz(today, tz);

                return (
                  <div
                    key={dayKey}
                    role="button"
                    tabIndex={0}
                    className="absolute top-0 bottom-0 cursor-pointer hover:bg-white/20 overflow-hidden"
                    style={{
                      left: TIME_COL_W + colIdx * ((100 - 0) / DAY_COUNT) + "%",
                      width: `calc((100% - ${TIME_COL_W}px) / ${DAY_COUNT})`,
                      // override left with exact calc
                      left: `calc(${TIME_COL_W}px + ${colIdx} * (100% - ${TIME_COL_W}px) / ${DAY_COUNT})`,
                      borderRight: "1px solid rgba(255,255,255,0.7)",
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const y = Math.max(e.clientY - rect.top, 0);
                      const mins = Math.round((y / (HOUR_HEIGHT * 24)) * 24 * 60 / 30) * 30;
                      onCreateEvent({ title: "", date: dayKey, startMinutes: Math.min(mins, 23 * 60), endMinutes: Math.min(mins + 60, 24 * 60), allDay: false, calendarId: "primary", tone: "blue", type: "event" });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onCreateEvent({ title: "", date: dayKey, startMinutes: 9 * 60, endMinutes: 10 * 60, allDay: false, calendarId: "primary", tone: "blue", type: "event" });
                    }}
                  >
                    {isToday && <CurrentTimeIndicator tz={tz} />}
                    {dayEvents.map((ev) => (
                      <CalendarEvent key={ev.id} event={ev} onOpen={onOpenEvent} hourHeight={HOUR_HEIGHT} />
                    ))}
                  </div>
                );
              })}

              {/* Time column right border */}
              <div
                className="pointer-events-none absolute top-0 bottom-0 border-r border-white/70"
                style={{ left: TIME_COL_W - 1, width: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CurrentTimeIndicator({ tz }: { tz: string }) {
  const mins = currentMinutesInTz(tz);
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
      style={{ top: (mins / 60) * HOUR_HEIGHT }}
    >
      <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" style={{ marginLeft: -5 }} />
      <div className="h-0.5 flex-1 bg-red-500" />
    </div>
  );
}
