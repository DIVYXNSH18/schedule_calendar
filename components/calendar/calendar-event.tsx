"use client";

import type { CalendarEventItem } from "@/components/calendar/types";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 64;

const toneClasses = {
  blue:   { box: "border-[#0b57d0] bg-[#d8e2ff] hover:bg-[#c9d7ff]",   title: "text-[#001a41]", sub: "text-[#0b57d0]" },
  teal:   { box: "border-[#006a6a] bg-[#bbebea] hover:bg-[#a0dedd]",   title: "text-[#002020]", sub: "text-[#006a6a]" },
  violet: { box: "border-[#6d28d9] bg-[#ede9fe] hover:bg-[#ddd6fe]",   title: "text-[#2e1065]", sub: "text-[#6d28d9]" },
  amber:  { box: "border-[#a65f00] bg-[#ffddb0] hover:bg-[#ffd29b]",   title: "text-[#3d2000]", sub: "text-[#a65f00]" },
  rose:   { box: "border-[#be123c] bg-[#ffe4e6] hover:bg-[#fecdd3]",   title: "text-[#4c0519]", sub: "text-[#be123c]" },
} satisfies Record<CalendarEventItem["tone"], { box: string; title: string; sub: string }>;

function TeacherAvatar({ name, tone }: { name: string; tone: CalendarEventItem["tone"] }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const bg = { blue: "bg-[#0b57d0]", teal: "bg-[#006a6a]", violet: "bg-[#6d28d9]", amber: "bg-[#a65f00]", rose: "bg-[#be123c]" }[tone];
  return (
    <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white", bg)}>
      {initials}
    </div>
  );
}

type CalendarEventProps = {
  event: CalendarEventItem;
  onOpen: (event: CalendarEventItem) => void;
  hourHeight?: number;
};

export function CalendarEvent({ event, onOpen, hourHeight = HOUR_HEIGHT }: CalendarEventProps) {
  const tone = toneClasses[event.tone];
  const topPx = (event.startMinutes / 60) * hourHeight;
  const heightPx = ((event.endMinutes - event.startMinutes) / 60) * hourHeight;
  const durationMins = event.endMinutes - event.startMinutes;
  const tall = heightPx >= 50;
  const veryTall = heightPx >= 100;

  // Compute status from current time if not set
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const status = event.status ?? (
    event.date < today ? "completed"
    : event.date > today ? "pending"
    : nowMins >= event.startMinutes && nowMins < event.endMinutes ? "ongoing"
    : nowMins >= event.endMinutes ? "completed"
    : "pending"
  );

  const isOngoing = status === "ongoing";
  const isCompleted = status === "completed";

  function handleJoin(e: React.MouseEvent) {
    e.stopPropagation();
    // Join session action
  }

  return (
    <div
      className={cn(
        "absolute overflow-hidden rounded-[10px] border-l-[4px] shadow-sm cursor-pointer",
        tone.box,
        isCompleted && "opacity-60",
      )}
      style={{
        top: topPx + 1,
        height: heightPx - 2,
        left: 2,
        right: 2,
        position: "absolute",
      }}
      onClick={(e) => { e.stopPropagation(); onOpen(event); }}
    >
      <div className="flex h-full items-start gap-1.5 px-2 py-1.5">

        {/* Left: teacher avatar */}
        {event.teacher && tall && (
          <TeacherAvatar name={event.teacher} tone={event.tone} />
        )}

        {/* Center: info */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className={cn("truncate text-xs font-semibold leading-tight", tone.title)}>
            {event.title}
          </p>

          {tall && event.teacher && (
            <p className={cn("truncate text-[10px] leading-none", tone.sub)}>
              {event.teacher}
            </p>
          )}

          {veryTall && (
            <div className="mt-0.5 flex items-center gap-1 flex-wrap">
              <span className={cn("text-[9px] font-medium rounded-full px-1.5 py-0.5 bg-white/60", tone.sub)}>
                {durationMins}m
              </span>
              {event.isTrial ? (
                <span className="text-[9px] font-semibold rounded-full px-1.5 py-0.5 bg-green-100 text-green-700">
                  Trial
                </span>
              ) : event.price !== undefined ? (
                <span className={cn("text-[9px] font-medium rounded-full px-1.5 py-0.5 bg-white/60", tone.sub)}>
                  ₹{event.price}
                </span>
              ) : null}
              {isCompleted && (
                <span className="text-[9px] font-semibold rounded-full px-1.5 py-0.5 bg-gray-200 text-gray-500">
                  Done
                </span>
              )}
              {status === "pending" && (
                <span className="text-[9px] font-semibold rounded-full px-1.5 py-0.5 bg-yellow-100 text-yellow-700">
                  Upcoming
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: join button or status dot */}
        <div className="flex shrink-0 flex-col items-end">
          {isOngoing ? (
            <button
              type="button"
              onClick={handleJoin}
              className="rounded-full bg-green-500 px-2 py-0.5 text-[9px] font-bold text-white shadow hover:bg-green-600 transition-colors animate-pulse"
            >
              Join
            </button>
          ) : (
            <div className={cn(
              "h-1.5 w-1.5 rounded-full mt-1",
              isCompleted ? "bg-gray-400" : "bg-yellow-400",
            )} />
          )}
        </div>
      </div>
    </div>
  );
}
