export const Credits = () => {
  return (
    <p className="text-xs text-muted-foreground text-center">
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
      for the portuguese community
      <span className="mx-1.5 text-border">|</span>
      <span>
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
    </p>
  );
};
