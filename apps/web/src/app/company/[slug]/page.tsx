import { Categories, Locations } from "@/components/CompanyItem";
import { CopyUrlButton } from "@/components/CopyUrlButton";
import { Button } from "@/components/ui/button";
import { RetroContainer } from "@/components/ui/retro-container";
import {
  APP_URL,
  defaultMetadata,
  defaultOpenGraphMetadata,
  defaultTwitterMetadata,
} from "@/lib/metadata";
import {
  getParsedCompaniesData,
  getParsedCompanyBySlug,
} from "@/lib/parser/companies";
import type { NextParams } from "@/lib/types";
import { Briefcase, Globe } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

// force generation on demand for paths not known at build time
// export const dynamicParams = true;

export async function generateStaticParams() {
  const companies = await getParsedCompaniesData();

  return companies.companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: NextParams<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;

  const company = await getParsedCompanyBySlug(slug);

  if (!company) {
    return;
  }

  const title = `${company.name} | Leading Tech Company in Portugal - Profile & Careers`;
  const description = company.description;
  const keywords = `${company.name}, Tech Company, Careers, Portugal`;

  const metadata: Metadata = {
    ...defaultMetadata,
    title,
    description,
    keywords,
    alternates: {
      canonical: `${APP_URL}/company/${slug}`,
    },
    openGraph: {
      ...defaultOpenGraphMetadata,
      title,
      description,
      url: `${APP_URL}/company/${slug}`,
      images: [`api/og?title=${company.name}&description=${description}`],
    },
    twitter: {
      ...defaultTwitterMetadata,
      title,
      description,
      images: [`api/og?title=${company.name}&description=${description}`],
    },
  };

  return metadata;
}

export default async function CompanyPage({
  params,
}: {
  params: NextParams<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await getParsedCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center p-3">
      <RetroContainer variant="static" className="flex-1 space-y-8 px-6 py-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl">{company.name}</h1>
            <CopyUrlButton />
          </div>
          <div className="flex flex-wrap items-center justify-start gap-4">
            <Locations locations={company.locations} />
            <Categories categories={company.categories} />
          </div>
        </div>
        <p className="tracking-wide text-muted-foreground">
          {company.description}
        </p>
        <div className="flex flex-wrap items-center justify-start gap-3">
          <LinkUrlButton
            url={company.websiteUrl}
            icon={<Globe size={14} />}
            label="Website"
          />

          <LinkUrlButton
            url={company.careersUrl}
            icon={<Briefcase size={14} />}
            label="Careers"
          />
          <LinkUrlButton
            url={company.githubUrl}
            icon={
              <svg aria-hidden="true" className="h-6 w-4" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
            }
            label="GitHub"
          />
        </div>
      </RetroContainer>
    </div>
  );
}

const LinkUrlButton = ({
  url,
  icon,
  label,
}: {
  url?: string;
  icon: React.ReactNode;
  label: string;
}) => {
  if (!url) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      className="h-8 px-2 text-xs text-foreground"
      asChild
    >
      <a href={url} target="_blank" rel="noreferrer noopener">
        <div className="flex items-center gap-1">
          {icon}
          {label}
        </div>
      </a>
    </Button>
  );
};
