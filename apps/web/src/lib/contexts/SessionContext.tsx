"use client";

import { createClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface SessionContextValue {
  session: Session | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export function SessionProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // we could just get session here we want to listen for auth changes for automatically updating the session.

    // Listen for auth changes - this will fire INITIAL_SESSION immediately
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);

      // Only set loading to false after we get the initial session
      if (event === "INITIAL_SESSION") {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const value: SessionContextValue = {
    session,
    userId: session?.user?.id ?? null,
    isAuthenticated: !!session,
    isLoading,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
