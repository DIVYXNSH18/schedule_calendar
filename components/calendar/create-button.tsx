"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GooglePlusIcon } from "@/components/calendar/google-plus";

type CreateButtonProps = {
  onCreate: (type: "event" | "task") => void;
};

export function CreateButton({ onCreate }: CreateButtonProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  return (
    <div className="relative py-4" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="m3-pressable m3-focus-ring flex items-center gap-3 rounded-[28px] bg-white py-4 pl-4 pr-6 font-semibold shadow-create hover:shadow-create-hover"
      >
        <GooglePlusIcon />
        <span className="text-sm text-gray-800">Create</span>
        <ChevronDown className="ml-1 h-4 w-4 text-calendar-primary" aria-hidden="true" />
      </button>

      {open ? (
        <div className="m3-container animate-m3-enter absolute left-0 top-20 z-50 w-52 rounded-[24px] py-2 shadow-m3-lifted">
          {(["Event", "Task"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setOpen(false);
                onCreate(item.toLowerCase() as "event" | "task");
              }}
              className="mx-2 block w-[calc(100%-1rem)] rounded-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-calendar-surface-container"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
