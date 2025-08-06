import { LogoFooter } from "./LogoFooter";

export default function SimpleFooter() {
  return (
    <footer className="bg-background font-mono">
      <div className="container flex flex-col gap-4 p-3">
        <div className="w-full flex flex-col md:flex-row md:justify-between items-center flex-wrap gap-4">
          <LogoFooter />
          <p className="text-xs text-center">
            Crafted by{" "}
            <a
              href="https://alexandremarques.io"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-[2px]"
            >
              Alexandre Marques
            </a>{" "}
            <span>&copy; {new Date().getFullYear()}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
