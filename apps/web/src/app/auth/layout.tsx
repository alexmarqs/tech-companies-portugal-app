import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Authentication - Tech Companies Portugal",
  description: "Sign in or sign up to access your account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}