export function CalendarLogo() {
  return (
    <div className="flex items-center gap-2 pr-2 sm:pr-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-calendar-primary shadow-m3-container">
        <div className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-white text-[11px] font-bold text-white">
          3
        </div>
      </div>
      <span className="hidden text-[22px] font-semibold text-gray-700 sm:block">
        Calendar
      </span>
    </div>
  );
}
