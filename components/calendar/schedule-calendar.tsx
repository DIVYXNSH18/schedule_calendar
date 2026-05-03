import type { CalendarEventItem } from "@/components/calendar/types";
import { humanTimeRange, parseDateKey } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

type ScheduleCalendarProps = {
  events: CalendarEventItem[];
  onOpenEvent: (event: CalendarEventItem) => void;
};

export function ScheduleCalendar({ events, onOpenEvent }: ScheduleCalendarProps) {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }

    return a.startMinutes - b.startMinutes;
  });

  return (
    <main className="m3-container mb-3 mr-3 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[32px]">
      <div className="overflow-y-auto p-3 sm:p-6">
        {sortedEvents.length ? (
          <div className="mx-auto max-w-4xl space-y-2">
            {sortedEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => onOpenEvent(event)}
                className="m3-pressable m3-focus-ring grid w-full gap-2 rounded-[24px] bg-white/65 px-4 py-4 text-left shadow-m3-container hover:bg-calendar-surface-container-low sm:grid-cols-[170px_1fr]"
              >
                <div className="text-sm font-medium text-gray-600">
                  {parseDateKey(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 shrink-0 rounded-full",
                        event.tone === "blue" && "bg-blue-600",
                        event.tone === "teal" && "bg-teal-600",
                        event.tone === "violet" && "bg-violet-600",
                        event.tone === "amber" && "bg-amber-500",
                        event.tone === "rose" && "bg-rose-600",
                      )}
                    />
                    <span className="font-semibold text-gray-900">{event.title}</span>
                  </div>
                  {event.teacher && (
                    <div className="mt-0.5 text-sm text-gray-500">👤 {event.teacher}</div>
                  )}
                  <div className="mt-1 text-sm text-gray-600">
                    🕐 {event.allDay ? "All day" : humanTimeRange(event.startMinutes, event.endMinutes)}
                    {event.location ? ` · 📍 ${event.location}` : ""}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-gray-500">
            No events to show.
          </div>
        )}
      </div>
    </main>
  );
}
