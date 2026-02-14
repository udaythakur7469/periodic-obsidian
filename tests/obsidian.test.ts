import { HttpError } from '../src/core/http-error';
import { obsidian } from '../src';

describe('HttpError', () => {
  describe('constructor', () => {
    it('should create an error with status and message', () => {
      const error = new HttpError(404, 'Not found');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HttpError);
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.name).toBe('HttpError');
    });

    it('should create an error with code option', () => {
      const error = new HttpError(404, 'User not found', {
        code: 'USER_NOT_FOUND',
      });

      expect(error.status).toBe(404);
      expect(error.message).toBe('User not found');
      expect(error.code).toBe('USER_NOT_FOUND');
    });

    it('should create an error with details option', () => {
      const details = { userId: '123', timestamp: Date.now() };
      const error = new HttpError(400, 'Invalid request', {
        details,
      });

      expect(error.status).toBe(400);
      expect(error.details).toEqual(details);
    });

    it('should create an error with both code and details', () => {
      const error = new HttpError(422, 'Validation failed', {
        code: 'VALIDATION_ERROR',
        details: {
          errors: [
            { field: 'email', message: 'Invalid email' },
            { field: 'age', message: 'Must be 18+' },
          ],
        },
      });

      expect(error.status).toBe(422);
      expect(error.message).toBe('Validation failed');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toHaveProperty('errors');
    });

    it('should have a stack trace', () => {
      const error = new HttpError(500, 'Internal error');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('HttpError');
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON with status and message only', () => {
      const error = new HttpError(404, 'Not found');
      const json = error.toJSON();

      expect(json).toEqual({
        status: 404,
        message: 'Not found',
      });
      expect(json).not.toHaveProperty('stack');
    });

    it('should include code in JSON when present', () => {
      const error = new HttpError(404, 'Not found', {
        code: 'RESOURCE_NOT_FOUND',
      });
      const json = error.toJSON();

      expect(json).toEqual({
        status: 404,
        message: 'Not found',
        code: 'RESOURCE_NOT_FOUND',
      });
    });

    it('should include details in JSON when present', () => {
      const details = { userId: '123' };
      const error = new HttpError(404, 'User not found', { details });
      const json = error.toJSON();

      expect(json).toEqual({
        status: 404,
        message: 'User not found',
        details,
      });
    });

    it('should include both code and details when present', () => {
      const error = new HttpError(400, 'Bad request', {
        code: 'INVALID_INPUT',
        details: { field: 'email' },
      });
      const json = error.toJSON();

      expect(json).toEqual({
        status: 400,
        message: 'Bad request',
        code: 'INVALID_INPUT',
        details: { field: 'email' },
      });
    });

    it('should never include stack in JSON', () => {
      const error = new HttpError(500, 'Internal error', {
        code: 'SERVER_ERROR',
        details: { error: 'Database connection failed' },
      });
      const json = error.toJSON();

      expect(json).not.toHaveProperty('stack');
      expect(json).not.toHaveProperty('name');
    });

    it('should work with JSON.stringify', () => {
      const error = new HttpError(403, 'Forbidden', {
        code: 'ACCESS_DENIED',
      });
      const jsonString = JSON.stringify(error);
      const parsed = JSON.parse(jsonString);

      expect(parsed).toEqual({
        status: 403,
        message: 'Forbidden',
        code: 'ACCESS_DENIED',
      });
    });
  });

  describe('getDefaultMessage', () => {
    it('should return default message for known status codes', () => {
      expect(HttpError.getDefaultMessage(404)).toBe('Not Found');
      expect(HttpError.getDefaultMessage(500)).toBe('Internal Server Error');
      expect(HttpError.getDefaultMessage(400)).toBe('Bad Request');
      expect(HttpError.getDefaultMessage(403)).toBe('Forbidden');
    });

    it('should return "Unknown Error" for unknown status codes', () => {
      expect(HttpError.getDefaultMessage(999)).toBe('Unknown Error');
      expect(HttpError.getDefaultMessage(600)).toBe('Unknown Error');
    });
  });

  describe('instanceof checks', () => {
    it('should work correctly with instanceof', () => {
      const error = new HttpError(404, 'Not found');

      expect(error instanceof HttpError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should maintain instanceof after being thrown and caught', () => {
      try {
        throw new HttpError(404, 'Not found');
      } catch (error) {
        expect(error instanceof HttpError).toBe(true);
        expect(error instanceof Error).toBe(true);
      }
    });
  });
});

describe('Obsidian Factory Functions', () => {
  describe('Basic factory functionality', () => {
    it('should create HttpError instances', () => {
      const error = obsidian.notFound();

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should use default message when no message provided', () => {
      const error = obsidian.notFound();

      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
    });

    it('should use custom message when provided', () => {
      const error = obsidian.notFound('User not found');

      expect(error.status).toBe(404);
      expect(error.message).toBe('User not found');
    });

    it('should accept options object', () => {
      const error = obsidian.notFound('User not found', {
        code: 'USER_NOT_FOUND',
        details: { userId: '123' },
      });

      expect(error.status).toBe(404);
      expect(error.message).toBe('User not found');
      expect(error.code).toBe('USER_NOT_FOUND');
      expect(error.details).toEqual({ userId: '123' });
    });
  });

  describe('4xx Client Errors', () => {
    it('badRequest - 400', () => {
      const error = obsidian.badRequest('Invalid email format', {
        code: 'INVALID_EMAIL',
      });
      expect(error.status).toBe(400);
      expect(error.message).toBe('Invalid email format');
      expect(error.code).toBe('INVALID_EMAIL');
    });

    it('unauthorized - 401', () => {
      const error = obsidian.unauthorized('Authentication required');
      expect(error.status).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('forbidden - 403', () => {
      const error = obsidian.forbidden('Access denied');
      expect(error.status).toBe(403);
      expect(error.message).toBe('Access denied');
    });

    it('notFound - 404', () => {
      const error = obsidian.notFound('User not found', {
        code: 'USER_NOT_FOUND',
        details: { userId: '123' },
      });
      expect(error.status).toBe(404);
      expect(error.message).toBe('User not found');
      expect(error.code).toBe('USER_NOT_FOUND');
    });

    it('conflict - 409', () => {
      const error = obsidian.conflict('Email already exists');
      expect(error.status).toBe(409);
      expect(error.message).toBe('Email already exists');
    });

    it('unprocessableEntity - 422', () => {
      const error = obsidian.unprocessableEntity('Validation failed', {
        code: 'VALIDATION_ERROR',
        details: {
          errors: [{ field: 'email', message: 'Invalid email format' }],
        },
      });
      expect(error.status).toBe(422);
      expect(error.message).toBe('Validation failed');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('tooManyRequests - 429', () => {
      const error = obsidian.tooManyRequests('Rate limit exceeded', {
        details: { retryAfter: 60 },
      });
      expect(error.status).toBe(429);
      expect(error.message).toBe('Rate limit exceeded');
    });
  });

  describe('5xx Server Errors', () => {
    it('internalServerError - 500', () => {
      const error = obsidian.internalServerError('Database connection failed');
      expect(error.status).toBe(500);
      expect(error.message).toBe('Database connection failed');
    });

    it('notImplemented - 501', () => {
      const error = obsidian.notImplemented();
      expect(error.status).toBe(501);
      expect(error.message).toBe('Not Implemented');
    });

    it('badGateway - 502', () => {
      const error = obsidian.badGateway();
      expect(error.status).toBe(502);
      expect(error.message).toBe('Bad Gateway');
    });

    it('serviceUnavailable - 503', () => {
      const error = obsidian.serviceUnavailable('Maintenance in progress');
      expect(error.status).toBe(503);
      expect(error.message).toBe('Maintenance in progress');
    });

    it('gatewayTimeout - 504', () => {
      const error = obsidian.gatewayTimeout();
      expect(error.status).toBe(504);
      expect(error.message).toBe('Gateway Timeout');
    });
  });

  describe('Serialization', () => {
    it('should serialize correctly to JSON', () => {
      const error = obsidian.notFound('User not found', {
        code: 'USER_NOT_FOUND',
        details: { userId: '123' },
      });

      const json = error.toJSON();

      expect(json).toEqual({
        status: 404,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        details: { userId: '123' },
      });
      expect(json).not.toHaveProperty('stack');
    });

    it('should work with JSON.stringify', () => {
      const error = obsidian.badRequest('Invalid input', {
        code: 'VALIDATION_ERROR',
      });

      const jsonString = JSON.stringify(error);
      const parsed = JSON.parse(jsonString);

      expect(parsed.status).toBe(400);
      expect(parsed.message).toBe('Invalid input');
      expect(parsed.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Error throwing and catching', () => {
    it('should work correctly when thrown and caught', () => {
      try {
        throw obsidian.notFound('User not found');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        if (error instanceof HttpError) {
          expect(error.status).toBe(404);
          expect(error.message).toBe('User not found');
        }
      }
    });

    it('should preserve all properties when thrown', () => {
      try {
        throw obsidian.unprocessableEntity('Validation failed', {
          code: 'VALIDATION_ERROR',
          details: { field: 'email' },
        });
      } catch (error) {
        if (error instanceof HttpError) {
          expect(error.status).toBe(422);
          expect(error.code).toBe('VALIDATION_ERROR');
          expect(error.details).toEqual({ field: 'email' });
        }
      }
    });
  });
});