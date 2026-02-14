# Installation Guide

This guide covers everything you need to install and set up **@periodic/obsidian** in your project.

## Prerequisites

Before installing Periodic Obsidian, ensure you have:

- **Node.js** >= 16.0.0
- **npm** >= 7.0.0 (or yarn >= 1.22.0)
- **Express.js** >= 4.0.0 (peer dependency)

### Check Your Versions

```bash
node --version    # Should be v16.0.0 or higher
npm --version     # Should be 7.0.0 or higher
```

---

## Installation Methods

### Using npm

```bash
npm install @periodic/obsidian express
```

### Using yarn

```bash
yarn add @periodic/obsidian express
```

### Using pnpm

```bash
pnpm add @periodic/obsidian express
```

---

## Verify Installation

After installation, verify the package is installed correctly:

```bash
npm list @periodic/obsidian
```

You should see output similar to:

```
your-project@1.0.0 /path/to/your/project
└── @periodic/obsidian@0.1.0
```

---

## TypeScript Setup (Optional but Recommended)

If you're using TypeScript, no additional type definitions are needed. Periodic Obsidian includes built-in TypeScript declarations.

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "esModuleInterop": true,
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Verify TypeScript Types

Create a test file to verify types work:

```typescript
// test.ts
import { obsidian, HttpError } from '@periodic/obsidian';

const error: HttpError = obsidian.notFound('Test');
console.log(error.status); // TypeScript should recognize this
```

Run type checking:

```bash
npx tsc --noEmit test.ts
```

---

## Development vs Production

### Development Installation

For development, you might want to install additional dev dependencies:

```bash
npm install --save-dev @types/express @types/node typescript
```

### Production Installation

For production deployments, use:

```bash
npm install --production
# or
npm ci --production
```

This installs only production dependencies (not devDependencies).

---

## Framework-Specific Setup

### Express.js

Periodic Obsidian requires Express as a peer dependency:

```bash
npm install express @periodic/obsidian
```

**Minimum Express version:** 4.0.0

### Fastify

While Obsidian has built-in Express support, it works with Fastify too:

```bash
npm install fastify @periodic/obsidian
```

You'll need to create a custom error handler (see [Framework Integration](README.md#framework-integration)).

### NestJS

For NestJS projects:

```bash
npm install @nestjs/common @nestjs/core @periodic/obsidian
```

---

## Troubleshooting

### Peer Dependency Warnings

If you see warnings about peer dependencies:

```
npm WARN @periodic/obsidian@0.1.0 requires a peer of express@^4.0.0 || ^5.0.0
```

Install Express:

```bash
npm install express
```

### Module Not Found

If you get "Cannot find module '@periodic/obsidian'":

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check package.json:**
   Ensure `@periodic/obsidian` is listed in dependencies:
   ```json
   {
     "dependencies": {
       "@periodic/obsidian": "^0.1.0",
       "express": "^4.18.0"
     }
   }
   ```

### TypeScript Import Errors

If TypeScript can't find types:

1. **Ensure TypeScript is installed:**
   ```bash
   npm install --save-dev typescript
   ```

2. **Check tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true
     }
   }
   ```

3. **Restart TypeScript server** (in VS Code: Cmd/Ctrl + Shift + P → "Restart TS Server")

### Version Conflicts

If you have version conflicts with Express:

```bash
# Check installed versions
npm list express

# Update to compatible version
npm install express@^4.18.0
```

---

## Environment-Specific Notes

### Docker

In your `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

### AWS Lambda

For serverless environments:

```bash
# Use --production to minimize bundle size
npm install --production
```

### Vercel/Netlify

These platforms auto-install dependencies from `package.json`. Just ensure:

```json
{
  "dependencies": {
    "@periodic/obsidian": "^0.1.0",
    "express": "^4.18.0"
  }
}
```

---

## Upgrading

### From Pre-release Versions

If upgrading from a pre-release version:

```bash
npm install @periodic/obsidian@latest
```

### Check for Breaking Changes

Always check [CHANGELOG.md](CHANGELOG.md) before upgrading for breaking changes.

### Safe Upgrade Process

1. **Check current version:**
   ```bash
   npm list @periodic/obsidian
   ```

2. **Review changelog:**
   ```bash
   npm view @periodic/obsidian versions
   ```

3. **Update package.json:**
   ```json
   {
     "dependencies": {
       "@periodic/obsidian": "^0.2.0"
     }
   }
   ```

4. **Install and test:**
   ```bash
   npm install
   npm test
   ```

---

## Uninstalling

To remove Periodic Obsidian:

```bash
npm uninstall @periodic/obsidian
```

---

## Next Steps

After installation:

1. **Read the [Quick Start Guide](QUICKSTART.md)** for basic usage
2. **Review the [Setup Guide](SETUP.md)** for configuration
3. **Check out [Examples](examples/usage.ts)** for real-world patterns
4. **Read the [README](README.md)** for comprehensive documentation

---

## Getting Help

If you encounter issues:

- 📖 [Documentation](README.md)
- 🐛 [GitHub Issues](https://github.com/yourusername/periodic-obsidian/issues)
- 💬 [GitHub Discussions](https://github.com/yourusername/periodic-obsidian/discussions)
- 📧 Email: udaythakurwork@gmail.com

---

**Happy coding! 🚀**