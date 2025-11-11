// ref: https://www.inngest.com/docs/typescript

export type WeeklyNewCompaniesSendEmailWorkerData = {
  emails: string[];
  newCompanies: {
    slug: string;
    name: string;
  }[];
};

export type Events = {
  "app/weekly.new.companies.send.email.worker": {
    data: WeeklyNewCompaniesSendEmailWorkerData;
  };
};

// Helper type for creating typed events
export type EventPayload<T extends keyof Events> = {
  name: T;
  data: Events[T]["data"];
};
