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

The app registers the SW from a client component that runs inside the browser:

```tsx
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered with scope', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);

  return null;
}
```

The home page (`src/app/page.tsx`) also attempts to register the same `'/sw.js'` as a defensive measure for client navigations.

## Customizing caching

Edit `public/sw.js` to change `PRECACHE_URLS`, cache names, or strategy. Keep the SW path at `/sw.js` to match the registration call.
