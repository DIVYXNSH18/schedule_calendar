import type { CalendarEventItem, EventDraft } from "@/components/calendar/types";
import { CalendarEvent } from "@/components/calendar/calendar-event";
import { useTimezone } from "@/components/calendar/timezone-context";
import {
  addDays,
  dateKey,
  dateKeyTz,
  dayOfWeekTz,
  DAY_NAMES,
  sameDay,
  currentMinutesInTz,
  tzParts,
} from "@/lib/date-utils";
import { timeLabels } from "@/lib/calendar-data";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 48;
const DAY_COUNT = 7;
const GRID_HEIGHT = HOUR_HEIGHT * 24;

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
  const days = Array.from({ length: DAY_COUNT }, (_, index) => addDays(weekStart, index));
  const { timezone } = useTimezone();
  const tzLabel = timezone.label;

  return (
    <main className="m3-container mb-3 mr-3 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[32px]">
      <div className="flex h-full min-h-0 flex-col overflow-x-auto">
        <div className="flex min-h-0 min-w-[760px] flex-1 flex-col">
          <WeekHeader
            days={days}
            selectedDate={selectedDate}
            today={today}
            tzOffset={timezone.offset}
            tzLabel={tzLabel}
            onSelectDate={onSelectDate}
          />
          <AllDayRow
            days={days}
            tzLabel={tzLabel}
            events={events.filter((event) => event.allDay)}
            onCreateEvent={onCreateEvent}
            onOpenEvent={onOpenEvent}
          />
          <TimeGrid
            days={days}
            today={today}
            tzLabel={tzLabel}
            events={events.filter((event) => !event.allDay)}
            onCreateEvent={onCreateEvent}
            onOpenEvent={onOpenEvent}
          />
        </div>
      </div>
    </main>
  );
}

function WeekHeader({
  days,
  selectedDate,
  today,
  tzOffset,
  tzLabel,
  onSelectDate,
}: {
  days: Date[];
  selectedDate: Date;
  today: Date;
  tzOffset: string;
  tzLabel: string;
  onSelectDate: (date: Date) => void;
}) {
  return (
    <div className="calendar-grid flex-shrink-0 border-b border-white/70 bg-white/35">
      <div className="flex w-16 items-end justify-center border-r border-white/70 pb-2 text-[10px] font-semibold text-gray-500">
        {tzOffset}
      </div>

      {days.map((day) => {
        const isToday = dateKeyTz(day, tzLabel) === dateKeyTz(today, tzLabel);
        const isSelected = dateKeyTz(day, tzLabel) === dateKeyTz(selectedDate, tzLabel);
        const dow = dayOfWeekTz(day, tzLabel);
        const { day: dayNum } = tzParts(day, tzLabel);

        return (
          <button
            key={dateKeyTz(day, tzLabel)}
            type="button"
            onClick={() => onSelectDate(day)}
            className="m3-focus-ring flex flex-col items-center justify-center border-r border-white/70 py-3 transition-colors last:border-r-0 hover:bg-calendar-surface-container-low"
          >
            <span className={cn("text-[11px] font-medium uppercase", isToday ? "text-blue-600" : "text-gray-500")}>
              {DAY_NAMES[dow]}
            </span>
            <span
              className={cn(
                "mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl transition-colors",
                isToday && "animate-m3-pop bg-calendar-primary text-white shadow-m3-container",
                isSelected && !isToday && "bg-calendar-primary-container text-calendar-primary",
                !isToday && !isSelected && "text-2xl text-gray-600 hover:bg-gray-100",
              )}
            >
              {dayNum}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AllDayRow({
  days,
  tzLabel,
  events,
  onCreateEvent,
  onOpenEvent,
}: {
  days: Date[];
  tzLabel: string;
  events: CalendarEventItem[];
  onCreateEvent: (draft: EventDraft) => void;
  onOpenEvent: (event: CalendarEventItem) => void;
}) {
  return (
    <div className="calendar-grid min-h-11 flex-shrink-0 border-b border-white/70 bg-white/25">
      <div className="w-16 border-r border-white/70" />
      {days.map((day) => {
        const dk = dateKeyTz(day, tzLabel);
        const dayEvents = events.filter((event) => event.date === dk);

        return (
          <div
            key={dk}
            role="button"
            tabIndex={0}
            onClick={() =>
              onCreateEvent({
                title: "",
                date: dk,
                startMinutes: 9 * 60,
                endMinutes: 10 * 60,
                allDay: true,
                calendarId: "primary",
                tone: "blue",
                type: "event",
              })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onCreateEvent({
                  title: "",
                  date: dk,
                  startMinutes: 9 * 60,
                  endMinutes: 10 * 60,
                  allDay: true,
                  calendarId: "primary",
                  tone: "blue",
                  type: "event",
                });
              }
            }}
            className="min-w-0 cursor-pointer border-r border-white/70 p-1.5 text-left transition-colors last:border-r-0 hover:bg-calendar-surface-container-low"
          >
            {dayEvents.slice(0, 2).map((event) => (
              <AllDayEvent key={event.id} event={event} onOpenEvent={onOpenEvent} />
            ))}
            {dayEvents.length > 2 ? (
              <div className="px-1 text-[11px] font-medium text-gray-600">
                +{dayEvents.length - 2} more
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function AllDayEvent({
  event,
  onOpenEvent,
}: {
  event: CalendarEventItem;
  onOpenEvent: (event: CalendarEventItem) => void;
}) {
  const toneClass = {
    blue: "bg-calendar-primary hover:bg-blue-700",
    teal: "bg-calendar-secondary hover:bg-teal-800",
    violet: "bg-violet-600 hover:bg-violet-700",
    amber: "bg-calendar-amber hover:bg-amber-700",
    rose: "bg-rose-600 hover:bg-rose-700",
  }[event.tone];

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onOpenEvent(event);
      }}
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
          keyEvent.preventDefault();
          onOpenEvent(event);
        }
      }}
      className={cn(
        "m3-pressable mb-1 block truncate rounded-full px-2.5 py-1 text-xs font-semibold text-white",
        toneClass,
      )}
      title={event.title}
    >
      {event.type === "task" ? "Task: " : ""}
      {event.title}
    </span>
  );
}

function TimeGrid({
  days,
  today,
  tzLabel,
  events,
  onCreateEvent,
  onOpenEvent,
}: {
  days: Date[];
  today: Date;
  tzLabel: string;
  events: CalendarEventItem[];
  onCreateEvent: (draft: EventDraft) => void;
  onOpenEvent: (event: CalendarEventItem) => void;
}) {
  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="relative min-h-[1152px]">
        <ColumnDividers />
        <TimeRows />
        <EventsLayer
          days={days}
          today={today}
          tzLabel={tzLabel}
          events={events}
          onCreateEvent={onCreateEvent}
          onOpenEvent={onOpenEvent}
        />
      </div>
    </div>
  );
}

function ColumnDividers() {
  return (
    <div className="calendar-grid pointer-events-none absolute inset-0 w-full">
      <div className="w-16" />
      {Array.from({ length: DAY_COUNT }).map((_, index) => (
        <div
          key={index}
          className="h-[1152px] border-r border-white/75 last:border-r-0"
        />
      ))}
    </div>
  );
}

function TimeRows() {
  return (
    <div className="relative w-full">
      {timeLabels.map((label) => (
        <div key={label} className="flex h-12 w-full border-b border-calendar-line/80">
          <div className="relative top-[-10px] w-16 pr-2 text-right text-xs font-medium text-gray-500">
            {label}
          </div>
          <div className="flex-1" />
        </div>
      ))}
    </div>
  );
}

function EventsLayer({
  days,
  today,
  tzLabel,
  events,
  onCreateEvent,
  onOpenEvent,
}: {
  days: Date[];
  today: Date;
  tzLabel: string;
  events: CalendarEventItem[];
  onCreateEvent: (draft: EventDraft) => void;
  onOpenEvent: (event: CalendarEventItem) => void;
}) {
  return (
    <div className="absolute bottom-0 left-16 right-0 top-0 grid grid-cols-7">
      {days.map((day) => {
        const dayKey = dateKeyTz(day, tzLabel);
        const dayEvents = events.filter((event) => event.date === dayKey);
        const isToday = dateKeyTz(day, tzLabel) === dateKeyTz(today, tzLabel);

        return (
          <div
            key={dayKey}
            role="button"
            tabIndex={0}
            className="relative min-w-0 cursor-pointer text-left transition-colors hover:bg-white/35"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const y = Math.max(event.clientY - rect.top, 0);
              const minutes = Math.min(
                Math.max(Math.floor((y / GRID_HEIGHT) * 24 * 60 / 30) * 30, 0),
                23 * 60 + 30,
              );

              onCreateEvent({
                title: "",
                date: dayKey,
                startMinutes: minutes,
                endMinutes: Math.min(minutes + 60, 24 * 60),
                allDay: false,
                calendarId: "primary",
                tone: "blue",
                type: "event",
              });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onCreateEvent({
                  title: "",
                  date: dayKey,
                  startMinutes: 9 * 60,
                  endMinutes: 10 * 60,
                  allDay: false,
                  calendarId: "primary",
                  tone: "blue",
                  type: "event",
                });
              }
            }}
          >
            {isToday ? <CurrentTimeIndicator tzLabel={tzLabel} /> : null}
            {dayEvents.map((event) => (
              <CalendarEvent key={event.id} event={event} onOpen={onOpenEvent} />
            ))}
          </div>
        );
      })}
    </div>
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
