import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpError } from '../core/http-error';

/**
 * Options for Express error handler middleware
 */
export interface ExpressErrorHandlerOptions {
  /**
   * Include stack trace in development mode
   * @default process.env.NODE_ENV !== 'production'
   */
  includeStack?: boolean;

  /**
   * Custom logger function
   */
  logger?: (error: Error, req: Request) => void;

  /**
   * Custom error transformer
   */
  transform?: (error: HttpError) => Record<string, unknown>;
}

/**
 * Express middleware for handling HttpError instances
 *
 * @param options - Configuration options
 * @returns Express error handler middleware
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { obsidian, errorHandler } from '@periodic/obsidian';
 *
 * const app = express();
 *
 * app.get('/users/:id', (req, res) => {
 *   throw obsidian.notFound('User not found');
 * });
 *
 * // Add at the end of middleware chain
 * app.use(errorHandler());
 * ```
 */
export function errorHandler(options: ExpressErrorHandlerOptions = {}): ErrorRequestHandler {
  const { includeStack = process.env.NODE_ENV !== 'production', logger, transform } = options;

  return (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    // Log error if logger provided
    if (logger) {
      logger(err, req);
    }

    // Handle HttpError instances
    if (err instanceof HttpError) {
      const response = transform ? transform(err) : err.toJSON();
      res.status(err.status).json(response);
      return;
    }

    // Handle unknown errors
    if (!includeStack) {
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
      return;
    }

    // Development mode: include error details
    res.status(500).json({
      status: 500,
      message: err.message,
      stack: err.stack,
    });
  };
}

/**
 * Simple Express error handler that only handles HttpError instances
 * Passes other errors to the next error handler
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { simpleErrorHandler } from '@periodic/obsidian';
 *
 * const app = express();
 *
 * app.use(simpleErrorHandler());
 *
 * // Add your own fallback error handler
 * app.use((err, req, res, next) => {
 *   res.status(500).json({ error: 'Something went wrong' });
 * });
 * ```
 */
export function simpleErrorHandler(): ErrorRequestHandler {
  return (err: Error, _req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof HttpError) {
      res.status(err.status).json(err.toJSON());
      return;
    }
    next(err);
  };
}
