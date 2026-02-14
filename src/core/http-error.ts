import type { HttpErrorOptions, HttpErrorJSON } from './types';
import { HttpStatusMessage } from './status-codes';

/**
 * Base HTTP error class that extends native Error
 * 
 * @example
 * ```ts
 * throw new HttpError(404, 'User not found', { 
 *   code: 'USER_NOT_FOUND',
 *   details: { userId: '123' }
 * });
 * ```
 */
export class HttpError extends Error {
  /**
   * HTTP status code (e.g., 404, 500)
   */
  readonly status: number;

  /**
   * Machine-readable error code (e.g., "USER_NOT_FOUND")
   */
  readonly code?: string;

  /**
   * Additional error details
   */
  readonly details?: unknown;

  /**
   * Creates a new HTTP error
   * 
   * @param status - HTTP status code
   * @param message - Human-readable error message
   * @param options - Optional error metadata
   */
  constructor(status: number, message: string, options?: HttpErrorOptions) {
    super(message);

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, HttpError.prototype);

    this.name = 'HttpError';
    this.status = status;
    this.code = options?.code;
    this.details = options?.details;

    // Capture stack trace, excluding constructor call from stack
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializes the error to a plain JSON object
   * 
   * @returns JSON representation without stack trace
   * 
   * @example
   * ```ts
   * const error = new HttpError(404, 'Not found');
   * console.log(error.toJSON());
   * // { status: 404, message: 'Not found' }
   * ```
   */
  toJSON(): HttpErrorJSON {
    const json: HttpErrorJSON = {
      status: this.status,
      message: this.message,
    };

    if (this.code !== undefined) {
      json.code = this.code;
    }

    if (this.details !== undefined) {
      json.details = this.details;
    }

    return json;
  }

  /**
   * Returns the default message for a given HTTP status code
   * 
   * @param status - HTTP status code
   * @returns Default status message or 'Unknown Error'
   */
  static getDefaultMessage(status: number): string {
    return HttpStatusMessage[status] || 'Unknown Error';
  }
}