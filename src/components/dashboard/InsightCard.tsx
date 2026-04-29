"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AIInsight } from "@/types/ai";
import { Lightbulb, Star, AlertTriangle, Heart } from "lucide-react";

const TYPE_CONFIG = {
  tip: {
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  insight: {
    icon: Star,
    color: "text-luna-accent",
    bg: "bg-luna-accent/10",
    border: "border-luna-accent/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  encouragement: {
    icon: Heart,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
};

interface InsightCardProps {
  insight: AIInsight;
  className?: string;
}

export function InsightCard({ insight, className }: InsightCardProps) {
  const config = TYPE_CONFIG[insight.type];
  const Icon = config.icon;

  return (
    <Card className={cn("border", config.border, className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg",
              config.bg
            )}
          >
            <Icon className={cn("h-4 w-4", config.color)} />
          </div>
          <p className="text-sm text-luna-text leading-relaxed">
            {insight.content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface PhaseCardProps {
  phase: string;
  dayOfCycle: number;
  daysUntilPeriod: number;
  phaseDescription: string;
  energyLevel: string;
}

export function PhaseCard({
  phase,
  dayOfCycle,
  daysUntilPeriod,
  phaseDescription,
  energyLevel,
}: PhaseCardProps) {
  const phaseEmojis: Record<string, string> = {
    menstrual: "🌑",
    follicular: "🌒",
    ovulatory: "🌕",
    luteal: "🌖",
  };

  const energyColors: Record<string, string> = {
    low: "text-blue-400",
    moderate: "text-green-400",
    high: "text-yellow-400",
    "very-high": "text-orange-400",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-luna-muted uppercase tracking-wider">
            Current Phase
          </CardTitle>
          <span className="text-2xl">{phaseEmojis[phase] || "🌙"}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-luna-text capitalize">
            {phase} Phase
          </h3>
          <p className="text-sm text-luna-muted mt-1">{phaseDescription}</p>
        </div>
        <div className="flex gap-4">
          <div>
            <div className="text-xs text-luna-muted">Day of Cycle</div>
            <div className="text-lg font-bold text-luna-accent">{dayOfCycle}</div>
          </div>
          <div>
            <div className="text-xs text-luna-muted">Days Until Period</div>
            <div className="text-lg font-bold text-luna-text">{daysUntilPeriod}</div>
          </div>
          <div>
            <div className="text-xs text-luna-muted">Energy</div>
            <div
              className={cn(
                "text-sm font-semibold capitalize",
                energyColors[energyLevel] || "text-luna-text"
              )}
            >
              {energyLevel.replace("-", " ")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
