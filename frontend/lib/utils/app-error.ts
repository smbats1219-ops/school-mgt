export interface EnhancedError extends Error {
  code?: string;
  status?: number;
  details?: unknown;
}

export function AppError(
  error: unknown,
  fallback = "Unexpected error occurred. Please try again.",
): EnhancedError {
  const newError = new Error(fallback) as EnhancedError;

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      newError.message = error.message;
    }
    if ("code" in error) {
      newError.code = error.code as string;
    }
    if ("status" in error) {
      newError.status = error.status as number;
    }
    if ("details" in error) {
      newError.details = error.details;

      const serverError = (
        error as { details?: { error?: { message?: string; code?: string } } }
      ).details?.error;
      if (serverError) {
        if (serverError.message) newError.message = serverError.message;
        if (serverError.code) newError.code = serverError.code;
      }

      const validationErrors = (
        error as { details?: { errors?: Array<{ message?: string }> } }
      ).details?.errors;
      if (validationErrors?.length) {
        newError.message = validationErrors
          .map((issue) => issue.message)
          .filter(Boolean)
          .join("; ");
      }
    }
  }

  return newError;
}