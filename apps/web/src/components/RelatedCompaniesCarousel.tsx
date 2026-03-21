import type { Company } from "@/lib/types";
import CompanyItem from "./CompanyItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type RelatedCompaniesCarouselProps = {
  relatedCompanies: Company[];
  title?: string;
  hidePagination?: boolean;
};

export function RelatedCompaniesCarousel({
  relatedCompanies,
  title,
  hidePagination = false,
}: RelatedCompaniesCarouselProps) {
  if (relatedCompanies.length === 0) return null;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: relatedCompanies.length > 3,
      }}
      className="w-full flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        {title && <h2 className="text-base font-bold">{title}</h2>}
        {!hidePagination && relatedCompanies.length > 2 && (
          <div className="hidden md:inline-flex items-center gap-2">
            <CarouselPrevious className="static translate-x-0 translate-y-0 disabled:opacity-40" />
            <CarouselNext className="static translate-x-0 translate-y-0 disabled:opacity-40" />
          </div>
        )}
      </div>

      <div className="relative">
        <CarouselContent className="-ml-3 items-stretch">
          {relatedCompanies.map((company) => (
            <CarouselItem
              key={company.slug}
              className="pl-3 basis-[85%] md:basis-1/2 lg:basis-[36%] py-2"
            >
              <CompanyItem
                company={company}
                className="h-full"
                hideViewProfile
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-background to-transparent" />
      </div>
    </Carousel>
  );
}
