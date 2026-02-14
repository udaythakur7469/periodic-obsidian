# Contributing to Periodic Obsidian

First off, thank you for considering contributing to Periodic Obsidian! It's people like you that make this package better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to udaythakurwork@gmail.com.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples** - Include code snippets, error messages, etc.
* **Describe the behavior you observed and what you expected to see**
* **Include environment details** - Node.js version, Express version, OS, etc.

**Bug Report Template:**

```markdown
**Description:**
A clear description of the bug

**To Reproduce:**
1. Step 1
2. Step 2
3. See error

**Expected Behavior:**
What you expected to happen

**Actual Behavior:**
What actually happened

**Environment:**
- Node.js version:
- Express version:
- @periodic/obsidian version:
- OS:

**Additional Context:**
Any other relevant information
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List any alternatives you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies:** `npm install`
3. **Make your changes** in the appropriate files
4. **Add tests** for any new functionality
5. **Ensure all tests pass:** `npm test`
6. **Run the linter:** `npm run lint`
7. **Format your code:** `npm run format`
8. **Update documentation** if needed
9. **Commit your changes** with a clear message
10. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/periodic-obsidian.git
cd periodic-obsidian

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Build the package
npm run build
```

## Project Structure

```
periodic-obsidian/
├── src/
│   ├── core/              # Framework-agnostic core
│   │   ├── types.ts
│   │   ├── status-codes.ts
│   │   ├── http-error.ts
│   │   └── factories.ts
│   ├── adapters/          # Framework adapters
│   │   └── express.ts
│   └── index.ts           # Public API
├── tests/                 # Test files
│   └── obsidian.test.ts
├── examples/              # Usage examples
│   └── usage.ts
```

## Coding Guidelines

### TypeScript

- Use TypeScript strict mode
- Provide complete type definitions
- Avoid `any` types when possible
- Document public APIs with JSDoc comments

### Code Style

- Follow the existing code style
- Use Prettier for formatting (auto-formatted on commit)
- Use ESLint rules (enforced by CI)
- Maximum line length: 100 characters

### Naming Conventions

- **Variables/Functions:** camelCase
- **Classes:** PascalCase
- **Constants:** UPPER_SNAKE_CASE
- **Interfaces:** PascalCase with descriptive names
- **Files:** kebab-case.ts

### Comments

- Write self-documenting code when possible
- Add comments for complex logic
- Use JSDoc for public APIs
- Keep comments up-to-date with code changes

### Example

```typescript
/**
 * Creates an HTTP 404 Not Found error
 * 
 * @param message - Custom error message
 * @param options - Error metadata
 * @returns HttpError instance
 * 
 * @example
 * ```ts
 * throw notFound('User not found', {
 *   code: 'USER_NOT_FOUND',
 *   details: { userId: '123' }
 * });
 * ```
 */
export function notFound(
  message?: string,
  options?: HttpErrorOptions
): HttpError {
  return new HttpError(404, message || 'Not Found', options);
}
```

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Maintain or improve code coverage (target: >95%)
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

### Test Structure

```typescript
describe('Feature Name', () => {
  describe('specific functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = setupTestData();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- obsidian.test.ts
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(core): add payloadTooLarge factory method

Add factory method for HTTP 413 Payload Too Large status code
with proper documentation and tests.

Closes #42
```

```
fix(express): correct error handler type definitions

Update ExpressErrorHandlerOptions interface to properly
type the logger callback function.

Fixes #38
```

## Documentation

### README Updates

- Update README.md for new features
- Add examples for new functionality
- Keep feature lists up-to-date

### Code Documentation

- Add JSDoc comments for public APIs
- Include usage examples in comments
- Document complex algorithms

### Changelog

- Update CHANGELOG.md for all changes
- Follow Keep a Changelog format
- Group changes by type (Added, Changed, Fixed, etc.)

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md with release notes
3. Create a git tag: `git tag -a v0.1.0 -m "Release 0.1.0"`
4. Push tag: `git push origin v0.1.0`
5. GitHub Actions will automatically publish to npm

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in GitHub Discussions
- Email: udaythakurwork@gmail.com

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (coming soon)

Thank you for contributing to Periodic Obsidian! 🎉