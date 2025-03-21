import Image from "next/image";
import logo from "../../public/assets/images/logo.png";

export const LogoFooter = () => {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <div className="inline-flex items-center gap-1">
        <Image
          src={logo}
          alt="Tech Companies Portugal Logo"
          width={35}
          height={35}
          className="shrink-0"
        />
        <span className="text-xs font-semibold">techcompaniesportugal.fyi</span>
      </div>
      <a href="https://techcompaniesportugal.openstatus.dev" target="_blank">
        <img
          className="h-5"
          src="https://openstatus.dev/status-page/techcompaniesportugal/badge?size=sm&theme=light"
          alt="OpenStatus Badge"
        />
      </a>
    </div>
  );
};
