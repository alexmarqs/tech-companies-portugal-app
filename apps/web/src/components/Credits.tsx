export const Credits = () => {
  return (
    <p className="text-xs text-muted-foreground text-center sm:text-left">
      &copy; {new Date().getFullYear()} TechCompaniesPortugal. Built with{" "}
      <span className="text-red-500">&#9829;</span> by{" "}
      <a
        href="https://alexandremarques.io"
        target="_blank"
        rel="noreferrer noopener author"
        className="underline underline-offset-2 hover:text-primary transition-colors"
      >
        Alexandre Marques
      </a>{" "}
      for the Portuguese community
      <span className="mx-1.5 text-border">|</span>
      <span className="inline-block">
        Source:{" "}
        <a
          href="https://github.com/marmelo/tech-companies-in-portugal"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 hover:text-primary transition-colors"
        >
          marmelo/tech-companies-in-portugal
        </a>
      </span>
      <span className="mx-1.5 text-border">|</span>
      <span className="inline-block">
        Logos:{" "}
        <a
          href="https://logo.dev"
          target="_blank"
          rel="noreferrer noopener"
          title="Logo API"
          className="underline underline-offset-2 hover:text-primary transition-colors"
        >
          Logo.dev
        </a>
      </span>
    </p>
  );
};
