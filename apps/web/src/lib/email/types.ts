export type EmailServiceParams = {
  to: string | string[];
  subject: string;
  body: string;
  type?: "html" | "markdown";
  from?: string;
  name?: string;
  subscribed?: boolean;
};

export type EmailService = {
  sendEmail: (payload: EmailServiceParams) => Promise<void>;
};
