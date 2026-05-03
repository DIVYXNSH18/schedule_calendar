"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/calendar/app-header";
import { DayCalendar } from "@/components/calendar/day-calendar";
import { EventModal } from "@/components/calendar/event-modal";
import { MonthCalendar } from "@/components/calendar/month-calendar";
import { ScheduleCalendar } from "@/components/calendar/schedule-calendar";
import { Sidebar } from "@/components/calendar/sidebar";
import type { CalendarEventItem, CalendarView, EventDraft } from "@/components/calendar/types";
import { WeekCalendar } from "@/components/calendar/week-calendar";
import { calendarFilters, createInitialEvents } from "@/lib/calendar-data";
import {
  addDays,
  addMonths,
  dateKey,
  dayLabel,
  headerRangeLabel,
  monthLabel,
  startOfDay,
  startOfWeek,
} from "@/lib/date-utils";

const STORAGE_KEY = "schedule2-calendar-events";

export function CalendarApp() {
  const [today, setToday] = useState(() => startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => startOfDay(new Date()));
  const [view, setView] = useState<CalendarView>("week");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState<CalendarEventItem[]>(() =>
    createInitialEvents(new Date()),
  );
  const [visibleCalendarIds, setVisibleCalendarIds] = useState(() =>
    calendarFilters.filter((calendar) => calendar.checked).map((calendar) => calendar.id),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDraft, setEditingDraft] = useState<EventDraft | null>(null);

  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);
  const headerLabel =
    view === "day"
      ? dayLabel(selectedDate)
      : view === "month"
        ? monthLabel(selectedDate)
        : view === "schedule"
          ? "Schedule"
          : headerRangeLabel(weekStart);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");

    function syncSidebar(event: MediaQueryList | MediaQueryListEvent) {
      setSidebarOpen(event.matches);
    }

    syncSidebar(query);
    query.addEventListener("change", syncSidebar);

    return () => query.removeEventListener("change", syncSidebar);
  }, []);

  useEffect(() => {
    const storedEvents = window.localStorage.getItem(STORAGE_KEY);

    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents) as CalendarEventItem[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const timer = window.setInterval(() => setToday(startOfDay(new Date())), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return events.filter((event) => {
      const calendarVisible = visibleCalendarIds.includes(event.calendarId);

      if (!calendarVisible) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [event.title, event.location, event.description]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
    });
  }, [events, searchQuery, visibleCalendarIds]);

  function selectDate(date: Date) {
    const cleanDate = startOfDay(date);
    setSelectedDate(cleanDate);
    setVisibleMonth(cleanDate);
  }

  function openCreateDraft(type: "event" | "task", date = selectedDate) {
    const calendar = type === "task" ? calendarFilters[2] : calendarFilters[0];

    setEditingDraft({
      title: "",
      date: dateKey(date),
      startMinutes: type === "task" ? 9 * 60 : 10 * 60,
      endMinutes: type === "task" ? 10 * 60 : 11 * 60,
      allDay: type === "task",
      calendarId: calendar.id,
      tone: calendar.tone,
      type,
    });
  }

  function saveEvent(draft: EventDraft) {
    setEvents((currentEvents) => {
      if (draft.id) {
        return currentEvents.map((event) =>
          event.id === draft.id ? ({ ...draft, id: draft.id } as CalendarEventItem) : event,
        );
      }

      return [
        ...currentEvents,
        {
          ...draft,
          id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        },
      ];
    });
    setEditingDraft(null);
  }

  function deleteEvent(id: string) {
    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== id));
    setEditingDraft(null);
  }

  function toggleCalendar(id: string) {
    setVisibleCalendarIds((current) =>
      current.includes(id)
        ? current.filter((calendarId) => calendarId !== id)
        : [...current, id],
    );
  }

  function goToPreviousRange() {
    const nextDate =
      view === "day"
        ? addDays(selectedDate, -1)
        : view === "month"
          ? addMonths(selectedDate, -1)
          : addDays(selectedDate, -7);

    selectDate(nextDate);
  }

  function goToNextRange() {
    const nextDate =
      view === "day"
        ? addDays(selectedDate, 1)
        : view === "month"
          ? addMonths(selectedDate, 1)
          : addDays(selectedDate, 7);

    selectDate(nextDate);
  }

  function renderCalendarView() {
    if (view === "day") {
      return (
        <DayCalendar
          selectedDate={selectedDate}
          today={today}
          events={filteredEvents}
          onCreateEvent={setEditingDraft}
          onOpenEvent={setEditingDraft}
        />
      );
    }

    if (view === "month") {
      return (
        <MonthCalendar
          selectedDate={selectedDate}
          today={today}
          events={filteredEvents}
          onSelectDate={selectDate}
          onCreateEvent={setEditingDraft}
          onOpenEvent={setEditingDraft}
        />
      );
    }

    if (view === "schedule") {
      return (
        <ScheduleCalendar events={filteredEvents} onOpenEvent={setEditingDraft} />
      );
    }

    return (
      <WeekCalendar
        weekStart={weekStart}
        selectedDate={selectedDate}
        today={today}
        events={filteredEvents}
        onSelectDate={selectDate}
        onCreateEvent={setEditingDraft}
        onOpenEvent={setEditingDraft}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-calendar-surface text-gray-700">
      <AppHeader
        label={headerLabel}
        view={view}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewChange={setView}
        onToggleSidebar={() => setSidebarOpen((value) => !value)}
        onToday={() => selectDate(today)}
        onPrevious={goToPreviousRange}
        onNext={goToNextRange}
      />

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-x-0 bottom-0 top-20 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          />
        ) : null}

        <Sidebar
          open={sidebarOpen}
          visibleMonth={visibleMonth}
          selectedDate={selectedDate}
          today={today}
          visibleCalendarIds={visibleCalendarIds}
          onCreate={(type) => openCreateDraft(type)}
          onPreviousMonth={() => setVisibleMonth((month) => addMonths(month, -1))}
          onNextMonth={() => setVisibleMonth((month) => addMonths(month, 1))}
          onSelectDate={selectDate}
          onToggleCalendar={toggleCalendar}
        />

        {renderCalendarView()}
      </div>

      <EventModal
        draft={editingDraft}
        onClose={() => setEditingDraft(null)}
        onSave={saveEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
}
