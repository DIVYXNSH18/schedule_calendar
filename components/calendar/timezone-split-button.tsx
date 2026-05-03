"use client";

import { ChevronDown, Globe, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import cityTimezones from "city-timezones";
import { useTimezone, type TimezoneInfo } from "./timezone-context";
import { cn } from "@/lib/utils";

type TZResult = {
  timezone: string;
  city: string;
  country: string;
  offset: string;
};

function getOffset(tz: string): string {
  try {
    return (
      new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName")?.value ?? "GMT"
    );
  } catch {
    return "GMT";
  }
}

function searchCities(query: string): TZResult[] {
  const q = query.trim();
  if (!q) return [];
  const raw = cityTimezones.lookupViaCity(q);
  const all = raw.length
    ? raw
    : cityTimezones.cityMapping.filter((c) =>
        c.city_ascii.toLowerCase().includes(q.toLowerCase()),
      );
  return all
    .filter((c) => c.timezone)
    .slice(0, 20)
    .map((c) => ({
      timezone: c.timezone,
      city: c.city,
      country: c.country,
      offset: getOffset(c.timezone),
    }));
}

export function TimezoneSplitButton() {
  const { timezone, setTimezone } = useTimezone();
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TZResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setModalOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(() => {
      setResults(searchCities(query));
    }, 200);
  }, [query]);

  function pick(r: TZResult) {
    const tz: TimezoneInfo = { label: r.timezone, offset: r.offset, city: r.city };
    setTimezone(tz);
    setModalOpen(false);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      {/* M3 Expressive Split Button */}
      <div className="flex h-10 items-stretch overflow-hidden rounded-full shadow-sm ring-1 ring-white/60 backdrop-blur-xl">
        <div className="flex items-center gap-1.5 bg-calendar-primary-container pl-3 pr-2 text-sm font-semibold text-calendar-on-primary-container">
          <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">{timezone.offset}</span>
        </div>
        <div className="w-px bg-calendar-primary/20" />
        <button
          type="button"
          onClick={() => setModalOpen((v) => !v)}
          className="m3-pressable m3-focus-ring flex items-center gap-1 bg-calendar-primary-container py-2 pl-2 pr-3 text-sm font-medium text-calendar-on-primary-container hover:bg-[#c9d7ff]"
          aria-label="Change timezone"
        >
          <span className="hidden max-w-[80px] truncate sm:inline">{timezone.city}</span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform duration-200", modalOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Dropdown panel */}
      {modalOpen && (
        <div className="m3-container absolute right-0 top-12 z-50 w-80 rounded-[24px] p-4 shadow-2xl">
          <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 ring-1 ring-white/70">
            <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="mt-2 max-h-72 overflow-y-auto hide-scrollbar">
            {!query.trim() && (
              <div className="py-5 text-center text-sm text-gray-400">Type a city name to search…</div>
            )}
            {query.trim() && results.length === 0 && (
              <div className="py-5 text-center text-sm text-gray-400">No results.</div>
            )}
            {results.map((r, i) => (
              <button
                key={r.timezone + r.city + i}
                type="button"
                onClick={() => pick(r)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-calendar-surface-container",
                  timezone.label === r.timezone && timezone.city === r.city &&
                    "bg-calendar-primary-container font-semibold text-calendar-primary",
                )}
              >
                <div>
                  <div className="font-medium text-gray-800">{r.city}</div>
                  <div className="text-xs text-gray-500">{r.country} · {r.timezone}</div>
                </div>
                <span className="ml-3 shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-gray-700 shadow-sm">
                  {r.offset}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
