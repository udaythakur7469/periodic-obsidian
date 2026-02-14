# ⚫ Periodic Obsidian

[![npm version](https://img.shields.io/npm/v/@periodic/obsidian.svg)](https://www.npmjs.com/package/@periodic/obsidian)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

**Production-grade HTTP error handling library for Express.js with TypeScript support**

Part of the **Periodic** series of Node.js middleware packages by Uday Thakur.

---

## 💡 Why Obsidian?

**Obsidian** gets its name from the volcanic glass known for its sharp edges and clarity — just like how this library provides **sharp, clear error handling** for your APIs.

In geology, obsidian forms when lava cools rapidly, creating a material that's both beautiful and functional. Similarly, **@periodic/obsidian** was crafted through rapid iteration and real-world production experience to create something that's both elegant and practical.

The name represents:
- **Clarity**: Crystal-clear error messages and consistent structure
- **Sharpness**: Precise, type-safe error handling
- **Durability**: Production-tested and built to last
- **Natural**: Feels like a native part of your Express app

Just as ancient civilizations used obsidian for tools and weapons, modern developers can use **@periodic/obsidian** as their essential tool for building robust, production-ready APIs.

---

## 🎯 Why Choose Obsidian?

Building robust APIs requires consistent, type-safe error handling, but most solutions come with significant challenges:

- **Generic error packages** lack framework integration
- **Built-in solutions** don't provide enough structure  
- **Custom implementations** lead to inconsistent error responses
- **Missing TypeScript support** causes runtime errors

**Periodic Obsidian** provides the perfect solution:

✅ **60+ HTTP status code factories** for every standard status (100-511)  
✅ **Framework-agnostic core** with clean Express adapter  
✅ **TypeScript-first** with complete type safety  
✅ **Zero runtime dependencies for the core.** Express is a peer dependency used only by the Express adapter.  
✅ **Clean JSON serialization** - no stack traces in production  
✅ **Flexible error metadata** - codes, details, and custom fields  
✅ **Express middleware included** for automatic error handling  
✅ **Designed for production use** with a stable and predictable API.

---

## 📦 Installation

```bash
npm install @periodic/obsidian express
```

Or with yarn:

```bash
yarn add @periodic/obsidian express
```

**Peer Dependencies:**
- `express` ^4.0.0 || ^5.0.0

---

## 🚀 Quick Start

```typescript
import express from 'express';
import { obsidian, errorHandler } from '@periodic/obsidian';

const app = express();

// Throw errors anywhere in your routes
app.get('/users/:id', (req, res) => {
  const user = findUser(req.params.id);
  
  if (!user) {
    throw obsidian.notFound('User not found', {
      code: 'USER_NOT_FOUND',
      details: { userId: req.params.id }
    });
  }
  
  res.json(user);
});

// Handle all errors automatically
app.use(errorHandler());

app.listen(3000);
```

**Error Response:**
```json
{
  "status": 404,
  "message": "User not found",
  "code": "USER_NOT_FOUND",
  "details": {
    "userId": "123"
  }
}
```

---

## 🧠 Core Concepts

### The `obsidian` Object

- **`obsidian` is a factory namespace**
- It exposes one method per HTTP status code
- Each method returns an instance of `HttpError`
- **This is the primary API intended for application code**
- Covers all standard HTTP status codes (100–511)

**Typical usage:**
- Application code throws errors using `obsidian.*()`
- Keeps error creation consistent and readable

```typescript
throw obsidian.notFound('User not found');
throw obsidian.badRequest('Invalid input');
throw obsidian.unauthorized('Authentication required');
```

### The `HttpError` Class

- **`HttpError` is the single foundational error class in the library**
- All `obsidian.*()` methods internally create `HttpError` instances
- **Intended for:**
  - `instanceof HttpError` checks
  - Framework adapters and middleware
  - Advanced or non-standard error handling

**Design principle:**
> Users throw errors using `obsidian`, frameworks handle errors using `HttpError`.

```typescript
// Throwing (application code)
throw obsidian.notFound('User not found');

// Handling (middleware/framework code)
if (error instanceof HttpError) {
  res.status(error.status).json(error.toJSON());
}
```

---

## ✨ Features

### 🏷️ Complete Status Code Coverage

Every standard HTTP status code from 100 to 511:

```typescript
// 1xx Informational
obsidian.continue()
obsidian.processing()

// 2xx Success
obsidian.ok()
obsidian.created()

// 3xx Redirection
obsidian.movedPermanently()
obsidian.temporaryRedirect()

// 4xx Client Errors
obsidian.badRequest()
obsidian.unauthorized()
obsidian.forbidden()
obsidian.notFound()
obsidian.unprocessableEntity()

// 5xx Server Errors
obsidian.internalServerError()
obsidian.serviceUnavailable()
```

### 🎯 Rich Error Metadata

Add structured context to your errors:

```typescript
throw obsidian.unprocessableEntity('Validation failed', {
  code: 'VALIDATION_ERROR',
  details: {
    errors: [
      { field: 'email', message: 'Invalid email format' },
      { field: 'age', message: 'Must be 18 or older' }
    ]
  }
});
```

### 🛡️ Production-Ready Middleware

Built-in Express middleware with configurable options:

```typescript
app.use(errorHandler({
  // Include stack traces in development
  includeStack: process.env.NODE_ENV !== 'production',
  
  // Custom error logging
  logger: (error, req) => {
    console.error({
      error: error.message,
      path: req.path,
      method: req.method,
    });
  },
  
  // Transform error responses
  transform: (error) => ({
    ...error.toJSON(),
    timestamp: new Date().toISOString(),
  }),
}));
```

---

## 📚 Common Patterns

### 1. Authentication Errors

```typescript
import { obsidian } from '@periodic/obsidian';

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw obsidian.unauthorized('Authentication required', {
      code: 'NO_TOKEN'
    });
  }
  
  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    throw obsidian.unauthorized('Invalid or expired token', {
      code: 'INVALID_TOKEN'
    });
  }
}
```

### 2. Permission Checks

```typescript
function requireRole(role: string) {
  return (req, res, next) => {
    if (!req.user) {
      throw obsidian.unauthorized('Authentication required');
    }
    
    if (req.user.role !== role) {
      throw obsidian.forbidden('Insufficient permissions', {
        code: 'INSUFFICIENT_PERMISSIONS',
        details: {
          required: role,
          current: req.user.role
        }
      });
    }
    
    next();
  };
}

app.delete('/users/:id', requireRole('admin'), deleteUserHandler);
```

### 3. Validation Errors

```typescript
function validateUser(data: any) {
  const errors = [];
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }
  
  if (!data.age || data.age < 18) {
    errors.push({ field: 'age', message: 'Must be 18 or older' });
  }
  
  if (errors.length > 0) {
    throw obsidian.unprocessableEntity('Validation failed', {
      code: 'VALIDATION_ERROR',
      details: { errors }
    });
  }
}
```

### 4. Rate Limiting Integration

Works seamlessly with **@periodic/titanium**:

```typescript
import { rateLimit } from '@periodic/titanium';
import { obsidian } from '@periodic/obsidian';

app.use(rateLimit({
  redis,
  limit: 100,
  window: 60,
  keyPrefix: 'api',
  // Custom error handling
  onLimitExceeded: (req) => {
    throw obsidian.tooManyRequests('Rate limit exceeded', {
      code: 'RATE_LIMIT_EXCEEDED',
      details: { retryAfter: 60 }
    });
  }
}));
```

### 5. Resource Conflicts

```typescript
app.post('/users', async (req, res, next) => {
  try {
    const existing = await findUserByEmail(req.body.email);
    
    if (existing) {
      throw obsidian.conflict('Email already registered', {
        code: 'EMAIL_CONFLICT',
        details: { email: req.body.email }
      });
    }
    
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});
```

### 6. Domain-Specific Error Helpers

```typescript
export const UserErrors = {
  notFound: (userId: string) =>
    obsidian.notFound('User not found', {
      code: 'USER_NOT_FOUND',
      details: { userId }
    }),
    
  emailConflict: (email: string) =>
    obsidian.conflict('Email already registered', {
      code: 'EMAIL_CONFLICT',
      details: { email }
    }),
    
  invalidPassword: () =>
    obsidian.badRequest('Password must be at least 8 characters', {
      code: 'INVALID_PASSWORD'
    }),
};

// Usage
throw UserErrors.notFound('123');
```

---

## 🎛️ Configuration Options

### Error Handler Middleware

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeStack` | `boolean` | `false` (prod) | Include stack traces in responses |
| `logger` | `(error, req) => void` | - | Custom error logging function |
| `transform` | `(error) => object` | - | Transform error JSON response |

```typescript
import { errorHandler } from '@periodic/obsidian';

app.use(errorHandler({
  includeStack: process.env.NODE_ENV !== 'production',
  logger: (error, req) => {
    // Your logging logic (e.g., Sentry, DataDog)
  },
  transform: (error) => ({
    ...error.toJSON(),
    timestamp: new Date().toISOString(),
    requestId: req.id,
  }),
}));
```

### Simple Error Handler

For minimal setup:

```typescript
import { simpleErrorHandler } from '@periodic/obsidian';

// Only handles HttpError instances, passes others to next handler
app.use(simpleErrorHandler());

// Add your own fallback
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
});
```

---

## 📋 Status Code Reference

Obsidian provides factory helpers for every standard HTTP status code (100–511).

👉 **See the complete mapping here:** [STATUS_CODES.md](STATUS_CODES.md)

**Quick Reference:**

<details>
<summary><strong>1xx Informational (4 codes)</strong></summary>

```typescript
obsidian.continue()                    // 100
obsidian.switchingProtocols()          // 101
obsidian.processing()                  // 102
obsidian.earlyHints()                  // 103
```
</details>

<details>
<summary><strong>2xx Success (10 codes)</strong></summary>

```typescript
obsidian.ok()                          // 200
obsidian.created()                     // 201
obsidian.accepted()                    // 202
obsidian.noContent()                   // 204
// ... and 6 more
```
</details>

<details>
<summary><strong>3xx Redirection (8 codes)</strong></summary>

```typescript
obsidian.movedPermanently()            // 301
obsidian.found()                       // 302
obsidian.notModified()                 // 304
obsidian.temporaryRedirect()           // 307
// ... and 4 more
```
</details>

<details>
<summary><strong>4xx Client Errors — All standard codes</strong></summary>

```typescript
obsidian.badRequest()                  // 400
obsidian.unauthorized()                // 401
obsidian.forbidden()                   // 403
obsidian.notFound()                    // 404
obsidian.conflict()                    // 409
obsidian.unprocessableEntity()         // 422
obsidian.tooManyRequests()             // 429
// ... and 22 more
```
</details>

<details>
<summary><strong>5xx Server Errors — All standard codes</strong></summary>

```typescript
obsidian.internalServerError()         // 500
obsidian.notImplemented()              // 501
obsidian.badGateway()                  // 502
obsidian.serviceUnavailable()          // 503
obsidian.gatewayTimeout()              // 504
// ... and 6 more
```
</details>

---

## 🔧 API Reference

### `obsidian` Object

Main namespace with all error factory methods:

```typescript
import { obsidian } from '@periodic/obsidian';

obsidian.notFound(message?: string, options?: HttpErrorOptions)
obsidian.badRequest(message?: string, options?: HttpErrorOptions)
obsidian.unauthorized(message?: string, options?: HttpErrorOptions)
// ... all standard HTTP status codes
```

**Parameters:**
- `message` - Custom error message (optional, uses default if omitted)
- `options.code` - Machine-readable error code
- `options.details` - Additional error context

**Returns:** `HttpError` instance

### `HttpError` Class

Base error class:

```typescript
import { HttpError } from '@periodic/obsidian';

const error = new HttpError(404, 'Not found', {
  code: 'RESOURCE_NOT_FOUND',
  details: { resourceId: '123' }
});

// Properties
error.status    // 404
error.message   // 'Not found'
error.code      // 'RESOURCE_NOT_FOUND'
error.details   // { resourceId: '123' }

// Methods
error.toJSON()  // Serialize without stack trace
HttpError.getDefaultMessage(404) // 'Not Found'
```

### Middleware Functions

```typescript
import { errorHandler, simpleErrorHandler } from '@periodic/obsidian';

// Full-featured handler
errorHandler(options?: ExpressErrorHandlerOptions)

// Minimal handler  
simpleErrorHandler()
```

---

## 🌐 Framework Integration

### Express.js (Built-in)

```typescript
import express from 'express';
import { obsidian, errorHandler } from '@periodic/obsidian';

const app = express();

app.get('/users/:id', (req, res) => {
  throw obsidian.notFound('User not found');
});

app.use(errorHandler());
```

> **Note:** Obsidian is framework-agnostic. No official Fastify or NestJS adapters are provided yet; the examples below demonstrate manual integration.

### Fastify

```typescript
import Fastify from 'fastify';
import { HttpError, obsidian } from '@periodic/obsidian';

const fastify = Fastify();

fastify.get('/users/:id', async (request, reply) => {
  throw obsidian.notFound('User not found');
});

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof HttpError) {
    return reply.status(error.status).send(error.toJSON());
  }
  reply.status(500).send({ error: 'Internal Server Error' });
});
```

### NestJS

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { obsidian } from '@periodic/obsidian';

@Controller('users')
export class UsersController {
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    
    if (!user) {
      throw obsidian.notFound('User not found', {
        code: 'USER_NOT_FOUND'
      });
    }
    
    return user;
  }
}
```

---

## 🛠️ Production Recommendations

### Error Response Structure

```typescript
// Development (with includeStack: true)
{
  "status": 500,
  "message": "Database connection failed",
  "code": "DB_CONNECTION_ERROR",
  "details": { ... },
  "stack": "Error: Database connection failed\n    at ..."
}

// Production (with includeStack: false)
{
  "status": 500,
  "message": "Internal Server Error"
}
```

### Logging Best Practices

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

app.use(errorHandler({
  logger: (error, req) => {
    if (error instanceof HttpError && error.status >= 500) {
      // Log server errors with full context
      logger.error({
        message: error.message,
        code: error.code,
        path: req.path,
        method: req.method,
        stack: error.stack,
      });
    } else if (error instanceof HttpError) {
      // Log client errors without stack
      logger.warn({
        message: error.message,
        code: error.code,
        path: req.path,
      });
    }
  },
}));
```

### Environment-Specific Configuration

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';

app.use(errorHandler({
  includeStack: isDevelopment,
  logger: isDevelopment
    ? (error) => console.error(error)
    : (error) => logToSentry(error),
}));
```

### Recommended Error Codes

Use consistent, descriptive error codes:

```typescript
// Authentication & Authorization
'AUTH_TOKEN_MISSING'
'AUTH_TOKEN_INVALID'
'AUTH_TOKEN_EXPIRED'
'PERMISSION_DENIED'

// Validation
'VALIDATION_ERROR'
'INVALID_EMAIL'
'INVALID_PASSWORD'

// Resources
'USER_NOT_FOUND'
'RESOURCE_NOT_FOUND'
'EMAIL_CONFLICT'

// Business Logic
'INSUFFICIENT_BALANCE'
'ORDER_ALREADY_PROCESSED'
'SUBSCRIPTION_EXPIRED'
```

---

## 🎨 TypeScript Support

Full TypeScript support with complete type safety:

```typescript
import type { 
  HttpError, 
  HttpErrorOptions, 
  HttpErrorJSON 
} from '@periodic/obsidian';

function handleError(error: unknown) {
  if (error instanceof HttpError) {
    console.log(error.status);    // number
    console.log(error.message);   // string
    console.log(error.code);      // string | undefined
    console.log(error.details);   // unknown
    
    const json: HttpErrorJSON = error.toJSON();
  }
}
```

---

## 🧩 Architecture

```
@periodic/obsidian/
├── src/
│   ├── core/                  # Framework-agnostic
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── status-codes.ts   # HTTP status codes
│   │   ├── http-error.ts     # Base error class
│   │   └── factories.ts      # Error factories
│   ├── adapters/              # Framework integration
│   │   └── express.ts        # Express middleware
│   └── index.ts               # Public API
```

**Design Philosophy:**
- **Core** is pure TypeScript with no framework dependencies
- **Adapters** connect core to specific frameworks
- Easy to extend for other frameworks (Koa, Hapi, etc.)
- Can be used in non-Express applications via the core module

---

## 📈 Performance

Obsidian is designed for minimal overhead:

- **Zero runtime dependencies** (except Express peer dependency)
- **Lazy initialization** of error objects
- **Efficient serialization** without unnecessary cloning
- **No I/O operations** in error creation path
- **Lightweight** - less than 10KB gzipped

---

## 🚫 Explicit Non-Goals

This package **intentionally does not** include:

❌ Error tracking/monitoring (use Sentry, Datadog, etc.)  
❌ Internationalization (handle in your application layer)  
❌ Request validation (use Joi, Yup, Zod, etc.)  
❌ Automatic retry logic  
❌ Circuit breakers  
❌ In-built logging (provide your own logger)

Focus on doing one thing well: **structured HTTP error handling**.

---

## 🤝 Related Packages

Part of the **Periodic** series by Uday Thakur:

- [**@periodic/titanium**](https://www.npmjs.com/package/@periodic/titanium) - Redis-backed rate limiting middleware
- [**@periodic/osmium**](https://www.npmjs.com/package/@periodic/osmium) - Redis caching middleware for Express

Build complete, production-ready APIs with the Periodic series!

---

## 📖 Documentation

- [Quick Start Guide](QUICKSTART.md)
- [Installation Guide](INSTALLATION.md)
- [Setup Guide](SETUP.md)
- [Status Code Reference](STATUS_CODES.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Note:** All tests are comprehensive and achieve >95% code coverage.

---

## 📝 License

MIT © [Uday Thakur](LICENSE)

---

## 🙏 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Code of conduct
- Development setup
- Pull request process
- Coding standards

---

## 📞 Support

- 📧 **Email:** udaythakurwork@gmail.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/periodic-obsidian/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/periodic-obsidian/discussions)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you build better APIs!

---

**Built with ❤️ by Uday Thakur for production-grade Node.js applications**