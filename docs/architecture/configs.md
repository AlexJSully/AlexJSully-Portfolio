# Configs Module Documentation

This document describes configuration files and environment setup in AlexJSully's Portfolio project, their roles, technical details, and how to update or extend them.

## Purpose

Configs manage environment variables, service integrations, and global settings for the app. They enable features like Firebase, Sentry error tracking, and custom runtime options.

## Structure

- **Location:** `src/configs/`
- **Example files:**
    - `firebase.ts`: Firebase configuration and initialization
    - `firebase.test.ts`: Test configuration for Firebase
- **Related config files:**
    - `.env`: Environment variables (API keys, secrets)
    - [`next.config.js`](../../next.config.js): Next.js build/runtime config
    - [`sentry.client.config.ts`](../../sentry.client.config.ts), [`sentry.server.config.ts`](../../sentry.server.config.ts), [`sentry.edge.config.ts`](../../sentry.edge.config.ts): Sentry error tracking

## Usage Examples

### Firebase configuration and usage

The runtime `src/configs/firebase.ts` exposes two named functions you should use from the app:

```ts
import { init, logAnalyticsEvent } from '@configs/firebase';

// Initialize Firebase (call once on app start)
init();

// Log analytics events anywhere in the app
logAnalyticsEvent('my_event', { foo: 'bar' });
```

There is no default export in the implementation — use the named exports above.

### Using Environment Variables

```ts
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

### Sentry Configuration

Sentry is configured via the repository's `sentry.*.config.ts` files. Use Sentry's Next.js SDK initialization patterns in those files; the app uses the standard `@sentry/nextjs` entrypoints. Example usage in application code:

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

## Integration & Relationships

- Configs are imported by components, helpers, and backend logic for environment-specific behavior.
- Environment variables are loaded via `.env` and referenced in code using `process.env.*`.
- Sentry config files enable error tracking for client, server, and edge runtimes.

## Extending Configs

- Add new config files in `src/configs/` for new services.
- Update `.env` for new environment variables.
- Document config changes in `README.md` and relevant docs.

## Related Docs

- [System Architecture](./index.md)
- [PWA Documentation](./pwa.md)
