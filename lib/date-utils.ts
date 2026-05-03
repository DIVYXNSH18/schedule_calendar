export const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const SHORT_DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const MONTH_DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const FULL_DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfWeek(date: Date) {
  const clean = startOfDay(date);
  clean.setDate(clean.getDate() - clean.getDay());
  return clean;
}

export function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function addMonths(date: Date, months: number) {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

export function sameDay(a: Date, b: Date) {
  return dateKey(a) === dateKey(b);
}

export function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function monthLabel(date: Date) {
  return MONTH_FORMATTER.format(date);
}

export function headerRangeLabel(weekStart: Date) {
  const weekEnd = addDays(weekStart, 6);

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return monthLabel(weekStart);
  }

  if (weekStart.getFullYear() === weekEnd.getFullYear()) {
    return `${MONTH_DAY_FORMATTER.format(weekStart)} - ${MONTH_DAY_FORMATTER.format(
      weekEnd,
    )}, ${weekEnd.getFullYear()}`;
  }

  return `${MONTH_DAY_FORMATTER.format(weekStart)}, ${weekStart.getFullYear()} - ${MONTH_DAY_FORMATTER.format(
    weekEnd,
  )}, ${weekEnd.getFullYear()}`;
}

export function dayLabel(date: Date) {
  return FULL_DAY_FORMATTER.format(date);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function timeFromMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function humanTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHour}:${String(mins).padStart(2, "0")} ${suffix}`;
}

export function humanTimeRange(startMinutes: number, endMinutes: number) {
  return `${humanTime(startMinutes)} - ${humanTime(endMinutes)}`;
}

export function buildMiniCalendarDays(monthDate: Date) {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = startOfWeek(firstOfMonth);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      date,
      key: dateKey(date),
      muted: date.getMonth() !== monthDate.getMonth(),
    };
  });
}
