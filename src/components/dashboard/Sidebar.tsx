"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRealm } from "@/contexts/RealmContext";
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  Sparkles,
  BookOpen,
  Moon,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/insights", label: "Insights", icon: TrendingUp },
  { href: "/dashboard/ai", label: "Luna AI", icon: Sparkles },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { realm } = useRealm();

  return (
    <aside className="flex flex-col w-64 min-h-screen border-r border-luna-border bg-luna-surface/30 backdrop-blur-md">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-luna-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-luna-accent/20">
          <Moon className="h-5 w-5 text-luna-accent" />
        </div>
        <div>
          <h1 className="text-base font-bold text-luna-text tracking-tight">
            LunaRhythm
          </h1>
          <p className="text-xs text-luna-muted capitalize">{realm} realm</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-luna-accent/15 text-luna-accent"
                  : "text-luna-muted hover:bg-luna-surface hover:text-luna-text"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-luna-accent" : "text-luna-muted"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <div
          className={cn(
            "px-3 py-3 rounded-lg text-xs",
            realm === "personal"
              ? "bg-luna-personal/30 border border-luna-personal/50"
              : "bg-luna-work/30 border border-luna-work/50"
          )}
        >
          <div className="font-semibold text-luna-text mb-0.5 capitalize">
            {realm} Realm
          </div>
          <div className="text-luna-muted">
            {realm === "personal"
              ? "Wellness & cycle insights"
              : "Productivity & career insights"}
          </div>
        </div>
      </div>
    </aside>
  );
}
