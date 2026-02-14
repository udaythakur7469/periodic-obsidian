// Core exports
export { HttpError } from './core/http-error';
export { HttpStatusCode, HttpStatusMessage } from './core/status-codes';

// Type exports
export type { HttpErrorOptions, HttpErrorJSON } from './core/types';

// Adapter exports
export { errorHandler, simpleErrorHandler } from './adapters/express';
export type { ExpressErrorHandlerOptions } from './adapters/express';

// Import all factory functions
import {
  // 1xx Informational
  continueError,
  switchingProtocols,
  processing,
  earlyHints,
  // 2xx Success
  ok,
  created,
  accepted,
  nonAuthoritativeInformation,
  noContent,
  resetContent,
  partialContent,
  multiStatus,
  alreadyReported,
  imUsed,
  // 3xx Redirection
  multipleChoices,
  movedPermanently,
  found,
  seeOther,
  notModified,
  useProxy,
  temporaryRedirect,
  permanentRedirect,
  // 4xx Client Errors
  badRequest,
  unauthorized,
  paymentRequired,
  forbidden,
  notFound,
  methodNotAllowed,
  notAcceptable,
  proxyAuthenticationRequired,
  requestTimeout,
  conflict,
  gone,
  lengthRequired,
  preconditionFailed,
  payloadTooLarge,
  uriTooLong,
  unsupportedMediaType,
  rangeNotSatisfiable,
  expectationFailed,
  imATeapot,
  misdirectedRequest,
  unprocessableEntity,
  locked,
  failedDependency,
  tooEarly,
  upgradeRequired,
  preconditionRequired,
  tooManyRequests,
  requestHeaderFieldsTooLarge,
  unavailableForLegalReasons,
  // 5xx Server Errors
  internalServerError,
  notImplemented,
  badGateway,
  serviceUnavailable,
  gatewayTimeout,
  httpVersionNotSupported,
  variantAlsoNegotiates,
  insufficientStorage,
  loopDetected,
  notExtended,
  networkAuthenticationRequired,
} from './core/factories';

/**
 * Main obsidian object with all HTTP error factory methods
 * 
 * @example
 * ```ts
 * import { obsidian } from '@periodic/obsidian';
 * 
 * throw obsidian.notFound('User not found');
 * throw obsidian.badRequest('Invalid input', { code: 'VALIDATION_ERROR' });
 * throw obsidian.internalServerError('Database connection failed');
 * ```
 */
export const obsidian = {
  // 1xx Informational
  continue: continueError,
  switchingProtocols,
  processing,
  earlyHints,

  // 2xx Success
  ok,
  created,
  accepted,
  nonAuthoritativeInformation,
  noContent,
  resetContent,
  partialContent,
  multiStatus,
  alreadyReported,
  imUsed,

  // 3xx Redirection
  multipleChoices,
  movedPermanently,
  found,
  seeOther,
  notModified,
  useProxy,
  temporaryRedirect,
  permanentRedirect,

  // 4xx Client Errors
  badRequest,
  unauthorized,
  paymentRequired,
  forbidden,
  notFound,
  methodNotAllowed,
  notAcceptable,
  proxyAuthenticationRequired,
  requestTimeout,
  conflict,
  gone,
  lengthRequired,
  preconditionFailed,
  payloadTooLarge,
  uriTooLong,
  unsupportedMediaType,
  rangeNotSatisfiable,
  expectationFailed,
  imATeapot,
  misdirectedRequest,
  unprocessableEntity,
  locked,
  failedDependency,
  tooEarly,
  upgradeRequired,
  preconditionRequired,
  tooManyRequests,
  requestHeaderFieldsTooLarge,
  unavailableForLegalReasons,

  // 5xx Server Errors
  internalServerError,
  badGateway,
  serviceUnavailable,
  gatewayTimeout,
  notImplemented,
  httpVersionNotSupported,
  variantAlsoNegotiates,
  insufficientStorage,
  loopDetected,
  notExtended,
  networkAuthenticationRequired,
} as const;

// Legacy alias for backward compatibility
export { obsidian as titanium };