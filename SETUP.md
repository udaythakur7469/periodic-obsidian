# Setup Guide

This guide walks you through setting up **@periodic/obsidian** for production use.

## Table of Contents

- [Basic Setup](#basic-setup)
- [Production Configuration](#production-configuration)
- [Environment Variables](#environment-variables)
- [Error Logging](#error-logging)
- [Monitoring & Alerting](#monitoring--alerting)
- [Best Practices](#best-practices)

---

## Basic Setup

### 1. Install Dependencies

```bash
npm install @periodic/obsidian express
```

### 2. Create Error Module

Create `src/errors.ts`:

```typescript
import { obsidian } from '@periodic/obsidian';

// Domain-specific error helpers
export const AppErrors = {
  // User errors
  userNotFound: (userId: string) =>
    obsidian.notFound('User not found', {
      code: 'USER_NOT_FOUND',
      details: { userId }
    }),
    
  emailConflict: (email: string) =>
    obsidian.conflict('Email already registered', {
      code: 'EMAIL_CONFLICT',
      details: { email }
    }),
  
  // Authentication errors
  invalidCredentials: () =>
    obsidian.unauthorized('Invalid email or password', {
      code: 'INVALID_CREDENTIALS'
    }),
    
  tokenExpired: () =>
    obsidian.unauthorized('Token has expired', {
      code: 'TOKEN_EXPIRED'
    }),
    
  // Authorization errors
  insufficientPermissions: (required: string, current: string) =>
    obsidian.forbidden('Insufficient permissions', {
      code: 'INSUFFICIENT_PERMISSIONS',
      details: { required, current }
    }),
    
  // Validation errors
  validationFailed: (errors: Array<{ field: string; message: string }>) =>
    obsidian.unprocessableEntity('Validation failed', {
      code: 'VALIDATION_ERROR',
      details: { errors }
    }),
};
```

### 3. Configure Error Handler

Create `src/middleware/error-handler.ts`:

```typescript
import { errorHandler } from '@periodic/obsidian';
import { logger } from '../utils/logger';

export const configureErrorHandler = () => {
  return errorHandler({
    // Include stack traces only in development
    includeStack: process.env.NODE_ENV !== 'production',
    
    // Custom logging
    logger: (error, req) => {
      const logData = {
        error: error.message,
        code: error.code,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
        timestamp: new Date().toISOString(),
      };
      
      if (error.status >= 500) {
        logger.error('Server error', { ...logData, stack: error.stack });
      } else {
        logger.warn('Client error', logData);
      }
    },
    
    // Transform response (optional)
    transform: (error) => ({
      ...error.toJSON(),
      timestamp: new Date().toISOString(),
      requestId: process.env.REQUEST_ID, // If using request tracking
    }),
  });
};
```

### 4. Apply to Express App

Create or update `src/app.ts`:

```typescript
import express from 'express';
import { configureErrorHandler } from './middleware/error-handler';

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes
import { userRoutes } from './routes/users';
app.use('/api/users', userRoutes);

// Error handler (MUST BE LAST)
app.use(configureErrorHandler());

export { app };
```

---

## Production Configuration

### Environment-Specific Setup

Create `src/config/error-config.ts`:

```typescript
interface ErrorConfig {
  includeStack: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableSentry: boolean;
  sentryDsn?: string;
}

export const errorConfig: ErrorConfig = {
  includeStack: process.env.NODE_ENV !== 'production',
  logLevel: process.env.LOG_LEVEL as any || 'info',
  enableSentry: process.env.ENABLE_SENTRY === 'true',
  sentryDsn: process.env.SENTRY_DSN,
};
```

### Advanced Error Handler

```typescript
import { errorHandler, HttpError } from '@periodic/obsidian';
import * as Sentry from '@sentry/node';
import { errorConfig } from '../config/error-config';
import { logger } from '../utils/logger';

export const advancedErrorHandler = () => {
  return errorHandler({
    includeStack: errorConfig.includeStack,
    
    logger: (error, req) => {
      const context = {
        error: error.message,
        code: error instanceof HttpError ? error.code : undefined,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id,
        requestId: req.id,
      };
      
      // Log based on severity
      if (error.status >= 500) {
        logger.error('Server error', { ...context, stack: error.stack });
        
        // Send to Sentry for 5xx errors
        if (errorConfig.enableSentry) {
          Sentry.captureException(error, {
            tags: {
              path: req.path,
              method: req.method,
            },
            user: req.user ? {
              id: req.user.id,
              email: req.user.email,
            } : undefined,
          });
        }
      } else if (error.status >= 400) {
        logger.warn('Client error', context);
      }
    },
    
    transform: (error) => {
      const response = error.toJSON();
      
      // Add additional fields in production
      if (process.env.NODE_ENV === 'production') {
        return {
          ...response,
          timestamp: new Date().toISOString(),
          // Don't include sensitive details in production
          details: error.status >= 500 ? undefined : response.details,
        };
      }
      
      return {
        ...response,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      };
    },
  });
};
```

---

## Environment Variables

Create `.env` file:

```bash
# Application
NODE_ENV=production
PORT=3000

# Logging
LOG_LEVEL=info

# Error Tracking
ENABLE_SENTRY=true
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Request Tracking (optional)
ENABLE_REQUEST_ID=true
```

Create `.env.development`:

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
ENABLE_SENTRY=false
```

---

## Error Logging

### Winston Setup

Install Winston:

```bash
npm install winston
```

Create `src/utils/logger.ts`:

```typescript
import winston from 'winston';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format,
  defaultMeta: { service: 'api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// If not production, log to console with pretty format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    ),
  }));
}
```

---

## Monitoring & Alerting

### Sentry Integration

Install Sentry:

```bash
npm install @sentry/node
```

Configure Sentry in `src/config/sentry.ts`:

```typescript
import * as Sentry from '@sentry/node';
import { errorConfig } from './error-config';

export const initSentry = () => {
  if (errorConfig.enableSentry && errorConfig.sentryDsn) {
    Sentry.init({
      dsn: errorConfig.sentryDsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      
      // Filter out client errors
      beforeSend(event, hint) {
        const error = hint.originalException;
        
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          // Don't send 4xx errors to Sentry
          if (status >= 400 && status < 500) {
            return null;
          }
        }
        
        return event;
      },
    });
  }
};
```

Initialize in `src/server.ts`:

```typescript
import { initSentry } from './config/sentry';

// Initialize Sentry before app
initSentry();

import { app } from './app';

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Health Check Endpoint

Add health check to monitor error handler:

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

---

## Best Practices

### 1. Consistent Error Codes

Use a consistent naming convention:

```typescript
// Good
'USER_NOT_FOUND'
'EMAIL_CONFLICT'
'INVALID_CREDENTIALS'
'INSUFFICIENT_PERMISSIONS'

// Avoid
'userNotFound'
'email_already_exists'
'BadCredentials'
```

### 2. Don't Leak Sensitive Information

```typescript
// Bad - leaks internal details
throw obsidian.internalServerError('Database connection failed: ' + dbError.message);

// Good - generic message for 5xx errors
throw obsidian.internalServerError('An unexpected error occurred');
```

### 3. Use Appropriate Status Codes

```typescript
// Authentication - 401
throw obsidian.unauthorized('Invalid token');

// Authorization - 403
throw obsidian.forbidden('Admin access required');

// Not found - 404
throw obsidian.notFound('User not found');

// Validation - 422
throw obsidian.unprocessableEntity('Validation failed');

// Server error - 500
throw obsidian.internalServerError('Unexpected error');
```

### 4. Structure Error Details

```typescript
// Good - structured details
throw obsidian.unprocessableEntity('Validation failed', {
  code: 'VALIDATION_ERROR',
  details: {
    errors: [
      { field: 'email', message: 'Invalid format' },
      { field: 'age', message: 'Must be 18+' }
    ]
  }
});

// Avoid - unstructured details
throw obsidian.unprocessableEntity('Invalid email and age');
```

### 5. Error Handler Placement

```typescript
// CORRECT - Error handler is last
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use(errorHandler()); // Last

// WRONG - Routes after error handler won't work
app.use(errorHandler());
app.use('/api/users', userRoutes); // Won't be reached
```

### 6. Async Error Handling

```typescript
// Option 1: Manual try-catch
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.users.findById(req.params.id);
    if (!user) throw obsidian.notFound('User not found');
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Option 2: Async wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) throw obsidian.notFound('User not found');
  res.json(user);
}));
```

---

## Testing Setup

### Test Configuration

Create `tests/setup.ts`:

```typescript
import { errorHandler } from '@periodic/obsidian';

export const createTestErrorHandler = () => {
  return errorHandler({
    includeStack: true,
    logger: () => {}, // Silent in tests
  });
};
```

### Example Test

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('Error Handling', () => {
  it('should return 404 with proper structure', async () => {
    const response = await request(app)
      .get('/api/users/999')
      .expect(404);
    
    expect(response.body).toMatchObject({
      status: 404,
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    });
  });
  
  it('should return validation errors', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid' })
      .expect(422);
    
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(response.body.details.errors).toBeDefined();
  });
});
```

---

## Docker Setup

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start app
CMD ["node", "dist/server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
      - ENABLE_SENTRY=true
      - SENTRY_DSN=${SENTRY_DSN}
    volumes:
      - ./logs:/app/logs
```

---

## Next Steps

- **[Read the API documentation](README.md)** for all features
- **[Check examples](examples/usage.ts)** for more patterns
- **[Review best practices](README.md#production-recommendations)** for production

---

**Your error handling is now production-ready! 🎉**