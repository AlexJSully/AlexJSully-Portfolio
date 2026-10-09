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
    - [`next.config.js`](../../next.config.js): Next.js build and runtime config, covered under [Next.js configuration](#nextjs-configuration) below
    - [`sentry.server.config.ts`](../../sentry.server.config.ts), [`sentry.edge.config.ts`](../../sentry.edge.config.ts): Sentry error tracking
    - [`src/instrumentation.ts`](../../src/instrumentation.ts), [`src/instrumentation-client.ts`](../../src/instrumentation-client.ts): Next.js Instrumentation hooks for Sentry

## Usage Examples

### Firebase configuration and usage

The runtime `src/configs/firebase.ts` exposes two named functions. `init()` has one caller, [`ConsentedServices`](../../src/components/consent/services/ConsentedServices.tsx), which runs it only once the visitor allows Analytics (see [Consent](./consent.md)). Before Analytics starts, `init()` sets Google Consent Mode with analytics storage granted and `ad_storage`, `ad_user_data`, and `ad_personalization` denied, and it starts Analytics with `allow_google_signals` and `allow_ad_personalization_signals` set to `false`, so no advertising use can be switched on from the Google Analytics admin settings. The Firebase SDK is imported inside `init()` rather than at the top of the module, so a visitor who never allows Analytics never downloads it; repeated calls share the first call's work, and a failed load, such as one a content blocker stops, is retried by the next call. `logAnalyticsEvent()` does nothing until `init()` has finished.

```ts
import { logAnalyticsEvent } from '@configs/firebase';

// Log analytics events anywhere in the app; does nothing until Analytics is allowed
logAnalyticsEvent('my_event', { foo: 'bar' });
```

There is no default export in the implementation. Use the named exports above.

### Using Environment Variables

```ts
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

### Sentry Configuration

Sentry is initialized on the server only, via two `sentry.*.config.ts` files at the project root and two Next.js Instrumentation hooks. Nothing initializes Sentry in the browser, so no error report or session data leaves a visitor's device; see [Consent](./consent.md).

- [`sentry.server.config.ts`](../../sentry.server.config.ts) - Server-side initialization
- [`sentry.edge.config.ts`](../../sentry.edge.config.ts) - Edge runtime initialization
- [`src/instrumentation.ts`](../../src/instrumentation.ts) - Next.js `register()` hook that loads the server or edge Sentry config based on the `NEXT_RUNTIME` environment variable; also exports `onRequestError = Sentry.captureRequestError` for automatic request error capture
- [`src/instrumentation-client.ts`](../../src/instrumentation-client.ts) - Exports `onRouterTransitionStart = Sentry.captureRouterTransitionStart`; with no client initialization it records nothing

All `Sentry.*` integrations are imported directly from `@sentry/nextjs`, and `withSentryConfig` from its `@sentry/nextjs/config` subpath.

### Next.js configuration

[`next.config.js`](../../next.config.js) carries three concerns beyond the framework defaults.

**Security headers.** Every route is served with `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `X-Frame-Options: DENY`, a one-year `Strict-Transport-Security` with `includeSubDomains` and `preload`, `Referrer-Policy: same-origin`, and a `Permissions-Policy` that grants fullscreen, picture-in-picture, spatial tracking, gamepad, HID, idle detection, and window management. The `/sw.js` route adds its own set, described in [Service Worker Implementation](./service-worker.md).

**Image handling.** `disableStaticImages` is on, because SVGs are compiled by `@svgr/webpack` through the `turbopack.rules` entry and no other image type is imported statically. Turning it off would restore Next's ambient `*.svg` declaration, which conflicts with the one in [`types/svg.d.ts`](../../types/svg.d.ts). Remote images are allowed only from `alexjsully.me`, with a 1800-second minimum cache lifetime.

**Sentry wrapping.** The exported config is the bare `nextConfig` when `NEXT_PUBLIC_ENVIRONMENT` equals `development`, and `withSentryConfig(nextConfig, ...)` otherwise. Source maps upload to the organization named by `NEXT_PUBLIC_SENTRY_ORG` under the fixed project `personal-portfolio`.

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
