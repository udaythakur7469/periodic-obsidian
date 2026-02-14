/**
 * Comprehensive usage examples for @periodic/obsidian
 * 
 * This file demonstrates 10 different use cases for the HTTP error library
 */

import express from 'express';
import { obsidian, HttpError, errorHandler } from '../src';

// ============================================================================
// Example 1: Basic Error Throwing
// ============================================================================

function example1_basicUsage() {
  const app = express();

  app.get('/users/:id', (req, res) => {
    const user = findUser(req.params.id);
    
    if (!user) {
      throw obsidian.notFound('User not found');
    }
    
    res.json(user);
  });

  app.use(errorHandler());
}

// ============================================================================
// Example 2: Errors with Metadata
// ============================================================================

function example2_withMetadata() {
  const app = express();

  app.get('/users/:id', async (req, res, next) => {
    try {
      const user = await fetchUser(req.params.id);
      
      if (!user) {
        throw obsidian.notFound('User not found', {
          code: 'USER_NOT_FOUND',
          details: { userId: req.params.id },
        });
      }
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  app.use(errorHandler());
}

// ============================================================================
// Example 3: Validation Errors
// ============================================================================

interface CreateUserDTO {
  email: string;
  password: string;
  age: number;
}

function example3_validation() {
  const app = express();
  app.use(express.json());

  app.post('/users', (req, res, next) => {
    try {
      const errors = [];
      
      if (!req.body.email || !isValidEmail(req.body.email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
      }
      
      if (!req.body.password || req.body.password.length < 8) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
      }
      
      if (!req.body.age || req.body.age < 18) {
        errors.push({ field: 'age', message: 'Must be 18 or older' });
      }
      
      if (errors.length > 0) {
        throw obsidian.unprocessableEntity('Validation failed', {
          code: 'VALIDATION_ERROR',
          details: { errors },
        });
      }
      
      const user = createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

  app.use(errorHandler());
}

// ============================================================================
// Example 4: Authentication Middleware
// ============================================================================

function example4_authentication() {
  const app = express();

  function requireAuth(req: any, res: any, next: any) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw obsidian.unauthorized('Authentication token required', {
        code: 'NO_TOKEN',
      });
    }
    
    try {
      const decoded = verifyJWT(token);
      req.user = decoded;
      next();
    } catch (error) {
      throw obsidian.unauthorized('Invalid or expired token', {
        code: 'INVALID_TOKEN',
      });
    }
  }

  app.get('/protected', requireAuth, (req: any, res) => {
    res.json({ message: 'Access granted', user: req.user });
  });

  app.use(errorHandler());
}

// ============================================================================
// Example 5: Authorization/Permissions
// ============================================================================

function example5_authorization() {
  const app = express();

  function requireRole(role: string) {
    return (req: any, res: any, next: any) => {
      if (!req.user) {
        throw obsidian.unauthorized('Authentication required');
      }
      
      if (req.user.role !== role) {
        throw obsidian.forbidden('Insufficient permissions', {
          code: 'INSUFFICIENT_PERMISSIONS',
          details: {
            required: role,
            current: req.user.role,
          },
        });
      }
      
      next();
    };
  }

  app.delete('/users/:id', requireRole('admin'), (req, res) => {
    deleteUser(req.params.id);
    res.json({ message: 'User deleted' });
  });

  app.use(errorHandler());
}

// ============================================================================
// Example 6: Rate Limiting
// ============================================================================

function example6_rateLimiting() {
  const app = express();
  const rateLimits = new Map();

  function rateLimit(maxRequests = 100, windowMs = 60000) {
    return (req: any, res: any, next: any) => {
      const key = req.ip;
      const now = Date.now();
      
      if (!rateLimits.has(key)) {
        rateLimits.set(key, { count: 0, resetTime: now + windowMs });
      }
      
      const limit = rateLimits.get(key);
      
      if (now > limit.resetTime) {
        limit.count = 0;
        limit.resetTime = now + windowMs;
      }
      
      if (limit.count >= maxRequests) {
        const retryAfter = Math.ceil((limit.resetTime - now) / 1000);
        
        throw obsidian.tooManyRequests('Rate limit exceeded', {
          code: 'RATE_LIMIT_EXCEEDED',
          details: {
            limit: maxRequests,
            remaining: 0,
            retryAfter,
          },
        });
      }
      
      limit.count++;
      next();
    };
  }

  app.use('/api', rateLimit(100, 60000));

  app.use(errorHandler());
}

// ============================================================================
// Example 7: Domain-Specific Error Helpers
// ============================================================================

class UserErrors {
  static notFound(userId: string) {
    return obsidian.notFound('User not found', {
      code: 'USER_NOT_FOUND',
      details: { userId },
    });
  }

  static emailConflict(email: string) {
    return obsidian.conflict('Email already registered', {
      code: 'EMAIL_CONFLICT',
      details: { email },
    });
  }

  static invalidPassword() {
    return obsidian.badRequest('Password must be at least 8 characters', {
      code: 'INVALID_PASSWORD',
    });
  }
}

function example7_domainErrors() {
  const app = express();

  app.post('/users', async (req, res, next) => {
    try {
      const existing = await findUserByEmail(req.body.email);
      
      if (existing) {
        throw UserErrors.emailConflict(req.body.email);
      }
      
      if (req.body.password.length < 8) {
        throw UserErrors.invalidPassword();
      }
      
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

  app.use(errorHandler());
}

// ============================================================================
// Example 8: Custom Error Handler with Logging
// ============================================================================

function example8_customLogging() {
  const app = express();

  app.use(errorHandler({
    logger: (error, req) => {
      console.error({
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });
    },
  }));
}

// ============================================================================
// Example 9: Environment-Specific Error Handling
// ============================================================================

function example9_environmentSpecific() {
  const app = express();

  const isDevelopment = process.env.NODE_ENV === 'development';

  app.use(errorHandler({
    includeStack: isDevelopment,
    logger: isDevelopment
      ? (error, req) => console.error(error)
      : (error, req) => {
          // Production: log to external service
          logToSentry(error, { path: req.path });
        },
  }));
}

// ============================================================================
// Example 10: Multiple Error Handlers
// ============================================================================

function example10_multipleHandlers() {
  const app = express();

  // First: Handle HttpError instances
  app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json(err.toJSON());
    }
    next(err);
  });

  // Second: Handle specific error types
  app.use((err: any, req: any, res: any, next: any) => {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 400,
        message: 'Validation failed',
        errors: err.errors,
      });
    }
    next(err);
  });

  // Third: Fallback error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unexpected error:', err);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  });
}

// ============================================================================
// Helper Functions (Mock implementations)
// ============================================================================

function findUser(id: string): any {
  return null;
}

async function fetchUser(id: string): Promise<any> {
  return null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createUser(data: any): any {
  return { id: '123', ...data };
}

function verifyJWT(token: string): any {
  return { id: '123', role: 'user' };
}

function deleteUser(id: string): void {
  // Mock implementation
}

async function findUserByEmail(email: string): Promise<any> {
  return null;
}

function logToSentry(error: Error, context: any): void {
  // Mock implementation
}

export {
  example1_basicUsage,
  example2_withMetadata,
  example3_validation,
  example4_authentication,
  example5_authorization,
  example6_rateLimiting,
  example7_domainErrors,
  example8_customLogging,
  example9_environmentSpecific,
  example10_multipleHandlers,
};