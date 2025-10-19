type TitleProps = {
  title: string;
  description?: string;
  className?: string;
};

export const Title = ({ title, description, className }: TitleProps) => {
  return (
    <div className={className}>
      <h1 className={"text-3xl font-bold font-mono"}>{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};
