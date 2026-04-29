import type { Realm } from "./realm";

export type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";

export interface AIInsight {
  id: string;
  content: string;
  type: "tip" | "insight" | "warning" | "encouragement";
  phase?: CyclePhase;
  realm?: Realm;
}

export interface AIResponse {
  content: string;
  cyclePhase?: CyclePhase;
  recommendations?: string[];
  insights?: AIInsight[];
}

export interface AICycleAnalysis {
  currentPhase: CyclePhase;
  dayOfCycle: number;
  daysUntilNextPeriod: number;
  phaseDescription: string;
  energyLevel: "low" | "moderate" | "high" | "very-high";
  recommendations: string[];
}

export interface AIServiceInterface {
  analyzeCycleData(userData: {
    cycleLength: number;
    periodDuration: number;
    lastPeriodDate?: string;
  }): Promise<AICycleAnalysis>;
  getDailyInsights(userId: string, realm: Realm): Promise<AIInsight[]>;
  generateProductivityTips(phase: CyclePhase): Promise<string[]>;
  generateWellnessTips(phase: CyclePhase): Promise<string[]>;
}
