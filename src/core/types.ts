/**
 * Options for creating an HTTP error
 */
export interface HttpErrorOptions {
  /**
   * Machine-readable error code (e.g., "USER_NOT_FOUND", "VALIDATION_FAILED")
   */
  code?: string;

  /**
   * Additional error details (e.g., validation errors, debug info)
   */
  details?: unknown;
}

/**
 * JSON representation of an HTTP error
 */
export interface HttpErrorJSON {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * HTTP status codes type
 */
export type HttpStatusCode = number;

/**
 * Error factory function type
 */
export type ErrorFactory = (message?: string, options?: HttpErrorOptions) => HttpError;

/**
 * Import HttpError from the core module
 */
import type { HttpError } from './http-error';
export type { HttpError };
