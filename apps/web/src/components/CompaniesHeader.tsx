import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCompaniesOverview } from "@/lib/parser/companies";

const BackgroundGradients = () => {
  return (
    <>
      {/* Animated aurora mesh gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[80%] h-[140%] bg-linear-to-br from-emerald-400/40 via-emerald-300/20 to-transparent rounded-full blur-[80px] animate-[aurora-shift_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-1/3 -right-1/4 w-[70%] h-[120%] bg-linear-to-tl from-red-400/30 via-rose-300/15 to-transparent rounded-full blur-[90px] animate-[aurora-shift_10s_ease-in-out_infinite_alternate-reverse]" />
        <div className="absolute top-0 left-1/3 w-[50%] h-[80%] bg-linear-to-b from-amber-200/25 via-orange-200/15 to-transparent rounded-full blur-[70px] animate-[aurora-shift_12s_ease-in-out_infinite_alternate]" />
        <div className="absolute -top-1/4 right-0 w-[40%] h-full bg-linear-to-bl from-emerald-200/20 via-teal-300/10 to-transparent rounded-full blur-[100px] animate-[aurora-shift_9s_ease-in-out_infinite_alternate-reverse]" />
      </div>

      {/* Edge fades to background */}
      <div className="absolute inset-0 bg-linear-to-b from-background/30 via-transparent to-background/70" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-b from-transparent to-background" />
    </>
  );
};

export default async function CompaniesHeader() {
  const { firstCompaniesLogos: logos, totalMoreCompanies } =
    await getCompaniesOverview();

  return (
    <section
      className="relative w-full overflow-hidden pt-4 pb-6"
      data-testid="companies-header"
      aria-labelledby="companies-heading"
    >
      <BackgroundGradients />

      <div className="relative z-5 container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto pt-2 pb-0 md:py-6">
          <h1
            id="companies-heading"
            className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]"
          >
            Find your next{" "}
            <span className="bg-linear-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              tech company
            </span>
            <br className="hidden sm:block" /> in{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Portugal</span>
              <span
                className="absolute bottom-1 left-0 right-0 h-3 bg-linear-to-r from-emerald-300/40 to-red-300/30 -rotate-[0.5deg] rounded-sm"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
            The directory for tech companies, startups, and scale-ups in
            Portugal.
          </p>

          {logos.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className="flex -space-x-3">
                {logos.map((logo, i) => (
                  <Avatar
                    key={logo}
                    className="h-9 w-9 border-2 border-background ring-1 ring-border/40"
                    style={{ zIndex: logos.length - i }}
                  >
                    <AvatarImage src={logo} alt="" />
                    <AvatarFallback className="text-xs bg-muted" />
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                and {totalMoreCompanies}+ more
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
