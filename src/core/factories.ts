import { HttpError } from './http-error';
import type { HttpErrorOptions } from './types';
import { HttpStatusCode } from './status-codes';

/**
 * Factory function type for creating HTTP errors
 */
type ErrorFactory = (message?: string, options?: HttpErrorOptions) => HttpError;

/**
 * Creates an error factory for a specific HTTP status code
 */
function createFactory(status: number): ErrorFactory {
  return (message?: string, options?: HttpErrorOptions) => {
    const errorMessage = message || HttpError.getDefaultMessage(status);
    return new HttpError(status, errorMessage, options);
  };
}

// ============================================================================
// 1xx Informational
// ============================================================================

/**
 * 100 Continue
 * The server has received the request headers and the client should proceed to send the request body.
 */
export const continueError = createFactory(HttpStatusCode.CONTINUE);

/**
 * 101 Switching Protocols
 * The requester has asked the server to switch protocols.
 */
export const switchingProtocols = createFactory(HttpStatusCode.SWITCHING_PROTOCOLS);

/**
 * 102 Processing
 * The server has received and is processing the request, but no response is available yet.
 */
export const processing = createFactory(HttpStatusCode.PROCESSING);

/**
 * 103 Early Hints
 * Used to return some response headers before final HTTP message.
 */
export const earlyHints = createFactory(HttpStatusCode.EARLY_HINTS);

// ============================================================================
// 2xx Success
// ============================================================================

/**
 * 200 OK
 * Standard response for successful HTTP requests.
 */
export const ok = createFactory(HttpStatusCode.OK);

/**
 * 201 Created
 * The request has been fulfilled and resulted in a new resource being created.
 */
export const created = createFactory(HttpStatusCode.CREATED);

/**
 * 202 Accepted
 * The request has been accepted for processing, but the processing has not been completed.
 */
export const accepted = createFactory(HttpStatusCode.ACCEPTED);

/**
 * 203 Non-Authoritative Information
 * The server is a transforming proxy that received a 200 OK from its origin.
 */
export const nonAuthoritativeInformation = createFactory(
  HttpStatusCode.NON_AUTHORITATIVE_INFORMATION
);

/**
 * 204 No Content
 * The server successfully processed the request and is not returning any content.
 */
export const noContent = createFactory(HttpStatusCode.NO_CONTENT);

/**
 * 205 Reset Content
 * The server successfully processed the request, but is not returning any content.
 */
export const resetContent = createFactory(HttpStatusCode.RESET_CONTENT);

/**
 * 206 Partial Content
 * The server is delivering only part of the resource due to a range header sent by the client.
 */
export const partialContent = createFactory(HttpStatusCode.PARTIAL_CONTENT);

/**
 * 207 Multi-Status
 * The message body that follows is an XML message and can contain a number of separate response codes.
 */
export const multiStatus = createFactory(HttpStatusCode.MULTI_STATUS);

/**
 * 208 Already Reported
 * The members of a DAV binding have already been enumerated in a previous reply.
 */
export const alreadyReported = createFactory(HttpStatusCode.ALREADY_REPORTED);

/**
 * 226 IM Used
 * The server has fulfilled a request for the resource.
 */
export const imUsed = createFactory(HttpStatusCode.IM_USED);

// ============================================================================
// 3xx Redirection
// ============================================================================

/**
 * 300 Multiple Choices
 * Indicates multiple options for the resource that the client may follow.
 */
export const multipleChoices = createFactory(HttpStatusCode.MULTIPLE_CHOICES);

/**
 * 301 Moved Permanently
 * This and all future requests should be directed to the given URI.
 */
export const movedPermanently = createFactory(HttpStatusCode.MOVED_PERMANENTLY);

/**
 * 302 Found
 * The resource was found but at a different URI.
 */
export const found = createFactory(HttpStatusCode.FOUND);

/**
 * 303 See Other
 * The response to the request can be found under another URI using a GET method.
 */
export const seeOther = createFactory(HttpStatusCode.SEE_OTHER);

/**
 * 304 Not Modified
 * Indicates that the resource has not been modified since the version specified by the request headers.
 */
export const notModified = createFactory(HttpStatusCode.NOT_MODIFIED);

/**
 * 305 Use Proxy
 * The requested resource is available only through a proxy.
 */
export const useProxy = createFactory(HttpStatusCode.USE_PROXY);

/**
 * 307 Temporary Redirect
 * The request should be repeated with another URI but future requests should still use the original URI.
 */
export const temporaryRedirect = createFactory(HttpStatusCode.TEMPORARY_REDIRECT);

/**
 * 308 Permanent Redirect
 * The request and all future requests should be repeated using another URI.
 */
export const permanentRedirect = createFactory(HttpStatusCode.PERMANENT_REDIRECT);

// ============================================================================
// 4xx Client Errors
// ============================================================================

/**
 * 400 Bad Request
 * The server cannot or will not process the request due to a client error.
 */
export const badRequest = createFactory(HttpStatusCode.BAD_REQUEST);

/**
 * 401 Unauthorized
 * Authentication is required and has failed or has not been provided.
 */
export const unauthorized = createFactory(HttpStatusCode.UNAUTHORIZED);

/**
 * 402 Payment Required
 * Reserved for future use.
 */
export const paymentRequired = createFactory(HttpStatusCode.PAYMENT_REQUIRED);

/**
 * 403 Forbidden
 * The request was valid, but the server is refusing action.
 */
export const forbidden = createFactory(HttpStatusCode.FORBIDDEN);

/**
 * 404 Not Found
 * The requested resource could not be found.
 */
export const notFound = createFactory(HttpStatusCode.NOT_FOUND);

/**
 * 405 Method Not Allowed
 * A request method is not supported for the requested resource.
 */
export const methodNotAllowed = createFactory(HttpStatusCode.METHOD_NOT_ALLOWED);

/**
 * 406 Not Acceptable
 * The requested resource is capable of generating only content not acceptable.
 */
export const notAcceptable = createFactory(HttpStatusCode.NOT_ACCEPTABLE);

/**
 * 407 Proxy Authentication Required
 * The client must first authenticate itself with the proxy.
 */
export const proxyAuthenticationRequired = createFactory(
  HttpStatusCode.PROXY_AUTHENTICATION_REQUIRED
);

/**
 * 408 Request Timeout
 * The server timed out waiting for the request.
 */
export const requestTimeout = createFactory(HttpStatusCode.REQUEST_TIMEOUT);

/**
 * 409 Conflict
 * The request could not be processed because of conflict in the request.
 */
export const conflict = createFactory(HttpStatusCode.CONFLICT);

/**
 * 410 Gone
 * The resource requested is no longer available and will not be available again.
 */
export const gone = createFactory(HttpStatusCode.GONE);

/**
 * 411 Length Required
 * The request did not specify the length of its content.
 */
export const lengthRequired = createFactory(HttpStatusCode.LENGTH_REQUIRED);

/**
 * 412 Precondition Failed
 * The server does not meet one of the preconditions specified in the request.
 */
export const preconditionFailed = createFactory(HttpStatusCode.PRECONDITION_FAILED);

/**
 * 413 Payload Too Large
 * The request is larger than the server is willing or able to process.
 */
export const payloadTooLarge = createFactory(HttpStatusCode.PAYLOAD_TOO_LARGE);

/**
 * 414 URI Too Long
 * The URI provided was too long for the server to process.
 */
export const uriTooLong = createFactory(HttpStatusCode.URI_TOO_LONG);

/**
 * 415 Unsupported Media Type
 * The request entity has a media type which the server or resource does not support.
 */
export const unsupportedMediaType = createFactory(HttpStatusCode.UNSUPPORTED_MEDIA_TYPE);

/**
 * 416 Range Not Satisfiable
 * The client has asked for a portion of the file, but the server cannot supply that portion.
 */
export const rangeNotSatisfiable = createFactory(HttpStatusCode.RANGE_NOT_SATISFIABLE);

/**
 * 417 Expectation Failed
 * The server cannot meet the requirements of the Expect request-header field.
 */
export const expectationFailed = createFactory(HttpStatusCode.EXPECTATION_FAILED);

/**
 * 418 I'm a Teapot
 * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot".
 */
export const imATeapot = createFactory(HttpStatusCode.IM_A_TEAPOT);

/**
 * 421 Misdirected Request
 * The request was directed at a server that is not able to produce a response.
 */
export const misdirectedRequest = createFactory(HttpStatusCode.MISDIRECTED_REQUEST);

/**
 * 422 Unprocessable Entity
 * The request was well-formed but was unable to be followed due to semantic errors.
 */
export const unprocessableEntity = createFactory(HttpStatusCode.UNPROCESSABLE_ENTITY);

/**
 * 423 Locked
 * The resource that is being accessed is locked.
 */
export const locked = createFactory(HttpStatusCode.LOCKED);

/**
 * 424 Failed Dependency
 * The request failed due to failure of a previous request.
 */
export const failedDependency = createFactory(HttpStatusCode.FAILED_DEPENDENCY);

/**
 * 425 Too Early
 * The server is unwilling to risk processing a request that might be replayed.
 */
export const tooEarly = createFactory(HttpStatusCode.TOO_EARLY);

/**
 * 426 Upgrade Required
 * The client should switch to a different protocol.
 */
export const upgradeRequired = createFactory(HttpStatusCode.UPGRADE_REQUIRED);

/**
 * 428 Precondition Required
 * The origin server requires the request to be conditional.
 */
export const preconditionRequired = createFactory(HttpStatusCode.PRECONDITION_REQUIRED);

/**
 * 429 Too Many Requests
 * The user has sent too many requests in a given amount of time.
 */
export const tooManyRequests = createFactory(HttpStatusCode.TOO_MANY_REQUESTS);

/**
 * 431 Request Header Fields Too Large
 * The server is unwilling to process the request because either an individual header field,
 * or all the header fields collectively, are too large.
 */
export const requestHeaderFieldsTooLarge = createFactory(
  HttpStatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE
);

/**
 * 451 Unavailable For Legal Reasons
 * A server operator has received a legal demand to deny access to a resource or to a set of resources.
 */
export const unavailableForLegalReasons = createFactory(
  HttpStatusCode.UNAVAILABLE_FOR_LEGAL_REASONS
);

// ============================================================================
// 5xx Server Errors
// ============================================================================

/**
 * 500 Internal Server Error
 * A generic error message when an unexpected condition was encountered.
 */
export const internalServerError = createFactory(HttpStatusCode.INTERNAL_SERVER_ERROR);

/**
 * 501 Not Implemented
 * The server either does not recognize the request method, or it lacks the ability to fulfill the request.
 */
export const notImplemented = createFactory(HttpStatusCode.NOT_IMPLEMENTED);

/**
 * 502 Bad Gateway
 * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
 */
export const badGateway = createFactory(HttpStatusCode.BAD_GATEWAY);

/**
 * 503 Service Unavailable
 * The server is currently unavailable (overloaded or down for maintenance).
 */
export const serviceUnavailable = createFactory(HttpStatusCode.SERVICE_UNAVAILABLE);

/**
 * 504 Gateway Timeout
 * The server was acting as a gateway or proxy and did not receive a timely response.
 */
export const gatewayTimeout = createFactory(HttpStatusCode.GATEWAY_TIMEOUT);

/**
 * 505 HTTP Version Not Supported
 * The server does not support the HTTP protocol version used in the request.
 */
export const httpVersionNotSupported = createFactory(HttpStatusCode.HTTP_VERSION_NOT_SUPPORTED);

/**
 * 506 Variant Also Negotiates
 * Transparent content negotiation for the request results in a circular reference.
 */
export const variantAlsoNegotiates = createFactory(HttpStatusCode.VARIANT_ALSO_NEGOTIATES);

/**
 * 507 Insufficient Storage
 * The server is unable to store the representation needed to complete the request.
 */
export const insufficientStorage = createFactory(HttpStatusCode.INSUFFICIENT_STORAGE);

/**
 * 508 Loop Detected
 * The server detected an infinite loop while processing the request.
 */
export const loopDetected = createFactory(HttpStatusCode.LOOP_DETECTED);

/**
 * 510 Not Extended
 * Further extensions to the request are required for the server to fulfill it.
 */
export const notExtended = createFactory(HttpStatusCode.NOT_EXTENDED);

/**
 * 511 Network Authentication Required
 * The client needs to authenticate to gain network access.
 */
export const networkAuthenticationRequired = createFactory(
  HttpStatusCode.NETWORK_AUTHENTICATION_REQUIRED
);
