import { createClient } from "@tech-companies-portugal/db/client";

/** Browser client plus the signed-in user's id; throws when signed out. */
export const getSessionClient = async () => {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error("Cannot get user session");
  }

  return { supabase, userId: session.user.id };
};
