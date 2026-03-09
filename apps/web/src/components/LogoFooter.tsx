import Image from "next/image";
import logo from "../../public/assets/images/logo.png";

type LogoFooterProps = {
  onlyLogo?: boolean;
};

export const LogoFooter = ({ onlyLogo = false }: LogoFooterProps) => {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <div className="inline-flex items-center gap-2">
        <Image
          src={logo}
          alt="Tech Companies Portugal Logo"
          width={28}
          height={28}
          className="shrink-0 rounded-lg"
        />
        {!onlyLogo && (
          <span className="inline-block logo-stroke">
            <span className="text-xs font-bold tracking-tight">
              TechCompanies
            </span>
            <span className="text-xs font-bold tracking-tight">Portugal</span>
          </span>
        )}
      </div>
      <a
        href="https://techcompaniesportugal.openstatus.dev"
        target="_blank"
        rel="noreferrer"
      >
        <img
          className="h-5"
          src="https://techcompaniesportugal.openstatus.dev/badge"
          alt="OpenStatus Badge"
          loading="lazy"
        />
      </a>
    </div>
  );
};
