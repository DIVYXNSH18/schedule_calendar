import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  className?: string;
  onClick?: () => void;
};

export function IconButton({ icon: Icon, label, className, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "m3-icon-button m3-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-calendar-primary-container hover:text-calendar-primary",
        className,
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
