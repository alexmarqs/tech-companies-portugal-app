import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

interface UseSessionReturn {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isSigningOut: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

export const useSession = (): UseSessionReturn => {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setError(null);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        console.error("Error fetching session:", sessionError);
      } else {
        setSession(session);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Unexpected error fetching session:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError.message);
        throw signOutError;
      }

      // Session will be cleared by the auth state listener
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign out";
      setError(errorMessage);
      throw err;
    } finally {
      setIsSigningOut(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setIsLoading(false);

        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          setError(null);
        }

        if (event === "SIGNED_OUT") {
          setError(null);
        }
      },
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchSession]);

  return {
    session,
    user: session?.user ?? null,
    isLoading,
    isSigningOut,
    error,
    signOut,
  };
};
