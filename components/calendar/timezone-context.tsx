"use client";

import { createContext, useContext, useState } from "react";

export type TimezoneInfo = {
  label: string;   // e.g. "Asia/Kolkata"
  offset: string;  // e.g. "GMT+05:30"
  city: string;    // e.g. "Kolkata"
};

type TimezoneContextValue = {
  timezone: TimezoneInfo;
  setTimezone: (tz: TimezoneInfo) => void;
};

function getLocalTimezone(): TimezoneInfo {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const city = tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
  const offset = new Intl.DateTimeFormat("en", { timeZoneName: "shortOffset", timeZone: tz })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  return { label: tz, offset, city };
}

const TimezoneContext = createContext<TimezoneContextValue>({
  timezone: getLocalTimezone(),
  setTimezone: () => {},
});

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezone] = useState<TimezoneInfo>(getLocalTimezone);
  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  return useContext(TimezoneContext);
}
