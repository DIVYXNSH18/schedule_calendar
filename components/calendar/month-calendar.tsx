"use client";

import { useState } from "react";
import { X, Clock } from "lucide-react";
import type { CalendarEventItem, EventDraft } from "@/components/calendar/types";
import { buildMiniCalendarDays, dateKeyTz, SHORT_DAY_NAMES, tzParts, humanTimeRange, parseDateKey } from "@/lib/date-utils";
import { useTimezone } from "@/components/calendar/timezone-context";
import { cn } from "@/lib/utils";

type MonthCalendarProps = {
  selectedDate: Date;
  today: Date;
  events: CalendarEventItem[];
  onSelectDate: (date: Date) => void;
  onCreateEvent: (draft: EventDraft) => void;
  onOpenEvent: (event: CalendarEventItem) => void;
};

const toneClasses = {
  blue:   { dot: "bg-blue-500",   card: "bg-blue-50 border-blue-200",   title: "text-blue-800" },
  teal:   { dot: "bg-teal-500",   card: "bg-teal-50 border-teal-200",   title: "text-teal-800" },
  violet: { dot: "bg-violet-500", card: "bg-violet-50 border-violet-200", title: "text-violet-800" },
  amber:  { dot: "bg-amber-400",  card: "bg-amber-50 border-amber-200",  title: "text-amber-900" },
  rose:   { dot: "bg-rose-500",   card: "bg-rose-50 border-rose-200",   title: "text-rose-800" },
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
  const { timezone } = useTimezone();
  const tzLabel = timezone.label;
  const [listModal, setListModal] = useState<{ key: string; date: Date } | null>(null);

  const listEvents = listModal
    ? events.filter((e) => e.date === listModal.key)
    : [];

  return (
    <>
      <main className="m3-container mb-3 mr-3 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[32px]">
        <div className="grid grid-cols-7 border-b border-white/70 bg-white/35 text-center text-xs font-semibold text-gray-500">
          {SHORT_DAY_NAMES.map((day, index) => (
            <div key={`${day}-${index}`} className="py-3">{day}</div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 overflow-hidden">
          {days.map((day) => {
            const key = dateKeyTz(day.date, tzLabel);
            const dayEvents = events.filter((event) => event.date === key);
            const isToday = key === dateKeyTz(today, tzLabel);
            const isSelected = key === dateKeyTz(selectedDate, tzLabel);
            const { day: dayNum } = tzParts(day.date, tzLabel);

            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectDate(day.date);
                  if (dayEvents.length > 0) {
                    setListModal({ key, date: day.date });
                  }
                }}
                onKeyDown={(e) => { if (e.key === "Enter") { onSelectDate(day.date); if (dayEvents.length > 0) setListModal({ key, date: day.date }); } }}
                className="flex h-full flex-col cursor-pointer overflow-hidden border-b border-r border-white/70 p-1.5 text-left transition-all hover:bg-calendar-surface-container-low"
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSelectDate(day.date); }}
                  className={cn(
                    "mb-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                    day.muted && "text-gray-400",
                    isToday && "animate-m3-pop bg-calendar-primary text-white shadow-m3-container",
                    isSelected && !isToday && "bg-calendar-primary-container text-calendar-primary",
                  )}
                >
                  {dayNum}
                </button>

                <div className="min-h-0 flex-1 overflow-hidden space-y-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <MonthEvent key={event.id} event={event} onOpenEvent={(ev) => { setListModal({ key, date: day.date }); }} />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="px-1 text-[11px] font-medium text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Day sessions list modal */}
      {listModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setListModal(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-[28px] shadow-2xl"
            style={{ background: "#FFFBFE" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Sessions</p>
                <p className="text-base font-semibold text-gray-900">
                  {parseDateKey(listModal.key).toLocaleDateString("en-US", {
                    weekday: "long", month: "long", day: "numeric",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setListModal(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Session list */}
            <div className="max-h-96 overflow-y-auto px-4 py-3 space-y-2">
              {listEvents.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No sessions on this day.</p>
              ) : (
                listEvents
                  .sort((a, b) => a.startMinutes - b.startMinutes)
                  .map((event) => {
                    const tc = toneClasses[event.tone] ?? toneClasses.blue;
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => { setListModal(null); onOpenEvent(event); }}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors hover:brightness-95",
                          tc.card,
                        )}
                      >
                        <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", tc.dot)} />
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-semibold truncate", tc.title)}>{event.title}</p>
                          {event.teacher && (
                            <p className="text-xs text-gray-500 truncate">{event.teacher}</p>
                          )}
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>{event.allDay ? "All day" : humanTimeRange(event.startMinutes, event.endMinutes)}</span>
                            {event.isTrial && (
                              <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">Trial</span>
                            )}
                            {!event.isTrial && event.price !== undefined && (
                              <span className="text-[10px] font-medium">₹{event.price}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
              )}
            </div>

            <div className="pb-2" />
          </div>
        </div>
      )}
    </>
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
    blue:   "bg-calendar-primary-container text-blue-800",
    teal:   "bg-calendar-secondary-container text-teal-800",
    violet: "bg-violet-100 text-violet-800",
    amber:  "bg-calendar-amber-container text-amber-900",
    rose:   "bg-rose-100 text-rose-800",
  }[event.tone];

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onOpenEvent(event); }}
      className={cn(
        "block w-full truncate rounded-full px-2 py-0.5 text-left text-[11px] font-semibold",
        toneClass,
      )}
    >
      {event.title}
    </button>
  );
}
