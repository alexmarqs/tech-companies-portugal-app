import Image from "next/image";
import logo from "../../public/assets/images/logo.png";

export default function SimpleFooter() {
  return (
    <footer className="bg-background font-mono">
      <div className="container flex flex-col gap-4 p-6">
        <div className="w-full flex flex-col md:flex-row md:justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-1 flex-wrap justify-center">
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
    </footer>
  );
}
