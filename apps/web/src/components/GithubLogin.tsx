"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Loader2 } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import { Button } from "./ui/button";

export const GithubLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleGithubLogin = async () => {
    setIsLoading(true);

    try {
      const next = searchParams.get("next");
      const redirectTo = next
        ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`
        : `${window.location.origin}/api/auth/callback`;

      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo,
          scopes: "read:user user:email",
        },
      });
      // On success, user will be redirected, so no need to reset loading state
    } catch (error) {
      // Reset loading state immediately on error for better UX
      setIsLoading(false);
      console.error("GitHub OAuth error:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGithubLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <SocialIcons icon="github" className="mr-2" />
      )}
      Continue with GitHub
    </Button>
  );
};
