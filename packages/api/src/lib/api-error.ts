import type { ErrorDetail } from "../use-cases/errors";

/** Named fields, not positional: `code` and `message` are both strings. */
export const errorBody = ({
  code,
  message,
  details,
}: {
  code: string;
  message: string;
  details?: ErrorDetail[];
}) => ({
  error: {
    message,
    code,
    ...(details ? { details } : {}),
  },
});
