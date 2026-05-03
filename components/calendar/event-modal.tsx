"use client";

import { CalendarDays, Clock, MapPin, Trash2, Type } from "lucide-react";
import { useEffect, useState } from "react";
import type { EventDraft, EventTone } from "@/components/calendar/types";
import { calendarFilters } from "@/lib/calendar-data";
import { dateKey, minutesFromTime, parseDateKey, timeFromMinutes } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

const toneOptions: Array<{ tone: EventTone; label: string; className: string }> = [
  { tone: "blue", label: "Blue", className: "bg-blue-600" },
  { tone: "teal", label: "Teal", className: "bg-teal-600" },
  { tone: "violet", label: "Violet", className: "bg-violet-600" },
  { tone: "amber", label: "Amber", className: "bg-amber-500" },
  { tone: "rose", label: "Rose", className: "bg-rose-600" },
];

type EventModalProps = {
  draft: EventDraft | null;
  onClose: () => void;
  onSave: (draft: EventDraft) => void;
  onDelete: (id: string) => void;
};

export function EventModal({ draft, onClose, onSave, onDelete }: EventModalProps) {
  const [form, setForm] = useState<EventDraft | null>(draft);

  useEffect(() => {
    setForm(draft);
  }, [draft]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (!form) {
    return null;
  }

  const selectedDate = parseDateKey(form.date);

  function update<K extends keyof EventDraft>(key: K, value: EventDraft[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  function save() {
    const current = form;

    if (!current) {
      return;
    }

    if (!current.title.trim()) {
      update("title", "Untitled");
      onSave({ ...current, title: "Untitled" });
      return;
    }

    const start = Math.min(current.startMinutes, current.endMinutes - 15);
    const end = Math.max(current.endMinutes, start + 15);
    onSave({ ...current, title: current.title.trim(), startMinutes: start, endMinutes: end });
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 p-3 backdrop-blur-sm">
      <div className="m3-container animate-m3-enter w-full max-w-xl overflow-hidden rounded-[32px] shadow-m3-lifted">
        <div className="flex items-center justify-between border-b border-white/70 px-5 py-4">
          <div className="text-sm font-semibold text-gray-700">
            {form.id ? "Edit" : "Create"} {form.type === "task" ? "task" : "event"}
          </div>
          {form.id ? (
            <button
              type="button"
              onClick={() => onDelete(form.id!)}
              className="m3-icon-button rounded-full p-2 text-gray-500 hover:bg-rose-100 hover:text-rose-700"
              aria-label="Delete event"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="space-y-4 px-5 py-5">
          <label className="flex items-center gap-3 border-b border-gray-300 pb-2 focus-within:border-blue-600">
            <Type className="h-5 w-5 text-gray-500" aria-hidden="true" />
            <input
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="Add title"
              className="min-w-0 flex-1 bg-transparent text-2xl font-semibold outline-none placeholder:text-gray-400"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[24px_1fr] sm:items-start">
            <CalendarDays className="mt-2 hidden h-5 w-5 text-gray-500 sm:block" aria-hidden="true" />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium uppercase text-gray-500">
                Date
                <input
                  type="date"
                  value={dateKey(selectedDate)}
                  onChange={(event) => update("date", event.target.value)}
                  className="mt-1 w-full rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-sm normal-case text-gray-800 outline-none focus:border-calendar-primary"
                />
              </label>
              <label className="flex items-end gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.allDay}
                  onChange={(event) => update("allDay", event.target.checked)}
                  className="mb-3 h-4 w-4 accent-blue-600"
                />
                <span className="pb-2 font-medium">All day</span>
              </label>
            </div>
          </div>

          {!form.allDay ? (
            <div className="grid gap-3 sm:grid-cols-[24px_1fr] sm:items-start">
              <Clock className="mt-2 hidden h-5 w-5 text-gray-500 sm:block" aria-hidden="true" />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-medium uppercase text-gray-500">
                  Starts
                  <input
                    type="time"
                    value={timeFromMinutes(form.startMinutes)}
                    onChange={(event) =>
                      update("startMinutes", minutesFromTime(event.target.value))
                    }
                    className="mt-1 w-full rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-sm normal-case text-gray-800 outline-none focus:border-calendar-primary"
                  />
                </label>
                <label className="text-xs font-medium uppercase text-gray-500">
                  Ends
                  <input
                    type="time"
                    value={timeFromMinutes(form.endMinutes)}
                    onChange={(event) =>
                      update("endMinutes", minutesFromTime(event.target.value))
                    }
                    className="mt-1 w-full rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-sm normal-case text-gray-800 outline-none focus:border-calendar-primary"
                  />
                </label>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-[24px_1fr] sm:items-start">
            <MapPin className="mt-2 hidden h-5 w-5 text-gray-500 sm:block" aria-hidden="true" />
            <input
              value={form.location ?? ""}
              onChange={(event) => update("location", event.target.value)}
              placeholder="Add location or conferencing"
              className="rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-calendar-primary"
            />
          </div>

          <textarea
            value={form.description ?? ""}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Add description"
            rows={3}
            className="w-full resize-none rounded-[24px] border border-white/80 bg-white/70 px-4 py-3 text-sm outline-none focus:border-calendar-primary"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium uppercase text-gray-500">
              Calendar
              <select
                value={form.calendarId}
                onChange={(event) => {
                  const calendar = calendarFilters.find((item) => item.id === event.target.value);
                  update("calendarId", event.target.value);
                  update("tone", calendar?.tone ?? form.tone);
                }}
                className="mt-1 w-full rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-sm normal-case text-gray-800 outline-none focus:border-calendar-primary"
              >
                {calendarFilters.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <div className="mb-1 text-xs font-medium uppercase text-gray-500">Color</div>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((option) => (
                  <button
                    key={option.tone}
                    type="button"
                    onClick={() => update("tone", option.tone)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 border-white ring-offset-2",
                      option.className,
                      form.tone === option.tone ? "ring-2 ring-calendar-primary" : "ring-1 ring-gray-200",
                    )}
                    aria-label={option.label}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/70 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="m3-pressable m3-focus-ring rounded-full px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-calendar-surface-container"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="m3-pressable m3-focus-ring rounded-full bg-calendar-primary px-6 py-2.5 text-sm font-semibold text-white shadow-m3-container hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
