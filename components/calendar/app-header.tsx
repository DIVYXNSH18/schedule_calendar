"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CalendarLogo } from "@/components/calendar/calendar-logo";
import { IconButton } from "@/components/calendar/icon-button";
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
  searchQuery,
  onToggleSidebar,
  onToday,
  onPrevious,
  onNext,
  onViewChange,
  onSearchChange,
}: AppHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenus(event: MouseEvent) {
      if (!viewRef.current?.contains(event.target as Node)) {
        setViewOpen(false);
      }

      if (!settingsRef.current?.contains(event.target as Node)) {
        setSettingsOpen(false);
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
  const activeViewLabel = viewOptions.find((option) => option.id === view)?.label ?? "Week";

  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between gap-2 bg-transparent px-2 lg:px-4">
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

      <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
        <div
          className={cn(
            "m3-container hidden h-12 items-center overflow-hidden rounded-full transition-all md:flex",
            searchOpen ? "w-72 pl-4" : "w-12",
          )}
        >
          {searchOpen ? (
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              autoFocus
              placeholder="Search events"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-gray-500"
            />
          ) : null}
          <IconButton
            icon={Search}
            label="Search"
            onClick={() => setSearchOpen((value) => !value)}
          />
        </div>
        <IconButton icon={HelpCircle} label="Help" className="hidden md:inline-flex" />
        <div className="relative" ref={settingsRef}>
          <IconButton
            icon={Settings}
            label="Settings"
            onClick={() => setSettingsOpen((value) => !value)}
          />
          {settingsOpen ? (
            <div className="m3-container animate-m3-enter absolute right-0 top-12 z-50 w-60 rounded-[24px] py-2 text-sm shadow-m3-lifted">
              <div className="px-4 py-2 font-medium text-gray-800">Settings</div>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-calendar-surface-container" type="button">
                Density: Comfortable
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-calendar-surface-container" type="button">
                Time zone: GMT+05:30
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative ml-2 hidden sm:block" ref={viewRef}>
          <button
            type="button"
            onClick={() => setViewOpen((value) => !value)}
            className="m3-pressable m3-focus-ring flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-m3-container backdrop-blur-xl hover:bg-calendar-primary-container"
          >
            {activeViewLabel}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          {viewOpen ? (
            <div className="m3-container animate-m3-enter absolute right-0 top-12 z-50 w-40 rounded-[24px] py-2 text-sm shadow-m3-lifted">
              {viewOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onViewChange(option.id);
                    setViewOpen(false);
                  }}
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
          ) : null}
        </div>

        <button
          type="button"
          aria-label="User profile"
          className="m3-pressable ml-1 flex h-10 w-10 items-center justify-center rounded-[16px] bg-calendar-primary font-semibold text-white shadow-m3-container sm:ml-2"
        >
          U
        </button>
      </div>
    </header>
  );
}
