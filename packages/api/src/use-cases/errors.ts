// Errors thrown only by use cases. Adapters (`services/`) never throw them:
// their failures stay plain errors and surface as 500s. The `code` is what API
// clients see; the global error handler maps each one to an HTTP status
// (`middleware/errors.ts`).

export type ErrorDetail = {
  code: string;
  message: string;
  path: string;
};

export type UseCaseErrorCode =
  | "validation_error"
  | "not_found"
  | "unauthorized"
  | "conflict";

export class UseCaseError extends Error {
  constructor(
    readonly code: UseCaseErrorCode,
    message: string,
    readonly details?: ErrorDetail[],
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends UseCaseError {
  constructor(message: string, details?: ErrorDetail[]) {
    super("validation_error", message, details);
  }
}

export class NotFoundError extends UseCaseError {
  constructor(message: string, details?: ErrorDetail[]) {
    super("not_found", message, details);
  }
}

export class ConflictError extends UseCaseError {
  constructor(message: string, details?: ErrorDetail[]) {
    super("conflict", message, details);
  }
}
