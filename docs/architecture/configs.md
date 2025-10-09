# Configs Module Documentation

This document describes configuration files and environment setup in AlexJSully's Portfolio project, their roles, technical details, and how to update or extend them.

## 📦 Purpose

Configs manage environment variables, service integrations, and global settings for the app. They enable features like Firebase, Sentry error tracking, and custom runtime options.

## 🏗️ Structure

- **Location:** `src/configs/`
- **Example files:**
    - `firebase.ts`: Firebase configuration and initialization
    - `firebase.test.ts`: Test configuration for Firebase
- **Related config files:**
    - `.env`: Environment variables (API keys, secrets)
    - `next.config.js`: Next.js build/runtime config
    - `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`: Sentry error tracking

## 🔍 Usage Examples

### Importing Firebase Config

```ts
import firebaseConfig from '@configs/firebase';

// Initialize Firebase app
```

### Using Environment Variables

```ts
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

### Sentry Configuration

```ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
```

### Next.js Config Example

```js
// next.config.js
module.exports = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
	},
};
```

## 🧩 Integration & Relationships

- Configs are imported by components, helpers, and backend logic for environment-specific behavior.
- Environment variables are loaded via `.env` and referenced in code using `process.env.*`.
- Sentry config files enable error tracking for client, server, and edge runtimes.

## 🛠️ Extending Configs

- Add new config files in `src/configs/` for new services.
- Update `.env` for new environment variables.
- Document config changes in `README.md` and relevant docs.

## 🔗 Related Docs

- [System Architecture](./index.md)

- [PWA Documentation](./pwa.md)

💡 **Tip:** Keep sensitive keys in `.env` and never commit them to version control. Document all config changes for maintainability.

## 🛠️ Practical Guidance

- Store sensitive keys and secrets in `.env` (never commit to git).
- Document required environment variables for contributors in README.md or a dedicated section.
- Update config files when adding new services or changing integrations.
- Validate config changes with `npm run validate`.
- For Sentry, update DSN and environment in all sentry config files and test error reporting.

## 🧩 Relationships

- Used by data modules, components, and Next.js for service integration.
- Sentry configs for error tracking.
- Firebase config for backend/data features.
