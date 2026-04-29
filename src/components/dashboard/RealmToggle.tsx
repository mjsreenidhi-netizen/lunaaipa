"use client";

import { useRealm } from "@/contexts/RealmContext";
import { cn } from "@/lib/utils";
import { Briefcase, Moon } from "lucide-react";

export function RealmToggle() {
  const { realm, setRealm, isChanging } = useRealm();

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl border border-luna-border bg-luna-bg/50 backdrop-blur-sm",
        isChanging && "opacity-70 pointer-events-none"
      )}
    >
      <button
        type="button"
        onClick={() => setRealm("personal")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
          realm === "personal"
            ? "bg-luna-personal text-luna-text shadow-sm"
            : "text-luna-muted hover:text-luna-text"
        )}
        aria-pressed={realm === "personal"}
        aria-label="Switch to Personal realm"
      >
        <Moon className="h-4 w-4" />
        <span className="hidden sm:inline">Personal</span>
      </button>

      <button
        type="button"
        onClick={() => setRealm("work")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
          realm === "work"
            ? "bg-luna-work text-luna-text shadow-sm"
            : "text-luna-muted hover:text-luna-text"
        )}
        aria-pressed={realm === "work"}
        aria-label="Switch to Work realm"
      >
        <Briefcase className="h-4 w-4" />
        <span className="hidden sm:inline">Work</span>
      </button>
    </div>
  );
}
