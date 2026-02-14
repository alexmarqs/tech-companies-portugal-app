import { LogIn, Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const CtaBannerBackground = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
    </>
  );
};
export default function CtaBanner() {
  return (
    <section className="container mx-auto flex w-full max-w-6xl px-4 py-2">
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-12 md:px-14 md:py-14">
        <CtaBannerBackground />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-lg">
            <div className="flex items-center gap-2">
              <Rocket size={14} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Job listings and more on the way.
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              We're building new features to connect talent with Portugal's top
              tech companies — job boards, event listings, and more. Be the
              first to know when they launch.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="bg-emerald-500 text-white hover:bg-emerald-400 border-none font-semibold shadow-lg shrink-0"
            asChild
          >
            <Link href="/settings">
              <LogIn size={16} className="mr-2" />
              Sign in for updates
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
