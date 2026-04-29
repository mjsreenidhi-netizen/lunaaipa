"use client";

import { useRealm } from "@/contexts/RealmContext";
import { InsightCard, PhaseCard } from "@/components/dashboard/InsightCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AICycleAnalysis, AIInsight } from "@/types/ai";
import type { UserRow } from "@/types/database";
import type { Realm } from "@/types/realm";
import { Briefcase, Moon, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  profile: UserRow;
  cycleAnalysis: AICycleAnalysis;
  insights: AIInsight[];
  realm: Realm;
}

export function DashboardContent({
  profile,
  cycleAnalysis,
  insights,
  realm: initialRealm,
}: DashboardContentProps) {
  const { realm } = useRealm();
  const displayRealm = realm || initialRealm;

  const greeting = getGreeting();
  const firstName = profile.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-luna-text">
            {greeting}, {firstName} ✨
          </h1>
          <p className="text-luna-muted text-sm mt-1">
            Here&apos;s your {displayRealm} overview for today
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
            displayRealm === "personal"
              ? "bg-luna-personal/10 border-luna-personal/30 text-purple-300"
              : "bg-luna-work/10 border-luna-work/30 text-indigo-300"
          )}
        >
          {displayRealm === "personal" ? (
            <Moon className="h-3 w-3" />
          ) : (
            <Briefcase className="h-3 w-3" />
          )}
          <span className="capitalize">{displayRealm} Realm</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PhaseCard
          phase={cycleAnalysis.currentPhase}
          dayOfCycle={cycleAnalysis.dayOfCycle}
          daysUntilPeriod={cycleAnalysis.daysUntilNextPeriod}
          phaseDescription={cycleAnalysis.phaseDescription}
          energyLevel={cycleAnalysis.energyLevel}
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-luna-muted uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Today&apos;s Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cycleAnalysis.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-luna-accent mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-luna-text">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-luna-muted uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Luna AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-luna-muted">
              {displayRealm === "personal"
                ? `You're in your ${cycleAnalysis.currentPhase} phase. ${cycleAnalysis.phaseDescription}`
                : `Your ${cycleAnalysis.currentPhase} phase naturally supports ${cycleAnalysis.energyLevel.replace("-", " ")} energy for work tasks.`}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-luna-accent">
              <Sparkles className="h-3 w-3" />
              <span>AI insights powered by mock service</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-luna-muted uppercase tracking-wider">
          Daily Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-luna-border bg-luna-surface/30 p-5">
        <h3 className="text-sm font-semibold text-luna-text mb-1">
          About Your Profile
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
          <div>
            <div className="text-xs text-luna-muted">Cycle Length</div>
            <div className="text-lg font-bold text-luna-accent">
              {profile.cycle_length}d
            </div>
          </div>
          <div>
            <div className="text-xs text-luna-muted">Period Duration</div>
            <div className="text-lg font-bold text-luna-text">
              {profile.period_duration}d
            </div>
          </div>
          <div>
            <div className="text-xs text-luna-muted">Regularity</div>
            <div className="text-sm font-semibold text-luna-text capitalize">
              {profile.cycle_regularity || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-luna-muted">Primary Goal</div>
            <div className="text-sm font-semibold text-luna-text capitalize">
              {profile.primary_goal?.replace(/_/g, " ") || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
