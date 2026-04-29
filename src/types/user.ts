import type { UserRow } from "./database";

export type CycleRegularity = "regular" | "irregular" | "uncertain";
export type PrimaryGoal =
  | "track_fertility"
  | "manage_symptoms"
  | "understand_body"
  | "productivity";
export type Realm = "work" | "personal";

export type UserProfile = UserRow;

export type OnboardingFormData = {
  name: string;
  dateOfBirth: string;
  timezone: string;
  city: string;
  cycleLength: number;
  periodDuration: number;
  cycleRegularity: CycleRegularity;
  primaryGoal: PrimaryGoal;
};
