// ref: https://www.inngest.com/docs/typescript

export type Events = {
  "weekly-new-companies-send-email-worker": {
    data: {
      emails: string[];
      newCompanies: {
        slug: string;
        name: string;
      }[];
    };
  };
};

// Helper type for creating typed events
export type EventPayload<T extends keyof Events> = {
  name: T;
  data: Events[T]["data"];
};
