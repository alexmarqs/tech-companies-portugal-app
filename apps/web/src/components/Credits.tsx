export const Credits = () => {
  return (
    <p className="text-xs text-center">
      Built by{" "}
      <a
        href="https://alexandremarques.io"
        target="_blank"
        rel="noreferrer noopener author"
        className="underline underline-offset-[2px]"
      >
        Alexandre Marques
      </a>{" "}
      <span>&copy; {new Date().getFullYear()}</span>
      <span className="mx-2">|</span>
      <span>
        Source:{" "}
        <a
          href="https://github.com/marmelo/tech-companies-in-portugal"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-[2px]"
        >
          marmelo/tech-companies-in-portugal
        </a>
      </span>
    </p>
  );
};
