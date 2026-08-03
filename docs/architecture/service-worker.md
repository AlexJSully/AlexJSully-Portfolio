# Service Worker Implementation

The site caches itself through a hand-written service worker, which is what makes a return visit render without the network and a navigation survive an offline moment. This document covers where the worker lives, which strategy it applies to which request, and how the app installs it.

## Where it lives

- Service worker file: [sw.js](../../public/sw.js), served from the public directory at `/sw.js`
- Registration client: [ServiceWorkerRegister.tsx](../../src/components/ServiceWorkerRegister.tsx)
- The root layout ([layout.tsx](../../src/app/layout.tsx)) renders `ServiceWorkerRegister` once, so registration happens on every route.

## Behavior summary

- The service worker precaches a small set of core assets (`/`, `/manifest.webmanifest`, `/icon/favicon.ico`).
- Navigation requests (HTML) use a **network-first** strategy with a cache fallback.
- Static assets use a **cache-first** with background stale-while-revalidate update flow.
- The worker skips non-GET requests, cross-origin requests, Next.js paths (`/_next/`, `__nextjs`) and API calls (`/api/`).

## How the app registers the service worker

The app registers the SW from [src/components/ServiceWorkerRegister.tsx](../../src/components/ServiceWorkerRegister.tsx), a client component included in the root layout.

The component calls `navigator.serviceWorker.register('/sw.js')` inside a `useEffect`. On failure it retries up to `MAX_SW_RETRIES` (3) times with linear backoff starting at `INITIAL_RETRY_DELAY` (1000 ms), clearing any pending retry on unmount.

Implementation: [ServiceWorkerRegister.tsx](../../src/components/ServiceWorkerRegister.tsx)

## Cache lifecycle

Two caches are in play: `alexjsully-portfolio` holds the precached core assets, and `runtime-cache` accumulates everything the fetch handler stores as it is requested. On `install` the worker precaches the core set and calls `skipWaiting()`, so a new worker takes over without waiting for open tabs to close. On `activate` it deletes every cache whose name is neither of those two, then calls `clients.claim()` to start controlling pages already open. Renaming a cache is therefore the mechanism for invalidating it: the next activation sees the old name as unrecognized and removes it.

## Customizing caching

Change `PRECACHE_URLS`, the cache names, or the strategy in [sw.js](../../public/sw.js). Keep the path at `/sw.js`, since [ServiceWorkerRegister.tsx](../../src/components/ServiceWorkerRegister.tsx) registers that literal path and [next.config.js](../../next.config.js) sets `Service-Worker-Allowed: /` and `Cache-Control: public, max-age=0, must-revalidate` on that exact route, so the browser revalidates the worker on every load rather than serving a stale copy.

## Related Documentation

- [PWA Documentation](./pwa.md) - Manifest, installability, and icons
- [Components Overview](./components/index.md) - Where ServiceWorkerRegister sits among the components
