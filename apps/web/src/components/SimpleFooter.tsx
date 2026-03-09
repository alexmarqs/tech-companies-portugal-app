import { Credits } from "./Credits";
import { LogoFooter } from "./LogoFooter";

export default function SimpleFooter() {
  return (
    <footer className="bg-card border-t border-border/60">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
        <div className="w-full flex flex-col md:flex-row md:justify-between items-center flex-wrap gap-4">
          <LogoFooter onlyLogo />
          <Credits />
        </div>
      </div>
    </footer>
  );
}
