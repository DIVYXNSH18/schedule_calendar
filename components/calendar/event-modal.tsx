"use client";

import { CalendarDays, CalendarX, Clock, RefreshCw, Trash2, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { EventDraft } from "@/components/calendar/types";
import { humanTimeRange, parseDateKey, timeFromMinutes, minutesFromTime } from "@/lib/date-utils";
import { useTimezone } from "@/components/calendar/timezone-context";
import { cn } from "@/lib/utils";

type EventModalProps = {
  draft: EventDraft | null;
  onClose: () => void;
  onSave: (draft: EventDraft) => void;
  onDelete: (id: string) => void;
};

const toneAccent: Record<string, { bar: string; chip: string; chipText: string }> = {
  blue:   { bar: "bg-blue-500",   chip: "bg-blue-50",   chipText: "text-blue-700" },
  teal:   { bar: "bg-teal-500",   chip: "bg-teal-50",   chipText: "text-teal-700" },
  violet: { bar: "bg-violet-500", chip: "bg-violet-50", chipText: "text-violet-700" },
  amber:  { bar: "bg-amber-400",  chip: "bg-amber-50",  chipText: "text-amber-700" },
  rose:   { bar: "bg-rose-500",   chip: "bg-rose-50",   chipText: "text-rose-700" },
};

const SUBJECT_CATEGORY: Record<string, string> = {
  // Sciences
  biology: "Science", physics: "Science", chemistry: "Science",
  science: "Science", "computer science": "Coding", cs: "Coding",
  // Maths
  mathematics: "Mathematics", maths: "Mathematics", math: "Mathematics", algebra: "Mathematics",
  geometry: "Mathematics", calculus: "Mathematics", statistics: "Mathematics",
  // Languages
  english: "Language", hindi: "Language", french: "Language", spanish: "Language",
  german: "Language", arabic: "Language", sanskrit: "Language", urdu: "Language",
  "english literature": "Language",
  // Humanities
  history: "Humanities", geography: "Humanities", civics: "Humanities",
  economics: "Humanities", sociology: "Humanities", psychology: "Humanities",
  "political science": "Humanities",
  // Coding / Tech
  html: "Coding", css: "Coding", javascript: "Coding", python: "Coding",
  programming: "Coding", coding: "Coding", "web development": "Coding",
  // Arts
  art: "Arts", "art & craft": "Arts", music: "Arts", dance: "Arts",
  drawing: "Arts", painting: "Arts",
  // PE
  pe: "Physical Ed", "physical education": "Physical Ed", sports: "Physical Ed",
  yoga: "Physical Ed", gym: "Physical Ed",
};

function getCategory(subject?: string): string {
  if (!subject) return "Class";
  return SUBJECT_CATEGORY[subject.toLowerCase()] ?? "Subject";
}

export function EventModal({ draft, onClose, onSave, onDelete }: EventModalProps) {
  const { timezone } = useTimezone();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  useEffect(() => {
    if (draft) {
      setNewDate(draft.date);
      setNewStart(timeFromMinutes(draft.startMinutes));
      setNewEnd(timeFromMinutes(draft.endMinutes));
    }
    setRescheduleOpen(false);
    setCancelOpen(false);
  }, [draft]);

  useEffect(() => {
    function onEscape(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [onClose]);

  if (!draft) return null;

  const accent = toneAccent[draft.tone] ?? toneAccent.blue;

  const classDate = parseDateKey(draft.date);
  const classStart = new Date(classDate);
  classStart.setHours(Math.floor(draft.startMinutes / 60), draft.startMinutes % 60, 0, 0);
  const nowInTz = new Date(new Date().toLocaleString("en-US", { timeZone: timezone.label }));
  const tooLate = (classStart.getTime() - nowInTz.getTime()) / (1000 * 60 * 60) <= 3;

  const timeStr = draft.allDay ? "All day" : humanTimeRange(draft.startMinutes, draft.endMinutes);
  const durationMins = draft.endMinutes - draft.startMinutes;
  const durationStr = `${Math.floor(durationMins / 60)}h${durationMins % 60 ? ` ${durationMins % 60}m` : ""}`;
  const dateStr = classDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  function handleReschedule() {
    if (!draft) return;
    onSave({ ...draft, date: newDate, startMinutes: minutesFromTime(newStart), endMinutes: minutesFromTime(newEnd) });
    onClose();
  }

  function handleCancelSession() {
    if (draft?.id) onDelete(draft.id);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md overflow-hidden sm:rounded-[28px] rounded-t-[28px] shadow-2xl flex flex-col"
        style={{ background: "#FFFBFE" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MD3 top colour strip */}
        <div className={cn("h-1 w-full shrink-0", accent.bar)} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-1">
          <div className="flex-1 min-w-0 pr-4">
            {/* Subject chip */}
            {draft.subject && (
              <span className={cn("inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium mb-2", accent.chip, accent.chipText)}>
                {getCategory(draft.subject)}
              </span>
            )}
            {/* Title — MD3 headline-small */}
            <h2 className="text-[22px] font-semibold leading-snug text-gray-900 tracking-tight">
              {draft.title}
            </h2>
            {/* Duration — MD3 body-medium */}
            <p className="mt-0.5 text-sm text-gray-500">{durationStr}</p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0 mt-1">
            {draft.id && (
              <button type="button" onClick={() => onDelete(draft.id!)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors" aria-label="Delete">
                <Trash2 className="h-[18px] w-[18px]" />
              </button>
            )}
            <button type="button" onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors" aria-label="Close">
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 mt-4 h-px bg-gray-100" />

        {/* Details — MD3 list items */}
        <div className="px-6 py-4 space-y-0">

          {/* Teacher */}
          {draft.teacher && (
            <div className="flex items-center gap-4 py-3">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold", accent.chip, accent.chipText)}>
                {draft.teacher.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Teacher</p>
                <p className="text-sm font-medium text-gray-900 truncate">{draft.teacher}</p>
              </div>
              <button type="button"
                onClick={() => window.open(`/teacher/${encodeURIComponent(draft.teacher!)}`, "_blank")}
                className={cn("text-xs font-semibold shrink-0 transition-colors", accent.chipText, "hover:opacity-70")}>
                See Profile
              </button>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <CalendarDays className="h-[18px] w-[18px] text-gray-500" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Date</p>
              <p className="text-sm font-medium text-gray-900">{dateStr}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <Clock className="h-[18px] w-[18px] text-gray-500" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Time · {timezone.offset}</p>
              <p className="text-sm font-medium text-gray-900">{timeStr}</p>
            </div>
          </div>

          {draft.description && (
            <div className="flex items-start gap-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <User className="h-[18px] w-[18px] text-gray-500" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pt-2">{draft.description}</p>
            </div>
          )}
        </div>

        {/* MD3 divider */}
        <div className="mx-6 h-px bg-gray-100" />

        {/* Actions */}
        <div className="px-6 py-4 space-y-2">

          {tooLate && (
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-400 mb-1">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>Changes unavailable — less than 3 hours before class.</span>
            </div>
          )}

          {/* Reschedule button — MD3 tonal button */}
          <button
            type="button"
            disabled={tooLate}
            onClick={() => { if (!tooLate) { setRescheduleOpen((v) => !v); setCancelOpen(false); } }}
            className={cn(
              "flex w-full items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-all text-left",
              tooLate
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-[#E8F0FE] text-[#1a56db] hover:bg-[#d2e3fc]",
            )}
          >
            <RefreshCw className="h-4 w-4 shrink-0" />
            <span className="flex-1">Reschedule Class</span>
            {!tooLate && (
              <span className="text-[10px] opacity-60">{rescheduleOpen ? "▲" : "▼"}</span>
            )}
          </button>

          {/* Reschedule form */}
          {rescheduleOpen && !tooLate && (
            <div className="rounded-2xl bg-[#F8FAFF] border border-[#E8F0FE] px-4 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="col-span-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  New Date
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1a56db] normal-case font-normal" />
                </label>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Start
                  <input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1a56db] normal-case font-normal" />
                </label>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  End
                  <input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1a56db] normal-case font-normal" />
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setRescheduleOpen(false)}
                  className="rounded-full px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={handleReschedule}
                  className="rounded-full bg-[#1a56db] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  Confirm
                </button>
              </div>
            </div>
          )}

          {/* Cancel Session — MD3 tonal button (error) */}
          <button
            type="button"
            disabled={tooLate}
            onClick={() => { if (!tooLate) { setCancelOpen((v) => !v); setRescheduleOpen(false); } }}
            className={cn(
              "flex w-full items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-all text-left",
              tooLate
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-[#FEE8E8] text-[#c0392b] hover:bg-[#fdd5d5]",
            )}
          >
            <CalendarX className="h-4 w-4 shrink-0" />
            <span className="flex-1">Cancel Session</span>
            {!tooLate && (
              <span className="text-[10px] opacity-60">{cancelOpen ? "▲" : "▼"}</span>
            )}
          </button>

          {/* Cancel confirm */}
          {cancelOpen && !tooLate && (
            <div className="rounded-2xl bg-[#FFF8F8] border border-[#FEE8E8] px-4 py-4 space-y-2">
              <p className="text-sm font-semibold text-[#c0392b]">Cancel this session?</p>
              <p className="text-xs text-gray-500 leading-relaxed">This will permanently remove the class from your schedule.</p>
              <textarea
                placeholder="Reason for cancellation (optional)"
                rows={3}
                className="w-full resize-none rounded-xl border border-[#FEE8E8] bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#c0392b] placeholder:text-gray-400"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCancelOpen(false)}
                  className="rounded-full px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Go Back
                </button>
                <button type="button" onClick={() => setConfirmCancel(true)}
                  className="rounded-full bg-[#c0392b] px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
                  Yes, Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom safe area */}
        <div className="pb-2" />
      </div>

      {/* Final cancel confirmation dialog */}
      {confirmCancel && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-[28px]"
          onClick={() => setConfirmCancel(false)}
        >
          <div
            className="mx-4 w-full max-w-xs overflow-hidden rounded-[24px] shadow-2xl"
            style={{ background: "#FFFBFE" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4">
              <p className="text-base font-semibold text-gray-900">Cancel this session?</p>
              <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                Are you sure you want to cancel <span className="font-medium text-gray-800">{draft.title}</span>? This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-3">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="rounded-full px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleCancelSession}
                className="rounded-full bg-[#c0392b] px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
