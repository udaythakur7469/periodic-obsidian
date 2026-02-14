# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-02-09

### Added
- Initial release of @periodic/obsidian
- Core `HttpError` class with clean JSON serialization
- 62 factory methods for all standard HTTP status codes (100-511)
- Express error handler middleware with configurable options
- Simple error handler for minimal setups
- TypeScript support with complete type definitions
- Framework-agnostic core architecture
- Comprehensive test suite with >95% coverage
- Production-ready logging integration
- Custom error transformation support
- Environment-specific stack trace handling

### Features
- **1xx Informational**: 4 status codes
- **2xx Success**: 10 status codes
- **3xx Redirection**: 8 status codes
- **4xx Client Errors**: 29 status codes
- **5xx Server Errors**: 11 status codes

### Documentation
- Comprehensive README with examples
- Quick start guide
- Installation guide
- Setup guide
- Project structure documentation
- Contributing guidelines
- 10 real-world usage examples

### Testing
- Unit tests for HttpError class
- Unit tests for all factory methods
- Integration tests for Express middleware
- Jest configuration with coverage thresholds

### Developer Experience
- ESLint configuration
- Prettier code formatting
- GitHub Actions CI/CD pipeline
- TypeScript strict mode enabled
- Zero runtime dependencies (except Express peer dependency)

## Development Notes

### Version Strategy
- **0.1.x**: Initial release and bug fixes
- **0.2.x**: Additional framework adapters (Fastify, NestJS)
- **0.3.x**: Advanced features (error transformers, plugins)
- **1.0.0**: Stable API, production-ready

### Compatibility
- Node.js >= 16.0.0
- Express >= 4.0.0 || 5.0.0
- TypeScript >= 5.0.0 (for development)

[Unreleased]: https://github.com/yourusername/periodic-obsidian/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/periodic-obsidian/releases/tag/v0.1.0