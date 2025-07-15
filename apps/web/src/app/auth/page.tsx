"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RetroContainer } from "@/components/ui/retro-container";
import { useAuth } from "@/components/hooks/useAuth";

export default function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isSignIn) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");
    
    try {
      if (isSignIn) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setErrors({ general: error.message });
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          setErrors({ general: error.message });
        } else {
          setSuccessMessage("Check your email for a confirmation link!");
        }
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
      <div className="absolute top-4 left-4">
        <Button asChild variant="ghost" className="font-mono">
          <Link href="/">
            ← Back to Home
          </Link>
        </Button>
      </div>
      <RetroContainer variant="default" className="w-full max-w-md p-8">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-mono font-bold">
              {isSignIn ? "Sign In" : "Sign Up"}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isSignIn 
                ? "Welcome back! Sign in to your account" 
                : "Create a new account to get started"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {errors.general && (
              <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {errors.general}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isSignIn}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              
              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isSignIn}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full font-mono" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isSignIn ? "Signing In..." : "Signing Up..."}
                  </div>
                ) : (
                  isSignIn ? "Sign In" : "Sign Up"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignIn(!isSignIn);
                    setFormData({ email: "", password: "", confirmPassword: "", name: "" });
                    setErrors({});
                    setSuccessMessage("");
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  {isSignIn ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
            
            {isSignIn && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.email) {
                      setErrors({ general: "Please enter your email address first" });
                      return;
                    }
                    setIsLoading(true);
                    const { error } = await resetPassword(formData.email);
                    if (error) {
                      setErrors({ general: error.message });
                    } else {
                      setSuccessMessage("Password reset email sent! Check your inbox.");
                    }
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline disabled:opacity-50"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </RetroContainer>
    </div>
  );
}