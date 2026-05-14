# Service Worker Implementation

This file documents the service worker implementation used by the site.

## Where it lives

- Service worker file: `public/sw.js`
- Registration client: `src/components/ServiceWorkerRegister.tsx`
- Root layout also renders `ServiceWorkerRegister` in `src/app/layout.tsx`.

## Behavior summary

- The service worker precaches a small set of core assets (`/`, `/manifest.webmanifest`, `/icon/favicon.ico`).
- Navigation requests (HTML) use a **network-first** strategy with a cache fallback.
- Static assets use a **cache-first** with background stale-while-revalidate update flow.
- The worker skips cross-origin requests, Next.js dev paths (`/_next/`) and API calls.

## How the app registers the service worker

The app registers the SW from [src/components/ServiceWorkerRegister.tsx](../../src/components/ServiceWorkerRegister.tsx), a client component included in the root layout.

The component calls `navigator.serviceWorker.register('/sw.js')` inside a `useEffect`. On failure it retries up to `MAX_SW_RETRIES` (3) times with linear backoff starting at `INITIAL_RETRY_DELAY` (1000 ms), clearing any pending retry on unmount.

Implementation: [ServiceWorkerRegister.tsx](../../src/components/ServiceWorkerRegister.tsx)

## Customizing caching

Edit `public/sw.js` to change `PRECACHE_URLS`, cache names, or strategy. Keep the SW path at `/sw.js` to match the registration call.
