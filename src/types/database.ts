export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          date_of_birth: string | null;
          timezone: string;
          city: string | null;
          cycle_length: number;
          period_duration: number;
          cycle_regularity: "regular" | "irregular" | "uncertain" | null;
          primary_goal:
            | "track_fertility"
            | "manage_symptoms"
            | "understand_body"
            | "productivity"
            | null;
          current_realm: "work" | "personal";
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          date_of_birth?: string | null;
          timezone?: string;
          city?: string | null;
          cycle_length?: number;
          period_duration?: number;
          cycle_regularity?: "regular" | "irregular" | "uncertain" | null;
          primary_goal?:
            | "track_fertility"
            | "manage_symptoms"
            | "understand_body"
            | "productivity"
            | null;
          current_realm?: "work" | "personal";
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          date_of_birth?: string | null;
          timezone?: string;
          city?: string | null;
          cycle_length?: number;
          period_duration?: number;
          cycle_regularity?: "regular" | "irregular" | "uncertain" | null;
          primary_goal?:
            | "track_fertility"
            | "manage_symptoms"
            | "understand_body"
            | "productivity"
            | null;
          current_realm?: "work" | "personal";
          onboarding_completed?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      cycle_regularity: "regular" | "irregular" | "uncertain";
      primary_goal:
        | "track_fertility"
        | "manage_symptoms"
        | "understand_body"
        | "productivity";
      realm: "work" | "personal";
    };
  };
};

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
