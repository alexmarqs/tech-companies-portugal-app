export default function CompaniesHeader() {
  return (
    <section
      className="font-mono relative w-full overflow-hidden pt-6 pb-4 text-center"
      data-testid="companies-header"
      aria-labelledby="companies-heading"
    >
      <div className="relative z-[5] px-4 max-w-3xl mx-auto flex flex-col items-center gap-6">
        <div className="flex flex-col">
          <h1
            id="companies-heading"
            className="text-4xl font-bold tracking-tight"
          >
            <span className="bg-orange-100/50 -rotate-1 p-1 shadow-sm inline-block">
              <span className="text-red-500/90">Find top tech companies</span>{" "}
              in Portugal
            </span>
          </h1>
        </div>
        <p className="bg-white/50 p-2 rounded-md text-md text-gray-600 max-w-2xl mx-auto font-semibold leading-relaxed">
          Discover the best tech companies hiring in Portugal — from startups to
          established enterprises — all in one place
        </p>
      </div>
    </section>
  );
}
