/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

// Core Workbox modules:
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
// Google Analytics
import * as googleAnalytics from 'workbox-google-analytics'
// Navigation preload
import * as navigationPreload from 'workbox-navigation-preload'
// Recipes
import { googleFontsCache, imageCache, offlineFallback, pageCache, staticResourceCache } from 'workbox-recipes'
// Offline fallback
import { setDefaultHandler } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'

clientsClaim()

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST)

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Offline Google Analytics
// Want offline analytics for your offline PWA? No problem.
googleAnalytics.initialize()

// Enable navigation preload.
navigationPreload.enable()

// Offline preload
setDefaultHandler(new NetworkOnly())

offlineFallback()

// Page caching
pageCache()

// Static resources cache
staticResourceCache()

// Image caching
imageCache()

// Fonts caching
googleFontsCache()
