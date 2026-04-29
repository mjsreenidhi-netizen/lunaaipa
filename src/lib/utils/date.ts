import type { CyclePhase } from "@/types/ai";

export function calculateCyclePhase(
  dayOfCycle: number,
  cycleLength: number = 28,
  periodDuration: number = 5
): CyclePhase {
  if (dayOfCycle <= periodDuration) return "menstrual";
  if (dayOfCycle <= Math.floor(cycleLength * 0.43)) return "follicular";
  if (dayOfCycle <= Math.floor(cycleLength * 0.57)) return "ovulatory";
  return "luteal";
}

export function getDayOfCycle(
  lastPeriodDate: Date,
  cycleLength: number = 28
): number {
  const today = new Date();
  const diffTime = today.getTime() - lastPeriodDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays % cycleLength) + 1;
}

export function getDaysUntilNextPeriod(
  dayOfCycle: number,
  cycleLength: number = 28
): number {
  return cycleLength - dayOfCycle + 1;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}
