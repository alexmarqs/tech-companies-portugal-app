import { PlayCircle } from "lucide-react";
import { AnimateNumber } from "./AnimateNumber";

export default function CompaniesHeader() {
  return (
    <section
      className="font-mono relative w-full overflow-hidden py-8 text-center"
      data-testid="companies-header"
    >
      <div className="relative z-[5] px-4 max-w-3xl mx-auto flex flex-col items-center gap-8">
        <div className="flex items-center gap-2 text-red-500 font-semibold">
          <PlayCircle className="h-5 w-5" />

          <span>
            <AnimateNumber end={300} duration={1.5} />+ Tech Companies
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-red-500">The largest</span> directory of tech
            companies in Portugal
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto font-semibold">
            Discover the best tech companies hiring in Portugal, from startups
            to established enterprises, all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}
