/**
 * Zernio SDK error utilities
 */
import { ZernioApiError } from "@zernio/node";

/**
 * Type guard for ZernioApiError
 */
export function isZernioError(err: unknown): err is ZernioApiError {
	return err instanceof ZernioApiError;
}

/**
 * Extract error message from unknown error
 */
export function getZernioErrorMessage(err: unknown): string {
	if (isZernioError(err)) return err.message;
	if (err instanceof Error) return err.message;
	return "Unknown error";
}
