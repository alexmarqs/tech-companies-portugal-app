"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

import { Loader2 } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import { Button } from "./ui/button";

export const GithubLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGithubLogin = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          scopes: "read:user user:email",
        },
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
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
