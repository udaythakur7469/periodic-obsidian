# 📋 Obsidian Status Code Reference

This document lists all HTTP status codes supported by the `obsidian` factory object.

Each method returns a `HttpError` instance.

---

## 1xx — Informational

| Code | Method | Description |
|------|--------|-------------|
| 100 | `obsidian.continue()` | Continue |
| 101 | `obsidian.switchingProtocols()` | Switching Protocols |
| 102 | `obsidian.processing()` | Processing |
| 103 | `obsidian.earlyHints()` | Early Hints |

---

## 2xx — Success

| Code | Method | Description |
|------|--------|-------------|
| 200 | `obsidian.ok()` | OK |
| 201 | `obsidian.created()` | Created |
| 202 | `obsidian.accepted()` | Accepted |
| 203 | `obsidian.nonAuthoritativeInformation()` | Non-Authoritative Information |
| 204 | `obsidian.noContent()` | No Content |
| 205 | `obsidian.resetContent()` | Reset Content |
| 206 | `obsidian.partialContent()` | Partial Content |
| 207 | `obsidian.multiStatus()` | Multi-Status |
| 208 | `obsidian.alreadyReported()` | Already Reported |
| 226 | `obsidian.imUsed()` | IM Used |

---

## 3xx — Redirection

| Code | Method | Description |
|------|--------|-------------|
| 300 | `obsidian.multipleChoices()` | Multiple Choices |
| 301 | `obsidian.movedPermanently()` | Moved Permanently |
| 302 | `obsidian.found()` | Found |
| 303 | `obsidian.seeOther()` | See Other |
| 304 | `obsidian.notModified()` | Not Modified |
| 305 | `obsidian.useProxy()` | Use Proxy |
| 307 | `obsidian.temporaryRedirect()` | Temporary Redirect |
| 308 | `obsidian.permanentRedirect()` | Permanent Redirect |

---

## 4xx — Client Errors

| Code | Method | Description |
|------|--------|-------------|
| 400 | `obsidian.badRequest()` | Bad Request |
| 401 | `obsidian.unauthorized()` | Unauthorized |
| 402 | `obsidian.paymentRequired()` | Payment Required |
| 403 | `obsidian.forbidden()` | Forbidden |
| 404 | `obsidian.notFound()` | Not Found |
| 405 | `obsidian.methodNotAllowed()` | Method Not Allowed |
| 406 | `obsidian.notAcceptable()` | Not Acceptable |
| 407 | `obsidian.proxyAuthenticationRequired()` | Proxy Authentication Required |
| 408 | `obsidian.requestTimeout()` | Request Timeout |
| 409 | `obsidian.conflict()` | Conflict |
| 410 | `obsidian.gone()` | Gone |
| 411 | `obsidian.lengthRequired()` | Length Required |
| 412 | `obsidian.preconditionFailed()` | Precondition Failed |
| 413 | `obsidian.payloadTooLarge()` | Payload Too Large |
| 414 | `obsidian.uriTooLong()` | URI Too Long |
| 415 | `obsidian.unsupportedMediaType()` | Unsupported Media Type |
| 416 | `obsidian.rangeNotSatisfiable()` | Range Not Satisfiable |
| 417 | `obsidian.expectationFailed()` | Expectation Failed |
| 418 | `obsidian.imATeapot()` | I'm a teapot |
| 421 | `obsidian.misdirectedRequest()` | Misdirected Request |
| 422 | `obsidian.unprocessableEntity()` | Unprocessable Entity |
| 423 | `obsidian.locked()` | Locked |
| 424 | `obsidian.failedDependency()` | Failed Dependency |
| 425 | `obsidian.tooEarly()` | Too Early |
| 426 | `obsidian.upgradeRequired()` | Upgrade Required |
| 428 | `obsidian.preconditionRequired()` | Precondition Required |
| 429 | `obsidian.tooManyRequests()` | Too Many Requests |
| 431 | `obsidian.requestHeaderFieldsTooLarge()` | Request Header Fields Too Large |
| 451 | `obsidian.unavailableForLegalReasons()` | Unavailable For Legal Reasons |

---

## 5xx — Server Errors

| Code | Method | Description |
|------|--------|-------------|
| 500 | `obsidian.internalServerError()` | Internal Server Error |
| 501 | `obsidian.notImplemented()` | Not Implemented |
| 502 | `obsidian.badGateway()` | Bad Gateway |
| 503 | `obsidian.serviceUnavailable()` | Service Unavailable |
| 504 | `obsidian.gatewayTimeout()` | Gateway Timeout |
| 505 | `obsidian.httpVersionNotSupported()` | HTTP Version Not Supported |
| 506 | `obsidian.variantAlsoNegotiates()` | Variant Also Negotiates |
| 507 | `obsidian.insufficientStorage()` | Insufficient Storage |
| 508 | `obsidian.loopDetected()` | Loop Detected |
| 510 | `obsidian.notExtended()` | Not Extended |
| 511 | `obsidian.networkAuthenticationRequired()` | Network Authentication Required |

---

## 🧠 Notes

- All methods return a `HttpError` instance
- Method names follow camelCase conventions
- Designed to be stable and predictable
- Each method accepts optional `message` and `options` parameters:

```typescript
obsidian.notFound()  // Uses default message: "Not Found"
obsidian.notFound('User not found')  // Custom message
obsidian.notFound('User not found', {
  code: 'USER_NOT_FOUND',
  details: { userId: '123' }
})
```

---

## Usage Examples

### Basic Usage

```typescript
import { obsidian } from '@periodic/obsidian';

// Throw with default message
throw obsidian.notFound();

// Throw with custom message
throw obsidian.badRequest('Invalid email format');

// Throw with metadata
throw obsidian.unprocessableEntity('Validation failed', {
  code: 'VALIDATION_ERROR',
  details: {
    errors: [
      { field: 'email', message: 'Invalid format' }
    ]
  }
});
```

### In Express Routes

```typescript
import express from 'express';
import { obsidian } from '@periodic/obsidian';

const app = express();

app.get('/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  
  if (!user) {
    throw obsidian.notFound('User not found', {
      code: 'USER_NOT_FOUND',
      details: { userId: req.params.id }
    });
  }
  
  res.json(user);
});
```

---

**Author:** Uday Thakur  
**Package:** @periodic/obsidian  
**License:** MIT