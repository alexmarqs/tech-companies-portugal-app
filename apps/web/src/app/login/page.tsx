import { GithubLogin } from "@/components/GithubLogin";
import { GoogleLogin } from "@/components/GoogleLogin";
import { Container } from "@/components/ui/container";
import {
  APP_URL,
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import Image from "next/image";
import type { Metadata } from "next/types";
import { Suspense } from "react";

const title = "Sign in | Tech Companies Portugal";
const description =
  "Sign in to get weekly updates on new tech companies in Portugal. Access company profiles, discover career opportunities, and manage your preferences.";
const keywords =
  "login, sign in, Portuguese tech community, tech companies Portugal, careers, account access";

export const metadata: Metadata = {
  ...defaultMetadata,
  title,
  description,
  keywords,
  alternates: {
    canonical: `${APP_URL}/login`,
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    ...defaultOpenGraphMetadata,
    title,
    description,
    url: `${APP_URL}/login`,
  },
  twitter: {
    ...defaultTwitterMetadata,
    title,
    description,
  },
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-transparent p-4 py-16">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Container
          variant="static"
          className="overflow-hidden border-primary/15 bg-card p-7 shadow-[0_24px_60px_-36px_oklch(0.3_0.04_40/0.45)]"
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center">
              <Image
                src="/assets/images/logo.svg"
                alt="Tech Companies Portugal Logo"
                width={56}
                height={56}
                className="rounded-2xl shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-2 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Free to join
              </p>
              <h1 className="text-2xl font-bold tracking-[-0.035em]">
                Join Portugal&apos;s tech community
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Get the weekly company digest today—and be first to explore our
                curated jobs experience when it launches.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Suspense fallback={null}>
                <GithubLogin />
                <GoogleLogin />
              </Suspense>
            </div>
          </div>
        </Container>
        <p className="bg-background px-4 text-center text-[11px] text-muted-foreground">
          By signing in, you agree with our{" "}
          <a
            href="/terms"
            target="_blank"
            className="text-primary text-[10px] underline underline-offset-4 hover:opacity-70 transition-opacity"
            rel="noreferrer"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/policy"
            target="_blank"
            className="text-primary text-[10px] underline underline-offset-4 hover:opacity-70 transition-opacity"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
