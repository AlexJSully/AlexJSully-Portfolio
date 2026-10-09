# System Architecture Overview

AlexJSully's Portfolio is a Next.js portfolio application that uses server-side rendering (SSR) and React Server Components (RSC) to deliver a fast, SEO-friendly experience. The architecture separates concerns into components, data, configuration, and utilities.

## Technology Stack

- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript (strict mode)
- **UI Library:** Material-UI (MUI) with Emotion for styling
- **Testing:** Jest (unit), Cypress (E2E with accessibility testing)
- **Error Tracking:** Sentry for server and edge errors, and for browser errors once Analytics is allowed
- **Analytics:** Firebase Analytics and Performance Monitoring, once Analytics is allowed
- **PWA:** Service worker for offline support, once Offline access is allowed, and app installation

## Architectural Patterns

The codebase follows these design patterns:

**Static Data as Code:** Project and publication data lives in TypeScript files ([src/data/](../../src/data/projects.ts)) rather than a database. This enables type safety, compile-time validation, and fast builds without runtime queries.

**Centralized Constants:** Timing values, thresholds, and configuration live in [src/constants/index.ts](../../src/constants/index.ts) using TypeScript's `as const` for literal types. This allows tuning behavior without hunting through components.

**Path Aliases:** TypeScript path mapping (`@components`, `@data`, `@helpers`) eliminates brittle relative imports and makes refactoring safer.

Implementation: [src/app/layout.tsx](../../src/app/layout.tsx), [src/app/page.tsx](../../src/app/page.tsx)

## System Flow

The application follows this request lifecycle:

```mermaid
flowchart TD
    accTitle: System Request Lifecycle
    accDescr: Request flow showing how a browser request passes through the proxy to the Next.js server, is rendered using static data, and is hydrated on the client, where the service worker and Firebase start only once the visitor allows them
    Browser[User Browser] -->|HTTP Request| Proxy["Proxy: redirects, rewrites, Accept negotiation"]
    Proxy --> NextJS[Next.js Server]
    NextJS -->|SSR| Layout[Render Root Layout]
    Layout -->|Nest| Page[Render Page]
    Page -->|Renders| Components[React Components]
    Components -->|Import| Data[Static Data Files]
    Components -->|HTML| Browser
    Browser -->|Client Hydration| ClientInit[Initialize Client Features]
    ClientInit -->|Reads| Consent[Consent choices]
    Consent -->|Offline access allowed| SW[Service Worker]
    Consent -->|Analytics allowed| Firebase[Firebase SDK]
    Firebase -->|Track| Analytics[User Events]
```

**Request Flow:**

1. Browser requests page; [src/proxy.ts](../../src/proxy.ts) redirects or rewrites known paths and picks the HTML or Markdown representation (see [Agent Readiness](./agent-readiness.md)), and the Next.js server handles the rest
2. Server renders root layout with metadata (SEO, OpenGraph, PWA manifest)
3. Child components (e.g. ProjectsGrid, Publications) import static data from [src/data/](../../src/data/projects.ts); the root layout imports SEO keywords
4. Components receive type-safe data and render to HTML
5. Browser receives HTML and hydrates React components
6. [ConsentedServices](../../src/components/consent/services/ConsentedServices.tsx) starts Firebase analytics once the visitor allows Analytics and registers the service worker once they allow Offline access (see [Consent](./consent.md))
7. With Analytics allowed, user interactions trigger analytics events

**Key Behaviors:**

- **No Database Queries:** All data is imported at build time from TypeScript files
- **Progressive Enhancement:** Content renders without JavaScript; interactivity enhances experience
- **Offline Support:** Service worker caches assets for offline use

Implementation: [src/app/page.tsx](../../src/app/page.tsx), [src/layouts/GeneralLayout.tsx](../../src/layouts/GeneralLayout.tsx)

## Module Organization

**Components** ([src/components/](../../src/components/banner/Banner.tsx)) contain UI logic and rendering. See [Component Documentation](./components/index.md).

**Constants** ([src/constants/index.ts](../../src/constants/index.ts), [src/constants/routes.ts](../../src/constants/routes.ts)) centralize timing, thresholds, configuration values, and site paths. See [Constants Documentation](./constants.md).

**Data** ([src/data/](../../src/data/projects.ts)) stores typed project, publication, and metadata. See [Data Architecture](./data.md).

**Helpers** ([src/helpers/](../../src/helpers/aaaahhhh.ts)) provide reusable logic like Easter egg transformations and ASCII art. See [Helpers Documentation](./helpers.md).

**Utils** ([src/util/](../../src/util/isNetworkFast.ts)) contain network checks and other utilities. See [Utils Documentation](./utils.md).

**Configs** ([src/configs/](../../src/configs/firebase.ts)) manage Firebase, browser Sentry, and environment setup. See [Configs Documentation](./configs.md).

## Related Docs

- [Usage Guides](../usage/index.md)
- [Component Documentation](./components/index.md)
- [Agent Readiness](./agent-readiness.md)
- [Consent](./consent.md)
