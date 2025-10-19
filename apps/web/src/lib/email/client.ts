import Plunk from "@plunk/node";

let client: Plunk | undefined;

const createClient = () => {
  const apiKey = process.env.PLUNK_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing PLUNK_API_KEY environment variable. Set it to use the email service.",
    );
  }

  return new Plunk(apiKey);
};

export const getPlunkClient = () => {
  if (!client) {
    client = createClient();
  }

  return client;
};
