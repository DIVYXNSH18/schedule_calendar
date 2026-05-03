import type { CalendarEventItem, EventDraft } from "@/components/calendar/types";
import { buildMiniCalendarDays, dateKey, sameDay, SHORT_DAY_NAMES } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

type MonthCalendarProps = {
  selectedDate: Date;
  today: Date;
  events: CalendarEventItem[];
  onSelectDate: (date: Date) => void;
  onCreateEvent: (draft: EventDraft) => void;
  onOpenEvent: (event: CalendarEventItem) => void;
};

export function MonthCalendar({
  selectedDate,
  today,
  events,
  onSelectDate,
  onCreateEvent,
  onOpenEvent,
}: MonthCalendarProps) {
  const days = buildMiniCalendarDays(selectedDate);

  return (
    <main className="m3-container mb-3 mr-3 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[32px]">
      <div className="grid grid-cols-7 border-b border-white/70 bg-white/35 text-center text-xs font-semibold text-gray-500">
        {SHORT_DAY_NAMES.map((day, index) => (
          <div key={`${day}-${index}`} className="py-3">
            {day}
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 overflow-y-auto">
        {days.map((day) => {
          const key = dateKey(day.date);
          const dayEvents = events.filter((event) => event.date === key);

          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => {
                onSelectDate(day.date);
                onCreateEvent({
                  title: "",
                  date: key,
                  startMinutes: 9 * 60,
                  endMinutes: 10 * 60,
                  allDay: false,
                  calendarId: "primary",
                  tone: "blue",
                  type: "event",
                });
              }}
              className="min-h-28 cursor-pointer overflow-hidden border-b border-r border-white/70 p-1.5 text-left transition-all hover:bg-calendar-surface-container-low"
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectDate(day.date);
                }}
                className={cn(
                  "mb-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                  day.muted && "text-gray-400",
                  sameDay(day.date, today) && "animate-m3-pop bg-calendar-primary text-white shadow-m3-container",
                  sameDay(day.date, selectedDate) &&
                    !sameDay(day.date, today) &&
                    "bg-calendar-primary-container text-calendar-primary",
                )}
              >
                {day.date.getDate()}
              </button>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <MonthEvent key={event.id} event={event} onOpenEvent={onOpenEvent} />
                ))}
                {dayEvents.length > 3 ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectDate(day.date);
                    }}
                    className="px-1 text-[11px] font-medium text-gray-600"
                  >
                    +{dayEvents.length - 3} more
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function MonthEvent({
  event,
  onOpenEvent,
}: {
  event: CalendarEventItem;
  onOpenEvent: (event: CalendarEventItem) => void;
}) {
  const toneClass = {
    blue: "bg-calendar-primary-container text-blue-800",
    teal: "bg-calendar-secondary-container text-teal-800",
    violet: "bg-violet-100 text-violet-800",
    amber: "bg-calendar-amber-container text-amber-900",
    rose: "bg-rose-100 text-rose-800",
  }[event.tone];

  return (
    <button
      type="button"
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onOpenEvent(event);
      }}
      className={cn(
        "m3-pressable block w-full truncate rounded-full px-2 py-1 text-left text-[11px] font-semibold",
        toneClass,
      )}
    >
      {event.title}
    </button>
  );
}
