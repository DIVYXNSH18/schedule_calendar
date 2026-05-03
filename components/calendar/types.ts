export type CalendarFilter = {
  id: string;
  label: string;
  accentClass: string;
  checked: boolean;
  tone: EventTone;
};

export type EventTone = "blue" | "teal" | "violet" | "amber" | "rose";

export type CalendarView = "day" | "week" | "month" | "schedule";

export type CalendarEventItem = {
  id: string;
  title: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  allDay: boolean;
  calendarId: string;
  tone: EventTone;
  type: "event" | "task";
  subject?: string;
  teacher?: string;
  location?: string;
  description?: string;
};

export type EventDraft = Omit<CalendarEventItem, "id"> & {
  id?: string;
};
