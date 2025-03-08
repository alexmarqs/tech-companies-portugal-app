import Image from "next/image";
import logo from "../../public/assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-background font-mono">
      <div className="container flex flex-col gap-8 p-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Resources</h3>
            <div className="flex flex-col gap-2">
              <a href="/about" className="text-xs hover:underline">
                Github
              </a>
              <a href="/contribute" className="text-xs hover:underline">
                How to Contribute
              </a>
              <a href="/contribute" className="text-xs hover:underline">
                Data source
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Companies by Location</h3>
            <div className="flex flex-col gap-2">
              <a href="/companies/remote" className="text-xs hover:underline">
                Remote
              </a>
              <a href="/companies/lisbon" className="text-xs hover:underline">
                Lisbon
              </a>
              <a href="/companies/porto" className="text-xs hover:underline">
                Porto
              </a>
              <a href="/companies/braga" className="text-xs hover:underline">
                Aveiro
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Companies by Category</h3>
            <div className="flex flex-col gap-2">
              <a
                href="/category/enterprise"
                className="text-xs hover:underline"
              >
                Enterprise Software
              </a>
              <a href="/category/fintech" className="text-xs hover:underline">
                Fintech
              </a>
              <a href="/category/product" className="text-xs hover:underline">
                Security
              </a>
              <a
                href="/category/developer-tools"
                className="text-xs hover:underline"
              >
                Developer Tools
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between items-center gap-3 col-span-2 sm:col-span-3 md:col-span-1">
            <div className="hidden sm:flex items-center gap-1 flex-wrap justify-center">
              <Image
                src={logo}
                alt="Tech Companies Portugal Logo"
                width={35}
                height={35}
              />
              <span className="text-xs font-semibold">
                techcompaniesportugal.fyi
              </span>
            </div>
            <p className="text-xs text-center">
              Crafted by{" "}
              <a
                href="https://alexandremarques.io"
                target="_blank"
                rel="noopener"
                className="underline underline-offset-[2px]"
              >
                Alexandre Marques
              </a>{" "}
              <span>&copy; {new Date().getFullYear()}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
