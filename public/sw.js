const CACHE_NAME = 'alexjsully-portfolio';
const RUNTIME_CACHE = 'runtime-cache';

// Assets to cache immediately
const PRECACHE_URLS = ['/', '/manifest.webmanifest', '/icon/favicon.ico'];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - Network First strategy for HTML, Stale-While-Revalidate for others
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip caching for:
    // 1. Non-GET requests (POST, PUT, DELETE, etc. can't be cached)
    // 2. Cross-origin requests
    // 3. Next.js development URLs
    // 4. Analytics and tracking requests
    // 5. API calls
    if (
        request.method !== 'GET' ||
        !request.url.startsWith(self.location.origin) ||
        url.pathname.includes('__nextjs') ||
        url.pathname.includes('/_next/') ||
        url.pathname.includes('/api/')
    ) {
        return;
    }

    // For navigation requests (HTML), try network first, fall back to cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Only cache successful responses
                    if (response.ok) {
                        // Always clone before putting into cache to avoid "body used" errors
                        const forCache = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(request, forCache).catch(() => {
                                // Silently fail if caching doesn't work
                            });
                        });
                    }
                    return response;
                })
                .catch(async () => {
                    const response = await caches.match(request);
                    return response || caches.match('/');
                })
        );
        return;
    }

    // For static assets (images, css, js), try cache first, then network
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Update cache in background (stale-while-revalidate)
                fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            // Clone before caching to avoid "Response body is already used"
                            const forCache = response.clone();
                            caches.open(RUNTIME_CACHE).then((cache) => {
                                cache.put(request, forCache).catch(() => {
                                    // Silently fail if caching doesn't work
                                });
                            });
                        }
                    })
                    .catch(() => {
                        // Silently fail if network request fails
                    });
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(request).then((response) => {
                if (response.ok) {
                    // Clone immediately before any async work to ensure body isn't consumed
                    const forCache = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, forCache).catch(() => {
                            // Silently fail if caching doesn't work
                        });
                    });
                }
                return response;
            });
        })
    );
});
