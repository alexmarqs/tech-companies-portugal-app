"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Loader2 } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import { Button } from "./ui/button";

export const GoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      const next = searchParams.get("next");
      const redirectTo = next
        ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`
        : `${window.location.origin}/api/auth/callback`;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          scopes: "openid email profile",
        },
      });
      // On success, user will be redirected, so no need to reset loading state
    } catch (error) {
      // Reset loading state immediately on error for better UX
      setIsLoading(false);
      console.error("Google OAuth error:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <SocialIcons icon="google" className="mr-2" />
      )}
      Continue with Google
    </Button>
  );
};
