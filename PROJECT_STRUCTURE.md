# Project Structure

This document explains the organization and architecture of **@periodic/obsidian**.

## Overview

Periodic Obsidian follows a clean, modular architecture that separates framework-agnostic core logic from framework-specific adapters.

```
periodic-obsidian/
├── src/                           # TypeScript source code
│   ├── core/                      # Framework-agnostic core
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── status-codes.ts       # HTTP status codes and messages
│   │   ├── http-error.ts         # Base HttpError class
│   │   └── factories.ts          # Error factory functions
│   ├── adapters/                  # Framework-specific adapters
│   │   └── express.ts            # Express.js middleware
│   └── index.ts                   # Public API exports
│
├── tests/                         # Test suite
│   └── obsidian.test.ts          # Comprehensive unit tests
│
├── examples/                      # Usage examples
│   └── usage.ts                   # 10 real-world examples
│
├── .github/                       # GitHub configuration
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline
│
├── dist/                          # Build output (generated)
│   ├── index.js                  # CommonJS build
│   ├── index.mjs                 # ESM build
│   └── index.d.ts                # TypeScript declarations
│
├── package.json                   # Package manifest
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest test configuration
├── .eslintrc.js                   # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── .gitignore                     # Git ignore rules
├── .npmignore                     # npm publish ignore rules
│
├── README.md                      # Main documentation
├── CHANGELOG.md                   # Version history
├── CONTRIBUTING.md                # Contribution guidelines
├── INSTALLATION.md                # Installation guide
├── QUICKSTART.md                  # Quick start guide
├── SETUP.md                       # Setup and configuration
├── PROJECT_STRUCTURE.md           # This file
└── LICENSE                        # MIT License
```

---

## Design Principles

1. **Framework-Agnostic Core**: Business logic has zero dependencies on frameworks
2. **Adapter Pattern**: Framework-specific code isolated in adapters
3. **Type Safety**: Full TypeScript coverage with strict mode
4. **Simplicity**: Clear, readable code over clever abstractions
5. **Zero Dependencies**: No runtime dependencies except peer dependencies

---

## Module Details

### Core Modules (`src/core/`)

#### types.ts
- TypeScript interfaces and type definitions
- Exports: `HttpErrorOptions`, `HttpErrorJSON`
- No dependencies

#### status-codes.ts
- All HTTP status codes (100-511)
- Default status messages
- Exports: `HttpStatusCode`, `HttpStatusMessage`

#### http-error.ts
- Base `HttpError` class
- Clean JSON serialization
- Stack trace management

#### factories.ts
- 62 factory functions for all status codes
- Consistent error creation pattern
- Uses HttpError class internally

### Adapters (`src/adapters/`)

#### express.ts
- Express middleware integration
- Configurable error handling
- Logging and transformation support

### Public API (`src/index.ts`)

Single entry point that exports:
- Core classes and types
- `obsidian` namespace with all factories
- Express middleware functions

---

## Dependency Flow

```
types.ts (foundation)
    ↓
status-codes.ts
    ↓
http-error.ts
    ↓
factories.ts → index.ts (obsidian namespace)
    ↓
express.ts → index.ts (middleware)
```

---

## Extension Points

### Adding New Frameworks

Create new adapter in `src/adapters/`:
```typescript
// src/adapters/fastify.ts
import { HttpError } from '../core/http-error';

export function fastifyErrorHandler() {
  // Fastify-specific implementation
}
```

### Adding New Features

1. Write tests first
2. Implement in appropriate module
3. Export from index.ts
4. Update documentation

---

**For detailed architecture information, see [README](README.md#architecture)**