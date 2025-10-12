"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

import { Loader2 } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import { Button } from "./ui/button";

export const GoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          scopes: "openid email profile",
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
