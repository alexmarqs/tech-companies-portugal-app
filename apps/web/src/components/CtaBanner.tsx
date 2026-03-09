import { PUBLIC_CONTACT_EMAIL } from "@/lib/utils";
import { Mail, Rocket } from "lucide-react";
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
    <section className="container mx-auto flex w-full max-w-6xl px-4 py-5">
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 px-8 md:px-14 py-10">
        <CtaBannerBackground />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-lg">
            <div className="flex items-center gap-2">
              <Rocket size={14} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                Sponsors
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Want more visibility for your company?
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Get featured placement, your logo on the homepage, and priority
              visibility to a growing audience of tech professionals.
            </p>
          </div>
          <Button
            size="lg"
            className="shrink-0 px-3 bg-emerald-500 text-white hover:bg-emerald-600"
            asChild
          >
            <a href={`mailto:${PUBLIC_CONTACT_EMAIL}`}>
              <Mail size={14} className="mr-1.5" />
              Become a Sponsor
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
