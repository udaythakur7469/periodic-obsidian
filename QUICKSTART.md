# Quick Start Guide

Get up and running with **@periodic/obsidian** in 5 minutes.

## Installation

```bash
npm install @periodic/obsidian express
```

---

## Basic Example

Create a simple Express app with error handling:

```typescript
import express from 'express';
import { obsidian, errorHandler } from '@periodic/obsidian';

const app = express();

// Your routes
app.get('/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'John Doe' };
  
  if (!user) {
    // Throw a 404 error
    throw obsidian.notFound('User not found');
  }
  
  res.json(user);
});

// Error handling middleware (must be last)
app.use(errorHandler());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

**That's it!** Your API now has consistent error handling.

---

## Common Use Cases

### 1. Simple 404 Error

```typescript
app.get('/products/:id', (req, res) => {
  const product = findProduct(req.params.id);
  
  if (!product) {
    throw obsidian.notFound('Product not found');
  }
  
  res.json(product);
});
```

**Response:**
```json
{
  "status": 404,
  "message": "Product not found"
}
```

### 2. Error with Metadata

```typescript
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
```

**Response:**
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

### 3. Validation Errors

```typescript
app.post('/users', (req, res) => {
  const errors = [];
  
  if (!req.body.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  }
  
  if (!req.body.password || req.body.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be 8+ characters' });
  }
  
  if (errors.length > 0) {
    throw obsidian.unprocessableEntity('Validation failed', {
      code: 'VALIDATION_ERROR',
      details: { errors }
    });
  }
  
  // Create user...
  res.status(201).json({ message: 'User created' });
});
```

**Response:**
```json
{
  "status": 422,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "errors": [
      { "field": "email", "message": "Email is required" },
      { "field": "password", "message": "Password must be 8+ characters" }
    ]
  }
}
```

### 4. Authentication

```typescript
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
    throw obsidian.unauthorized('Invalid token', {
      code: 'INVALID_TOKEN'
    });
  }
}

app.get('/profile', requireAuth, (req, res) => {
  res.json(req.user);
});
```

### 5. Authorization

```typescript
function requireAdmin(req, res, next) {
  if (!req.user) {
    throw obsidian.unauthorized('Authentication required');
  }
  
  if (req.user.role !== 'admin') {
    throw obsidian.forbidden('Admin access required', {
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }
  
  next();
}

app.delete('/users/:id', requireAuth, requireAdmin, (req, res) => {
  // Delete user...
  res.json({ message: 'User deleted' });
});
```

---

## All Available Errors

### Common 4xx Errors

```typescript
obsidian.badRequest()           // 400
obsidian.unauthorized()         // 401
obsidian.forbidden()            // 403
obsidian.notFound()             // 404
obsidian.methodNotAllowed()     // 405
obsidian.conflict()             // 409
obsidian.unprocessableEntity()  // 422
obsidian.tooManyRequests()      // 429
```

### Common 5xx Errors

```typescript
obsidian.internalServerError()  // 500
obsidian.notImplemented()       // 501
obsidian.badGateway()           // 502
obsidian.serviceUnavailable()   // 503
obsidian.gatewayTimeout()       // 504
```

**See [README](README.md#available-status-codes) for all 62 status codes.**

---

## Middleware Configuration

### Development Mode (with stack traces)

```typescript
app.use(errorHandler({
  includeStack: true
}));
```

### Production Mode (hide stack traces)

```typescript
app.use(errorHandler({
  includeStack: false
}));
```

### With Custom Logging

```typescript
app.use(errorHandler({
  logger: (error, req) => {
    console.error({
      error: error.message,
      path: req.path,
      method: req.method
    });
  }
}));
```

### Environment-Aware

```typescript
app.use(errorHandler({
  includeStack: process.env.NODE_ENV !== 'production',
  logger: (error, req) => {
    if (error.status >= 500) {
      // Log server errors to external service
      logToSentry(error);
    }
  }
}));
```

---

## Async/Await Pattern

### Manual Error Handling

```typescript
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.users.findById(req.params.id);
    
    if (!user) {
      throw obsidian.notFound('User not found');
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

### Async Wrapper Helper

```typescript
// Create a helper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Use it
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await db.users.findById(req.params.id);
  
  if (!user) {
    throw obsidian.notFound('User not found');
  }
  
  res.json(user);
}));
```

---

## TypeScript Usage

```typescript
import { obsidian, HttpError, errorHandler } from '@periodic/obsidian';
import type { HttpErrorOptions } from '@periodic/obsidian';

// Type-safe error creation
const error: HttpError = obsidian.notFound('Not found');

// Type-safe options
const options: HttpErrorOptions = {
  code: 'RESOURCE_NOT_FOUND',
  details: { resourceId: '123' }
};

// Error handler with types
app.use(errorHandler({
  logger: (error: Error, req: express.Request) => {
    console.error(error);
  }
}));
```

---

## Testing Your Errors

```typescript
import request from 'supertest';
import { app } from './app';

describe('Error Handling', () => {
  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/users/999')
      .expect(404);
    
    expect(response.body).toEqual({
      status: 404,
      message: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  });
});
```

---

## Domain-Specific Errors

Create reusable error helpers:

```typescript
// errors.ts
import { obsidian } from '@periodic/obsidian';

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
    })
};

// Use in routes
app.post('/users', async (req, res) => {
  const existing = await findUserByEmail(req.body.email);
  
  if (existing) {
    throw UserErrors.emailConflict(req.body.email);
  }
  
  // Create user...
});
```

---

## Complete Example

```typescript
import express from 'express';
import { obsidian, errorHandler } from '@periodic/obsidian';

const app = express();
app.use(express.json());

// Mock database
const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'user' }
];

// Auth middleware
function requireAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    throw obsidian.unauthorized('Authentication required');
  }
  
  req.user = user;
  next();
}

// Routes
app.get('/users', requireAuth, (req, res) => {
  res.json(users);
});

app.get('/users/:id', requireAuth, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    throw obsidian.notFound('User not found', {
      code: 'USER_NOT_FOUND',
      details: { userId: req.params.id }
    });
  }
  
  res.json(user);
});

app.post('/users', requireAuth, (req, res) => {
  // Validate
  if (!req.body.email || !req.body.name) {
    throw obsidian.badRequest('Email and name are required');
  }
  
  // Check for conflict
  const existing = users.find(u => u.email === req.body.email);
  if (existing) {
    throw obsidian.conflict('Email already registered', {
      code: 'EMAIL_CONFLICT',
      details: { email: req.body.email }
    });
  }
  
  const newUser = {
    id: String(users.length + 1),
    name: req.body.name,
    email: req.body.email,
    role: 'user'
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Error handler (must be last)
app.use(errorHandler({
  includeStack: process.env.NODE_ENV !== 'production'
}));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## Next Steps

- **[Read the full documentation](README.md)** for advanced features
- **[Explore examples](examples/usage.ts)** for more patterns
- **[Setup your project](SETUP.md)** for production
- **[Check the API reference](README.md#api-reference)** for all methods

---

**Ready to build robust APIs! 🚀**