# AlexJSully Portfolio - AI Coding Agent Instructions

## Architecture Overview

This is a **Next.js portfolio website** using the **App Router** (not Pages Router), React, TypeScript, and Material-UI with Emotion. The project follows a modular structure with path aliases, comprehensive testing, and Progressive Web App (PWA) capabilities.

### Key Technologies & Integrations
- **Framework**: Next.js App Router with React Server Components
- **Styling**: Material-UI (MUI) + Emotion (use `sx` prop, not CSS modules)
- **Testing**: Jest (unit tests), Cypress (E2E tests with accessibility via cypress-axe)
- **Monitoring**: Sentry error tracking, Firebase Analytics/Performance, Vercel Speed Insights
- **PWA**: Service Worker in `public/sw.js`, manifest via `src/app/manifest.ts`

## Critical Workflows

### Development Commands
```bash
npm run dev               # Start dev server at localhost:3000
npm run validate          # Full CI check: prettier → eslint → tsc → jest → cypress → build → markdown
npm run test:jest         # Unit tests only
npm run test:cypress:e2e  # E2E tests headless
npm run build             # Production build
```

**Always run `npm run validate` before committing.** This is the comprehensive quality gate used in CI/CD.

### Testing Requirements
- **Unit tests**: Every component requires a `.test.tsx` file (see `src/components/banner/Banner.test.tsx`)
- **Test setup**: Uses `jest/setup.ts` with jsdom environment
- **E2E tests**: Located in `cypress/e2e/`, include accessibility tests (cypress-axe)
- **Coverage**: Run `npm run test:jest:coverage` for coverage reports

## Project-Specific Conventions

### Path Aliases (Critical!)
Always use TypeScript path aliases defined in `tsconfig.json`:
```typescript
import Avatar from '@components/banner/Avatar';     // NOT '../components/banner/Avatar'
import { DELAYS } from '@constants/index';          // NOT '../../constants'
import { isNetworkFast } from '@util/isNetworkFast';
```

### Component Patterns

#### Material-UI Styling
Use `sx` prop for styling, never inline styles or CSS modules:
```typescript
<Box
  component='div'
  sx={{
    display: 'flex',
    margin: '3rem auto',
    fontSize: 'clamp(1.5rem, 2.5rem, 2.5rem)',
  }}
>
```

#### SVG Icons Pattern
SVGs are imported as React components via `@svgr/webpack`. See `src/images/icons.tsx`:
```typescript
import Icon from './icons/example.svg';
export const ExampleIcon = (props: SvgIconProps) =>
  <SvgIcon component={Icon} inheritViewBox {...props} />;
```

### Data Management
Static data lives in `src/data/`:
- `projects.ts`: Project portfolio with typed interface
- `publications.ts`: Academic publications
- `socials.ts`: Social media links
- `keywords.ts`: SEO keywords array

### Constants Pattern
Centralized constants in `src/constants/index.ts` with `as const` for type safety:
```typescript
DELAYS.PROJECT_HOVER_VIDEO  // 1000ms before video plays on hover
THRESHOLDS.SNEEZE_TRIGGER_INTERVAL  // Easter egg triggers
NETWORK.SLOW_DOWNLINK_THRESHOLD  // Network performance checks
```

## Code Style & Quality

### Linting & Formatting
- **Indentation**: Tabs (not spaces) - enforced by ESLint
- **Line length**: No hard limit, use Prettier
- **Import sorting**: Handled by `@trivago/prettier-plugin-sort-imports`
- **Unused vars**: Prefix with `_` to ignore (e.g., `_unusedParam`)

### ESLint Rules (see `eslint.config.js`)
- Tabs for indentation (indent: ['error', 'tab'])
- Console logs allowed (`no-console: off`)
- Unused vars with `_` prefix ignored
- React hooks exhaustive deps enforced

### TypeScript
- **Strict mode**: Enabled in `tsconfig.json`
- **No implicit any**: All types must be explicit
- **React 19**: Uses new `react-jsx` transform
- Run `npm run tsc` to check types (no emit)

## Next.js App Router Specifics

### Metadata & SEO
All metadata configured in `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: { template: `%s | ${metadataValues.title}`, default: metadataValues.title },
  keywords: seoKeywords,
  openGraph: { ... },
  robots: { index: true, follow: true },
};
```

### Server Components vs Client Components
- Default: Server Components (no `'use client'`)
- Client-only: Components with hooks, event handlers, browser APIs
- Example client component: `src/components/ServiceWorkerRegister.tsx`

### Security Headers
CSP and security headers configured in `next.config.js` headers() function. Includes:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security (HSTS)
- Content Security Policy for service workers

## Special Features

### Network Performance Optimization
`src/util/isNetworkFast.ts` checks Network Information API to conditionally load heavy assets based on connection speed.

### Easter Eggs
- `src/helpers/aaaahhhh.ts`: Fun image replacement logic triggered by avatar interactions
- `src/helpers/ascii.ts`: Console ASCII art

### Service Worker
- Lives in `public/sw.js` and served via `src/app/sw.js/`
- Registration in `src/components/ServiceWorkerRegister.tsx`
- Used for PWA offline support

## Firebase & Analytics
Initialize Firebase only client-side (see `src/configs/firebase.ts`):
```typescript
import { init, logAnalyticsEvent } from '@configs/firebase';
init();  // Call once on client mount
logAnalyticsEvent('event_name', { params });
```

## Documentation
Architecture docs in `docs/architecture/`:
- `index.md`: System overview
- Component-specific docs for Avatar, Projects, Publications, etc.

## Common Gotchas
1. **Don't** import from relative paths - use path aliases
2. **Don't** forget to update tests when changing components
3. **Always** run `npm run validate` frequently when making changes
