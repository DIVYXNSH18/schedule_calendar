import { Users } from "lucide-react";
import { CalendarList } from "@/components/calendar/calendar-list";
import { CreateButton } from "@/components/calendar/create-button";
import { MiniCalendar } from "@/components/calendar/mini-calendar";
import { cn } from "@/lib/utils";

type SidebarProps = {
  open: boolean;
  visibleMonth: Date;
  selectedDate: Date;
  today: Date;
  visibleCalendarIds: string[];
  onCreate: (type: "event" | "task") => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
  onToggleCalendar: (id: string) => void;
};

export function Sidebar({
  open,
  visibleMonth,
  selectedDate,
  today,
  visibleCalendarIds,
  onCreate,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
  onToggleCalendar,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-20 z-40 flex w-72 flex-shrink-0 flex-col overflow-y-auto bg-transparent pl-3 pr-3 transition-transform duration-300 hide-scrollbar lg:static lg:top-auto lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full lg:hidden",
      )}
    >
      <CreateButton onCreate={onCreate} />
      <MiniCalendar
        visibleMonth={visibleMonth}
        selectedDate={selectedDate}
        today={today}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
        onSelectDate={onSelectDate}
      />

      <div className="m3-container mt-6 flex items-center rounded-full p-3">
        <Users className="mr-2 h-5 w-5 text-calendar-secondary" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search for people"
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-500"
        />
      </div>

      <CalendarList
        visibleCalendarIds={visibleCalendarIds}
        onToggleCalendar={onToggleCalendar}
      />
    </aside>
  );
}
