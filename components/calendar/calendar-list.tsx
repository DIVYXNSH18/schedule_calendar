"use client";

import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { calendarFilters } from "@/lib/calendar-data";
import { cn } from "@/lib/utils";

type CalendarListProps = {
  visibleCalendarIds: string[];
  onToggleCalendar: (id: string) => void;
};

export function CalendarList({
  visibleCalendarIds,
  onToggleCalendar,
}: CalendarListProps) {
  const [open, setOpen] = useState(true);

  return (
    <section className="m3-container mt-6 rounded-[28px] px-2 py-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="m3-focus-ring flex w-full items-center justify-between rounded-full p-2.5 transition-colors hover:bg-calendar-surface-container"
      >
          <span className="text-sm font-semibold text-gray-800">My calendars</span>
        <ChevronUp
          className={cn("h-4 w-4 text-gray-600 transition-transform", !open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="mt-1 space-y-1">
          {calendarFilters.map((filter) => (
            <label
              key={filter.label}
              className="group flex cursor-pointer items-center rounded-full px-3 py-2 transition-colors hover:bg-calendar-surface-container"
            >
              <input
                type="checkbox"
                checked={visibleCalendarIds.includes(filter.id)}
                onChange={() => onToggleCalendar(filter.id)}
                className={cn(
                  "h-4 w-4 rounded focus:ring-calendar-primary",
                  filter.accentClass,
                )}
              />
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {filter.label}
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </section>
  );
}
