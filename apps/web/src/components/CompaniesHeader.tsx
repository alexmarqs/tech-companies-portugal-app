import Image from "next/image";
import bgHeader from "../../public/assets/images/bg-header.webp";
import { AnimatedCompaniesFeatures } from "./AnimatedCompaniesFeatures";

export default function CompaniesHeader() {
  return (
    <section
      className="relative w-full overflow-hidden py-12 text-center"
      data-testid="companies-header"
    >
      <div className="absolute inset-0 z-0 bg-background">
        <Image
          src={bgHeader}
          fill
          quality={50}
          className="object-cover object-center opacity-50"
          priority
          placeholder="blur"
          alt="Background Tech Companies in Portugal"
        />
      </div>

      <div className="relative z-[5] px-1 max-w-5xl mx-auto flex flex-col items-center gap-6">
        <h1 className="font-mono font-bold text-3xl md:text-4xl">
          Discover Leading Tech Companies in Portugal 🇵🇹
        </h1>
        <AnimatedCompaniesFeatures />
      </div>
    </section>
  );
}
