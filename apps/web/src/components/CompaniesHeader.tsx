export default function CompaniesHeader() {
  return (
    <section
      className="font-mono relative w-full overflow-hidden py-8 text-center"
      aria-labelledby="companies-heading"
    >
      <div className="relative z-[5] px-4 max-w-3xl mx-auto flex flex-col items-center gap-8">
        <div className="flex flex-col gap-4">
          <h1
            id="companies-heading"
            className="text-4xl font-bold tracking-tight"
          >
            <span className="bg-orange-100/50 -rotate-1 p-1 shadow-sm inline-block">
              <span className="text-red-500/90">Find top tech companies</span>{" "}
              in Portugal
            </span>
          </h1>

          <p className="text-md text-gray-600 max-w-2xl mx-auto font-semibold">
            Discover the best tech companies hiring in Portugal — from startups
            to established enterprises — all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}
