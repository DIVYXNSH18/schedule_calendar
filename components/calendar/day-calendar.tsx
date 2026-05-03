import { CalendarEvent } from "@/components/calendar/calendar-event";
import type { CalendarEventItem, EventDraft } from "@/components/calendar/types";
import { useTimezone } from "@/components/calendar/timezone-context";
import {
  dateKeyTz,
  dayOfWeekTz,
  DAY_NAMES,
  currentMinutesInTz,
  tzParts,
} from "@/lib/date-utils";
import { timeLabels } from "@/lib/calendar-data";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 64;
const GRID_HEIGHT = HOUR_HEIGHT * 24;

type DayCalendarProps = {
  selectedDate: Date;
  today: Date;
  events: CalendarEventItem[];
  onCreateEvent: (draft: EventDraft) => void;
  onOpenEvent: (event: CalendarEventItem) => void;
};

export function DayCalendar({
  selectedDate,
  today,
  events,
  onCreateEvent,
  onOpenEvent,
}: DayCalendarProps) {
  const { timezone } = useTimezone();
  const tzLabel = timezone.label;
  const selectedKey = dateKeyTz(selectedDate, tzLabel);
  const todayKey = dateKeyTz(today, tzLabel);
  const isToday = selectedKey === todayKey;
  const dow = dayOfWeekTz(selectedDate, tzLabel);
  const { day: dayNum } = tzParts(selectedDate, tzLabel);
  const allDayEvents = events.filter((event) => event.date === selectedKey && event.allDay);
  const timedEvents = events.filter((event) => event.date === selectedKey && !event.allDay);

  return (
    <main className="m3-container mb-3 mr-3 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[32px]">
      <div className="flex h-full min-h-0 flex-col overflow-x-auto">
        <div className="flex min-h-0 min-w-[420px] flex-1 flex-col">
          <div className="grid grid-cols-[64px_minmax(0,1fr)] border-b border-white/70 bg-white/35">
            <div className="flex items-end justify-center border-r border-white/70 pb-2 text-[10px] font-semibold text-gray-500">
              {timezone.offset}
            </div>
            <div className="flex flex-col items-center justify-center py-2">
              <span
                className={cn(
                  "text-[11px] font-medium uppercase",
                  isToday ? "text-blue-600" : "text-gray-500",
                )}
              >
                {DAY_NAMES[dow]}
              </span>
              <span
                className={cn(
                  "mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl",
                  isToday
                    ? "animate-m3-pop bg-calendar-primary text-white shadow-m3-container"
                    : "bg-calendar-primary-container text-calendar-primary",
                )}
              >
                {dayNum}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onCreateEvent({
                title: "",
                date: selectedKey,
                startMinutes: 9 * 60,
                endMinutes: 10 * 60,
                allDay: true,
                calendarId: "primary",
                tone: "blue",
                type: "event",
              })
            }
            className="grid min-h-12 grid-cols-[64px_minmax(0,1fr)] border-b border-white/70 text-left transition-colors hover:bg-calendar-surface-container-low"
          >
            <div className="border-r border-white/70" />
            <div className="space-y-1 p-1">
              {allDayEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    onOpenEvent(event);
                  }}
                  className="m3-pressable block w-full truncate rounded-full bg-calendar-primary px-2.5 py-1 text-left text-xs font-semibold text-white hover:bg-blue-700"
                >
                  {event.title}
                </button>
              ))}
            </div>
          </button>

          <div className="relative flex-1 overflow-y-auto">
            <div className="relative" style={{ height: GRID_HEIGHT }}>

              {/* Hour lines + labels */}
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0"
                  style={{ top: i * HOUR_HEIGHT }}
                >
                  <div
                    className="absolute left-0 w-16 pr-2 text-right text-[10px] font-medium text-gray-400"
                    style={{ top: -8 }}
                  >
                    {i === 0 ? "" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                  </div>
                  <div className="absolute left-16 right-0 top-0 border-t border-calendar-line/50" />
                </div>
              ))}

              {/* Vertical divider */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-16 top-0 bottom-0 border-r border-white/75" />
              </div>

              {/* Click area + events */}
              <div
                role="button"
                tabIndex={0}
                className="absolute top-0 bottom-0 left-16 right-0 cursor-pointer hover:bg-white/20 overflow-hidden"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const y = Math.max(event.clientY - rect.top, 0);
                  const minutes = Math.min(
                    Math.max(Math.floor((y / GRID_HEIGHT) * 24 * 60 / 30) * 30, 0),
                    23 * 60 + 30,
                  );
                  onCreateEvent({ title: "", date: selectedKey, startMinutes: minutes, endMinutes: Math.min(minutes + 60, 24 * 60), allDay: false, calendarId: "primary", tone: "blue", type: "event" });
                }}
              >
                {isToday ? <CurrentTimeIndicator tzLabel={tzLabel} /> : null}
                {timedEvents.map((event) => (
                  <CalendarEvent key={event.id} event={event} onOpen={onOpenEvent} hourHeight={HOUR_HEIGHT} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CurrentTimeIndicator({ tzLabel }: { tzLabel: string }) {
  const currentMinutes = currentMinutesInTz(tzLabel);

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-20"
      style={{ top: (currentMinutes / 60) * HOUR_HEIGHT }}
    >
      <div className="absolute -left-1.5 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
      <div className="h-0.5 w-full bg-red-500" />
    </div>
  );
}
