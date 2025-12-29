import { Credits } from "./Credits";
import { LogoFooter } from "./LogoFooter";

export default function SimpleFooter() {
  return (
    <footer className="bg-background font-mono">
      <div className="container flex flex-col gap-4 p-3">
        <div className="w-full flex flex-col md:flex-row md:justify-between items-center flex-wrap gap-4">
          <LogoFooter />
          <Credits />
        </div>
      </div>
    </footer>
  );
}
