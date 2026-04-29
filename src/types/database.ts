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
      quests: {
        Row: {
          id: string;
          user_id: string;
          realm: "work" | "personal";
          title: string;
          energy: string;
          completed: boolean;
          phase: string;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          realm?: "work" | "personal";
          title: string;
          energy?: string;
          completed?: boolean;
          phase?: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          realm?: "work" | "personal";
          title?: string;
          energy?: string;
          completed?: boolean;
          phase?: string;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          mood: number;
          energy: number;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood?: number;
          energy?: number;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: number;
          energy?: number;
          content?: string;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          content?: string;
          type?: string;
          created_at?: string;
        };
      };
      period_logs: {
        Row: {
          id: string;
          user_id: string;
          start_date: string;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_date: string;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
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
