"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Realm } from "@/types/realm";
import { createClient } from "@/lib/supabase/client";

interface RealmContextValue {
  realm: Realm;
  setRealm: (realm: Realm) => Promise<void>;
  isChanging: boolean;
}

const RealmContext = createContext<RealmContextValue | null>(null);

export function RealmProvider({
  children,
  initialRealm = "personal",
  userId,
}: {
  children: ReactNode;
  initialRealm?: Realm;
  userId: string;
}) {
  const [realm, setRealmState] = useState<Realm>(initialRealm);
  const [isChanging, setIsChanging] = useState(false);

  const setRealm = useCallback(
    async (newRealm: Realm) => {
      setIsChanging(true);
      setRealmState(newRealm);

      try {
        const supabase = createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("users")
          .update({ current_realm: newRealm, updated_at: new Date().toISOString() })
          .eq("id", userId);
      } catch (error) {
        console.error("Failed to persist realm change:", error);
      } finally {
        setIsChanging(false);
      }
    },
    [userId]
  );

  return (
    <RealmContext.Provider value={{ realm, setRealm, isChanging }}>
      {children}
    </RealmContext.Provider>
  );
}

export function useRealm(): RealmContextValue {
  const context = useContext(RealmContext);
  if (!context) {
    throw new Error("useRealm must be used within a RealmProvider");
  }
  return context;
}
