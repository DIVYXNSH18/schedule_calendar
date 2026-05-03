"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CalendarLogo } from "@/components/calendar/calendar-logo";
import { IconButton } from "@/components/calendar/icon-button";
import { TimezoneSplitButton } from "@/components/calendar/timezone-split-button";
import type { CalendarView } from "@/components/calendar/types";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  label: string;
  view: CalendarView;
  searchQuery: string;
  onToggleSidebar: () => void;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarView) => void;
  onSearchChange: (value: string) => void;
};

export function AppHeader({
  label,
  view,
  onToggleSidebar,
  onToday,
  onPrevious,
  onNext,
  onViewChange,
}: AppHeaderProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenus(event: MouseEvent) {
      if (!viewRef.current?.contains(event.target as Node)) {
        setViewOpen(false);
      }
    }
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const viewOptions: Array<{ id: CalendarView; label: string }> = [
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "schedule", label: "Schedule" },
  ];
  const activeViewLabel = viewOptions.find((o) => o.id === view)?.label ?? "Week";

  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between gap-2 bg-transparent px-2 lg:px-4">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <IconButton icon={Menu} label="Toggle sidebar" onClick={onToggleSidebar} />
        <CalendarLogo />

        <button
          type="button"
          onClick={onToday}
          className="m3-pressable m3-focus-ring ml-0 rounded-full bg-calendar-primary-container px-4 py-2.5 text-sm font-semibold text-calendar-on-primary-container shadow-m3-container hover:bg-[#c9d7ff] sm:ml-2 sm:px-5"
        >
          Today
        </button>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <IconButton
            icon={ChevronLeft}
            label={`Previous ${activeViewLabel.toLowerCase()}`}
            className="h-9 w-9"
            onClick={onPrevious}
          />
          <IconButton
            icon={ChevronRight}
            label={`Next ${activeViewLabel.toLowerCase()}`}
            className="h-9 w-9"
            onClick={onNext}
          />
          <h1 className="ml-1 hidden truncate text-xl text-gray-700 md:block">
            {label}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <TimezoneSplitButton />

        <div className="relative hidden sm:block" ref={viewRef}>
          <button
            type="button"
            onClick={() => setViewOpen((v) => !v)}
            className="m3-pressable m3-focus-ring flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-m3-container backdrop-blur-xl hover:bg-calendar-primary-container"
          >
            {activeViewLabel}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          {viewOpen && (
            <div className="m3-container animate-m3-enter absolute right-0 top-12 z-50 w-40 rounded-[24px] py-2 text-sm shadow-m3-lifted">
              {viewOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => { onViewChange(option.id); setViewOpen(false); }}
                  className={cn(
                    "mx-2 block w-[calc(100%-1rem)] rounded-full px-4 py-2 text-left transition-colors hover:bg-calendar-surface-container",
                    option.id === view
                      ? "bg-calendar-primary-container font-semibold text-calendar-primary"
                      : "text-gray-700",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
