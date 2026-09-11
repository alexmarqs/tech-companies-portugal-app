import Image from "next/image";

type LogoFooterProps = {
  onlyLogo?: boolean;
};

export const LogoFooter = ({ onlyLogo = false }: LogoFooterProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="inline-flex items-center gap-2">
        <Image
          src="/assets/images/logo.svg"
          alt="Tech Companies Portugal Logo"
          width={28}
          height={28}
          className="shrink-0 rounded-lg"
        />
        {!onlyLogo && (
          <span className="text-xs font-bold tracking-[-0.03em]">
            Tech Companies <span className="text-primary">Portugal</span>
          </span>
        )}
      </div>
      {!onlyLogo && (
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
      )}
    </div>
  );
};
