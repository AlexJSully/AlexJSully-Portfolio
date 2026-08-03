# App Directory (Next.js)

The portfolio uses Next.js App Router, where file names in [src/app/](../../src/app/layout.tsx) define routes and special behaviors. This follows Next.js convention-based routing rather than explicit route configuration.

## App Router Conventions

**File-Based Routing:** Next.js maps file names to functionality:

- `layout.tsx` - Wraps all child routes with shared UI and metadata
- `page.tsx` - Defines the `/` route content
- `error.tsx` - Catches errors in route segments
- `global-error.tsx` - Catches errors in root layout
- `not-found.tsx` - Handles 404 pages
- `loading.tsx` - Displays while routes load
- `manifest.ts` - Generates PWA manifest `/manifest.webmanifest`
- `robots.ts` - Generates `/robots.txt` for SEO

**Server by Default:** Components in [src/app/](../../src/app/layout.tsx) are React Server Components unless marked with `'use client'`. This minimizes client JavaScript.

## Component Hierarchy

```mermaid
flowchart TD
    accTitle: App Router Component Hierarchy
    accDescr: layout.tsx wraps all routes, provides metadata and JSON-LD structured data, and renders ThemeRegistry, ServiceWorkerRegister, and SpeedInsights. ThemeRegistry wraps GeneralLayout, which contains Navbar, Footer, StarsBackground and CookieSnackbar. page.tsx renders Banner, ProjectsGrid, and Publications
    Layout[layout.tsx] -->|Wraps| Page[page.tsx]
    Layout -->|Provides| Metadata[SEO & Metadata]
    Layout -->|Emits| JSONLD[JSON-LD structured data]
    Layout -->|Renders| TR[ThemeRegistry]
    Layout -->|Renders| SW[ServiceWorkerRegister]
    Layout -->|Renders| SI[SpeedInsights]
    TR -->|Wraps| GL[GeneralLayout]
    GL -->|Contains| Navbar
    GL -->|Contains| Footer
    GL -->|Contains| Stars[StarsBackground]
    GL -->|Contains| Cookie[CookieSnackbar]
    Page -->|Renders| Banner
    Page -->|Renders| Projects[ProjectsGrid]
    Page -->|Renders| Pubs[Publications]
```

The root layout wraps GeneralLayout in [ThemeRegistry](../../src/components/ThemeRegistry.tsx), so the MUI theme reaches every component while the client boundary stays at that one provider. GeneralLayout then supplies navigation, footer, background, and cookie consent for all pages.

## Root Layout

**Metadata Configuration:** The layout exports a metadata object with SEO tags, OpenGraph, Twitter Cards, and PWA manifest path. Keywords are imported from [src/data/keywords.ts](../../src/data/keywords.ts).

**Viewport Setup:** Defines theme color (#131518), an initial scale of 1 at device width, and `colorScheme: 'dark'`, which tells the browser to render form controls and scrollbars in their dark variants.

**Structured Data:** The layout serializes three JSON-LD blocks into a `<script type='application/ld+json'>` in the body: a `Person` entry carrying the profile links, employer, and alma mater; an `FAQPage` entry answering questions about projects, contact, and employment status; and a `WebPage` entry naming the CSS selectors a voice assistant should read aloud. Search engines read these; nothing in the application does.

**GeneralLayout:** Wraps children with [GeneralLayout](../../src/layouts/GeneralLayout.tsx) which provides navigation, footer, stars background, and cookie consent.

**Global Styles:** Imports [globals.scss](../../src/styles/globals.scss) for application-wide CSS.

**Service Worker:** Registers the service worker for PWA functionality.

**Analytics:** Includes Vercel SpeedInsights for performance tracking.

Implementation: [src/app/layout.tsx](../../src/app/layout.tsx)

## Home Page

The home page ([src/app/page.tsx](../../src/app/page.tsx)) is a client component (`'use client'`) that initializes services on mount:

**Firebase Initialization:** Calls `init()` from [src/configs/firebase.ts](../../src/configs/firebase.ts) to start analytics and performance tracking.

**Console Logo:** Debounced ASCII art logged to browser console via [ascii helper](../../src/helpers/ascii.ts).

**Content Rendering:** Displays Banner, ProjectsGrid, and Publications components in vertical stack.

Implementation: [src/app/page.tsx](../../src/app/page.tsx)

## Special Route Handlers

**PWA Manifest** ([src/app/manifest.ts](../../src/app/manifest.ts)) - Generates `/manifest.webmanifest` with app name, icons, theme colors, and display mode. See [PWA Documentation](./pwa.md).

**Robots.txt** ([src/app/robots.ts](../../src/app/robots.ts)) - Generates `/robots.txt` allowing all crawlers with sitemap URL for SEO.

## Error Handling

**Error Boundary** ([src/app/error.tsx](../../src/app/error.tsx)) - Catches errors in route segments and displays fallback UI with a "Go Home" button. It writes the error to the browser console and shows `error.message`, falling back to "Unknown error." when the message is empty.

**Global Error** ([src/app/global-error.tsx](../../src/app/global-error.tsx)) - Catches errors in root layout, including its own `<html>` and `<body>` tags since layout errors prevent normal rendering. It reports the error to Sentry with `Sentry.captureException`.

The two differ in where the error goes: only the global boundary reports to Sentry, because a failure in the root layout is the one the application cannot otherwise surface. Both are client components that accept an `error` prop, and both render the same "Go Home" link, which reloads the page instead of navigating when the reader is already at `/`.

## Loading & 404

**Loading UI** ([src/app/loading.tsx](../../src/app/loading.tsx)) - Shows MUI CircularProgress spinner centered on screen while routes load.

**Not Found** ([src/app/not-found.tsx](../../src/app/not-found.tsx)) - Custom 404 page displaying pathname and navigation button back to home.

Implementation: [src/app/loading.tsx](../../src/app/loading.tsx), [src/app/not-found.tsx](../../src/app/not-found.tsx)

## Related Documentation

- [Architecture Overview](./index.md) - System architecture
- [Layouts Documentation](./layouts.md) - GeneralLayout details
- [PWA Documentation](./pwa.md) - Service worker and manifest
