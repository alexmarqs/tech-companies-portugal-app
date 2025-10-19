import { GithubLogin } from "@/components/GithubLogin";
import { GoogleLogin } from "@/components/GoogleLogin";
import { RetroContainer } from "@/components/ui/retro-container";
import {
  APP_URL,
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import Image from "next/image";
import type { Metadata } from "next/types";
import logo from "../../../public/assets/images/logo.png";

const title = "Login | Tech Companies Portugal";
const description =
  "Sign in to your account and join the Portuguese tech community. Access company profiles, discover career opportunities, and stay updated with the latest tech companies in Portugal.";
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
  openGraph: {
    ...defaultOpenGraphMetadata,
    title,
    description,
    url: `${APP_URL}/login`,
    images: [`api/og?title=${title}&description=${description}`],
  },
  twitter: {
    ...defaultTwitterMetadata,
    title,
    description,
    images: [`api/og?title=${title}&description=${description}`],
  },
};

export default function LoginPage() {
  return (
    <div className="bg-transparent flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <RetroContainer className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Image
                src={logo}
                alt="Tech Companies Portugal Logo"
                width={50}
                height={50}
              />
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">
                Join the community and be up to date with the latest tech
                companies in Portugal.
              </p>
            </div>

            <div className="space-y-3">
              <GithubLogin />
              <GoogleLogin />
            </div>
          </div>
        </RetroContainer>
      </div>
    </div>
  );
}
