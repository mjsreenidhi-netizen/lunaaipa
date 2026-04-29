export type Realm = "work" | "personal";

export interface RealmConfig {
  id: Realm;
  label: string;
  description: string;
  icon: string;
  accentColor: string;
  bgGradient: string;
}

export const REALM_CONFIGS: Record<Realm, RealmConfig> = {
  work: {
    id: "work",
    label: "Work",
    description: "Productivity & career insights",
    icon: "briefcase",
    accentColor: "#a5b4fc",
    bgGradient: "from-indigo-950 via-slate-900 to-indigo-950",
  },
  personal: {
    id: "personal",
    label: "Personal",
    description: "Wellness & cycle insights",
    icon: "moon",
    accentColor: "#f0abfc",
    bgGradient: "from-purple-950 via-slate-900 to-rose-950",
  },
};
